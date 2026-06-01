#!/usr/bin/env python3
"""
Batch fix all remaining hardcoded English strings across all pages.
Generates EN and ZH dictionary entries.
"""
import re, os

BASE = "/home/ubuntu/the-reality-engine/client/src"

# Mapping: (file_path_suffix, old_string) -> (i18n_key, en_value, zh_value)
REPLACEMENTS = {
    # === ExplorerRelay.tsx ===
    ("pages/ExplorerRelay.tsx", '>The Story<'): ('>{ t("explorer.theStory") }<', "explorer.theStory", "The Story", "故事"),
    ("pages/ExplorerRelay.tsx", '>Mission Objective<'): ('>{ t("explorer.missionObjective") }<', "explorer.missionObjective", "Mission Objective", "任务目标"),
    ("pages/ExplorerRelay.tsx", '>Relay Progress<'): ('>{ t("explorer.relayProgress") }<', "explorer.relayProgress", "Relay Progress", "接力进度"),
    ("pages/ExplorerRelay.tsx", '>Mission Briefing<'): ('>{ t("explorer.missionBriefing") }<', "explorer.missionBriefing", "Mission Briefing", "任务简报"),
    ("pages/ExplorerRelay.tsx", '>Found<'): ('>{ t("explorer.found") }<', "explorer.found", "Found", "已发现"),
    ("pages/ExplorerRelay.tsx", '>Loading relay data...</'): ('>{ t("explorer.loading") }</', "explorer.loading", "Loading relay data...", "加载接力数据..."),
    ("pages/ExplorerRelay.tsx", '>Explorer Narrator<'): ('>{ t("explorer.narrator") }<', "explorer.narrator", "Explorer Narrator", "探索叙述者"),
    
    # === MobileExplorer.tsx ===
    ("pages/MobileExplorer.tsx", '>The Story<'): ('>{ t("explorer.theStory") }<', None, None, None),  # reuse key
    ("pages/MobileExplorer.tsx", '>Discoveries<'): ('>{ t("explorer.discoveries") }<', "explorer.discoveries", "Discoveries", "发现"),
    ("pages/MobileExplorer.tsx", '>Tap to discover<'): ('>{ t("explorer.tapDiscover") }<', "explorer.tapDiscover", "Tap to discover", "点击发现"),
    ("pages/MobileExplorer.tsx", '>Relay Progress<'): ('>{ t("explorer.relayProgress") }<', None, None, None),  # reuse key
    ("pages/MobileExplorer.tsx", '>Swipe to navigate<'): ('>{ t("explorer.swipeNav") }<', "explorer.swipeNav", "Swipe to navigate", "滑动导航"),
    ("pages/MobileExplorer.tsx", '>Home<'): ('>{ t("tab.home") }<', None, None, None),  # reuse key
    ("pages/MobileExplorer.tsx", '>Explore<'): ('>{ t("tab.explore") }<', None, None, None),  # reuse key
    ("pages/MobileExplorer.tsx", '>Rank<'): ('>{ t("tab.rank") }<', None, None, None),  # reuse key
    ("pages/MobileExplorer.tsx", '>Discovery!</'): ('>{ t("explorer.discovery") }</', "explorer.discovery", "Discovery!", "发现！"),
    
    # === IGOUmbrella.tsx ===
    ("pages/IGOUmbrella.tsx", '>Stage Growth<'): ('>{ t("igo.stageGrowth") }<', "igo.stageGrowth", "Stage Growth", "阶段成长"),
    ("pages/IGOUmbrella.tsx", '>Three games. Three eras. One convergence.<'): ('>{ t("igo.threeGames") }<', "igo.threeGames", "Three games. Three eras. One convergence.", "三个游戏。三个时代。一次融合。"),
    ("pages/IGOUmbrella.tsx", '>The structural proof. Territory → Knowledge.<'): ('>{ t("igo.structuralProof") }<', "igo.structuralProof", "The structural proof. Territory → Knowledge.", "结构性证明。领土 → 知识。"),
    ("pages/IGOUmbrella.tsx", '>From 2,500 BCE to 2026. Open your eye. <span className="brand-i">i</span>AAi.<'): ('>{ t("igo.from2500") }<', "igo.from2500", "From 2,500 BCE to 2026. Open your eye. iAAi.", "从公元前2,500年到2026年。睁开你的眼睛。iAAi。"),
    ("pages/IGOUmbrella.tsx", '>Modes A–D are live. Explorer, Dungeon Crawl, Grey Matter, Flight Deck.<'): ('>{ t("igo.modesLive") }<', "igo.modesLive", "Modes A–D are live. Explorer, Dungeon Crawl, Grey Matter, Flight Deck.", "模式A–D已上线。探索者、地牢爬行、灰质、飞行甲板。"),
    ("pages/IGOUmbrella.tsx", '>Help us scale from PoC to global platform. Educators, institutions, sponsors welcome.<'): ('>{ t("igo.helpScale") }<', "igo.helpScale", "Help us scale from PoC to global platform. Educators, institutions, sponsors welcome.", "帮助我们从概念验证扩展到全球平台。欢迎教育者、机构和赞助商。"),
    ("pages/IGOUmbrella.tsx", '>Register Interest — All Roles<'): ('>{ t("igo.registerRoles") }<', "igo.registerRoles", "Register Interest — All Roles", "注册兴趣 — 所有角色"),
    
    # === ScholarCreate.tsx ===
    ("pages/ScholarCreate.tsx", '>Scholar Access Required<'): ('>{ t("scholar.accessRequired") }<', "scholar.accessRequired", "Scholar Access Required", "需要学者权限"),
    ("pages/ScholarCreate.tsx", '>Total Score<'): ('>{ t("scholar.totalScore") }<', "scholar.totalScore", "Total Score", "总分"),
    ("pages/ScholarCreate.tsx", '>Starting XP<'): ('>{ t("scholar.startingXP") }<', "scholar.startingXP", "Starting XP", "起始经验"),
    ("pages/ScholarCreate.tsx", '>Thesis Development<'): ('>{ t("scholar.thesisDev") }<', "scholar.thesisDev", "Thesis Development", "论文开发"),
    ("pages/ScholarCreate.tsx", '>Thesis Title<'): ('>{ t("scholar.thesisTitle") }<', "scholar.thesisTitle", "Thesis Title", "论文标题"),
    ("pages/ScholarCreate.tsx", '>Send<'): ('>{ t("common.send") }<', "common.send", "Send", "发送"),
    
    # === DungeonCrawl.tsx ===
    ("pages/DungeonCrawl.tsx", '>Loading...</'): ('>{ t("common.loading") }</', "common.loading", "Loading...", "加载中..."),
    
    # === Synthesis.tsx ===
    ("pages/Synthesis.tsx", '>Loading...</'): ('>{ t("common.loading") }</', None, None, None),  # reuse
    
    # === Journey.tsx ===
    ("pages/Journey.tsx", '>Loading...</'): ('>{ t("common.loading") }</', None, None, None),  # reuse
    
    # === GovernanceDeck.tsx ===
    ("pages/GovernanceDeck.tsx", '>Loading...</'): ('>{ t("common.loading") }</', None, None, None),  # reuse
    
    # === Frameworks.tsx ===
    ("pages/Frameworks.tsx", '>Loading...</'): ('>{ t("common.loading") }</', None, None, None),  # reuse
    
    # === NetworkDirectory.tsx ===
    ("pages/NetworkDirectory.tsx", '>Loading...</'): ('>{ t("common.loading") }</', None, None, None),  # reuse
}

