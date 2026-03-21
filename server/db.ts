import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users, relays, webs, discoveries, playerProfiles,
  relayProgress, deardenNodes, nodeActivations, characters,
  xpTransactions, chatMessages, leaderboard, challengeInvites
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
