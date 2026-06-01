#!/usr/bin/env python3
"""
Comprehensive i18n retrofit for IGOUmbrella.tsx
Replaces all hardcoded English strings with t() calls and generates EN/ZH dictionary entries.
"""
import re

# Read the file
with open("/home/ubuntu/the-reality-engine/client/src/pages/IGOUmbrella.tsx", "r") as f:
    content = f.read()

# ─── REPLACEMENTS: (find, replace) pairs ───
replacements = [
    # Hero section
    ('ONE GAME. ALL AGES. 8–65+', '{t("igo.hero.tagline")}'),
    ('>Where you go, <span className="tracking-normal italic"><BrandI />GO</span> follows.<', '>{t("igo.hero.follows")}<'),
    # Value proposition paragraph - complex with JSX spans
    ('The world\'s first <span className="text-amber-400 font-semibold italic">lifelong infrastructure learning game</span>. \n              12 civilisational relays. 500 generations. 12 game formats. From a child\'s first spin to a Master Weaver\'s capstone. \n              One architecture, one scoring system, one community — <span className="text-white/80 font-semibold">scaled across every generation</span>.', '{t("igo.hero.desc1")} <span className="text-amber-400 font-semibold italic">{t("igo.hero.desc2")}</span>. {t("igo.hero.desc3")} <span className="text-white/80 font-semibold">{t("igo.hero.desc4")}</span>.'),
    # Section 2: Find your mode
    ('Tap your age bracket. <span className="brand-i">i</span>GO shows you where you enter the game.', '{t("igo.findMode.desc")}'),
    ('YOUR RECOMMENDED MODE', '{t("igo.recommendedMode")}'),
    # Section 3: How it works
    ('>HOW IT WORKS<', '>{t("igo.howItWorks")}<'),
    ('Three episodes. One lifelong journey. Same 12 relays at every stage.', '{t("igo.howItWorks.desc")}'),
    # Section 3B: The Convergence
    ('>THE CONVERGENCE<', '>{t("igo.convergence")}<'),
    ('>PAYLOAD 1 — MEANING<', '>{t("igo.payload1")}<'),
    ('>PAYLOAD 2 — CONTENT<', '>{t("igo.payload2")}<'),
    ('>PAYLOAD 3 — CONTEXT<', '>{t("igo.payload3")}<'),
    # Section 4: The 12 Game Formats
    ('>THE 12 GAME FORMATS<', '>{t("igo.gameFormats")}<'),
    ('COMMUNITY:', '{t("igo.community")}:'),
    ('PLAY NOW <ChevronRight', '{t("igo.playNow")} <ChevronRight'),
    ('REGISTER INTEREST <ChevronRight', '{t("igo.registerInterest")} <ChevronRight'),
    # Section 5: Exhibition
    ('>THE EXHIBITION<', '>{t("igo.exhibition")}<'),
    ('13 immersive halls. The physical manifestation of <span className="brand-i">i</span>GO — from Fire to the Fractal Connector.', '{t("igo.exhibition.desc")}'),
    ('>HALL {hall.num}<', '>{t("igo.hall")} {hall.num}<'),
    # Section 6: Support the mission
    ('>SUPPORT THE MISSION<', '>{t("igo.supportMission")}<'),
    ('Whether you want to play, teach, partner, or fund — register your interest below. \n            We\'re building the world\'s first lifelong infrastructure learning game and we need your support to scale.', '{t("igo.supportMission.desc")}'),
    ('>REGISTERED<', '>{t("igo.registered")}<'),
    ('REGISTER ANOTHER', '{t("igo.registerAnother")}'),
    # Form labels
    ('>I AM A...</', '>{t("igo.iAmA")}</'),
    ('>NAME *<', '>{t("igo.name")} *<'),
    ('>EMAIL *<', '>{t("igo.email")} *<'),
    ('>ORGANISATION<', '>{t("igo.organisation")}<'),
    ('>MESSAGE (OPTIONAL)<', '>{t("igo.message")}<'),
    # Registration button
    ('REGISTER MY INTEREST', '{t("igo.registerMyInterest")}'),
    # Sign in link
    ('>Already have an account? <', '>{t("igo.alreadyAccount")} <'),
    # Bottom CTA
    ('REGISTER AS A BACKER', '{t("igo.registerBacker")}'),
    # Header
    ('>HOME<', '>{t("common.home")}<'),
    # Filter buttons
    ('>ALL 12 MODES<', '>{t("igo.allModes")}<'),
    ('>EP.1: RELAY & REMEMBER<', '>{t("igo.ep1Filter")}<'),
    ('>EP.2: EXPLORE FORWARD<', '>{t("igo.ep2Filter")}<'),
    ('>EP.3: BUILD FORWARD<', '>{t("igo.ep3Filter")}<'),
    # Footer
    ('Based on the trilogy by Nigel T. Dearden CEng CWEM', '{t("igo.footer.trilogy")}'),
    ('Episode 1: Calories to Consciousness', '{t("igo.footer.episode1")}'),
    ('PoC BETA — All modes in test mode', '{t("igo.footer.pocBeta")}'),
    # Why back section
    ('>WHY BACK <', '>{t("igo.whyBack")} <'),
    # Stats label
    ('people have registered interest', '{t("igo.registeredCount")}'),
]

