/**
 * Quest-native Asset Capture and Time Machine.
 *
 * The ISI Calculator prototype estimated these readings on a host that is
 * being decommissioned. Quest keeps the same InfraDex list, the same
 * signal S = (A × P) / β, and the same 300-node field (5 webs × 12 relays
 * × 5 integration levels). The arithmetic runs in this module. Nothing
 * here calls another host.
 *
 * Plate index: 80 + 8S, clamped to 36–300, so a reading can sit beside the
 * relay plates, which are also scored out of 300. A and P are on the
 * instrument scale 0.5–10. β is the mean of the four resistances
 * (conflict, climate, contagion, cost), which is the β the scan face shows.
 */
import {
  INFRADEX,
  INFRADEX_TOTAL,
  INTEGRATION_LEVELS,
  RARITIES,
  RARITY_XP,
  RELAYS,
  WEBS,
  relayById,
  type IntegrationLevel,
  type Rarity,
  type RelayId,
  type Species,
  type WebName,
} from "./infradexCatalogue";

export { RELAYS, WEBS };
export type { RelayId, WebName, IntegrationLevel, Rarity, Species };

export type ImageCue = {
  warm: number;
  green: number;
  blue: number;
  grey: number;
  bright: number;
  edge: number;
  /** Share of edge energy that is horizontal. 0.5 is balanced. */
  horizontal: number;
};

export type FourResistances = {
  conflict: number;
  climate: number;
  contagion: number;
  cost: number;
};

export type LambdaTerms = {
  doctrine: number;
  grace: number;
  interpretation: number;
};

export type VibrationMode = "DISCORDANT" | "DISRUPTIVE" | "HARMONIC" | "RESONANT" | "COHERENT";

export type ScanSource = "text" | "photograph" | "both" | "field";

export type ScanReading = {
  source: ScanSource;
  species: Species | null;
  assetName: string;
  relay: RelayId;
  relayName: string;
  web: WebName;
  integrationLevel: IntegrationLevel;
  rarity: Rarity | null;
  confidence: number;
  A: number;
  P: number;
  resistances: FourResistances;
  lambda: LambdaTerms;
  beta: number;
  lambdaAvg: number;
  signal: number;
  plateIndex: number;
  vibration: VibrationMode;
  vibrationLabel: string;
  explanation: string;
  /** Spoken aloud with the reading. Same words as the plate. */
  spoken: string;
  /**
   * True only when a named species is matched. A photograph on its own
   * identifies a candidate and does not invent a mid-scale plate index.
   */
  scored: boolean;
  matched: boolean;
};

export type RegionId =
  | "americas"
  | "europe"
  | "africa"
  | "middle_east"
  | "cs_asia"
  | "e_asia"
  | "oceania";

export type Region = {
  id: RegionId;
  label: string;
  /** Short name on the portal plate, so neighbouring pins stay readable. */
  plate: string;
  /** Position on the portal plate, percent. */
  x: number;
  y: number;
};

export type HistoricalReading = {
  regionId: RegionId;
  regionLabel: string;
  year: number;
  yearLabel: string;
  civilisation: string;
  namedByPlayer: boolean;
  dominantRelay: RelayId;
  dominantRelayName: string;
  dominantWeb: WebName;
  activeRelays: RelayId[];
  darkRelays: RelayId[];
  integrationLevel: IntegrationLevel;
  A: number;
  P: number;
  resistances: FourResistances;
  beta: number;
  signal: number;
  plateIndex: number;
  vibration: VibrationMode;
  vibrationLabel: string;
  present: {
    year: number;
    yearLabel: string;
    civilisation: string;
    plateIndex: number;
    dominantRelayName: string;
  };
  explanation: string;
};

export type LatticeNode = {
  id: string;
  relay: RelayId;
  relayName: string;
  web: WebName;
  level: IntegrationLevel;
  /** Angle in radians, 0 at the top, clockwise. */
  angle: number;
  /** Radius in the 0–100 collidoscope space. */
  radius: number;
};

export type CaptureAward = {
  xpAwarded: number;
  isNew: boolean;
  species: Species;
};

export type CaptureBook = {
  xp: number;
  scanCount: number;
  /** species id → highest integration level recorded */
  captured: Record<string, number>;
};

const PRESENT_YEAR = 2026;

export const REGIONS: readonly Region[] = [
  { id: "americas", label: "Americas", plate: "Americas", x: 20, y: 44 },
  { id: "europe", label: "Europe", plate: "Europe", x: 44, y: 24 },
  { id: "africa", label: "Africa", plate: "Africa", x: 46, y: 64 },
  { id: "middle_east", label: "Middle East", plate: "Mid East", x: 60, y: 38 },
  { id: "cs_asia", label: "Central & South Asia", plate: "S. Asia", x: 72, y: 54 },
  { id: "e_asia", label: "East Asia", plate: "E. Asia", x: 84, y: 28 },
  { id: "oceania", label: "Oceania", plate: "Oceania", x: 78, y: 80 },
];

const RARITY_AMPLITUDE: Record<Rarity, number> = {
  Common: 4.4,
  Uncommon: 5.6,
  Rare: 6.8,
  "Ultra-Rare": 8.1,
  Legendary: 9.2,
};

