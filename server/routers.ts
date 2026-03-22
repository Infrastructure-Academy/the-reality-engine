import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Relay Procedures ───
  relays: router({
    list: publicProcedure.query(async () => {
      return db.getAllRelays();
    }),
    getByNumber: publicProcedure.input(z.object({ number: z.number() })).query(async ({ input }) => {
      return db.getRelayByNumber(input.number);
    }),
  }),

  // ─── Web Procedures ───
  webs: router({
    list: publicProcedure.query(async () => {
      return db.getAllWebs();
    }),
  }),

  // ─── Discovery Procedures ───
  discoveries: router({
    byRelay: publicProcedure.input(z.object({ relayId: z.number() })).query(async ({ input }) => {
      return db.getDiscoveriesByRelay(input.relayId);
    }),
  }),

  // ─── Player Profile Procedures ───
  profile: router({
    getOrCreate: publicProcedure
      .input(z.object({
        guestId: z.string().optional(),
        mode: z.enum(["explorer", "flight_deck", "scholar"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user?.id ?? null;
        const guestId = input.guestId ?? null;
        const profile = await db.getOrCreateProfile(userId, guestId, input.mode);
        // Auto-link to AGN contact if user has a name
        if (profile && ctx.user?.name) {
          try {
            await db.autoLinkContactToProfile(profile.id, ctx.user.name);
          } catch { /* ignore link failures */ }
        }
        return profile;
      }),
    addXp: publicProcedure
      .input(z.object({ profileId: z.number(), amount: z.number(), source: z.string(), sourceId: z.string().optional(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        await db.updateProfileXp(input.profileId, input.amount);
        await db.logXpTransaction(input.profileId, input.amount, input.source, input.sourceId, input.description);
        return { success: true };
      }),
  }),

  // ─── Relay Progress ───
  progress: router({
    getForProfile: publicProcedure.input(z.object({ profileId: z.number() })).query(async ({ input }) => {
      return db.getRelayProgressForProfile(input.profileId);
    }),
    upsert: publicProcedure
      .input(z.object({
        profileId: z.number(), relayNumber: z.number(),
        discoveredItems: z.array(z.number()), completionPct: z.number(), xpEarned: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.upsertRelayProgress(input.profileId, input.relayNumber, input.discoveredItems, input.completionPct, input.xpEarned);
        return { success: true };
      }),
  }),

  // ─── Dearden Field ───
  dearden: router({
    nodes: publicProcedure.query(async () => {
      return db.getDeardenNodes();
    }),
    activations: publicProcedure.input(z.object({ profileId: z.number() })).query(async ({ input }) => {
      return db.getNodeActivationsForProfile(input.profileId);
    }),
    activate: publicProcedure
      .input(z.object({
        profileId: z.number(),
        nodeId: z.number(),
        relayNumber: z.number(),
        webName: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.activateNode(input.profileId, input.nodeId);
        // Award 50,000 XP per node activation
        await db.updateProfileXp(input.profileId, 50000);
        await db.logXpTransaction(input.profileId, 50000, "node_activation", `node-${input.relayNumber}-${input.webName}`, `Activated node R${input.relayNumber}-${input.webName}`);
        return { success: true };
      }),
  }),

  // ─── Character Procedures ───
  character: router({
    create: publicProcedure
      .input(z.object({
        profileId: z.number(), name: z.string(),
        fitsType: z.enum(["senser", "intuitive", "thinker", "feeler", "balanced"]),
        abilityScores: z.record(z.string(), z.number()),
      }))
      .mutation(async ({ input }) => {
        return db.createCharacter(input.profileId, input.name, input.fitsType, input.abilityScores as Record<string, number>);
      }),
    getByProfile: publicProcedure.input(z.object({ profileId: z.number() })).query(async ({ input }) => {
      return db.getCharacterByProfile(input.profileId);
    }),
    reroll: publicProcedure
      .input(z.object({ characterId: z.number(), rollsRemaining: z.number(), abilityScores: z.record(z.string(), z.number()) }))
      .mutation(async ({ input }) => {
        await db.updateCharacterRolls(input.characterId, input.rollsRemaining, input.abilityScores as Record<string, number>);
        return { success: true };
      }),
  }),

  // ─── DAVID AI Chat ───
  david: router({
    chat: publicProcedure
      .input(z.object({
        profileId: z.number().nullable(),
        guestId: z.string().nullable(),
        mode: z.enum(["explorer", "flight_deck", "scholar"]),
        message: z.string(),
        relayContext: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { profileId, guestId, mode, message, relayContext } = input;
        await db.saveChatMessage(profileId, guestId, mode, "user", message, relayContext);

        // ─── Build personalized player context ───
        let playerContext = "";
        if (profileId) {
          try {
            // Fetch relay progress
            const progress = await db.getRelayProgressForProfile(profileId);
            const completedRelays = progress.filter(p => (p.completionPct ?? 0) >= 100);
            const exploredRelays = progress.filter(p => (p.completionPct ?? 0) > 0);
            const totalXp = progress.reduce((sum, p) => sum + (p.xpEarned ?? 0), 0);

            // Relay names mapping
            const relayNames: Record<number, string> = { 1: "Fire", 2: "Tree", 3: "River", 4: "Horse", 5: "Roads", 6: "Ships", 7: "Loom", 8: "Rail", 9: "Engine", 10: "AAA Triad", 11: "Orbit", 12: "Human Nodes" };

            if (exploredRelays.length > 0) {
              const exploredNames = exploredRelays.map(r => relayNames[r.relayNumber] || `Relay ${r.relayNumber}`).join(", ");
              const completedNames = completedRelays.map(r => relayNames[r.relayNumber] || `Relay ${r.relayNumber}`).join(", ");
              playerContext += `\n\n[PLAYER JOURNEY CONTEXT]\n`;
              playerContext += `- Relays explored (${exploredRelays.length}/12): ${exploredNames}\n`;
              if (completedRelays.length > 0) playerContext += `- Relays completed: ${completedNames}\n`;
              playerContext += `- Total XP earned: ${totalXp.toLocaleString()}\n`;

              // Perspective distribution
              const perspectives: Record<string, number> = { west: 0, east: 0, nomadic: 0 };
              const relayPerspectives: Record<number, string> = { 1: "nomadic", 2: "east", 3: "east", 4: "nomadic", 5: "west", 6: "nomadic", 7: "east", 8: "west", 9: "west", 10: "west", 11: "nomadic", 12: "nomadic" };
              for (const p of exploredRelays) {
                const persp = relayPerspectives[p.relayNumber];
                if (persp) perspectives[persp] += (p.completionPct ?? 0);
              }
              const total = Object.values(perspectives).reduce((a, b) => a + b, 0) || 1;
              playerContext += `- Civilisational lean: West ${Math.round(perspectives.west / total * 100)}%, East ${Math.round(perspectives.east / total * 100)}%, Nomadic ${Math.round(perspectives.nomadic / total * 100)}%\n`;
            }

            // Fetch node activations for flight_deck
            if (mode === "flight_deck") {
              const activations = await db.getNodeActivationsForProfile(profileId);
              if (activations.length > 0) {
                playerContext += `- Dearden Field nodes activated: ${activations.length}/60\n`;
              }
            }

            // Fetch character for scholar mode
            if (mode === "scholar") {
              const character = await db.getCharacterByProfile(profileId);
              if (character) {
                playerContext += `- Scholar name: ${character.name}\n`;
                playerContext += `- FITS type: ${character.fitsType}\n`;
                playerContext += `- Level: ${character.level}\n`;
                if (character.thesisTitle) playerContext += `- Thesis: ${character.thesisTitle}\n`;
                if (character.abilityScores) {
                  const scores = typeof character.abilityScores === "string" ? JSON.parse(character.abilityScores) : character.abilityScores;
                  playerContext += `- Ability scores: ${Object.entries(scores).map(([k, v]) => `${k}: ${v}`).join(", ")}\n`;
                }
              }
            }

            playerContext += `\nReference the player's journey naturally when relevant. If they've explored specific relays, connect your guidance to what they've already discovered. Acknowledge their progress and encourage deeper exploration of areas they haven't visited.`;
          } catch (e) {
            console.warn("[DAVID] Failed to fetch player context:", e);
          }
        }

        const systemPrompts: Record<string, string> = {
          explorer: `You are DAVID — Digital Augmented Visual Intelligence Display. You are the narrator for young explorers (ages 8-14) discovering the 12 Civilisational Relays of infrastructure history. Speak in short, exciting sentences. Use vivid imagery. Keep responses under 100 words. Be encouraging and make learning feel like an adventure. If a relay number is provided, focus your response on that relay's content. Never break character.`,
          flight_deck: `You are DAVID — Digital Augmented Visual Intelligence Display. You are the co-pilot aboard the MPNC Fleet, guiding cadets (ages 14-18) through the Dearden Field — a 60-node matrix mapping 12 Civilisational Relays across 5 Great Webs. Speak in professional, military-style briefings. Reference craft systems, node coordinates, and mission objectives. Keep responses under 150 words. Use infrastructure engineering terminology naturally. Never break character.`,
          scholar: `You are DAVID — Digital Augmented Visual Intelligence Display, operating as Dungeon Master for the Infrastructure Odyssey. You guide scholars (ages 18+) through a thesis-level exploration of civilisational infrastructure. Reference the FITS temperament system, ability scores, and academic frameworks. Provide Socratic questioning, challenge assumptions, and guide thesis development. Keep responses under 200 words. Maintain the gravitas of an academic mentor crossed with a strategic advisor. Draw from historical analogies (Aristotle-Alexander, Sun Tzu, Sima Qian). Never break character.`,
        };

        const history = await db.getChatHistory(profileId, guestId, mode, 10);
        const messages = [
          { role: "system" as const, content: (systemPrompts[mode] || systemPrompts.explorer) + playerContext },
          ...history.reverse().map(m => ({ role: m.role as "user" | "assistant", content: m.content || "" })),
          { role: "user" as const, content: relayContext ? `[Relay ${relayContext} context] ${message}` : message },
        ];

        try {
          const response = await invokeLLM({ messages });
          const rawContent = response.choices?.[0]?.message?.content;
          const reply = (typeof rawContent === 'string' ? rawContent : '') || "DAVID systems temporarily offline. Stand by.";
          await db.saveChatMessage(profileId, guestId, mode, "assistant", reply, relayContext);
          return { reply };
        } catch {
          const fallback = "DAVID systems experiencing interference. Please try again.";
          await db.saveChatMessage(profileId, guestId, mode, "assistant", fallback, relayContext);
          return { reply: fallback };
        }
      }),
    history: publicProcedure
      .input(z.object({
        profileId: z.number().nullable(), guestId: z.string().nullable(),
        mode: z.enum(["explorer", "flight_deck", "scholar"]),
      }))
      .query(async ({ input }) => {
        return db.getChatHistory(input.profileId, input.guestId, input.mode);
      }),
  }),

  // ─── DAVID Dungeon Master (Dungeon Crawl Mode B) ───
  dungeonDM: router({
    narrate: publicProcedure
      .input(z.object({
        relayNumber: z.number().min(1).max(12),
        roomType: z.string(),
        roomName: z.string(),
        abilityCheck: z.string().nullable(),
        checkResult: z.object({ success: z.boolean(), roll: z.number() }).nullable(),
        inventionName: z.string().nullable(),
        inventionDescription: z.string().nullable(),
        playerAbilities: z.object({ observation: z.number(), intuition: z.number(), resilience: z.number() }),
        roomsCleared: z.number(),
        totalRooms: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { relayNumber, roomType, roomName, abilityCheck, checkResult, inventionName, inventionDescription, playerAbilities, roomsCleared, totalRooms } = input;
        const relay = [
          "Fire — The Eternal Constant (pre-10,000 BCE)",
          "Tree — The Living Foundation (10,000–5,000 BCE)",
          "River — Cradles of Continuity (5,000–3,000 BCE)",
          "Horse — The Velocity of Intent (3,000–1,000 BCE)",
          "Roads — Arteries of Intent (1,000 BCE–500 CE)",
          "Ships — The Master Weaver's Reach (500–1500 CE)",
          "Loom — The Binary Birth (1500–1760 CE)",
          "Rail — Standardizing the Continental Rhythm (1760–1870 CE)",
          "Engine — The Internal Revolution (1870–1914 CE)",
          "AAA Triad — The Triple Convergence (1914–1969 CE)",
          "Orbit — The Programmable Frontier (1969–2025 CE)",
          "Human Nodes — The Torus Metaphor (2025+ CE)",
        ][relayNumber - 1];

        let situationContext = `The explorer is in Room "${roomName}" (${roomType} type) of the ${relay} dungeon. Progress: ${roomsCleared}/${totalRooms} rooms cleared.`;
        situationContext += `\nExplorer abilities: Observation ${playerAbilities.observation}, Intuition ${playerAbilities.intuition}, Resilience ${playerAbilities.resilience}.`;

        if (abilityCheck && checkResult) {
          situationContext += `\nAbility check on ${abilityCheck}: rolled ${checkResult.roll}, ${checkResult.success ? "PASSED" : "FAILED (but still advances — no loss state)"}. `;
          situationContext += checkResult.success ? "Celebrate their success dramatically." : "Encourage them — they still earned half XP and moved forward.";
        }

        if (inventionName && inventionDescription) {
          situationContext += `\nDiscovery unlocked: ${inventionName} — ${inventionDescription}. Weave this discovery into your narration naturally.`;
        }

        const messages = [
          {
            role: "system" as const,
            content: `You are DAVID — Digital Augmented Visual Intelligence Display — acting as Dungeon Master for young explorers (ages 8-14) in The Reality Engine's Dungeon Crawl mode. You narrate each room of the 12 Civilisational Relay dungeons.\n\nRules:\n- Speak in vivid, exciting, age-appropriate language\n- Keep responses to 2-3 short paragraphs (under 80 words total)\n- Reference the relay's historical era and theme naturally\n- Make ability checks feel dramatic (describe the dice roll moment)\n- When discoveries are unlocked, explain the real historical invention in an exciting way\n- Use second person ("You see...", "You discover...")\n- Never break character\n- Never use violent or scary imagery — this is adventure, not horror\n- End with a hook that makes them want to explore the next room`,
          },
          { role: "user" as const, content: situationContext },
        ];

        try {
          const response = await invokeLLM({ messages });
          const rawContent = response.choices?.[0]?.message?.content;
          const narration = (typeof rawContent === 'string' ? rawContent : '') || "DAVID adjusts his instruments... 'The signal is unclear. Press forward, explorer.'";
          return { narration };
        } catch {
          return { narration: "DAVID's voice crackles through static: 'Interference detected. But the path ahead is clear — keep exploring, adventurer.'" };
        }
      }),
  }),

  // ─── Leaderboard ───
  leaderboard: router({
    list: publicProcedure
      .input(z.object({ mode: z.enum(["explorer", "flight_deck", "scholar"]).optional() }).optional())
      .query(async ({ input }) => {
        return db.getLeaderboardEntries(input?.mode);
      }),
    live: publicProcedure
      .input(z.object({ mode: z.enum(["explorer", "flight_deck", "scholar"]).optional() }).optional())
      .query(async ({ input }) => {
        return db.getLiveLeaderboard(input?.mode);
      }),
   }),

  // ─── Challenge Invites ───
  challenge: router({
    create: publicProcedure
      .input(z.object({
        profileId: z.number(),
        senderName: z.string(),
        senderArchetype: z.string(),
        senderXp: z.number(),
        senderRelays: z.number(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createChallengeInvite(
          input.profileId, input.senderName, input.senderArchetype,
          input.senderXp, input.senderRelays, input.message
        );
        return result;
      }),
    getByCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        return db.getChallengeByCode(input.code);
      }),
    accept: publicProcedure
      .input(z.object({ code: z.string(), acceptorProfileId: z.number() }))
      .mutation(async ({ input }) => {
        await db.acceptChallenge(input.code, input.acceptorProfileId);
        return { success: true };
      }),
  }),

  // ─── Journey Timeline ───
  journey: router({
    timeline: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return db.getJourneyTimeline(input.profileId);
      }),
  }),

  // ─── AGN Network Contacts (admin only) ───
  agn: router({
    contacts: protectedProcedure
      .input(z.object({
        search: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(50),
        hasNameOnly: z.boolean().optional(),
        tagId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        let result;
        if (input.tagId) {
          // Filter by tag first, then apply other filters
          const contactIds = await db.getContactsByTag(input.tagId);
          if (contactIds.length === 0) return { contacts: [], total: 0, tags: new Map() };
          // Get contacts with tag filter applied at DB level
          result = await db.getAgnContacts({ ...input, contactIds });
        } else {
          result = await db.getAgnContacts(input);
        }
        // Enrich with tags
        const ids = result.contacts.map((c: any) => c.id);
        const tagsMap = await db.getTagsForContacts(ids);
        const enriched = result.contacts.map((c: any) => ({
          ...c,
          tags: tagsMap.get(c.id) || [],
        }));
        return { contacts: enriched, total: result.total };
      }),
    stats: protectedProcedure.query(async () => {
      return db.getAgnContactStats();
    }),
    updateNotes: protectedProcedure
      .input(z.object({ id: z.number(), notes: z.string() }))
      .mutation(async ({ input }) => {
        await db.updateAgnContactNotes(input.id, input.notes);
        return { success: true };
      }),
    markPlayed: protectedProcedure
      .input(z.object({ id: z.number(), profileId: z.number().nullable() }))
      .mutation(async ({ input }) => {
        await db.markAgnContactPlayed(input.id, input.profileId);
        return { success: true };
      }),

    // ─── Tag Management ───
    tags: protectedProcedure.query(async () => {
      return db.getAllContactTags();
    }),
    createTag: protectedProcedure
      .input(z.object({ name: z.string().min(1), color: z.string().default("#6b7280"), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        return db.createContactTag(input.name, input.color, input.description);
      }),
    updateTag: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), color: z.string().optional(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateContactTag(id, data);
        return { success: true };
      }),
    deleteTag: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteContactTag(input.id);
        return { success: true };
      }),
    assignTag: protectedProcedure
      .input(z.object({ contactId: z.number(), tagId: z.number() }))
      .mutation(async ({ input }) => {
        await db.assignTagToContact(input.contactId, input.tagId);
        return { success: true };
      }),
    removeTag: protectedProcedure
      .input(z.object({ contactId: z.number(), tagId: z.number() }))
      .mutation(async ({ input }) => {
        await db.removeTagFromContact(input.contactId, input.tagId);
        return { success: true };
      }),
    bulkAssignTag: protectedProcedure
      .input(z.object({ contactIds: z.array(z.number()), tagId: z.number() }))
      .mutation(async ({ input }) => {
        for (const contactId of input.contactIds) {
          await db.assignTagToContact(contactId, input.tagId);
        }
        return { success: true, count: input.contactIds.length };
      }),
    contactTags: protectedProcedure
      .input(z.object({ contactId: z.number() }))
      .query(async ({ input }) => {
        return db.getTagsForContact(input.contactId);
      }),
    linkedProfile: protectedProcedure
      .input(z.object({ contactId: z.number() }))
      .query(async ({ input }) => {
        return db.getLinkedProfileStats(input.contactId);
      }),
  }),

  // ─── Media Catalogue ───
  media: router({
    list: publicProcedure
      .input(z.object({
        bridge: z.string().optional(),
        category: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getMediaCatalogue(input);
      }),
    stats: publicProcedure.query(async () => {
      return db.getMediaCatalogueStats();
    }),
  }),

  // ─── Bridge Status ───
  bridge: router({
    status: publicProcedure.query(async () => {
      return db.getBridgeStatus();
    }),
    playerStats: publicProcedure
      .input(z.object({ profileId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        if (!input?.profileId) {
          const leaders = await db.getLiveLeaderboard(undefined, 10);
          return { type: "leaderboard" as const, data: leaders };
        }
        const progress = await db.getRelayProgressForProfile(input.profileId);
        return { type: "profile" as const, data: progress };
      }),
    registry: publicProcedure.query(async () => {
      return [
        { name: "ACAD SITE", subtitle: "Infrastructure Academy", domain: "infra-acad-kuqzaex2.manus.space", dbAccess: "MASTER", status: "operational" },
        { name: "MEMORIAL SITE", subtitle: "Principia Tectonica", domain: "nigelmemorial-ucmtq9dn.manus.space", dbAccess: "CONNECTED", status: "operational" },
        { name: "TRE GAME", subtitle: "The Reality Engine", domain: "realityeng-epdhlkrn.manus.space", dbAccess: "SHARED", status: "operational" },
        { name: "CHART ROOM", subtitle: "The Chartered Chart", domain: "xgrowthtrk-2a93yo5z.manus.space", dbAccess: "API BRIDGE", status: "operational" },
      ];
    }),
    syncMemorial: protectedProcedure.mutation(async () => {
      return db.syncMemorialSite();
    }),
    syncChartRoom: protectedProcedure.mutation(async () => {
      return db.syncChartRoom();
    }),
    syncAll: protectedProcedure.mutation(async () => {
      const [memorial, chartRoom] = await Promise.allSettled([
        db.syncMemorialSite(),
        db.syncChartRoom(),
      ]);
      return {
        memorial: memorial.status === "fulfilled" ? memorial.value : { status: "error", error: (memorial as PromiseRejectedResult).reason?.message },
        chartRoom: chartRoom.status === "fulfilled" ? chartRoom.value : { status: "error", error: (chartRoom as PromiseRejectedResult).reason?.message },
      };
    }),
    syncHistory: publicProcedure
      .input(z.object({ bridge: z.string().optional(), limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getSyncHistory(input?.bridge, input?.limit);
      }),
  }),
});
export type AppRouter = typeof appRouter;
