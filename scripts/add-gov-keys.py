#!/usr/bin/env python3
import os
os.chdir('/home/ubuntu/the-reality-engine')

for fname, keys in [
    ('client/src/i18n/en.ts', {
        'governance.title': 'GOVERNANCE DECK',
        'governance.tab.power': 'Power Card',
        'governance.tab.audit': 'Audit Trail',
        'governance.tab.gallery': 'iCard Gallery',
        'governance.cardDesc': '10 Teaching Cards + 1 Power Card = 11. Context → Case Study → Protocol → MASTERY.',
        'governance.tier.1.title': 'TIER 1 — POWER',
        'governance.tier.2.title': 'TIER 2 — CONTEXT',
        'governance.tier.3.title': 'TIER 3 — CASE STUDY',
        'governance.tier.4.title': 'TIER 4 — PROTOCOL',
        'governance.tier.1.subtitle': 'YOU ARE HERE — Read first every session',
        'governance.tier.2.subtitle': 'THE SETUP — What went wrong and what it cost',
        'governance.tier.3.subtitle': 'THE LESSONS — Five governance principles from five failures',
        'governance.tier.4.subtitle': 'THE SOLUTION — Master the lessons, earn the protocols',
        'governance.mastery': 'MASTERY',
        'governance.theLine': 'THE LINE',
        'governance.hardControls': 'HARD CONTROLS',
        'governance.softControls': 'SOFT CONTROLS',
        'governance.cards': 'cards',
        'common.back': 'Back',
    }),
    ('client/src/i18n/zh.ts', {
        'governance.title': '治理甲板',
        'governance.tab.power': '力量卡',
        'governance.tab.audit': '审计追踪',
        'governance.tab.gallery': 'iCard 画廊',
        'governance.cardDesc': '10张教学卡 + 1张力量卡 = 11。背景 → 案例研究 → 协议 → 精通。',
        'governance.tier.1.title': '第1层 — 力量',
        'governance.tier.2.title': '第2层 — 背景',
        'governance.tier.3.title': '第3层 — 案例研究',
        'governance.tier.4.title': '第4层 — 协议',
        'governance.tier.1.subtitle': '你在这里 — 每次会话先读此卡',
        'governance.tier.2.subtitle': '背景 — 出了什么问题及其代价',
        'governance.tier.3.subtitle': '教训 — 来自五次失败的五项治理原则',
        'governance.tier.4.subtitle': '解决方案 — 掌握教训，获得协议',
        'governance.mastery': '精通',
        'governance.theLine': '界线',
        'governance.hardControls': '硬性控制',
        'governance.softControls': '软性控制',
        'governance.cards': '张卡',
        'common.back': '返回',
    }),
]:
    with open(fname, 'r') as f:
        content = f.read()
    new_entries = ''
    added = 0
    for k, v in keys.items():
        search = f'"{k}"'
        if search not in content:
            new_entries += f'  "{k}": "{v}",\n'
            added += 1
    if new_entries:
        pos = content.rfind('}')
        content = content[:pos] + new_entries + content[pos:]
        with open(fname, 'w') as f:
            f.write(content)
        print(f'Added {added} keys to {fname}')
    else:
        print(f'All keys already exist in {fname}')
print('Done')