# Apply replacements
for find, replace in replacements:
    if find in content:
        content = content.replace(find, replace, 1)

# Also fix the IMPACT_STATS labels to use t() - these are in a const array so we need a different approach
# Replace the IMPACT_STATS array to use function that takes t
old_stats = '''const IMPACT_STATS = [
  { value: "12", label: "RELAYS", icon: Globe },
  { value: "5", label: "GREAT WEBS", icon: Zap },
  { value: "91+", label: "INVENTIONS", icon: BookOpen },
  { value: "500", label: "GENERATIONS", icon: Clock },
  { value: "12", label: "GAME FORMATS", icon: Layers },
  { value: "8–65+", label: "AGE RANGE", icon: Users },
  { value: "24M", label: "XP CAP", icon: Trophy },
];'''

new_stats = '''const IMPACT_STATS = [
  { value: "12", labelKey: "igo.stats.relays", icon: Globe },
  { value: "5", labelKey: "igo.stats.greatWebs", icon: Zap },
  { value: "91+", labelKey: "igo.stats.inventions", icon: BookOpen },
  { value: "500", labelKey: "igo.stats.generations", icon: Clock },
  { value: "12", labelKey: "igo.stats.gameFormats", icon: Layers },
  { value: "8\u201365+", labelKey: "igo.stats.ageRange", icon: Users },
  { value: "24M", labelKey: "igo.stats.xpCap", icon: Trophy },
];'''

content = content.replace(old_stats, new_stats)

# Fix the stats rendering to use t(s.labelKey) instead of s.label
content = content.replace(
    'text-white/30 text-[8px] sm:text-[9px] font-mono tracking-wider">{s.label}</div>',
    'text-white/30 text-[8px] sm:text-[9px] font-mono tracking-wider">{t(s.labelKey)}</div>'
)

# Fix the SUPPORTER_ROLES to use i18n keys
old_roles = '''const SUPPORTER_ROLES = [
  { key: "player" as const, icon: Gamepad2, label: "Player", desc: "I want to play iGO" },
  { key: "educator" as const, icon: GraduationCap, label: "Educator", desc: "I want to use iGO in my classroom" },'''
new_roles = '''const SUPPORTER_ROLES = [
  { key: "player" as const, icon: Gamepad2, labelKey: "igo.role.player", descKey: "igo.role.playerDesc" },
  { key: "educator" as const, icon: GraduationCap, labelKey: "igo.role.educator", descKey: "igo.role.educatorDesc" },'''

content = content.replace(old_roles, new_roles)

# Check for the remaining roles
old_roles2 = '  { key: "institution" as const, icon: Building2, label: "Institution", desc: "University, school, or professional body" },\n  { key: "sponsor" as const, icon: HandCoins, label: "Sponsor / Backer", desc: "I want to fund the scale-up" },\n  { key: "other" as const, icon: Globe, label: "Other", desc: "General interest or partnership" },'
new_roles2 = '  { key: "institution" as const, icon: Building2, labelKey: "igo.role.institution", descKey: "igo.role.institutionDesc" },\n  { key: "sponsor" as const, icon: HandCoins, labelKey: "igo.role.sponsor", descKey: "igo.role.sponsorDesc" },\n  { key: "other" as const, icon: Globe, labelKey: "igo.role.other", descKey: "igo.role.otherDesc" },'

