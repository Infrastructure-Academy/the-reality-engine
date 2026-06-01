#!/usr/bin/env python3
"""Batch fix remaining hardcoded English strings — round 2."""
import re, os

BASE = "/home/ubuntu/the-reality-engine/client/src"

# Simple string replacements: (file, old) -> new_replacement
SIMPLE = [
    # === DungeonCrawl.tsx ===
    ("pages/DungeonCrawl.tsx", ">Roll your ability scores. Three chances to get the best combination.<", '>{t("dungeon.rollAbility")}<'),
    ("pages/DungeonCrawl.tsx", ">Higher scores = better chance of passing ability checks in dungeons<", '>{t("dungeon.higherScores")}<'),
    ("pages/DungeonCrawl.tsx", ">Ability Check Required<", '>{t("dungeon.abilityCheck")}<'),
    ("pages/DungeonCrawl.tsx", ">Discovery Unlocked<", '>{t("dungeon.discoveryUnlocked")}<'),
    ("pages/DungeonCrawl.tsx", ">Room Cleared ✓<", '>{t("dungeon.roomCleared")}<'),
    ("pages/DungeonCrawl.tsx", ">Character Sheet<", '>{t("dungeon.characterSheet")}<'),
    
    # === Frameworks.tsx ===
    ("pages/Frameworks.tsx", ">The New North<", '>{t("frameworks.newNorth")}<'),
    ("pages/Frameworks.tsx", ">The Consciousness Compass<", '>{t("frameworks.consciousnessCompass")}<'),
    ("pages/Frameworks.tsx", ">The Walkby<", '>{t("frameworks.walkby")}<'),
    
    # === Synthesis.tsx ===
    ("pages/Synthesis.tsx", ">Total XP<", '>{t("synthesis.totalXP")}<'),
    ("pages/Synthesis.tsx", ">The Perspective<", '>{t("synthesis.perspective")}<'),
    ("pages/Synthesis.tsx", ">The narrative foundation — 12,000 years of infrastructure told as story<", '>{t("synthesis.perspectiveDesc")}<'),
    ("pages/Synthesis.tsx", ">The Guide<", '>{t("synthesis.guide")}<'),
    ("pages/Synthesis.tsx", ">The Game<", '>{t("synthesis.game")}<'),
    ("pages/Synthesis.tsx", ">The Reality Engine — the Guided Learning Platform you just experienced<", '>{t("synthesis.gameDesc")}<'),
    
    # === FlightDeck.tsx ===
    ("pages/FlightDeck.tsx", ">Each vessel aligns with a FITS temperament and a Great Web<", '>{t("flight.vesselAligns")}<'),
    ("pages/FlightDeck.tsx", ">The Dearden Field is fully mapped. View your civilizational pattern.<", '>{t("flight.fieldMapped")}<'),
    ("pages/FlightDeck.tsx", ">Flight Deck Co-Pilot<", '>{t("flight.coPilot")}<'),
    ("pages/FlightDeck.tsx", ">Request mission briefings, node analysis, or navigation guidance.<", '>{t("flight.requestMission")}<'),
    ("pages/FlightDeck.tsx", '>Send</', '>{t("common.send")}</'),
    
    # === GovernanceDeck.tsx ===
    ("pages/GovernanceDeck.tsx", ">Dimension: Risk, Authority & System Assurance<", '>{t("governance.dimension")}<'),
    ("pages/GovernanceDeck.tsx", ">Governance Deck — Power Card<", '>{t("governance.powerCard")}<'),
    ("pages/GovernanceDeck.tsx", ">Protocol<", '>{t("governance.protocol")}<'),
    ("pages/GovernanceDeck.tsx", ">Rules that rely on compliance<", '>{t("governance.rulesCompliance")}<'),
    ("pages/GovernanceDeck.tsx", ">Wisdom + Knowledge<", '>{t("governance.wisdomKnowledge")}<'),
    ("pages/GovernanceDeck.tsx", ">Save On Receipt<", '>{t("governance.saveOnReceipt")}<'),
    ("pages/GovernanceDeck.tsx", ">Data + Information<", '>{t("governance.dataInfo")}<'),
    ("pages/GovernanceDeck.tsx", ">Processes, Stores, Researches, Compresses<", '>{t("governance.processes")}<'),
    ("pages/GovernanceDeck.tsx", ">Rail Possession Logic Applied to Man + Machine<", '>{t("governance.railPossession")}<'),
    ("pages/GovernanceDeck.tsx", ">Live Database — Full Transparency<", '>{t("governance.liveDatabase")}<'),
    ("pages/GovernanceDeck.tsx", ">Loading governance records...</", '>{t("governance.loadingRecords")}</'),
    ("pages/GovernanceDeck.tsx", ">No governance records match your filters.<", '>{t("governance.noRecords")}<'),
    ("pages/GovernanceDeck.tsx", ">Loading feedback reports...</", '>{t("governance.loadingFeedback")}</'),
    ("pages/GovernanceDeck.tsx", ">No feedback reports match your filters.<", '>{t("governance.noFeedback")}<'),
    ("pages/GovernanceDeck.tsx", ">Loading DCSN nodes...</", '>{t("governance.loadingDCSN")}</'),
    ("pages/GovernanceDeck.tsx", ">No DCSN nodes match your filters.<", '>{t("governance.noDCSN")}<'),
    
    # === Journey.tsx ===
    ("pages/Journey.tsx", ">Show Less <", '>{t("common.showLess")} <'),
    ("pages/Journey.tsx", ">Show All {events.length} Events <", '>{t("common.showAll").replace("{n}", String(events.length))} <'),
    
    # === IGOUmbrella.tsx remaining ===
    ("pages/IGOUmbrella.tsx", ">PoC Beta — Ages 8–18<", '>{t("igo.pocBeta")}<'),
    ("pages/IGOUmbrella.tsx", ">Already have an account?", '>{t("igo.alreadyAccount")}'),
    
    # === AppraisalQuestionnaire.tsx ===
    ("pages/AppraisalQuestionnaire.tsx", ">Loading...</", '>{t("common.loading")}</'),
]

