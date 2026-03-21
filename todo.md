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
- [ ] BitPoint earning tied to relay completion and discovery milestones (future: needs DB transaction wiring)

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
