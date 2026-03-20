import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, Star, Lock, Sparkles, Trophy, Zap } from "lucide-react";
import { RELAYS } from "@shared/gameData";

type CardRarity = "common" | "uncommon" | "rare" | "legendary" | "mythic";

interface GameCard {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  rarity: CardRarity;
  series: string;
  blockRef: string;
  description: string;
  unlockCondition: string;
  bitPointCost: number;
}

const RARITY_COLORS: Record<CardRarity, string> = {
  common: "#94a3b8",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  legendary: "#d4af37",
  mythic: "#a855f7",
};

const RARITY_LABELS: Record<CardRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  legendary: "Legendary",
  mythic: "Mythic",
};

// BitPoint Series 1 — 17 cards (13 Relays + 4 Jokers)
const BITPOINT_DECK: GameCard[] = [
  ...RELAYS.map((relay, i) => ({
    id: `bp-relay-${i + 1}`,
    title: relay.name,
    subtitle: `Relay ${i + 1} — ${relay.subtitle}`,
    category: "Relay Card",
    rarity: (i < 3 ? "common" : i < 7 ? "uncommon" : i < 10 ? "rare" : "legendary") as CardRarity,
    series: "BitPoint Series 1",
    blockRef: `B398-BP-${String(i + 1).padStart(3, "0")}`,
    description: `Complete Relay ${i + 1} to unlock this card. ${relay.subtitle} — a milestone in civilisational infrastructure.`,
    unlockCondition: `Complete Relay ${i + 1} at 100%`,
    bitPointCost: (i + 1) * 50,
  })),
  { id: "bp-joker-1", title: "The Fractal Connector", subtitle: "Relay 13 — Omega Point", category: "Joker", rarity: "mythic", series: "BitPoint Series 1", blockRef: "B398-BP-J01", description: "The hidden 13th relay. Where all patterns converge. The fractal that contains the whole.", unlockCondition: "Complete all 12 relays", bitPointCost: 1000 },
  { id: "bp-joker-2", title: "DAVID Awakened", subtitle: "AI Co-Pilot Fully Online", category: "Joker", rarity: "mythic", series: "BitPoint Series 1", blockRef: "B398-BP-J02", description: "DAVID reaches full consciousness integration. The co-pilot becomes the navigator.", unlockCondition: "100 DAVID conversations", bitPointCost: 800 },
  { id: "bp-joker-3", title: "The Consciousness Compass", subtitle: "C·W·E·S — The New North", category: "Joker", rarity: "legendary", series: "BitPoint Series 1", blockRef: "B398-BP-J03", description: "Unlock the compass that points to consciousness, not magnetic north. Gyroscopic. Self-correcting.", unlockCondition: "Visit all 5 Great Webs", bitPointCost: 600 },
  { id: "bp-joker-4", title: "YODA Master", subtitle: "The Control Lever", category: "Joker", rarity: "legendary", series: "BitPoint Series 1", blockRef: "B398-BP-J04", description: "Master all four steps: Yoke, Orient, Decisive, Action. The SCADA of consciousness is yours.", unlockCondition: "Complete YODA tutorial", bitPointCost: 500 },
];

// Equipment Cards
const EQUIPMENT_CARDS: GameCard[] = [
  { id: "eq-yoda", title: "YODA Control Lever", subtitle: "The SCADA of Consciousness", category: "Equipment", rarity: "legendary", series: "Equipment Suite", blockRef: "B398-EQ-001", description: "Yoke → Orient → Decisive → Action. Three embodiments. One control system.", unlockCondition: "Complete YODA tutorial", bitPointCost: 300 },
  { id: "eq-compass", title: "Consciousness Compass", subtitle: "C·W·E·S Navigation", category: "Equipment", rarity: "legendary", series: "Equipment Suite", blockRef: "B398-EQ-002", description: "The new north. Gyroscopic. Self-correcting. Nuclear powered. The quantum clock.", unlockCondition: "Activate all compass points", bitPointCost: 300 },
  { id: "eq-quill", title: "Quill Mask Visor", subtitle: "Remember Mode Overlay", category: "Equipment", rarity: "rare", series: "Equipment Suite", blockRef: "B398-EQ-003", description: "Overlays learned patterns onto reality. The visor that reveals hidden structures.", unlockCondition: "Discover 50 inventions", bitPointCost: 200 },
  { id: "eq-yaka", title: "Yaka Arrow", subtitle: "Search Mode Pointer", category: "Equipment", rarity: "rare", series: "Equipment Suite", blockRef: "B398-EQ-004", description: "Follows your intent through the Dearden Field. Finds what you need before you know you need it.", unlockCondition: "Activate 30 Dearden nodes", bitPointCost: 200 },
  { id: "eq-biaura", title: "BiAura Suit", subtitle: "Full Immersion Interface", category: "Equipment", rarity: "mythic", series: "Equipment Suite", blockRef: "B398-EQ-005", description: "The complete embodiment suit. Sensors, haptics, neural interface. Man inside machine.", unlockCondition: "Reach GURU status", bitPointCost: 1000 },
  { id: "eq-walkby", title: "Walkby Badge", subtitle: "4-Level Control Authority", category: "Equipment", rarity: "uncommon", series: "Equipment Suite", blockRef: "B398-EQ-006", description: "Bridge → Chart Room → Engine Room → Bilge. The physical walkby authority badge.", unlockCondition: "Complete Walkby tutorial", bitPointCost: 100 },
];

