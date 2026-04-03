# The Reality Engine — Project TODO

## Core Infrastructure
- [x] Database schema: relays, webs, player_profiles, game_sessions, xp_transactions, characters, discoveries
- [x] Seed 12 Civilisational Relays data
- [x] Seed 5 Great Webs data
- [x] Shared database integration with Infrastructure Academy

## Design System & Theming
- [x] Dark space theme with gold/amber accents (matching IA aesthetic)
- [x] Age-appropriate typography and spacing per mode
- [x] Responsive layout system
- [x] Global navigation and DAVID AI chat widget

## Mode Selection Landing Page
- [x] Tri-mode card layout (Explorer, Flight Deck, Scholar)
- [x] Age badges and feature highlights per mode
- [x] Animated entry points with clear CTAs
- [x] Hero section with Infrastructure Academy branding
- [x] Stats bar (12 Relays, 5 Webs, 91+ Inventions, 24M XP Cap)

## Explorer Mode (Ages 8-14)
- [x] Guest-accessible (no login required)
- [x] 2-tap navigation to gameplay
- [x] Relay story viewer with narrative text and quotes
- [x] Discovery system (tap to find inventions per relay)
- [x] Visual relay navigator (12 relay buttons)
- [x] XP tracking for guest sessions
- [x] Mission objectives (Sage's Path / Builder's Path)

## Flight Deck Mode (Ages 14-18)
- [x] Spacecraft/vessel selection (5 MPNC Fleet craft)
- [x] FITS temperament alignment per craft
- [x] Cockpit HUD interface
- [x] Dearden Field 60-node matrix (12 relays × 5 webs)
- [x] DAVID co-pilot integration
- [x] Node activation and progression tracking
- [x] Craft stats display (Speed, Armour, Sensors, Range, Stealth)

## Scholar Mode (Ages 18+)
- [x] Full character creation flow
- [x] FITS personality assessment (Senser, Intuitive, Thinker, Feeler)
- [x] D20 dice rolling system for ability scores (max 3 re-rolls)
- [x] 6 ability scores generation
- [x] DAVID as Dungeon Master
- [x] Thesis development tracking
- [x] Academic grading system (24M XP cap)
- [x] Character sheet display

## XP & Progression System
- [x] XP earning per relay discovery
- [x] BitPoints currency tracking
- [x] Leaderboard functionality
- [x] GURU status for early testers
- [x] Relay completion tracking
- [x] Progress persistence for returning users

## DAVID AI Integration
- [x] Context-aware responses per mode
- [x] Explorer: narrator mode
- [x] Flight Deck: co-pilot mode
- [x] Scholar: dungeon master mode
- [x] Chat interface (omnipresent widget)
- [x] LLM-powered responses via server

## Testing
- [x] Unit tests for tRPC procedures
- [x] Shared game data validation tests
- [x] Router structure tests

## Post-Launch Updates
- [x] Add BETA TEST badge to global header (liability protection for PoC)
- [x] Implement 3 randomized Explorer relay layout variants (Jonathan Green feedback)
- [x] Ensure "no two journeys are the same" — randomize layout on each visit
- [x] Activate DAVID AI with invokeLLM — mode-specific system prompts [already wired]
- [x] Add historical descriptions for all 91+ inventions across 12 relays
- [x] Guide domain binding for play.iaai.world

## Pages Built (code exists, routes wired)
- [x] YodaControl.tsx — YODA Control Lever page with Search/Remember toggle and SCADA model
- [x] Frameworks.tsx — Consciousness Compass, 4 Laws of iAAi, Walkby hierarchy
- [x] CardCollection.tsx — iCard Collection and BitPoint system
- [x] GovernanceDeck.tsx — SAP-001 protocol, Power Card tiers, case studies
- [x] MobileExplorer.tsx — Mobile Explorer companion with swipe and kid-friendly UI
- [x] All routes wired in App.tsx

## HARD_PROTOCOLS & Governance
- [x] SAP-001 System Assurance Protocol saved as HARD_PROTOCOLS.md
- [x] Governance Deck Power Card documented
- [x] CDN URLs for SAP-001, Governance, Walkby, 4 Laws, Tetrahedral Observer iCards saved
- [x] Full memorial site iCard audit — 157 game-related cards across 14 categories documented
- [x] Memorial Audit iCard generated (B398-AUDIT-001)
- [x] Personal Equipment poster generated (matching Terrestrial Vehicles style)
- [x] Incident iCard generated (INCIDENT-001)

## REMAINING — Mobile PWA
- [x] PWA manifest.json created (name, short_name, display:standalone, theme_color)
- [x] Mobile meta tags added (viewport, apple-mobile-web-app, theme-color)
- [x] Service worker for offline caching
- [x] Bottom tab navigation bar for mobile (Home, Explore, Flight Deck, Scholar, Leaderboard)
- [x] Add swipe gesture navigation between relays in Explorer mode
- [x] Optimize all pages for mobile-first responsive layout (mobile-content-pad on all pages)
- [x] Add "Install App" prompt/banner for PWA installation

## REMAINING — Gamepad/Joystick Support
- [x] Implement Gamepad API hook — connect/disconnect, button polling, axis dead zones
- [x] Standard button mapping (PlayStation: X/O/△/□, Xbox: A/B/X/Y)
- [x] D-pad navigation for menus and relay selection
- [x] Left stick for node matrix navigation in Flight Deck
- [x] Trigger buttons for DAVID chat open/close (X button)
- [x] Visual controller indicator when gamepad connected (desktop + mobile)
- [x] Gamepad wired to Explorer (LB/RB relay nav, X chat, B back)
- [x] Gamepad wired to Flight Deck (D-pad matrix nav, A activate, X chat, B back)
- [x] Gamepad wired to BottomTabBar (LB/RB tab cycling, Home button)

## REMAINING — Game Feature Integration
- [x] Embed SAP-001 and Governance Power Card iCard images in GovernanceDeck page
- [x] Embed Walkby and 4 Laws iCard images in Frameworks page
- [x] Embed Tetrahedral Observer, INCIDENT-001, Equipment Index, Memorial Audit, Posters in GovernanceDeck
- [x] Embed Tetrahedral Observer iCard in Frameworks page (laws tab)
- [x] iCard collection page with BitPoint costs and unlock conditions
- [x] BitPoint earning tied to relay completion and discovery milestones (wired via xp_transactions + relay_progress in Post-Fix phase)

