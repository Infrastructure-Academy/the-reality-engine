/**
 * Authored relay copy for the public Quest door.
 * English strings are the seeded briefing, story, and quote — not new lore.
 * Chinese strings translate only those existing lines:
 * zh-HK is Traditional, as used in Hong Kong; zh-CN is Simplified.
 * Proper names of people and publications stay as authored.
 */

export type StoryLocale = "en" | "zh-HK" | "zh-CN";

export interface LocaleText {
  en: string;
  "zh-HK": string;
  "zh-CN": string;
}

export interface RelayStory {
  number: number;
  xpReward: number;
  quoteAuthor: string;
  subtitle: LocaleText;
  quote: LocaleText;
  narrative: LocaleText;
  missionObjective: LocaleText;
}

export const RELAY_STORIES: readonly RelayStory[] = [
  {
    number: 1,
    xpReward: 443000,
    quoteAuthor: "Ferdinand Foch",
    subtitle: {
      en: "The Eternal Constant",
      "zh-HK": "永恆常數",
      "zh-CN": "永恒常数",
    },
    quote: {
      en: "The most powerful weapon on earth is the human soul on fire.",
      "zh-HK": "世上最強大的武器，是燃燒着的人類靈魂。",
      "zh-CN": "世上最强大的武器，是燃烧着的人类灵魂。",
    },
    narrative: {
      en: "Twelve thousand years ago, a great change erupted of unimaginable proportions. In an explosion of intent, man rose from hunter and prey to apex predator. The seed was sown, the threads spun, and the age of intelligence began. Civilisation ignited — an epic of incalculable possibility.",
      "zh-HK": "一萬二千年前，一場難以想像的巨變爆發。在意向的迸發之中，人從獵者與獵物崛起為頂級掠食者。種子已經播下，絲線已經紡成，智能的時代就此開始。文明被點燃——一部無法估算的可能史詩。",
      "zh-CN": "一万二千年前，一场难以想象的巨变爆发。在意向的迸发之中，人从猎者与猎物崛起为顶级掠食者。种子已经播下，丝线已经纺成，智能的时代就此开始。文明被点燃——一部无法估算的可能史诗。",
    },
    missionObjective: {
      en: "Understand the fundamental role of controlled fire in early human survival and societal development.",
      "zh-HK": "理解受控之火在早期人類生存與社會發展中的根本角色。",
      "zh-CN": "理解受控之火在早期人类生存与社会发展中的根本作用。",
    },
  },
  {
    number: 2,
    xpReward: 520000,
    quoteAuthor: "Ralph Waldo Emerson",
    subtitle: {
      en: "The Living Foundation",
      "zh-HK": "活的基礎",
      "zh-CN": "活的基础",
    },
    quote: {
      en: "The creation of a thousand forests is in one acorn.",
      "zh-HK": "千株森林的創造，盡在一顆橡實之中。",
      "zh-CN": "千株森林的创造，尽在一颗橡实之中。",
    },
    narrative: {
      en: "From the first felled timber to the last great mast, wood was the skeleton of civilisation. Shelter, tools, ships, bridges — the tree gave humanity its first scalable building material and the confidence to reshape the landscape.",
      "zh-HK": "從第一根倒下的木材，到最後一根巨大的桅杆，木材曾是文明的骨架。居所、工具、船隻、橋樑——樹木給了人類第一種可擴展的建築材料，以及重塑地貌的信心。",
      "zh-CN": "从第一根倒下的木材，到最后一根巨大的桅杆，木材曾是文明的骨架。居所、工具、船只、桥梁——树木给了人类第一种可扩展的建筑材料，以及重塑地貌的信心。",
    },
    missionObjective: {
      en: "Explore how timber and woodcraft became the first scalable construction technology.",
      "zh-HK": "探索木材與木工如何成為第一種可擴展的建造技術。",
      "zh-CN": "探索木材与木工如何成为第一种可扩展的建造技术。",
    },
  },
  {
    number: 3,
    xpReward: 610000,
    quoteAuthor: "Paolo Lugari",
    subtitle: {
      en: "Cradles of Continuity",
      "zh-HK": "連續性的搖籃",
      "zh-CN": "连续性的摇篮",
    },
    quote: {
      en: "Civilisation has been a permanent dialogue between human beings and water.",
      "zh-HK": "文明一直是人類與水之間一場永不中斷的對話。",
      "zh-CN": "文明一直是人类与水之间一场永不中断的对话。",
    },
    narrative: {
      en: "The great rivers — Nile, Tigris, Euphrates, Indus, Yellow — became the arteries of early civilisation. Irrigation, transport, trade, and governance all flowed from the mastery of water.",
      "zh-HK": "大河——尼羅河、底格里斯河、幼發拉底河、印度河、黃河——成為早期文明的動脈。灌溉、運輸、貿易與治理，都從對水的掌握中流淌而出。",
      "zh-CN": "大河——尼罗河、底格里斯河、幼发拉底河、印度河、黄河——成为早期文明的动脉。灌溉、运输、贸易与治理，都从对水的掌握中流淌而出。",
    },
    missionObjective: {
      en: "Understand how river systems enabled the first complex civilisations.",
      "zh-HK": "理解河流系統如何促成最早的複雜文明。",
      "zh-CN": "理解河流系统如何促成最早的复杂文明。",
    },
  },
  {
    number: 4,
    xpReward: 720000,
    quoteAuthor: "Spanish Proverb",
    subtitle: {
      en: "The Velocity of Intent",
      "zh-HK": "意圖的速度",
      "zh-CN": "意图的速度",
    },
    quote: {
      en: "A horse is worth more than riches.",
      "zh-HK": "一匹馬，勝過萬貫家財。",
      "zh-CN": "一匹马，胜过万贯家财。",
    },
    narrative: {
      en: "The domestication of the horse transformed warfare, trade, communication, and the very concept of distance. Mounted civilisations could project power, connect empires, and accelerate the diffusion of ideas across continents.",
      "zh-HK": "馬的馴化改變了戰爭、貿易、通訊，以及距離本身的概念。馬背之上的文明可以投射力量、連結帝國，並加快思想在大陸之間的傳播。",
      "zh-CN": "马的驯化改变了战争、贸易、通信，以及距离本身的概念。马背之上的文明可以投射力量、连接帝国，并加快思想在大陆之间的传播。",
    },
    missionObjective: {
      en: "Examine how horse domestication revolutionised mobility, warfare, and trade networks.",
      "zh-HK": "檢視馬的馴化如何徹底改變流動、戰爭與貿易網絡。",
      "zh-CN": "检视马的驯化如何彻底改变流动、战争与贸易网络。",
    },
  },
  {
    number: 5,
    xpReward: 850000,
    quoteAuthor: "Ancient Proverb",
    subtitle: {
      en: "Arteries of Intent",
      "zh-HK": "意圖的動脈",
      "zh-CN": "意图的动脉",
    },
    quote: {
      en: "All roads lead to Rome.",
      "zh-HK": "條條大路通羅馬。",
      "zh-CN": "条条大路通罗马。",
    },
    narrative: {
      en: "Roads are the physical manifestation of political will. From the Persian Royal Road to the Roman network, engineered pathways enabled trade, military logistics, cultural exchange, and the administrative reach of empires.",
      "zh-HK": "道路是政治意志的實體呈現。從波斯御道到羅馬路網，經工程修築的路徑使貿易、軍事後勤、文化交流，以及帝國的行政所及成為可能。",
      "zh-CN": "道路是政治意志的实体呈现。从波斯御道到罗马路网，经工程修筑的路径使贸易、军事后勤、文化交流，以及帝国的行政所及成为可能。",
    },
    missionObjective: {
      en: "Understand how engineered road networks became instruments of imperial power and economic integration.",
      "zh-HK": "理解經工程修築的道路網絡如何成為帝國權力與經濟整合的工具。",
      "zh-CN": "理解经工程修筑的道路网络如何成为帝国权力与经济整合的工具。",
    },
  },
  {
    number: 6,
    xpReward: 980000,
    quoteAuthor: "George Herbert",
    subtitle: {
      en: "The Master Weaver's Reach",
      "zh-HK": "大師織工的觸及",
      "zh-CN": "大师织工的触及",
    },
    quote: {
      en: "He that would learn to pray, let him go to sea.",
      "zh-HK": "欲學祈禱者，請他出海去。",
      "zh-CN": "欲学祈祷者，请他出海去。",
    },
    narrative: {
      en: "Ships extended civilisation beyond the horizon. From Viking longships to Chinese treasure fleets, maritime technology enabled exploration, colonisation, global trade, and the first truly interconnected world economy.",
      "zh-HK": "船隻把文明延伸到地平線之外。從維京長船到中國寶船船隊，航海技術使探索、殖民、全球貿易，以及第一個真正互相連結的世界經濟成為可能。",
      "zh-CN": "船只把文明延伸到地平线之外。从维京长船到中国宝船船队，航海技术使探索、殖民、全球贸易，以及第一个真正互相连接的世界经济成为可能。",
    },
    missionObjective: {
      en: "Explore how maritime technology expanded civilisational reach across oceans.",
      "zh-HK": "探索航海技術如何把文明的所及擴展到海洋之上。",
      "zh-CN": "探索航海技术如何把文明的所及扩展到海洋之上。",
    },
  },
  {
    number: 7,
    xpReward: 1100000,
    quoteAuthor: "Lewis Mumford",
    subtitle: {
      en: "The Binary Birth",
      "zh-HK": "二進制的誕生",
      "zh-CN": "二进制的诞生",
    },
    quote: {
      en: "The loom is the mother of all machines.",
      "zh-HK": "織機是一切機器之母。",
      "zh-CN": "织机是一切机器之母。",
    },
    narrative: {
      en: "The loom was the first programmable machine. From Jacquard's punch cards to the binary logic of modern computing, textile technology planted the seed of the information age within the industrial revolution.",
      "zh-HK": "織機是第一台可編程的機器。從雅卡爾的打孔卡，到現代計算的二進制邏輯，紡織技術在工業革命之中埋下了資訊時代的種子。",
      "zh-CN": "织机是第一台可编程的机器。从雅卡尔的打孔卡，到现代计算的二进制逻辑，纺织技术在工业革命之中埋下了信息时代的种子。",
    },
    missionObjective: {
      en: "Understand how textile machinery became the prototype for programmable technology.",
      "zh-HK": "理解紡織機械如何成為可編程技術的原型。",
      "zh-CN": "理解纺织机械如何成为可编程技术的原型。",
    },
  },
  {
    number: 8,
    xpReward: 1300000,
    quoteAuthor: "The Quarterly Review, 1825",
    subtitle: {
      en: "Standardizing the Continental Rhythm",
      "zh-HK": "大陸節律的標準化",
      "zh-CN": "大陆节律的标准化",
    },
    quote: {
      en: "What can be more palpably absurd than the prospect held out of locomotives travelling twice as fast as stagecoaches?",
      "zh-HK": "還有甚麼比「火車頭將以馬車兩倍的速度行駛」這個前景更顯然荒謬？",
      "zh-CN": "还有什么比“火车头将以马车两倍的速度行驶”这个前景更显然荒谬？",
    },
    narrative: {
      en: "Railways standardised time, unified markets, and compressed geography. The iron horse was the first infrastructure to operate at industrial scale, demanding new forms of engineering, finance, and governance.",
      "zh-HK": "鐵路把時間標準化，統一了市場，並壓縮了地理。鐵馬是第一種以工業規模運作的基礎設施，它要求新的工程、金融與治理形式。",
      "zh-CN": "铁路把时间标准化，统一了市场，并压缩了地理。铁马是第一种以工业规模运作的基础设施，它要求新的工程、金融与治理形式。",
    },
    missionObjective: {
      en: "Examine how railways transformed economics, timekeeping, and national identity.",
      "zh-HK": "檢視鐵路如何改變經濟、計時與民族身份。",
      "zh-CN": "检视铁路如何改变经济、计时与民族身份。",
    },
  },
  {
    number: 9,
    xpReward: 1500000,
    quoteAuthor: "Lewis Mumford",
    subtitle: {
      en: "The Internal Revolution",
      "zh-HK": "內部革命",
      "zh-CN": "内部革命",
    },
    quote: {
      en: "The automobile has not merely taken over the street, it has dissolved the living tissue of the city.",
      "zh-HK": "汽車不單佔去了街道，更溶解了城市活生生的肌理。",
      "zh-CN": "汽车不单占去了街道，更溶解了城市活生生的肌理。",
    },
    narrative: {
      en: "The internal combustion engine democratised mobility. Cars, trucks, and tractors reshaped cities, agriculture, warfare, and the very rhythm of daily life — creating both unprecedented freedom and profound dependency.",
      "zh-HK": "內燃機使流動變得普及。汽車、貨車與拖拉機重塑了城市、農業、戰爭，以及日常生活的節奏——既帶來前所未有的自由，也造成深刻的依賴。",
      "zh-CN": "内燃机使流动变得普及。汽车、卡车与拖拉机重塑了城市、农业、战争，以及日常生活的节奏——既带来前所未有的自由，也造成深刻的依赖。",
    },
    missionObjective: {
      en: "Understand how the internal combustion engine reshaped society, cities, and global logistics.",
      "zh-HK": "理解內燃機如何重塑社會、城市與全球物流。",
      "zh-CN": "理解内燃机如何重塑社会、城市与全球物流。",
    },
  },
  {
    number: 10,
    xpReward: 1700000,
    quoteAuthor: "Orville Wright",
    subtitle: {
      en: "The Triple Convergence",
      "zh-HK": "三重融合",
      "zh-CN": "三重融合",
    },
    quote: {
      en: "The airplane stays up because it doesn't have the time to fall.",
      "zh-HK": "飛機之所以停在天上，是因為它沒有時間墜落。",
      "zh-CN": "飞机之所以停在天上，是因为它没有时间坠落。",
    },
    narrative: {
      en: "Aviation, Automobile, and Airwaves converged to create the modern connected world. Flight conquered distance, broadcasting unified culture, and the automobile defined personal freedom — together they rewired civilisation.",
      "zh-HK": "航空、汽車與電波匯合，造就了現代互相連結的世界。飛行征服了距離，廣播統一了文化，汽車界定了個人自由——三者一同重新接上了文明的線路。",
      "zh-CN": "航空、汽车与电波汇合，造就了现代互相连接的世界。飞行征服了距离，广播统一了文化，汽车界定了个人自由——三者一同重新接上了文明的线路。",
    },
    missionObjective: {
      en: "Explore how the convergence of aviation, automotive, and broadcast technologies created the modern world.",
      "zh-HK": "探索航空、汽車與廣播技術的匯合如何造就現代世界。",
      "zh-CN": "探索航空、汽车与广播技术的汇合如何造就现代世界。",
    },
  },
  {
    number: 11,
    xpReward: 1900000,
    quoteAuthor: "Konstantin Tsiolkovsky",
    subtitle: {
      en: "The Programmable Frontier",
      "zh-HK": "可編程前沿",
      "zh-CN": "可编程前沿",
    },
    quote: {
      en: "The Earth is the cradle of humanity, but mankind cannot stay in the cradle forever.",
      "zh-HK": "地球是人類的搖籃，但人類不能永遠留在搖籃裏。",
      "zh-CN": "地球是人类的摇篮，但人类不能永远留在摇篮里。",
    },
    narrative: {
      en: "Satellites, the internet, and programmable systems extended infrastructure into orbit and cyberspace. The digital revolution made every human a potential node in a planetary network of information and commerce.",
      "zh-HK": "衛星、互聯網與可編程系統把基礎設施延伸到軌道與網絡空間。數碼革命使每一個人都可能成為行星級資訊與商業網絡中的一個節點。",
      "zh-CN": "卫星、互联网与可编程系统把基础设施延伸到轨道与网络空间。数字革命使每一个人都可能成为行星级信息与商业网络中的一个节点。",
    },
    missionObjective: {
      en: "Understand how orbital and digital infrastructure created the networked civilisation.",
      "zh-HK": "理解軌道與數碼基礎設施如何造就網絡化的文明。",
      "zh-CN": "理解轨道与数字基础设施如何造就网络化的文明。",
    },
  },
  {
    number: 12,
    xpReward: 2400000,
    quoteAuthor: "Nigel T. Dearden",
    subtitle: {
      en: "The Torus Metaphor",
      "zh-HK": "環面隱喻",
      "zh-CN": "环面隐喻",
    },
    quote: {
      en: "We are the infrastructure.",
      "zh-HK": "我們就是基礎設施。",
      "zh-CN": "我们就是基础设施。",
    },
    narrative: {
      en: "The final relay is humanity itself. As biological intelligence merges with artificial systems, each person becomes a node in a living infrastructure — the torus of consciousness where input, processing, and output flow in an infinite loop.",
      "zh-HK": "最後一程接力是人類自身。當生物智能與人工系統融合，每一個人都成為活基礎設施中的一個節點——意識的環面，輸入、處理與輸出在其中無限循環。",
      "zh-CN": "最后一程接力是人类自身。当生物智能与人工系统融合，每一个人都成为活基础设施中的一个节点——意识的环面，输入、处理与输出在其中无限循环。",
    },
    missionObjective: {
      en: "Contemplate the future where humans themselves become the infrastructure of civilisation.",
      "zh-HK": "思考人類自身成為文明基礎設施的未來。",
      "zh-CN": "思考人类自身成为文明基础设施的未来。",
    },
  },
];

export function getRelayStory(number: number): RelayStory | undefined {
  return RELAY_STORIES.find((story) => story.number === number);
}
