// ═══════════════════════════════════════════════════════════════
// R01 FIRE — 48 Fire Phenomena Cards
// Source: iAAi Principia Tectonica · Ir. Nigel T. Dearden CEng
// ═══════════════════════════════════════════════════════════════

export interface FireCard {
  number: number;
  group: FireCardGroup;
  name: string;
  latinName: string;
  age: string; // Display string
  ageYears: number; // Numeric for comparison
  heat: number; // /100
  scale: number; // /100
  ctrl: number; // /100
  trd: number; // /100
  soc: number; // /100
  cog: number; // /100
  isi: number; // /300
}

export type FireCardGroup =
  | "ORIGIN" | "SIGNAL" | "CRAFT" | "RITUAL" | "MYTH"
  | "FUEL" | "TRANSFORM" | "ENGINE" | "SCIENCE" | "ECOLOGY" | "HAZARD";

export type FireCardStat = "age" | "heat" | "scale" | "ctrl" | "trd" | "soc" | "cog" | "isi";

// Stat-to-HICE axis mapping
export const STAT_AXIS_MAP: Record<FireCardStat, "I" | "E" | "C" | "context"> = {
  cog: "I",      // Intelligence axis
  soc: "E",      // Emotional axis (Social Reach)
  ctrl: "E",     // Emotional axis (Control Rating)
  trd: "C",      // Creative axis (Trade Value)
  isi: "C",      // Creative axis (Infrastructure Significance)
  age: "context", // Context stat — gameplay mechanics
  heat: "context", // Context stat — gameplay mechanics
  scale: "context", // Context stat — gameplay mechanics
};

export const FIRE_CARD_GROUPS: { key: FireCardGroup; count: number; emoji: string }[] = [
  { key: "ORIGIN", count: 3, emoji: "🏠" },
  { key: "SIGNAL", count: 3, emoji: "🔥" },
  { key: "CRAFT", count: 3, emoji: "🕯️" },
  { key: "RITUAL", count: 5, emoji: "🪔" },
  { key: "MYTH", count: 3, emoji: "⚡" },
  { key: "FUEL", count: 4, emoji: "⛽" },
  { key: "TRANSFORM", count: 5, emoji: "🏺" },
  { key: "ENGINE", count: 7, emoji: "⚙️" },
  { key: "SCIENCE", count: 4, emoji: "🔬" },
  { key: "ECOLOGY", count: 3, emoji: "🌿" },
  { key: "HAZARD", count: 8, emoji: "⚠️" },
];

