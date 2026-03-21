import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users, relays, webs, discoveries, playerProfiles,
  relayProgress, deardenNodes, nodeActivations, characters,
  xpTransactions, chatMessages, leaderboard, challengeInvites,
  agnContacts, contactTags, contactTagAssignments
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Relay Queries ───
export async function getAllRelays() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(relays).orderBy(relays.number);
}

export async function getRelayByNumber(num: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(relays).where(eq(relays.number, num)).limit(1);
  return result[0];
}

// ─── Web Queries ───
export async function getAllWebs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(webs);
}

// ─── Discovery Queries ───
export async function getDiscoveriesByRelay(relayId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(discoveries).where(eq(discoveries.relayId, relayId)).orderBy(discoveries.sortOrder);
}

// ─── Player Profile Queries ───
export async function getOrCreateProfile(userId: number | null, guestId: string | null, mode: "explorer" | "flight_deck" | "scholar") {
  const db = await getDb();
  if (!db) return null;
  const conditions = userId
    ? and(eq(playerProfiles.userId, userId), eq(playerProfiles.mode, mode))
    : guestId
      ? and(eq(playerProfiles.guestId, guestId), eq(playerProfiles.mode, mode))
      : null;
  if (!conditions) return null;
  const existing = await db.select().from(playerProfiles).where(conditions).limit(1);
  if (existing[0]) return existing[0];
  const [result] = await db.insert(playerProfiles).values({
    userId, guestId, mode, displayName: guestId ? `Explorer-${guestId.slice(0, 6)}` : null,
  }).$returningId();
  const newProfile = await db.select().from(playerProfiles).where(eq(playerProfiles.id, result.id)).limit(1);
  return newProfile[0] || null;
}

export async function updateProfileXp(profileId: number, xpToAdd: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(playerProfiles)
    .set({ totalXp: sql`totalXp + ${xpToAdd}`, bitPoints: sql`bitPoints + ${Math.floor(xpToAdd / 100)}` })
    .where(eq(playerProfiles.id, profileId));
}

// ─── Relay Progress ───
export async function getRelayProgressForProfile(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(relayProgress).where(eq(relayProgress.profileId, profileId));
}

export async function upsertRelayProgress(profileId: number, relayNumber: number, discoveredItems: number[], completionPct: number, xpEarned: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(relayProgress)
    .where(and(eq(relayProgress.profileId, profileId), eq(relayProgress.relayNumber, relayNumber))).limit(1);
  if (existing[0]) {
    await db.update(relayProgress).set({
      discoveredItems: JSON.stringify(discoveredItems), completionPct, xpEarned,
      completedAt: completionPct >= 100 ? new Date() : null,
    }).where(eq(relayProgress.id, existing[0].id));
  } else {
    await db.insert(relayProgress).values({
      profileId, relayNumber, discoveredItems: JSON.stringify(discoveredItems),
      completionPct, xpEarned, completedAt: completionPct >= 100 ? new Date() : null,
    });
  }
}

// ─── Dearden Field ───
export async function getDeardenNodes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(deardenNodes);
}

export async function getNodeActivationsForProfile(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(nodeActivations).where(eq(nodeActivations.profileId, profileId));
}

export async function activateNode(profileId: number, nodeId: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(nodeActivations)
    .where(and(eq(nodeActivations.profileId, profileId), eq(nodeActivations.nodeId, nodeId))).limit(1);
  if (existing[0]) return; // already activated
  await db.insert(nodeActivations).values({ profileId, nodeId, activated: true, activatedAt: new Date() });
}

// ─── Character Queries ───
export async function createCharacter(profileId: number, name: string, fitsType: "senser" | "intuitive" | "thinker" | "feeler" | "balanced", abilityScores: Record<string, number>) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(characters).values({
    profileId, name, fitsType, abilityScores: JSON.stringify(abilityScores),
  }).$returningId();
  const newChar = await db.select().from(characters).where(eq(characters.id, result.id)).limit(1);
  return newChar[0] || null;
}

export async function getCharacterByProfile(profileId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(characters).where(eq(characters.profileId, profileId)).limit(1);
  return result[0] || null;
}

