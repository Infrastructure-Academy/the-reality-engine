/**
 * InfraDex species, harvested from the ISI Calculator v68 client
 * (QuickScan catalogue of 143). Names and relay/web/rarity are the
 * instrument's own list. Scoring lives in questInstruments.ts and runs
 * on Quest. This file does not call or link to any other host.
 */
export const INFRADEX_TOTAL = 143;

export const RARITIES = ["Common", "Uncommon", "Rare", "Ultra-Rare", "Legendary"] as const;
export type Rarity = (typeof RARITIES)[number];

export const WEBS = ["Physical", "Biological", "Social", "Digital", "Consciousness"] as const;
export type WebName = (typeof WEBS)[number];

/**
 * Relay dawns as published on the Quest exhibition plates.
 * Engine (1769) is awake before Rail (1825); the numbers are not a clock.
 */
export const RELAYS = [
  { id: "R01", name: "Fire", dawn: -10000 },
  { id: "R02", name: "Tree", dawn: -8000 },
  { id: "R03", name: "River", dawn: -5000 },
  { id: "R04", name: "Horse", dawn: -4000 },
  { id: "R05", name: "Roads", dawn: -3000 },
  { id: "R06", name: "Ships", dawn: -2000 },
  { id: "R07", name: "Loom", dawn: -1000 },
  { id: "R08", name: "Rail", dawn: 1825 },
  { id: "R09", name: "Engine", dawn: 1769 },
  { id: "R10", name: "AAA Triad", dawn: 1903 },
  { id: "R11", name: "Orbit", dawn: 1957 },
  { id: "R12", name: "Human Nodes", dawn: 2024 },
] as const;
export type RelayId = (typeof RELAYS)[number]["id"];

export const INTEGRATION_LEVELS = [1, 2, 3, 4, 5] as const;
export type IntegrationLevel = (typeof INTEGRATION_LEVELS)[number];

export type Species = {
  id: number;
  relay: RelayId;
  name: string;
  rarity: Rarity;
  web: WebName;
};