export const FIRE_CARDS: FireCard[] = [
  // ORIGIN (3)
  { number: 1, group: "ORIGIN", name: "Hearth Fire", latinName: "Ignis Domesticus", age: "400,000 yrs", ageYears: 400000, heat: 25, scale: 8, ctrl: 98, trd: 55, soc: 98, cog: 92, isi: 245 },
  { number: 2, group: "ORIGIN", name: "Campfire", latinName: "Ignis Communis", age: "1M yrs", ageYears: 1000000, heat: 20, scale: 5, ctrl: 95, trd: 25, soc: 99, cog: 95, isi: 219 },
  { number: 3, group: "ORIGIN", name: "Torch", latinName: "Fax Portabilis", age: "400,000 yrs", ageYears: 400000, heat: 22, scale: 10, ctrl: 90, trd: 40, soc: 88, cog: 80, isi: 208 },
  // SIGNAL (3)
  { number: 4, group: "SIGNAL", name: "Beacon Fire", latinName: "Ignis Signalis", age: "3,000 yrs", ageYears: 3000, heat: 18, scale: 45, ctrl: 80, trd: 35, soc: 90, cog: 75, isi: 200 },
  { number: 5, group: "SIGNAL", name: "Olympic Torch", latinName: "Fax Olympica", age: "2,800 yrs", ageYears: 2800, heat: 12, scale: 35, ctrl: 85, trd: 48, soc: 98, cog: 90, isi: 236 },
  { number: 6, group: "SIGNAL", name: "Eternal Flame", latinName: "Ignis Aeternus", age: "2,500 yrs", ageYears: 2500, heat: 10, scale: 5, ctrl: 99, trd: 20, soc: 92, cog: 88, isi: 200 },
  // CRAFT (3)
  { number: 7, group: "CRAFT", name: "Candle", latinName: "Candela", age: "5,000 yrs", ageYears: 5000, heat: 10, scale: 3, ctrl: 98, trd: 60, soc: 85, cog: 78, isi: 223 },
  { number: 8, group: "CRAFT", name: "Lantern", latinName: "Laterna", age: "2,000 yrs", ageYears: 2000, heat: 15, scale: 5, ctrl: 98, trd: 65, soc: 82, cog: 75, isi: 222 },
  { number: 26, group: "CRAFT", name: "Forge Fire", latinName: "Ignis Fabrilis", age: "5,000 yrs", ageYears: 5000, heat: 85, scale: 15, ctrl: 88, trd: 95, soc: 80, cog: 88, isi: 263 },
  // RITUAL (5)
  { number: 9, group: "RITUAL", name: "Diwali Diya", latinName: "Ignis Festivalis", age: "2,500 yrs", ageYears: 2500, heat: 8, scale: 10, ctrl: 99, trd: 38, soc: 98, cog: 88, isi: 224 },
  { number: 10, group: "RITUAL", name: "Bonfire", latinName: "Ignis Magnus", age: "5,000 yrs", ageYears: 5000, heat: 25, scale: 32, ctrl: 78, trd: 28, soc: 90, cog: 80, isi: 198 },
  { number: 11, group: "RITUAL", name: "Cremation Fire", latinName: "Ignis Funerarius", age: "70,000 yrs", ageYears: 70000, heat: 35, scale: 8, ctrl: 78, trd: 15, soc: 80, cog: 88, isi: 183 },
  { number: 12, group: "RITUAL", name: "Funeral Pyre", latinName: "Rogus", age: "100,000 yrs", ageYears: 100000, heat: 32, scale: 10, ctrl: 72, trd: 10, soc: 82, cog: 88, isi: 180 },
  { number: 13, group: "RITUAL", name: "Zoroastrian Sacred Fire", latinName: "Atash Bahram", age: "3,500 yrs", ageYears: 3500, heat: 12, scale: 5, ctrl: 99, trd: 18, soc: 75, cog: 95, isi: 188 },
  // MYTH (3)
  { number: 14, group: "MYTH", name: "Agni", latinName: "Agnis Vedicus", age: "3,500 yrs", ageYears: 3500, heat: 5, scale: 5, ctrl: 5, trd: 15, soc: 95, cog: 98, isi: 208 },
  { number: 15, group: "MYTH", name: "Prometheus", latinName: "Prometheus Igniferus", age: "2,800 yrs", ageYears: 2800, heat: 5, scale: 5, ctrl: 5, trd: 20, soc: 99, cog: 99, isi: 218 },
  { number: 16, group: "MYTH", name: "Hephaestus & Vulcan", latinName: "Ignis Divinus Fabrilis", age: "2,800 yrs", ageYears: 2800, heat: 5, scale: 5, ctrl: 5, trd: 18, soc: 90, cog: 95, isi: 203 },
  // FUEL (4)
  { number: 17, group: "FUEL", name: "Charcoal", latinName: "Carbo Ligni", age: "30,000 yrs", ageYears: 30000, heat: 70, scale: 25, ctrl: 90, trd: 85, soc: 72, cog: 78, isi: 235 },
  { number: 18, group: "FUEL", name: "Coke Smelting", latinName: "Cocus Metallurgicus", age: "300 yrs", ageYears: 300, heat: 90, scale: 45, ctrl: 88, trd: 98, soc: 65, cog: 82, isi: 245 },
  { number: 19, group: "FUEL", name: "Coal Power Station", latinName: "Thermelectrica Carbonaria", age: "200 yrs", ageYears: 200, heat: 82, scale: 72, ctrl: 85, trd: 92, soc: 65, cog: 72, isi: 229 },
  { number: 20, group: "FUEL", name: "Oil Refinery Flare", latinName: "Flamma Petrolea", age: "150 yrs", ageYears: 150, heat: 68, scale: 42, ctrl: 72, trd: 75, soc: 48, cog: 62, isi: 185 },
  // TRANSFORM (5)
  { number: 21, group: "TRANSFORM", name: "Kiln Fire", latinName: "Ignis Fornacis", age: "25,000 yrs", ageYears: 25000, heat: 75, scale: 20, ctrl: 85, trd: 88, soc: 78, cog: 82, isi: 248 },
  { number: 22, group: "TRANSFORM", name: "Pottery Fire", latinName: "Ignis Ceramicus", age: "25,000 yrs", ageYears: 25000, heat: 65, scale: 15, ctrl: 88, trd: 80, soc: 75, cog: 80, isi: 235 },
  { number: 23, group: "TRANSFORM", name: "Bread Oven", latinName: "Furnus Panis", age: "14,000 yrs", ageYears: 14000, heat: 30, scale: 10, ctrl: 95, trd: 75, soc: 92, cog: 82, isi: 249 },
  { number: 24, group: "TRANSFORM", name: "Lime Kiln", latinName: "Calcaria Fornax", age: "10,000 yrs", ageYears: 10000, heat: 72, scale: 25, ctrl: 85, trd: 82, soc: 68, cog: 78, isi: 228 },
  { number: 25, group: "TRANSFORM", name: "Glass Making", latinName: "Ignis Vitrarius", age: "3,500 yrs", ageYears: 3500, heat: 78, scale: 20, ctrl: 85, trd: 88, soc: 78, cog: 88, isi: 254 },
  // ENGINE (7)
  { number: 27, group: "ENGINE", name: "Steam Engine", latinName: "Machina Vaporum", age: "300 yrs", ageYears: 300, heat: 80, scale: 55, ctrl: 90, trd: 99, soc: 75, cog: 88, isi: 262 },
  { number: 28, group: "ENGINE", name: "Internal Combustion Engine", latinName: "Machina Combustionis Internae", age: "150 yrs", ageYears: 150, heat: 85, scale: 50, ctrl: 88, trd: 99, soc: 78, cog: 85, isi: 262 },
  { number: 29, group: "ENGINE", name: "Jet Engine", latinName: "Machina Turbinis", age: "80 yrs", ageYears: 80, heat: 88, scale: 60, ctrl: 85, trd: 95, soc: 82, cog: 85, isi: 262 },
  { number: 30, group: "ENGINE", name: "Rocket Engine", latinName: "Machina Propulsiva", age: "80 yrs", ageYears: 80, heat: 95, scale: 65, ctrl: 80, trd: 88, soc: 88, cog: 92, isi: 268 },
  { number: 31, group: "ENGINE", name: "Gas Turbine Power Station", latinName: "Turbina Gasosa", age: "80 yrs", ageYears: 80, heat: 88, scale: 70, ctrl: 88, trd: 92, soc: 68, cog: 80, isi: 240 },
  { number: 32, group: "ENGINE", name: "Nuclear Fission", latinName: "Fissio Nuclearis", age: "80 yrs", ageYears: 80, heat: 99, scale: 78, ctrl: 82, trd: 90, soc: 72, cog: 95, isi: 257 },
  { number: 33, group: "ENGINE", name: "Solar Concentrator", latinName: "Ignis Solaris", age: "50 yrs", ageYears: 50, heat: 78, scale: 62, ctrl: 85, trd: 80, soc: 72, cog: 85, isi: 237 },
  // SCIENCE (4)
  { number: 34, group: "SCIENCE", name: "Thermodynamics", latinName: "Thermodynamica", age: "200 yrs", ageYears: 200, heat: 5, scale: 5, ctrl: 99, trd: 42, soc: 72, cog: 99, isi: 213 },
  { number: 35, group: "SCIENCE", name: "Combustion Chemistry", latinName: "Chemia Combustionis", age: "200 yrs", ageYears: 200, heat: 5, scale: 5, ctrl: 99, trd: 38, soc: 75, cog: 99, isi: 212 },
  { number: 36, group: "SCIENCE", name: "Fire Triangle", latinName: "Triangulum Ignis", age: "200 yrs", ageYears: 200, heat: 5, scale: 5, ctrl: 99, trd: 32, soc: 80, cog: 98, isi: 210 },
  { number: 37, group: "SCIENCE", name: "Fire Suppression", latinName: "Suppressio Ignis", age: "150 yrs", ageYears: 150, heat: 5, scale: 32, ctrl: 99, trd: 68, soc: 70, cog: 88, isi: 226 },
  // ECOLOGY (3)
  { number: 38, group: "ECOLOGY", name: "Controlled Burn", latinName: "Combustio Moderata", age: "60,000 yrs", ageYears: 60000, heat: 20, scale: 75, ctrl: 70, trd: 45, soc: 75, cog: 80, isi: 200 },
  { number: 39, group: "ECOLOGY", name: "Slash and Burn", latinName: "Ignis Agri", age: "10,000 yrs", ageYears: 10000, heat: 18, scale: 70, ctrl: 60, trd: 58, soc: 62, cog: 65, isi: 185 },
  { number: 40, group: "ECOLOGY", name: "Fire Ecology", latinName: "Ecologia Ignis", age: "400M yrs", ageYears: 400000000, heat: 15, scale: 90, ctrl: 12, trd: 22, soc: 68, cog: 80, isi: 170 },
  // HAZARD (8)
  { number: 41, group: "HAZARD", name: "Forest Crown Fire", latinName: "Ignis Coronarius", age: "500,000 yrs", ageYears: 500000, heat: 35, scale: 92, ctrl: 5, trd: 10, soc: 70, cog: 68, isi: 148 },
  { number: 42, group: "HAZARD", name: "Volcanic Eruption", latinName: "Eruptio Vulcani", age: "4.5B yrs", ageYears: 4500000000, heat: 98, scale: 99, ctrl: 2, trd: 8, soc: 85, cog: 72, isi: 165 },
  { number: 43, group: "HAZARD", name: "Lightning Strike", latinName: "Fulmen", age: "1M yrs", ageYears: 1000000, heat: 30, scale: 95, ctrl: 2, trd: 10, soc: 72, cog: 60, isi: 142 },
  { number: 44, group: "HAZARD", name: "Savanna Grassfire", latinName: "Ignis Savannarum", age: "500,000 yrs", ageYears: 500000, heat: 28, scale: 88, ctrl: 8, trd: 15, soc: 62, cog: 65, isi: 142 },
  { number: 45, group: "HAZARD", name: "Great Fire of London", latinName: "Conflagratio Londiniensis", age: "360 yrs", ageYears: 360, heat: 45, scale: 58, ctrl: 10, trd: 15, soc: 88, cog: 85, isi: 188 },
  { number: 46, group: "HAZARD", name: "Dresden Firestorm", latinName: "Tempestas Ignis", age: "80 yrs", ageYears: 80, heat: 55, scale: 62, ctrl: 5, trd: 5, soc: 78, cog: 80, isi: 163 },
  { number: 47, group: "HAZARD", name: "Chicago Fire", latinName: "Conflagratio Chicagiensis", age: "155 yrs", ageYears: 155, heat: 42, scale: 52, ctrl: 5, trd: 12, soc: 48, cog: 60, isi: 120 },
  { number: 48, group: "HAZARD", name: "Peat Bog Fire", latinName: "Ignis Turbarius", age: "10,000 yrs", ageYears: 10000, heat: 22, scale: 62, ctrl: 8, trd: 12, soc: 62, cog: 80, isi: 174 },
];