const RELAY_PERSISTENCE: Record<RelayId, number> = {
  R01: 9.2,
  R02: 8.8,
  R03: 8.4,
  R04: 8.0,
  R05: 7.4,
  R06: 7.0,
  R07: 6.6,
  R08: 5.8,
  R09: 5.6,
  R10: 5.2,
  R11: 4.6,
  R12: 5.0,
};

const RELAY_RESISTANCE: Record<RelayId, FourResistances> = {
  R01: { conflict: 4.0, climate: 7.2, contagion: 3.0, cost: 4.0 },
  R02: { conflict: 2.4, climate: 6.2, contagion: 3.2, cost: 3.2 },
  R03: { conflict: 4.2, climate: 7.0, contagion: 5.2, cost: 5.0 },
  R04: { conflict: 6.0, climate: 4.2, contagion: 5.0, cost: 4.2 },
  R05: { conflict: 5.0, climate: 4.0, contagion: 4.2, cost: 6.2 },
  R06: { conflict: 6.2, climate: 5.2, contagion: 6.0, cost: 6.0 },
  R07: { conflict: 3.2, climate: 3.2, contagion: 3.4, cost: 5.2 },
  R08: { conflict: 4.2, climate: 4.2, contagion: 4.4, cost: 7.0 },
  R09: { conflict: 5.0, climate: 6.2, contagion: 3.4, cost: 7.0 },
  R10: { conflict: 5.2, climate: 4.2, contagion: 4.2, cost: 6.4 },
  R11: { conflict: 4.2, climate: 3.2, contagion: 2.2, cost: 8.2 },
  R12: { conflict: 5.2, climate: 4.4, contagion: 6.2, cost: 5.2 },
};

const WEB_LAMBDA: Record<WebName, LambdaTerms> = {
  Physical: { doctrine: 3.2, grace: 4.2, interpretation: 4.0 },
  Biological: { doctrine: 3.4, grace: 7.2, interpretation: 4.2 },
  Social: { doctrine: 6.4, grace: 5.2, interpretation: 5.2 },
  Digital: { doctrine: 4.2, grace: 3.2, interpretation: 7.2 },
  Consciousness: { doctrine: 8.0, grace: 6.2, interpretation: 8.0 },
};

const VIBRATION: { mode: VibrationMode; label: string; from: number }[] = [
  { mode: "DISCORDANT", label: "Collapse", from: 0 },
  { mode: "DISRUPTIVE", label: "Turbulence", from: 0.2 },
  { mode: "HARMONIC", label: "Balance", from: 0.4 },
  { mode: "RESONANT", label: "Amplification", from: 0.6 },
  { mode: "COHERENT", label: "Alignment", from: 0.8 },
];

/**
 * Year the named order is a fair label for that region.
 * Later rows replace earlier ones. A typed year still wins.
 */
const ATLAS: Record<RegionId, readonly { year: number; name: string }[]> = {
  americas: [
    { year: -10000, name: "Clovis" },
    { year: -8000, name: "Early American settlements" },
    { year: -4000, name: "Archaic cultures" },
    { year: -1500, name: "Olmec" },
    { year: -500, name: "Olmec and Chavín" },
    { year: 250, name: "Classic Maya" },
    { year: 900, name: "Toltec and Mississippian cultures" },
    { year: 1400, name: "Aztec and Inca" },
    { year: 1600, name: "Colonial Americas" },
    { year: 1776, name: "Atlantic revolutions" },
    { year: 1830, name: "American republics" },
    { year: 1900, name: "Industrial Americas" },
    { year: 1957, name: "Space-age Americas" },
    { year: 2000, name: "Digital Americas" },
  ],
  europe: [
    { year: -10000, name: "Mesolithic hunters" },
    { year: -8000, name: "Neolithic farmers" },
    { year: -4000, name: "Early European agriculture" },
    { year: -800, name: "Archaic Greece" },
    { year: -500, name: "Classical Greece" },
    { year: -27, name: "Roman Empire" },
    { year: 476, name: "Late antique Europe" },
    { year: 800, name: "Carolingian Europe" },
    { year: 1100, name: "High medieval Europe" },
    { year: 1450, name: "Renaissance Europe" },
    { year: 1780, name: "Enlightenment Europe" },
    { year: 1830, name: "Industrial Europe" },
    { year: 1914, name: "Wartime Europe" },
    { year: 1945, name: "Post-war Europe" },
    { year: 1993, name: "European Union" },
  ],
  africa: [
    { year: -10000, name: "Early African communities" },
    { year: -8000, name: "Saharan cultures" },
    { year: -4000, name: "Nile settlements" },
    { year: -3100, name: "Early dynastic Egypt" },
    { year: -500, name: "Carthage and Nok" },
    { year: 100, name: "Aksum and the Niger bend" },
    { year: 700, name: "Ghana Empire" },
    { year: 1230, name: "Mali Empire" },
    { year: 1460, name: "Songhai" },
    { year: 1700, name: "Sahelian and coastal states" },
    { year: 1810, name: "Sokoto Caliphate" },
    { year: 1884, name: "Colonial partition" },
    { year: 1960, name: "Independent Africa" },
    { year: 2002, name: "African Union" },
  ],
  middle_east: [
    { year: -10000, name: "Natufian culture" },
    { year: -8000, name: "Fertile Crescent farming" },
    { year: -4000, name: "Mesopotamia" },
    { year: -550, name: "Achaemenid Persia" },
    { year: 224, name: "Sasanian Persia" },
    { year: 750, name: "Abbasid Caliphate" },
    { year: 1299, name: "Ottoman Empire" },
    { year: 1839, name: "Ottoman reform" },
    { year: 1920, name: "Mandate states" },
    { year: 1960, name: "Oil states" },
    { year: 2000, name: "Gulf states" },
  ],
  cs_asia: [
    { year: -10000, name: "Early South Asian settlements" },
    { year: -7000, name: "Mehrgarh" },
    { year: -2600, name: "Indus cities" },
    { year: -500, name: "Mahajanapadas" },
    { year: -322, name: "Maurya" },
    { year: 320, name: "Gupta" },
    { year: 1206, name: "Delhi Sultanate" },
    { year: 1526, name: "Mughal Empire" },
    { year: 1757, name: "British India" },
    { year: 1947, name: "India and Pakistan" },
    { year: 2000, name: "Republic of India" },
  ],
  e_asia: [
    { year: -10000, name: "Jōmon and early Yellow River communities" },
    { year: -7000, name: "Early Yellow River farming" },
    { year: -1600, name: "Shang" },
    { year: -221, name: "Qin and Han" },
    { year: 618, name: "Tang Dynasty" },
    { year: 960, name: "Song Dynasty" },
    { year: 1368, name: "Ming and Muromachi Japan" },
    { year: 1644, name: "Qing and Tokugawa" },
    { year: 1868, name: "Meiji Japan and late Qing" },
    { year: 1949, name: "Post-war East Asia" },
    { year: 2000, name: "China, Japan, and Korea" },
  ],
  oceania: [
    { year: -10000, name: "Aboriginal Australia" },
    { year: -4000, name: "Aboriginal Australia and Near Oceania" },
    { year: -1500, name: "Lapita voyagers" },
    { year: 800, name: "Polynesian societies" },
    { year: 1300, name: "Aotearoa and high Polynesia" },
    { year: 1788, name: "Colonial Australia" },
    { year: 1901, name: "Australia and New Zealand" },
    { year: 2000, name: "Australia and the Pacific" },
  ],
};