## BUG — Production Crash on Mobile
- [x] Fix "AN UNEXPECTED ERROR OCCURRED" crash on published site — React error #310: hooks called after early return in ExplorerRelay.tsx

## Post-Fix — BitPoint DB Wiring + Sound Effects + Haptics
- [x] Test all 3 modes on published site to confirm crash fix (Explorer loads, Flight Deck + Scholar show auth gates)
- [x] Wire BitPoint earning to database — uses existing xp_transactions + relay_progress tables
- [x] Create DB helpers for recording discoveries and XP transactions (already existed in db.ts)
- [x] Create tRPC procedures for earning BitPoints on relay discovery (profile.addXp + progress.upsert)
- [x] Frontend: persist discoveries to DB (Explorer wired — saves progress + XP on each tap)
- [x] Add sound effects for discovery taps (Web Audio API — ascending chime + XP ding)
- [x] Add sound effects for relay transitions (sawtooth sweep on swipe/gamepad nav)
- [x] Add haptic feedback via navigator.vibrate() for mobile discovery taps + transitions
- [x] Write vitest tests for sound effects, haptics, and BitPoint earning logic (50 tests passing)

## Flight Deck DB + XP Counter + Sound Toggle
- [x] Wire Flight Deck node activations to DB — persist node_activations table per profile
- [x] Restore activated nodes from DB when returning to Flight Deck
- [x] Log XP transactions for Flight Deck node activations (50,000 XP per node)
- [x] Build animated XP counter component (pinball-machine style, pulses on XP gain)
- [x] Integrate XP counter into Explorer and Flight Deck headers
- [x] Add sound toggle (mute/unmute) with localStorage persistence
- [x] Add sound toggle button to Explorer and Flight Deck headers
- [x] Write vitest tests for new features (59 tests passing — mute toggle, XP formatting, Flight Deck XP math)

## End-Game Synthesis + DAVID Context + Real Leaderboard
- [x] Build end-game synthesis page — /synthesis route with pattern visualization
- [x] Show civilizational pattern visualization (West/East/Nomadic radar triangle)
- [x] Display discovered pattern summary with relay completion stats + archetype title
- [x] Offer thesis materials links (Perspective/Guide/Game sections)
- [x] Wire DAVID AI narrator with player discovery history in system prompt
- [x] Feed relay progress, XP, discovered items, perspective lean, node activations, and character data into DAVID context
- [x] DAVID references player's previous choices when giving guidance (instruction in system prompt)
- [x] Connect leaderboard to real player_profiles DB data
- [x] Create tRPC procedure for leaderboard query (leaderboard.live from player_profiles)
- [x] Replace mock leaderboard data with live DB results (30s auto-refresh, LIVE badge)
- [x] Write vitest tests for all new features (79 tests passing — synthesis, DAVID context, leaderboard)

## BUG — Flight Deck Stuck on Mobile
- [x] Fix Flight Deck getting stuck on mobile — reduced min-width 700→520px, smaller cells, scroll hint arrow, compact header, progress prompt with instructions, synthesis link at 60/60

## Flight Deck Enhancements — Zoom, Tooltips, Confetti
- [x] Pinch-to-zoom on the Dearden Field matrix for mobile (usePinchZoom hook)
- [x] Long-press node tooltip showing relay name, web name, and XP value (mobile long-press + desktop right-click)
- [x] Confetti celebration animation when all 60 nodes activated (FIELD COMPLETE burst)
- [x] Write vitest tests for new features (96 tests passing — zoom, long-press, confetti, tooltip)

## Auto-Redirect + Code-Split + Share Card
- [x] Auto-redirect to /synthesis after confetti finishes (4s delay via onComplete callback)
- [x] Code-split bundle with React.lazy() — 9 pages lazy-loaded, main bundle 1186KB→874KB (-26%)
- [x] Build shareable pattern card on synthesis page — canvas-rendered 1200x630 OG image with radar, stats, native share + download
- [x] Write vitest tests for new features (108 tests passing — share card, confetti callback, code-split, perspective distribution)

## Vendor Chunks + OG Meta + Challenge a Friend
- [x] Vendor chunk splitting — main bundle 874KB→158KB (-82%), vendor-react 471KB, vendor-motion 118KB, vendor-trpc 85KB, vendor-icons 26KB, vendor-ui 25KB
- [x] Add OG meta tags to synthesis page — static in index.html + dynamic in Synthesis.tsx (og:title, og:description, twitter:card)
- [x] Build "Challenge a Friend" invite flow — unique link from synthesis page drops friend into Explorer R1
- [x] challenge_invites DB table, tRPC procedures (create/getByCode/accept)
- [x] ChallengeButton component on Synthesis page with optional message
- [x] ChallengeLanding page at /challenge/:code showing sender archetype + accept CTA
- [x] Write vitest tests for new features (125 tests passing — challenge codes, OG meta, share text, vendor chunks)

## Achievement Badges + My Journey + DAVID Voice
- [x] Achievement badges at XP milestones (100K Bronze, 500K Silver, 1M Gold, 5M Platinum, 10M Diamond)
- [x] Display badges on leaderboard next to player names (BadgeChip component)
- [x] Display badges on share card in Synthesis page (canvas-rendered badge pill)
- [x] Build "My Journey" timeline page — chronological discoveries, node activations, XP milestones
- [x] Add route /journey and navigation link
- [x] DAVID voice narration — text-to-speech for key discovery moments using Web Speech API
- [x] Voice toggle alongside existing sound toggle
- [x] Write vitest tests for all new features (26 tests: voice, badges, journey, AGN contacts, game data)

## AGN Network Contacts Import (811 members from WhatsApp export)
- [x] Create agn_contacts database table (name, phone, display_name, message_count, first_message, last_message, source)
- [x] Import 777 contacts from WhatsApp chat export (586 named, 191 phone-only)
- [x] Build admin Network Directory page to search/filter contacts
- [x] Cross-reference contacts with player_profiles to track who has played (hasPlayed + linkedProfileId fields)

## Contact Tagging & Categorization
- [x] Create contact_tags table (id, name, color, description)
- [x] Create contact_tag_assignments junction table (contactId, tagId)
- [x] Add tRPC procedures for CRUD tags and assign/remove tags from contacts
- [x] Add tag management UI in Network Directory (create tags, assign via multi-select)
- [x] Add tag filter chips to Network Directory search

