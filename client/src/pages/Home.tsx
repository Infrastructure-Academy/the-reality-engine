import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { MODES, RELAYS, WEBS, XP_CAP } from "@shared/gameData";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Flame, Rocket, Brain, ChevronRight, Zap, Globe, BookOpen, Trophy } from "lucide-react";

const modeIcons = {
  explorer: Flame,
  flight_deck: Rocket,
  scholar: Brain,
};

const modeGradients = {
  explorer: "from-red-600/20 via-orange-600/10 to-transparent",
  flight_deck: "from-cyan-600/20 via-blue-600/10 to-transparent",
  scholar: "from-amber-600/20 via-yellow-600/10 to-transparent",
};

const modeBorders = {
  explorer: "border-red-500/30 hover:border-red-400/60",
  flight_deck: "border-cyan-500/30 hover:border-cyan-400/60",
  scholar: "border-amber-500/30 hover:border-amber-400/60",
};

const modeGlows = {
  explorer: "hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]",
  flight_deck: "hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]",
  scholar: "hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
};

const modeCTAColors = {
  explorer: "bg-red-600 hover:bg-red-500 text-white",
  flight_deck: "bg-cyan-600 hover:bg-cyan-500 text-white",
  scholar: "bg-amber-600 hover:bg-amber-500 text-black",
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield relative overflow-hidden">
      {/* Ambient gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-sm font-heading font-bold tracking-wider text-gold-gradient">THE REALITY ENGINE</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Infrastructure Academy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </Button>
            </Link>
            {isAuthenticated ? (
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="text-gold-gradient font-medium">{user?.name || "Commander"}</span>
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Guided Learning Platform</p>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide text-gold-gradient mb-4">
              THE REALITY ENGINE
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Navigate 12,000 years of civilisational infrastructure through three distinct pathways.
              From fire to human nodes — your odyssey begins here.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8 mb-4"
          >
            {[
              { label: "Relays", value: "12", icon: Globe },
              { label: "Great Webs", value: "5", icon: Zap },
              { label: "Inventions", value: "91+", icon: BookOpen },
              { label: "XP Cap", value: "24M", icon: Trophy },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-muted-foreground">
                <stat.icon className="w-4 h-4 text-gold-dim" />
                <span className="text-lg font-bold text-foreground font-mono">{stat.value}</span>
                <span className="text-xs uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mode Selection Cards */}
      <section className="relative z-10 pb-16">
        <div className="container">
          <p className="text-center text-xs tracking-[0.25em] uppercase text-muted-foreground mb-8">Choose Your Path</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(Object.entries(MODES) as [keyof typeof MODES, (typeof MODES)[keyof typeof MODES]][]).map(([key, mode], i) => {
              const Icon = modeIcons[key];
              const isRecommended = "recommended" in mode && mode.recommended;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                >
                  <div
                    className={`
                      relative rounded-xl border p-6 transition-all duration-300
                      bg-gradient-to-b ${modeGradients[key]}
                      ${modeBorders[key]} ${modeGlows[key]}
                      backdrop-blur-sm group
                    `}
                  >
                    {isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-600 text-[10px] font-bold uppercase tracking-wider text-white">
                        Recommended
                      </div>
                    )}

                    {/* Mode Icon & Title */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${mode.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: mode.color }} />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold tracking-wide">{mode.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{mode.ageRange}</p>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{mode.tagline}</p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {mode.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: mode.color }} />
                          <span className="text-foreground/80">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link href={mode.entry}>
                      <Button
                        className={`w-full font-heading tracking-wider text-sm ${modeCTAColors[key]}`}
                        size="lg"
                      >
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

      {/* Relay Timeline Preview */}
      <section className="relative z-10 pb-16">
        <div className="container">
          <p className="text-center text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6">12 Civilisational Relays</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {RELAYS.map((relay) => (
              <Link key={relay.number} href={`/explore/${relay.number}`}>
                <div
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 hover:border-amber-500/40 transition-all cursor-pointer backdrop-blur-sm"
                  title={`${relay.name}: ${relay.subtitle}`}
                >
                  <span className="text-base">{relay.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {relay.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Great Webs */}
      <section className="relative z-10 pb-16">
        <div className="container">
          <p className="text-center text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6">5 Great Webs</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {WEBS.map((web) => (
              <div
                key={web.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 backdrop-blur-sm"
              >
                <span className="text-lg">{web.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: web.color }}>{web.name}</p>
                  <p className="text-[10px] text-muted-foreground">{web.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">
            The Reality Engine — A Guided Learning Platform by{" "}
            <a href="https://infra-acad-kuqzaex2.manus.space" className="text-gold-dim hover:text-gold-bright transition-colors">
              Infrastructure Academy
            </a>
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">play.iaai.world</p>
        </div>
      </footer>
    </div>
  );
}
