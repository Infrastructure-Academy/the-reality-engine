# THE REALITY ENGINE
# GAME DESIGN PARAMETERS & APPROACH

**The Complete Design Bible**

*Architecture, philosophy, reward mechanics, content structure, engagement systems, and implementation decisions for the world's first AI-guided infrastructure education platform.*

**Version 2.0** | **24 March 2026**
**Series:** iAAi / The Reality Engine
**Authors:** Nigel T. Dearden & Manus AI
**Classification:** DIAMOND | **Block:** 401
**Changelog:** v2.0 adds Sections 10, 13, 14 (Engagement Layer, Appraisal System, Inspector Feedback Response). Updates Sections 9 and 11.

---

## 1. DESIGN PHILOSOPHY

The Reality Engine is not a game that teaches. It is a teaching system that uses game mechanics as delivery vehicles. The distinction matters because it determines every design decision that follows. The content --- 12 Civilisational Relays, 91+ inventions, the ISI framework, the Survival Formula --- is fixed, authoritative, and non-negotiable. The **wrappers** around that content are where all creative latitude exists.

The core design philosophy rests on four pillars. First, **no loss states** --- the player can never fail, die, lose progress, or be punished. Every action yields a reward. The variable is magnitude, not existence. Second, **big numbers** --- XP rewards are deliberately large (10,000--50,000 per action) because the system respects the player's time and effort. Small numbers feel dismissive; large numbers feel generous. The psychological effect of earning 50,000 XP for a single discovery is fundamentally different from earning 50. Third, **the same knowledge, different wrappers** --- all modes, all age groups, all pathways lead to the same 12 Relays and the same 91+ inventions. The content never changes. Only the presentation layer changes.

Fourth --- added in v2.0 --- **juiced feedback**. Every player action must produce immediate, varied, and satisfying sensory feedback. A tap is not just a data event; it is a moment that should feel rewarding through sound, visual effect, and progression indicator. This pillar was added in response to Inspector Node feedback (see Section 14) identifying that the moment-to-moment interaction rhythm did not match the quality of the narrative content. The principle is borrowed from the game design concept of "juice" --- the practice of making every interaction feel alive through layered audiovisual responses [5].

This philosophy draws from four proven design traditions. The **variable ratio reinforcement schedule** from B.F. Skinner's operant conditioning research [1] powers the Relay Spinner --- the same mechanism that makes slot machines the most engagement-resistant devices ever built, repurposed for education instead of extraction. The **room-by-room dungeon crawl** from Tom Moldvay's 1981 Basic D&D [2] powers the Dungeon Crawl --- the same structure that taught millions of children to make decisions, imagine consequences, and explore the unknown. The **transformation ritual** from Filmation's He-Man [3] powers the Power of Grey Matter --- the same emotional arc that gives a 12-year-old the visceral feeling of becoming something greater through effort and knowledge. The **juice philosophy** from Martin Jonasson and Petri Purho's 2012 GDC talk [5] powers the engagement layer --- the principle that identical gameplay feels fundamentally different when every action produces layered, varied, satisfying feedback.

---

## 2. CONTENT ARCHITECTURE

### 2.1 The 12 Civilisational Relays

The relays are the atomic units of the entire system. They are chronologically ordered, historically grounded, and collectively exhaustive --- covering the full arc of human infrastructure from controlled fire (pre-10,000 BCE) to artificial intelligence and collective consciousness (2025+). Each relay has a name, a subtitle, an emoji symbol, an era, a web classification, and a colour.

| # | Relay | Subtitle | Era | Web | Colour |
|---|---|---|---|---|---|
| 1 | Fire | The Eternal Constant | pre-10,000 BCE | Natural | #ef4444 |
| 2 | Tree | The Living Foundation | 10,000--5,000 BCE | Natural | #22c55e |
| 3 | River | Cradles of Continuity | 5,000--3,000 BCE | Natural | #3b82f6 |
| 4 | Horse | The Velocity of Intent | 3,000--1,000 BCE | Machine | #d97706 |
| 5 | Roads | Arteries of Intent | 1,000 BCE--500 CE | Machine | #a16207 |
| 6 | Ships | The Master Weaver's Reach | 500--1500 CE | Machine | #0891b2 |
| 7 | Loom | The Binary Birth | 1500--1760 CE | Digital | #9333ea |
| 8 | Rail | Standardizing the Continental Rhythm | 1760--1870 CE | Machine | #64748b |
| 9 | Engine | The Internal Revolution | 1870--1914 CE | Machine | #b45309 |
| 10 | AAA Triad | The Triple Convergence | 1914--1969 CE | Digital | #0284c7 |
| 11 | Orbit | The Programmable Frontier | 1969--2025 CE | Digital | #6366f1 |
| 12 | Human Nodes | The Torus Metaphor | 2025+ CE | Consciousness | #a855f7 |

### 2.2 The Five Great Webs

The webs are the classification system that groups relays by domain. They also serve as the alignment axis for the FITS temperament system and the MPNC Fleet craft selection.

