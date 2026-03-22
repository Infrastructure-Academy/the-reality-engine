// ─── 12 Civilisational Relays ───
export const RELAYS = [
  { number: 1, name: "Fire", subtitle: "The Eternal Constant", emoji: "🔥", era: "pre-10,000 BCE", webType: "Natural", color: "#ef4444" },
  { number: 2, name: "Tree", subtitle: "The Living Foundation", emoji: "🌳", era: "10,000–5,000 BCE", webType: "Natural", color: "#22c55e" },
  { number: 3, name: "River", subtitle: "Cradles of Continuity", emoji: "🌊", era: "5,000–3,000 BCE", webType: "Natural", color: "#3b82f6" },
  { number: 4, name: "Horse", subtitle: "The Velocity of Intent", emoji: "🐎", era: "3,000–1,000 BCE", webType: "Machine", color: "#d97706" },
  { number: 5, name: "Roads", subtitle: "Arteries of Intent", emoji: "🛤️", era: "1,000 BCE–500 CE", webType: "Machine", color: "#a16207" },
  { number: 6, name: "Ships", subtitle: "The Master Weaver's Reach", emoji: "⛵", era: "500–1500 CE", webType: "Machine", color: "#0891b2" },
  { number: 7, name: "Loom", subtitle: "The Binary Birth", emoji: "🧶", era: "1500–1760 CE", webType: "Digital", color: "#9333ea" },
  { number: 8, name: "Rail", subtitle: "Standardizing the Continental Rhythm", emoji: "🚂", era: "1760–1870 CE", webType: "Machine", color: "#64748b" },
  { number: 9, name: "Engine", subtitle: "The Internal Revolution", emoji: "⚙️", era: "1870–1914 CE", webType: "Machine", color: "#b45309" },
  { number: 10, name: "AAA Triad", subtitle: "The Triple Convergence", emoji: "✈️", era: "1914–1969 CE", webType: "Digital", color: "#0284c7" },
  { number: 11, name: "Orbit", subtitle: "The Programmable Frontier", emoji: "🛰️", era: "1969–2025 CE", webType: "Digital", color: "#6366f1" },
  { number: 12, name: "Human Nodes", subtitle: "The Torus Metaphor", emoji: "🧠", era: "2025+ CE", webType: "Consciousness", color: "#a855f7" },
] as const;

// ─── 5 Great Webs ───
export const WEBS = [
  { name: "Natural", icon: "🌿", color: "#22c55e", description: "Biological systems, ecosystems, and natural forces" },
  { name: "Machine", icon: "⚙️", color: "#f59e0b", description: "Engines, structures, and physical infrastructure" },
  { name: "Digital", icon: "💻", color: "#3b82f6", description: "Communications, computing, and signal networks" },
  { name: "Biological", icon: "🧬", color: "#ec4899", description: "Medicine, genetics, and biological engineering" },
  { name: "Consciousness", icon: "🧠", color: "#a855f7", description: "Awareness, philosophy, and collective intelligence" },
] as const;

// ─── FITS Temperament Types ───
export const FITS_TYPES = [
  { id: "senser", name: "Senser", abbr: "S", description: "Scouts ahead, reads the terrain, maps the unknown", web: "Natural", craft: "TB-1", color: "#22c55e" },
  { id: "thinker", name: "Thinker", abbr: "T", description: "Builds, engineers, constructs — where the Thinker lands, civilisation follows", web: "Machine", craft: "TB-2", color: "#f59e0b" },
  { id: "intuitive", name: "Intuitive", abbr: "I", description: "Connects, communicates, weaves the digital web across all nodes", web: "Digital", craft: "TB-3", color: "#3b82f6" },
  { id: "feeler", name: "Feeler", abbr: "F", description: "Heals, sustains, carries the conscience of the fleet", web: "Biological", craft: "TB-4", color: "#ec4899" },
  { id: "balanced", name: "Balanced", abbr: "B", description: "Commands, coordinates, holds the Dearden Field together from above", web: "Consciousness", craft: "TB-5", color: "#a855f7" },
] as const;

