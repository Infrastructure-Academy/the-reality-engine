# iGO Page ZH Issues

The iGO page (IGOUmbrella.tsx) has MASSIVE amounts of English still showing in ZH mode.

## Still in English:
- Hero section: "ONE GAME. ALL AGES. 8-65+", "Where you go, iGO follows."
- Full description paragraph: "The world's first lifelong infrastructure learning game..."
- Stats labels: "RELAYS", "GREAT WEBS", "INVENTIONS", "GENERATIONS", "GAME FORMATS", "AGE RANGE", "XP CAP"
- Section: "Find your mode" subtitle "Tap your age bracket..."
- Section: "HOW IT WORKS" + "Three episodes. One lifelong journey..."
- Episode titles: "RELAY & REMEMBER", "EXPLORE FORWARD", "BUILD FORWARD"
- Episode descriptions: "Learn the 12 relays through play...", "Apply relay knowledge...", "Lead, champion, and teach..."
- All 12 game mode titles: "Relay Spinner", "Dungeon Crawl", "Grey Matter", "Flight Deck", etc.
- All mode descriptions
- Section: "THE EXHIBITION"
- Registration form: "Player I want to play iGO", "Educator...", etc.
- Button text: "JOIN", "PLAY NOW — MODES A–D LIVE", "SUPPORT THE MISSION"

## Already translated:
- Top nav: 学院, 探索, 交易, 纪念, 新闻
- Some mode status labels: 设计, 愿景
- Some bottom CTA: 模式A-D已上线, 概念验证测试

## Root cause:
IGOUmbrella.tsx has most of its content hardcoded in English. The batch fix only caught a few strings.
This page needs comprehensive i18n retrofit.