| Web | Icon | Colour | Relays | Domain |
|---|---|---|---|---|
| Natural | 🌿 | #22c55e | 1--3 | Biological systems, ecosystems, natural forces |
| Machine | ⚙️ | #f59e0b | 4--6, 8--9 | Engines, structures, physical infrastructure |
| Digital | 💻 | #3b82f6 | 7, 10--11 | Communications, computing, signal networks |
| Biological | 🧬 | #ec4899 | Cross
-relay | Medicine, genetics, biological engineering |
| Consciousness | 🧠 | #a855f7 | 12 | Awareness, philosophy, collective intelligence |

The Biological Web is unique in that it does not map to a contiguous set of relays. Instead, it threads through multiple relays --- herbal medicine in the Fire era, anatomical study in the River era, vaccination in the Engine era, genetics in the Orbit era. This cross-cutting nature makes it the "healer's web" --- it sustains and repairs what the other webs build.

### 2.3 The 91+ Inventions

Each relay contains between 5 and 12 inventions --- real historical discoveries, technologies, or systems that changed the trajectory of civilisation. The "91+" designation indicates a minimum count; the system is designed to accommodate additional inventions as the content library expands. Inventions are the collectible units of the game --- each one has an **iCard** with its name, relay, era, description, and historical significance.

### 2.4 The ISI Framework

The Infrastructure Significance Index (ISI) is the mathematical backbone of the entire system. It is documented in full in TP-016 [4] and operates across three dimensions:

| Dimension | Name | What It Measures |
|---|---|---|
| ISI1 | Sustainability | Long-term viability of infrastructure knowledge |
| ISI2 | Survival | The Survival Formula: S = (A x P) / beta |
| ISI3 | $ignificance | Innate value and economic impact of infrastructure |

The **Survival Formula** S = (A x P) / beta is the central equation. **A** (Accuracy) measures whether the right things are being learned. **P** (Precision) measures how well they are being learned. **beta** (the Human Blip) is the constant 0.000267% --- the fraction of Earth's history that contains all of human civilisation. The formula yields the **Survival Index**, which maps to the Civilisation Clock. The higher S goes, the further the clock retreats from midnight.

The **mobilisation target** is 1 billion learners (12.1% of the global population), each contributing 2.58% of their day (2,229 seconds / 37 minutes 9 seconds). This target is not arbitrary --- it is derived from the ISI2 calculation as the threshold at which the collective counterweight exceeds the civilisational risk.

---

## 3. PLAYER PROGRESSION SYSTEM

### 3.1 Age-Tiered Modes

The Reality Engine uses a three-tier age progression, with the Explorer tier further subdivided into four sub-modes. This structure ensures that the same content is accessible to an 8-year-old and a 28-year-old, with the wrapper complexity scaling to match cognitive development.

| Tier | Mode | Age Range | Complexity | Session Length |
|---|---|---|---|---|
| Explorer | Classic Explorer | 8--14 | Minimal | 2--10 min |
| Explorer | Relay Spinner | 8--10 | Low | 2--5 min |
| Explorer | Dungeon Crawl | 10--12 | Medium | 10--20 min |
| Explorer | Power of Grey Matter | 12--14 | Medium-High | 15--30 min |
| Intermediate | Flight Deck | 14--18 | High | 20--45 min |
| Advanced | Scholar | 18+ | Full Academic | 30--90 min |

The progression path is strictly linear: Explorer to Flight Deck to Scholar to The World. However, within each tier, players can move freely between sub-modes without losing progress. Inventions discovered in Spinner mode count in Dungeon mode. Powers earned in Grey Matter mode appear in the collection grid. The modes are **views**, not **silos**.

### 3.2 XP and BitPoint Economy

The XP system uses deliberately large numbers to convey respect for the player's effort. The conversion rate is fixed at 100 XP = 1 BitPoint.

| Milestone | XP Required | Title |
|---|---|---|
| Entry | 0 | Apprentice |
| First Gate | 100,000 | Relay Scout |
| Momentum | 500,000 | Relay Runner |
| Mastery | 1,000,000 | GURU |
| Elite | 5,000,000 | Grand Master |
| Cap | 24,000,000 | Odyssey Complete |

The 24,000,000 XP cap is a hard ceiling. It represents the theoretical maximum a player can earn by completing every discovery, every challenge, every mission across all modes. The cap exists to prevent inflation and to give the "Odyssey Complete" title genuine scarcity.

### 3.3 Reward Rates by Mode

Each mode awards XP at different rates, calibrated to the effort required per action:

| Event | Spinner | Dungeon | Grey Matter |
|---|---|---|---|
| Single invention discovery | 50,000 | 25,000 | 30,000 |
| Partial discovery / lore fragment | 10,000 | 10,000 | 10,000 |
| Puzzle / quiz completion | --- | 15,000 | 20,000 |
| Relay completion | 100,000 | 150,000 | 200,000 |
| Power earned | --- | --- | 100,000 |
| Full game completion | 1,200,000 | 1,800,000 | 2,400,000 |
| Daily streak bonus (per day) | 25,000 | 25,000 | 25,000 |

