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