export async function updateCharacterRolls(charId: number, rollsRemaining: number, abilityScores: Record<string, number>) {
  const db = await getDb();
  if (!db) return;
  await db.update(characters).set({ rollsRemaining, abilityScores: JSON.stringify(abilityScores) }).where(eq(characters.id, charId));
}

// ─── XP Transactions ───
export async function logXpTransaction(profileId: number, amount: number, source: string, sourceId?: string, description?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(xpTransactions).values({ profileId, amount, source, sourceId, description });
}

// ─── Chat Messages ───
export async function saveChatMessage(profileId: number | null, guestId: string | null, mode: "explorer" | "flight_deck" | "scholar", role: "user" | "assistant", content: string, relayContext?: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(chatMessages).values({ profileId, guestId, mode, role, content, relayContext });
}

export async function getChatHistory(profileId: number | null, guestId: string | null, mode: "explorer" | "flight_deck" | "scholar", limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const conditions = profileId
    ? and(eq(chatMessages.profileId, profileId), eq(chatMessages.mode, mode))
    : guestId
      ? and(eq(chatMessages.guestId, guestId), eq(chatMessages.mode, mode))
      : null;
  if (!conditions) return [];
  return db.select().from(chatMessages).where(conditions).orderBy(desc(chatMessages.createdAt)).limit(limit);
}

// ─── Leaderboard ───
export async function getLeaderboardEntries(mode?: "explorer" | "flight_deck" | "scholar", limit = 50) {
  const db = await getDb();
  if (!db) return [];
  if (mode) {
    return db.select().from(leaderboard).where(eq(leaderboard.mode, mode)).orderBy(desc(leaderboard.totalXp)).limit(limit);
  }
  return db.select().from(leaderboard).orderBy(desc(leaderboard.totalXp)).limit(limit);
}

// ─── Live Leaderboard from player_profiles ───
export async function getLiveLeaderboard(mode?: "explorer" | "flight_deck" | "scholar", limit = 50) {
  const db = await getDb();
  if (!db) return [];
  const conditions = mode ? eq(playerProfiles.mode, mode) : undefined;
  const profiles = conditions
    ? await db.select().from(playerProfiles).where(conditions).orderBy(desc(playerProfiles.totalXp)).limit(limit)
    : await db.select().from(playerProfiles).orderBy(desc(playerProfiles.totalXp)).limit(limit);

  // For each profile, count completed relays
  const results = await Promise.all(profiles.map(async (p) => {
    const progress = await db.select().from(relayProgress)
      .where(and(eq(relayProgress.profileId, p.id), sql`completionPct >= 100`));
    return {
      id: p.id,
      displayName: p.displayName || `Player-${p.id}`,
      mode: p.mode,
      totalXp: p.totalXp ?? 0,
      bitPoints: p.bitPoints ?? 0,
      relaysCompleted: progress.length,
      isGuru: p.isGuru ?? false,
    };
  }));
  return results;
}

// ─── Challenge Invites ───
export async function createChallengeInvite(
  senderProfileId: number,
  senderName: string,
  senderArchetype: string,
  senderXp: number,
  senderRelays: number,
  message?: string
) {
  const db = await getDb();
  if (!db) return null;
  // Generate a short unique code
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  const [result] = await db.insert(challengeInvites).values({
    code, senderProfileId, senderName, senderArchetype, senderXp, senderRelays, message,
  }).$returningId();
  return { id: result.id, code };
}

export async function getChallengeByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(challengeInvites).where(eq(challengeInvites.code, code.toUpperCase())).limit(1);
  return result[0] || null;
}

export async function acceptChallenge(code: string, acceptorProfileId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(challengeInvites)
    .set({ acceptedBy: acceptorProfileId, acceptedAt: new Date() })
    .where(eq(challengeInvites.code, code.toUpperCase()));
}

export async function upsertLeaderboard(profileId: number, displayName: string, mode: "explorer" | "flight_deck" | "scholar", totalXp: number, relaysCompleted: number, isGuru: boolean) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(leaderboard).where(eq(leaderboard.profileId, profileId)).limit(1);
  if (existing[0]) {
    await db.update(leaderboard).set({ displayName, totalXp, relaysCompleted, isGuru }).where(eq(leaderboard.id, existing[0].id));
  } else {
    await db.insert(leaderboard).values({ profileId, displayName, mode, totalXp, relaysCompleted, isGuru });
  }
}

