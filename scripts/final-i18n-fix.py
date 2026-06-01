#!/usr/bin/env python3
"""Final i18n fix - replace all remaining hardcoded English text with t() calls."""
import os
os.chdir('/home/ubuntu/the-reality-engine')

# Mapping of (filename, old_text, new_text)
replacements = [
    # AppraisalQuestionnaire.tsx
    ('client/src/pages/AppraisalQuestionnaire.tsx',
     'Your honest feedback helps us make this experience better for everyone.',
     '{t("appraisal.honestFeedback")}'),
    ('client/src/pages/AppraisalQuestionnaire.tsx',
     'Takes about 2 minutes. All responses are anonymous unless you choose to share your name.',
     '{t("appraisal.takesMinutes")}'),
    ('client/src/pages/AppraisalQuestionnaire.tsx',
     'Continue to Questions',
     '{t("appraisal.continueToQuestions")}'),
    ('client/src/pages/AppraisalQuestionnaire.tsx',
     'Skip this question',
     '{t("appraisal.skipQuestion")}'),
    ('client/src/pages/AppraisalQuestionnaire.tsx',
     'Your feedback has been recorded and will help shape the future of',
     '{t("appraisal.feedbackRecorded")}'),
    ('client/src/pages/AppraisalQuestionnaire.tsx',
     'Your appraisal has been sent to the project team for review.',
     '{t("appraisal.appraisalSent")}'),
    ('client/src/pages/AppraisalQuestionnaire.tsx',
     'Back to Home',
     '{t("appraisal.backToHome")}'),
    
    # ExplorerRelay.tsx
    ('client/src/pages/ExplorerRelay.tsx',
     'Tap to Discover — {inventions.length} Inventions',
     '{t("explore.tapDiscover")} — {inventions.length} {t("explore.inventions")}'),
    
    # FlightDeck.tsx
    ('client/src/pages/FlightDeck.tsx',
     'Tap each node to activate. Complete all 60 to unlock the Synthesis page.',
     '{t("flight.tapNodeInstruction")}'),
    
    # Frameworks.tsx
    ('client/src/pages/Frameworks.tsx',
     'We add the missing second law: Collaborate.',
     '{t("frameworks.secondLaw")}'),
    ('client/src/pages/Frameworks.tsx',
     'The engine room can never walk the deck.',
     '{t("frameworks.engineRoom")}'),
    
    # GovernanceDeck.tsx
    ('client/src/pages/GovernanceDeck.tsx',
     'Five phases. One protocol. The line is not safe until the system is tested.',
     '{t("governance.fivePhases")}'),
    ('client/src/pages/GovernanceDeck.tsx',
     'Governance records, feedback reports, and DCSN network nodes — all pulled live from the database.',
     '{t("governance.auditDesc")}'),
    
    # NetworkDirectory.tsx
    ('client/src/pages/NetworkDirectory.tsx',
     'Select all on page',
     '{t("network.selectAll")}'),
    
    # Resources.tsx
    ('client/src/pages/Resources.tsx',
     'The complete collection of handbooks, design documents, Turing Papers, and governance protocols',
     '{t("resources.description")}'),
    
    # ScholarCreate.tsx
    ('client/src/pages/ScholarCreate.tsx',
     'Navigate the 12 Relays to build your infrastructure thesis — DAVID serves as your Dungeon Master',
     '{t("scholar.navigateRelays")}'),
    
    # YodaControl.tsx
    ('client/src/pages/YodaControl.tsx',
     'The human always holds the lever.',
     '{t("yoda.humanLever")}'),
    ('client/src/pages/YodaControl.tsx',
     'Active scanning. The YODA lever points outward — seeking new data, new connections, new nodes in the Dearden Field.',
     '{t("yoda.activeScanning")}'),
]

# Apply replacements
for filename, old, new in replacements:
    with open(filename, 'r') as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(filename, 'w') as f:
            f.write(content)
        print(f'  Fixed: {filename} - "{old[:40]}..."')
    else:
        print(f'  SKIP: {filename} - "{old[:40]}..." (not found)')