const GAZETTEER: readonly { test: RegExp; region: RegionId; year: number }[] = [
  { test: /\btang\b/, region: "e_asia", year: 800 },
  { test: /\bsong dynasty\b|\bsong\b/, region: "e_asia", year: 1100 },
  { test: /\bqin\b/, region: "e_asia", year: -221 },
  { test: /\bhan dynasty\b|\bhan\b/, region: "e_asia", year: -100 },
  { test: /\bj[oō]mon\b/, region: "e_asia", year: -8000 },
  { test: /\bmeiji\b/, region: "e_asia", year: 1870 },
  { test: /\btokugawa\b/, region: "e_asia", year: 1700 },
  { test: /\bming\b/, region: "e_asia", year: 1450 },
  { test: /\broman\b|\brome\b/, region: "europe", year: 100 },
  { test: /\bgreek\b|\bgreece\b/, region: "europe", year: -450 },
  { test: /\bvikings?\b/, region: "europe", year: 900 },
  { test: /\bcarolingian\b|\bcharlemagne\b/, region: "europe", year: 800 },
  { test: /\bindustrial revolution\b/, region: "europe", year: 1830 },
  { test: /\bottoman\b/, region: "middle_east", year: 1600 },
  { test: /\babbasid\b/, region: "middle_east", year: 800 },
  { test: /\bmesopotamia\b|\bsumer\b/, region: "middle_east", year: -3000 },
  { test: /\bpersia\b|\bpersian\b/, region: "middle_east", year: -500 },
  { test: /\begypt\b|\bpharaoh\b|\bnile\b/, region: "africa", year: -1500 },
  { test: /\bmali empire\b|\bmali\b/, region: "africa", year: 1350 },
  { test: /\bghana empire\b/, region: "africa", year: 800 },
  { test: /\bsonghai\b/, region: "africa", year: 1500 },
  { test: /\bmaya\b/, region: "americas", year: 600 },
  { test: /\baztec\b/, region: "americas", year: 1450 },
  { test: /\binca\b/, region: "americas", year: 1450 },
  { test: /\bolmec\b/, region: "americas", year: -1000 },
  { test: /\bmaurya\b/, region: "cs_asia", year: -300 },
  { test: /\bgupta\b/, region: "cs_asia", year: 400 },
  { test: /\bmughal\b/, region: "cs_asia", year: 1600 },
  { test: /\bindus\b/, region: "cs_asia", year: -2200 },
  { test: /\bpolynesia\b|\bm[aā]ori\b/, region: "oceania", year: 1300 },
];

const REGION_WORDS: { test: RegExp; region: RegionId }[] = [
  { test: /\bamerica|olmec|maya|aztec|inca|mexico|andes|canada|brazil\b/, region: "americas" },
  { test: /\beurope|rome|roman|greek|britain|france|viking|carolingian\b/, region: "europe" },
  { test: /\bafrica|egypt|nile|mali|songhai|sahara|aksum\b/, region: "africa" },
  { test: /\bmiddle east|mesopotamia|persia|ottoman|arabia|levant|gulf\b/, region: "middle_east" },
  { test: /\bindia|indus|maurya|gupta|mughal|pakistan|gangetic\b/, region: "cs_asia" },
  { test: /\bchina|japan|korea|tang|qin\b|\bhan\b|j[oō]mon|yellow river/, region: "e_asia" },
  { test: /\baustralia|oceania|polynesia|pacific|m[aā]ori|aotearoa\b/, region: "oceania" },
];