// ─── Journey Timeline ───
export async function getJourneyTimeline(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  // Fetch XP transactions as timeline events
  const txns = await db.select().from(xpTransactions)
    .where(eq(xpTransactions.profileId, profileId))
    .orderBy(desc(xpTransactions.createdAt))
    .limit(200);
  return txns;
}

// ─── AGN Network Contacts ───
export async function getAgnContacts(opts: { search?: string; page?: number; limit?: number; hasNameOnly?: boolean; contactIds?: number[] }) {
  const db = await getDb();
  if (!db) return { contacts: [], total: 0 };
  const page = opts.page ?? 1;
  const limit = opts.limit ?? 50;
  const offset = (page - 1) * limit;

  let conditions: any[] = [];
  if (opts.search) {
    const term = `%${opts.search}%`;
    conditions.push(sql`(name LIKE ${term} OR phone LIKE ${term} OR displayName LIKE ${term})`);
  }
  if (opts.hasNameOnly) {
    conditions.push(sql`name != ''`);
  }
  if (opts.contactIds && opts.contactIds.length > 0) {
    conditions.push(sql`id IN (${sql.join(opts.contactIds.map(id => sql`${id}`), sql`, `)})`);
  }

  const where = conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined;

  const countResult = where
    ? await db.select({ count: sql<number>`COUNT(*)` }).from(agnContacts).where(where)
    : await db.select({ count: sql<number>`COUNT(*)` }).from(agnContacts);
  const total = Number(countResult[0]?.count ?? 0);

  const contacts = where
    ? await db.select().from(agnContacts).where(where).orderBy(desc(agnContacts.messageCount), agnContacts.name).limit(limit).offset(offset)
    : await db.select().from(agnContacts).orderBy(desc(agnContacts.messageCount), agnContacts.name).limit(limit).offset(offset);

  return { contacts, total };
}

export async function getAgnContactStats() {
  const db = await getDb();
  if (!db) return { total: 0, named: 0, phoneOnly: 0, hasPlayed: 0 };
  const result = await db.select({
    total: sql<number>`COUNT(*)`,
    named: sql<number>`SUM(CASE WHEN name != '' THEN 1 ELSE 0 END)`,
    phoneOnly: sql<number>`SUM(CASE WHEN name = '' THEN 1 ELSE 0 END)`,
    hasPlayed: sql<number>`SUM(CASE WHEN hasPlayed = true THEN 1 ELSE 0 END)`,
  }).from(agnContacts);
  return {
    total: Number(result[0]?.total ?? 0),
    named: Number(result[0]?.named ?? 0),
    phoneOnly: Number(result[0]?.phoneOnly ?? 0),
    hasPlayed: Number(result[0]?.hasPlayed ?? 0),
  };
}

export async function updateAgnContactNotes(id: number, notes: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(agnContacts).set({ notes }).where(eq(agnContacts.id, id));
}

export async function markAgnContactPlayed(id: number, profileId: number | null) {
  const db = await getDb();
  if (!db) return;
  await db.update(agnContacts).set({ hasPlayed: true, linkedProfileId: profileId }).where(eq(agnContacts.id, id));
}

// ─── Contact Tags ───
export async function getAllContactTags() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactTags).orderBy(contactTags.name);
}

export async function createContactTag(name: string, color: string, description?: string) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(contactTags).values({ name, color, description }).$returningId();
  const tag = await db.select().from(contactTags).where(eq(contactTags.id, result.id)).limit(1);
  return tag[0] || null;
}

