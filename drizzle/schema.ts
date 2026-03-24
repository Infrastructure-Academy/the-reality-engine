import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean, bigint } from "drizzle-orm/mysql-core";

// ─── Core User Table (from template) ───
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── 12 Civilisational Relays ───
export const relays = mysqlTable("relays", {
  id: int("id").autoincrement().primaryKey(),
  number: int("number").notNull().unique(),
  name: varchar("name", { length: 64 }).notNull(),
  subtitle: varchar("subtitle", { length: 128 }),
  emoji: varchar("emoji", { length: 8 }),
  era: varchar("era", { length: 64 }),
  quote: text("quote"),
  quoteAuthor: varchar("quoteAuthor", { length: 128 }),
  narrative: text("narrative"),
  missionObjective: text("missionObjective"),
  sagePath: text("sagePath"),
  builderPath: text("builderPath"),
  webType: varchar("webType", { length: 32 }),
  energy: varchar("energy", { length: 64 }),
  tier: varchar("tier", { length: 32 }).default("student"),
  xpReward: bigint("xpReward", { mode: "number" }).default(0),
  inventionCount: int("inventionCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Relay = typeof relays.$inferSelect;

// ─── 5 Great Webs ───
export const webs = mysqlTable("webs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 16 }),
  icon: varchar("icon", { length: 8 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Web = typeof webs.$inferSelect;

// ─── Relay Inventions / Discoveries ───
export const discoveries = mysqlTable("discoveries", {
  id: int("id").autoincrement().primaryKey(),
  relayId: int("relayId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  xpValue: bigint("xpValue", { mode: "number" }).default(10000),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Discovery = typeof discoveries.$inferSelect;

// ─── Player Profiles (game-specific) ───
export const playerProfiles = mysqlTable("player_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  guestId: varchar("guestId", { length: 64 }),
  mode: mysqlEnum("mode", ["explorer", "flight_deck", "scholar"]).notNull(),
  displayName: varchar("displayName", { length: 128 }),
  fitsType: mysqlEnum("fitsType", ["senser", "intuitive", "thinker", "feeler", "balanced"]),
  craftId: varchar("craftId", { length: 32 }),
  totalXp: bigint("totalXp", { mode: "number" }).default(0),
  bitPoints: bigint("bitPoints", { mode: "number" }).default(0),
  isGuru: boolean("isGuru").default(false),
  currentRelay: int("currentRelay").default(1),
  characterData: json("characterData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlayerProfile = typeof playerProfiles.$inferSelect;

// ─── Relay Progress (per player per relay) ───
export const relayProgress = mysqlTable("relay_progress", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  relayNumber: int("relayNumber").notNull(),
  discoveredItems: json("discoveredItems"),
  completionPct: int("completionPct").default(0),
  xpEarned: bigint("xpEarned", { mode: "number" }).default(0),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RelayProgress = typeof relayProgress.$inferSelect;

// ─── Dearden Field Nodes (60-node matrix: 12 relays × 5 webs) ───
export const deardenNodes = mysqlTable("dearden_nodes", {
  id: int("id").autoincrement().primaryKey(),
  relayNumber: int("relayNumber").notNull(),
  webName: varchar("webName", { length: 64 }).notNull(),
  label: varchar("label", { length: 128 }),
  description: text("description"),
  xpValue: bigint("xpValue", { mode: "number" }).default(50000),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DeardenNode = typeof deardenNodes.$inferSelect;

// ─── Dearden Node Activation (per player) ───
export const nodeActivations = mysqlTable("node_activations", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  nodeId: int("nodeId").notNull(),
  activated: boolean("activated").default(false),
  activatedAt: timestamp("activatedAt"),
});

export type NodeActivation = typeof nodeActivations.$inferSelect;

// ─── Scholar Characters ───
export const characters = mysqlTable("characters", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  fitsType: mysqlEnum("fitsType", ["senser", "intuitive", "thinker", "feeler", "balanced"]).notNull(),
  abilityScores: json("abilityScores"),
  rollsRemaining: int("rollsRemaining").default(3),
  level: int("level").default(1),
  thesisTitle: varchar("thesisTitle", { length: 256 }),
  thesisProgress: int("thesisProgress").default(0),
  academicGrade: varchar("academicGrade", { length: 16 }),
  perspectivePattern: json("perspectivePattern"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Character = typeof characters.$inferSelect;

// ─── XP Transactions Ledger ───
export const xpTransactions = mysqlTable("xp_transactions", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  source: varchar("source", { length: 64 }).notNull(),
  sourceId: varchar("sourceId", { length: 64 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type XpTransaction = typeof xpTransactions.$inferSelect;

// ─── DAVID AI Chat History ───
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId"),
  guestId: varchar("guestId", { length: 64 }),
  mode: mysqlEnum("mode", ["explorer", "flight_deck", "scholar"]).notNull(),
  role: mysqlEnum("chatRole", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  relayContext: int("relayContext"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;

// ─── Leaderboard (materialized view approach) ───
export const leaderboard = mysqlTable("leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  displayName: varchar("displayName", { length: 128 }),
  mode: mysqlEnum("mode", ["explorer", "flight_deck", "scholar"]).notNull(),
  totalXp: bigint("totalXp", { mode: "number" }).default(0),
  relaysCompleted: int("relaysCompleted").default(0),
  isGuru: boolean("isGuru").default(false),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LeaderboardEntry = typeof leaderboard.$inferSelect;

// ─── Challenge Invites ───
export const challengeInvites = mysqlTable("challenge_invites", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 16 }).notNull().unique(),
  senderProfileId: int("senderProfileId").notNull(),
  senderName: varchar("senderName", { length: 128 }),
  senderArchetype: varchar("senderArchetype", { length: 128 }),
  senderXp: bigint("senderXp", { mode: "number" }).default(0),
  senderRelays: int("senderRelays").default(0),
  message: text("message"),
  acceptedBy: int("acceptedBy"),
  acceptedAt: timestamp("acceptedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChallengeInvite = typeof challengeInvites.$inferSelect;

// ─── AGN Network Contacts (WhatsApp group members) ───
export const agnContacts = mysqlTable("agn_contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }),
  phone: varchar("phone", { length: 32 }),
  displayName: varchar("displayName", { length: 256 }),
  messageCount: int("messageCount").default(0),
  firstMessage: varchar("firstMessage", { length: 32 }),
  lastMessage: varchar("lastMessage", { length: 32 }),
  source: varchar("source", { length: 64 }).default("whatsapp_agn"),
  hasPlayed: boolean("hasPlayed").default(false),
  linkedProfileId: int("linkedProfileId"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AgnContact = typeof agnContacts.$inferSelect;

// ─── Contact Tags (for categorizing AGN contacts) ───
export const contactTags = mysqlTable("contact_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  color: varchar("color", { length: 16 }).default("#6b7280"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactTag = typeof contactTags.$inferSelect;

// ─── Contact Tag Assignments (junction table) ───
export const contactTagAssignments = mysqlTable("contact_tag_assignments", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId").notNull(),
  tagId: int("tagId").notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
});

export type ContactTagAssignment = typeof contactTagAssignments.$inferSelect;

// ─── Media Catalogue (common database for all bridge assets) ───
export const mediaCatalogue = mysqlTable("media_catalogue", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  cdnUrl: text("cdnUrl").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  bridge: varchar("bridge", { length: 64 }).notNull(),
  description: text("description"),
  blockRef: varchar("blockRef", { length: 32 }),
  tags: text("tags"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MediaCatalogueEntry = typeof mediaCatalogue.$inferSelect;

// ─── Bridge Sync Log ───
export const bridgeSyncLog = mysqlTable("bridge_sync_log", {
  id: int("id").autoincrement().primaryKey(),
  bridge: varchar("bridge", { length: 64 }).notNull(),
  syncType: varchar("syncType", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["success", "failed", "partial"]).notNull(),
  recordsFound: int("recordsFound").default(0),
  recordsUpdated: int("recordsUpdated").default(0),
  errorMessage: text("errorMessage"),
  responseData: json("responseData"),
  syncedAt: timestamp("syncedAt").defaultNow().notNull(),
});

export type BridgeSyncLogEntry = typeof bridgeSyncLog.$inferSelect;

// ─── DCSN Nodes (Distributed Cognitive Social Network) ───
export const dcsnNodes = mysqlTable("dcsn_nodes", {
  id: int("id").autoincrement().primaryKey(),
  nodeNumber: int("nodeNumber").notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  title: varchar("title", { length: 128 }),
  cell: varchar("cell", { length: 128 }),
  recruitedByNode: int("recruitedByNode"),
  recruitedByName: varchar("recruitedByName", { length: 256 }),
  activationDate: varchar("activationDate", { length: 32 }),
  relation: varchar("relation", { length: 64 }),
  role: varchar("role", { length: 128 }),
  intel: varchar("intel", { length: 32 }),
  access: varchar("access", { length: 32 }),
  level: varchar("level", { length: 64 }),
  day: int("day"),
  phase: int("phase"),
  status: mysqlEnum("dcsnStatus", ["activated", "pending", "deactivated"]).default("activated"),
  iCardUrl: text("iCardUrl"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DcsnNode = typeof dcsnNodes.$inferSelect;

// ─── Feedback Reports (Node Reviews / Inspector Reports) ───
export const feedbackReports = mysqlTable("feedback_reports", {
  id: int("id").autoincrement().primaryKey(),
  nodeNumber: int("nodeNumber"),
  reporterName: varchar("reporterName", { length: 256 }).notNull(),
  reportType: varchar("reportType", { length: 64 }).notNull(),
  source: varchar("source", { length: 64 }).notNull(),
  reportDate: varchar("reportDate", { length: 32 }).notNull(),
  blockRef: varchar("blockRef", { length: 64 }),
  verdictTitle: varchar("verdictTitle", { length: 256 }),
  verdictDetails: text("verdictDetails"),
  actionTitle: varchar("actionTitle", { length: 256 }),
  actionDetails: text("actionDetails"),
  prescription: text("prescription"),
  rawFeedback: text("rawFeedback"),
  iCardUrl: text("iCardUrl"),
  status: mysqlEnum("reportStatus", ["open", "in_progress", "resolved", "archived"]).default("open"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FeedbackReport = typeof feedbackReports.$inferSelect;

// ─── Governance Records (Tetrahedral Observer, SAP-001, Protocols) ───
export const governanceRecords = mysqlTable("governance_records", {
  id: int("id").autoincrement().primaryKey(),
  recordId: varchar("recordId", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  recordType: varchar("recordType", { length: 64 }).notNull(),
  version: varchar("version", { length: 16 }),
  blockRef: varchar("blockRef", { length: 64 }),
  description: text("description"),
  content: json("content"),
  iCardUrl: text("iCardUrl"),
  compliance: varchar("compliance", { length: 128 }),
  status: mysqlEnum("govStatus", ["active", "superseded", "draft"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GovernanceRecord = typeof governanceRecords.$inferSelect;

// ─── Player Decisions (Branching Choice Mechanics — "What Would You Do?") ───
export const playerDecisions = mysqlTable("player_decisions", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  relayNumber: int("relayNumber").notNull(),
  choiceId: varchar("choiceId", { length: 64 }).notNull(), // e.g. "relay1_choice_a"
  choiceLabel: varchar("choiceLabel", { length: 256 }).notNull(),
  dilemmaTitle: varchar("dilemmaTitle", { length: 256 }).notNull(),
  archetype: varchar("archetype", { length: 64 }), // builder, philosopher, pragmatist, visionary
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PlayerDecision = typeof playerDecisions.$inferSelect;