const RELAY_WORDS: { relay: RelayId; test: RegExp }[] = [
  { relay: "R01", test: /\bfire|flame|hearth|furnace|kiln|forge|boiler|reactor|fusion|pyro|incinerat/ },
  { relay: "R02", test: /\btree|forest|timber|woodland|orchard|grove|arboretum|reforest/ },
  { relay: "R03", test: /\briver|dam|canal|aqueduct|reservoir|irrigation|flood|hydro|desalin|sewage|qanat|water treatment/ },
  { relay: "R04", test: /\bhorse|stable|bridle|cavalry|chariot|farrier|mews|coaching inn/ },
  { relay: "R05", test: /\broad|bridge|tunnel|highway|motorway|causeway|roundabout|flyover|pavement|walkway|cycle/ },
  { relay: "R06", test: /\bship|harbour|harbor|port|dock|lighthouse|pier|jetty|ferry|naval|rig\b/ },
  { relay: "R07", test: /\bloom|textile|telegraph|telephone|data centre|data center|server|fibre|fiber|computer|quantum|printing press/ },
  { relay: "R08", test: /\brail|railway|train|metro|subway|locomotive|viaduct|shunting|maglev/ },
  { relay: "R09", test: /\bengine|turbine|motor|jet\b|rocket|pump|refinery|hydrogen|assembly line/ },
  { relay: "R10", test: /\bairport|runway|air traffic|radio mast|cellular|drone|navigation|hangar|car park/ },
  { relay: "R11", test: /\borbit|satellite|lunar|mars|launch pad|telescope|observatory|space station|space elevator/ },
  { relay: "R12", test: /\bschool|university|hospital|court|parliament|library|church|mosque|temple|prison|embassy|laboratory|stadium|cemetery|memorial|archive/ },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function formatYear(year: number): string {
  const absValue = Math.abs(Math.round(year));
  const abs = absValue >= 10000 ? absValue.toLocaleString("en-GB") : String(absValue);
  return year < 0 ? `${abs} BCE` : `${abs} CE`;
}

export function vibrationFor(coherence: number): { mode: VibrationMode; label: string } {
  const safe = clamp(coherence, 0, 0.999);
  let chosen = VIBRATION[0]!;
  for (const band of VIBRATION) {
    if (safe >= band.from) chosen = band;
  }
  return { mode: chosen.mode, label: chosen.label };
}

export function plateIndexFor(signal: number): number {
  return clamp(Math.round(80 + signal * 8), 36, 300);
}

function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(text: string): string[] {
  return normalise(text).split(" ").filter((token) => token.length > 2);
}

function speciesScore(query: string, species: Species): number {
  const needle = normalise(query);
  if (!needle) return 0;
  const name = normalise(species.name);
  let score = 0;
  if (name === needle) score += 12;
  else if (name.includes(needle) || needle.includes(name)) score += 8;
  const wanted = tokens(needle);
  const owned = tokens(name);
  const ownedSet = new Set(owned);
  for (const token of wanted) {
    if (ownedSet.has(token)) score += 3;
    else if (owned.some((item) => item.startsWith(token) || token.startsWith(item))) score += 1;
  }
  const extra = owned.filter((token) => !wanted.includes(token)).length;
  score -= extra * 0.6;
  return score;
}

export function matchSpecies(query: string, relayHint?: RelayId | null): { species: Species; score: number } | null {
  const ranked = INFRADEX
    .map((species) => ({ species, score: speciesScore(query, species) }))
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score || a.species.id - b.species.id);
  if (!ranked.length) return null;
  const best = ranked[0]!.score;
  const tied = ranked.filter((item) => item.score === best);
  if (relayHint && tied.length > 1) {
    const hinted = tied.find((item) => item.species.relay === relayHint);
    if (hinted) return hinted;
  }
  return tied[0] ?? null;
}

export function relayFromCues(cues: ImageCue): RelayId {
  const scores = Object.fromEntries(RELAYS.map((relay) => [relay.id, 0])) as Record<RelayId, number>;
  scores.R01 += cues.warm * 3.2;
  scores.R02 += cues.green * 3.2;
  scores.R03 += cues.blue * (1.6 - cues.edge);
  scores.R06 += cues.blue * (0.4 + cues.edge) * 1.6;
  scores.R05 += cues.grey * cues.edge * (0.7 + cues.horizontal);
  scores.R08 += cues.grey * cues.edge * (1.5 - cues.horizontal);
  scores.R09 += cues.warm * (0.4 + cues.grey);
  scores.R10 += cues.grey * cues.bright * 0.9;
  scores.R07 += cues.grey * (1 - cues.warm) * 0.5;
  scores.R04 += cues.green * cues.warm * 0.4;
  scores.R11 += cues.bright < 0.28 && cues.grey > 0.3 ? 0.55 : 0;
  scores.R12 += cues.grey * (1 - cues.edge) * 0.35;
  return RELAYS.reduce((best, relay) => (scores[relay.id] > scores[best] ? relay.id : best), "R01" as RelayId);
}

/** Plain words for a photograph. Colour never becomes an InfraDex species name. */
export function photographCue(cues: ImageCue): string {
  const built = cues.edge > 0.28 && (cues.grey > 0.22 || cues.horizontal > 0.5);
  if (cues.blue > 0.28 && built) return "a built waterfront";
  if (cues.blue > 0.34) return "open water";
  if (cues.warm > 0.45 && cues.warm > cues.green && cues.warm > cues.blue) return "warm light";
  if (cues.green > 0.38 && cues.green > cues.blue) return "living growth";
  if (built) return "a built structure";
  return "the plate in front of you";
}

