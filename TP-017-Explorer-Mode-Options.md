# TP-017 — EXPLORER MODE OPTIONS

## The Reality Engine — Sub-Mode Architecture for Ages 8–14

**Classification:** DIAMOND | **Block:** 399 | **Date:** 22 March 2026
**Author:** Manus AI / Nigel T. Dearden | **Series:** Turing Papers

---

## 1. THE PROBLEM

The current Explorer mode is a single-format tap-to-discover experience. It works, but it treats all 8–14 year olds as one audience. An 8-year-old and a 14-year-old have fundamentally different cognitive capacities, attention spans, and engagement triggers. The content — 12 Civilisational Relays, 91+ inventions, the ISI framework — remains identical. The **wrapper** needs to change.

This paper proposes three distinct sub-modes within Explorer, each drawing from a proven game mechanic archetype that resonated with young audiences in the pre-digital and early-digital era. The same infrastructure knowledge flows through all three. The player chooses their preferred way to receive it.

---

## 2. THE THREE MODES

### 2A. RELAY SPINNER — "The One-Armed Bandit"

**Target Age:** 8–10 | **Complexity:** Low | **Session Length:** 2–5 minutes

**The Concept.** A three-reel slot spinner themed around the 12 Relays. The player pulls a lever (swipe down on mobile, click on desktop) and three reels spin, each showing relay symbols — Fire, Tree, River, Horse, Roads, Ships, Loom, Rail, Engine, AAA Triad, Orbit, Human Nodes. When the reels stop, the combination determines the reward.

**Why It Works.** The variable ratio reinforcement schedule — the same psychological mechanism that makes slot machines the most profitable machines in any casino — is also the most resistant to behavioural extinction in operant conditioning research [1]. The player never knows exactly when the big reward is coming, so they keep pulling. But unlike gambling, there is **no loss state**. Every spin yields something: XP, a lore fragment, a partial invention reveal, or a full discovery. The question is not "will I win?" but "how much will I win this time?"

**The Mechanic in Detail.**

| Combination | Result | Reward |
|---|---|---|
| Three matching relay symbols (e.g., Fire-Fire-Fire) | **JACKPOT** — Full invention discovery from that relay | 50,000 XP + Invention iCard + DAVID narration |
| Two matching + one different | **PARTIAL** — Lore fragment from the matched relay | 10,000 XP + Story excerpt + "So close!" animation |
| Three different from same era | **ERA BONUS** — Cross-relay connection revealed | 25,000 XP + Connection iCard |
| Three completely random | **EXPLORER FIND** — Random fact from any relay | 5,000 XP + Fun fact popup |
| Any spin with a Relay 12 symbol | **WILD CARD** — Doubles the reward of whatever else appears | 2× multiplier |

The reels are not purely random. The system uses a **weighted discovery queue** — inventions the player hasn't found yet are progressively more likely to appear. This means completion is guaranteed over time, but the path to completion feels unpredictable. The near-miss effect (two matching symbols, one off) drives the "one more spin" impulse.

**Daily Spins.** Each player gets 12 free spins per day (one per relay). Additional spins are earned through streak bonuses (3 consecutive days = 6 bonus spins) and challenge completions. There is no paid spin mechanism — this is education, not extraction.

**Visual Style.** Bright, arcade-cabinet aesthetic. Chunky pixel-art relay symbols on the reels. Flashing lights and coin-shower animations on jackpots. A physical lever animation on mobile (swipe down). Sound effects: mechanical reel clicking, ascending chimes on matches, triumphant fanfare on jackpots. Think 1980s arcade meets modern mobile — the visual language of reward.

**Progression.** The player's collection grid shows 91+ invention slots. Each jackpot fills a slot. The grid itself is the progress tracker — visible, tangible, completionist-friendly. When a relay's inventions are all discovered, that relay "lights up" on the collection grid, and the player earns a **Relay Mastery Badge**.

**DAVID's Role.** DAVID appears as a friendly narrator after each spin, delivering the lore or fact in a single sentence. For jackpots, DAVID gives a longer narration with voice (Web Speech API). DAVID also drops hints: "You're close to completing the River relay — keep spinning!"

---

### 2B. DUNGEON CRAWL — "The Red Box"

**Target Age:** 10–12 | **Complexity:** Medium | **Session Length:** 10–20 minutes

**The Concept.** A room-by-room dungeon exploration modelled on Moldvay's 1981 Basic D&D — the edition that made tabletop RPGs accessible to children for the first time [2]. Each of the 12 Relays is a **dungeon level**. Each dungeon level contains rooms. Each room presents a choice, a challenge, or a discovery. The player navigates through text-based descriptions with illustrated scenes, making decisions that determine which inventions they find and how much XP they earn.

