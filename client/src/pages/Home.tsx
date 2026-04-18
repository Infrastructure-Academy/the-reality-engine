import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { RELAYS, WEBS } from "@shared/gameData";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Zap, Globe, BookOpen, Trophy, Library, Play, Volume2, Shield, ArrowDown, Gamepad2 } from "lucide-react";
import { SocialFollowButtons } from "@/components/SocialFollowButtons";
import { ImageLightbox } from "@/components/ImageLightbox";
import { ContinueBanner } from "@/components/ContinueBanner";
import { InteractivePipeline } from "@/components/InteractivePipeline";
import { useState, useEffect } from "react";



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
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/poster-v1-spinner_9f5e1782.jpg",
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
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/poster-v2-dungeon_bd3d6e87.jpg",
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
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/poster-v3-greymatter_7f73cf17.jpg",
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
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v4a-v2_4d1e0f2d.mp4",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/verify-FINAL-v4a-v2_4a74a196.png",
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
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v4b-starborne-v2_3da00f9a.mp4",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/verify-FINAL-v4b-starborne-v2_77747490.png",
    music: "Star Wars Brass 3%",
    status: "APPROVED",
  },
  {
    id: "v4b-starwars",
    title: "V4-B — Star Wars Alt",
    subtitle: "Ages 14–18",
    tier: "Flight Deck",
    color: "#06b6d4",
    borderColor: "border-cyan-500/30",
    bgColor: "from-cyan-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v4b-starwars-v2_4c907eed.mp4",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/verify-FINAL-v4b-starwars-v2_76a723ca.png",
    music: "Star Wars Style 1%",
    status: "APPROVED",
  },
  {
    id: "v5a",
    title: "V5-A — Scholar's Secret",
    subtitle: "Ages 18+",
    tier: "Scholar",
    color: "#f59e0b",
    borderColor: "border-amber-500/30",
    bgColor: "from-amber-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v5a-v2_a35db770.mp4",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/verify-FINAL-v5a-v2_f6917b44.png",
    music: "Classical Piano 3%",
    status: "APPROVED",
  },
  {
    id: "v5b",
    title: "V5-B — Middle-Earth",
    subtitle: "Ages 18+",
    tier: "Scholar",
    color: "#f59e0b",
    borderColor: "border-amber-500/30",
    bgColor: "from-amber-600/10",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v5b-v2_7d94978c.mp4",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/verify-FINAL-v5b-v2_192a8f1c.png",
    music: "LOTR Orchestral 0.5%",
    status: "APPROVED",
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
              preload="none"
              playsInline
              crossOrigin="anonymous"
              poster={video.thumbnail}
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
                : video.status === "REPLACED"
                ? "bg-slate-500/20 text-slate-400 border border-slate-500/30 line-through"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}>
              {video.status === "REPLACED" ? "REPLACED BY V4-B" : video.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Relay Collection Tracker — shows personal relay progress from localStorage ── */
function RelayCollectionTracker() {
  const [collection, setCollection] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tre_spinner_collection");
      if (saved) setCollection(new Set(JSON.parse(saved)));
    } catch { /* ignore corrupt data */ }
    setLoaded(true);
  }, []);

  // Listen for storage changes (e.g. if player collects a relay in another tab)
  useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem("tre_spinner_collection");
        if (saved) setCollection(new Set(JSON.parse(saved)));
      } catch { /* ignore */ }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!loaded) return null;

  const count = collection.size;
  const hasAny = count > 0;

  return (
    <div className="container max-w-4xl pb-6 pt-2">
      <div
        className="relative border rounded-lg overflow-hidden p-5 md:p-6"
        style={{
          borderColor: hasAny ? "rgba(234,179,8,0.3)" : "rgba(148,163,184,0.2)",
          background: hasAny
            ? "linear-gradient(135deg, rgba(234,179,8,0.06), rgba(168,85,247,0.04), transparent)"
            : "linear-gradient(135deg, rgba(100,116,139,0.06), transparent)",
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="font-heading text-sm md:text-base tracking-wider text-foreground">
              Your Relay Collection
            </span>
          </div>
          <span
            className={`font-mono text-sm font-bold tracking-wider ${
              count === 12
                ? "text-amber-400"
                : hasAny
                  ? "text-amber-400/80"
                  : "text-muted-foreground"
            }`}
          >
            {count}/12
          </span>
        </div>

        {/* 6x2 Relay Grid */}
        <div className="grid grid-cols-6 gap-2">
          {RELAYS.map((relay, idx) => {
            const collected = collection.has(idx);
            return (
              <div
                key={idx}
                className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all ${
                  collected
                    ? "border-amber-500/40 bg-amber-500/10"
                    : "border-border/20 bg-card/10 opacity-35"
                }`}
                title={
                  collected
                    ? `${relay.emoji} ${relay.name} — Collected!`
                    : `${relay.emoji} ${relay.name} — Not yet collected`
                }
              >
                <span className={`text-base md:text-lg ${collected ? "" : "grayscale"}`}>
                  {relay.emoji}
                </span>
                <span
                  className={`text-[7px] md:text-[8px] font-mono leading-none mt-0.5 ${
                    collected ? "text-amber-300/90" : "text-muted-foreground/60"
                  }`}
                >
                  {relay.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA row */}
        <div className="mt-4 text-center">
          {hasAny ? (
            count === 12 ? (
              <p className="text-xs text-amber-400 font-heading tracking-wider">
                ✨ ALL 12 RELAYS COLLECTED — FULL SET ACHIEVED ✨
              </p>
            ) : (
              <Link href="/explore/spinner">
                <span className="text-xs text-amber-400/80 hover:text-amber-300 cursor-pointer font-heading tracking-wider transition-colors">
                  Spin for more → {12 - count} remaining
                </span>
              </Link>
            )
          ) : (
            <Link href="/explore/spinner">
              <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                Play Relay Spinner to start collecting →
              </span>
            </Link>
          )}
        </div>
      </div>
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
          <div className="flex items-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iaai-logo_4636799f.jpeg"
              alt="iAAi — Infrastructure Academy"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Social Follow Buttons — matching Chart Room style */}
            <div className="hidden sm:block">
              <SocialFollowButtons />
            </div>
            <div className="block sm:hidden">
              <SocialFollowButtons compact />
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase bg-red-600 text-white animate-pulse">BETA</span>
            <Link href="/play/igo">
              <Button variant="ghost" size="sm" className="text-gold-dim hover:text-gold-bright gap-1.5 font-heading tracking-wider">
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden sm:inline">iGO</span>
              </Button>
            </Link>
            <a href="#governance">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Governance</span>
              </Button>
            </a>
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
      <section className="relative z-10 pt-6 pb-4 md:pt-10 md:pb-6">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Guided Learning Platform</p>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide text-gold-gradient mb-2">
              THE REALITY ENGINE
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Navigate 12,000 years of civilisational infrastructure.
              One game, all ages, 8–65+. From fire to human nodes — your odyssey begins here.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mt-4 mb-2"
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

          {/* Returning player banner */}
          <div className="max-w-lg mx-auto mt-3">
            <ContinueBanner />
          </div>

          {/* Pulsing PLAY NOW arrow — visible on mobile */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={() => document.getElementById('explorer-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="mt-3 mx-auto flex flex-col items-center gap-1 text-red-400 hover:text-red-300 transition-colors md:hidden"
          >
            <span className="text-xs font-heading tracking-[0.2em] uppercase">Play Now</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* ── iGO INTERACTIVE PIPELINE DASHBOARD ── */}
      <section className="relative z-10">
        {/* AIM tagline */}
        <div className="container max-w-4xl text-center pt-4 pb-2">
          <p className="text-sm md:text-base text-amber-300/80 font-heading tracking-wider mb-1">
            Where you go, iGO follows — and sharpens your <span className="text-amber-400 font-bold">AIM</span>.
          </p>
          <p className="text-[10px] md:text-xs text-muted-foreground tracking-widest uppercase mb-1">
            AIM = Avatar Integration Module
          </p>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-2">
            12 game formats across 3 episodes — from age 8 to 65+. One lifelong infrastructure learning system.
            Built by <a href="https://www.infrastructure-academy.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">iAAi — Infrastructure Academy</a>.
          </p>
        </div>

        {/* Interactive Pipeline — replaces static image + 12 mode cards */}
        <InteractivePipeline />

        {/* ── YOUR RELAY COLLECTION ── */}
        <RelayCollectionTracker />

        {/* Support / Back iGO CTA */}
        <div className="container max-w-4xl pb-8 pt-2">
          <div className="relative border border-amber-500/30 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.08), rgba(168,85,247,0.06), transparent)' }}>
            <div className="p-6 md:p-8 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/60 mb-2">Be Part of the Mission</p>
              <h3 className="font-heading text-xl md:text-2xl text-foreground mb-3">Support <span className="text-amber-400">iGO</span></h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-5 leading-relaxed">
                Whether you're an educator, institution, sponsor, or financial backer — help scale a lifelong infrastructure learning system from age 8 to 65+.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/play/igo#register">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black font-heading tracking-wider text-xs px-6 gap-1.5">
                    REGISTER YOUR INTEREST <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link href="/play/igo#back-igo">
                  <Button variant="outline" size="sm" className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-heading tracking-wider text-xs gap-1.5">
                    WHY BACK iGO? <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
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
              <ImageLightbox
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iCard-AudioVerification-compressed_b40c5c74.png"
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
              <ImageLightbox
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iCard-Complete-8Video-Manifest-compressed_d4f5f271.png"
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

      {/* Governance & Architecture iCards */}
      <section id="governance" className="relative z-10 pb-16 scroll-mt-20">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">iAAi Governance Framework</p>
            <h3 className="font-heading text-xl md:text-2xl text-gold-gradient mb-2">System Architecture &amp; Compliance</h3>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">SAP-001 compliant construction governance — 3+1 model, no false completion</p>
          </motion.div>

          {/* Row 1: Four Sites Architecture — full width landscape */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl border border-gold-dim/30 overflow-hidden bg-gradient-to-b from-amber-600/5 to-transparent mb-4"
          >
            <ImageLightbox
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/four-sites-v2-block443_eff0a556.png"
              alt="The Four Sites — System Architecture V2. iAAi 3+1 Construction Governance Model. Memorial (Lead Agent, DAVID — Isaac), ACAD (Contractor, MAX), Chart Room (Observer +1, KANTEI — Jenny), TRE Game (Government Inspector, CHECKER). Block 443, 5 April 2026."
              className="w-full h-auto object-contain"
              loading="lazy"
            />
            <div className="p-3">
              <h4 className="text-xs font-heading font-bold text-gold-dim tracking-wide">THE FOUR SITES — SYSTEM ARCHITECTURE V2</h4>
              <p className="text-[10px] text-muted-foreground mt-1">3+1 Construction Governance Model • Block 443 • Memorial Leads • SAP-001 Compliant • Wynn Palace Standard</p>
            </div>
          </motion.div>

          {/* Row 2: Three portrait iCards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-xl border border-green-500/30 overflow-hidden bg-gradient-to-b from-green-600/5 to-transparent"
            >
              <ImageLightbox
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-gov-010-v2(4)_46056c50.png"
                alt="iAAi GOV-010 — Beta PoC Disclaimer Pattern. Chart Room (KANTEI), ACAD (MAX), Memorial (DAVID), TRE Game (CHECKER). Block 410, 26 March 2026."
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <div className="p-3">
                <h4 className="text-xs font-heading font-bold text-green-400 tracking-wide">GOV-010 — BETA PoC DISCLAIMER</h4>
                <p className="text-[10px] text-muted-foreground mt-1">Agentic Handoff Document • Block 410 • 26 Mar 2026</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="rounded-xl border border-amber-500/30 overflow-hidden bg-gradient-to-b from-amber-600/5 to-transparent"
            >
              <ImageLightbox
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-ia4i-powers(1)_20c32329.png"
                alt="iA4i — The Evolution. Stage 0: 4ECL (Four Elements Consulting). Stage 1: iA2i. Stage 2: iA3i. Stage 3: iA4i. Stage 4: Compressed Symbol. The Four A's: Assess, Apply, Answers, Awareness. SYM-001."
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <div className="p-3">
                <h4 className="text-xs font-heading font-bold text-amber-400 tracking-wide">iA⁴i — THE EVOLUTION</h4>
                <p className="text-[10px] text-muted-foreground mt-1">From 4ECL to iA⁴i • The Four A's • Biological ↔ Digital • SYM-001</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="rounded-xl border border-cyan-500/30 overflow-hidden bg-gradient-to-b from-cyan-600/5 to-transparent"
            >
              <ImageLightbox
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/IMG_3385_19053da2.png"
                alt="Infrastructure Academy — An Infrastructure Odyssey. Three modes: Explorer (Ages 8-14), Flight Deck (Ages 14-18), Scholar (Ages 18+). B393K-MODES-001, SAP Verified, 19 Mar 2026."
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <div className="p-3">
                <h4 className="text-xs font-heading font-bold text-cyan-400 tracking-wide">ACAD — THREE MODES iCARD</h4>
                <p className="text-[10px] text-muted-foreground mt-1">B393K-MODES-001 • SAP Verified • Explorer / Flight Deck / Scholar</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5 Great Webs — compact inline */}
      <section className="relative z-10 pb-8">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {WEBS.map((web) => (
              <div
                key={web.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/40 backdrop-blur-sm"
              >
                <span className="text-sm">{web.icon}</span>
                <span className="text-xs font-medium" style={{ color: web.color }}>{web.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Living Experiment — Infographic */}
      <section className="relative z-10 py-12 border-t border-gold-dim/20">
        <div className="container max-w-4xl mx-auto">
          <p className="text-center text-xs tracking-[0.3em] uppercase text-gold-dim/80 mb-6">The Method Behind The Engine</p>
          <div className="rounded-lg overflow-hidden border border-gold-dim/30 shadow-lg shadow-gold-dim/5">
            <ImageLightbox
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/living-experiment-infographic_05a0824a.jpeg"
              alt="The Living Experiment — Biological Intelligence Directing Digital Intelligence — The Same Model for Millennia. Tetra Handshake connecting Observer Player (Ir. Nigel T. Dearden, CEng) with ACAD (Contractor), MEMORIAL (Design Team), and CHECKER (Government Inspector)."
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
          <p className="text-center text-[10px] text-muted-foreground/60 mt-4 font-mono">
            MORALLY NEUTRAL &nbsp;|&nbsp; CIVIL ENGINEER LENS &nbsp;|&nbsp; SKILL NOW LOST — iAAi RECOVERS IT DIGITALLY
          </p>
        </div>
      </section>

      {/* The Tetrahedral Observer — Bridge Architecture iCard */}
      <section className="relative z-10 py-12">
        <div className="container max-w-4xl mx-auto">
          <p className="text-center text-xs tracking-[0.3em] uppercase text-gold-dim/80 mb-6">Five Operational Bridges</p>
          <div className="rounded-lg overflow-hidden border border-gold-dim/30 shadow-lg shadow-gold-dim/5">
            <ImageLightbox
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/tetrahedral-observer-icard_08b0a0f4.png"
              alt="The Tetrahedral Observer — Five Operational Bridges. ACAD SITE (Infrastructure Academy, MASTER, Direct DB Access), MEMORIAL SITE (Principia Tectonica, CONNECTED, API Bridge), TRE GAME (The Reality Engine, SHARED DB, Direct DB Access), CHART ROOM (The Chartered Chart, API BRIDGE, Multi-Platform Tracker). Social Profiles: X @dearden_ni37258, Facebook, LinkedIn. Block 757, 24 March 2026, Tetrahedral Observer v2, B757-BRIDGES-002."
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
          <p className="text-center text-[10px] text-muted-foreground/60 mt-4 font-mono">
            B757-BRIDGES-002 &nbsp;|&nbsp; TETRAHEDRAL OBSERVER v2 &nbsp;|&nbsp; 24 MARCH 2026
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-muted-foreground">
                The Reality Engine — A Guided Learning Platform by{" "}
                <a href="https://www.infrastructure-academy.com" className="text-gold-dim hover:text-gold-bright transition-colors">
                  Infrastructure Academy
                </a>
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">www.infrastructure-academy.com</p>
              <p className="text-[10px] text-muted-foreground/40 mt-1">Agents: ACAD (Max) • TRE-GLP (David) • Memorial (Isaac) • Chart Room (Jenny)</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/qr-infrastructure-academy_d5d9f029.png"
                alt="QR Code — www.infrastructure-academy.com"
                className="w-20 h-20 object-contain rounded"
              />
              <span className="text-[9px] text-muted-foreground/50">Scan to explore</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
