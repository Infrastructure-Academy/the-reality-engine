"""
GP-001 Compliance: Replace all hardcoded English strings with t() calls.
Also generates EN and ZH dictionary entries to append to the dictionaries.
"""
import re, os, json

pages_dir = 'client/src/pages'
SKIP = {'Home.tsx', 'MobileExplorer.tsx', 'ComponentShowcase.tsx', 'ExplorerSelect.tsx'}

# Master replacement map: file prefix -> { "English Text": "i18n.key" }
# We'll define keys per page for clarity
REPLACEMENTS = {
    "RelaySpinner.tsx": {
        "prefix": "spinner",
        "strings": {
            "RELAY SPINNER": "spinner.title",
            "SPINNER": "spinner.badge",
            "Spins": "spinner.spins",
            "Discoveries Unlocked": "spinner.discoveriesUnlocked",
            "Match symbols to unlock discoveries": "spinner.matchSymbols",
            "Relay Collection": "spinner.relayCollection",
        }
    },
    "DungeonCrawl.tsx": {
        "prefix": "dungeon",
        "strings": {
            "DUNGEON CRAWL": "dungeon.title",
            "DUNGEON": "dungeon.badge",
            "Room": "dungeon.room",
            "Rooms": "dungeon.rooms",
            "Relay": "dungeon.relay",
            "Discoveries": "dungeon.discoveries",
            "Enter the next room": "dungeon.enterNext",
            "DAVID speaks...": "dungeon.davidSpeaks",
            "Loading dungeon...": "dungeon.loading",
        }
    },
    "GreyMatter.tsx": {
        "prefix": "greymatter",
        "strings": {
            "GREY MATTER": "greymatter.title",
            "Civilisation Clock": "greymatter.clock",
            "Phase 1: Discovery": "greymatter.phase1",
            "Phase 2: Knowledge": "greymatter.phase2",
            "Phase 3: Application": "greymatter.phase3",
            "Powers of Grey Matter": "greymatter.powers",
            "Transformation Level": "greymatter.transformLevel",
            "I HAVE THE KNOWLEDGE!": "greymatter.haveKnowledge",
            "POWER EARNED!": "greymatter.powerEarned",
            "Power earned! This relay is complete.": "greymatter.relayComplete",
            "Explore the relay's inventions and uncover its secrets": "greymatter.exploreInventions",
            "Connect the dots — how does this relay link to others?": "greymatter.connectDots",
            "Apply the knowledge — earn the power, push the Clock back": "greymatter.applyKnowledge",
        }
    },
    "FlightDeck.tsx": {
        "prefix": "flight",
        "strings": {
            "FLIGHT DECK": "flight.titleUpper",
            "Flight Deck": "flight.title",
            "Select Your Craft": "flight.selectCraft",
            "Flight Deck Access Required": "flight.accessRequired",
            "Sign in to select your craft and navigate the Dearden Field": "flight.signInPrompt",
            "Navigate the Dearden Field": "flight.navigateField",
            "LAUNCH": "flight.launch",
            "PILOT": "flight.pilot",
            "CRAFT": "flight.craft",
            "FIRE RELAY": "flight.fireRelay",
            "Commander": "flight.commander",
        }
    },
    "Leaderboard.tsx": {
        "prefix": "leaderboard",
        "strings": {
            "LEADERBOARD": "leaderboard.title",
            "Hall of Infrastructure": "leaderboard.hallTitle",
            "Top explorers, pilots, and scholars across all modes": "leaderboard.subtitle",
            "Loading leaderboard...": "leaderboard.loading",
            "No players yet. Be the first to explore!": "leaderboard.noPlayers",
            "Rank": "leaderboard.rank",
            "Player": "leaderboard.player",
            "Combined XP": "leaderboard.combinedXp",
            "Relays": "leaderboard.relays",
            "Status": "leaderboard.status",
            "Active": "leaderboard.active",
            "GURU": "leaderboard.guru",
            "GURU Status": "leaderboard.guruStatus",
            "LIVE": "leaderboard.live",
            "BitPoints": "leaderboard.bitpoints",
        }
    },
    "Journey.tsx": {
        "prefix": "journey",
        "strings": {
            "MY JOURNEY": "journey.title",
            "My Journey": "journey.titleCase",
            "Loading your journey...": "journey.loading",
            "No discoveries yet": "journey.noDiscoveries",
            "Start exploring relays to build your timeline.": "journey.startExploring",
            "Sign in to view your exploration timeline and achievements.": "journey.signInPrompt",
            "Your Player Card": "journey.playerCard",
            "Total XP": "journey.totalXp",
            "Relays Done": "journey.relaysDone",
            "Nodes": "journey.nodes",
            "Discoveries": "journey.discoveries",
            "Show Less": "journey.showLess",
        }
    },
    "Resources.tsx": {
        "prefix": "resources",
        "strings": {
            "RESOURCES": "resources.title",
            "DOCUMENTS": "resources.documents",
            "Document Library": "resources.docLibrary",
            "THE GUIDE": "resources.theGuide",
            "THE GAME": "resources.theGame",
            "THE PERSPECTIVE": "resources.thePerspective",
            "ACTIVE": "resources.active",
            "LOCKED": "resources.locked",
            "BETA": "common.beta",
            "BOOK 1 — EPISODE 1: CALORIES TO CONSCIOUSNESS": "resources.book1",
            "An Infrastructure Odyssey — Episode 1: Calories to Consciousness": "resources.odysseyEp1",
            "Narrative foundation — the story of 12,000 years": "resources.narrativeFoundation",
            "Interactive platform — Explorer, Flight Deck, Scholar": "resources.interactivePlatform",
            "Part 3 — The Reality Engine": "resources.part3",
        }
    },
    "Prologue.tsx": {
        "prefix": "prologue",
        "strings": {
            "DAVID NARRATING": "prologue.davidNarrating",
            "DAVID PROLOGUE": "prologue.title",
        }
    },
    "NotFound.tsx": {
        "prefix": "notfound",
        "strings": {
            "Signal Lost": "notfound.signalLost",
        }
    },
    "MediaGallery.tsx": {
        "prefix": "media",
        "strings": {
            "MEDIA CATALOGUE": "media.title",
            "CATEGORY": "media.category",
            "BRIDGE": "media.bridge",
            "No assets found matching your filters": "media.noAssets",
        }
    },
    "Synthesis.tsx": {
        "prefix": "synthesis",
        "strings": {
            "SYNTHESIS": "synthesis.title",
            "Analyzing your journey...": "synthesis.analyzing",
            "RELAY COMPLETION": "synthesis.relayCompletion",
            "PERSPECTIVE DISTRIBUTION": "synthesis.perspectiveDist",
            "Relay-by-Relay Breakdown": "synthesis.breakdown",
            "Deeper Exploration": "synthesis.deeperExploration",
            "SHARE YOUR JOURNEY": "synthesis.shareJourney",
            "CHALLENGE A FRIEND": "synthesis.challengeFriend",
            "Help Us Improve": "synthesis.helpImprove",
            "GURU STATUS ACHIEVED": "synthesis.guruAchieved",
            "BitPoints": "synthesis.bitpoints",
            "Discoveries": "synthesis.discoveries",
            "Aligned scholars:": "synthesis.alignedScholars",
            "Take 2 minutes to share your experience — your feedback shapes the next version.": "synthesis.feedbackPrompt",
            "The 4-Pillar Framework — Observational, Educational, Application, Thesis": "synthesis.fourPillar",
        }
    },
    "ScholarCreate.tsx": {
        "prefix": "scholar",
        "strings": {
            "BETA": "common.beta",
            "DAVID": "scholar.david",
            "Academic Assessment": "scholar.academicAssessment",
            "Dungeon Master": "scholar.dungeonMaster",
            "Character Name": "scholar.characterName",
            "Current XP": "scholar.currentXp",
            "D20 Bonus Roll": "scholar.d20Bonus",
            "DAVID awaits your command, Scholar.": "scholar.davidAwaits",
            "Ask for thesis guidance, relay analysis, or Socratic inquiry.": "scholar.askGuidance",
            "FITS Temperament Assessment": "scholar.fitsAssessment",
            "Grading Thresholds:": "scholar.gradingThresholds",
            "NATURAL 20 — Critical Success!": "scholar.nat20",
            "Relay Research Progress": "scholar.relayResearch",
            "Relays Researched": "scholar.relaysResearched",
            "Roll Your Ability Scores": "scholar.rollAbility",
        }
    },
    "CardCollection.tsx": {
        "prefix": "cards",
        "strings": {
            "CARD COLLECTION": "cards.title",
            "Your discovered relay cards": "cards.subtitle",
            "No cards collected yet": "cards.noCards",
            "Play Relay Spinner or explore relays to collect cards.": "cards.playToCollect",
        }
    },
    "BridgeHub.tsx": {
        "prefix": "bridges",
        "strings": {
            "BRIDGE HUB": "bridges.title",
            "Cross-relay connections": "bridges.subtitle",
            "Loading bridges...": "bridges.loading",
        }
    },
    "ChallengeLanding.tsx": {
        "prefix": "challenge",
        "strings": {
            "CHALLENGE": "challenge.title",
            "Accept Challenge": "challenge.accept",
            "Loading challenge...": "challenge.loading",
        }
    },
    "Frameworks.tsx": {
        "prefix": "frameworks",
        "strings": {
            "FRAMEWORKS": "frameworks.title",
            "BETA": "common.beta",
            "Card": "frameworks.card",
            "HARD CONTROLS": "frameworks.hardControls",
            "SOFT CONTROLS": "frameworks.softControls",
            "MISSING LAW": "frameworks.missingLaw",
            "Tetrahedral Observer": "frameworks.tetrahedralObserver",
            "Asimov 3 becomes 4 — The Missing Law": "frameworks.asimov",
            "AI CANNOT DO THE WALKBY": "frameworks.aiWalkby",
            "AAi Archive": "frameworks.aaiArchive",
        }
    },
    "IGOUmbrella.tsx": {
        "prefix": "igoPage",
        "strings": {
            "ENTER THE GAME": "igoPage.enterGame",
            "FIND YOUR MODE": "igoPage.findMode",
            "BACK THE PROJECT": "igoPage.backProject",
            "EVERY GENERATION. ONE GAME.": "igoPage.everyGeneration",
            "GREAT WEBS": "igoPage.greatWebs",
            "GO MOBILE APP": "igoPage.goMobileApp",
            "DESIGNED": "igoPage.designed",
            "ASPIRATIONAL": "igoPage.aspirational",
            "COMMUNITY:": "igoPage.community",
            "GO — Three games. Three eras. One convergence.": "igoPage.goConvergence",
            "GO app launches": "igoPage.goAppLaunches",
            "GO. We'll be in touch.": "igoPage.goInTouch",
            "From 2,500 BCE to 2026. Open your eye.": "igoPage.fromBce",
        }
    },
    "YodaControl.tsx": {
        "prefix": "yoda",
        "strings": {
            "BETA": "common.beta",
            "SCADA LOOP": "yoda.scadaLoop",
            "SCADA Schema": "yoda.scadaSchema",
            "The SCADA of Consciousness": "yoda.scadaConsciousness",
            "The Four Steps": "yoda.fourSteps",
            "Search": "yoda.search",
            "Orient": "yoda.orient",
            "Decisive": "yoda.decisive",
            "Action": "yoda.action",
            "Explorer": "yoda.explorer",
            "Flight Deck": "yoda.flightDeck",
            "Scholar": "yoda.scholar",
            "In The Reality Engine": "yoda.inTre",
            "Remember Mode — The Quill Mask": "yoda.rememberMode",
            "Search Mode — The Yaka Arrow": "yoda.searchMode",
        }
    },
    "NetworkDirectory.tsx": {
        "prefix": "network",
        "strings": {
            "AGN NETWORK DIRECTORY": "network.title",
            "Network Directory": "network.titleCase",
            "Loading contacts...": "network.loading",
            "ADMIN": "network.admin",
            "Name": "network.name",
            "Msgs": "network.msgs",
            "Details": "network.details",
            "Color": "network.color",
            "Assign Tags": "network.assignTags",
            "Assign tag:": "network.assignTag",
            "Assigning...": "network.assigning",
            "All tags assigned": "network.allTagsAssigned",
            "Display Name:": "network.displayName",
            "First Message:": "network.firstMessage",
            "Last Message:": "network.lastMessage",
        }
    },
    "IgoAdmin.tsx": {
        "prefix": "igoAdmin",
        "strings": {
            "ADMIN": "igoAdmin.title",
            "Loading registrations...": "igoAdmin.loading",
            "No registrations yet": "igoAdmin.noRegistrations",
            "Share the iGO page to start collecting interest": "igoAdmin.sharePrompt",
            "Total": "igoAdmin.total",
            "Name": "igoAdmin.name",
            "Email": "igoAdmin.email",
            "Role": "igoAdmin.role",
            "Organisation": "igoAdmin.organisation",
            "Message": "igoAdmin.message",
            "Date": "igoAdmin.date",
        }
    },
    "GovernanceDeck.tsx": {
        "prefix": "governance",
        "strings": {
            "Audit Trail": "governance.auditTrail",
            "BETA": "common.beta",
            "Card Gallery": "governance.cardGallery",
            "Cards": "governance.cards",
            "Cards First, Read Source": "governance.cardsFirst",
            "Case Study": "governance.caseStudy",
            "Cell": "governance.cell",
            "Context": "governance.context",
            "Corrective Actions Chain": "governance.correctiveActions",
            "DAVID ZONE": "governance.davidZone",
            "Decides, Names, Frames, Approves": "governance.decides",
            "Access": "governance.access",
            "Barriers that shape behaviour": "governance.barriers",
            "Block Ref:": "governance.blockRef",
            "Cards from the": "governance.cardsFrom",
        }
    },
    "AppraisalQuestionnaire.tsx": {
        "prefix": "appraisal",
        "strings": {
            "APPRAISAL": "appraisal.title",
            "Submit": "appraisal.submit",
            "Loading...": "appraisal.loading",
        }
    },
    "ExplorerRelay.tsx": {
        "prefix": "explorerRelay",
        "strings": {
            "EXPLORER": "explorerRelay.badge",
            "Inventions": "explorerRelay.inventions",
            "Loading relay...": "explorerRelay.loading",
            "Discoveries": "explorerRelay.discoveries",
            "Next Relay": "explorerRelay.nextRelay",
            "Previous": "explorerRelay.previous",
        }
    },
}