function cueTitle(cue: string): string {
  const bare = cue.replace(/^a /, "");
  return bare.charAt(0).toUpperCase() + bare.slice(1);
}

function webFromCues(cues: ImageCue): WebName {
  if (cues.green > 0.38 && cues.green > cues.blue && cues.green > cues.warm) return "Biological";
  return "Physical";
}

function integrationFor(text: string, rarity: Rarity | null): IntegrationLevel {
  const webs = new Set<WebName>();
  const sample = text.toLowerCase();
  if (/\bbrick|stone|steel|concrete|bridge|road|dam|engine|rail|fire|tower|pipe/.test(sample)) webs.add("Physical");
  if (/\btree|forest|farm|river|water|health|ecology|timber|horse|crop/.test(sample)) webs.add("Biological");
  if (/\blaw|city|port|market|school|hospital|govern|trade|road|ship/.test(sample)) webs.add("Social");
  if (/\bdata|signal|radio|computer|digital|satellite|telephone|fibre|fiber/.test(sample)) webs.add("Digital");
  if (/\btemple|library|memorial|university|knowledge|ritual|archive|church|mosque/.test(sample)) webs.add("Consciousness");
  const rarityFloor: Record<Rarity, number> = {
    Common: 1,
    Uncommon: 1,
    Rare: 2,
    "Ultra-Rare": 3,
    Legendary: 4,
  };
  const level = Math.max(webs.size || 1, rarity ? rarityFloor[rarity] : 1);
  return clamp(level, 1, 5) as IntegrationLevel;
}

function composeReading(input: {
  source: ScanSource;
  species: Species | null;
  assetName: string;
  relay: RelayId;
  web: WebName;
  rarity: Rarity | null;
  integrationLevel: IntegrationLevel;
  confidence: number;
  amplitudeBias?: number;
  scored: boolean;
  note?: string;
}): ScanReading {
  const rarity = input.rarity ?? "Common";
  const A = round1(clamp((input.species ? RARITY_AMPLITUDE[rarity] : 3.6) + (input.amplitudeBias ?? 0), 0.5, 10));
  const P = round1(clamp(RELAY_PERSISTENCE[input.relay] + (input.integrationLevel - 1) * 0.15, 0.5, 10));
  const resistances = { ...RELAY_RESISTANCE[input.relay] };
  const lambda = { ...WEB_LAMBDA[input.web] };
  const beta = round1(mean([resistances.conflict, resistances.climate, resistances.contagion, resistances.cost]));
  const lambdaAvg = round1(mean([lambda.doctrine, lambda.grace, lambda.interpretation]));
  const signal = round1((A * P) / beta);
  const plateIndex = plateIndexFor(signal);
  const coherence = clamp(signal / 22 * 0.6 + (10 - beta) / 10 * 0.4, 0, 0.98);
  const vibration = vibrationFor(coherence);
  const relayName = relayById(input.relay).name;
  const leading = (Object.entries(resistances) as [keyof FourResistances, number][])
    .sort((a, b) => b[1] - a[1])[0]![0];
  const subject = input.species
    ? `${input.species.name} is an InfraDex ${input.species.rarity.toLowerCase()} species`
    : `${input.assetName} has no exact InfraDex match and is logged as a field observation`;
  const scoredExplanation =
    `${subject} on the ${relayName} relay, in the ${input.web} web, at integration level ${input.integrationLevel}. ` +
    `Amplitude ${A.toFixed(1)} and persistence ${P.toFixed(1)} against a mean resistance of ${beta.toFixed(1)} give a signal of ${signal.toFixed(1)}. ` +
    `The plate index is ${plateIndex} out of 300. ${leading[0].toUpperCase()}${leading.slice(1)} is the leading resistance. ` +
    `The vibrational mode is ${vibration.mode.charAt(0)}${vibration.mode.slice(1).toLowerCase()} — ${vibration.label.toLowerCase()}.`;
  const explanation = input.note
    ? input.note
    : input.scored
      ? scoredExplanation
      : input.species
        ? `${input.species.name} is a possible InfraDex species on the ${relayName} relay, in the ${input.web} web. The name is not exact, so no plate index is given.`
        : `${input.assetName} is not an exact InfraDex match. No plate index is given.`;
  return {
    source: input.source,
    species: input.species,
    assetName: input.species?.name ?? input.assetName,
    relay: input.relay,
    relayName,
    web: input.web,
    integrationLevel: input.integrationLevel,
    rarity: input.species ? input.species.rarity : null,
    confidence: round1(input.confidence),
    A,
    P,
    resistances,
    lambda,
    beta,
    lambdaAvg,
    signal,
    plateIndex,
    vibration: vibration.mode,
    vibrationLabel: vibration.label,
    explanation,
    spoken: explanation,
    scored: input.scored,
    matched: Boolean(input.species),
  };
}