# Collect new keys
new_en = {
    "dungeon.rollAbility": "Roll your ability scores. Three chances to get the best combination.",
    "dungeon.higherScores": "Higher scores = better chance of passing ability checks in dungeons",
    "dungeon.abilityCheck": "Ability Check Required",
    "dungeon.discoveryUnlocked": "Discovery Unlocked",
    "dungeon.roomCleared": "Room Cleared ✓",
    "dungeon.characterSheet": "Character Sheet",
    "frameworks.newNorth": "The New North",
    "frameworks.consciousnessCompass": "The Consciousness Compass",
    "frameworks.walkby": "The Walkby",
    "synthesis.totalXP": "Total XP",
    "synthesis.perspective": "The Perspective",
    "synthesis.perspectiveDesc": "The narrative foundation — 12,000 years of infrastructure told as story",
    "synthesis.guide": "The Guide",
    "synthesis.game": "The Game",
    "synthesis.gameDesc": "The Reality Engine — the Guided Learning Platform you just experienced",
    "flight.vesselAligns": "Each vessel aligns with a FITS temperament and a Great Web",
    "flight.fieldMapped": "The Dearden Field is fully mapped. View your civilizational pattern.",
    "flight.coPilot": "Flight Deck Co-Pilot",
    "flight.requestMission": "Request mission briefings, node analysis, or navigation guidance.",
    "governance.dimension": "Dimension: Risk, Authority & System Assurance",
    "governance.powerCard": "Governance Deck — Power Card",
    "governance.protocol": "Protocol",
    "governance.rulesCompliance": "Rules that rely on compliance",
    "governance.wisdomKnowledge": "Wisdom + Knowledge",
    "governance.saveOnReceipt": "Save On Receipt",
    "governance.dataInfo": "Data + Information",
    "governance.processes": "Processes, Stores, Researches, Compresses",
    "governance.railPossession": "Rail Possession Logic Applied to Man + Machine",
    "governance.liveDatabase": "Live Database — Full Transparency",
    "governance.loadingRecords": "Loading governance records...",
    "governance.noRecords": "No governance records match your filters.",
    "governance.loadingFeedback": "Loading feedback reports...",
    "governance.noFeedback": "No feedback reports match your filters.",
    "governance.loadingDCSN": "Loading DCSN nodes...",
    "governance.noDCSN": "No DCSN nodes match your filters.",
    "common.showLess": "Show Less",
    "common.showAll": "Show All {n} Events",
    "igo.pocBeta": "PoC Beta — Ages 8–18",
    "igo.alreadyAccount": "Already have an account?",
}

