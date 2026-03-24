/**
 * Relay Dilemmas — "What Would You Do?" branching choice content.
 * Each relay ends with a historical dilemma where the player faces two choices.
 * Choices build a Decision Profile across 12 relays, influencing DAVID's narration
 * and the player's civilisational archetype.
 *
 * Archetypes:
 *   builder    — pragmatic, construction-focused, "build it now"
 *   philosopher — reflective, meaning-focused, "understand it first"
 *   pragmatist  — efficiency-focused, "what works fastest"
 *   visionary   — future-focused, "what could this become"
 *
 * Design source: GDP v2.1 Section 15.4 (Competitive Landscape → Design Implications)
 * Inspired by: Murder on the Yangtze River (branching narrative), Underdog Detective (puzzle + decision)
 */

export interface DilemmaChoice {
  id: string;
  label: string;
  description: string;
  archetype: "builder" | "philosopher" | "pragmatist" | "visionary";
  davidResponse: string; // DAVID's spoken reaction to this choice
}

export interface RelayDilemma {
  relayNumber: number;
  title: string;
  scenario: string;
  choices: [DilemmaChoice, DilemmaChoice];
}

export const RELAY_DILEMMAS: RelayDilemma[] = [
  {
    relayNumber: 1,
    title: "The First Fire",
    scenario: "Your tribe has just learned to control fire. A neighbouring group, shivering in the cold, approaches your camp. Sharing fire means they survive — but it also means they could become rivals. What do you do?",
    choices: [
      {
        id: "relay1_share",
        label: "Share the fire",
        description: "Knowledge shared is knowledge doubled. Teach them to build their own.",
        archetype: "visionary",
        davidResponse: "Generous. You chose to spread knowledge rather than hoard power. The visionary sees that a warm neighbour is better than a cold enemy.",
      },
      {
        id: "relay1_guard",
        label: "Guard the secret",
        description: "Your people discovered it. Protect what you've built before giving it away.",
        archetype: "builder",
        davidResponse: "Protective. You chose to secure your own foundation first. The builder knows that you cannot share what you haven't yet mastered.",
      },
    ],
  },
  {
    relayNumber: 2,
    title: "The Sacred Grove",
    scenario: "Your settlement needs timber to build shelters before winter. The best trees grow in a grove your elders call sacred — home to medicinal plants your healers depend on. Do you cut the trees or find another way?",
    choices: [
      {
        id: "relay2_preserve",
        label: "Preserve the grove",
        description: "Find alternative materials. The grove's medicines are irreplaceable.",
        archetype: "philosopher",
        davidResponse: "Thoughtful. You chose long-term wisdom over short-term shelter. The philosopher understands that some resources are worth more standing than felled.",
      },
      {
        id: "relay2_harvest",
        label: "Harvest selectively",
        description: "Take only what you need. Replant saplings. Build now, restore later.",
        archetype: "pragmatist",
        davidResponse: "Balanced. You chose to act with measured urgency. The pragmatist finds the middle path — build what's needed, replace what's taken.",
      },
    ],
  },
  {
    relayNumber: 3,
    title: "The Flood Warning",
    scenario: "You're an engineer in ancient Mesopotamia. The river is rising faster than expected. You can reinforce the irrigation canals to save this year's crops, or redirect the water to fill the city's emergency reservoirs. You can't do both in time.",
    choices: [
      {
        id: "relay3_crops",
        label: "Save the crops",
        description: "Feed the people now. A hungry city cannot plan for tomorrow.",
        archetype: "pragmatist",
        davidResponse: "Practical. You chose immediate survival. The pragmatist knows that a city must eat today to think about tomorrow.",
      },
      {
        id: "relay3_reservoirs",
        label: "Fill the reservoirs",
        description: "This flood will pass, but drought follows flood. Store water for the long siege.",
        archetype: "visionary",
        davidResponse: "Strategic. You chose to prepare for what comes next. The visionary sees past the current crisis to the one that follows.",
      },
    ],
  },
  {
    relayNumber: 4,
    title: "The Horse Trade",
    scenario: "A merchant offers you the fastest horse on the steppe — bred for war, capable of outrunning any rival. The price: your entire stock of bronze tools, the foundation of your settlement's craft economy. Speed or industry?",
    choices: [
      {
        id: "relay4_horse",
        label: "Buy the horse",
        description: "Speed changes everything. With this horse, you can trade across distances no one else can reach.",
        archetype: "visionary",
        davidResponse: "Bold. You chose velocity over stability. The visionary bets on mobility — the horse doesn't just carry a rider, it carries an empire's ambition.",
      },
      {
        id: "relay4_tools",
        label: "Keep the tools",
        description: "Bronze built this settlement. Trade the tools away and you trade away your ability to build.",
        archetype: "builder",
        davidResponse: "Grounded. You chose to protect your productive capacity. The builder knows that tools make more tools — a horse only makes more horses.",
      },
    ],
  },
  {
    relayNumber: 5,
    title: "The Roman Crossroads",
    scenario: "You're a Roman road engineer. Your legion commander orders a direct road through a mountain — faster for the army, but it will take years and cost lives. The alternative: a longer route through the valley that connects three existing towns and can be built in months.",
    choices: [
      {
        id: "relay5_mountain",
        label: "Cut through the mountain",
        description: "The straight road serves the empire for centuries. Short-term pain, permanent gain.",
        archetype: "builder",
        davidResponse: "Ambitious. You chose the permanent solution. The builder thinks in centuries, not seasons. That road will outlast the empire that built it.",
      },
      {
        id: "relay5_valley",
        label: "Take the valley route",
        description: "Connect what already exists. Three towns linked is worth more than one mountain conquered.",
        archetype: "pragmatist",
        davidResponse: "Efficient. You chose to multiply existing value. The pragmatist connects what's there rather than forcing what isn't.",
      },
    ],
  },
  {
    relayNumber: 6,
    title: "The Navigator's Gamble",
    scenario: "Your ship has reached uncharted waters. The crew wants to turn back — supplies are running low and storms are building. But the stars suggest land is close. Your navigator disagrees with your cartographer. Trust the stars or trust the crew?",
    choices: [
      {
        id: "relay6_stars",
        label: "Follow the stars",
        description: "The mathematics don't lie. Land is there. Push forward one more day.",
        archetype: "visionary",
        davidResponse: "Courageous. You chose to trust the data over the fear. The visionary follows the evidence even when the crowd says turn back.",
      },
      {
        id: "relay6_crew",
        label: "Listen to the crew",
        description: "A ship is its people. Return safely, resupply, and try again with better preparation.",
        archetype: "philosopher",
        davidResponse: "Wise. You chose to value the people over the prize. The philosopher knows that discovery means nothing if no one survives to tell the story.",
      },
    ],
  },
  {
    relayNumber: 7,
    title: "The Jacquard Dilemma",
    scenario: "You've invented a punch-card loom that can weave patterns automatically. The silk weavers' guild is furious — your machine will replace hundreds of skilled artisans. You could sell the patent to a factory owner, or open-source the design so every weaver can adapt.",
    choices: [
      {
        id: "relay7_opensource",
        label: "Open the design",
        description: "Let every weaver learn the new way. The technology should serve the craft, not replace it.",
        archetype: "philosopher",
        davidResponse: "Principled. You chose to democratise the technology. The philosopher believes that knowledge locked behind a patent is knowledge wasted.",
      },
      {
        id: "relay7_patent",
        label: "Sell the patent",
        description: "Fund the next invention. Progress needs capital, and capital needs returns.",
        archetype: "pragmatist",
        davidResponse: "Strategic. You chose to fund the future with the present. The pragmatist knows that invention without investment is just a clever idea.",
      },
    ],
  },
  {
    relayNumber: 8,
    title: "The Standard Gauge",
    scenario: "Three railway companies are building towards the same city, each using a different track gauge. You're the government engineer tasked with choosing the standard. The widest gauge is safest but most expensive. The narrowest is cheapest but limits future expansion. The middle gauge is... in the middle.",
    choices: [
      {
        id: "relay8_wide",
        label: "Choose the wide gauge",
        description: "Build for the future. Safety and capacity matter more than today's budget.",
        archetype: "builder",
        davidResponse: "Far-sighted. You chose the standard that serves the next century, not the next quarter. The builder knows that infrastructure outlives the accountants who fund it.",
      },
      {
        id: "relay8_middle",
        label: "Choose the middle gauge",
        description: "Compromise is not weakness. The middle path gets all three companies building now.",
        archetype: "pragmatist",
        davidResponse: "Diplomatic. You chose the standard that gets everyone moving. The pragmatist knows that a good standard adopted is better than a perfect standard debated.",
      },
    ],
  },
  {
    relayNumber: 9,
    title: "The Engine's Price",
    scenario: "Your internal combustion engine works brilliantly — but the exhaust is toxic. A rival inventor has a cleaner design that's 30% less powerful. The factory owners want your engine. The city's doctors want the rival's. Whose engine goes into production?",
    choices: [
      {
        id: "relay9_power",
        label: "Your powerful engine",
        description: "Power drives progress. Clean it up later when the technology matures.",
        archetype: "builder",
        davidResponse: "Driven. You chose raw capability over caution. The builder pushes forward, trusting that problems created by progress are solved by more progress.",
      },
      {
        id: "relay9_clean",
        label: "The cleaner engine",
        description: "What good is power if it poisons the people who use it? Start clean, scale later.",
        archetype: "philosopher",
        davidResponse: "Responsible. You chose health over horsepower. The philosopher asks not just 'can we build it?' but 'should we build it this way?'",
      },
    ],
  },
  {
    relayNumber: 10,
    title: "The Triple Convergence",
    scenario: "It's 1945. You lead an engineering team that can build either a new civilian airport connecting three cities, or a military airfield that the government will pay for entirely. The civilian airport serves the public but needs private funding. The military airfield is guaranteed but serves only one purpose.",
    choices: [
      {
        id: "relay10_civilian",
        label: "Build the civilian airport",
        description: "Infrastructure should serve everyone. Find the funding. Connect the cities.",
        archetype: "visionary",
        davidResponse: "Idealistic. You chose public good over guaranteed payment. The visionary builds for the many, even when the few are offering easier money.",
      },
      {
        id: "relay10_military",
        label: "Build the military airfield",
        description: "Secure funding means secure jobs. Build it now, convert it to civilian use later.",
        archetype: "pragmatist",
        davidResponse: "Realistic. You chose the certain path. The pragmatist knows that many great civilian airports started as military airfields — function follows funding.",
      },
    ],
  },
  {
    relayNumber: 11,
    title: "The Orbital Choice",
    scenario: "Your satellite can either provide free internet to a remote region with no connectivity, or sell premium bandwidth to a wealthy city that will pay enough to fund three more satellites. More satellites means more coverage eventually — but the remote region needs help now.",
    choices: [
      {
        id: "relay11_free",
        label: "Free internet for the remote region",
        description: "Connectivity is a right, not a product. Serve the underserved first.",
        archetype: "philosopher",
        davidResponse: "Compassionate. You chose to serve need over profit. The philosopher believes that infrastructure exists to connect the disconnected, not to enrich the already connected.",
      },
      {
        id: "relay11_premium",
        label: "Sell premium bandwidth",
        description: "Three more satellites means three more regions served. Scale first, then distribute.",
        archetype: "visionary",
        davidResponse: "Calculated. You chose to multiply your capacity before distributing it. The visionary plays the long game — one satellite helps one region, four satellites help four.",
      },
    ],
  },
  {
    relayNumber: 12,
    title: "The Human Node",
    scenario: "You've reached the final relay. The Civilisation Clock stands at one minute to midnight. You can use your accumulated knowledge to build one last thing: a school that teaches everything you've learned to the next generation, or a monument that preserves everything you've learned for a future civilisation to find. Teach the living, or archive for the unborn?",
    choices: [
      {
        id: "relay12_school",
        label: "Build the school",
        description: "Knowledge lives in people, not in stone. Teach them. Trust them. Let them carry it forward.",
        archetype: "visionary",
        davidResponse: "Human. You chose to invest in consciousness itself. The visionary knows that the twelfth relay is not a building or a machine — it is the human node. You are the infrastructure.",
      },
      {
        id: "relay12_monument",
        label: "Build the monument",
        description: "People forget. Stone endures. If this civilisation falls, the next one needs a starting point.",
        archetype: "builder",
        davidResponse: "Enduring. You chose permanence over presence. The builder creates something that outlasts its creator — a message in a bottle for a civilisation not yet born.",
      },
    ],
  },
];