export function scanAsset(input: {
  text?: string;
  cues?: ImageCue | null;
  relayHint?: RelayId | null;
  /** A photograph is already on the plate, even if its colours could not be sampled. */
  photographHeld?: boolean;
}): ScanReading {
  const text = (input.text ?? "").trim();
  const cues = input.cues ?? null;
  const hint = input.relayHint ?? null;
  const textMatch = text.length >= 2 ? matchSpecies(text, hint) : null;
  const photoRelay = cues ? relayFromCues(cues) : null;

  if (textMatch && textMatch.score >= 6) {
    const agrees = !photoRelay || photoRelay === textMatch.species.relay;
    return composeReading({
      source: cues ? "both" : "text",
      species: textMatch.species,
      assetName: textMatch.species.name,
      relay: textMatch.species.relay,
      web: textMatch.species.web,
      rarity: textMatch.species.rarity,
      integrationLevel: integrationFor(`${text} ${textMatch.species.name}`, textMatch.species.rarity),
      confidence: agrees ? (cues ? 0.9 : 0.84) : 0.7,
      amplitudeBias: agrees && cues ? 0.2 : 0,
      scored: true,
    });
  }

  if (textMatch) {
    return composeReading({
      source: cues ? "both" : "text",
      species: textMatch.species,
      assetName: textMatch.species.name,
      relay: textMatch.species.relay,
      web: textMatch.species.web,
      rarity: textMatch.species.rarity,
      integrationLevel: integrationFor(text, textMatch.species.rarity),
      confidence: cues ? 0.72 : 0.64,
      scored: false,
    });
  }

  if (text.length >= 2) {
    const keyword = RELAY_WORDS.find((item) => item.test.test(text.toLowerCase()));
    const relay = photoRelay ?? hint ?? keyword?.relay ?? "R05";
    const web: WebName = cues
      ? webFromCues(cues)
      : relay === "R02" ? "Biological" : relay === "R12" ? "Social" : relay === "R07" || relay === "R11" ? "Digital" : "Physical";
    const relayName = relayById(relay).name;
    const cue = cues ? photographCue(cues) : null;
    return composeReading({
      source: cues || input.photographHeld ? "both" : "field",
      species: null,
      assetName: text,
      relay,
      web,
      rarity: null,
      integrationLevel: 1,
      confidence: cues ? 0.46 : 0.24,
      scored: false,
      note: cue
        ? `${text} is kept as typed. The photograph suggests ${cue}, guessed on the ${relayName} relay, in the ${web} web. It is not an exact InfraDex species, so no plate index is given.`
        : undefined,
    });
  }

  if ((cues && photoRelay) || input.photographHeld) {
    const relay = photoRelay ?? hint ?? "R06";
    const web: WebName = cues ? webFromCues(cues) : "Physical";
    const cue = cues ? photographCue(cues) : "the plate in front of you";
    const relayName = relayById(relay).name;
    return composeReading({
      source: "photograph",
      species: null,
      assetName: cueTitle(cue),
      relay,
      web,
      rarity: null,
      integrationLevel: 1,
      confidence: cues ? 0.4 : 0.2,
      scored: false,
      note: `Candidate. The photograph suggests ${cue}, guessed on the ${relayName} relay, in the ${web} web. Type the name to confirm. No InfraDex species is fixed from the photograph alone, and no plate index is given.`,
    });
  }

  const keyword = RELAY_WORDS.find((item) => item.test.test(text.toLowerCase()));
  const relay = hint ?? keyword?.relay ?? "R05";
  const web: WebName = relay === "R02" ? "Biological" : relay === "R12" ? "Social" : relay === "R07" || relay === "R11" ? "Digital" : "Physical";
  return composeReading({
    source: "field",
    species: null,
    assetName: text || "Unnamed field observation",
    relay,
    web,
    rarity: null,
    integrationLevel: integrationFor(text, null),
    confidence: 0.24,
    scored: false,
  });
}

/** Quiet suggestion while the player is still typing. The autofill step. */
export function autofillSuggestion(text: string, relayHint?: RelayId | null): Species | null {
  if (text.trim().length < 2) return null;
  const match = matchSpecies(text, relayHint);
  if (!match || match.score < 6) return null;
  return match.species;
}

function civilisationAt(region: RegionId, year: number): string {
  const rows = ATLAS[region];
  let name = rows[0]!.name;
  for (const row of rows) {
    if (row.year <= year) name = row.name;
  }
  return name;
}

export function parseEraText(text: string): { region: RegionId | null; year: number | null; gazetteerName: string | null } {
  const lower = text.toLowerCase();
  let year: number | null = null;
  const dated = lower.match(/(-?\d{1,3}(?:,\d{3})*|\d{1,5})\s*(bce|bc|ce|ad)?/i);
  if (dated && dated[1]) {
    const value = Number(dated[1].replace(/,/g, ""));
    if (Number.isFinite(value)) {
      const era = (dated[2] ?? "").toLowerCase();
      year = era === "bce" || era === "bc" ? -Math.abs(value) : value;
      if (!era && value > 3000) year = value;
    }
  }
  const named = GAZETTEER.find((item) => item.test.test(lower));
  const regionWord = REGION_WORDS.find((item) => item.test.test(lower));
  return {
    region: regionWord?.region ?? named?.region ?? null,
    year: year ?? named?.year ?? null,
    gazetteerName: named ? civilisationAt(named.region, year ?? named.year) : null,
  };
}