export const INFRADEX: readonly Species[] = [
  { id: 1, relay: "R01", name: "Campfire / Cooking Hearth", rarity: "Common", web: "Physical" },
  { id: 2, relay: "R01", name: "Signal Fire / Beacon", rarity: "Uncommon", web: "Physical" },
  { id: 3, relay: "R01", name: "Furnace / Kiln", rarity: "Uncommon", web: "Physical" },
  { id: 4, relay: "R01", name: "Forge / Smithy", rarity: "Rare", web: "Physical" },
  { id: 5, relay: "R01", name: "Industrial Boiler", rarity: "Rare", web: "Physical" },
  { id: 6, relay: "R01", name: "Nuclear Reactor Core", rarity: "Ultra-Rare", web: "Physical" },
  { id: 7, relay: "R01", name: "Controlled Fusion Chamber", rarity: "Legendary", web: "Physical" },
  { id: 8, relay: "R01", name: "Pyrotechnic Display", rarity: "Common", web: "Physical" },
  { id: 9, relay: "R01", name: "Incinerator", rarity: "Common", web: "Physical" },
  { id: 10, relay: "R01", name: "Steam Engine Firebox", rarity: "Rare", web: "Physical" },
  { id: 11, relay: "R02", name: "Managed Woodland", rarity: "Common", web: "Biological" },
  { id: 12, relay: "R02", name: "Orchard", rarity: "Common", web: "Biological" },
  { id: 13, relay: "R02", name: "Timber Mill", rarity: "Uncommon", web: "Biological" },
  { id: 14, relay: "R02", name: "Wooden Bridge", rarity: "Uncommon", web: "Physical" },
  { id: 15, relay: "R02", name: "Log Cabin / Timber Structure", rarity: "Common", web: "Physical" },
  { id: 16, relay: "R02", name: "Paper Pulp Factory", rarity: "Rare", web: "Physical" },
  { id: 17, relay: "R02", name: "Arboretum", rarity: "Rare", web: "Biological" },
  { id: 18, relay: "R02", name: "Sacred Grove", rarity: "Ultra-Rare", web: "Consciousness" },
  { id: 19, relay: "R02", name: "Vertical Forest Building", rarity: "Ultra-Rare", web: "Biological" },
  { id: 20, relay: "R02", name: "Planetary Reforestation Grid", rarity: "Legendary", web: "Biological" },
  { id: 21, relay: "R03", name: "Aqueduct", rarity: "Rare", web: "Physical" },
  { id: 22, relay: "R03", name: "Dam", rarity: "Rare", web: "Physical" },
  { id: 23, relay: "R03", name: "Canal", rarity: "Uncommon", web: "Physical" },
  { id: 24, relay: "R03", name: "Reservoir", rarity: "Common", web: "Physical" },
  { id: 25, relay: "R03", name: "Water Treatment Plant", rarity: "Common", web: "Physical" },
  { id: 26, relay: "R03", name: "Flood Barrier", rarity: "Uncommon", web: "Physical" },
  { id: 27, relay: "R03", name: "Irrigation Channel", rarity: "Common", web: "Physical" },
  { id: 28, relay: "R03", name: "Hydroelectric Station", rarity: "Rare", web: "Physical" },
  { id: 29, relay: "R03", name: "Desalination Plant", rarity: "Rare", web: "Physical" },
  { id: 30, relay: "R03", name: "Sewage Works", rarity: "Common", web: "Physical" },
  { id: 31, relay: "R03", name: "Fountain / Public Water", rarity: "Common", web: "Social" },
  { id: 32, relay: "R03", name: "Qanat / Foggara", rarity: "Rare", web: "Physical" },
  { id: 33, relay: "R03", name: "Tidal Barrage", rarity: "Ultra-Rare", web: "Physical" },
  { id: 34, relay: "R03", name: "Ice Dam / Glacial Control", rarity: "Legendary", web: "Physical" },
  { id: 35, relay: "R04", name: "Stable / Mews", rarity: "Common", web: "Physical" },
  { id: 36, relay: "R04", name: "Horse Path / Bridleway", rarity: "Common", web: "Physical" },
  { id: 37, relay: "R04", name: "Coaching Inn", rarity: "Uncommon", web: "Social" },
  { id: 38, relay: "R04", name: "Post Relay Station", rarity: "Uncommon", web: "Social" },
  { id: 39, relay: "R04", name: "Cavalry Barracks", rarity: "Rare", web: "Social" },
  { id: 40, relay: "R04", name: "Horse-Drawn Tramway", rarity: "Rare", web: "Physical" },
  { id: 41, relay: "R04", name: "Hippodrome / Racecourse", rarity: "Uncommon", web: "Social" },
  { id: 42, relay: "R04", name: "Farrier / Blacksmith Shop", rarity: "Common", web: "Physical" },
  { id: 43, relay: "R04", name: "Chariot Workshop", rarity: "Rare", web: "Physical" },
  { id: 44, relay: "R04", name: "Nomadic Steppe Camp", rarity: "Ultra-Rare", web: "Social" },
  { id: 45, relay: "R05", name: "Highway / Motorway", rarity: "Common", web: "Physical" },
  { id: 46, relay: "R05", name: "Bridge", rarity: "Uncommon", web: "Physical" },
  { id: 47, relay: "R05", name: "Tunnel", rarity: "Uncommon", web: "Physical" },
  { id: 48, relay: "R05", name: "Overpass / Flyover", rarity: "Common", web: "Physical" },
  { id: 49, relay: "R05", name: "Roundabout", rarity: "Common", web: "Physical" },
  { id: 50, relay: "R05", name: "Cobblestone / Historic Road", rarity: "Rare", web: "Physical" },
  { id: 51, relay: "R05", name: "Causeway", rarity: "Rare", web: "Physical" },
  { id: 52, relay: "R05", name: "Mountain Pass", rarity: "Uncommon", web: "Physical" },
  { id: 53, relay: "R05", name: "Toll Road / Gate", rarity: "Uncommon", web: "Social" },
  { id: 54, relay: "R05", name: "Pedestrian Walkway", rarity: "Common", web: "Physical" },
  { id: 55, relay: "R05", name: "Cycling Infrastructure", rarity: "Common", web: "Physical" },
  { id: 56, relay: "R05", name: "Underground Passage", rarity: "Uncommon", web: "Physical" },
  { id: 57, relay: "R05", name: "Suspension Bridge", rarity: "Rare", web: "Physical" },
  { id: 58, relay: "R05", name: "Floating Bridge / Pontoon", rarity: "Ultra-Rare", web: "Physical" },
  { id: 59, relay: "R05", name: "Hyperloop Tube", rarity: "Legendary", web: "Digital" },
  { id: 60, relay: "R06", name: "Fishing Harbour", rarity: "Common", web: "Physical" },
  { id: 61, relay: "R06", name: "Container Terminal", rarity: "Uncommon", web: "Physical" },
  { id: 62, relay: "R06", name: "Dry Dock", rarity: "Rare", web: "Physical" },
  { id: 63, relay: "R06", name: "Lighthouse", rarity: "Rare", web: "Physical" },
  { id: 64, relay: "R06", name: "Canal Lock", rarity: "Uncommon", web: "Physical" },
  { id: 65, relay: "R06", name: "Pier / Jetty", rarity: "Common", web: "Physical" },
  { id: 66, relay: "R06", name: "Oil Rig", rarity: "Ultra-Rare", web: "Physical" },
  { id: 67, relay: "R06", name: "Cruise Terminal", rarity: "Uncommon", web: "Social" },
  { id: 68, relay: "R06", name: "Naval Base", rarity: "Rare", web: "Social" },
  { id: 69, relay: "R06", name: "Underwater Cable Landing", rarity: "Ultra-Rare", web: "Digital" },
  { id: 70, relay: "R06", name: "Floating City Module", rarity: "Legendary", web: "Physical" },
  { id: 71, relay: "R06", name: "Ferry Terminal", rarity: "Common", web: "Physical" },
  { id: 72, relay: "R07", name: "Textile Mill", rarity: "Uncommon", web: "Physical" },
  { id: 73, relay: "R07", name: "Punch Card Archive", rarity: "Rare", web: "Digital" },
  { id: 74, relay: "R07", name: "Telegraph Line", rarity: "Rare", web: "Digital" },
  { id: 75, relay: "R07", name: "Telephone Exchange", rarity: "Uncommon", web: "Digital" },
  { id: 76, relay: "R07", name: "Printing Press", rarity: "Rare", web: "Digital" },
  { id: 77, relay: "R07", name: "Early Mainframe Room", rarity: "Ultra-Rare", web: "Digital" },
  { id: 78, relay: "R07", name: "Data Centre", rarity: "Ultra-Rare", web: "Digital" },
  { id: 79, relay: "R07", name: "Fibre Optic Trunk", rarity: "Ultra-Rare", web: "Digital" },
  { id: 80, relay: "R07", name: "Smart Fabric Workshop", rarity: "Legendary", web: "Digital" },
  { id: 81, relay: "R07", name: "Binary Logic Processor", rarity: "Rare", web: "Digital" },
  { id: 82, relay: "R07", name: "Server Farm", rarity: "Uncommon", web: "Digital" },
  { id: 83, relay: "R07", name: "Quantum Computing Lab", rarity: "Legendary", web: "Digital" },
  { id: 84, relay: "R08", name: "Railway Station", rarity: "Common", web: "Physical" },
  { id: 85, relay: "R08", name: "Freight Yard", rarity: "Uncommon", web: "Physical" },
  { id: 86, relay: "R08", name: "Signal Box", rarity: "Uncommon", web: "Physical" },
  { id: 87, relay: "R08", name: "Railway Bridge / Viaduct", rarity: "Rare", web: "Physical" },
  { id: 88, relay: "R08", name: "Locomotive Depot", rarity: "Rare", web: "Physical" },
  { id: 89, relay: "R08", name: "Metro / Subway Tunnel", rarity: "Uncommon", web: "Physical" },
  { id: 90, relay: "R08", name: "Level Crossing", rarity: "Common", web: "Physical" },
  { id: 91, relay: "R08", name: "Maglev Track", rarity: "Ultra-Rare", web: "Physical" },
  { id: 92, relay: "R08", name: "High-Speed Rail Line", rarity: "Rare", web: "Physical" },
  { id: 93, relay: "R08", name: "Shunting Yard", rarity: "Uncommon", web: "Physical" },
  { id: 94, relay: "R08", name: "Narrow Gauge Heritage Line", rarity: "Rare", web: "Physical" },
  { id: 95, relay: "R08", name: "Transcontinental Trunk", rarity: "Ultra-Rare", web: "Physical" },
  { id: 96, relay: "R09", name: "Steam Turbine", rarity: "Rare", web: "Physical" },
  { id: 97, relay: "R09", name: "Internal Combustion Plant", rarity: "Uncommon", web: "Physical" },
  { id: 98, relay: "R09", name: "Gas Turbine", rarity: "Rare", web: "Physical" },
  { id: 99, relay: "R09", name: "Electric Motor Factory", rarity: "Uncommon", web: "Physical" },
  { id: 100, relay: "R09", name: "Automated Assembly Line", rarity: "Ultra-Rare", web: "Physical" },
  { id: 101, relay: "R09", name: "Rocket Engine Test Stand", rarity: "Ultra-Rare", web: "Physical" },
  { id: 102, relay: "R09", name: "Jet Engine", rarity: "Rare", web: "Physical" },
  { id: 103, relay: "R09", name: "Pumping Station", rarity: "Common", web: "Physical" },
  { id: 104, relay: "R09", name: "Compressor Station", rarity: "Uncommon", web: "Physical" },
  { id: 105, relay: "R09", name: "Electric Vehicle Charging Hub", rarity: "Common", web: "Physical" },
  { id: 106, relay: "R09", name: "Bio-Fuel Refinery", rarity: "Rare", web: "Biological" },
  { id: 107, relay: "R09", name: "Hydrogen Fuel Cell Plant", rarity: "Ultra-Rare", web: "Physical" },
  { id: 108, relay: "R09", name: "Nanoscale Molecular Motor", rarity: "Legendary", web: "Digital" },
  { id: 109, relay: "R10", name: "Airport Runway", rarity: "Uncommon", web: "Physical" },
  { id: 110, relay: "R10", name: "Air Traffic Control Tower", rarity: "Rare", web: "Digital" },
  { id: 111, relay: "R10", name: "Radio Transmitter Mast", rarity: "Uncommon", web: "Digital" },
  { id: 112, relay: "R10", name: "Automated Traffic Control", rarity: "Rare", web: "Digital" },
  { id: 113, relay: "R10", name: "Hangar", rarity: "Uncommon", web: "Physical" },
  { id: 114, relay: "R10", name: "Satellite Uplink Station", rarity: "Ultra-Rare", web: "Digital" },
  { id: 115, relay: "R10", name: "Cellular Tower", rarity: "Common", web: "Digital" },
  { id: 116, relay: "R10", name: "Aviation Fuel Farm", rarity: "Rare", web: "Physical" },
  { id: 117, relay: "R10", name: "Car Park / Multi-Storey", rarity: "Common", web: "Physical" },
  { id: 118, relay: "R10", name: "Drone Port", rarity: "Rare", web: "Digital" },
  { id: 119, relay: "R10", name: "Smart Intersection", rarity: "Uncommon", web: "Digital" },
  { id: 120, relay: "R10", name: "Global Navigation System", rarity: "Ultra-Rare", web: "Digital" },
  { id: 121, relay: "R11", name: "Satellite", rarity: "Ultra-Rare", web: "Digital" },
  { id: 122, relay: "R11", name: "Space Station Module", rarity: "Legendary", web: "Physical" },
  { id: 123, relay: "R11", name: "Launch Pad", rarity: "Ultra-Rare", web: "Physical" },
  { id: 124, relay: "R11", name: "Deep Space Network Dish", rarity: "Ultra-Rare", web: "Digital" },
  { id: 125, relay: "R11", name: "Orbital Solar Array", rarity: "Legendary", web: "Physical" },
  { id: 126, relay: "R11", name: "Space Elevator Anchor", rarity: "Legendary", web: "Physical" },
  { id: 127, relay: "R11", name: "Lunar Base", rarity: "Legendary", web: "Physical" },
  { id: 128, relay: "R11", name: "Mars Habitat", rarity: "Legendary", web: "Physical" },
  { id: 129, relay: "R11", name: "Orbital Debris Shield", rarity: "Ultra-Rare", web: "Physical" },
  { id: 130, relay: "R11", name: "Interplanetary Relay", rarity: "Legendary", web: "Digital" },
  { id: 131, relay: "R11", name: "Telescope / Observatory", rarity: "Rare", web: "Digital" },
  { id: 132, relay: "R12", name: "School / University", rarity: "Common", web: "Consciousness" },
  { id: 133, relay: "R12", name: "Hospital", rarity: "Common", web: "Social" },
  { id: 134, relay: "R12", name: "Court / Legal Building", rarity: "Uncommon", web: "Social" },
  { id: 135, relay: "R12", name: "Parliament / Government", rarity: "Uncommon", web: "Social" },
  { id: 136, relay: "R12", name: "Library / Archive", rarity: "Common", web: "Consciousness" },
  { id: 137, relay: "R12", name: "Religious Building", rarity: "Common", web: "Consciousness" },
  { id: 138, relay: "R12", name: "Prison", rarity: "Uncommon", web: "Social" },
  { id: 139, relay: "R12", name: "Embassy / Consulate", rarity: "Uncommon", web: "Social" },
  { id: 140, relay: "R12", name: "Research Laboratory", rarity: "Uncommon", web: "Consciousness" },
  { id: 141, relay: "R12", name: "Community Centre", rarity: "Common", web: "Social" },
  { id: 142, relay: "R12", name: "Stadium / Arena", rarity: "Uncommon", web: "Social" },
  { id: 143, relay: "R12", name: "Cemetery / Memorial", rarity: "Common", web: "Consciousness" },
];

export const RARITY_XP: Record<Rarity, number> = {
  Common: 50,
  Uncommon: 150,
  Rare: 400,
  "Ultra-Rare": 750,
  Legendary: 1000,
};

export const RARITY_COLOUR: Record<Rarity, string> = {
  Common: "#9CA3AF",
  Uncommon: "#22C55E",
  Rare: "#3B82F6",
  "Ultra-Rare": "#A855F7",
  Legendary: "#C9A227",
};

export function relayById(id: RelayId) {
  const relay = RELAYS.find((item) => item.id === id);
  if (!relay) throw new Error(`Unknown relay ${id}`);
  return relay;
}

export function speciesById(id: number): Species | null {
  return INFRADEX.find((item) => item.id === id) ?? null;
}
