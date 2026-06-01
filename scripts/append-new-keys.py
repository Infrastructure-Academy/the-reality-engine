#!/usr/bin/env python3
"""Append new i18n keys to EN and ZH dictionaries."""
import re

BASE = "/home/ubuntu/the-reality-engine/client/src/i18n"

NEW_EN = {
    "common.loading": "Loading...",
    "common.send": "Send",
    "explorer.askDavid": "Ask DAVID about Relay {n}: {name}",
    "explorer.discoveries": "Discoveries",
    "explorer.discovery": "Discovery!",
    "explorer.found": "Found",
    "explorer.loading": "Loading relay data...",
    "explorer.missionBriefing": "Mission Briefing",
    "explorer.missionObjective": "Mission Objective",
    "explorer.narrator": "Explorer Narrator",
    "explorer.relayOf12": "Relay {n} of 12",
    "explorer.relayProgress": "Relay Progress",
    "explorer.swipeNav": "Swipe to navigate",
    "explorer.tapDiscover": "Tap to discover",
    "explorer.theStory": "The Story",
    "igo.ages": "Ages {ages}",
    "igo.epDetails": "Ages {ages} · Modes {modes}",
    "igo.from2500": "From 2,500 BCE to 2026. Open your eye. iAAi.",
    "igo.helpScale": "Help us scale from PoC to global platform. Educators, institutions, sponsors welcome.",
    "igo.modeDetails": "Ages {ages} · {dice} · EP.{ep} · {gen}",
    "igo.modesLive": "Modes A\\u2013D are live. Explorer, Dungeon Crawl, Grey Matter, Flight Deck.",
    "igo.registerRoles": "Register Interest \\u2014 All Roles",
    "igo.stageGrowth": "Stage Growth",
    "igo.structuralProof": "The structural proof. Territory \\u2192 Knowledge.",
    "igo.threeGames": "Three games. Three eras. One convergence.",
    "scholar.accessRequired": "Scholar Access Required",
    "scholar.startingXP": "Starting XP",
    "scholar.thesisDev": "Thesis Development",
    "scholar.thesisTitle": "Thesis Title",
    "scholar.totalScore": "Total Score",
}

NEW_ZH = {
    "common.loading": "加载中...",
    "common.send": "发送",
    "explorer.askDavid": "询问DAVID关于接力 {n}: {name}",
    "explorer.discoveries": "发现",
    "explorer.discovery": "发现！",
    "explorer.found": "已发现",
    "explorer.loading": "加载接力数据...",
    "explorer.missionBriefing": "任务简报",
    "explorer.missionObjective": "任务目标",
    "explorer.narrator": "探索叙述者",
    "explorer.relayOf12": "接力 {n}/12",
    "explorer.relayProgress": "接力进度",
    "explorer.swipeNav": "滑动导航",
    "explorer.tapDiscover": "点击发现",
    "explorer.theStory": "故事",
    "igo.ages": "年龄 {ages}",
    "igo.epDetails": "年龄 {ages} · 模式 {modes}",
    "igo.from2500": "从公元前2,500年到2026年。睁开你的眼睛。iAAi。",
    "igo.helpScale": "帮助我们从概念验证扩展到全球平台。欢迎教育者、机构和赞助商。",
    "igo.modeDetails": "年龄 {ages} · {dice} · 第{ep}集 · {gen}",
    "igo.modesLive": "模式A\\u2013D已上线。探索者、地牢爬行、灰质、飞行甲板。",
    "igo.registerRoles": "注册兴趣 \\u2014 所有角色",
    "igo.stageGrowth": "阶段成长",
    "igo.structuralProof": "结构性证明。领土 \\u2192 知识。",
    "igo.threeGames": "三个游戏。三个时代。一次融合。",
    "scholar.accessRequired": "需要学者权限",
    "scholar.startingXP": "起始经验",
    "scholar.thesisDev": "论文开发",
    "scholar.thesisTitle": "论文标题",
    "scholar.totalScore": "总分",
}

def append_keys(filepath, new_keys):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check which keys already exist
    to_add = {}
    for key, val in new_keys.items():
        if f'"{key}"' not in content:
            to_add[key] = val
    
    if not to_add:
        print(f"  No new keys needed for {filepath}")
        return
    
    # Find the last key-value pair before the closing }
    # Insert before the last line that has }
    lines = content.split('\n')
    insert_idx = None
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].strip() == '};' or lines[i].strip() == '}':
            insert_idx = i
            break
    
    if insert_idx is None:
        print(f"  ERROR: Could not find closing brace in {filepath}")
        return
    
    # Build new lines
    new_lines = []
    for key, val in sorted(to_add.items()):
        # Escape quotes in value
        escaped_val = val.replace('"', '\\"')
        new_lines.append(f'  "{key}": "{escaped_val}",')
    
    # Insert
    for idx, line in enumerate(new_lines):
        lines.insert(insert_idx + idx, line)
    
    with open(filepath, 'w') as f:
        f.write('\n'.join(lines))
    
    print(f"  Added {len(to_add)} keys to {filepath}")

print("Adding EN keys...")
append_keys(f"{BASE}/en.ts", NEW_EN)
print("Adding ZH keys...")
append_keys(f"{BASE}/zh.ts", NEW_ZH)
print("Done!")
