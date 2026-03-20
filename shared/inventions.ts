// ─── Historical Invention Descriptions for all 12 Civilisational Relays ───
// Each invention has a name, short historical description, approximate date, and significance rating

export interface Invention {
  name: string;
  description: string;
  date: string;
  significance: "foundational" | "transformative" | "revolutionary" | "paradigm-shift";
}

export const INVENTIONS: Record<number, Invention[]> = {
  // ═══ RELAY 1: FIRE — The Eternal Constant ═══
  1: [
    { name: "Hearth", description: "The controlled domestic fire pit — humanity's first infrastructure. A fixed point around which shelters, cooking, and social gathering organised. The hearth turned nomads into settlers.", date: "~400,000 BCE", significance: "foundational" },
    { name: "Torch", description: "Portable fire — the first mobile technology. A burning branch carried into darkness extended human activity beyond daylight and enabled exploration of caves, forests, and the unknown.", date: "~400,000 BCE", significance: "foundational" },
    { name: "Kiln", description: "Enclosed high-temperature chamber for transforming raw clay into ceramic. The kiln gave humanity its first manufactured material — pottery — enabling food storage, trade, and surplus.", date: "~29,000 BCE", significance: "transformative" },
    { name: "Charcoal", description: "Wood heated in oxygen-starved conditions produces charcoal — a fuel that burns hotter and cleaner than raw timber. Without charcoal, metallurgy would have been impossible.", date: "~30,000 BCE", significance: "transformative" },
    { name: "Smelting", description: "The extraction of metal from ore using extreme heat. Copper smelting around 5000 BCE launched the Bronze Age. Every metal tool, weapon, and machine traces back to this moment.", date: "~5000 BCE", significance: "revolutionary" },
    { name: "Forge", description: "The blacksmith's workshop — where heated metal is hammered into shape. The forge became the factory of the ancient world, producing ploughs, swords, nails, and the infrastructure of empires.", date: "~3000 BCE", significance: "revolutionary" },
    { name: "Signal Fire", description: "Fire used as long-distance communication. Hilltop beacons relayed messages across hundreds of miles in minutes — the first telecommunications network, used from China to Greece.", date: "~800 BCE", significance: "transformative" },
    { name: "Cremation", description: "The ritual use of fire to transform the dead. Practised across cultures from India to Scandinavia, cremation reveals fire's role not just in technology but in philosophy and belief.", date: "~17,000 BCE", significance: "foundational" },
    { name: "Slash-and-Burn", description: "Controlled burning of forest to clear land for agriculture. This technique fed the Neolithic Revolution and enabled the first permanent farming settlements across every continent.", date: "~7000 BCE", significance: "paradigm-shift" },
  ],

  // ═══ RELAY 2: TREE — The Living Foundation ═══
  2: [
    { name: "Longhouse", description: "Timber-framed communal dwelling housing extended families. From Viking Scandinavia to Iroquois North America, the longhouse was civilisation's first scalable housing solution.", date: "~5000 BCE", significance: "foundational" },
    { name: "Palisade", description: "A defensive wall of sharpened wooden stakes. The palisade protected early settlements from raiders and predators — the first perimeter security infrastructure.", date: "~8000 BCE", significance: "foundational" },
    { name: "Dugout Canoe", description: "A boat carved from a single tree trunk. The dugout canoe opened rivers and coastlines to trade, migration, and exploration — humanity's first engineered vessel.", date: "~8000 BCE", significance: "transformative" },
    { name: "Wooden Plough", description: "The ard — a pointed wooden tool dragged through soil to create furrows. The plough multiplied agricultural output and made large-scale farming possible.", date: "~4000 BCE", significance: "revolutionary" },
    { name: "Timber Frame", description: "Interlocking wooden beams forming structural skeletons for buildings. Timber framing enabled multi-storey construction and remained the dominant building method for millennia.", date: "~3000 BCE", significance: "transformative" },
    { name: "Charcoal Kiln", description: "A purpose-built structure for converting timber to charcoal at industrial scale. Charcoal kilns fuelled the iron and steel industries that built the modern world.", date: "~2000 BCE", significance: "transformative" },
    { name: "Mast", description: "A tall timber pole supporting sails on a vessel. The mast transformed boats from paddled craft into wind-powered ships capable of crossing oceans.", date: "~3000 BCE", significance: "revolutionary" },
    { name: "Barrel", description: "Curved wooden staves bound with hoops to create a watertight container. The barrel revolutionised storage and transport — wine, grain, gunpowder, and water all travelled in barrels.", date: "~350 BCE", significance: "transformative" },
  ],

  // ═══ RELAY 3: RIVER — Cradles of Continuity ═══
  3: [
    { name: "Irrigation Canal", description: "Engineered channels diverting river water to farmland. Irrigation canals in Mesopotamia and Egypt turned arid plains into breadbaskets, feeding the first cities.", date: "~6000 BCE", significance: "paradigm-shift" },
    { name: "Aqueduct", description: "Gravity-fed water channels spanning valleys and mountains. Roman aqueducts delivered millions of litres daily to cities — an engineering feat unmatched for 1,500 years.", date: "~312 BCE", significance: "revolutionary" },
    { name: "Dam", description: "A barrier across a waterway to control flow and create reservoirs. The Sadd-el-Kafara in Egypt (2600 BCE) is the oldest known dam — water control as state infrastructure.", date: "~2600 BCE", significance: "revolutionary" },
    { name: "Shaduf", description: "A counterweighted lever for lifting water from rivers to irrigation channels. Simple, elegant, and still used today — the shaduf is 4,000 years of continuous engineering.", date: "~2000 BCE", significance: "foundational" },
    { name: "Qanat", description: "Underground tunnels tapping mountain groundwater and delivering it to desert settlements by gravity. Persian qanats are among the most sophisticated ancient infrastructure systems.", date: "~1000 BCE", significance: "transformative" },
    { name: "Nilometer", description: "A calibrated measuring device for tracking the Nile's annual flood levels. The Nilometer was ancient Egypt's most critical data instrument — flood prediction drove taxation, planting, and survival.", date: "~3000 BCE", significance: "transformative" },
    { name: "Reservoir", description: "Artificial lakes for storing water during dry seasons. Reservoirs in Sri Lanka (400 BCE) and Rome enabled year-round water supply independent of rainfall.", date: "~2500 BCE", significance: "transformative" },
    { name: "Water Mill", description: "A wheel turned by flowing water to grind grain. The water mill was the ancient world's first automated machine — replacing human labour with natural energy.", date: "~300 BCE", significance: "revolutionary" },
  ],

  // ═══ RELAY 4: HORSE — The Velocity of Intent ═══
  4: [
    { name: "Chariot", description: "A two-wheeled vehicle drawn by horses at speed. The chariot was the first weapons platform, the first rapid transport, and the symbol of power from Egypt to China.", date: "~2000 BCE", significance: "revolutionary" },
    { name: "Saddle", description: "A shaped seat strapped to a horse's back. The saddle transformed riding from precarious balance to stable platform — enabling cavalry, long-distance travel, and mounted combat.", date: "~700 BCE", significance: "transformative" },
    { name: "Stirrup", description: "Metal foot-loops hanging from the saddle. The stirrup gave riders a stable fighting platform and is credited with enabling the mounted knight — reshaping medieval warfare.", date: "~300 BCE", significance: "paradigm-shift" },
    { name: "Horseshoe", description: "An iron shoe nailed to the hoof to protect it on hard surfaces. Horseshoes extended working life and enabled horses to operate on paved roads and rocky terrain.", date: "~400 BCE", significance: "transformative" },
    { name: "Postal Relay", description: "A network of stations where riders swapped fresh horses to maintain speed over vast distances. The Persian Royal Road's relay system delivered messages 1,600 miles in 7 days.", date: "~550 BCE", significance: "revolutionary" },
    { name: "Cavalry", description: "Organised military units fighting on horseback. Cavalry dominated warfare for 2,500 years — from Alexander's Companions to the Mongol hordes to the charge at Waterloo.", date: "~900 BCE", significance: "revolutionary" },
    { name: "Horse Collar", description: "A padded collar distributing pulling force across the horse's shoulders instead of its throat. This simple invention tripled a horse's hauling capacity and revolutionised agriculture.", date: "~500 CE", significance: "transformative" },
  ],

  // ═══ RELAY 5: ROADS — Arteries of Intent ═══
  5: [
    { name: "Paved Road", description: "A prepared surface of stone, gravel, or brick for wheeled traffic. The Appian Way (312 BCE) set the standard — Roman roads connected an empire of 60 million people.", date: "~4000 BCE", significance: "paradigm-shift" },
    { name: "Milestone", description: "A stone marker indicating distance along a road. Roman milestones created the first standardised navigation system — every mile measured from the Golden Milestone in Rome.", date: "~250 BCE", significance: "foundational" },
    { name: "Bridge", description: "A structure spanning a gap to carry traffic. From timber beam bridges to Roman stone arches, bridges turned rivers from barriers into crossing points.", date: "~2000 BCE", significance: "revolutionary" },
    { name: "Drainage", description: "Engineered channels removing water from road surfaces. Roman roads featured cambered surfaces and side ditches — the drainage engineering that keeps roads usable in all weather.", date: "~500 BCE", significance: "transformative" },
    { name: "Tunnel", description: "An underground passage through rock or earth. The Tunnel of Eupalinos (530 BCE) on Samos was dug from both ends and met in the middle — ancient precision engineering.", date: "~530 BCE", significance: "transformative" },
    { name: "Causeway", description: "A raised road across water or marshy ground. Causeways connected islands, crossed swamps, and enabled year-round travel through terrain that would otherwise be impassable.", date: "~3000 BCE", significance: "foundational" },
    { name: "Way Station", description: "A rest stop along a major route providing food, shelter, and fresh animals. Way stations were the service infrastructure that made long-distance travel sustainable.", date: "~500 BCE", significance: "foundational" },
    { name: "Toll Gate", description: "A controlled access point where travellers paid for road use. Toll gates funded road maintenance and represented one of the earliest forms of infrastructure financing.", date: "~700 BCE", significance: "transformative" },
  ],

  // ═══ RELAY 6: SHIPS — The Master Weaver's Reach ═══
  6: [
    { name: "Keel", description: "A structural backbone running the length of a ship's hull. The keel gave vessels directional stability and strength — enabling larger ships and open-ocean voyages.", date: "~3000 BCE", significance: "revolutionary" },
    { name: "Lateen Sail", description: "A triangular sail allowing ships to sail closer to the wind. The lateen sail transformed maritime capability — Arab dhows and Mediterranean vessels could now navigate against prevailing winds.", date: "~200 CE", significance: "transformative" },
    { name: "Compass", description: "A magnetised needle pointing north. The compass freed navigation from coastal landmarks and star visibility — enabling voyages across featureless oceans in any weather.", date: "~1100 CE", significance: "paradigm-shift" },
    { name: "Caravel", description: "A small, highly manoeuvrable sailing ship developed in Portugal. The caravel carried Columbus, da Gama, and Magellan — the vessel that connected the world's continents.", date: "~1450 CE", significance: "revolutionary" },
    { name: "Astrolabe", description: "An astronomical instrument for measuring the altitude of celestial bodies. The astrolabe gave navigators latitude at sea — turning the sky into a map.", date: "~150 BCE", significance: "transformative" },
    { name: "Dry Dock", description: "An enclosed basin that can be drained to expose a ship's hull for repair. Dry docks enabled fleet maintenance at scale — the shipyard as industrial infrastructure.", date: "~200 BCE", significance: "transformative" },
    { name: "Lighthouse", description: "A tower with a powerful light guiding ships to safe harbour. The Pharos of Alexandria (280 BCE) stood 100 metres tall — one of the Seven Wonders and the archetype of all lighthouses.", date: "~280 BCE", significance: "revolutionary" },
    { name: "Sextant", description: "A precision instrument measuring the angle between a celestial body and the horizon. The sextant gave navigators both latitude and longitude — the tool that mapped the world.", date: "~1731 CE", significance: "transformative" },
    { name: "Anchor", description: "A heavy device lowered to the seabed to hold a vessel in position. The anchor turned any sheltered water into a temporary port — enabling trade, resupply, and exploration.", date: "~2000 BCE", significance: "foundational" },
  ],

  // ═══ RELAY 7: LOOM — The Binary Birth ═══
  7: [
    { name: "Spinning Jenny", description: "James Hargreaves' multi-spindle spinning frame (1764). One worker could now operate eight spindles simultaneously — the machine that launched the Industrial Revolution.", date: "1764 CE", significance: "revolutionary" },
    { name: "Power Loom", description: "Edmund Cartwright's mechanised weaving machine (1785). The power loom moved textile production from cottages to factories — creating the factory system itself.", date: "1785 CE", significance: "paradigm-shift" },
    { name: "Jacquard Mechanism", description: "Joseph-Marie Jacquard's punch-card-controlled loom (1804). Binary instructions woven into cards controlled complex patterns — the direct ancestor of computer programming.", date: "1804 CE", significance: "paradigm-shift" },
    { name: "Flying Shuttle", description: "John Kay's spring-loaded shuttle (1733) that doubled weaving speed. The flying shuttle created demand for faster spinning — triggering the cascade of textile inventions.", date: "1733 CE", significance: "transformative" },
    { name: "Cotton Gin", description: "Eli Whitney's machine (1793) separating cotton fibres from seeds 50 times faster than by hand. The cotton gin made cotton king — and tragically expanded plantation slavery.", date: "1793 CE", significance: "revolutionary" },
    { name: "Spinning Mule", description: "Samuel Crompton's hybrid machine (1779) combining the jenny and water frame. The mule produced fine, strong thread suitable for muslin — enabling mass production of quality textiles.", date: "1779 CE", significance: "transformative" },
    { name: "Punch Card", description: "A stiff card with holes encoding data or instructions. From Jacquard looms to Hollerith census machines to early IBM computers — the punch card was computing's first medium.", date: "1725 CE", significance: "paradigm-shift" },
  ],

  // ═══ RELAY 8: RAIL — Standardizing the Continental Rhythm ═══
  8: [
    { name: "Steam Locomotive", description: "George Stephenson's Rocket (1829) proved steam traction viable for passenger and freight rail. The locomotive shrank continents — London to Manchester in 2 hours instead of 2 days.", date: "1804 CE", significance: "paradigm-shift" },
    { name: "Standard Gauge", description: "The 4 ft 8½ in track width adopted as the global standard. Standardisation meant trains could run across networks without transhipment — interoperability as infrastructure principle.", date: "1846 CE", significance: "revolutionary" },
    { name: "Signal System", description: "Mechanical and later electrical systems controlling train movements on shared track. Signalling prevented collisions and enabled high-frequency services — safety as system design.", date: "1840 CE", significance: "transformative" },
    { name: "Steel Rail", description: "Henry Bessemer's steel process (1856) produced rails lasting 10 times longer than iron. Steel rails carried heavier loads at higher speeds — enabling the continental railway networks.", date: "1857 CE", significance: "revolutionary" },
    { name: "Railway Bridge", description: "Engineered structures carrying rail lines across rivers, valleys, and gorges. Brunel's Royal Albert Bridge and the Forth Bridge pushed engineering to new limits.", date: "1850 CE", significance: "transformative" },
    { name: "Turntable", description: "A rotating platform for redirecting locomotives. The turntable was the railway's routing mechanism — enabling engines to reverse direction and access multiple tracks from a single point.", date: "1830 CE", significance: "foundational" },
    { name: "Sleeper Car", description: "George Pullman's sleeping carriage (1865) made overnight rail travel comfortable. The sleeper car turned railways into mobile hotels — enabling transcontinental journeys.", date: "1865 CE", significance: "transformative" },
    { name: "Telegraph", description: "Electrical signals transmitted along wires at the speed of light. The telegraph followed the railway — together they created the first real-time communication network spanning continents.", date: "1837 CE", significance: "paradigm-shift" },
  ],

  // ═══ RELAY 9: ENGINE — The Internal Revolution ═══
  9: [
    { name: "Assembly Line", description: "Henry Ford's moving assembly line (1913) reduced Model T build time from 12 hours to 93 minutes. Mass production made the automobile affordable — and redefined manufacturing forever.", date: "1913 CE", significance: "paradigm-shift" },
    { name: "Highway", description: "Purpose-built roads for high-speed motor vehicle traffic. From Germany's Autobahn to America's Interstate system — highways reshaped geography, commerce, and daily life.", date: "1924 CE", significance: "revolutionary" },
    { name: "Fuel Station", description: "Roadside facilities dispensing petroleum fuel. The fuel station network enabled the automobile's range — creating a new infrastructure layer across every inhabited continent.", date: "1905 CE", significance: "transformative" },
    { name: "Traffic Light", description: "Automated signals controlling vehicle flow at intersections. The traffic light (1914) solved the coordination problem of shared road space — algorithmic infrastructure management.", date: "1914 CE", significance: "transformative" },
    { name: "Diesel Engine", description: "Rudolf Diesel's compression-ignition engine (1893) — more efficient than petrol and ideal for heavy transport. Diesel powers the trucks, ships, and trains that move global freight.", date: "1893 CE", significance: "revolutionary" },
    { name: "Tractor", description: "A motorised vehicle designed for agricultural work. The tractor replaced the horse on farms — one machine doing the work of twenty animals, feeding the 20th century's population boom.", date: "1892 CE", significance: "revolutionary" },
    { name: "Automobile", description: "Karl Benz's Patent-Motorwagen (1886) — the first true automobile. The car gave individuals unprecedented mobility and reshaped cities, suburbs, and the very concept of distance.", date: "1886 CE", significance: "paradigm-shift" },
  ],

  // ═══ RELAY 10: AAA TRIAD — The Triple Convergence ═══
  10: [
    { name: "Biplane", description: "The Wright Brothers' Flyer (1903) proved powered heavier-than-air flight possible. Within 40 years, aircraft would carry passengers across oceans and bombs across continents.", date: "1903 CE", significance: "paradigm-shift" },
    { name: "Jet Engine", description: "Frank Whittle and Hans von Ohain's turbojet (1939) doubled aircraft speed. Jet propulsion made intercontinental travel routine — shrinking the world to hours instead of weeks.", date: "1939 CE", significance: "revolutionary" },
    { name: "Radio Broadcast", description: "Guglielmo Marconi's wireless transmission (1895) freed communication from wires. Radio broadcast created mass media — one voice reaching millions simultaneously for the first time.", date: "1895 CE", significance: "revolutionary" },
    { name: "Television", description: "John Logie Baird and Philo Farnsworth's electronic image transmission (1927). Television brought moving pictures into every home — the most powerful mass communication tool ever created.", date: "1927 CE", significance: "paradigm-shift" },
    { name: "Radar", description: "Radio Detection and Ranging — using radio waves to detect objects at distance. Radar won the Battle of Britain and now guides every aircraft and ship on Earth.", date: "1935 CE", significance: "revolutionary" },
    { name: "Motorway", description: "Multi-lane divided highways designed for high-speed, high-volume traffic. Motorways connected cities into metropolitan regions and enabled the logistics networks of modern commerce.", date: "1924 CE", significance: "transformative" },
    { name: "Airport", description: "Purpose-built facilities for aircraft operations, passenger processing, and cargo handling. Airports became the new ports — nodes in a global network measured in flight-hours.", date: "1920 CE", significance: "transformative" },
    { name: "Satellite Dish", description: "A parabolic antenna receiving signals from orbiting satellites. Satellite dishes brought global television, internet, and telephony to every corner of the planet.", date: "1962 CE", significance: "transformative" },
    { name: "Transistor", description: "Bell Labs' semiconductor switch (1947) — the building block of all modern electronics. The transistor replaced vacuum tubes and launched the digital age. Every chip contains billions.", date: "1947 CE", significance: "paradigm-shift" },
  ],

  // ═══ RELAY 11: ORBIT — The Programmable Frontier ═══
  11: [
    { name: "GPS", description: "The Global Positioning System — 24+ satellites providing centimetre-accurate location data worldwide. GPS underpins navigation, logistics, agriculture, finance, and emergency services.", date: "1978 CE", significance: "paradigm-shift" },
    { name: "Internet Protocol", description: "TCP/IP — the universal language of networked computers. Vint Cerf and Bob Kahn's protocol suite (1974) enabled any computer to talk to any other — creating the Internet.", date: "1974 CE", significance: "paradigm-shift" },
    { name: "Cloud Computing", description: "On-demand computing resources delivered over the Internet. Cloud computing eliminated the need for local servers — making supercomputer-scale processing available to anyone with a browser.", date: "2006 CE", significance: "revolutionary" },
    { name: "Fibre Optic", description: "Glass strands transmitting data as pulses of light at near-lightspeed. Submarine fibre optic cables carry 99% of intercontinental data — the invisible backbone of the digital world.", date: "1970 CE", significance: "revolutionary" },
    { name: "Solar Panel", description: "Photovoltaic cells converting sunlight directly into electricity. Solar panels offer distributed, renewable energy generation — infrastructure that harvests the most abundant resource in the solar system.", date: "1954 CE", significance: "revolutionary" },
    { name: "Space Station", description: "A habitable artificial satellite supporting long-duration human presence in orbit. The ISS (1998) is humanity's first permanent off-world infrastructure — a laboratory 400 km above Earth.", date: "1971 CE", significance: "transformative" },
    { name: "Microprocessor", description: "Intel's 4004 (1971) — an entire computer processor on a single chip. The microprocessor put computing power into everything from cars to calculators to spacecraft.", date: "1971 CE", significance: "paradigm-shift" },
    { name: "Smartphone", description: "A pocket computer combining phone, camera, GPS, internet, and thousands of applications. The smartphone (2007) put more computing power in your hand than Apollo 11 had on board.", date: "2007 CE", significance: "paradigm-shift" },
  ],

  // ═══ RELAY 12: HUMAN NODES — The Torus Metaphor ═══
  12: [
    { name: "Neural Interface", description: "Direct communication pathways between the human brain and external devices. Neural interfaces promise to merge biological cognition with digital processing — the next frontier of human capability.", date: "2020+ CE", significance: "paradigm-shift" },
    { name: "Quantum Computer", description: "Computers exploiting quantum mechanical phenomena to solve problems impossible for classical machines. Quantum computing could crack encryption, simulate molecules, and optimise global logistics.", date: "2019 CE", significance: "paradigm-shift" },
    { name: "Collective Intelligence", description: "The emergent wisdom arising when many minds collaborate through digital networks. Wikipedia, open-source software, and citizen science demonstrate intelligence beyond any individual.", date: "2001 CE", significance: "revolutionary" },
    { name: "Bio-Digital Mesh", description: "The convergence of biological systems with digital networks — biosensors, digital twins of organs, and AI-driven diagnostics creating a living information layer.", date: "2020+ CE", significance: "revolutionary" },
    { name: "Torus Network", description: "A network topology where every node connects in a continuous loop with no dead ends. The torus metaphor describes a civilisation where every human node both gives and receives.", date: "2025+ CE", significance: "paradigm-shift" },
    { name: "Consciousness Map", description: "Theoretical frameworks mapping the structure and flow of awareness itself. From Integrated Information Theory to Global Workspace Theory — consciousness as the ultimate infrastructure.", date: "2025+ CE", significance: "paradigm-shift" },
    { name: "AI Symbiosis", description: "Humans and artificial intelligence working as complementary partners rather than competitors. AI handles pattern recognition and data; humans provide meaning, ethics, and purpose.", date: "2023 CE", significance: "revolutionary" },
    { name: "Ethical Framework", description: "Structured systems for making moral decisions about technology deployment. As infrastructure becomes planetary, ethical frameworks become infrastructure themselves — governing what we build and why.", date: "2025+ CE", significance: "foundational" },
    { name: "Planetary Node", description: "The concept of Earth itself as a single interconnected infrastructure node in a potential interplanetary network. Every human, sensor, and system contributing to planetary awareness.", date: "2025+ CE", significance: "paradigm-shift" },
    { name: "Digital Twin", description: "A virtual replica of a physical system updated in real-time with sensor data. Digital twins of cities, bridges, and power grids enable predictive maintenance and scenario planning.", date: "2010 CE", significance: "transformative" },
    { name: "Empathy Engine", description: "AI systems designed to understand and respond to human emotional states. Empathy engines could transform education, healthcare, and conflict resolution — technology that feels.", date: "2025+ CE", significance: "revolutionary" },
    { name: "Human Node", description: "Every person as a conscious node in the civilisational network — simultaneously receiver, processor, and transmitter of knowledge, culture, and purpose. You are the infrastructure.", date: "2025+ CE", significance: "paradigm-shift" },
  ],
};

// Helper to get inventions for a relay
export function getInventionsForRelay(relayNum: number): Invention[] {
  return INVENTIONS[relayNum] || [];
}

// Total invention count
export const TOTAL_INVENTIONS = Object.values(INVENTIONS).reduce((sum, arr) => sum + arr.length, 0);