new_zh = {
    "dungeon.rollAbility": "掷出你的能力值。三次机会获得最佳组合。",
    "dungeon.higherScores": "更高的分数 = 更好的通过地牢能力检定的机会",
    "dungeon.abilityCheck": "需要能力检定",
    "dungeon.discoveryUnlocked": "发现已解锁",
    "dungeon.roomCleared": "房间已清除 ✓",
    "dungeon.characterSheet": "角色卡",
    "frameworks.newNorth": "新北方",
    "frameworks.consciousnessCompass": "意识罗盘",
    "frameworks.walkby": "行走者",
    "synthesis.totalXP": "总经验值",
    "synthesis.perspective": "视角",
    "synthesis.perspectiveDesc": "叙事基础 — 12,000年基础设施以故事形式讲述",
    "synthesis.guide": "指南",
    "synthesis.game": "游戏",
    "synthesis.gameDesc": "现实引擎 — 你刚刚体验的引导学习平台",
    "flight.vesselAligns": "每艘飞船对应一种FITS气质和一条大网",
    "flight.fieldMapped": "迪尔登场已完全映射。查看你的文明模式。",
    "flight.coPilot": "飞行甲板副驾驶",
    "flight.requestMission": "请求任务简报、节点分析或导航指引。",
    "governance.dimension": "维度：风险、权限与系统保障",
    "governance.powerCard": "治理甲板 — 力量卡",
    "governance.protocol": "协议",
    "governance.rulesCompliance": "依赖合规的规则",
    "governance.wisdomKnowledge": "智慧 + 知识",
    "governance.saveOnReceipt": "收到即保存",
    "governance.dataInfo": "数据 + 信息",
    "governance.processes": "处理、存储、研究、压缩",
    "governance.railPossession": "铁路所有权逻辑应用于人与机器",
    "governance.liveDatabase": "实时数据库 — 完全透明",
    "governance.loadingRecords": "加载治理记录...",
    "governance.noRecords": "没有治理记录匹配您的筛选条件。",
    "governance.loadingFeedback": "加载反馈报告...",
    "governance.noFeedback": "没有反馈报告匹配您的筛选条件。",
    "governance.loadingDCSN": "加载DCSN节点...",
    "governance.noDCSN": "没有DCSN节点匹配您的筛选条件。",
    "common.showLess": "收起",
    "common.showAll": "显示全部 {n} 个事件",
    "igo.pocBeta": "概念验证测试 — 年龄 8–18",
    "igo.alreadyAccount": "已有账户？",
}

# Process simple replacements
for file_suffix, old_str, new_str in SIMPLE:
    filepath = os.path.join(BASE, file_suffix)
    if not os.path.exists(filepath):
        print(f"SKIP: {filepath}")
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    if old_str in content:
        content = content.replace(old_str, new_str, 1)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"FIXED: {file_suffix} — {old_str[:50]}...")
    else:
        print(f"NOT FOUND: {file_suffix} — {old_str[:50]}...")

# Also handle DungeonCrawl "Room {n} of {total}" regex
filepath = os.path.join(BASE, "pages/DungeonCrawl.tsx")
with open(filepath, 'r') as f:
    content = f.read()