content = content.replace(old_roles2, new_roles2)

# Fix the role rendering to use t()
content = content.replace(
    '<div className="text-xs font-bold tracking-wider">{r.label}</div>\n                          <div className="text-[9px] opacity-60">{r.desc}</div>',
    '<div className="text-xs font-bold tracking-wider">{t(r.labelKey)}</div>\n                          <div className="text-[9px] opacity-60">{t(r.descKey)}</div>'
)

# Fix the "WHY BACK" section items - these are inline objects with title/desc
# We need to replace them with i18n keys
why_items = [
    ("WORKING PRODUCT", "igo.why.workingProduct"),
    ("TOTAL ADDRESSABLE MARKET", "igo.why.tam"),
    ("UNIQUE IP", "igo.why.uniqueIp"),
    ("ACADEMIC ALIGNMENT", "igo.why.academic"),
    ("GOVERNANCE IN PLACE", "igo.why.governance"),
    ("MOBILE APP ROADMAP", "igo.why.mobileApp"),
]

for title, key in why_items:
    content = content.replace(f'title: "{title}"', f'title: "{key}"')

# Also fix the desc fields for why items
why_descs = [
    ('desc: "Modes A–D are live with real players. Full database, AI narration, XP scoring, leaderboards — all working."', 'desc: "igo.why.workingProductDesc"'),
    ('desc: "Every person aged 8–65+ who interacts with infrastructure. That\'s everyone. 12 entry points across 7 generations."', 'desc: "igo.why.tamDesc"'),
    ('desc: "12 civilisational relays, 91+ inventions, 60-node Dearden Field, DAVID AI, 4 archetypes — no competitor has this architecture."', 'desc: "igo.why.uniqueIpDesc"'),
    ('desc: "Mapped to ABET, Washington Accord, AHEP4, UN SDGs. Ready for university integration from day one."', 'desc: "igo.why.academicDesc"'),
    ('desc: "Tetrahedral Observer protocol, SAP-001 governance, full audit trail. Built for institutional trust."', 'desc: "igo.why.governanceDesc"'),
    ('desc: "Web PoC proves the concept. Mobile app (AR-enabled for Modes G–L) is the scale vehicle. Pre-registration open now."', 'desc: "igo.why.mobileAppDesc"'),
]

for old, new in why_descs:
    content = content.replace(old, new)

# Fix the why section rendering to use t()
content = content.replace(
    '<h3 className="text-white text-xs tracking-[0.15em] mb-2 font-bold">{item.title}</h3>\n                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>',
    '<h3 className="text-white text-xs tracking-[0.15em] mb-2 font-bold">{t(item.title)}</h3>\n                <p className="text-white/50 text-xs leading-relaxed">{t(item.desc)}</p>'
)

# Fix HALL rendering
content = content.replace(
    '>HALL {hall.num}</p>',
    '>{t("igo.hall")} {hall.num}</p>'
)

# Fix the mode data arrays - these need i18n keys for name and description
# Since modes are used in multiple places, we'll add a lookup approach
# Replace mode.name and mode.description in the rendering
content = content.replace(
    '<h3 className="text-white text-base tracking-[0.1em] mb-1 font-bold">{mode.name}</h3>',
    '<h3 className="text-white text-base tracking-[0.1em] mb-1 font-bold">{t(`igo.mode.${mode.letter}`)}</h3>'
)
content = content.replace(
    '<p className="text-white/50 text-xs leading-relaxed">{mode.description}</p>',
    '<p className="text-white/50 text-xs leading-relaxed">{t(`igo.modeDesc.${mode.letter}`)}</p>'
)

# Fix mode name in the "Find Your Mode" section
content = content.replace(
    '<h3 className="text-white text-base font-bold tracking-wider">{m.name}</h3>',
    '<h3 className="text-white text-base font-bold tracking-wider">{t(`igo.mode.${m.letter}`)}</h3>'
)
content = content.replace(
    '<p className="text-white/50 text-sm mt-1">{m.description}</p>',
    '<p className="text-white/50 text-sm mt-1">{t(`igo.modeDesc.${m.letter}`)}</p>'
)