// ─── Stat display names (for UI) ───
export const STAT_LABELS: Record<FireCardStat, string> = {
  age: "AGE",
  heat: "HEAT",
  scale: "SCALE",
  ctrl: "CTRL",
  trd: "TRD",
  soc: "SOC",
  cog: "COG",
  isi: "ISI",
};

export const STAT_FULL_NAMES: Record<FireCardStat, string> = {
  age: "Approximate Age",
  heat: "Heat Output",
  scale: "Physical Scale",
  ctrl: "Control Rating",
  trd: "Trade Value",
  soc: "Social Reach",
  cog: "Cognition Score",
  isi: "Infrastructure Significance",
};

export const STAT_MAX: Record<FireCardStat, number> = {
  age: 100, // normalized
  heat: 100,
  scale: 100,
  ctrl: 100,
  trd: 100,
  soc: 100,
  cog: 100,
  isi: 300,
};

// ─── Challenge types per card group ───
export type ChallengeType = "comparison" | "empathy_choice" | "creative_connection" | "ranking" | "isi_assessment";

export const GROUP_CHALLENGE_MAP: Record<FireCardGroup, ChallengeType> = {
  ORIGIN: "comparison",
  SIGNAL: "empathy_choice",
  CRAFT: "creative_connection",
  RITUAL: "empathy_choice",
  MYTH: "empathy_choice",
  FUEL: "comparison",
  TRANSFORM: "creative_connection",
  ENGINE: "comparison",
  SCIENCE: "ranking",
  ECOLOGY: "creative_connection",
  HAZARD: "isi_assessment",
};