/**
 * Archetype descriptions for the Decision Profile summary.
 */
export const ARCHETYPES = {
  builder: {
    name: "The Builder",
    description: "You build first, ask questions later. Infrastructure is your language. When others debate, you pour concrete.",
    emoji: "🏗️",
    color: "#f59e0b",
  },
  philosopher: {
    name: "The Philosopher",
    description: "You ask 'why' before 'how'. Understanding matters more than speed. The examined infrastructure is the only infrastructure worth building.",
    emoji: "📖",
    color: "#8b5cf6",
  },
  pragmatist: {
    name: "The Pragmatist",
    description: "You find the middle path. Efficiency is your compass. The best solution is the one that works now and adapts later.",
    emoji: "⚖️",
    color: "#22c55e",
  },
  visionary: {
    name: "The Visionary",
    description: "You see what isn't there yet. The future is your blueprint. You build for the civilisation that comes after this one.",
    emoji: "🔭",
    color: "#3b82f6",
  },
} as const;

export type ArchetypeKey = keyof typeof ARCHETYPES;

/**
 * Calculate the dominant archetype from a set of choices.
 */
export function calculateArchetype(choices: { archetype: string }[]): ArchetypeKey {
  const counts: Record<string, number> = {};
  for (const c of choices) {
    counts[c.archetype] = (counts[c.archetype] || 0) + 1;
  }
  let max = 0;
  let dominant: ArchetypeKey = "builder";
  for (const [key, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      dominant = key as ArchetypeKey;
    }
  }
  return dominant;
}