**Why It Works.** The 1981 Basic Set was explicitly designed "for 3 or more adults, ages 10 and up" and succeeded because it stripped RPG complexity to its core: roll dice, make choices, explore rooms, find treasure [2]. The 14-step character creation process fits on an index card. The dungeon crawl structure — enter room, read description, choose action, receive outcome — is a natural fit for sequential relay exploration. It introduces **agency** (the player makes meaningful choices) without requiring complex strategy.

**The Mechanic in Detail.**

Each relay-dungeon has 6–8 rooms. The player enters Room 1 and receives a text description with an illustration:

> *"You stand at the mouth of a cave. Firelight flickers from deep within. The walls are marked with ancient symbols — handprints, spirals, the outline of a bison. DAVID's voice crackles through your communicator: 'This is where it began. Fire. The Eternal Constant. What do you do?'"*

The player is given 2–3 choices:

| Choice | Outcome |
|---|---|
| **"Examine the symbols"** | Discovery: Cave paintings → leads to Relay 1 invention (controlled fire) |
| **"Go deeper into the cave"** | Encounter: A puzzle about fire-making techniques → solve for bonus XP |
| **"Ask DAVID what the symbols mean"** | Lore: DAVID explains the 400,000-year history of controlled fire |

Wrong choices don't kill the player — they redirect. A "wrong turn" leads to a different room with different content, not a dead end. Every path through the dungeon reveals different inventions, so **replay value is built in**. Two players exploring the same relay-dungeon will find different things depending on their choices.

**Character Creation (Simplified).** Before entering the first dungeon, the player creates a character using a simplified version of the existing d20 system. Instead of 6 ability scores, the Explorer version uses **3 ability scores** mapped to the three civilisational perspectives:

| Ability | Perspective | What It Does |
|---|---|---|
| **Observation** (OBS) | Western — analytical, systematic | Bonus XP on puzzle rooms |
| **Intuition** (INT) | Eastern — holistic, connective | Reveals hidden rooms |
| **Resilience** (RES) | Nomadic — adaptive, survival | Extra lives / retry on failed checks |

Each ability is set by a single d20 roll (max 3 re-rolls for the full set, per existing protocol). The scores range from 1–20 and provide simple modifiers: 1–5 = -1, 6–15 = 0, 16–20 = +1. This keeps the maths trivial while preserving the thrill of the dice roll.

**Room Types.**

| Room Type | Frequency | Mechanic |
|---|---|---|
| **Discovery Room** | 2 per dungeon | Automatic invention reveal + XP |
| **Puzzle Room** | 1–2 per dungeon | Simple riddle or matching challenge → bonus XP on success |
| **Encounter Room** | 1 per dungeon | DAVID presents a scenario → player chooses approach → outcome varies |
| **Treasure Room** | 1 per dungeon | BitPoint cache + rare lore fragment |
| **Hidden Room** | 0–1 per dungeon | Only found with high Intuition → rare cross-relay connection |
| **Boss Room** | 1 per dungeon (final) | Relay summary challenge → completion badge on success |

**Visual Style.** Illustrated text adventure. Each room has a hand-drawn or AI-generated scene in a classic fantasy-RPG style — torchlit corridors, ancient workshops, river crossings, forge chambers. The text is presented in a parchment-style panel with serif font. Choices are presented as glowing buttons below the text. The character sheet sits in a collapsible sidebar showing the three ability scores, current XP, and inventory of discovered inventions.

**Progression.** Completing a relay-dungeon earns a **Dungeon Mastery Badge** and unlocks the next relay. The 12 dungeons can be played in any order (like the current Explorer), but a suggested "campaign path" follows the chronological relay sequence. Completing all 12 dungeons unlocks the **Dungeon Master's Vault** — a special synthesis page showing the player's full journey, choices made, and civilisational perspective pattern.

**DAVID's Role.** DAVID is the **Dungeon Master** — literally. DAVID narrates room descriptions, responds to player choices, and provides hints when the player is stuck. In this mode, DAVID uses the LLM to generate contextual responses based on the player's position in the dungeon and their previous choices, creating a semi-supervised experience that feels personalised.

---

### 2C. POWER OF GRAYSKULL — "The Transformation"

**Target Age:** 12–14 | **Complexity:** Medium-High | **Session Length:** 15–30 minutes

**The Concept.** A power-up progression system inspired by He-Man and the Masters of the Universe. The player begins as an ordinary "Apprentice" and, through completing relay missions, earns **Powers** — each relay grants a unique civilisational power. Collecting all 12 powers triggers the **Transformation** — the player becomes a "Relay Master" with a visual upgrade, a unique title, and access to the full Dearden Field.