# Fix episode names and descriptions
content = content.replace(
    '<h3 className="text-white text-sm tracking-[0.15em] mb-2 font-bold">{ep.name}</h3>',
    '<h3 className="text-white text-sm tracking-[0.15em] mb-2 font-bold">{t(`igo.ep.${ep.num}`)}</h3>'
)
content = content.replace(
    '<p className="text-white/50 text-xs leading-relaxed">{ep.desc}</p>',
    '<p className="text-white/50 text-xs leading-relaxed">{t(`igo.epDesc.${ep.num}`)}</p>'
)

# Fix hall relay name
content = content.replace(
    '<p className="text-white text-sm font-bold tracking-wider">{hall.relay.toUpperCase()}</p>',
    '<p className="text-white text-sm font-bold tracking-wider">{t(`relay.name.${hall.num}`)}</p>'
)

# Write the file
with open("/home/ubuntu/the-reality-engine/client/src/pages/IGOUmbrella.tsx", "w") as f:
    f.write(content)

print("IGOUmbrella.tsx i18n retrofit complete!")
print("Now generating dictionary entries...")

# ─── GENERATE DICTIONARY ENTRIES ───
en_keys = {
    "igo.hero.tagline": "ONE GAME. ALL AGES. 8\u201365+",
    "igo.hero.follows": "Where you go, iGO follows.",
    "igo.hero.desc1": "The world's first",
    "igo.hero.desc2": "lifelong infrastructure learning game",
    "igo.hero.desc3": "12 civilisational relays. 500 generations. 12 game formats. From a child's first spin to a Master Weaver's capstone. One architecture, one scoring system, one community \u2014",
    "igo.hero.desc4": "scaled across every generation",
    "igo.stats.relays": "RELAYS",
    "igo.stats.greatWebs": "GREAT WEBS",
    "igo.stats.inventions": "INVENTIONS",
    "igo.stats.generations": "GENERATIONS",
    "igo.stats.gameFormats": "GAME FORMATS",
    "igo.stats.ageRange": "AGE RANGE",
    "igo.stats.xpCap": "XP CAP",
    "igo.findMode.desc": "Tap your age bracket. iGO shows you where you enter the game.",
    "igo.recommendedMode": "YOUR RECOMMENDED MODE",
    "igo.howItWorks": "HOW IT WORKS",
    "igo.howItWorks.desc": "Three episodes. One lifelong journey. Same 12 relays at every stage.",
    "igo.convergence": "THE CONVERGENCE",
    "igo.payload1": "PAYLOAD 1 \u2014 MEANING",
    "igo.payload2": "PAYLOAD 2 \u2014 CONTENT",
    "igo.payload3": "PAYLOAD 3 \u2014 CONTEXT",
    "igo.gameFormats": "THE 12 GAME FORMATS",
    "igo.community": "COMMUNITY",
    "igo.playNow": "PLAY NOW",
    "igo.registerInterest": "REGISTER INTEREST",
    "igo.exhibition": "THE EXHIBITION",
    "igo.exhibition.desc": "13 immersive halls. The physical manifestation of iGO \u2014 from Fire to the Fractal Connector.",
    "igo.hall": "HALL",
    "igo.supportMission": "SUPPORT THE MISSION",
    "igo.supportMission.desc": "Whether you want to play, teach, partner, or fund \u2014 register your interest below. We're building the world's first lifelong infrastructure learning game and we need your support to scale.",
    "igo.registered": "REGISTERED",
    "igo.registerAnother": "REGISTER ANOTHER",
    "igo.iAmA": "I AM A...",
    "igo.name": "NAME",
    "igo.email": "EMAIL",
    "igo.organisation": "ORGANISATION",
    "igo.message": "MESSAGE (OPTIONAL)",
    "igo.registerMyInterest": "REGISTER MY INTEREST",
    "igo.registerBacker": "REGISTER AS A BACKER",
    "igo.allModes": "ALL 12 MODES",
    "igo.ep1Filter": "EP.1: RELAY & REMEMBER",
    "igo.ep2Filter": "EP.2: EXPLORE FORWARD",
    "igo.ep3Filter": "EP.3: BUILD FORWARD",
    "igo.footer.trilogy": "Based on the trilogy by Nigel T. Dearden CEng CWEM",
    "igo.footer.episode1": "Episode 1: Calories to Consciousness",
    "igo.footer.pocBeta": "PoC BETA \u2014 All modes in test mode",
    "igo.whyBack": "WHY BACK",
    "igo.registeredCount": "people have registered interest",
    "igo.role.player": "Player",
    "igo.role.playerDesc": "I want to play iGO",
    "igo.role.educator": "Educator",
    "igo.role.educatorDesc": "I want to use iGO in my classroom",
    "igo.role.institution": "Institution",
    "igo.role.institutionDesc": "University, school, or professional body",
    "igo.role.sponsor": "Sponsor / Backer",
    "igo.role.sponsorDesc": "I want to fund the scale-up",
    "igo.role.other": "Other",
    "igo.role.otherDesc": "General interest or partnership",
    "igo.why.workingProduct": "WORKING PRODUCT",
    "igo.why.workingProductDesc": "Modes A\u2013D are live with real players. Full database, AI narration, XP scoring, leaderboards \u2014 all working.",
    "igo.why.tam": "TOTAL ADDRESSABLE MARKET",
    "igo.why.tamDesc": "Every person aged 8\u201365+ who interacts with infrastructure. That's everyone. 12 entry points across 7 generations.",
    "igo.why.uniqueIp": "UNIQUE IP",
    "igo.why.uniqueIpDesc": "12 civilisational relays, 91+ inventions, 60-node Dearden Field, DAVID AI, 4 archetypes \u2014 no competitor has this architecture.",
    "igo.why.academic": "ACADEMIC ALIGNMENT",
    "igo.why.academicDesc": "Mapped to ABET, Washington Accord, AHEP4, UN SDGs. Ready for university integration from day one.",
    "igo.why.governance": "GOVERNANCE IN PLACE",
    "igo.why.governanceDesc": "Tetrahedral Observer protocol, SAP-001 governance, full audit trail. Built for institutional trust.",
    "igo.why.mobileApp": "MOBILE APP ROADMAP",
    "igo.why.mobileAppDesc": "Web PoC proves the concept. Mobile app (AR-enabled for Modes G\u2013L) is the scale vehicle. Pre-registration open now.",
    "igo.ep.1": "RELAY & REMEMBER",
    "igo.ep.2": "EXPLORE FORWARD",
    "igo.ep.3": "BUILD FORWARD",
    "igo.epDesc.1": "Learn the 12 relays through play, narrative, and academic rigour",
    "igo.epDesc.2": "Apply relay knowledge to professional infrastructure careers",
    "igo.epDesc.3": "Lead, champion, and teach \u2014 the guild tradition fulfilled",
    "igo.mode.A": "Relay Spinner",
    "igo.mode.B": "Dungeon Crawl",
    "igo.mode.C": "Grey Matter",
    "igo.mode.D": "Flight Deck",
    "igo.mode.E": "Scholar",
    "igo.mode.F": "Academic",
    "igo.mode.G": "Graduate",
    "igo.mode.H": "Chartered",
    "igo.mode.I": "Senior Leader",
    "igo.mode.J": "Industry Leader",
    "igo.mode.K": "Industry Champion",
    "igo.mode.L": "Master Class",
    "igo.modeDesc.A": "First contact with infrastructure. Spin the relay wheel, discover the 12 civilisational relays through play.",
    "igo.modeDesc.B": "Narrative exploration through relay dungeons. DAVID guides the adventure. iCards collected, XP earned.",
    "igo.modeDesc.C": "Strategic thinking unlocked. Deeper relay analysis, biomimicry connections, cross-relay pattern recognition.",
    "igo.modeDesc.D": "Immersive cockpit HUD mode. Full relay missions, FITS team play, companion bots.",
    "igo.modeDesc.E": "Full AD&D RPG format. DAVID as Dungeon Master. Thesis-quality work, ISI scoring.",
    "igo.modeDesc.F": "Professor-supervised programme. R3 Panel assessment, ISI scoring, peer review.",
    "igo.modeDesc.G": "Early career infrastructure professional. CPD-aligned relay missions, graduate scheme integration.",
    "igo.modeDesc.H": "Chartered engineer pathway. ICE/IStructE/CIHT alignment, professional review preparation.",
    "igo.modeDesc.I": "Infrastructure leadership. Strategic planning, governance frameworks, cross-sector synthesis.",
    "igo.modeDesc.J": "Sector-shaping influence. Industry-wide perspective, legacy infrastructure stewardship.",
    "igo.modeDesc.K": "Recognised industry authority. Lifetime achievement integration, cross-generational knowledge transfer.",
    "igo.modeDesc.L": "The capstone. Craftsmanship earned through decades of practice. Master Weaver status.",
}

