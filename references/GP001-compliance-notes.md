# GP-001 ZH Compliance — Extracted from AGENT_COORDINATION_ZH_COMPLIANCE PDF

## Context
- PolyU reviewing Chinese language compliance across all 5 subdomains
- ALL visible text MUST be Mandarin when ZH selected
- Current state of Quest (DAVID): 0% — no i18n system exists (NOTE: this is WRONG — we DO have i18n, but many strings leak English)
- Reference: https://github.com/Infrastructure-Academy/infra-acad003/tree/main/memorial-i18n

## Mandatory Requirements

### 1. Beta/PoC Badge (ALL SITES)
- "PoC BETA · Trial Site | Seeking patron funding to nurture the world's future builders."
- Must be visible at all times

### 2. Language Selector (ALL SITES)
- Globe icon + dropdown in header/nav
- EN (default) + 中文 (MANDATORY)
- Additional: JA, KO, ES, AR, HI, VI (optional but recommended)

### 3. Chinese Translation Standard
When ZH selected, ALL visible text must be Mandarin:
- Navigation labels
- Button text
- Headings and subheadings
- Body paragraphs
- Form labels
- Tooltips
- Footer text
- Error messages
- Status indicators

### Exceptions (may remain English):
- Brand names: "iAAi", "iGO", "DCSN"
- Proper nouns: "Nigel T. Dearden", "Infrastructure Academy"
- Technical identifiers: relay codes (R01, R02), block numbers
- Mathematical formulas and equations

## 4. Terminology Consistency (MANDATORY across all sites)

| English | Mandarin | Notes |
|---------|----------|-------|
| Infrastructure Academy | 基础设施学院 | Official name |
| The Reality Engine | 现实引擎 | Game platform |
| The xChange | 交易所 | Storefront |
| Memorial | 纪念馆 | Memorial site |
| News / Chart Room | 新闻室 / 图表室 | News site |
| Relay | 接力 | Civilisational relay |
| The Dearden Field | 迪尔登场 | Core framework |
| Holistic Quotient | 触感商数 | HQ concept |
| Civilisational Relay | 文明接力 | 12 relays |
| Fire | 火 | R01 |
| Tree | 树 | R02 |
| River | 河流 | R03 |
| Horse | 马 | R04 |
| Roads | 道路 | R05 |
| Ships | 船舶 | R06 |
| Loom | 织机 | R07 |
| Rail | 铁路 | R08 |
| Engine | 引擎 | R09 |
| AAA Triad | AAA三合会 | R10 |
| Orbit | 轨道 | R11 |
| Human Nodes | 人类节点 | R12 |
| Founding Builder | 创始建设者 | Patron tier |
| Explorer | 探索者 | D4 level |
| Apprentice | 学徒 | D8 level |
| Navigator | 领航者 | D12 level |
| Scholar | 学者 | D16 level |
| Master | 大师 | D20 level |
| Leaderboard | 排行榜 | Game feature |
| Governance | 治理 | Game feature |
| Resources | 资源 | Nav item |
| Cart | 购物车 | xChange |
| Sign in | 登录 | Auth |
| Follow | 关注 | Social |
| Beta / Trial Site | 测试版 / 试用站点 | Badge |

## DAVID (Quest) Specific Actions Required:
1. Implement i18n system (JSON-based like Memorial uses)
2. Add language selector to header (globe icon + dropdown)
3. Create zh.json with all UI strings translated
4. Priority strings to translate:
   - "THE REALITY ENGINE" → "现实引擎"
   - "GUIDED LEARNING PLATFORM" → "引导学习平台"
   - "Navigate 12,000 years..." → full Chinese
   - All relay names
   - "Your Relay Collection"
   - "Play Relay Spinner to start collecting"
   - "MY PROGRESS"
   - "COMMUNITY HEATMAP"
   - "REGISTER YOUR INTEREST"
   - "WHY BACK iGO?"
5. Add "PoC BETA · Trial Site" badge if not present

## Implementation Reference
- Memorial i18n files at: https://github.com/Infrastructure-Academy/infra-acad003/tree/main/memorial-i18n
- File structure: client/src/i18n/ with en.json, zh.json, ja.json, ko.json, es.json, ar.json, hi.json, vi.json
- useI18n hook reads from localStorage, falls back to EN for missing keys
- t('key') function for all components
