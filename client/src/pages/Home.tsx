import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { MODES, RELAYS, WEBS, XP_CAP } from "@shared/gameData";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Flame, Rocket, Brain, ChevronRight, Zap, Globe, BookOpen, Trophy, Library, Play, Volume2 } from "lucide-react";
import { useState } from "react";

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

const INTRO_VIDEOS = [
  {
    id: "v1",
    title: "V1 — Relay Spinner",
    subtitle: "Ages 8–10",
    tier: "Explorer",
    color: "#ef4444",
    borderColor: "border-red-500/30",
    bgColor: "from-red-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v1-relay-spinner_641673d9.mp4",
    music: "Upbeat Anime EDM",
    status: "APPROVED",
  },
  {
    id: "v2",
    title: "V2 — Dungeon Crawl",
    subtitle: "Ages 10–12",
    tier: "Explorer",
    color: "#ef4444",
    borderColor: "border-red-500/30",
    bgColor: "from-red-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v2-dungeon-crawl_3914ce50.mp4",
    music: "Upbeat Anime EDM",
    status: "APPROVED",
  },
  {
    id: "v3",
    title: "V3 — Grey Matter",
    subtitle: "Ages 12–14",
    tier: "Explorer",
    color: "#ef4444",
    borderColor: "border-red-500/30",
    bgColor: "from-red-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v3-grey-matter_5eaff673.mp4",
    music: "Heroic Brass",
    status: "APPROVED",
  },
  {
    id: "v4a",
    title: "V4-A — Flight Deck Spec",
    subtitle: "Ages 14–18",
    tier: "Flight Deck",
    color: "#06b6d4",
    borderColor: "border-cyan-500/30",
    bgColor: "from-cyan-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v4-flightdeck_a9ef7d84.mp4",
    music: "Dark Ambient",
    status: "APPROVED",
  },
  {
    id: "v4b-starborne",
    title: "V4-B — Starborne",
    subtitle: "Ages 14–18",
    tier: "Flight Deck",
    color: "#06b6d4",
    borderColor: "border-cyan-500/30",
    bgColor: "from-cyan-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/V4-B-CLEAN-starborne_989c0169.mp4",
    music: "Star Wars Brass 3%",
    status: "PENDING APPROVAL",
  },
  {
    id: "v4b-starwars",
    title: "V4-B — Star Wars Alt",
    subtitle: "Ages 14–18",
    tier: "Flight Deck",
    color: "#06b6d4",
    borderColor: "border-cyan-500/30",
    bgColor: "from-cyan-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/V4-B-CLEAN-starwars_48d22419.mp4",
    music: "Star Wars Style 1%",
    status: "PENDING APPROVAL",
  },
  {
    id: "v5a",
    title: "V5-A — Scholar's Secret",
    subtitle: "Ages 18+",
    tier: "Scholar",
    color: "#f59e0b",
    borderColor: "border-amber-500/30",
    bgColor: "from-amber-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/V5-A-CLEAN-scholars_acdeceb3.mp4",
    music: "Classical Piano 3%",
    status: "PENDING APPROVAL",
  },
  {
    id: "v5b",
    title: "V5-B — Middle-Earth",
    subtitle: "Ages 18+",
    tier: "Scholar",
    color: "#f59e0b",
    borderColor: "border-amber-500/30",
    bgColor: "from-amber-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/V5-B-CLEAN-earth_cb503219.mp4",
    music: "LOTR Orchestral 0.5%",
    status: "PENDING APPROVAL",
  },
];

function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {INTRO_VIDEOS.map((video, i) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className={`rounded-xl border ${video.borderColor} bg-gradient-to-b ${video.bgColor} to-transparent overflow-hidden backdrop-blur-sm`}
        >
          {/* Video Player */}
          <div className="relative aspect-video bg-black/50">
            <video
              src={video.url}
              controls
              preload="metadata"
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => setActiveVideo(video.id)}
              onPause={() => setActiveVideo(null)}
            />
            {activeVideo !== video.id && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white ml-0.5" />
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-heading font-bold tracking-wide" style={{ color: video.color }}>
                {video.title}
              </h4>
            </div>
            <p className="text-[10px] text-muted-foreground">{video.subtitle} • {video.tier}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <Volume2 className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground/60">{video.music}</span>
            </div>
            <span className={`inline-block mt-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wider ${
              video.status === "APPROVED"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}>
              {video.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield relative overflow-hidden mobile-content-pad">
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
            <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase bg-red-600 text-white animate-pulse">BETA</span>
            <Link href="/resources">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                <Library className="w-4 h-4" />
                <span className="hidden sm:inline">Resources</span>
              </Button>
            </Link>
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

      {/* Youth Intro Videos — All 8 */}
      <section className="relative z-10 pb-16">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Watch Before You Play</p>
            <h3 className="font-heading text-2xl md:text-3xl text-gold-gradient mb-2">Youth Intro Videos</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">8 narrated introductions across all age tiers — from Relay Spinner to Scholar mode</p>
          </motion.div>

          <VideoGallery />
        </div>
      </section>

      {/* Evidence iCards — Police Audit */}
      <section className="relative z-10 pb-16">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-6"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">PoC Beta — Evidence Records</p>
            <h3 className="font-heading text-xl md:text-2xl text-gold-gradient mb-2">Audio Verification &amp; Delivery Manifest</h3>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">Independent AI audio bot verification — all videos pass broadcast standard. 24 March 2026.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-xl border border-green-500/30 overflow-hidden bg-gradient-to-b from-green-600/5 to-transparent"
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iCard-V4B-V5-AudioVerification_24357084.png"
                alt="Audio Verification Record — All 4 Videos PASS"
                className="w-full h-auto object-contain"
              />
              <div className="p-3">
                <h4 className="text-xs font-heading font-bold text-green-400 tracking-wide">AUDIO VERIFICATION RECORD</h4>
                <p className="text-[10px] text-muted-foreground mt-1">STT Transcription + FFmpeg volumedetect • Zero contamination • Broadcast standard</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-xl border border-amber-500/30 overflow-hidden bg-gradient-to-b from-amber-600/5 to-transparent"
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iCard-Complete-8Video-Manifest_5809feb1.png"
                alt="Complete 8-Video Delivery Manifest"
                className="w-full h-auto object-contain"
              />
              <div className="p-3">
                <h4 className="text-xs font-heading font-bold text-amber-400 tracking-wide">COMPLETE DELIVERY MANIFEST</h4>
                <p className="text-[10px] text-muted-foreground mt-1">8 youth intro videos • All age tiers • V1–V4A approved • V4B–V5 verified</p>
              </div>
            </motion.div>
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