function eraResistance(year: number, region: RegionId): FourResistances {
  let base: FourResistances;
  if (year < -4000) base = { conflict: 3.2, climate: 7.4, contagion: 3.0, cost: 1.8 };
  else if (year < -500) base = { conflict: 4.4, climate: 6.0, contagion: 4.6, cost: 3.8 };
  else if (year < 500) base = { conflict: 5.4, climate: 5.2, contagion: 5.2, cost: 4.6 };
  else if (year < 1450) base = { conflict: 5.8, climate: 5.0, contagion: 6.4, cost: 5.0 };
  else if (year < 1780) base = { conflict: 6.0, climate: 4.8, contagion: 6.6, cost: 5.6 };
  else if (year < 1914) base = { conflict: 6.2, climate: 5.6, contagion: 6.4, cost: 6.8 };
  else if (year < 1946) base = { conflict: 8.6, climate: 5.6, contagion: 6.8, cost: 7.6 };
  else if (year < 1990) base = { conflict: 6.4, climate: 6.2, contagion: 5.0, cost: 7.0 };
  else if (year < 2020) base = { conflict: 6.0, climate: 7.2, contagion: 5.2, cost: 6.8 };
  else base = { conflict: 6.2, climate: 7.8, contagion: 6.6, cost: 7.2 };

  if (region === "africa" && year >= 1884 && year < 1960) base = { ...base, conflict: base.conflict + 0.4 };
  if (region === "middle_east" && year >= 1960) base = { ...base, cost: base.cost + 0.4 };
  if ((region === "europe" || region === "e_asia") && year >= 1914 && year <= 1945) {
    base = { ...base, conflict: Math.min(9.4, base.conflict + 0.3) };
  }
  return {
    conflict: round1(clamp(base.conflict, 0.5, 10)),
    climate: round1(clamp(base.climate, 0.5, 10)),
    contagion: round1(clamp(base.contagion, 0.5, 10)),
    cost: round1(clamp(base.cost, 0.5, 10)),
  };
}

function dominantWeb(year: number): WebName {
  if (year < -4000) return "Physical";
  if (year < 500) return "Biological";
  if (year < 1769) return "Social";
  if (year < 2024) return "Digital";
  return "Consciousness";
}

function activeRelays(year: number): RelayId[] {
  return RELAYS.filter((relay) => relay.dawn <= year).map((relay) => relay.id);
}

function leadingRelay(year: number): RelayId {
  const awake = RELAYS.filter((relay) => relay.dawn <= year);
  return awake.reduce((latest, relay) => (relay.dawn > RELAYS.find((item) => item.id === latest)!.dawn ? relay.id : latest), awake[0]!.id);
}

function historicalCore(region: RegionId, year: number, civilisation: string, namedByPlayer: boolean): HistoricalReading {
  const active = activeRelays(year);
  const dark = RELAYS.map((relay) => relay.id).filter((id) => !active.includes(id));
  const dominant = leadingRelay(year);
  const web = dominantWeb(year);
  const resistances = eraResistance(year, region);
  const beta = round1(mean([resistances.conflict, resistances.climate, resistances.contagion, resistances.cost]));
  const A = round1(clamp(1.6 + active.length * 0.62, 0.5, 9.6));
  const P = round1(year < 1769 ? 8.6 : year < 1957 ? 6.4 : 5.1);
  const signal = round1((A * P) / beta);
  const plateIndex = plateIndexFor(signal);
  const integrationLevel = clamp(Math.ceil(active.length / 3), 1, 5) as IntegrationLevel;
  const coherence = clamp(signal / 22 * 0.55 + (10 - beta) / 10 * 0.45, 0, 0.98);
  const vibration = vibrationFor(coherence);
  const regionLabel = REGIONS.find((item) => item.id === region)!.label;
  const presentCiv = civilisationAt(region, PRESENT_YEAR);
  const presentCore = year === PRESENT_YEAR
    ? { plateIndex, dominantRelayName: relayById(dominant).name }
    : null;
  const presentReading = presentCore ?? historicalCore(region, PRESENT_YEAR, presentCiv, false);
  const explanation =
    `${civilisation} in ${regionLabel}, ${formatYear(year)}. ` +
    `${active.length} of 12 relays are awake. The leading relay is ${relayById(dominant).name} and the dominant web is ${web}. ` +
    `Amplitude ${A.toFixed(1)} and persistence ${P.toFixed(1)} against a mean resistance of ${beta.toFixed(1)} give a historical signal of ${signal.toFixed(1)}. ` +
    `The plate index is ${plateIndex} out of 300. ` +
    `The same region in ${formatYear(PRESENT_YEAR)} reads ${presentReading.plateIndex}, led by ${presentReading.dominantRelayName}. ` +
    `The vibrational mode is ${vibration.mode.charAt(0)}${vibration.mode.slice(1).toLowerCase()} — ${vibration.label.toLowerCase()}.`;
  return {
    regionId: region,
    regionLabel,
    year,
    yearLabel: formatYear(year),
    civilisation,
    namedByPlayer,
    dominantRelay: dominant,
    dominantRelayName: relayById(dominant).name,
    dominantWeb: web,
    activeRelays: active,
    darkRelays: dark,
    integrationLevel,
    A,
    P,
    resistances,
    beta,
    signal,
    plateIndex,
    vibration: vibration.mode,
    vibrationLabel: vibration.label,
    present: {
      year: PRESENT_YEAR,
      yearLabel: formatYear(PRESENT_YEAR),
      civilisation: presentCiv,
      plateIndex: presentReading.plateIndex,
      dominantRelayName: presentReading.dominantRelayName,
    },
    explanation,
  };
}