// ─── Deck Champions ───
export const DECK_CHAMPIONS: Record<string, { card: string; value: string }> = {
  AGE: { card: "Hearth Fire", value: "400,000 yrs" },
  HEAT: { card: "Nuclear Fission", value: "99/100" },
  SCALE: { card: "Volcanic Eruption", value: "99/100" },
  CTRL: { card: "Eternal Flame", value: "99/100" },
  TRD: { card: "Steam Engine", value: "99/100" },
  SOC: { card: "Campfire", value: "99/100" },
  COG: { card: "Prometheus", value: "99/100" },
  ISI: { card: "Rocket Engine", value: "268/300" },
};

// ─── Helper: Get stat value from card ───
export function getCardStat(card: FireCard, stat: FireCardStat): number {
  switch (stat) {
    case "age": return Math.min(100, Math.log10(card.ageYears + 1) * 10); // Normalize age to 0-100 log scale
    case "heat": return card.heat;
    case "scale": return card.scale;
    case "ctrl": return card.ctrl;
    case "trd": return card.trd;
    case "soc": return card.soc;
    case "cog": return card.cog;
    case "isi": return card.isi;
    default: return 0;
  }
}

// ─── Helper: Generate a trial deck (subset for 15-30 min session) ───
export function generateTrialDeck(cardCount: number = 12): FireCard[] {
  // Select cards from diverse groups for a balanced trial
  const groups = [...FIRE_CARD_GROUPS];
  const deck: FireCard[] = [];
  const cardsPerGroup = Math.ceil(cardCount / groups.length);

  for (const group of groups) {
    const groupCards = FIRE_CARDS.filter(c => c.group === group.key);
    // Shuffle and take up to cardsPerGroup
    const shuffled = [...groupCards].sort(() => Math.random() - 0.5);
    deck.push(...shuffled.slice(0, Math.min(cardsPerGroup, shuffled.length)));
    if (deck.length >= cardCount) break;
  }

  return deck.slice(0, cardCount).sort(() => Math.random() - 0.5);
}
