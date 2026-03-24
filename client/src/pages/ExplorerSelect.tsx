import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, Swords, Brain, Dices } from "lucide-react";

const EXPLORER_MODES = [
  {
    id: "classic",
    name: "Classic Explorer",
    ages: "Ages 8–14",
    tagline: "Tap-to-discover through 12 Civilisational Relays. The original journey.",
    icon: Flame,
    color: "#ef4444",
    gradient: "from-red-600/20 via-orange-600/10 to-transparent",
    border: "border-red-500/30 hover:border-red-400/60",
    glow: "hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]",
    cta: "QUICK PLAY",
    ctaColor: "bg-red-600 hover:bg-red-500 text-white",
    entry: "/explore/prologue",
    badge: null,
  },
  {
    id: "spinner",
    name: "Relay Spinner",
    ages: "Ages 8–10",
    tagline: "Pull the lever! Match relay symbols to unlock discoveries. Every spin wins something.",
    icon: Dices,
    color: "#3b82f6",
    gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
    border: "border-blue-500/30 hover:border-blue-400/60",
    glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    cta: "SPIN TO PLAY",
    ctaColor: "bg-blue-600 hover:bg-blue-500 text-white",
    entry: "/explore/spinner",
    badge: "NEW",
  },
  {
    id: "dungeon",
    name: "Dungeon Crawl",
    ages: "Ages 10–12",
    tagline: "Explore 12 relay-dungeons room by room. DAVID is your Dungeon Master.",
    icon: Swords,
    color: "#10b981",
    gradient: "from-emerald-600/20 via-green-600/10 to-transparent",
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    glow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    cta: "ENTER DUNGEON",
    ctaColor: "bg-emerald-600 hover:bg-emerald-500 text-white",
    entry: "/explore/dungeon",
    badge: "NEW",
  },
  {
    id: "greymatter",
    name: "Power of Grey Matter",
    ages: "Ages 12–14",
    tagline: "Earn 12 relay powers. Complete missions. Transform into iMan. Push the Clock back.",
    icon: Brain,
    color: "#d4a843",
    gradient: "from-amber-600/20 via-yellow-600/10 to-transparent",
    border: "border-amber-500/30 hover:border-amber-400/60",
    glow: "hover:shadow-[0_0_40px_rgba(212,168,67,0.15)]",
    cta: "BEGIN TRANSFORMATION",
    ctaColor: "bg-amber-600 hover:bg-amber-500 text-black",
    entry: "/explore/greymatter",
    badge: "NEW",
  },
] as const;

export default function ExplorerSelect() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield relative overflow-hidden mobile-content-pad">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-heading font-bold tracking-wider text-gold-gradient">EXPLORER MODE</h1>
            <p className="text-[10px] text-muted-foreground">Choose Your Pathway</p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-8 pb-4">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Ages 8–14 — Four Ways to Explore</p>
            <h2 className="font-heading text-2xl md:text-4xl font-bold tracking-wide text-gold-gradient mb-2">
              CHOOSE YOUR ADVENTURE
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Same 12 Relays. Same 91+ inventions. Same knowledge. Four different ways to discover it.
              Switch anytime without losing progress.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mode Cards */}
      <section className="relative z-10 pb-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {EXPLORER_MODES.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                >
                  <div
                    className={`
                      relative rounded-xl border p-5 transition-all duration-300
                      bg-gradient-to-b ${mode.gradient}
                      ${mode.border} ${mode.glow}
                      backdrop-blur-sm group h-full flex flex-col
                    `}
                  >
                    {mode.badge && (
                      <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-[9px] font-bold uppercase tracking-wider text-white">
                        {mode.badge}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${mode.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: mode.color }} />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold tracking-wide">{mode.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-mono">{mode.ages}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">{mode.tagline}</p>

                    <Link href={mode.entry}>
                      <Button className={`w-full font-heading tracking-wider text-xs ${mode.ctaColor}`} size="sm">
                        {mode.cta}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