Grey Matter awards the most XP because it demands the most effort (discovery + knowledge + application). Spinner awards the least per action but has the highest action frequency. Dungeon sits in the middle. All three are designed so that a dedicated player can reach the 1M GURU threshold within 2--3 weeks of daily play.

### 3.4 Daily Engagement Mechanics

The daily engagement system uses two mechanisms. **Daily Spins** in Relay Spinner mode give 12 free spins per day (one per relay). Additional spins are earned through streak bonuses (3 consecutive days = 6 bonus spins). **Daily Streaks** across all modes award 25,000 bonus XP per consecutive day of play. There is no paid spin mechanism and no paid acceleration --- this is education, not extraction.

---

## 4. FITS TEMPERAMENT SYSTEM

The FITS (Feeler, Intuitive, Thinker, Senser) system is the personality framework that aligns players to webs, craft, and civilisational perspectives. It is introduced subtly in Explorer mode (through DAVID's observation of player choices) and becomes explicit in Flight Deck mode (through craft selection and the Dearden Field).

| FITS Type | Abbreviation | Description | Web | Craft |
|---|---|---|---|---|
| Senser | S | Scouts ahead, reads terrain, maps the unknown | Natural | TB-1 Pathfinder |
| Thinker | T | Builds, engineers, constructs --- civilisation follows | Machine | TB-2 Forgemaster |
| Intuitive | I | Connects, communicates, weaves the digital web | Digital | TB-3 Starcaster |
| Feeler | F | Heals, sustains, carries the conscience of the fleet | Biological | TB-4 Lifeline |
| Balanced | B | Commands, coordinates, holds the field together | Consciousness | TB-5 Sentinel |

The fifth type, **Balanced**, is not a FITS type in the traditional sense --- it represents the player who scores evenly across all four dimensions. The Balanced player gravitates toward the Consciousness Web and the command role.

---

## 5. MPNC FLEET --- THE THUNDERBIRD CRAFT

The MPNC (Multi-Purpose Navigation Craft) Fleet consists of five Thunderbird-class vessels, each aligned to a FITS type and a Great Web. Craft selection occurs in Flight Deck mode and determines the player's XP bonus structure, visual identity, and mission specialisation.

| Craft | Class | Pilot | Role | Stats Profile |
|---|---|---|---|---|
| TB-1 Pathfinder | Arrow-Class | Scott / IQ | Rapid-Response Reconnaissance | Speed 9, Sensors 8, Range 10 |
| TB-2 Forgemaster | Griffin-Class | Virgil / EQ | Heavy Engineering & Construction | Armour 9, Range 7, Sensors 6 |
| TB-3 Starcaster | Zeta-Class | Alan / CQ | Communications & Signal Intelligence | Sensors 10, Range 9, Stealth 8 |
| TB-4 Lifeline | Leviathan-Class | Gordon / Deep CQ | Medical & Humanitarian Response | Range 8, Sensors 7, Speed 6 |
| TB-5 Sentinel | Citadel-Class | John / HQ | Command & Control / Overwatch | Armour 8, Sensors 9, Speed 3 |

Each craft provides a **+20% XP bonus** on relays aligned to its web (TB-5 Sentinel provides +15% on Consciousness Relays). The five stats --- Speed, Armour, Sensors, Range, Stealth --- are displayed as bar charts on the craft selection card and influence mission outcomes in Flight Deck mode.

---

## 6. ABILITY SCORE SYSTEMS

The Reality Engine uses two ability score systems, scaled to the player's age tier.

### 6.1 Dungeon Crawl Ability Scores (Simplified)

The simplified system uses three scores mapped to the three civilisational perspectives:

| Ability | Abbreviation | Perspective | Mechanic |
|---|---|---|---|
| Observation | OBS | Western --- analytical, systematic | Bonus XP on puzzle rooms |
| Intuition | INT | Eastern --- holistic, connective | Reveals hidden rooms |
| Resilience | RES | Nomadic --- adaptive, survival | Extra retries on failed checks |

Each score is set by a single d20 roll (max 3 re-rolls for the full set). Scores range from 1--20 with simple modifiers: 1--5 = -1, 6--15 = 0, 16--20 = +1.

### 6.2 Scholar Ability Scores (Full System)

The complete system uses six scores for the Scholar and Flight Deck tiers:

| Ability | Abbreviation | Domain |
|---|---|---|
| Observation | OBS | Perception and awareness of infrastructure patterns |
| Analysis | ANA | Logical reasoning and systems thinking |
| Synthesis | SYN | Combining knowledge across domains |
| Communication | COM | Articulating ideas and persuading others |
| Implementation | IMP | Practical application and project execution |
| Vision | VIS | Strategic foresight and civilisational thinking |

These six scores are rolled using the full d20 protocol and influence mission outcomes, thesis grading, and the Dearden Field navigation in Scholar mode.

---

## 7. THE DEARDEN FIELD

The Dearden Field is the 60-node matrix that forms the core navigation system of Flight Deck mode. It is constructed by intersecting the 12 Relays with the 5 Great Webs, producing a 12x5 grid of 60 nodes. Each node represents a unique intersection --- for example, "Fire x Natural" (how fire shaped ecosystems) or "Loom x Digital" (how weaving patterns led to binary code).

The Dearden Field is not just a navigation tool --- it is a **knowledge map**. Completing nodes reveals connections between relays and webs that are not visible in the linear relay sequence. The field is displayed as an interactive HUD in the Flight Deck cockpit, with completed nodes glowing and uncompleted nodes dimmed.

---

## 8. DAVID --- THE AI COMPANION

DAVID (**D**igital **A**ugmented **V**isual **I**ntelligence **D**isplay) is the AI companion that accompanies the player across all modes. DAVID is not a chatbot --- he is a **narrator, guide, dungeon master, and guardian** whose personality shifts to match the mode context.

| Mode | DAVID's Role | Voice Register |
|---|---|---|
| Classic Explorer | Friendly narrator | Warm, encouraging |
| Relay Spinner | Post-spin commentator | Excited, celebratory |
| Dungeon Crawl | Dungeon Master | Atmospheric, descriptive |
| Power of Grey Matter | Ancient Guardian | Dramatic, mythic |
| Flight Deck | Co-pilot | Professional, tactical |
| Scholar | Academic Advisor | Formal, analytical |

DAVID uses the platform's LLM integration for contextual responses and the Web Speech API for voice narration. The voice can be toggled on or off by the player. DAVID tracks player behaviour patterns --- which paths they choose, which relays they gravitate toward, which ability scores they rely on --- and uses this data to reveal the player's **civilisational perspective pattern** at the end of their journey.

---

## 9. VISUAL AND AUDIO DESIGN

### 9.1 Visual Style by Mode

Each mode has a distinct visual identity, but all share the same colour palette derived from the relay and web colours defined in the content architecture.

| Mode | Visual Style | Reference |
|---|---|---|
| Classic Explorer | Clean, modern, tap-friendly tiles | Mobile-first discovery UI |
| Relay Spinner | Bright arcade-cabinet aesthetic, chunky symbols, coin-shower animations | 1980s arcade meets modern mobile |
| Dungeon Crawl | Illustrated text adventure, parchment panels, serif typography | Moldvay Basic D&D (1981) |
| Power of Grey Matter | Bold, heroic, primary colours, transformation animations | He-Man / Masters of the Universe |
| Flight Deck | Dark cockpit HUD, glowing nodes, tactical overlays | Sci-fi command bridge |
| Scholar | Academic, structured, thesis-grade typography | University assessment system |

### 9.2 Audio Design (Updated v2.0)

The platform uses four audio layers --- expanded from three in v1.0 to include the engagement feedback layer.

**Layer 1 --- DAVID's Voice.** Narration and guidance via Web Speech API with a K-Pop Guide voice profile --- warm, clear, and energetic. DAVID provides contextual commentary on discoveries, relay completions, and milestone achievements.

**Layer 2 --- Background Music.** Mode-specific ambient tracks, each verified through independent audio bot testing (STT transcription + FFmpeg volumedetect) to ensure voice dominance:

| Video/Mode | Music Track | Volume | Status |
|---|---|---|---|
| V1 Relay Spinner | Upbeat Anime EDM | Standard | APPROVED |
| V2 Dungeon Crawl | Upbeat Anime EDM | Standard | APPROVED |
| V3 Grey Matter | Heroic Brass | Standard | APPROVED |
| V4-A Flight Deck Spec | Dark Ambient | Standard | REPLACED BY V4-B |
| V4-B Flight Deck Starborne | Starborne Epic Cinematic Brass | 3% | VERIFIED --- Audio Bot Pass |
| V4-B Flight Deck Star Wars Alt | Space Adventures Star Wars Style | 1% | VERIFIED --- Audio Bot Pass |
| V5-A Scholar Secret | Classical Piano | 3% | VERIFIED --- Audio Bot Pass |
| V5-B Scholar Middle-Earth | LOTR Orchestral | 0.5% | VERIFIED --- Audio Bot Pass |

**Layer 3 --- Sound Effects.** Mechanical reel clicking (Spinner), dungeon ambience (Dungeon Crawl), energy gathering and lightning strikes (Grey Matter transformations), and cockpit beeps (Flight Deck).

**Layer 4 --- Engagement Feedback Sounds (NEW v2.0).** Web-typed discovery sounds that vary by Great Web to break click monotony. Each web has a distinct audio signature generated via the Web Audio API oscillator system:

| Web | Sound Character | Frequency Range | Waveform |
|---|---|---|---|
| Natural | Organic, warm, earthy | 220--440 Hz | Sine wave with gentle decay |
| Machine | Metallic, percussive, industrial | 110--330 Hz | Sawtooth with sharp attack |
| Digital | Electronic, crystalline, high-pitched | 440--880 Hz | Square wave with echo |
| Biological | Pulsing, rhythmic, heartbeat-like | 180--360 Hz | Triangle wave with reverb |
| Consciousness | Ethereal, harmonic, resonant | 330--660 Hz | Sine chord with long sustain |

Additional engagement sounds include: streak combo escalation (rising pitch with each consecutive discovery), milestone fanfare (major chord progression), relay completion celebration (triumphant brass-style chord), and phase transition whoosh (for Scholar mode stage changes).

### 9.3 Youth Intro Videos (Updated v2.0)

The platform now hosts **8 youth intro videos** across all age tiers, all embedded on the landing page in a "Youth Intro Videos" gallery section. Each video is CDN-hosted and playable inline by any visitor without login.

| Video | Duration | Mode | Age Range | Music | Status |
|---|---|---|---|---|---|
| V1 Relay Spinner | 20s | Relay Spinner | 8--10 | Upbeat Anime EDM | APPROVED |
| V2 Dungeon Crawl | 24s | Dungeon Crawl | 10--12 | Upbeat Anime EDM | APPROVED |
| V3 Grey Matter | 30s | Grey Matter | 12--14 | Heroic Brass | APPROVED |
| V4-A Flight Deck Spec | 30s | Flight Deck | 14--18 | Dark Ambient | REPLACED |
| V4-B Starborne | 30s | Flight Deck | 14--18 | Starborne Epic Brass 3% | VERIFIED |
| V4-B Star Wars Alt | 30s | Flight Deck | 14--18 | Star Wars Style 1% | VERIFIED |
| V5-A Scholars Secret | 30s | Scholar | 18+ | Classical Piano 3% | VERIFIED |
| V5-B Middle-Earth | 30s | Scholar | 18+ | LOTR Orchestral 0.5% | VERIFIED |

All V4-B and V5 videos were regenerated with clean narration (pure voice WAV, zero music contamination) and independently verified via speech-to-text transcription and FFmpeg volumedetect analysis. Evidence records are archived as iCards (GOV-AUD-001, GOV-AUD-002).

---

## 10. ENGAGEMENT LAYER (NEW --- v2.0)

This section documents the engagement feedback systems added in v2.0 in response to Inspector Node feedback identifying click monotony as a barrier to narrative immersion (see Section 14).

### 10.1 Design Principle

The engagement layer operates on the principle that **identical content feels fundamentally different when wrapped in varied, layered feedback**. The content (12 Relays, 91+ inventions) does not change. The sensory response to interacting with that content changes with every action. This is the fourth design pillar: juiced feedback.

### 10.2 Web-Typed Discovery Sounds

Every discovery action produces a sound that varies by the Great Web of the current relay. The sounds are generated procedurally using the Web Audio API, ensuring zero file-size overhead and infinite variation through randomised frequency offsets within each web's range. A player discovering inventions in the Natural Web hears warm, organic tones. The same player moving to the Digital Web hears crystalline, electronic tones. The shift is subtle but breaks the perceptual monotony of repeated tapping.

### 10.3 Discovery Burst Particles

Each card reveal triggers a particle burst effect colour-matched to the current relay's web. The particles are CSS-animated spans that radiate outward from the tap point and fade over 600ms. The burst size and particle count scale with the streak counter (see 10.4), creating a visual escalation that rewards rapid consecutive play.

### 10.4 Streak Combo System

The streak system tracks consecutive discoveries within a short time window (3 seconds between taps). Each consecutive discovery increments the streak counter, which is displayed as a floating indicator near the XP counter. The streak affects three feedback channels:

| Streak Level | Visual Effect | Sound Effect | XP Modifier |
|---|---|---|---|
| 1--2 | Standard burst | Standard web sound | 1.0x |
| 3--4 | Larger burst, glow | Rising pitch | 1.0x |
| 5--7 | Full-screen shimmer | Chord progression | 1.0x |
| 8+ | Screen shake + confetti | Fanfare | 1.0x |

Note: The streak system affects **feedback intensity only**, not XP amounts. This is deliberate --- the engagement layer adds sensory variety without altering the carefully calibrated reward economy. The XP modifier column is reserved for future tuning if playtesting indicates a need.

### 10.5 Milestone Celebrations

At 25%, 50%, 75%, and 100% completion of each relay (or node set in Flight Deck), a milestone overlay appears with:

- A full-screen celebration animation (confetti + glow)
- A milestone title ("Quarter Way!", "Halfway!", "Almost There!", "Relay Complete!")
- The current completion count and total
- An auto-dismiss after 3 seconds (or tap to dismiss)

These celebrations break the continuous tap loop into discrete achievement segments, giving the player natural pause points and a sense of structured progress.

### 10.6 Relay Summary Cards

Between relay completions in Explorer mode, a summary card appears showing:

- The completed relay's name and era
- Number of inventions discovered vs. total
- Time spent in the relay
- A progress bar showing overall journey completion (e.g., "3 of 12 Relays Complete")
- A "Continue to Next Relay" button

The summary card serves as a **pacing mechanism** --- it prevents the experience from feeling like an undifferentiated stream of taps by creating clear chapter boundaries.

### 10.7 Phase Transition Celebrations (Scholar Mode)

Scholar mode has four distinct phases (FITS assessment, D20 ability rolls, character sheet, thesis). Each phase transition triggers:

- A whoosh sound effect (signalling movement)
- A bell chime (signalling arrival)
- A milestone overlay at the appropriate percentage (25% after FITS, 50% after D20, 75% after character sheet, 100% after thesis)

These transitions transform what could feel like a long form-filling exercise into a structured journey with clear waypoints.

---

## 11. PLATFORM ARCHITECTURE

### 11.1 Site Map (Updated v2.0)

The Reality Engine is a single-page application with the following route structure:

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Landing page with mode selection, 8 intro videos, iCards, and mission statement |
| `/explore` | Explorer Select | Sub-mode selection (Classic, Spinner, Dungeon, Grey Matter) |
| `/explore/spinner` | Relay Spinner | Slot machine discovery game |
| `/explore/dungeon` | Dungeon Crawl | Room-by-room RPG exploration |
| `/explore/greymatter` | Power of Grey Matter | Power-up transformation missions |
| `/explore/:relayNum` | Explorer Relay | Classic tap-to-discover for a specific relay |
| `/m/explore` | Mobile Explorer | Mobile-optimised discovery experience |
| `/flight-deck` | Flight Deck | Cockpit HUD with Dearden Field and craft selection |
| `/create` | Scholar Create | Full character creation for Scholar mode |
| `/leaderboard` | Leaderboard | Live global rankings |
| `/cards` | Card Collection | iCard gallery and collection tracker |
| `/synthesis` | Synthesis | End-game pattern reveal and journey summary |
| `/journey` | Journey | Player's personal timeline and milestones |
| `/challenge/:code` | Challenge Landing | Shareable challenge entry points |
| `/network` | Network Directory | Community and contributor directory |
| `/media` | Media Gallery | Video, image, and audio content library |
| `/bridges` | Bridge Hub | Tetrahedral Observer --- connections to partner sites |
| `/frameworks` | Frameworks | ISI, FITS, and other conceptual frameworks |
| `/governance` | Governance Deck | SAP-001 protocol and governance cards |
| `/resources` | Resources | Downloadable documents, PDFs, and protocol files |
| `/appraisal` | Appraisal Questionnaire | Post-session playtest feedback form (NEW v2.0) |
| `/yoda` | Yoda Control | Administrative control panel |

### 11.2 Shared Backend Infrastructure

All modes share the same backend infrastructure. The database tables --- `player_profiles`, `relay_progress`, `discoveries`, `xp_transactions` --- are mode-agnostic. The content source (`shared/gameData.ts`) provides the same 12 Relays, 91+ inventions, 5 Webs, 5 FITS types, 5 Craft, and 6 Ability Scores to all modes. The XP constants (24M cap, 100:1 BitPoint rate, GURU at 1M) are universal. DAVID's LLM backend is shared, with mode-specific system prompts determining his personality.

Progress is persistent and cross-modal. A player who discovers an invention in Spinner mode will see it marked as discovered in Dungeon mode. A player who earns a power in Grey Matter mode will see it reflected in their collection grid. The modes are **views**, not **silos**.

### 11.3 The Tetrahedral Observer

The Reality Engine exists within a four-site ecosystem called the **Tetrahedral Observer**:

| Bridge | Name | Domain | Role |
|---|---|---|---|
| ACAD SITE | Infrastructure Academy | infra-acad-kuqzaex2.manus.space | Master database, academic content |
| MEMORIAL SITE | Principia Tectonica | nigelmemorial-ucmtq9dn.manus.space | Narrative archive, memorial content |
| TRE GAME | The Reality Engine | realityeng-epdhlkrn.manus.space | Interactive game platform |
| CHART ROOM | The Chartered Chart | xgrowthtrk-2a93yo5z.manus.space | Analytics and growth tracking |

---

## 12. DESIGN DECISIONS LOG (Updated v2.0)

This section records the key design decisions made during development, with rationale for each.

| Decision | Rationale | Date |
|---|---|---|
| 5 Webs instead of 3+1 | The Biological Web needed explicit recognition as a cross-cutting domain, not a footnote. Medicine, genetics, and bioengineering deserve their own classification. | 22 Mar 2026 |
| "Grey Matter" not "Grayskull" | The He-Man reference was the design inspiration, but the actual mode name needed to be original IP. "Grey Matter" preserves the transformation mechanic while being legally clean and thematically accurate (grey matter = brain = intelligence). | 22 Mar 2026 |
| No loss states anywhere | Every spin, every room, every mission yields a reward. The variable is magnitude, not existence. This eliminates frustration while preserving the engagement loop. Children should never feel punished for trying. | 22 Mar 2026 |
| Big XP numbers | 50,000 XP for a single discovery feels generous and respectful. 50 XP for the same discovery feels dismissive. The psychological impact of large numbers drives engagement without any cost to the system. | 22 Mar 2026 |
| 24M XP hard cap | Prevents inflation, gives "Odyssey Complete" genuine scarcity, and provides a clear finish line for completionists. | 22 Mar 2026 |
| 3 simplified ability scores for Dungeon Crawl | The full 6-score system is too complex for 10--12 year olds. OBS/INT/RES maps cleanly to the three civilisational perspectives (Western/Eastern/Nomadic) and keeps the maths trivial. | 22 Mar 2026 |
| Modes as views, not silos | Cross-modal progress persistence means players never lose work by switching modes. This encourages experimentation and reduces commitment anxiety. | 22 Mar 2026 |
| DAVID voice toggle | Not all players want audio narration. The toggle respects player preference while keeping the feature available for those who benefit from it. | 22 Mar 2026 |
| Youth intro videos per sub-mode | 8--14 year olds need visual hooks, not text explanations. A 20-second video communicates more than a 500-word description. | 22 Mar 2026 |
| Craft images on selection cards | Visual identity is critical for the Flight Deck experience. Abstract icons were insufficient --- players need to see their craft to feel ownership. | 22 Mar 2026 |
| **Fourth pillar: Juiced Feedback** | Inspector Node feedback confirmed that content quality is world-class but the interaction loop felt repetitive. Adding varied sensory feedback to every action addresses the rhythm gap without touching the content. | 24 Mar 2026 |
| **Web-typed sounds, not random sounds** | Tying audio signatures to the Five Great Webs creates meaningful variation (the player subconsciously learns which web they are in) rather than arbitrary noise. | 24 Mar 2026 |
| **Streak affects feedback, not XP** | The reward economy is carefully calibrated. Streaks should make the experience feel more exciting without inflating XP. Feedback intensity scales; XP does not. | 24 Mar 2026 |
| **Milestone celebrations at 25% intervals** | Four celebrations per relay creates natural pause points without being so frequent as to become annoying. The 25/50/75/100 pattern is universally understood. | 24 Mar 2026 |
| **Relay summary cards as pacing mechanism** | The summary card between relays breaks the continuous tap stream into discrete chapters, giving the player a sense of structured progress and a natural stopping point. | 24 Mar 2026 |
| **Appraisal Questionnaire at /appraisal** | Jonathan Green recommended playtesting with 10 youth across age groups. The questionnaire captures structured feedback (age group, mode, 9 engagement questions) and sends it to the project owner via notification. | 24 Mar 2026 |
| **V4-A replaced by V4-B on Flight Deck** | The original V4-A (dark ambient) was replaced by V4-B (Starborne epic brass at 3%) for a more engaging intro. V4-A remains in the video gallery as a legacy reference. | 24 Mar 2026 |
| **8 videos on landing page** | All intro videos are now visible and playable by first-time visitors without login, serving as the primary engagement hook before gameplay begins. | 24 Mar 2026 |

---

## 13. APPRAISAL SYSTEM (NEW --- v2.0)

### 13.1 Purpose

The Appraisal Questionnaire is a structured post-session feedback form designed to capture playtest data from youth across all age groups. It was built in direct response to Inspector Node Jonathan Green's recommendation to "get 10 youngsters to play it and give their honest feedback" and to "get multiple feedback from different age groups."

### 13.2 Structure

The questionnaire is accessible at `/appraisal` and consists of three stages:

**Stage 1 --- Demographics.** The player selects their age group (8--10, 10--12, 12--14, 14--18, 18+, Parent/Guardian, Educator) and the mode they played (Explorer, Flight Deck, Scholar, or All).

**Stage 2 --- Nine Engagement Questions.** The questions are designed to capture both quantitative ratings and qualitative feedback:

| # | Question | Type | Purpose |
|---|---|---|---|
| 1 | How fun was the experience overall? | 5-star rating | Baseline engagement metric |
| 2 | Did you want to keep playing or stop? | 3-choice | Retention indicator |
| 3 | What was your favourite moment? | Free text | Identifies engagement peaks |
| 4 | How did the clicking/tapping feel? | 3-choice | Click monotony diagnostic (JG's core concern) |
| 5 | Did the story make you curious to learn more? | 5-star rating | Narrative engagement metric |
| 6 | If you could change one thing? | Free text | Identifies improvement priorities |
| 7 | Would you recommend to a friend? | 3-choice | Net Promoter Score proxy |
| 8 | Did sounds and effects make discoveries exciting? | 5-star rating | Engagement layer effectiveness (v2.0 validation) |
| 9 | Anything else? | Free text | Open feedback channel |

**Stage 3 --- Submission.** Responses are sent to the project owner via the platform's notification system. Each submission includes the age group, mode, all answers, username (if logged in), and timestamp.

### 13.3 Design Decisions

The questionnaire uses a one-question-per-screen format with animated transitions to maintain engagement and prevent survey fatigue. Text questions can be skipped. The progress bar shows completion percentage. The submission confirmation includes a "Play Again" CTA to encourage re-engagement.

Question 4 ("How did the clicking/tapping feel?") is the most strategically important question --- it directly measures whether the v2.0 engagement improvements have addressed Jonathan Green's core concern about click repetition.

Question 8 ("Did sounds and effects make discoveries exciting?") validates the effectiveness of the new engagement feedback layer specifically.

---

## 14. INSPECTOR NODE FEEDBACK RESPONSE (NEW --- v2.0)

### 14.1 Source

On 24 March 2026, Jonathan Green --- an inspector node in the Infrastructure Academy network --- provided detailed feedback via LinkedIn after reviewing The Reality Engine. His feedback was captured via Grok AI analysis and represents the first independent external review of the platform.

### 14.2 Summary of Feedback

Green's assessment contained two distinct verdicts:

**Content Verdict: WORLD-CLASS.** Green described the platform as "legitimately one of the most ambitious and beautifully written games I've seen from an indie creator." He validated the 1M words, intro videos, knowledge cards, and world depth as "amazing" and "special." This confirms that the content architecture (Sections 2--8 of this document) is sound and does not require revision.

**Interaction Verdict: NEEDS TUNING.** Green identified that "the heavy clicking and repetition started to feel like a barrier to enjoying the story I was so excited about." He described wanting to "read more lore or see the next card" but finding that "the loop of clicking through the same actions over and over made it hard to stay engaged long enough to get there." He summarised: "It's not that the concept is bad --- it's that the moment-to-moment rhythm didn't match the incredible narrative payoff."

### 14.3 Prescription

Green recommended three actions:

1. **Game designer consultation** (2--3 days) to tune core loops without touching content or assets
2. **Playtest with 10 youth** across age groups with a structured appraisal questionnaire
3. **Complete this before the university pitch** to ensure the interaction layer matches the content quality

### 14.4 Response Actions Taken

| Action | Section | Status |
|---|---|---|
| Added fourth design pillar (Juiced Feedback) | Section 1 | IMPLEMENTED |
| Built web-typed discovery sounds | Section 10.2 | IMPLEMENTED |
| Built discovery burst particles | Section 10.3 | IMPLEMENTED |
| Built streak combo system | Section 10.4 | IMPLEMENTED |
| Built milestone celebrations | Section 10.5 | IMPLEMENTED |
| Built relay summary cards | Section 10.6 | IMPLEMENTED |
| Built phase transition celebrations | Section 10.7 | IMPLEMENTED |
| Built Appraisal Questionnaire | Section 13 | IMPLEMENTED |
| Archived feedback as iCard (GOV-INS-001) | Governance Deck | COMPLETE |
| Updated Game Design Parameters to v2.0 | This document | COMPLETE |

### 14.5 Outstanding Items

| Item | Status | Notes |
|---|---|---|
| Game designer consultation | PENDING | Green suggested contacting "the guy that runs the Hive" game designer |
| 10 youth playtest sessions | PENDING | Questionnaire built; need to recruit testers |
| Discovery questions (meaningful choices) | DEFERRED | Requires DAVID context integration; planned for v2.1 |
| Mini-systems that reward exploration | DEFERRED | Requires additional game design work; planned for v2.1 |

---

## 15. RELATIONSHIP TO THE BOOK SERIES

The Reality Engine is the interactive companion to **An Infrastructure Odyssey** --- the book series structured as Episode 1: Calories to Consciousness (Book 1 of 3). The book has three sections: **The Perspective** (narrative foundation), **The Guide** (practical framework following the 4-Pillar Framework: Observational to Educational to Application to Thesis), and **The Game** (this platform).

The 12 Relays in the game correspond directly to the 12 chapters of the book. The ISI framework is documented in the Guide section. The FITS temperament system, the Dearden Field, and the Survival Formula all originate in the book and are implemented interactively in the game. The game is not a separate product --- it is Part 3 of the same work, delivered through a different medium.

---

## REFERENCES

[1]: Skinner, B.F. (1957). *Schedules of Reinforcement.* Appleton-Century-Crofts. Variable ratio schedules produce the highest, most consistent response rates.

[2]: Moldvay, T. (1981). *Dungeons & Dragons Basic Set.* TSR, Inc. "For 3 or More Adults, Ages 10 and Up." 64-page rulebook covering character levels 1--3.

[3]: Filmation Associates (1983). *He-Man and the Masters of the Universe.* The transformation sequence ("By the Power of Grayskull!") became one of the most iconic moments in 1980s children's television.

[4]: Dearden, N.T. & Manus AI (2026). *TP-016 --- ISI Complete Record.* The Infrastructure Significance Index: Sustainability, Survival, and $ignificance across 12 Civilisational Relays.

[5]: Jonasson, M. & Purho, P. (2012). *Juice It or Lose It.* Game Developers Conference. The seminal talk demonstrating how layered audiovisual feedback transforms identical gameplay into fundamentally different experiences.

---

**RECALL Block:** 401 | **Series:** Game Design Parameters v2.0
**Classification:** DIAMOND | **Status:** ACTIVE

---

**Play now:** [realityeng-epdhlkrn.manus.space](https://realityeng-epdhlkrn.manus.space)
**Appraisal:** [realityeng-epdhlkrn.manus.space/appraisal](https://realityeng-epdhlkrn.manus.space/appraisal)