def do_replacements(content, string_map):
    """Replace hardcoded strings with t() calls in JSX content."""
    for eng_text, key in string_map.items():
        # Pattern 1: >Text< (between tags)
        pattern1 = f'>{re.escape(eng_text)}<'
        replacement1 = f'>{{{t_call(key)}}}<'
        content = content.replace(f'>{eng_text}<', f'>{{{t_call(key)}}}<')
        
        # Pattern 2: >Text</  (text before closing tag)
        content = content.replace(f'>{eng_text}</', f'>{{{t_call(key)}}}</')
        
        # Pattern 3: "Text" in JSX expressions (but not in imports/classNames)
        # Only replace in specific contexts like title="Text" or label="Text"
        for attr in ['title', 'placeholder', 'label', 'alt', 'aria-label']:
            content = content.replace(f'{attr}="{eng_text}"', f'{attr}={{{t_call(key)}}}')
        
    return content

def t_call(key):
    return f't("{key}")'

# Process each file
for fname, config in REPLACEMENTS.items():
    path = os.path.join(pages_dir, fname)
    if not os.path.exists(path):
        print(f"  SKIP (not found): {fname}")
        continue
    
    with open(path) as f:
        content = f.read()
    
    content = do_replacements(content, config["strings"])
    
    with open(path, 'w') as f:
        f.write(content)
    
    print(f"  ✓ {fname} ({len(config['strings'])} replacements)")