zh_keys = {
    "igo.hero.tagline": "一款游戏。全年龄。8\u201365+",
    "igo.hero.follows": "你走到哪里，iGO跟到哪里。",
    "igo.hero.desc1": "世界首个",
    "igo.hero.desc2": "终身基础设施学习游戏",
    "igo.hero.desc3": "12个文明接力。500代人。12种游戏格式。从孩子的第一次旋转到大师织工的巅峰。一个架构、一个评分系统、一个社区——",
    "igo.hero.desc4": "跨越每一代人",
    "igo.stats.relays": "接力",
    "igo.stats.greatWebs": "大网络",
    "igo.stats.inventions": "发明",
    "igo.stats.generations": "世代",
    "igo.stats.gameFormats": "游戏格式",
    "igo.stats.ageRange": "年龄范围",
    "igo.stats.xpCap": "经验上限",
    "igo.findMode.desc": "点击你的年龄段。iGO为你展示游戏入口。",
    "igo.recommendedMode": "推荐模式",
    "igo.howItWorks": "运作方式",
    "igo.howItWorks.desc": "三个篇章。一段终身旅程。每个阶段相同的12个接力。",
    "igo.convergence": "融合",
    "igo.payload1": "载荷1 \u2014 意义",
    "igo.payload2": "载荷2 \u2014 内容",
    "igo.payload3": "载荷3 \u2014 背景",
    "igo.gameFormats": "12种游戏格式",
    "igo.community": "社区",
    "igo.playNow": "立即游玩",
    "igo.registerInterest": "注册兴趣",
    "igo.exhibition": "展览",
    "igo.exhibition.desc": "13个沉浸式展厅。iGO的实体呈现——从火到分形连接器。",
    "igo.hall": "展厅",
    "igo.supportMission": "支持使命",
    "igo.supportMission.desc": "无论你想玩、教、合作还是资助——请在下方注册你的兴趣。我们正在打造世界首个终身基础设施学习游戏，需要你的支持来扩展规模。",
    "igo.registered": "已注册",
    "igo.registerAnother": "注册另一个",
    "igo.iAmA": "我是...",
    "igo.name": "姓名",
    "igo.email": "邮箱",
    "igo.organisation": "组织",
    "igo.message": "留言（可选）",
    "igo.registerMyInterest": "注册我的兴趣",
    "igo.registerBacker": "注册为支持者",
    "igo.allModes": "全部12种模式",
    "igo.ep1Filter": "第1集：接力与记忆",
    "igo.ep2Filter": "第2集：探索前行",
    "igo.ep3Filter": "第3集：建设前行",
    "igo.footer.trilogy": "基于 Nigel T. Dearden CEng CWEM 的三部曲",
    "igo.footer.episode1": "第1集：从卡路里到意识",
    "igo.footer.pocBeta": "概念验证测试 \u2014 所有模式测试中",
    "igo.whyBack": "为什么支持",
    "igo.registeredCount": "人已注册兴趣",
    "igo.role.player": "玩家",
    "igo.role.playerDesc": "我想玩iGO",
    "igo.role.educator": "教育者",
    "igo.role.educatorDesc": "我想在课堂中使用iGO",
    "igo.role.institution": "机构",
    "igo.role.institutionDesc": "大学、学校或专业团体",
    "igo.role.sponsor": "赞助者/支持者",
    "igo.role.sponsorDesc": "我想资助规模化",
    "igo.role.other": "其他",
    "igo.role.otherDesc": "一般兴趣或合作",
    "igo.why.workingProduct": "可用产品",
    "igo.why.workingProductDesc": "模式A\u2013D已上线，有真实玩家。完整数据库、AI叙事、经验评分、排行榜——全部运行中。",
    "igo.why.tam": "总可触达市场",
    "igo.why.tamDesc": "每个8\u201365+岁与基础设施互动的人。就是所有人。跨7代人的12个入口。",
    "igo.why.uniqueIp": "独特知识产权",
    "igo.why.uniqueIpDesc": "12个文明接力、91+发明、60节点迪尔登场、DAVID AI、4种原型——没有竞争者拥有这种架构。",
    "igo.why.academic": "学术对齐",
    "igo.why.academicDesc": "对接ABET、华盛顿协议、AHEP4、联合国可持续发展目标。从第一天起就准备好大学整合。",
    "igo.why.governance": "治理就位",
    "igo.why.governanceDesc": "四面体观察者协议、SAP-001治理、完整审计追踪。为机构信任而建。",
    "igo.why.mobileApp": "移动应用路线图",
    "igo.why.mobileAppDesc": "Web概念验证证明了概念。移动应用（模式G\u2013L启用AR）是规模化载体。预注册现已开放。",
    "igo.ep.1": "接力与记忆",
    "igo.ep.2": "探索前行",
    "igo.ep.3": "建设前行",
    "igo.epDesc.1": "通过游戏、叙事和学术严谨学习12个接力",
    "igo.epDesc.2": "将接力知识应用于专业基础设施职业",
    "igo.epDesc.3": "领导、倡导和教授——行会传统的实现",
    "igo.mode.A": "接力转盘",
    "igo.mode.B": "地牢探索",
    "igo.mode.C": "灰质之力",
    "igo.mode.D": "驾驶台",
    "igo.mode.E": "学者",
    "igo.mode.F": "学术",
    "igo.mode.G": "毕业生",
    "igo.mode.H": "特许工程师",
    "igo.mode.I": "高级领导",
    "igo.mode.J": "行业领袖",
    "igo.mode.K": "行业冠军",
    "igo.mode.L": "大师班",
    "igo.modeDesc.A": "与基础设施的第一次接触。旋转接力轮，通过游戏发现12个文明接力。",
    "igo.modeDesc.B": "通过接力地牢进行叙事探索。DAVID引导冒险。收集iCard，获得经验。",
    "igo.modeDesc.C": "解锁战略思维。更深入的接力分析、仿生连接、跨接力模式识别。",
    "igo.modeDesc.D": "沉浸式驾驶舱HUD模式。完整接力任务、FITS团队协作、伴侣机器人。",
    "igo.modeDesc.E": "完整AD&D RPG格式。DAVID作为地牢主宰。论文级作品，ISI评分。",
    "igo.modeDesc.F": "教授监督项目。R3评审小组评估，ISI评分，同行评审。",
    "igo.modeDesc.G": "早期职业基础设施专业人士。CPD对齐的接力任务，毕业生计划整合。",
    "igo.modeDesc.H": "特许工程师路径。ICE/IStructE/CIHT对齐，专业评审准备。",
    "igo.modeDesc.I": "基础设施领导力。战略规划、治理框架、跨部门综合。",
    "igo.modeDesc.J": "塑造行业影响力。行业视角、遗产基础设施管理。",
    "igo.modeDesc.K": "公认的行业权威。终身成就整合、跨代知识传承。",
    "igo.modeDesc.L": "巅峰。通过数十年实践获得的工艺。大师织工地位。",
}

# Write EN keys to a temp file
with open("/tmp/igo_en_keys.txt", "w") as f:
    for k, v in en_keys.items():
        f.write(f'  "{k}": "{v}",\n')

# Write ZH keys to a temp file
with open("/tmp/igo_zh_keys.txt", "w") as f:
    for k, v in zh_keys.items():
        f.write(f'  "{k}": "{v}",\n')

print(f"Generated {len(en_keys)} EN keys and {len(zh_keys)} ZH keys")
print("EN keys saved to /tmp/igo_en_keys.txt")
print("ZH keys saved to /tmp/igo_zh_keys.txt")