pattern = r'>Room \{currentRoom \+ 1\} of \{totalDungeonRooms\}<'
replacement = '>{t("dungeon.roomOf").replace("{n}", String(currentRoom + 1)).replace("{total}", String(totalDungeonRooms))}<'
if re.search(pattern, content):
    content = re.sub(pattern, replacement, content, count=1)
    with open(filepath, 'w') as f:
        f.write(content)
    print("REGEX FIXED: DungeonCrawl — Room {n} of {total}")
else:
    print("REGEX NOT FOUND: DungeonCrawl — Room {n} of {total}")

new_en["dungeon.roomOf"] = "Room {n} of {total}"
new_zh["dungeon.roomOf"] = "房间 {n}/{total}"

# Journey "Relay {n}: {name}" regex
filepath = os.path.join(BASE, "pages/Journey.tsx")
with open(filepath, 'r') as f:
    content = f.read()
pattern = r'>Relay \{relay\.number\}: \{relay\.name\}<'
replacement = '>{t("journey.relayName").replace("{n}", String(relay.number)).replace("{name}", relay.name)}<'
if re.search(pattern, content):
    content = re.sub(pattern, replacement, content, count=1)
    with open(filepath, 'w') as f:
        f.write(content)
    print("REGEX FIXED: Journey — Relay {n}: {name}")
else:
    print("REGEX NOT FOUND: Journey — Relay {n}: {name}")

new_en["journey.relayName"] = "Relay {n}: {name}"
new_zh["journey.relayName"] = "接力 {n}: {name}"

# Journey "Next: {emoji} {name}" regex
pattern = r'>Next: \{next\.badge\.emoji\} \{next\.badge\.name\}<'
replacement = '>{t("journey.next")}: {next.badge.emoji} {next.badge.name}<'
with open(filepath, 'r') as f:
    content = f.read()
if re.search(pattern, content):
    content = re.sub(pattern, replacement, content, count=1)
    with open(filepath, 'w') as f:
        f.write(content)
    print("REGEX FIXED: Journey — Next: {emoji} {name}")
else:
    print("REGEX NOT FOUND: Journey — Next: {emoji} {name}")

new_en["journey.next"] = "Next"
new_zh["journey.next"] = "下一个"

# Frameworks "Level {n}" regex
filepath = os.path.join(BASE, "pages/Frameworks.tsx")
with open(filepath, 'r') as f:
    content = f.read()
pattern = r'>Level \{level\.level\}<'
replacement = '>{t("frameworks.level").replace("{n}", String(level.level))}<'
if re.search(pattern, content):
    content = re.sub(pattern, replacement, content, count=1)
    with open(filepath, 'w') as f:
        f.write(content)
    print("REGEX FIXED: Frameworks — Level {n}")
else:
    print("REGEX NOT FOUND: Frameworks — Level {n}")

new_en["frameworks.level"] = "Level {n}"
new_zh["frameworks.level"] = "等级 {n}"

# Now append keys to dictionaries
def append_keys(filepath, new_keys):
    with open(filepath, 'r') as f:
        content = f.read()
    to_add = {}
    for key, val in new_keys.items():
        if f'"{key}"' not in content:
            to_add[key] = val
    if not to_add:
        print(f"  No new keys needed for {filepath}")
        return
    lines = content.split('\n')
    insert_idx = None
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].strip() in ('};', '}'):
            insert_idx = i
            break
    if insert_idx is None:
        print(f"  ERROR: Could not find closing brace in {filepath}")
        return
    new_lines = []
    for key, val in sorted(to_add.items()):
        escaped_val = val.replace('\\', '\\\\').replace('"', '\\"')
        new_lines.append(f'  "{key}": "{escaped_val}",')
    for idx, line in enumerate(new_lines):
        lines.insert(insert_idx + idx, line)
    with open(filepath, 'w') as f:
        f.write('\n'.join(lines))
    print(f"  Added {len(to_add)} keys to {filepath}")

print("\nAdding EN keys...")
append_keys(f"{BASE}/../i18n/en.ts", new_en)
print("Adding ZH keys...")
append_keys(f"{BASE}/../i18n/zh.ts", new_zh)
print("Done!")
