# Handbook Audit — v1.0 vs Current Build (22 March 2026)

## GAPS IDENTIFIED

### 1. Webs: Handbook says 3 Webs + Consciousness. Build has 5 Webs.
- Handbook: Natural, Machine, Digital, Consciousness (4 total, called "Three Webs" + 1)
- Build (gameData.ts): Natural, Machine, Digital, **Biological**, Consciousness (5 total)
- The Biological Web is missing from the handbook entirely
- The section title says "Three Webs" but lists four. Build has five.

### 2. FITS Temperament System — Not in Handbook
- Build has full FITS system: Senser, Thinker, Intuitive, Feeler, Balanced
- Each maps to a Web and a Craft
- Handbook mentions nothing about FITS — it's a Flight Deck concept but kids should know it exists

### 3. MPNC Fleet / Thunderbird Craft — Not in Handbook
- Build has 5 craft: TB-1 Pathfinder through TB-5 Sentinel
- Each has stats, class, pilot, role, image
- Handbook mentions Flight Deck only in passing ("what happens next")

### 4. Mode naming: "Power of Grayskull" vs "Power of Grey Matter"
- TP-017 uses "Power of Grayskull" (He-Man reference)
- Build uses "Grey Matter" (the actual name on the site)
- Handbook uses "Power of Grey Matter" — CORRECT, matches build
- But the transformation cry uses "GREY MATTER" not "GRAYSKULL"

### 5. Dungeon Crawl ability scores
- Handbook says 3 scores: Observation, Intuition, Resilience
- Build (gameData.ts ABILITY_SCORES) has 6: Observation, Analysis, Synthesis, Communication, Implementation, Vision
- These 6 are Scholar Mode scores. Dungeon Crawl may use simplified 3.
- Need to clarify which system is used where

### 6. Explorer sub-mode selection page — Not documented
- Build has /explore with ExplorerSelect.tsx showing 4 options
- Classic Explorer + Relay Spinner + Dungeon Crawl + Grey Matter
- Handbook describes modes but not the selection UI

### 7. Intro videos — Not in Handbook
- Three youth intro videos now embedded on sub-mode pages
- "Watch Intro" button on Spinner, Dungeon, Grey Matter pages

### 8. DAVID voice — Now implemented
- Handbook describes DAVID conceptually
- Build has actual DAVID voice (Web Speech API + K-Pop Guide voice)
- Voice toggle, narrateBadgeEarned, davidSpeak functions exist

### 9. Mobile Explorer — Not in Handbook
- Build has /m/explore route with MobileExplorer.tsx
- Separate mobile-optimised experience

### 10. Leaderboard — Built and live
- Handbook describes it conceptually
- Build has /leaderboard route, live implementation

### 11. Card Collection / iCards — Not in Handbook
- Build has /cards route with CardCollection.tsx
- iCard CDN URLs documented in icard-cdn-urls.md

### 12. Synthesis page — Built
- Handbook mentions it in passing
- Build has /synthesis route

### 13. Journey page — Not in Handbook
- Build has /journey route

### 14. Challenge system — Not in Handbook
- Build has /challenge/:code route

### 15. Network Directory — Not in Handbook
- Build has /network route

### 16. Bridge Hub — Not in Handbook
- Build has /bridges route (Tetrahedral Observer)

### 17. Frameworks page — Not in Handbook
- Build has /frameworks route

### 18. Governance Deck — Not in Handbook
- Build has /governance route

### 19. Media Gallery — Not in Handbook
- Build has /media route

### 20. Craft images — Now generated
- 5 unique sci-fi concept art images for each Thunderbird craft
- Embedded in Flight Deck craft selection page

## WHAT'S CORRECT IN HANDBOOK
- 12 Relays: Names, order, eras, descriptions — all match gameData.ts
- XP system: 24M cap, 100 XP = 1 BitPoint, GURU at 1M — all match
- Mode descriptions: Spinner, Dungeon, Grey Matter mechanics — largely accurate
- ISI/Blip framing: Matches TP-016
- Mission statement: Matches site
- Quick reference glossary: Mostly accurate

## RECOMMENDATION
- Version up handbook to v1.1 with corrections (5 Webs, ability score clarification, intro videos, DAVID voice)
- Keep handbook focused on Explorer mode (ages 8-14) — don't bloat with Flight Deck/Scholar details
- Create separate Game Design Parameters doc covering the full architecture, design philosophy, and approach