# Now add all new keys to EN and ZH dictionaries
en_keys = {
    'appraisal.honestFeedback': 'Your honest feedback helps us make this experience better for everyone.',
    'appraisal.takesMinutes': 'Takes about 2 minutes. All responses are anonymous unless you choose to share your name.',
    'appraisal.continueToQuestions': 'Continue to Questions',
    'appraisal.skipQuestion': 'Skip this question',
    'appraisal.feedbackRecorded': 'Your feedback has been recorded and will help shape the future of',
    'appraisal.appraisalSent': 'Your appraisal has been sent to the project team for review.',
    'appraisal.backToHome': 'Back to Home',
    'explore.tapDiscover': 'Tap to Discover',
    'explore.inventions': 'Inventions',
    'flight.tapNodeInstruction': 'Tap each node to activate. Complete all 60 to unlock the Synthesis page.',
    'frameworks.secondLaw': 'We add the missing second law: Collaborate.',
    'frameworks.engineRoom': 'The engine room can never walk the deck.',
    'governance.fivePhases': 'Five phases. One protocol. The line is not safe until the system is tested.',
    'governance.auditDesc': 'Governance records, feedback reports, and DCSN network nodes — all pulled live from the database.',
    'network.selectAll': 'Select all on page',
    'resources.description': 'The complete collection of handbooks, design documents, Turing Papers, and governance protocols',
    'scholar.navigateRelays': 'Navigate the 12 Relays to build your infrastructure thesis — DAVID serves as your Dungeon Master',
    'yoda.humanLever': 'The human always holds the lever.',
    'yoda.activeScanning': 'Active scanning. The YODA lever points outward — seeking new data, new connections, new nodes in the Dearden Field.',
}

zh_keys = {
    'appraisal.honestFeedback': '您的真实反馈帮助我们为每个人改善体验。',
    'appraisal.takesMinutes': '大约需要2分钟。除非您选择分享姓名，否则所有回复均为匿名。',
    'appraisal.continueToQuestions': '继续回答问题',
    'appraisal.skipQuestion': '跳过此问题',
    'appraisal.feedbackRecorded': '您的反馈已记录，将帮助塑造未来的',
    'appraisal.appraisalSent': '您的评估已发送给项目团队审阅。',
    'appraisal.backToHome': '返回首页',
    'explore.tapDiscover': '点击探索',
    'explore.inventions': '项发明',
    'flight.tapNodeInstruction': '点击每个节点以激活。完成全部60个以解锁综合页面。',
    'frameworks.secondLaw': '我们补充了缺失的第二定律：协作。',
    'frameworks.engineRoom': '机舱永远无法走上甲板。',
    'governance.fivePhases': '五个阶段。一个协议。系统未经测试前，界线不安全。',
    'governance.auditDesc': '治理记录、反馈报告和DCSN网络节点 — 全部从数据库实时拉取。',
    'network.selectAll': '全选当前页',
    'resources.description': '手册、设计文档、图灵论文和治理协议的完整合集',
    'scholar.navigateRelays': '导航12个接力赛以构建你的基础设施论文 — DAVID担任你的地下城主',
    'yoda.humanLever': '人类始终掌握控制杆。',
    'yoda.activeScanning': '主动扫描中。YODA控制杆指向外部 — 寻找新数据、新连接、迪尔登场中的新节点。',
}

for fname, keys in [('client/src/i18n/en.ts', en_keys), ('client/src/i18n/zh.ts', zh_keys)]:
    with open(fname, 'r') as f:
        content = f.read()
    new_entries = ''
    added = 0
    for k, v in keys.items():
        if f'"{k}"' not in content:
            # Escape any quotes in value
            v_escaped = v.replace('"', '\\"')
            new_entries += f'  "{k}": "{v_escaped}",\n'
            added += 1
    if new_entries:
        pos = content.rfind('}')
        content = content[:pos] + new_entries + content[pos:]
        with open(fname, 'w') as f:
            f.write(content)
        print(f'Added {added} keys to {fname}')
    else:
        print(f'All keys already exist in {fname}')

print('\nAll done!')