// ─── MPNC Fleet Craft ───
export const CRAFTS = [
  {
    id: "tb1", name: "TB-1 Pathfinder", className: "Arrow-Class", pilot: "Scott / IQ",
    role: "RAPID-RESPONSE RECONNAISSANCE",
    description: "Long-range reconnaissance craft built for terrain mapping and environmental survey. First to arrive, first to report.",
    fits: "senser", web: "Natural",
    stats: { speed: 9, armour: 4, sensors: 8, range: 10, stealth: 7 },
    xpBonus: "+20% XP on Natural Relays",
  },
  {
    id: "tb2", name: "TB-2 Forgemaster", className: "Griffin-Class", pilot: "Virgil / EQ",
    role: "HEAVY ENGINEERING & CONSTRUCTION",
    description: "Heavy-lift engineering platform carrying modular pods for construction, demolition, and infrastructure deployment.",
    fits: "thinker", web: "Machine",
    stats: { speed: 4, armour: 9, sensors: 6, range: 7, stealth: 2 },
    xpBonus: "+20% XP on Machine Relays",
  },
  {
    id: "tb3", name: "TB-3 Starcaster", className: "Zeta-Class", pilot: "Alan / CQ",
    role: "COMMUNICATIONS & SIGNAL INTELLIGENCE",
    description: "Orbital communications relay and deep-space signal intelligence vessel. The Starcaster weaves the digital web.",
    fits: "intuitive", web: "Digital",
    stats: { speed: 7, armour: 3, sensors: 10, range: 9, stealth: 8 },
    xpBonus: "+20% XP on Digital Relays",
  },
  {
    id: "tb4", name: "TB-4 Lifeline", className: "Leviathan-Class", pilot: "Gordon / Deep CQ",
    role: "MEDICAL & HUMANITARIAN RESPONSE",
    description: "Medical and humanitarian response vessel equipped with BioAura diagnostic suites. Where others build, she heals.",
    fits: "feeler", web: "Biological",
    stats: { speed: 6, armour: 5, sensors: 7, range: 8, stealth: 6 },
    xpBonus: "+20% XP on Biological Relays",
  },
  {
    id: "tb5", name: "TB-5 Sentinel", className: "Citadel-Class", pilot: "John / HQ",
    role: "COMMAND & CONTROL / OVERWATCH",
    description: "Command and control station maintaining persistent orbital overwatch. The Sentinel sees all, coordinates all.",
    fits: "balanced", web: "Consciousness",
    stats: { speed: 3, armour: 8, sensors: 9, range: 6, stealth: 5 },
    xpBonus: "+15% XP on Consciousness Relays",
  },
] as const;

// ─── Ability Score Names (Scholar Mode) ───
export const ABILITY_SCORES = [
  { id: "observation", name: "Observation", abbr: "OBS", description: "Perception and awareness of infrastructure patterns" },
  { id: "analysis", name: "Analysis", abbr: "ANA", description: "Logical reasoning and systems thinking" },
  { id: "synthesis", name: "Synthesis", abbr: "SYN", description: "Combining knowledge across domains" },
  { id: "communication", name: "Communication", abbr: "COM", description: "Articulating ideas and persuading others" },
  { id: "implementation", name: "Implementation", abbr: "IMP", description: "Practical application and project execution" },
  { id: "vision", name: "Vision", abbr: "VIS", description: "Strategic foresight and civilisational thinking" },
] as const;

// ─── XP Constants ───
export const XP_CAP = 24_000_000;
export const GURU_THRESHOLD = 1_000_000;
export const BITPOINT_RATE = 100; // 1 BitPoint per 100 XP

// ─── Mode Definitions ───
export const MODES = {
  explorer: {
    id: "explorer",
    name: "Explorer",
    ageRange: "Ages 8–14",
    emoji: "🔥",
    tagline: "Tap-to-discover through 12 Civilisational Relays",
    features: [
      "No login required — jump straight in",
      "Visual discovery — tap relays, unlock stories",
      "12 relays, 91+ inventions to find",
    ],
    cta: "QUICK PLAY",
    entry: "/explore",
    color: "#ef4444",
  },
  flight_deck: {
    id: "flight_deck",
    name: "Flight Deck",
    ageRange: "Ages 14–18",
    emoji: "🛸",
    tagline: "The cockpit of civilisational navigation",
    features: [
      "Immersive cockpit HUD — feels like a real mission",
      "Dearden Field — 60-node matrix of relays x webs",
      "DAVID co-pilot guides your journey",
    ],
    cta: "LAUNCH FLIGHT DECK",
    entry: "/flight-deck",
    color: "#0ea5e9",
    recommended: true,
  },
  scholar: {
    id: "scholar",
    name: "Scholar",
    ageRange: "Ages 18+",
    emoji: "🧠",
    tagline: "The complete Infrastructure Odyssey",
    features: [
      "Full character creation — FITS type + D20 rolls",
      "DAVID AI narrator — your personal Dungeon Master",
      "Thesis + academic grading (24M XP cap)",
    ],
    cta: "BEGIN JOURNEY",
    entry: "/create",
    color: "#f59e0b",
  },
} as const;