# Generate EN dictionary entries
print("\n\n// ─── NEW EN KEYS (append to en.ts) ───")
all_en = {}
for fname, config in REPLACEMENTS.items():
    for eng_text, key in config["strings"].items():
        if key.startswith("common."):
            continue  # Already exists
        all_en[key] = eng_text

for key in sorted(all_en.keys()):
    print(f'  "{key}": "{all_en[key]}",')

# Generate ZH dictionary entries  
print("\n\n// ─── NEW ZH KEYS (append to zh.ts) ───")
# ZH translations - I'll provide proper Mandarin
ZH_MAP = {
    "spinner.title": "接力转盘",
    "spinner.badge": "转盘",
    "spinner.spins": "旋转次数",
    "spinner.discoveriesUnlocked": "已解锁发现",
    "spinner.matchSymbols": "匹配符号解锁发现",
    "spinner.relayCollection": "接力收藏",
    "dungeon.title": "地牢探索",
    "dungeon.badge": "地牢",
    "dungeon.room": "房间",
    "dungeon.rooms": "房间",
    "dungeon.relay": "接力",
    "dungeon.discoveries": "发现",
    "dungeon.enterNext": "进入下一个房间",
    "dungeon.davidSpeaks": "DAVID 正在说话...",
    "dungeon.loading": "加载地牢中...",
    "greymatter.title": "灰质",
    "greymatter.clock": "文明时钟",
    "greymatter.phase1": "第一阶段：发现",
    "greymatter.phase2": "第二阶段：知识",
    "greymatter.phase3": "第三阶段：应用",
    "greymatter.powers": "灰质之力",
    "greymatter.transformLevel": "转化等级",
    "greymatter.haveKnowledge": "我已掌握知识！",
    "greymatter.powerEarned": "力量已获得！",
    "greymatter.relayComplete": "力量已获得！此接力已完成。",
    "greymatter.exploreInventions": "探索接力的发明并揭开其秘密",
    "greymatter.connectDots": "连接线索 — 这个接力如何与其他接力关联？",
    "greymatter.applyKnowledge": "应用知识 — 获得力量，推回时钟",
    "flight.titleUpper": "驾驶台",
    "flight.launch": "发射",
    "flight.pilot": "飞行员",
    "flight.craft": "飞船",
    "flight.fireRelay": "火焰接力",
    "flight.commander": "指挥官",
    "leaderboard.title": "排行榜",
    "leaderboard.hallTitle": "基础设施名人堂",
    "leaderboard.subtitle": "所有模式中的顶级探索者、飞行员和学者",
    "leaderboard.loading": "加载排行榜中...",
    "leaderboard.noPlayers": "暂无玩家。成为第一个探索者！",
    "leaderboard.rank": "排名",
    "leaderboard.player": "玩家",
    "leaderboard.combinedXp": "综合经验",
    "leaderboard.relays": "接力",
    "leaderboard.status": "状态",
    "leaderboard.active": "活跃",
    "leaderboard.guru": "大师",
    "leaderboard.guruStatus": "大师状态",
    "leaderboard.live": "实时",
    "leaderboard.bitpoints": "比特积分",
    "journey.title": "我的旅程",
    "journey.titleCase": "我的旅程",
    "journey.loading": "加载旅程中...",
    "journey.noDiscoveries": "暂无发现",
    "journey.startExploring": "开始探索接力以构建你的时间线。",
    "journey.signInPrompt": "登录以查看你的探索时间线和成就。",
    "journey.playerCard": "你的玩家卡",
    "journey.totalXp": "总经验",
    "journey.relaysDone": "已完成接力",
    "journey.nodes": "节点",
    "journey.discoveries": "发现",
    "journey.showLess": "收起",
    "resources.title": "资源",
    "resources.documents": "文档",
    "resources.docLibrary": "文档库",
    "resources.theGuide": "指南",
    "resources.theGame": "游戏",
    "resources.thePerspective": "视角",
    "resources.active": "活跃",
    "resources.locked": "锁定",
    "resources.book1": "第一册 — 第一集：从卡路里到意识",
    "resources.odysseyEp1": "基础设施奥德赛 — 第一集：从卡路里到意识",
    "resources.narrativeFoundation": "叙事基础 — 12,000年的故事",
    "resources.interactivePlatform": "互动平台 — 探索者、驾驶台、学者",
    "resources.part3": "第三部分 — 现实引擎",
    "prologue.davidNarrating": "DAVID 旁白中",
    "prologue.title": "DAVID 序章",
    "notfound.signalLost": "信号丢失",
    "media.title": "媒体目录",
    "media.category": "分类",
    "media.bridge": "桥梁",
    "media.noAssets": "未找到匹配筛选条件的资源",
    "synthesis.title": "综合",
    "synthesis.analyzing": "分析你的旅程中...",
    "synthesis.relayCompletion": "接力完成度",
    "synthesis.perspectiveDist": "视角分布",
    "synthesis.breakdown": "逐接力分析",
    "synthesis.deeperExploration": "深度探索",
    "synthesis.shareJourney": "分享你的旅程",
    "synthesis.challengeFriend": "挑战好友",
    "synthesis.helpImprove": "帮助我们改进",
    "synthesis.guruAchieved": "大师状态已达成",
    "synthesis.bitpoints": "比特积分",
    "synthesis.discoveries": "发现",
    "synthesis.alignedScholars": "志同道合的学者：",
    "synthesis.feedbackPrompt": "花2分钟分享你的体验 — 你的反馈将塑造下一个版本。",
    "synthesis.fourPillar": "四支柱框架 — 观察、教育、应用、论文",
    "scholar.david": "DAVID",
    "scholar.academicAssessment": "学术评估",
    "scholar.dungeonMaster": "地牢主宰",
    "scholar.characterName": "角色名称",
    "scholar.currentXp": "当前经验",
    "scholar.d20Bonus": "D20 加成骰",
    "scholar.davidAwaits": "DAVID 等待你的指令，学者。",
    "scholar.askGuidance": "询问论文指导、接力分析或苏格拉底式探究。",
    "scholar.fitsAssessment": "FITS 气质评估",
    "scholar.gradingThresholds": "评分阈值：",
    "scholar.nat20": "天然20 — 大成功！",
    "scholar.relayResearch": "接力研究进度",
    "scholar.relaysResearched": "已研究接力",
    "scholar.rollAbility": "投掷你的能力值",
    "cards.title": "卡片收藏",
    "cards.subtitle": "你发现的接力卡片",
    "cards.noCards": "暂无收集的卡片",
    "cards.playToCollect": "玩接力转盘或探索接力以收集卡片。",
    "bridges.title": "桥梁中心",
    "bridges.subtitle": "跨接力连接",
    "bridges.loading": "加载桥梁中...",
    "challenge.title": "挑战",
    "challenge.accept": "接受挑战",
    "challenge.loading": "加载挑战中...",
    "frameworks.title": "框架",
    "frameworks.card": "卡片",
    "frameworks.hardControls": "硬控制",
    "frameworks.softControls": "软控制",
    "frameworks.missingLaw": "缺失定律",
    "frameworks.tetrahedralObserver": "四面体观察者",
    "frameworks.asimov": "阿西莫夫三定律变四 — 缺失定律",
    "frameworks.aiWalkby": "AI 无法进行现场巡视",
    "frameworks.aaiArchive": "AAi 档案",
    "igoPage.enterGame": "进入游戏",
    "igoPage.findMode": "找到你的模式",
    "igoPage.backProject": "支持项目",
    "igoPage.everyGeneration": "每一代人。一个游戏。",
    "igoPage.greatWebs": "大网络",
    "igoPage.goMobileApp": "GO 移动应用",
    "igoPage.designed": "设计",
    "igoPage.aspirational": "愿景",
    "igoPage.community": "社区：",
    "igoPage.goConvergence": "GO — 三个游戏。三个时代。一次融合。",
    "igoPage.goAppLaunches": "GO 应用启动",
    "igoPage.goInTouch": "GO。我们会联系你。",
    "igoPage.fromBce": "从公元前2,500年到2026年。睁开你的眼睛。",
    "yoda.scadaLoop": "SCADA 循环",
    "yoda.scadaSchema": "SCADA 架构",
    "yoda.scadaConsciousness": "意识的SCADA",
    "yoda.fourSteps": "四个步骤",
    "yoda.search": "搜索",
    "yoda.orient": "定向",
    "yoda.decisive": "决断",
    "yoda.action": "行动",
    "yoda.explorer": "探索者",
    "yoda.flightDeck": "驾驶台",
    "yoda.scholar": "学者",
    "yoda.inTre": "在现实引擎中",
    "yoda.rememberMode": "记忆模式 — 羽毛笔面具",
    "yoda.searchMode": "搜索模式 — 亚卡箭",
    "network.title": "AGN 网络目录",
    "network.titleCase": "网络目录",
    "network.loading": "加载联系人中...",
    "network.admin": "管理员",
    "network.name": "名称",
    "network.msgs": "消息",
    "network.details": "详情",
    "network.color": "颜色",
    "network.assignTags": "分配标签",
    "network.assignTag": "分配标签：",
    "network.assigning": "分配中...",
    "network.allTagsAssigned": "所有标签已分配",
    "network.displayName": "显示名称：",
    "network.firstMessage": "第一条消息：",
    "network.lastMessage": "最后一条消息：",
    "igoAdmin.title": "管理员",
    "igoAdmin.loading": "加载注册信息中...",
    "igoAdmin.noRegistrations": "暂无注册",
    "igoAdmin.sharePrompt": "分享 iGO 页面以开始收集兴趣",
    "igoAdmin.total": "总计",
    "igoAdmin.name": "名称",
    "igoAdmin.email": "邮箱",
    "igoAdmin.role": "角色",
    "igoAdmin.organisation": "组织",
    "igoAdmin.message": "消息",
    "igoAdmin.date": "日期",
    "governance.auditTrail": "审计追踪",
    "governance.cardGallery": "卡片画廊",
    "governance.cards": "卡片",
    "governance.cardsFirst": "先看卡片，再读来源",
    "governance.caseStudy": "案例研究",
    "governance.cell": "单元",
    "governance.context": "背景",
    "governance.correctiveActions": "纠正措施链",
    "governance.davidZone": "DAVID 区域",
    "governance.decides": "决定、命名、构建、批准",
    "governance.access": "访问",
    "governance.barriers": "塑造行为的屏障",
    "governance.blockRef": "区块参考：",
    "governance.cardsFrom": "来自的卡片",
    "appraisal.title": "评估",
    "appraisal.submit": "提交",
    "appraisal.loading": "加载中...",
    "explorerRelay.badge": "探索者",
    "explorerRelay.inventions": "发明",
    "explorerRelay.loading": "加载接力中...",
    "explorerRelay.discoveries": "发现",
    "explorerRelay.nextRelay": "下一个接力",
    "explorerRelay.previous": "上一个",
    "explorer.title": "探索者模式",
    "explorer.choosePathway": "选择你的路径",
    "explorer.agesSubtitle": "8–14岁 — 四种探索方式",
    "explorer.chooseAdventure": "选择你的冒险",
    "explorer.description": "相同的12个接力。相同的91+发明。相同的知识。四种不同的发现方式。随时切换，不会丢失进度。",
    "explorer.mode.classic": "经典探索者",
    "explorer.mode.classicAges": "8–14岁",
    "explorer.mode.classicTagline": "点击发现12个文明接力。原始旅程。",
    "explorer.mode.classicCta": "快速开始",
    "explorer.mode.spinner": "接力转盘",
    "explorer.mode.spinnerAges": "8–10岁",
    "explorer.mode.spinnerTagline": "拉动拉杆！匹配接力符号解锁发现。每次旋转都有收获。",
    "explorer.mode.spinnerCta": "旋转开始",
    "explorer.mode.dungeon": "地牢探索",
    "explorer.mode.dungeonAges": "10–12岁",
    "explorer.mode.dungeonTagline": "逐房间探索12个接力地牢。DAVID是你的地牢主宰。",
    "explorer.mode.dungeonCta": "进入地牢",
    "explorer.mode.greymatter": "灰质之力",
    "explorer.mode.greymatterAges": "12–14岁",
    "explorer.mode.greymatterTagline": "获得12个接力力量。完成任务。变身iMan。推回时钟。",
    "explorer.mode.greymatterCta": "开始转化",
    "common.new": "新",
}

for key in sorted(ZH_MAP.keys()):
    print(f'  "{key}": "{ZH_MAP[key]}",')