**Why It Works.** The He-Man formula — ordinary person discovers hidden power, transforms into hero through ritual and effort — is one of the most enduring narrative structures in children's entertainment [3]. "BY THE POWER OF GRAYSKULL!" is not just a catchphrase; it is a **transformation ritual** that gives the moment of power-up emotional weight. Children aged 12–14 are at the developmental stage where identity formation is paramount — they want to become something, to earn a title, to be recognised. The Grayskull mode gives them that arc.

**The Mechanic in Detail.**

The player starts as an **Apprentice** with a basic avatar. Each relay is a **Mission** with a clear objective:

| Relay | Mission Name | Power Earned | Visual Effect |
|---|---|---|---|
| R1 Fire | "The Eternal Flame" | **Flame Shield** — +10% XP on all future discoveries | Fire aura around avatar |
| R2 Tree | "Roots of Knowledge" | **Living Foundation** — Reveals hidden lore in other relays | Green vine patterns on avatar |
| R3 River | "Cradles of Continuity" | **Flow Mastery** — Faster navigation between relays | Water trail effect |
| R4 Horse | "Velocity of Intent" | **Speed Charge** — Double XP on timed challenges | Lightning hooves effect |
| R5 Roads | "Arteries of Empire" | **Path Finder** — Map reveals all rooms in dungeon mode | Road network overlay |
| R6 Ships | "The Master Weaver's Reach" | **Ocean Command** — Unlocks cross-relay connections | Ship wheel compass |
| R7 Loom | "The Binary Birth" | **Digital Weave** — Unlocks code-based puzzles | Binary code shimmer |
| R8 Rail | "Continental Rhythm" | **Iron Horse** — Persistent progress multiplier (1.5×) | Steam trail effect |
| R9 Engine | "Internal Revolution" | **Engine Heart** — Unlocks invention blueprints | Gear rotation animation |
| R10 AAA | "Triple Convergence" | **Sky Strike** — Triple XP on final relay | Wing/propeller effect |
| R11 Orbit | "Programmable Frontier" | **Satellite Eye** — Full Dearden Field preview | Orbital ring effect |
| R12 Human Nodes | "The Torus Awakening" | **FULL TRANSFORMATION** | Complete visual overhaul |

**Mission Structure.** Each mission is a multi-step challenge within a relay:

1. **Discovery Phase** — Find 3 key inventions from the relay (tap-to-discover, like current Explorer)
2. **Knowledge Phase** — Answer 3 questions about what was discovered (multiple choice, DAVID provides feedback)
3. **Application Phase** — Complete a creative task (draw a connection, write a sentence, match inventions to their impact)
4. **Transformation Phase** — If all three phases are passed, the power is earned with a dramatic animation sequence

The **Transformation Animation** is the emotional peak. The screen dims, energy gathers around the avatar, DAVID announces "BY THE POWER OF [RELAY NAME]!", lightning strikes, and the new power visually attaches to the avatar. Sound effects: deep bass rumble, ascending synthesiser, triumphant brass hit. Haptic feedback on mobile: long vibration pattern.

**The Antagonist.** Every hero needs a villain. In Grayskull mode, the antagonist is **The Clock** — a visual representation of the Civilisation Clock approaching midnight. As the player earns powers, the clock hands move backward (away from midnight). Failing challenges or going inactive for too long lets the clock advance. This creates urgency without punishment — the clock never actually reaches midnight, but its movement provides narrative tension.

**Visual Style.** Bold, heroic, primary colours with metallic accents. The avatar is a stylised figure that visually evolves with each power earned — starting as a simple silhouette and ending as a fully armoured, glowing Relay Master. The UI uses shield-shaped panels, sword-slash transitions, and castle-tower progress bars. Each power has a unique colour matching the relay's existing colour scheme. The overall aesthetic sits between He-Man's 1980s boldness and modern superhero animation.

**Progression.** The 12 powers are displayed on a circular **Power Wheel** (like the Dearden Field, but simplified). Each segment lights up as a power is earned. At 6 powers, the player earns the title "Half-Master" and a mid-game transformation. At 12 powers, the full transformation triggers and the player is redirected to the Synthesis page with their complete pattern revealed.

**DAVID's Role.** DAVID is the **Ancient Guardian** — the keeper of Grayskull's secrets. DAVID speaks in a more dramatic, mythic register in this mode: "The Fire Relay has tested you, Apprentice. You have earned the Flame Shield. But eleven powers remain, and the Clock does not wait." DAVID also serves as the quiz master during the Knowledge Phase and provides encouragement during the Application Phase.

---

## 3. ARCHITECTURE — HOW THEY CONNECT

All three modes share the same backend infrastructure:

| Component | Shared Across All Modes |
|---|---|
| **Database** | Same player_profiles, relay_progress, discoveries, xp_transactions tables |
| **Content** | Same 12 Relays, same 91+ inventions, same lore text from gameData.ts |
| **XP System** | Same XP constants (24M cap), same BitPoint rate (100 XP = 1 BP) |
| **DAVID AI** | Same LLM backend, different system prompts per mode |
| **Progress Persistence** | Same guest/logged-in tracking, same returning-user restoration |
| **Synthesis** | All three modes feed into the same end-game synthesis page |
| **Leaderboard** | All modes contribute to the same live leaderboard |