export function timeMachineScan(input: {
  regionId?: RegionId | null;
  year?: number | null;
  civilisationEra?: string;
}): HistoricalReading | { error: string } {
  const typed = (input.civilisationEra ?? "").trim();
  const parsed = typed ? parseEraText(typed) : { region: null, year: null, gazetteerName: null };
  const region = input.regionId ?? parsed.region;
  const year = input.year ?? parsed.year;
  if (!region || year === null || year === undefined || !Number.isFinite(year)) {
    return { error: "Choose a region and an era, or name a civilisation and a year." };
  }
  if (year < -20000 || year > 2100) {
    return { error: "The portal reads from 20,000 BCE to 2100 CE." };
  }
  const atlasName = civilisationAt(region, year);
  const letters = typed.replace(/\d|bce|bc|ce|ad|,/gi, " ").replace(/\s+/g, " ").trim();
  const namedByPlayer = letters.length >= 3 && !(parsed.gazetteerName && parsed.region === region);
  const civilisation = namedByPlayer ? typed.replace(/\s+/g, " ") : (parsed.gazetteerName && parsed.region === region ? parsed.gazetteerName : atlasName);
  return historicalCore(region, Math.round(year), civilisation, namedByPlayer);
}

export function latticeNodes(): LatticeNode[] {
  const nodes: LatticeNode[] = [];
  RELAYS.forEach((relay, relayIndex) => {
    WEBS.forEach((web, webIndex) => {
      INTEGRATION_LEVELS.forEach((level) => {
        const angle = (relayIndex / RELAYS.length) * Math.PI * 2 + (level - 1) * 0.012;
        const radius = 18 + webIndex * 14 + (level - 1) * 2.15;
        nodes.push({
          id: `${relay.id}-${web}-L${level}`,
          relay: relay.id,
          relayName: relay.name,
          web,
          level,
          angle,
          radius,
        });
      });
    });
  });
  return nodes;
}

export function blankCaptureBook(): CaptureBook {
  return { xp: 0, scanCount: 0, captured: {} };
}

export function awardCapture(book: CaptureBook, species: Species, level: IntegrationLevel): { book: CaptureBook; award: CaptureAward } {
  const previous = book.captured[String(species.id)] ?? 0;
  const isNew = previous === 0;
  const xpAwarded = isNew
    ? Math.round(RARITY_XP[species.rarity] * (1 + Math.log(Math.max(1, level))))
    : Math.round(RARITY_XP[species.rarity] * 0.1);
  const next: CaptureBook = {
    xp: book.xp + xpAwarded,
    scanCount: book.scanCount + 1,
    captured: {
      ...book.captured,
      [String(species.id)]: Math.max(previous, level),
    },
  };
  return { book: next, award: { xpAwarded, isNew, species } };
}

export function noteUnmatchedScan(book: CaptureBook): CaptureBook {
  return { ...book, scanCount: book.scanCount + 1 };
}

export function capturedCount(book: CaptureBook): number {
  return Object.keys(book.captured).length;
}

export const QUEST_INFRADEX_TOTAL = INFRADEX_TOTAL;
export const QUEST_LATTICE_COUNT = WEBS.length * RELAYS.length * INTEGRATION_LEVELS.length;
export const RARITY_ORDER = RARITIES;

/** Colour and edge signature from RGBA pixels. Used by the photograph path. */
export function cuesFromRgba(rgba: Uint8ClampedArray, width: number, height: number): ImageCue {
  let warm = 0;
  let green = 0;
  let blue = 0;
  let grey = 0;
  let bright = 0;
  let count = 0;
  let edge = 0;
  let edgeCount = 0;
  let horizontal = 0;
  let vertical = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const red = rgba[index] ?? 0;
      const greenChannel = rgba[index + 1] ?? 0;
      const blueChannel = rgba[index + 2] ?? 0;
      const max = Math.max(red, greenChannel, blueChannel);
      const min = Math.min(red, greenChannel, blueChannel);
      const saturation = max === 0 ? 0 : (max - min) / max;
      bright += (red + greenChannel + blueChannel) / (3 * 255);
      if (saturation < 0.16) grey += 1;
      else if (red >= greenChannel && red >= blueChannel) warm += 1;
      else if (greenChannel >= red && greenChannel >= blueChannel) green += 1;
      else blue += 1;
      count += 1;
      if (x + 1 < width) {
        const next = index + 4;
        const delta = Math.abs(red - (rgba[next] ?? 0)) + Math.abs(greenChannel - (rgba[next + 1] ?? 0)) + Math.abs(blueChannel - (rgba[next + 2] ?? 0));
        edge += delta;
        horizontal += delta;
        edgeCount += 1;
      }
      if (y + 1 < height) {
        const next = ((y + 1) * width + x) * 4;
        const delta = Math.abs(red - (rgba[next] ?? 0)) + Math.abs(greenChannel - (rgba[next + 1] ?? 0)) + Math.abs(blueChannel - (rgba[next + 2] ?? 0));
        edge += delta;
        vertical += delta;
        edgeCount += 1;
      }
    }
  }
  const safe = Math.max(1, count);
  return {
    warm: warm / safe,
    green: green / safe,
    blue: blue / safe,
    grey: grey / safe,
    bright: bright / safe,
    edge: Math.min(1, edge / Math.max(1, edgeCount) / 180),
    horizontal: horizontal / (horizontal + vertical + 1),
  };
}
