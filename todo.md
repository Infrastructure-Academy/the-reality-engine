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
- [x] Activate DAVID AI with invokeLLM — mode-specific system prompts (narrator/co-pilot/DM) [already wired]
- [x] Add historical descriptions for all 91+ inventions across 12 relays
- [x] Guide domain binding for play.iaai.world