The player chooses their mode at the Explorer entry point. They can switch modes at any time without losing progress — inventions discovered in Spinner mode count in Dungeon mode, powers earned in Grayskull mode appear in the collection grid. The modes are **views**, not **silos**.

---

## 4. REWARD STRUCTURE

Following the established protocol of big numbers and generous rewards:

| Event | Spinner | Dungeon | Grayskull |
|---|---|---|---|
| Single invention discovery | 50,000 XP | 25,000 XP | 30,000 XP |
| Partial discovery / lore fragment | 10,000 XP | 10,000 XP | 10,000 XP |
| Puzzle / quiz completion | — | 15,000 XP | 20,000 XP |
| Relay completion | 100,000 XP | 150,000 XP | 200,000 XP |
| Power earned (Grayskull only) | — | — | 100,000 XP |
| Full game completion | 1,200,000 XP | 1,800,000 XP | 2,400,000 XP |
| Daily streak bonus (per day) | 25,000 XP | 25,000 XP | 25,000 XP |

Grayskull awards the most XP because it demands the most effort (discovery + knowledge + application). Spinner awards the least per action but has the highest action frequency. Dungeon sits in the middle. All three are designed so that a dedicated player can reach the 1M GURU threshold within 2–3 weeks of daily play.

---

## 5. IMPLEMENTATION PRIORITY

| Phase | Mode | Effort | Why This Order |
|---|---|---|---|
| **Phase 1** | Relay Spinner | 3–5 days | Lowest complexity, highest engagement hook, works on mobile immediately |
| **Phase 2** | Dungeon Crawl | 7–10 days | Medium complexity, requires room content generation, DAVID DM integration |
| **Phase 3** | Power of Grayskull | 10–14 days | Highest complexity, requires avatar system, transformation animations, quiz engine |

The current tap-to-discover Explorer remains as the **default** mode (renamed "Classic Explorer") for players who prefer the existing experience. The three new modes are presented as options on the Explorer entry screen.

---

## 6. RECOMMENDATION

Build the **Relay Spinner first**. It is the fastest to implement, the most immediately engaging for the youngest players (8–10), and it introduces the variable-ratio reward mechanic that will keep daily active users high. It also serves as a proof-of-concept for the sub-mode architecture — if the shared backend works for Spinner, it works for all three.

The **Dungeon Crawl** should follow because it introduces the DAVID-as-DM mechanic in a structured, room-by-room format that can later be extended to the full Scholar mode. The room content can be generated using the existing LLM integration, reducing manual content creation.

The **Power of Grayskull** should be last because it is the most ambitious — avatar systems, transformation animations, quiz engines — but it is also the mode most likely to create the emotional connection that turns a player into an advocate. A 13-year-old who earns all 12 powers and triggers the full transformation will remember it. That is the 2,229 seconds made visceral.

---

## 7. THE ISI CONNECTION

Each mode maps directly to the ISI framework:

| ISI Dimension | Spinner | Dungeon | Grayskull |
|---|---|---|---|
| **ISI₁ — Sustainability** | Collection completion = sustainable knowledge | Room choices track SDG alignment | Powers map to SDG categories |
| **ISI₂ — Survival** | Spin frequency = engagement with the Clock | Dungeon depth = survival through knowledge | Clock antagonist = direct survival metaphor |
| **ISI₃ — $ignificance** | BitPoints earned = innate value demonstrated | Character growth = significance through agency | Transformation = significance made visible |

The Survival Formula S = (A×P)/β operates in the background. **Accuracy** is measured by correct quiz answers and puzzle solutions. **Precision** is measured by consistency of daily engagement. The player's personal S-score feeds into the collective Mobilisation Clock — each player's 2,229 seconds contributing to the civilisational counterweight.

---

## REFERENCES

[1]: Skinner, B.F. (1957). "Schedules of Reinforcement." Appleton-Century-Crofts. Variable ratio schedules produce the highest, most consistent response rates.

[2]: Moldvay, T. (1981). "Dungeons & Dragons Basic Set." TSR, Inc. "For 3 or More Adults, Ages 10 and Up." 64-page rulebook covering character levels 1–3.

[3]: Filmation Associates (1983). "He-Man and the Masters of the Universe." The transformation sequence ("By the Power of Grayskull!") became one of the most iconic moments in 1980s children's television, demonstrating the power of ritual transformation as an engagement mechanic.

---

**RECALL Block:** 399 | **Series:** TP-017 | **Status:** PROPOSAL — AWAITING DECISION