export default function CardCollection() {
  const [activeCategory, setActiveCategory] = useState<"all" | "relay" | "joker" | "equipment">("all");
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const allCards = useMemo(() => [...BITPOINT_DECK, ...EQUIPMENT_CARDS], []);

  const filteredCards = useMemo(() => {
    if (activeCategory === "all") return allCards;
    if (activeCategory === "relay") return allCards.filter(c => c.category === "Relay Card");
    if (activeCategory === "joker") return allCards.filter(c => c.category === "Joker");
    return allCards.filter(c => c.category === "Equipment");
  }, [activeCategory, allCards]);

  const toggleFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId); else next.add(cardId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground mobile-content-pad">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-gold">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-border/50" />
            <h1 className="font-heading text-gold text-sm md:text-base tracking-wider">iCARD COLLECTION</h1>
            <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">BETA</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold font-mono">{allCards.length}</span>
            <span className="text-muted-foreground">cards</span>
          </div>
        </div>
      </header>

      <main className="container py-6 max-w-6xl mx-auto space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {([
            { id: "all" as const, label: "All Cards", count: allCards.length },
            { id: "relay" as const, label: "Relay Cards", count: BITPOINT_DECK.filter(c => c.category === "Relay Card").length },
            { id: "joker" as const, label: "Jokers", count: BITPOINT_DECK.filter(c => c.category === "Joker").length },
            { id: "equipment" as const, label: "Equipment", count: EQUIPMENT_CARDS.length },
          ]).map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeCategory === cat.id
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label} <span className="text-xs opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredCards.map((card) => {
            const isFlipped = flippedCards.has(card.id);
            const rarityColor = RARITY_COLORS[card.rarity];
            return (
              <motion.div
                key={card.id}
                className="aspect-[2.5/3.5] cursor-pointer perspective-1000"
                onClick={() => toggleFlip(card.id)}
                onDoubleClick={() => setSelectedCard(card)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  className="w-full h-full relative"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-xl border-2 p-3 flex flex-col justify-between"
                    style={{
                      borderColor: rarityColor,
                      background: `linear-gradient(135deg, oklch(0.14 0.01 260), oklch(0.18 0.015 260))`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] tracking-wider uppercase" style={{ color: rarityColor }}>{card.category}</span>
                        <CreditCard className="w-3 h-3" style={{ color: rarityColor }} />
                      </div>
                      <h4 className="font-heading text-xs md:text-sm text-foreground leading-tight">{card.title}</h4>
                      <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-2">{card.subtitle}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" style={{ color: rarityColor }} />
                        <span className="text-[9px]" style={{ color: rarityColor }}>{RARITY_LABELS[card.rarity]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-gold" />
                        <span className="text-[9px] text-gold">{card.bitPointCost} BP</span>
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-xl border-2 p-3 flex flex-col justify-between"
                    style={{
                      borderColor: rarityColor,
                      background: `linear-gradient(135deg, oklch(0.16 0.015 260), oklch(0.12 0.01 260))`,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div>
                      <p className="text-[8px] tracking-wider uppercase text-muted-foreground">{card.series}</p>
                      <p className="text-[9px] text-foreground/80 mt-2 leading-relaxed">{card.description}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[8px] text-muted-foreground">{card.unlockCondition}</span>
                      </div>
                      <p className="text-[8px] font-mono text-muted-foreground/60">{card.blockRef}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Deck Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { label: "BitPoint Series 1", value: `${BITPOINT_DECK.length} cards`, icon: CreditCard, color: "#d4af37" },
            { label: "Equipment Suite", value: `${EQUIPMENT_CARDS.length} cards`, icon: Zap, color: "#3b82f6" },
            { label: "Total Collection", value: `${allCards.length} cards`, icon: Sparkles, color: "#a855f7" },
            { label: "GURU Exclusive", value: "1 card", icon: Trophy, color: "#ef4444" },
          ]).map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border/50 rounded-xl p-4 text-center">
                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                <p className="font-heading text-lg text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Formula */}
        <div className="bg-card border border-gold/30 rounded-xl p-6 text-center">
          <p className="font-heading text-gold text-lg">IQ ⊗ EQ ⊗ CQ = HQ</p>
          <p className="text-muted-foreground text-xs mt-2">
            Intelligence Quotient × Emotional Quotient × Consciousness Quotient = Holistic Quotient
          </p>
          <p className="text-muted-foreground text-[10px] mt-1 italic">
            The BitPoint deck measures all three. Your cards tell your story.
          </p>
        </div>
      </main>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border-2 rounded-2xl p-6 max-w-md w-full space-y-4"
              style={{ borderColor: RARITY_COLORS[selectedCard.rarity] }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-wider uppercase" style={{ color: RARITY_COLORS[selectedCard.rarity] }}>{selectedCard.category}</span>
                <span className="text-xs font-mono text-muted-foreground">{selectedCard.blockRef}</span>
              </div>
              <h3 className="font-heading text-2xl text-foreground">{selectedCard.title}</h3>
              <p className="text-sm text-gold">{selectedCard.subtitle}</p>
              <p className="text-sm text-foreground/80">{selectedCard.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" style={{ color: RARITY_COLORS[selectedCard.rarity] }} />
                  <span className="text-sm" style={{ color: RARITY_COLORS[selectedCard.rarity] }}>{RARITY_LABELS[selectedCard.rarity]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{selectedCard.unlockCondition}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-gold" />
                <span className="text-sm text-gold">{selectedCard.bitPointCost} BitPoints</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic">{selectedCard.series}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