# Additional replacements that need regex (for dynamic content like "Relay {num} of 12")
REGEX_REPLACEMENTS = {
    "pages/ExplorerRelay.tsx": [
        (r'>Relay {relayNum} of 12 — {relayMeta\.subtitle}<', '>{t("explorer.relayOf12").replace("{n}", String(relayNum))} — {t(`relay.subtitle.${relayNum}`) || relayMeta.subtitle}<'),
        (r'>Ask DAVID about Relay {relayNum}: {relayMeta\.name}<', '>{t("explorer.askDavid").replace("{n}", String(relayNum)).replace("{name}", t(`relay.${relayMeta.name.toLowerCase().replace(/ /g, "")}`) || relayMeta.name)}<'),
    ],
    "pages/MobileExplorer.tsx": [
        (r'>Relay {currentRelay \+ 1} of 12<', '>{t("explorer.relayOf12").replace("{n}", String(currentRelay + 1))}<'),
    ],
    "pages/IGOUmbrella.tsx": [
        (r'>Ages {m\.ages} · {m\.dice} · EP\.{m\.episode} · {m\.generation}<', '>{t("igo.modeDetails").replace("{ages}", m.ages).replace("{dice}", m.dice).replace("{ep}", String(m.episode)).replace("{gen}", m.generation)}<'),
        (r'>Ages {ep\.ages} · Modes {ep\.modes}<', '>{t("igo.epDetails").replace("{ages}", ep.ages).replace("{modes}", ep.modes)}<'),
        (r'>Ages {mode\.ages}<', '>{t("igo.ages").replace("{ages}", mode.ages)}<'),
    ],
}

