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
        return db.getOrCreateProfile(userId, guestId, input.mode);
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
});

export type AppRouter = typeof appRouter;