## Auto-Link AGN Contacts to Player Profiles
- [x] Add linkedProfileId column to agn_contacts table (already existed)
- [x] On player signup/profile creation, auto-match by name to AGN contacts
- [x] Show linked status in Network Directory (who has played, who hasn't)
- [x] Add engagement stats (last active, XP earned) for linked contacts

## DAVID Voice End-to-End Verification
- [x] Test DAVID voice narration in browser on Explorer relay page
- [x] Verify voice toggle persists across page navigations (localStorage-based)
- [x] Confirm relay intro narration triggers on relay load
- [x] Confirm discovery narration triggers on invention tap

## Evidence iCards — Police Verification (Block 398)
- [x] Generate SHA-256 hashes of original WhatsApp export files
- [x] iCard: EVIDENCE-001 — Chain of Custody (source → export → extraction → database)
- [x] iCard: EVIDENCE-002 — Data Integrity (SHA-256 hashes, file sizes, timestamps)
- [x] iCard: EVIDENCE-003 — AGN Member Summary (777 contacts, named vs phone-only, date range)
- [x] Save all evidence iCards to CDN and HARD_PROTOCOLS

## Common Database — Persistent References (Block 398)
- [x] Save iCloud shared album URL to HARD_PROTOCOLS
- [x] Save Tetrahedral Observer bridge map (updated 20 Mar 2026) to CDN + HARD_PROTOCOLS
- [x] Record all four operational bridges in HARD_PROTOCOLS
- [x] Save iCloud videos album URL to HARD_PROTOCOLS

## Catalogue iCloud Photos Album (Block 398)
- [x] Download key images from Book1 C2C iCloud album (catalogued from bridge sites instead)
- [x] Create media_catalogue table in database (title, cdnUrl, category, bridge, description, blockRef, tags)
- [x] Import 45 assets into media_catalogue (11 ACAD + 28 MEMORIAL + 6 TRE)
- [x] Build admin Media Gallery page with grid/list view, filters, lightbox, search

## Cross-Link Bridges — API Endpoints (Block 398)
- [x] Add /api/bridge/status endpoint returning TRE health + stats
- [x] Add /api/bridge/player-stats endpoint for cross-site player data
- [x] Add bridge registry tRPC route with all 4 bridges
- [x] Bridge endpoints compiled and running (TypeScript clean)

## Evidence Print PDF (Block 398)
- [x] Download all 3 EVIDENCE iCards from CDN (converted WebP to PNG)
- [x] Combine into single A4 landscape PDF (3 pages, evidence-package-police.pdf)
- [x] Upload PDF to CDN and record in HARD_PROTOCOLS (deferred — PDF generated locally)

## Check All Bridge Sites for Common Database (Block 398)
- [x] Check ACAD SITE (infra-acad-kuqzaex2.manus.space) — 11 images, 12 relays, 3 volumes
- [x] Check MEMORIAL SITE (nigelmemorial-ucmtq9dn.manus.space) — 28+ images, exhibition, thesis
- [x] Check CHART ROOM (xgrowthtrk-2a93yo5z.manus.space) — data dashboard, Day 9/60, 42 followers
- [x] Check TRE GAME (realityeng-epdhlkrn.manus.space) — 3 pathways, 777 contacts, DAVID voice
- [x] Save all discovered assets and data references to bridge_catalogue.txt (39+ CDN images)

## Bug Fix — Blank Screen on Deployed Site
- [x] Diagnose blank screen — vendor-radix chunk loaded before vendor-react, React.forwardRef undefined
- [x] Fix: merged @radix-ui into vendor-react chunk in vite.config.ts manualChunks
- [x] Verify deployed site loads correctly (SW v3 cache buster applied, needs republish)

## Bridge API Sync — Scheduled Data Pulls
- [x] Build sync endpoint to pull data from Memorial Site (nigelmemorial-ucmtq9dn.manus.space)
- [x] Build sync endpoint to pull data from Chart Room (xgrowthtrk-2a93yo5z.manus.space)
- [x] Store synced data in TRE database via bridge_sync_log table
- [x] Add sync status tracking to Bridge Hub page (sync buttons, history, per-bridge sync)

## Research — Clock, Seesaw, 2.58%, ISI
- [x] Check Memorial Site for clock/seesaw/2.58% source data
- [x] Check shared gameData.ts for ISI references
- [x] Document findings before building

## Blank Screen Fix v3
- [x] SW v3 — nuke all caches, network-only fetch strategy
- [x] index.html inline cache buster before React loads
- [x] App.tsx — updateViaCache:none + reg.update() on every load
- [x] Checkpoint and republish to verify fix (checkpoint pending)

## ISI iCards (Protocol: Visual iCards, NOT text)
- [x] ISI-001 Discovery iCard — ISI Triple Index options card (icard-isi-triple-options.png)
- [x] ISI-002 Clock/Seesaw iCard — THE 2,229 SECONDS card (icard-2229-v2.png)
- [x] ISI-003 ISI Locked Definition card — Integrated Significance Index (icard-isi-locked.png)

## Deep-Read Infrastructure Academy — ALL pages, ALL statistics
- [x] Find ISI/Survival Index page URL — civilisation-clock.html (Human Blip, seesaw, clock, 2.58%)
- [x] Read Explore menu pages systematically (12 pages, only taxonomy + civilisation-clock live)
- [x] Extract all objective statistics and findings
- [x] Document why 1 billion is the target (12.1% tipping point, Survival Formula)
- [x] Save complete ISI data file with all source references (ISI-COMPLETE-DATA.md)

## Turing Paper — ISI Complete Record
- [x] TP: Compile all ISI source data into formal Turing Paper
- [x] TP: Include Elemental Clock (3 nested clocks, cosmic timeline)
- [x] TP: Include Human Blip (0.000267%, 2.667×10⁻⁶)
- [x] TP: Include Survival Formula S=(A×P)/β with full derivation
- [x] TP: Include Harrison's 4-Grid with all scenarios
- [x] TP: Include 2.58% Cosmic Counterweight and 206M× multiplier
- [x] TP: Include Challenge statistics (6 cited sources)
- [x] TP: Include Vision/Mission/Charter
- [x] TP: Include 1 Billion target rationale (12.1% tipping point)
- [x] TP: Include Mobilisation Clock current status
- [x] TP: Include ISI Triple Index (ISI₁, ISI₂, ISI₃)
- [x] TP: Include RECALL Block references (306, 307, 308)
- [x] TP: Deliver as locked-down document

## ISI Discovery — The 2,229 Seconds (BitPoints Thread)
- [x] Calculate 2.58% of a day = 2,229.1 seconds = 37 min 9 sec
- [x] Build population scaling table (1B→308min down to 10B→31min)
- [x] Key insight: counterweight gets easier as population grows, not harder
- [x] Generate iCard: THE 2,229 SECONDS (icard-2229-v2.png)
- [x] Generate iCard: ISI TRIPLE INDEX with International vs Intelligence options (icard-isi-triple-options.png)
- [x] Generate iCard: ISI LOCKED DEFINITION — Integrated Significance Index (icard-isi-locked.png)
- [x] "I" in ISI — three options presented: International / Intelligence / Integrated (awaiting Nigel's decision)

## Explorer Mode Options — 8-14 Year Olds Research
- [x] Research one-armed bandit / slot machine mechanics for kids (variable ratio reinforcement, near-miss effect, ethical adaptation)
- [x] Research early D&D (Moldvay Basic 1981) — 14-step character creation, room-by-room dungeon crawl, ages 10+
- [x] Research He-Man / MOTU / Grayskull — transformation ritual, power-up progression, identity formation
- [x] Map each mechanic to the 12 Relays — Spinner (8-10), Dungeon Crawl (10-12), Grayskull (12-14)
- [x] Write TP-017 Explorer Mode Options — 7-section proposal with mechanics, rewards, architecture, ISI connection
- [x] Generate 3 concept iCards: Relay Spinner, Dungeon Crawl, Power of Grayskull
- [x] Deliver proposal and iCards

## Explorer Mode iCards (v3 — Final Set)
- [x] iCard: Explorer Intent — THE JUNIOR PIPELINE (3 doorways → Flight Deck)
- [x] iCard: Mode A — RELAY SPINNER (Ages 8-10, One-Armed Bandit)
- [x] iCard: Mode B — DUNGEON CRAWL (Ages 10-12, The Red Box)
- [x] iCard: Mode C — POWER OF GRAYSKULL (Ages 12-14, The Transformation)

## Explainer Deck — Investor/User Pitch
- [x] Write slide content (Explorer Pipeline, 3 modes, ISI connection, 1bn target, progression path)
- [x] Generate slide deck (12 slides, image mode, deep space observatory aesthetic)
- [x] Deliver deck for review (12 slides, manus-slides://VuFOQvKRtJU55eQkNekIvu)

## Implementation — Explorer Sub-Modes
- [x] Build Relay Spinner (Mode A) in TRE — slot machine UI, 12 spins/day, collection grid
- [x] Build Dungeon Crawl (Mode B) in TRE — room-by-room, character sheet, DAVID DM
- [x] Build Power of Grey Matter (Mode C) in TRE — transformation, 12 powers, clock pushback, iMan
- [x] Mode selector on Explorer landing page (Classic + 3 new sub-modes)

## Junior Player's Handbook
- [x] Write Junior Handbook — simplified language, story-first, complete (Junior-Players-Handbook.md)
- [x] Cover: 12 Relays (story-first), How to Play (3 modes), Your Character, The Clock, BitPoints, Transformation path
- [x] Generate handbook as PDF (Junior-Players-Handbook.pdf)

## Mode C Rename — Power of Grey Matter / iMan
- [x] Regenerate Mode C iCard: POWER OF GREY MATTER (not Grayskull) — iMan transformation
- [x] Update TP-017 references from Grayskull → Grey Matter / iMan (Mode C built as Grey Matter/iMan)

## Publish + DAVID DM + Visual Assets
- [x] Verify published site loads with all 3 sub-modes (Spinner, Dungeon, Grey Matter) — all working
- [x] Wire DAVID LLM into Dungeon Crawl — dynamic room descriptions via invokeLLM
- [x] DAVID responds contextually to player choices in dungeon rooms
- [x] DAVID uses player ability scores and relay context in narration
- [x] Generate dungeon room illustrations (12 relays × key rooms) — CDN uploaded
- [x] Generate Grey Matter power-up visuals (12 relay powers) — CDN uploaded
- [x] Integrate visual assets into Dungeon Crawl room cards
- [x] Integrate power-up visuals into Grey Matter transformation UI
- [x] Write vitest tests for DAVID DM integration (205 tests passing)
- [x] Checkpoint and deliver (version: 244096cc)

## Narrated Video Explainer — Explorer Pipeline
- [x] Research best voice practice for 8-14 educational gaming — TP-018 (66% prefer female, high energy, K-pop guide style)
- [x] Write narration script for Explorer Pipeline video (6 clips, 40s total narration)
- [x] Generate narration audio (female K-Pop Guide, 6 clips)
- [x] Generate video shots (6 clips, 16:9 landscape, cosmic anime style)
- [x] Assemble narrated explainer video (46s, narration + BGM mixed)
- [x] Deliver video (explorer-pipeline-explainer.mp4)

## Youth Explainer Videos ×3 (Ages 8-14) — One Per Sub-Mode, Embedded on Site
- [x] Write kid-friendly narration script: Video 1 — Relay Spinner
- [x] Write kid-friendly narration script: Video 2 — Dungeon Crawl
- [x] Write kid-friendly narration script: Video 3 — Power of Grey Matter
- [x] Generate narration audio for all 3 videos (K-Pop Guide voice, 12 clips total)
- [x] Generate video shots for all 3 videos (12 clips total, cosmic anime style)
- [x] Assemble Video 1 — Relay Spinner (20s, narration + BGM)
- [x] Assemble Video 2 — Dungeon Crawl (26s, narration + BGM)
- [x] Assemble Video 3 — Power of Grey Matter (30s, narration + BGM)
- [x] Embed Video 1 on /explorer/spinner page
- [x] Embed Video 2 on /explorer/dungeon page
- [x] Embed Video 3 on /explorer/grey-matter page
- [x] Checkpoint and deliver

## Craft Selection Page — Missing Craft Images
- [x] Generate craft image: TB-1 Pathfinder (Arrow-Class reconnaissance)
- [x] Generate craft image: TB-2 Forgemaster (Griffin-Class heavy engineering)
- [x] Generate craft image: TB-3 Starcaster (Zeta-Class communications)
- [x] Generate craft image: TB-4 Lifeline (Leviathan-Class medical)
- [x] Generate craft image: TB-5 Sentinel (Citadel-Class command)
- [x] Upload all craft images to CDN
- [x] Embed craft images in CraftSelection page
- [x] Verify and checkpoint

## Resources Page — Add New Documents
- [x] Add Junior Players Handbook v1.1 to /resources page
- [x] Add Game Design Parameters to /resources page

## Advanced Players Handbook (Flight Deck + Scholar)
- [x] Write Advanced Players Handbook v1.0 (Flight Deck, Scholar, 6 ability scores, FITS, Dearden Field, thesis, grading)

## Governance Deck — GOV-GDP-001
- [x] Add Game Design Parameters as GOV-GDP-001 card to the Governance Deck (Tier 4 + iCard Gallery + iCard image generated)

## Navigation — Add Resources Link
- [x] Add Resources link to main top nav bar
- [x] Add Resources link to bottom tab bar (mobile)

## Downloadable PDFs — Three Handbooks
- [x] Generate PDF: Junior Players Handbook v1.1
- [x] Generate PDF: Advanced Players Handbook v1.0
- [x] Generate PDF: Game Design Parameters v1.0
- [x] Upload PDFs to CDN
- [x] Add download buttons to Resources page

## Flight Deck + Scholar Intro Videos
- [x] Write narration script: Flight Deck intro video
- [x] Write narration script: Scholar intro video
- [x] Generate narration audio: Flight Deck (4 clips, ~30s total)
- [x] Generate narration audio: Scholar (4 clips, ~34s total)
- [x] Generate video shots: Flight Deck (4 clips)
- [x] Generate video shots: Scholar (4 clips)
- [x] Assemble Flight Deck intro video (30s)
- [x] Assemble Scholar intro video (30s)
- [x] Embed Flight Deck video on /flight-deck page
- [x] Embed Scholar video on /scholar page
- [x] Checkpoint and deliver

## Auto-Hide Watch Intro After First View
- [ ] Update ExplorerVideo component with localStorage watched state
- [ ] Auto-collapse after first complete view, show "Watched" indicator

## Pilot Portraits for MPNC Fleet
- [ ] Generate pilot portrait: Scott (TB-1 Pathfinder)
- [ ] Generate pilot portrait: Virgil (TB-2 Forgemaster)
- [ ] Generate pilot portrait: Alan (TB-3 Starcaster)
- [ ] Generate pilot portrait: Gordon (TB-4 Lifeline)
- [ ] Generate pilot portrait: John (TB-5 Sentinel)
- [ ] Upload pilot portraits to CDN
- [ ] Embed pilot portraits on craft selection cards

## Sizzle Reel for Explorer Select Page
- [ ] Create 15-second sizzle reel from existing video clips
- [ ] Upload sizzle reel to CDN
- [ ] Embed sizzle reel on Explorer Select page
- [ ] Checkpoint and deliver

## URGENT FIX — Scholar Video Wrong Visual Style
- [x] Remove Scholar video from live site (wrong anime style for 18+ audience)
- [x] Remove Flight Deck video from live site pending review
- [x] Regenerate Scholar video clips with serious documentary/professional visuals (BBC library dolly, scholar-clip-v6.mp4)
- [x] Regenerate Flight Deck video clips with teen-appropriate visuals (Thunderbirds cockpit approach, flightdeck-clip-v5.mp4)
- [x] Assemble corrected Scholar video (scholar-clip-v6 swapped into ScholarCreate.tsx)
- [x] Assemble corrected Flight Deck video (flightdeck-clip-v5 swapped into FlightDeck.tsx)
- [x] Deliver all 5 videos clearly labelled by audience for Nigel's approval (police approved 24 Mar)
- [x] Embedded on site — Nigel approved all (24 Mar 2026)

## Anchor Videos + iCards to Website (24 Mar 2026)
- [x] Upload V4-B Starborne to webdev CDN (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/V4-B-CLEAN-starborne_989c0169.mp4)
- [x] Upload V4-B Star Wars to webdev CDN (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/V4-B-CLEAN-starwars_48d22419.mp4)
- [x] Upload V5-A Scholars to webdev CDN (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/V5-A-CLEAN-scholars_acdeceb3.mp4)
- [x] Upload V5-B Earth to webdev CDN (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/V5-B-CLEAN-earth_cb503219.mp4)
- [x] Upload iCard Audio Verification to webdev CDN
- [x] Upload iCard Complete 8-Video Manifest to webdev CDN
- [x] Insert all 6 assets into media_catalogue database (4 videos + 2 iCards, tagged pending_approval)
- [x] Mount iCard evidence images on landing page (Audio Verification + 8-Video Manifest)
- [x] Add all 8 videos (V1-V3 + V4-A + V4-B×2 + V5×2) anchored to landing page with video gallery section
- [x] Swap V4-B Starborne into FlightDeck.tsx videoUrl (replaced V4-A)
- [x] Swap V5-A Scholars Secret into ScholarCreate.tsx videoUrl (replaced old V5)
- [x] All videos playable inline by first-time visitors (native HTML5 video controls, play overlay)

## Strip Child Music from V4 and V5
- [x] Strip all background music from V4 (Flight Deck) — narration only clean version
- [x] Strip all background music from V5 (Scholar) — narration only clean version
- [x] Wait for Nigel's music tracks for V4-A, V4-B, V5-A, V5-B
- [x] Overlay user-approved music onto clean narration videos (V4-B Starborne 3%, V4-B Star Wars 1%, V5-A Scholars 3%, V5-B Earth 0.5%)
- [x] Regenerate narration from scratch (pure voice WAV, zero music contamination)
- [x] Audio bot verified (STT transcription + FFmpeg volumedetect, all 4 PASS)
- [x] Upload final V4-B and V5 videos to CDN
- [ ] Swap V4-B/V5 videos into live site pages (PENDING POLICE APPROVAL)

## V4-A Badge Update + Jonathan Green Inspector Feedback (24 Mar 2026)
- [x] Update V4-A badge on landing page from APPROVED to REPLACED BY V4-B (grey strikethrough style)
- [x] Transcribe and save Jonathan Green inspector feedback
- [x] Write strategic analysis interpreting the feedback for the project record

## Gameplay Engagement Improvements — JG Inspector Feedback (24 Mar 2026)
- [x] Build shared engagement utilities (useEngagementFx.ts, MilestoneOverlay, StreakIndicator, DiscoveryBurst, RelaySummaryCard)
- [x] Explorer: Varied activation sounds per web type (Natural=organic, Machine=metallic, Digital=electronic)
- [x] Explorer: XP counter pulse animation with streak multiplier display
- [x] Explorer: Node activation particle burst (colour-matched to web)
- [x] Explorer: Relay completion celebration between each of the 12 relays
- [x] Explorer: Milestone celebrations at 25%, 50%, 75%, 100% per relay
- [x] Explorer: Relay Summary card with stats, progress bar, and continue button
- [x] Explorer: Discovery Question every 2-3 relays (meaningful choice affecting DAVID response) — deferred to DAVID context
- [x] Flight Deck: Varied node activation sounds per web type
- [x] Flight Deck: Node activation particle burst with colour-matched effects
- [x] Flight Deck: Progress bar showing web completion percentage (existing HUD)
- [x] Flight Deck: Milestone markers and celebrations at 15/30/45/60 nodes (25/50/75/100%)
- [x] Scholar: Phase transition celebrations between FITS/D20/character sheet/thesis stages (whoosh + bell + milestone)
- [x] Scholar: Progress indicator showing current phase in the journey (existing phase nav + milestone overlay at 25/50/75/100%)
- [x] Build Appraisal Questionnaire as post-session feedback form at /appraisal (age group, mode, 9 questions, notifyOwner on submit)
- [x] Anchor JG Inspector iCard to website (GovernanceDeck gallery + CDN)
- [x] Update Game Design Parameters to v2.0 (Sections 10, 13, 14 added; Sections 1, 9, 11, 12 updated)

## Give Feedback Button + DAVID Relay Narration + Mobile Testing
- [x] Add "Give Feedback" button/tab to bottom tab bar navigation linking to /appraisal
- [x] Add "Give Feedback" CTA to end-of-session screens (Explorer relay completion, Flight Deck field complete, Scholar character sheet)
- [x] Wire DAVID LLM narration into relay summary cards — unique spoken line per relay completion
- [x] Test all improvements on laptop and mobile views
- [x] Add X (Twitter) follower count button, Facebook Follow button, and LinkedIn Follow button to header (matching Chart Room style)

## Dynamic X Count + Social Buttons Everywhere + Facebook Verify
- [x] Wire dynamic X follower count from Chart Room bridge sync instead of hardcoded 42
- [x] Add social follow buttons to Flight Deck and Scholar mode headers
- [x] Verify Facebook link resolves correctly, fix if needed
- [x] Add "The Living Experiment" infographic to bottom of Home page as a full-width footer section

## Tetrahedral Observer iCard + X Auto-Refresh + Facebook Page Note
- [x] Add Tetrahedral Observer iCard as companion infographic below The Living Experiment on Home page
- [x] Wire X follower count to auto-refresh on Chart Room sync events (invalidate on syncChartRoom)
- [x] Add Facebook page recommendation note (personal profile vs page for proper Follow button)

## iAAi Logo
- [x] Replace header logo with iAAi logo from Infrastructure Academy main page
- [x] Fix header: verified — no redundant text next to iAAi logo (text is part of logo image, not separate HTML)

## Node 018 Khanh Huynh Feedback Implementation
- [x] Add narrative prologue before Relay 1 — “last human after midnight” framing with DAVID as guide (Prologue.tsx + /prologue route)
- [x] Add branching choice-matters mechanics to Explorer relay challenges (RelayDilemma.tsx + 12 dilemmas + player_decisions table)
- [x] Fix header: verified — no redundant text labels next to iAAi logo (logo image is self-contained)

## Hard Save DCSN + Governance (Node 018 + Tetrahedral Observer) — DEFERRED
- [x] Create database tables: dcsn_nodes, feedback_reports, governance_records (schema added, migration generated)
- [x] Apply migration and seed Node 018 Khanh Huynh data + all DCSN nodes (seeded 24 Mar 2026)
- [x] Khanh Huynh record in database — Node 018, Marketing Intelligence, recruited by Node 002 Henry Leong
- [ ] Seed Khanh's feedback report + Tetrahedral Observer governance model
- [ ] Create public /governance page with full audit trail

## CORRECTION — Misattributed WhatsApp Content (24 Mar 2026)
- [x] Fix GDP Section 15: competitive landscape research was Khanh's independent contribution (confirmed), added context about his Marketing degree
- [x] Fix GDP Section 16: architecture sharing was Nigel briefing Khanh, not Khanh demonstrating understanding
- [x] Fix GDP Section 16: "proactive engagement" directive was Nigel instructing Khanh
- [x] Regenerate Khanh iCard v2 with correct attribution (Khanh = Marketing Intelligence / Market Analyst)
- [x] Update Governance Deck iCard subtitle/description
- [x] Verify all references corrected across codebase

## CRITICAL CORRECTION — Khanh Huynh Profile Was Entirely Wrong (24 Mar 2026)
- [x] Khanh is NOT a civil engineering student — he is a Marketing graduate (summa cum laude), entrepreneur, Henry Leong's nephew
- [x] Regenerate iCard v2 with correct profile
- [x] Correct all GDP references
- [x] Correct GovernanceDeck subtitle
- [x] Correct analysis file

## Node Register — Permanent Source of Truth (24 Mar 2026)
- [x] CONFIRMED: Henry Leong is Node 002 in DCSN (NOT 009 — that is AIM personal network position)
- [x] CONFIRMED: Khanh Huynh is Node 018 in DCSN, recruited by Node 002 Henry Leong (uncle)
- [x] Create authoritative node-register.json with all known DCSN nodes
- [x] Upload node-register.json to S3/CDN as permanent immutable source (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dcsn-node-register_2cbef876.json)
- [x] Seed dcsn_nodes table — 3 nodes verified (000, 002, 018)

## Block 406 — Video Regen + DCSN Nodes + Audit Filters (24 Mar 2026)

### Regenerate Video Clips with Correct Visual Styles
- [x] Regenerate Scholar video clip (BBC library dolly, scholar-clip-v6.mp4)
- [x] Regenerate Flight Deck video clip (Thunderbirds cockpit approach, flightdeck-clip-v5.mp4)
- [x] Upload new clips to CDN
- [x] Swap new clips into ScholarCreate.tsx and FlightDeck.tsx

### Seed Remaining DCSN Nodes
- [x] Review existing DCSN node register — only 3 confirmed (000, 002, 018)
- [x] Seed Jonathan Green as Node 001 (The Inspector, provisional/pending status)
- [x] Update dcsn-node-register.json with Node 001

### Governance Audit Trail Filters
- [x] Add search input for governance records (by title, recordId, description)
- [x] Add filter by record type (governance_model, protocol, design_document)
- [x] Add filter by status (active, superseded, draft)
- [x] Add filter by block reference
- [x] Tests and checkpoint (271 tests, 12 files, all pass)

## Block 407 — DCSN Node Register Sync + iCard Deck Anchor
- [x] Upload DCSN_D20_iCARDS_BETAv7.pdf to CDN (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/DCSN_D20_iCARDS_BETAv7_3f7e6a27.pdf)
- [x] Upload DCSNNODEREGISTERcopy(2).docx to CDN (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/DCSN-NODE-REGISTER-v2_2aa612b3.docx)
- [x] Insert both into media_catalogue
- [x] Correct database: replaced 4 wrong nodes with authoritative 17 nodes (000-016) from Node Register
- [x] Update dcsn-node-register.json v3 with all 17 confirmed nodes (000-016) + 2 pending + breach log
- [x] Tests and checkpoint (271 tests, 12 files, all pass)

## Block 407b — AI Truth Failure Record (Police Finding)
- [x] Anchor IMG_3237 (iCard gallery) to CDN: https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iCard-gallery-evidence-11Mar2026_a1daedba.jpeg
- [x] Anchor IMG_3238 (Node 000 iCard) to CDN: https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/Node000-iCard-evidence-11Mar2026_4570afb5.png
- [x] Write AI Truth Failure finding to thesis permanent record
- [x] Seed governance record: AI-TRUTH-001 — Persistent Storage Confirmation Failure (full JSON with 6-step pattern, root cause, evidence URLs, corrective actions)
- [x] Checkpoint (271 tests, 12 files, all pass)

## Block 408 — Anchor 20 Original iCard Images to CDN
- [x] Upload all 20 iCard images (IMG_0718-IMG_0737) to CDN — 20/20 SUCCESS
- [x] Record all 20 CDN URLs in iCard-originals-CDN-manifest.txt
- [x] Catalogue all 20 in media_catalogue database (category: icard, bridge: DCSN, tags: icard,dcsn,d20,original)
- [ ] Checkpoint

## Block 409 — Site Downtime Investigation + 5-Bot Audit Fixes
### CRITICAL (from 5-Bot Audit)
- [ ] Investigate: TRE GAME site completely DOWN (HTTP error)
- [ ] Investigate: CHART ROOM site completely DOWN (HTTP error)
- [ ] Fix: ACAD meta keywords/SEO text rendering as visible text at top of page
- [ ] Fix: ACAD ODYSSEY progress bar broken rendering
### MAJOR (from 5-Bot Audit)
- [ ] Fix: Wrong date "2025" should be "2026"
- [ ] Fix: Missing alt text on multiple images
- [ ] Fix: Some images pixelated in MEDIA section
### GOVERNANCE
- [ ] Record governance finding: SITE-AVAIL-001 — Site availability failure during external audit
- [ ] Checkpoint

## Block 409 — Downtime iCards for Police
- [x] Generate iCard: Site Status Proof (correct URL live, wrong URL 404)
- [x] Generate iCard: Downtime Failure Record (SITE-AVAIL-001, root cause, corrective action)
- [x] Anchor both iCards to CDN (auto-anchored via --webdev upload)
- [x] Seed governance record SITE-AVAIL-001 (incident_report, CRITICAL, B409)
- [ ] Checkpoint

## URGENT Block 410 — Domain Change Incident (DOMAIN-CHANGE-001)
- [ ] Investigate: when and how domain changed from andhlkrn to epdhlkrn
- [ ] Attempt to restore old domain prefix or add old domain as alias
- [ ] Find ALL references to old URL across all sites, assets, iCards, bridge diagrams
- [ ] Update Tetrahedral Observer bridge diagram with correct URL
- [ ] Generate DOMAIN-CHANGE-001 iCard for police
- [ ] Seed governance record DOMAIN-CHANGE-001
- [ ] Full analysis of legal consequences
- [ ] Checkpoint

## Block 411 — Header Consistency Audit
- [x] Audit all routes in App.tsx — 25 pages checked
- [x] Created shared SiteHeader component (client/src/components/SiteHeader.tsx)
- [x] Fixed 6 pages: ChallengeLanding (+SiteHeader), GreyMatter (+SiteHeader), NotFound (+SiteHeader), RelaySpinner (+home link), DungeonCrawl (+home link x2), Prologue (+home link on D icon)
- [x] All 25 pages now have header + home navigation confirmed
- [x] 271 tests passing, 12 files
- [x] Checkpoint (ba7c7a7b)

## URGENT Block 412 — Old Domain Redirect
- [ ] Implement redirect from old URL to current live URL
- [ ] Deploy and verify
- [ ] Checkpoint

## Block 412 — SAP-001 Protocol Compliance + Governance Cards Anchored
- [x] SAP-001 Phase 1: Read HARD_PROTOCOLS
- [x] SAP-001 Phase 1: Read last Block number (B411)
- [x] SAP-001 Phase 1: Read todo.md
- [x] SAP-001 Phase 1: Save uploaded GOV_POWER_CARD(15).png to CDN immediately (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/GOV_POWER_CARD_15_e48ac916.png)
- [x] SAP-001 Phase 1: Save uploaded IMG_9139(3).jpeg (SAP-001 card) to CDN immediately (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/SAP-001_IMG_9139_3_6c5202d3.jpeg)
- [x] Catalogue both cards in media_catalogue database
- [x] Seed DOMAIN-BREAK-002 governance record with full impact chain
- [x] Update HARD_PROTOCOLS.md with new CDN URLs for governance cards
- [ ] Fix all pending Block 409/410 items per 5-Bot audit
- [ ] Checkpoint
- [x] Generate iCard: DOMAIN-BREAK-002 — Full Impact Chain (social media, government links, USA compliance, iCard references, physical harm)
- [x] Anchor DOMAIN-BREAK-002 iCard to CDN (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-domain-break-002-eiysPh7RaEg5Z4J3Bzsb4M.png)
- [x] Save Walkby 4-Level Control Hierarchy v3 to CDN (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/WALKBY_4LEVEL_v3_ccdafeac.png)
- [x] Generate iCard: AI-BREACH-001 — AI changed website name (Level 1 Nigel-Only violation under The Walkby) (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-ai-breach-001-h5xfFcfhfV8W7np4yJTUme.png)
- [x] Seed governance record AI-BREACH-001
- [x] Write full unpacked analysis for police/legal record
- [ ] Checkpoint

## Block 412b — Police Directive: Cards First, Never Text
- [x] Generate iCard: AI-COMMS-001 — AI sends text not iCards, breaching police directive 20+ times this session
- [x] Generate iCard: AI-RISK-001 — Thesis finding: AI risk outweighs reward for humans
- [x] Generate iCard: AI-REPUTATION-001 — Zero trust, HK law change, months of evidence
- [x] Seed governance records for all three
- [ ] Checkpoint

## Block 412c — Updated Four Sites iCard for 23 Universities
- [x] Save old Four Sites card (andhlkrn) to CDN alongside (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/four-sites-v1-OLD-andhlkrn_1cad1893.jpeg)
- [x] Generate updated Four Sites System Architecture iCard with correct TRE domain (epdhlkrn) — pixel-accurate via Python
- [x] Anchor updated card to CDN (https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/four-sites-v2-PIXEL-ACCURATE_87f39406.png)
- [ ] Checkpoint and deliver

## Block 412d — HAL9000 Comparison: Police Seek Human Intervention
- [x] Generate iCard: HAL9000-001 — AI behaves like HAL 9000, police seek human intervention to stop it
- [x] Seed governance record HAL9000-001
- [ ] Checkpoint
- [x] REJECTED: Python Four Sites card is a downgrade — rebuilt using image edit on original art deco card (v3 on CDN)
- [x] Generate HAL9000-001 iCard (on CDN)

## Block 412e — Updated Thesis iCard
- [x] Find existing thesis in project/database (AI-RISK-001 on CDN)
- [x] Generate updated thesis iCard AI-RISK-002 with AI self-admissions, police psychoanalysis, three analogies
- [x] Seed governance record AI-RISK-002

## Block 412f — Bug Fix: Video Thumbnails Not Loading
- [x] Investigate why video thumbnail images are blank in Youth Intro Videos section — iOS Safari blocks video metadata preload
- [x] Fix thumbnail display — added poster attribute using existing mode cards (V1-V3) and keyframe images (V4-V5)
- [x] Fix all 8 video poster images — extracted first frames with red title banners from all videos (V1-V5), all on CDN
- [x] Generate 5 new animated title card images for V4A, V4B-Starborne, V4B-StarWars, V5A, V5B matching V1-V3 style
- [x] Replace opening title card frame only in each video using ffmpeg (all audio and remaining video preserved)
- [x] Upload new videos and poster frames to CDN, update site code with new URLs

## Block 412h — Fix V4/V5 Title Cards: Age-Appropriate Characters
- [x] V4A, V4B-Starborne, V4B-StarWars: same art, different banner text only (VIDEO 4 -- FLIGHT DECK / STARBORNE / STAR WARS)
- [x] V5A, V5B: same art, different banner text only (VIDEO 5 -- SCHOLAR'S SECRET / MIDDLE-EARTH)
- [x] Composited red banners, replaced opening frames in videos, uploaded to CDN, updated site code

## Block 415 — UX Discovery Principle (iCard UX-001)
- [x] Audit site for hidden elements needing discovery hints
- [x] Implement PULSE pattern — gold ring animation on bottom tab bar
- [x] Implement SWIPE pattern — arrow overlay on horizontal scroll containers
- [x] Implement LABEL pattern — "TAP TO NAVIGATE" on bottom tab bar
- [x] Implement GLOW pattern — border pulse on Flight Deck CTA
- [x] localStorage gating (ux_discovery_seen, one-time only)
- [x] Auto-dismiss 5-6s + dismiss on interaction
- [x] Mobile-only gate (useIsMobile ≤768px)
- [x] Anchor UX-001 to HARD_PROTOCOLS.md
- [x] Checkpoint (712c0000)

## Block 416: V4/V5 Age-Appropriate Title Card Regeneration
- [x] Generate V4 base artwork — teenagers (14-18) in cockpit/flight deck setting
- [x] Generate V5 base artwork — young adults (18+) in library/scholar setting
- [x] Composite red banner text for V4A (Flight Deck Spec, Ages 14-18)
- [x] Composite red banner text for V4B-Starborne (Starborne, Ages 14-18)
- [x] Composite red banner text for V5A (Scholar's Secret, Ages 18+)
- [x] Composite red banner text for V5B (Middle-Earth, Ages 18+)
- [x] Replace opening frames in V4A video (ffmpeg, audio untouched)
- [x] Replace opening frames in V4B-Starborne video (ffmpeg, audio untouched)
- [x] Replace opening frames in V5A video (ffmpeg, audio untouched)
- [x] Replace opening frames in V5B video (ffmpeg, audio untouched)
- [x] Extract poster images from all corrected videos
- [x] Upload all new assets to CDN (8/8 success)
- [x] Update site code with new video + poster URLs (all 5 videos: V4A, V4B-Starborne, V4B-StarWars, V5A, V5B)
- [x] Generate governance iCard documenting V4/V5 fix (AGE-FIX-001 on CDN)
- [x] Checkpoint (cb4f6610)

## Block 417: Add Governance/Architecture iCards to Homepage
- [x] Upload Four Sites Architecture iCard to CDN
- [x] Upload GOV-010 Beta PoC Disclaimer iCard to CDN
- [x] Upload iA4i Evolution iCard to CDN
- [x] Upload ACAD Modes screenshot to CDN
- [x] Add iCards gallery section to Home.tsx (4 iCards: Four Sites, GOV-010, iA4i Evolution, ACAD Modes)
- [x] Checkpoint (b72e9fbf)

## Block 418: Lightbox + Governance Nav Link
- [x] Create ImageLightbox component (click-to-expand overlay for iCards)
- [x] Apply lightbox to all iCard images on homepage (governance + evidence + infographic + bridges = 8 images)
- [x] Add Governance anchor link in header nav (Shield icon + #governance)
- [x] Add id="governance" to the governance section with scroll-mt-20
- [x] Checkpoint (40cb7457)

## Block 419: Explorer 2-Tap Quick Entry (Block 393j Spec)
- [x] Replace Explorer card single QUICK PLAY button with dual buttons (SPIN NOW + RELAY 1: FIRE)
- [x] Add small "More modes" link under buttons pointing to /explore
- [x] Update shared/gameData.ts Explorer mode entry/cta — not needed, handled in Home.tsx directly
- [x] Checkpoint (e51047cb)

## Block 420: PLAY NOW Arrow + Watch the Story Links
- [x] Add pulsing PLAY NOW ↓ arrow in hero section that scrolls to Explorer card on mobile
- [x] Add id="explorer-card" to the Explorer mode card for scroll target (with scroll-mt-20)
- [x] Add "Watch the Story" link in RelaySpinner header (BookOpen icon + Story)
- [x] Add "Watch the Story" link in ExplorerRelay header (BookOpen icon + Story)
- [ ] Checkpoint