export async function updateContactTag(id: number, data: { name?: string; color?: string; description?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.update(contactTags).set(data).where(eq(contactTags.id, id));
}

export async function deleteContactTag(id: number) {
  const db = await getDb();
  if (!db) return;
  // Remove all assignments first
  await db.delete(contactTagAssignments).where(eq(contactTagAssignments.tagId, id));
  await db.delete(contactTags).where(eq(contactTags.id, id));
}

export async function getTagsForContact(contactId: number) {
  const db = await getDb();
  if (!db) return [];
  const assignments = await db.select({
    tagId: contactTagAssignments.tagId,
    tagName: contactTags.name,
    tagColor: contactTags.color,
  })
    .from(contactTagAssignments)
    .innerJoin(contactTags, eq(contactTagAssignments.tagId, contactTags.id))
    .where(eq(contactTagAssignments.contactId, contactId));
  return assignments;
}

export async function getTagsForContacts(contactIds: number[]) {
  const db = await getDb();
  if (!db || contactIds.length === 0) return new Map<number, { tagId: number; tagName: string | null; tagColor: string | null }[]>();
  const assignments = await db.select({
    contactId: contactTagAssignments.contactId,
    tagId: contactTagAssignments.tagId,
    tagName: contactTags.name,
    tagColor: contactTags.color,
  })
    .from(contactTagAssignments)
    .innerJoin(contactTags, eq(contactTagAssignments.tagId, contactTags.id))
    .where(sql`${contactTagAssignments.contactId} IN (${sql.join(contactIds.map(id => sql`${id}`), sql`, `)})`);
  const map = new Map<number, { tagId: number; tagName: string | null; tagColor: string | null }[]>();
  for (const a of assignments) {
    if (!map.has(a.contactId)) map.set(a.contactId, []);
    map.get(a.contactId)!.push({ tagId: a.tagId, tagName: a.tagName, tagColor: a.tagColor });
  }
  return map;
}

export async function assignTagToContact(contactId: number, tagId: number) {
  const db = await getDb();
  if (!db) return;
  // Check if already assigned
  const existing = await db.select().from(contactTagAssignments)
    .where(and(eq(contactTagAssignments.contactId, contactId), eq(contactTagAssignments.tagId, tagId))).limit(1);
  if (existing[0]) return; // already assigned
  await db.insert(contactTagAssignments).values({ contactId, tagId });
}

export async function removeTagFromContact(contactId: number, tagId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(contactTagAssignments)
    .where(and(eq(contactTagAssignments.contactId, contactId), eq(contactTagAssignments.tagId, tagId)));
}

export async function getContactsByTag(tagId: number) {
  const db = await getDb();
  if (!db) return [];
  const assignments = await db.select({ contactId: contactTagAssignments.contactId })
    .from(contactTagAssignments)
    .where(eq(contactTagAssignments.tagId, tagId));
  return assignments.map(a => a.contactId);
}

// ─── Auto-Link AGN Contacts to Player Profiles ───
export async function autoLinkContactToProfile(profileId: number, displayName: string) {
  const db = await getDb();
  if (!db) return null;
  // Try to match by name (case-insensitive fuzzy match)
  const term = `%${displayName}%`;
  const matches = await db.select().from(agnContacts)
    .where(and(
      sql`(name LIKE ${term} OR displayName LIKE ${term})`,
      sql`linkedProfileId IS NULL`
    ))
    .limit(5);
  if (matches.length === 0) return null;
  // Find best match (exact name match preferred)
  const exactMatch = matches.find(m =>
    m.name?.toLowerCase() === displayName.toLowerCase() ||
    m.displayName?.toLowerCase() === displayName.toLowerCase()
  );
  const match = exactMatch || matches[0];
  // Link the contact
  await db.update(agnContacts).set({
    hasPlayed: true,
    linkedProfileId: profileId,
  }).where(eq(agnContacts.id, match.id));
  return match;
}

export async function getLinkedProfileStats(contactId: number) {
  const db = await getDb();
  if (!db) return null;
  const contact = await db.select().from(agnContacts).where(eq(agnContacts.id, contactId)).limit(1);
  if (!contact[0]?.linkedProfileId) return null;
  const profile = await db.select().from(playerProfiles).where(eq(playerProfiles.id, contact[0].linkedProfileId)).limit(1);
  if (!profile[0]) return null;
  return {
    profileId: profile[0].id,
    displayName: profile[0].displayName,
    mode: profile[0].mode,
    totalXp: profile[0].totalXp ?? 0,
    lastActive: profile[0].updatedAt,
  };
}