# Collect new EN and ZH keys
new_en_keys = {}
new_zh_keys = {}

for (file_suffix, old_str), (new_str, key, en_val, zh_val) in REPLACEMENTS.items():
    if key and en_val and zh_val:
        new_en_keys[key] = en_val
        new_zh_keys[key] = zh_val

# Add keys for regex replacements
new_en_keys["explorer.relayOf12"] = "Relay {n} of 12"
new_zh_keys["explorer.relayOf12"] = "接力 {n}/12"
new_en_keys["explorer.askDavid"] = "Ask DAVID about Relay {n}: {name}"
new_zh_keys["explorer.askDavid"] = "询问DAVID关于接力 {n}: {name}"
new_en_keys["igo.modeDetails"] = "Ages {ages} · {dice} · EP.{ep} · {gen}"
new_zh_keys["igo.modeDetails"] = "年龄 {ages} · {dice} · 第{ep}集 · {gen}"
new_en_keys["igo.epDetails"] = "Ages {ages} · Modes {modes}"
new_zh_keys["igo.epDetails"] = "年龄 {ages} · 模式 {modes}"
new_en_keys["igo.ages"] = "Ages {ages}"
new_zh_keys["igo.ages"] = "年龄 {ages}"

# Process simple replacements
for (file_suffix, old_str), (new_str, key, en_val, zh_val) in REPLACEMENTS.items():
    filepath = os.path.join(BASE, file_suffix)
    if not os.path.exists(filepath):
        print(f"SKIP (not found): {filepath}")
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    if old_str in content:
        content = content.replace(old_str, new_str, 1)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"FIXED: {file_suffix} — {old_str[:40]}...")
    else:
        print(f"NOT FOUND: {file_suffix} — {old_str[:40]}...")

# Process regex replacements
for file_suffix, patterns in REGEX_REPLACEMENTS.items():
    filepath = os.path.join(BASE, file_suffix)
    if not os.path.exists(filepath):
        print(f"SKIP (not found): {filepath}")
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    for pattern, replacement in patterns:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content, count=1)
            print(f"REGEX FIXED: {file_suffix} — {pattern[:40]}...")
        else:
            print(f"REGEX NOT FOUND: {file_suffix} — {pattern[:40]}...")
    with open(filepath, 'w') as f:
        f.write(content)

# Output new keys
print("\n\n=== NEW EN KEYS ===")
for k, v in sorted(new_en_keys.items()):
    print(f'  "{k}": "{v}",')

print("\n\n=== NEW ZH KEYS ===")
for k, v in sorted(new_zh_keys.items()):
    print(f'  "{k}": "{v}",')
