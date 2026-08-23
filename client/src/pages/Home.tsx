import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { RELAYS, WEBS } from "@shared/gameData";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Zap, Globe, BookOpen, Trophy, Library, Play, Volume2, Shield, ArrowDown, Gamepad2, Compass, Share2 } from "lucide-react";
import { SocialFollowButtons } from "@/components/SocialFollowButtons";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { ImageLightbox } from "@/components/ImageLightbox";
import { ContinueBanner } from "@/components/ContinueBanner";
import { PipelineHotspots } from "@/components/PipelineHotspots";
import { ShareCardGallery } from "@/components/ShareCardGallery";
import { ShareCard } from "@/components/ShareCard";
import { BrandI } from "@/components/BrandI";
import { useState, useEffect, useMemo, useRef, useCallback, Fragment } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";



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
  const t = useT();
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
                {t(`video.${video.id}`) || video.title}
              </h4>
            </div>
            <p className="text-[10px] text-muted-foreground">{t(`age.${video.id}`) || video.subtitle} • {t(`tier.${video.tier.toLowerCase().replace(/ /g, '')}`) || video.tier}</p>
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
              {t(`video.${video.status.toLowerCase()}`) || video.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Relay Collection Tracker — shows personal relay progress from localStorage ── */
function RelayCollectionTracker() {
  const t = useT();
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
              {t("collection.title")}
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
                    ? `${relay.emoji} ${t(`relay.${relay.name.toLowerCase().replace(/ /g, '')}`) || relay.name} — ${t("collection.collected")}`
                    : `${relay.emoji} ${t(`relay.${relay.name.toLowerCase().replace(/ /g, '')}`) || relay.name} — ${t("collection.notYet")}`
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
                  {t(`relay.${relay.name.toLowerCase().replace(/ /g, '')}`) || relay.name}
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
                ✨ {t("collection.allCollected")} ✨
              </p>
            ) : (
              <Link href="/explore/spinner">
                <span className="text-xs text-amber-400/80 hover:text-amber-300 cursor-pointer font-heading tracking-wider transition-colors">
                  {t("collection.spinMore")} {12 - count} {t("collection.remaining")}
                </span>
              </Link>
            )
          ) : (
            <Link href="/explore/spinner">
              <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                {t("collection.playSpinner")}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Web Domains Tracker (dynamic: lights up per web domain) ───
function WebDomainsTracker() {
  const t = useT();
  const [profileId, setProfileId] = useState<number | null>(null);
  const profileMutation = trpc.profile.getOrCreate.useMutation();

  useEffect(() => {
    let id = localStorage.getItem("tre_guest_id");
    if (!id) {
      id = "g_" + Math.random().toString(36).slice(2, 12);
      localStorage.setItem("tre_guest_id", id);
    }
    profileMutation.mutate({ guestId: id, mode: "explorer" }, {
      onSuccess: (data) => { if (data) setProfileId(data.id); }
    });
  }, []);

  const { data: summary } = trpc.dearden.summary.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const activatedWebNames = useMemo(() => {
    if (!summary?.webDomains) return new Set<string>();
    return new Set(summary.webDomains.map(w => w.webName));
  }, [summary]);

  const webNodeCounts = useMemo(() => {
    if (!summary?.webDomains) return new Map<string, number>();
    return new Map(summary.webDomains.map(w => [w.webName, w.count]));
  }, [summary]);

  const webCount = activatedWebNames.size;
  const nodeCount = summary?.activatedNodes ?? 0;
  const hasAny = webCount > 0;

  return (
    <div className="container max-w-4xl pb-2 pt-2">
      <div
        className="border rounded-xl p-4 md:p-5 backdrop-blur-sm"
        style={{
          borderColor: hasAny ? "rgba(234,179,8,0.3)" : "rgba(148,163,184,0.2)",
          background: hasAny
            ? "linear-gradient(135deg, rgba(234,179,8,0.06), rgba(168,85,247,0.04), transparent)"
            : "linear-gradient(135deg, rgba(100,116,139,0.06), transparent)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌐</span>
            <span className="font-heading text-sm md:text-base tracking-wider text-foreground">
              {t("webDomains.title")}
            </span>
          </div>
          <span
            className={`font-mono text-sm font-bold tracking-wider ${
              webCount === 5 ? "text-amber-400" : hasAny ? "text-amber-400/80" : "text-muted-foreground"
            }`}
          >
            {webCount}/5
          </span>
        </div>

        {/* 5 web domain slots */}
        <div className="grid grid-cols-5 gap-2">
          {WEBS.map((web) => {
            const active = activatedWebNames.has(web.name);
            return (
              <div
                key={web.name}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${
                  active
                    ? "bg-amber-500/10 border border-amber-500/30"
                    : "bg-muted/20 opacity-40"
                }`}
              >
                <span className={`text-xl md:text-2xl ${active ? "" : "grayscale"}`}>{web.icon}</span>
                <span
                  className={`text-[9px] md:text-[10px] tracking-wide ${
                    active ? "font-medium" : "text-muted-foreground"
                  }`}
                  style={active ? { color: web.color } : undefined}
                >
                  {t(`web.${web.name.toLowerCase()}`) || web.name}
                </span>
                <span className={`text-[8px] font-mono ${
                  active ? "text-amber-400/70" : "text-muted-foreground/40"
                }`}>
                  {webNodeCounts.get(web.name) ?? 0}/12
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar: 0/60 nodes */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-muted-foreground/60 font-heading tracking-wider">
              {t("webDomains.progress")}
            </span>
            <span
              className={`text-[9px] font-mono tracking-wider ${
                nodeCount === 60 ? "text-amber-400" : nodeCount > 0 ? "text-amber-400/70" : "text-muted-foreground/60"
              }`}
            >
              {nodeCount}/60 {t("webDomains.nodes")}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(nodeCount / 60) * 100}%`,
                background: nodeCount > 0
                  ? "linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)"
                  : "transparent",
              }}
            />
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/60 mt-3 font-heading tracking-wider">
          {t("webDomains.fieldDesc")}
        </p>
      </div>
    </div>
  );
}

// ─── useCountUp hook (scroll-triggered counter animation) ───
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ─── Dearden Field Animated Section (links to Explore) ───
const WEB_ORDER = ["Natural", "Machine", "Digital", "Biological", "Consciousness"] as const;
const WEB_COLORS: Record<string, string> = {
  Natural: "#22c55e",
  Machine: "#f59e0b",
  Digital: "#3b82f6",
  Biological: "#ec4899",
  Consciousness: "#a855f7",
};

function DeardenFieldSection() {
  const t = useT();
  const [profileId, setProfileId] = useState<number | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSynthesisModal, setShowSynthesisModal] = useState(false);
  const [hasSeenSynthesis, setHasSeenSynthesis] = useState(() => localStorage.getItem("tre_synthesis_seen") === "1");
  const profileMutation = trpc.profile.getOrCreate.useMutation();

  useEffect(() => {
    let id = localStorage.getItem("tre_guest_id");
    if (!id) {
      id = "g_" + Math.random().toString(36).slice(2, 12);
      localStorage.setItem("tre_guest_id", id);
    }
    profileMutation.mutate({ guestId: id, mode: "explorer" }, {
      onSuccess: (data) => { if (data) setProfileId(data.id); }
    });
  }, []);

  const { data: summary } = trpc.dearden.summary.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const { data: heatmapData } = trpc.dearden.communityHeatmap.useQuery(
    undefined,
    { enabled: showHeatmap }
  );

  const activatedSet = useMemo(() => {
    if (!summary?.activatedGrid) return new Set<string>();
    return new Set(summary.activatedGrid.map(n => `${n.relayNumber}-${n.webName}`));
  }, [summary]);

  const heatmapMap = useMemo(() => {
    if (!heatmapData) return new Map<string, number>();
    const m = new Map<string, number>();
    let max = 1;
    for (const row of heatmapData) {
      m.set(`${row.relayNumber}-${row.webName}`, Number(row.playerCount));
      if (Number(row.playerCount) > max) max = Number(row.playerCount);
    }
    m.set("__max", max);
    return m;
  }, [heatmapData]);

  const nodeCount = summary?.activatedNodes ?? 0;
  const isComplete = nodeCount === 60;

  // Show celebration modal once when 60/60 is first reached
  useEffect(() => {
    if (isComplete && !hasSeenSynthesis) {
      setShowSynthesisModal(true);
      setHasSeenSynthesis(true);
      localStorage.setItem("tre_synthesis_seen", "1");
    }
  }, [isComplete, hasSeenSynthesis]);

  return (
    <div className="container max-w-4xl pb-6 pt-2">
      <div className="text-center mb-3">
        <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/60 mb-1">{t("home.permanentFoundation")}</p>
        <h3 className="font-heading text-lg md:text-xl text-foreground">{t("field.title")}</h3>
      </div>

      {/* Toggle: My Progress / Community Heatmap */}
      <div className="flex justify-center gap-2 mb-3">
        <button
          onClick={() => setShowHeatmap(false)}
          className={`text-[10px] font-heading tracking-wider px-3 py-1 rounded-full border transition-all ${
            !showHeatmap
              ? "border-amber-400/60 text-amber-400 bg-amber-400/10"
              : "border-border/30 text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("dearden.myProgress")}
        </button>
        <button
          onClick={() => setShowHeatmap(true)}
          className={`text-[10px] font-heading tracking-wider px-3 py-1 rounded-full border transition-all ${
            showHeatmap
              ? "border-purple-400/60 text-purple-400 bg-purple-400/10"
              : "border-border/30 text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("dearden.communityHeatmap")}
        </button>
      </div>

      {/* ── MOBILE: Image overlay grid ── */}
      <div className="md:hidden">
        <Link href="/explore">
          <div className="relative rounded-lg overflow-hidden border border-amber-400/20 glow-pulse cursor-pointer hover:border-amber-400/40 transition-colors">
            <img
              src="/manus-storage/dearden-field_c7b3cbc3.png"
              alt="The Dearden Field — 5 Great Webs × 12 Relays = 60 Nodes of Discovery"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
            {/* Grid overlay */}
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: "repeat(12, 1fr)", gridTemplateRows: "repeat(5, 1fr)", padding: "4%" }}>
              {WEB_ORDER.map((web, wi) =>
                Array.from({ length: 12 }, (_, ri) => {
                  const relay = ri + 1;
                  const key = `${relay}-${web}`;
                  const active = activatedSet.has(key);
                  const heatVal = heatmapMap.get(key) ?? 0;
                  const heatMax = heatmapMap.get("__max") ?? 1;
                  const heatIntensity = heatVal / heatMax;
                  const isHeat = showHeatmap && heatVal > 0;
                  const isPersonal = !showHeatmap && active;
                  return (
                    <div key={key} className="flex items-center justify-center" style={{ gridColumn: ri + 1, gridRow: wi + 1 }}>
                      <div
                        className={`rounded-full transition-all duration-700 ${isPersonal ? "animate-pulse" : ""} ${isHeat ? "heat-dot-breathe" : ""}`}
                        style={{
                          width: isHeat ? `clamp(6px, ${1.2 + heatIntensity * 1.2}vw, ${8 + heatIntensity * 10}px)` : "clamp(6px, 1.8vw, 14px)",
                          height: isHeat ? `clamp(6px, ${1.2 + heatIntensity * 1.2}vw, ${8 + heatIntensity * 10}px)` : "clamp(6px, 1.8vw, 14px)",
                          background: isHeat ? `rgba(168, 85, 247, ${0.3 + heatIntensity * 0.7})` : isPersonal ? WEB_COLORS[web] : "rgba(148,163,184,0.1)",
                          boxShadow: isHeat ? `0 0 ${6 + heatIntensity * 12}px rgba(168,85,247,${0.3 + heatIntensity * 0.5})` : isPersonal ? `0 0 8px ${WEB_COLORS[web]}80, 0 0 16px ${WEB_COLORS[web]}40` : "none",
                          border: (isPersonal || isHeat) ? "none" : "1px solid rgba(148,163,184,0.15)",
                          animationDelay: isHeat ? `${(wi * 12 + ri) * 0.05}s` : undefined,
                        }}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* ── DESKTOP: Full labelled figure with axes ── */}
      <div className="hidden md:block">
        <Link href="/explore">
          <div className="relative rounded-xl border border-white/10 bg-card/30 backdrop-blur-sm p-6 cursor-pointer hover:border-amber-400/30 transition-colors overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/3 via-transparent to-purple-500/3 pointer-events-none" />

            {/* Figure header */}
            <div className="relative flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/70 font-heading">{t("misc.figure2")}</p>
                <p className="text-sm font-heading tracking-wider text-foreground/90">{t("field.title")} — {t("field.subtitle")}</p>
              </div>
              <span className={`font-mono text-sm font-bold tracking-wider ${nodeCount === 60 ? "text-amber-400" : nodeCount > 0 ? "text-amber-400/80" : "text-muted-foreground/60"}`}>
                {nodeCount}/60
              </span>
            </div>

            {/* Matrix with axis labels */}
            <div className="relative grid" style={{ gridTemplateColumns: "80px repeat(12, 1fr)", gridTemplateRows: "auto repeat(5, 1fr)", gap: "2px" }}>
              {/* Column headers (relay names) */}
              <div /> {/* empty corner cell */}
              {RELAYS.map((relay) => (
                <div key={relay.number} className="flex flex-col items-center justify-end pb-2">
                  <span className="text-base">{relay.emoji}</span>
                  <span className="text-[8px] font-heading tracking-wider text-muted-foreground/70 text-center leading-tight">{t(`relay.${relay.name.toLowerCase().replace(/ /g, '')}`) || relay.name}</span>
                </div>
              ))}

              {/* Rows: each web domain */}
              {WEB_ORDER.map((web, wi) => (
                <Fragment key={web}>
                  {/* Row label */}
                  <div className="flex items-center gap-1.5 pr-2 justify-end">
                    <span className="text-sm">{WEBS[wi].icon}</span>
                    <span className="text-[9px] font-heading tracking-wider text-right" style={{ color: WEB_COLORS[web] }}>{t(`web.${web.toLowerCase()}`) || web}</span>
                  </div>
                  {/* 12 cells */}
                  {Array.from({ length: 12 }, (_, ri) => {
                    const relay = ri + 1;
                    const key = `${relay}-${web}`;
                    const active = activatedSet.has(key);
                    const heatVal = heatmapMap.get(key) ?? 0;
                    const heatMax = heatmapMap.get("__max") ?? 1;
                    const heatIntensity = heatVal / heatMax;
                    const isHeat = showHeatmap && heatVal > 0;
                    const isPersonal = !showHeatmap && active;
                    const relayMeta = RELAYS[ri];
                    const webMeta = WEBS[wi];
                    const relayName = t(`relay.${relayMeta?.name?.toLowerCase().replace(/ /g, '')}`) || relayMeta?.name || `Relay ${relay}`;
                    const webName = t(`web.${web.toLowerCase()}`) || web;
                    const tooltipText = `${relayMeta?.emoji || ""} ${relayName} × ${webMeta?.icon || ""} ${webName}\n${active ? `✓ ${t("field.activated")} — 50,000 XP` : `${t("field.locked")} — 50,000 XP`}`;
                    return (
                      <div key={key} className="flex items-center justify-center py-2 relative group/dot">
                        <div
                          className={`rounded-full transition-all duration-700 cursor-pointer ${isPersonal ? "animate-pulse" : ""} ${isHeat ? "heat-dot-breathe" : ""}`}
                          style={{
                            width: isHeat ? `${10 + heatIntensity * 10}px` : "14px",
                            height: isHeat ? `${10 + heatIntensity * 10}px` : "14px",
                            background: isHeat
                              ? `rgba(168, 85, 247, ${0.3 + heatIntensity * 0.7})`
                              : isPersonal ? WEB_COLORS[web] : "rgba(148,163,184,0.08)",
                            boxShadow: isHeat
                              ? `0 0 ${6 + heatIntensity * 12}px rgba(168,85,247,${0.3 + heatIntensity * 0.5})`
                              : isPersonal ? `0 0 10px ${WEB_COLORS[web]}60, 0 0 20px ${WEB_COLORS[web]}30` : "none",
                            border: (isPersonal || isHeat) ? "none" : "1px solid rgba(148,163,184,0.12)",
                            animationDelay: isHeat ? `${(wi * 12 + ri) * 0.05}s` : undefined,
                          }}
                        />
                        {/* Hover tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-black/90 border border-white/10 backdrop-blur-sm opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-pre text-center min-w-max">
                          <span className="text-[10px] text-white/90 leading-relaxed">{tooltipText}</span>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
                        </div>
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>

            {/* Source line */}
            <p className="relative text-[8px] text-muted-foreground/30 mt-4 text-right font-mono">
              {t("dearden.source") || "Source: An Infrastructure Odyssey — Episode 1: Calories to Consciousness"}
            </p>
          </div>
        </Link>
      </div>

      {/* Heatmap legend */}
      {showHeatmap && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-[9px] text-muted-foreground/60">{t("misc.fewPlayers")}</span>
          <div className="flex gap-0.5">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
              <div
                key={v}
                className="w-3 h-3 rounded-full"
                style={{ background: `rgba(168,85,247,${0.3 + v * 0.7})` }}
              />
            ))}
          </div>
          <span className="text-[9px] text-muted-foreground/60">{t("misc.manyPlayers")}</span>
        </div>
      )}

      {/* Synthesis Unlocked Badge */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 flex justify-center"
        >
          <Link href="/synthesis">
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-amber-400 bg-amber-400/10 backdrop-blur-sm cursor-pointer hover:bg-amber-400/20 transition-colors">
              <Trophy className="w-6 h-6 text-amber-400" />
              <div>
                <p className="font-heading text-sm tracking-wider text-amber-400">{t("home.synthesisUnlocked")}</p>
                <p className="text-[10px] text-amber-400/70">{t("dearden.fieldComplete")}</p>
              </div>
              <span className="text-2xl">🏆</span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Synthesis Celebration Modal with Confetti */}
      <Dialog open={showSynthesisModal} onOpenChange={setShowSynthesisModal}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-amber-400/40 max-w-md text-center overflow-hidden">
          <DialogTitle className="sr-only">Synthesis Unlocked</DialogTitle>
          {/* Confetti overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"][i % 6],
                  borderRadius: i % 3 === 0 ? "50%" : "2px",
                  width: `${6 + Math.random() * 6}px`,
                  height: `${6 + Math.random() * 6}px`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          <div className="relative z-10 py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="font-heading text-2xl text-amber-400 tracking-wider mb-2">SYNTHESIS UNLOCKED</h2>
            <p className="text-muted-foreground text-sm mb-1">You have activated all 60 nodes of The Dearden Field.</p>
            <p className="text-muted-foreground/70 text-xs mb-6">5 Great Webs × 12 Civilisational Relays — Complete.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/synthesis">
                <Button className="bg-amber-500 hover:bg-amber-600 text-black font-heading tracking-wider">
                  VIEW SYNTHESIS
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setShowSynthesisModal(false)} className="border-amber-400/40 text-amber-400 hover:bg-amber-400/10">
                CONTINUE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Your Archetype Preview Card (civilisational lean from relay collection) ───
const RELAY_PERSPECTIVES: Record<number, "west" | "east" | "outrider"> = {
  1: "outrider", 2: "east", 3: "east", 4: "outrider", 5: "west", 6: "outrider",
  7: "east", 8: "west", 9: "west", 10: "west", 11: "outrider", 12: "outrider",
};

const PERSPECTIVE_INFO: Record<string, { name: string; color: string; icon: string; title: string }> = {
  west: { name: "Western", color: "#3b82f6", icon: "🏛️", title: "The Systems Architect" },
  east: { name: "Eastern", color: "#ef4444", icon: "🏯", title: "The Harmony Weaver" },
  outrider: { name: "Outrider", color: "#f59e0b", icon: "🏕️", title: "The Universal Connector" },
};

function YourArchetypeCard() {
  const t = useT();
  const [collection, setCollection] = useState<Set<number>>(new Set());
  const [showCommunity, setShowCommunity] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  // Initial load + live storage listener for cross-tab updates
  const readCollection = useCallback(() => {
    try {
      const saved = localStorage.getItem("tre_spinner_collection");
      if (saved) setCollection(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { readCollection(); }, [readCollection]);

  useEffect(() => {
    const handler = () => readCollection();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [readCollection]);

  // Community archetype distribution
  const { data: communityData } = trpc.dearden.communityArchetype.useQuery(undefined, {
    staleTime: 60_000,
  });

  // Compute perspective distribution from collected relays
  const { perspectives, dominant, total, hasRelays, isBalanced, patternTitle } = useMemo(() => {
    const p = { west: 0, east: 0, outrider: 0 };
    collection.forEach((idx) => {
      const relayNum = idx + 1;
      const perspective = RELAY_PERSPECTIVES[relayNum];
      if (perspective) p[perspective]++;
    });
    const t = p.west + p.east + p.outrider;
    const sorted = Object.entries(p).sort((a, b) => b[1] - a[1]);
    const dom = sorted[0][0] as "west" | "east" | "outrider";
    // Balanced if top two are within 15% of each other
    const bal = t > 0 && sorted[0][1] > 0 && sorted[1][1] > 0 && (sorted[0][1] - sorted[1][1]) / sorted[0][1] < 0.15;
    const title = bal ? "The Balanced Navigator" : PERSPECTIVE_INFO[dom].title;
    return { perspectives: p, dominant: dom, total: t, hasRelays: t > 0, isBalanced: bal, patternTitle: title };
  }, [collection]);

  const meta = isBalanced
    ? { name: "Balanced", color: "#f59e0b", icon: "⚖️", title: "The Balanced Navigator" }
    : PERSPECTIVE_INFO[dominant];

  // ─── Sparkline history: record perspective snapshots over time ───
  const sparklineData = useMemo(() => {
    try {
      const raw = localStorage.getItem("tre_archetype_history");
      return raw ? JSON.parse(raw) as Array<{ t: number; w: number; e: number; n: number }> : [];
    } catch { return []; }
  }, [collection]);

  // Record a snapshot whenever collection changes (max 50 entries)
  useEffect(() => {
    if (!hasRelays) return;
    try {
      const history: Array<{ t: number; w: number; e: number; n: number }> = (() => {
        try {
          const raw = localStorage.getItem("tre_archetype_history");
          return raw ? JSON.parse(raw) : [];
        } catch { return []; }
      })();
      const last = history[history.length - 1];
      if (!last || last.w !== perspectives.west || last.e !== perspectives.east || last.n !== perspectives.outrider) {
        history.push({ t: Date.now(), w: perspectives.west, e: perspectives.east, n: perspectives.outrider });
        if (history.length > 50) history.splice(0, history.length - 50);
        localStorage.setItem("tre_archetype_history", JSON.stringify(history));
      }
    } catch { /* ignore */ }
  }, [perspectives, hasRelays]);

  // Community totals
  const communityTotal = communityData ? (communityData.west + communityData.east + communityData.outrider) : 0;

  return (
    <div className="container max-w-4xl pb-4 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm p-5">
          {/* Header */}
          <Link href="/synthesis">
            <div className="flex items-center gap-2 mb-3 cursor-pointer group">
              <Compass className="w-4 h-4 text-amber-400" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/70 font-heading">{t("home.civilisationalLean")}</p>
              <ChevronRight className="w-3 h-3 text-amber-400/40 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {hasRelays ? (
            <>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* Dominant archetype */}
                <Link href="/synthesis">
                  <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-3xl">{meta.icon}</span>
                    <div>
                      <p className="font-heading text-base tracking-wider" style={{ color: meta.color }}>{patternTitle}</p>
                      <p className="text-[10px] text-muted-foreground/70">
                        {isBalanced ? t("home.perspectivesHarmony") : `${t(`perspective.${dominant}`) || meta.name} ${t("home.perspectiveDominant")}`}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Perspective bars */}
                <div className="flex-1 w-full space-y-1.5">
                  {(["west", "east", "outrider"] as const).map((key) => {
                    const info = PERSPECTIVE_INFO[key];
                    const myCount = perspectives[key];
                    const myPct = total > 0 ? (myCount / total) * 100 : 0;
                    const comPct = showCommunity && communityData && communityTotal > 0
                      ? (communityData[key] / communityTotal) * 100
                      : 0;
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-xs w-14 text-right" style={{ color: info.color }}>
                          {info.icon} {info.name.slice(0, 1)}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden relative">
                          {/* Community bar (behind) */}
                          {showCommunity && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${comPct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="absolute inset-y-0 left-0 rounded-full opacity-25"
                              style={{ background: info.color }}
                            />
                          )}
                          {/* Player bar (front) */}
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${myPct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full relative z-10"
                            style={{ background: info.color }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 w-8 tabular-nums">{Math.round(myPct)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sparkline — evolution over time */}
              {sparklineData.length >= 2 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[9px] font-heading tracking-wider text-muted-foreground/50 mb-2">PERSPECTIVE EVOLUTION</p>
                  <svg viewBox="0 0 200 40" className="w-full h-8" preserveAspectRatio="none">
                    {(["w", "e", "n"] as const).map((key) => {
                      const color = key === "w" ? "#3b82f6" : key === "e" ? "#ef4444" : "#f59e0b";
                      const points = sparklineData.map((d, i) => {
                        const t = d.w + d.e + d.n || 1;
                        const val = d[key] / t;
                        const x = (i / (sparklineData.length - 1)) * 200;
                        const y = 38 - val * 36; // 0% at bottom, 100% at top
                        return `${x},${y}`;
                      }).join(" ");
                      return (
                        <polyline
                          key={key}
                          points={points}
                          fill="none"
                          stroke={color}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.7"
                        />
                      );
                    })}
                    {/* Baseline */}
                    <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="4,4" />
                  </svg>
                  <div className="flex justify-between text-[8px] text-muted-foreground/30 mt-0.5">
                    <span>{sparklineData.length} snapshots</span>
                    <div className="flex gap-3">
                      <span style={{ color: "#3b82f6" }}>● W</span>
                      <span style={{ color: "#ef4444" }}>● E</span>
                      <span style={{ color: "#f59e0b" }}>● N</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle row + Share */}
              <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.preventDefault(); setShowCommunity(!showCommunity); }}
                    className="text-[9px] font-heading tracking-wider px-2 py-1 rounded border transition-all"
                    style={{
                      borderColor: showCommunity ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.1)",
                      background: showCommunity ? "rgba(168,85,247,0.1)" : "transparent",
                      color: showCommunity ? "#a855f7" : "rgba(148,163,184,0.6)",
                    }}
                  >
                    {showCommunity ? "◉ COMMUNITY" : "○ COMMUNITY"}
                  </button>
                  {showCommunity && communityData && communityTotal > 0 && (
                    <span className="text-[9px] text-purple-400/60">
                      {communityTotal} player{communityTotal !== 1 ? "s" : ""} — global distribution
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.preventDefault(); setShowShareCard(!showShareCard); }}
                    className="text-[9px] font-heading tracking-wider px-2 py-1 rounded border transition-all flex items-center gap-1"
                    style={{
                      borderColor: showShareCard ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.1)",
                      background: showShareCard ? "rgba(245,158,11,0.1)" : "transparent",
                      color: showShareCard ? "#f59e0b" : "rgba(148,163,184,0.6)",
                    }}
                  >
                    <Share2 className="w-3 h-3" />
                    SHARE
                  </button>
                  <Link href="/synthesis">
                    <span className="text-[9px] text-muted-foreground/40 hover:text-amber-400/60 transition-colors cursor-pointer">Full synthesis →</span>
                  </Link>
                </div>
              </div>

              {/* Share card panel */}
              {showShareCard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-white/5"
                >
                  <ShareCard
                    patternTitle={patternTitle}
                    dominant={dominant}
                    isBalanced={isBalanced}
                    perspectives={perspectives}
                    totalXp={0}
                    discoveries={0}
                    completedRelays={collection.size}
                    isComplete={collection.size === 12}
                  />
                </motion.div>
              )}
            </>
          ) : (
            <Link href="/explore">
              <div className="text-center py-3 cursor-pointer hover:opacity-80 transition-opacity">
                <p className="text-sm text-muted-foreground/60">{t("home.exploreRelaysDiscover")}</p>
                <p className="text-[10px] text-muted-foreground/40 mt-1">{t("home.eachRelayReveals")}</p>
              </div>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── 500 Generations Timeline Strip (interactive with counter + relay glow) ───
function GenerationsTimelineStrip() {
  const t = useT();
  const { count: genCount, ref: counterRef } = useCountUp(500, 2500);

  // Read relay collection from localStorage for glow effect
  const [collection, setCollection] = useState<Set<number>>(new Set());
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tre_spinner_collection");
      if (saved) setCollection(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, []);

  // Perspective mapping for the desktop figure
  const perspectiveOf = (n: number) => RELAY_PERSPECTIVES[n] || "outrider";
  const perspectiveLabel: Record<string, string> = { west: t("perspective.west"), east: t("perspective.east"), outrider: t("perspective.outrider") };
  const perspectiveColor: Record<string, string> = { west: "#3b82f6", east: "#ef4444", outrider: "#f59e0b" };

  return (
    <div className="container max-w-5xl pb-6 pt-2" ref={counterRef}>
      <div className="text-center mb-4">
        <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/60 mb-1">{t("dearden.12000years")}</p>
        <h3 className="font-heading text-lg md:text-xl text-foreground">
          <span className="text-amber-400 tabular-nums font-bold text-2xl md:text-3xl">{genCount}</span>{" "}
          <span>{t("misc.generations")}</span>
        </h3>
        <p className="text-[10px] text-muted-foreground/60 mt-1">{t("dearden.fromFire")}</p>
      </div>

      {/* ── MOBILE: compact grid (unchanged) ── */}
      <div className="md:hidden">
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-amber-500 via-blue-500 to-purple-500 opacity-40" />
          <div className="grid grid-cols-6 gap-y-6 gap-x-1">
            {RELAYS.map((relay) => {
              const collected = collection.has(relay.number - 1);
              return (
                <Link key={relay.number} href={`/explore?relay=${relay.number}`}>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all group-hover:scale-110 ${
                        collected ? "ring-2 ring-offset-1 ring-offset-background" : ""
                      }`}
                      style={{
                        borderColor: collected ? relay.color : `${relay.color}60`,
                        background: collected ? `${relay.color}30` : `${relay.color}15`,
                        boxShadow: collected
                          ? `0 0 12px ${relay.color}60, 0 0 24px ${relay.color}30`
                          : `0 0 8px ${relay.color}20`,
                      }}
                    >
                      <span className={`text-sm ${collected ? "" : "grayscale opacity-60"}`}>{relay.emoji}</span>
                    </div>
                    <span className={`text-[8px] font-heading tracking-wider text-center leading-tight transition-colors ${
                      collected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}>
                      {t(`relay.${relay.name.toLowerCase().replace(/ /g, '')}`) || relay.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── DESKTOP: full figure with era bands, perspective tags, and timeline ── */}
      <div className="hidden md:block">
        <div className="relative rounded-xl border border-white/10 bg-card/30 backdrop-blur-sm p-6 overflow-hidden">
          {/* Background gradient band */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-amber-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />

          {/* Figure title */}
          <div className="relative flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/70 font-heading">{t("misc.figure1")}</p>
              <p className="text-sm font-heading tracking-wider text-foreground/90">{t("home.12relaysTitle")}</p>
            </div>
            <div className="flex items-center gap-3">
              {(["west", "east", "outrider"] as const).map((p) => (
                <span key={p} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: perspectiveColor[p] }} />
                  <span className="text-[9px] text-muted-foreground/70">{perspectiveLabel[p]}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Timeline axis */}
          <div className="relative mb-2">
            <div className="absolute top-[22px] left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/60 via-amber-500/60 via-blue-500/60 to-purple-500/60" />
          </div>

          {/* Relay cards in a 12-column grid */}
          <div className="relative grid grid-cols-12 gap-x-1">
            {RELAYS.map((relay) => {
              const collected = collection.has(relay.number - 1);
              const persp = perspectiveOf(relay.number);
              return (
                <Link key={relay.number} href={`/explore?relay=${relay.number}`}>
                  <div className="flex flex-col items-center gap-1.5 group cursor-pointer py-2">
                    {/* Relay node */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-110 ${
                        collected ? "ring-2 ring-offset-1 ring-offset-background" : ""
                      }`}
                      style={{
                        borderColor: collected ? relay.color : `${relay.color}50`,
                        background: collected ? `${relay.color}25` : `${relay.color}10`,
                        boxShadow: collected
                          ? `0 0 16px ${relay.color}50, 0 0 32px ${relay.color}20`
                          : `0 0 8px ${relay.color}15`,
                      }}
                    >
                      <span className={`text-base ${collected ? "" : "grayscale opacity-50"}`}>{relay.emoji}</span>
                    </div>

                    {/* Relay name */}
                    <span className={`text-[9px] font-heading tracking-wider text-center leading-tight transition-colors ${
                      collected ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground"
                    }`}>
                      {t(`relay.${relay.name.toLowerCase().replace(/ /g, '')}`) || relay.name}
                    </span>

                    {/* Subtitle */}
                    <span className="text-[7px] text-muted-foreground/50 text-center leading-tight px-0.5 line-clamp-2">
                      {t(`relay.subtitle.${relay.number}`) || relay.subtitle}
                    </span>

                    {/* Era */}
                    <span className="text-[7px] text-muted-foreground/40 text-center font-mono">
                      {t(`relay.era.${relay.number}`) || relay.era}
                    </span>

                    {/* Perspective tag */}
                    <span
                      className="text-[7px] px-1.5 py-0.5 rounded-full font-heading tracking-wider"
                      style={{
                        background: `${perspectiveColor[persp]}15`,
                        color: perspectiveColor[persp],
                        border: `1px solid ${perspectiveColor[persp]}30`,
                      }}
                    >
                      {perspectiveLabel[persp].charAt(0)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Web type bands at bottom */}
          <div className="relative flex items-center mt-4 pt-3 border-t border-white/5">
            <span className="text-[8px] text-muted-foreground/50 mr-3 font-heading tracking-wider">{t("web.webs") || "WEBS"}</span>
            <div className="flex-1 flex">
              {[
                { label: "Natural", key: "natural", cols: 3, color: "#22c55e" },
                { label: "Machine", key: "machine", cols: 4, color: "#f59e0b" },
                { label: "Digital", key: "digital", cols: 4, color: "#3b82f6" },
                { label: "Consciousness", key: "consciousness", cols: 1, color: "#a855f7" },
              ].map((web) => (
                <div
                  key={web.label}
                  className="flex items-center justify-center py-1 text-[8px] font-heading tracking-wider"
                  style={{
                    flex: web.cols,
                    background: `${web.color}08`,
                    borderBottom: `2px solid ${web.color}40`,
                    color: `${web.color}`,
                  }}
                >
                  {t(`web.${web.key}`) || web.label}
                </div>
              ))}
            </div>
          </div>

          {/* Source line */}
          <p className="text-[8px] text-muted-foreground/30 mt-3 text-right font-mono">
            {t("dearden.source") || "Source: An Infrastructure Odyssey — Episode 1: Calories to Consciousness"}
          </p>
        </div>
      </div>

      <p className="text-center text-[9px] text-muted-foreground/50 mt-4 font-heading tracking-wider">
        {t("dearden.eachRelay")}
      </p>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const t = useT();
  const { lang } = useLanguage();

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
            <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase bg-red-600 text-white animate-pulse">{t("common.beta")}</span>
            <LanguageToggle />
            <Link href="/play/igo">
              <Button variant="ghost" size="sm" className="text-gold-dim hover:text-gold-bright gap-1.5 font-heading tracking-wider">
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden sm:inline"><span className="brand-i">i</span>GO</span>
              </Button>
            </Link>
            <a href="#governance">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">{t("home.governance")}</span>
              </Button>
            </a>
            <Link href="/resources">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                <Library className="w-4 h-4" />
                <span className="hidden sm:inline">{t("home.resources")}</span>
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">{t("home.leaderboard")}</span>
              </Button>
            </Link>
            {isAuthenticated ? (
              <span className="text-sm text-muted-foreground">
                {t("home.welcome")}, <span className="text-gold-gradient font-medium">{user?.name || t("home.commander")}</span>
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
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">{t("home.guidedLearning")}</p>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide text-gold-gradient mb-2">
              {t("home.realityEngine")}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("home.heroDescription")}
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
              { label: t("home.relays"), value: "12", icon: Globe },
              { label: t("home.greatWebs"), value: "5", icon: Zap },
              { label: t("home.inventions"), value: "91+", icon: BookOpen },
              { label: t("home.xpCap"), value: "24M", icon: Trophy },
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

          {/* Direct game entry — a real link with a mobile-safe touch target */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-4 flex justify-center"
          >
            <Link
              href="/explore"
              aria-label={t("home.playNow")}
              data-testid="home-play-now"
              className="inline-flex min-h-12 min-w-44 touch-manipulation items-center justify-center gap-2 rounded-lg border border-red-400/50 bg-red-500/10 px-6 py-3 text-red-300 transition-colors hover:border-red-300 hover:bg-red-500/20 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              <span className="text-sm font-heading tracking-[0.2em] uppercase">{t("home.playNow")}</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── iGO INTERACTIVE PIPELINE DASHBOARD ── */}
      <section className="relative z-10">
        {/* AIM tagline */}
        <div className="container max-w-4xl text-center pt-4 pb-2">
          <p className="text-sm md:text-base text-amber-300/80 font-heading tracking-wider mb-1">
            {t("home.aimTagline")}
          </p>
          <p className="text-[10px] md:text-xs text-muted-foreground tracking-widest uppercase mb-1">
            {t("home.aimFull")}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-2">
            {t("home.aimDescription")} <a href={`https://www.infrastructure-academy.com?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline underline-offset-2"><BrandI />AAi</a>.
          </p>
        </div>

        {/* ── PIPELINE DASHBOARD + PLAYER'S JOURNEY ── */}
        {/* Side-by-side on desktop, stacked on mobile */}
        <div className="container max-w-7xl px-2 md:px-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
            {/* Pipeline — instant dashboard */}
            <div className="lg:w-1/2 flex items-center glow-pulse overflow-hidden">
              <PipelineHotspots />
            </div>
            {/* Player's Journey — the growth story */}
            <div className="lg:w-1/2 glow-pulse overflow-hidden" style={{ aspectRatio: '2752/1536' }}>
              <ImageLightbox
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/igo-player-glory-arc_01ca1bbc.png"
                alt="The Player's Journey — From Spark to Master: 11 game modes showing lifelong learning progression from age 8 to 65+"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* ── YOUR RELAY COLLECTION ── */}
        <RelayCollectionTracker />

        {/* ── YOUR WEB DOMAINS + DEARDEN FIELD ── */}
        <WebDomainsTracker />
        <DeardenFieldSection />

        {/* ── YOUR CIVILISATIONAL LEAN (archetype preview) ── */}
        <YourArchetypeCard />

        {/* ── 500 GENERATIONS TIMELINE STRIP (interactive) ── */}
        <GenerationsTimelineStrip />

        {/* ── THE CONVERGENCE — Why This Exists ── */}
        <div className="container max-w-4xl pb-8 pt-2">
          <div className="text-center mb-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/60 mb-1">{t("home.formationBase")}</p>
            <h3 className="font-heading text-lg md:text-xl text-foreground">{t("home.goReimagined")}</h3>
            <p className="text-muted-foreground text-xs mt-1">{t("home.convergenceDesc")}</p>
          </div>
          <ImageLightbox
            src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/convergence-main_807ea243.png"
            alt="The Convergence — Go × Pokémon × iAAi = iGO"
            className="w-full rounded-lg border border-amber-400/20"
          />
        </div>

        {/* Support / Back iGO CTA */}
        <div className="container max-w-4xl pb-8 pt-2">
          <div className="relative border border-amber-500/30 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.08), rgba(168,85,247,0.06), transparent)' }}>
            <div className="p-6 md:p-8 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/60 mb-2">{t("home.rallyingCry")}</p>
              <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-2">{t("home.everyPlayer")}</h3>
              <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-2">{t("home.morePlayers")}</h3>
              <p className="font-heading text-lg md:text-xl text-purple-300 mt-3 mb-5">
                {t("home.howManyRally")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/play/igo#register">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black font-heading tracking-wider text-xs px-6 gap-1.5">
                    {t("home.registerInterest")} <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link href="/play/igo#back-igo">
                  <Button variant="outline" size="sm" className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-heading tracking-wider text-xs gap-1.5">
                    {t("home.whyBack")} <span className="whitespace-nowrap" style={{letterSpacing:0}}><span className="brand-i">i</span>GO</span>? <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-6 pt-5 border-t border-amber-500/15">
                <p className="text-sm md:text-base text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
                  {t("home.igoQuote")}
                </p>
                <p className="text-xs text-amber-400/70 mt-2 font-heading tracking-wider">— Ir. Nigel T. Dearden, {t("home.founderArchitect")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHARE iGO — Social Share Cards ── */}
      <section className="relative z-10 pb-12">
        <div className="container max-w-4xl">
          <div className="text-center mb-6">
            <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/60 mb-1">{t("home.spreadWord")}</p>
            <h3 className="font-heading text-lg md:text-xl text-foreground">{t("home.shareIgo")}</h3>
            <p className="text-muted-foreground text-xs mt-1">{t("home.shareDesc")}</p>
          </div>
          <ShareCardGallery />
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
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">{t("home.watchBefore")}</p>
            <h3 className="font-heading text-2xl md:text-3xl text-gold-gradient mb-2">{t("home.youthVideos")}</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">{t("home.youthVideosDesc")}</p>
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
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">{t("home.evidenceRecords")}</p>
            <h3 className="font-heading text-xl md:text-2xl text-gold-gradient mb-2">{t("home.audioVerification")}</h3>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">{t("home.audioVerificationDesc")}</p>
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
                <h4 className="text-xs font-heading font-bold text-green-400 tracking-wide">{t("home.audioRecord")}</h4>
                <p className="text-[10px] text-muted-foreground mt-1">{t("home.audioRecordDesc")}</p>
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
                <h4 className="text-xs font-heading font-bold text-amber-400 tracking-wide">{t("home.deliveryManifest")}</h4>
                <p className="text-[10px] text-muted-foreground mt-1">{t("home.deliveryManifestDesc")}</p>
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
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">{t("home.governanceFramework")}</p>
            <h3 className="font-heading text-xl md:text-2xl text-gold-gradient mb-2">{t("home.systemArchitecture")}</h3>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">{t("home.governanceDesc")}</p>
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
              <h4 className="text-xs font-heading font-bold text-gold-dim tracking-wide">{t("home.fourSites")}</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{t("home.fourSitesDesc")}</p>
            </div>
          </motion.div>

          {/* Row 2: GOV-010 + iA⁴i Evolution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <h4 className="text-xs font-heading font-bold text-green-400 tracking-wide">{t("home.gov010")}</h4>
                <p className="text-[10px] text-muted-foreground mt-1">{t("home.gov010Desc")}</p>
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
                <h4 className="text-xs font-heading font-bold text-amber-400 tracking-wide">{t("home.ia4iEvolution")}</h4>
                <p className="text-[10px] text-muted-foreground mt-1">{t("home.ia4iEvolutionDesc")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* The Living Experiment — Infographic */}
      <section className="relative z-10 py-12 border-t border-gold-dim/20">
        <div className="container max-w-4xl mx-auto">
          <p className="text-center text-xs tracking-[0.3em] uppercase text-gold-dim/80 mb-6">{t("home.methodBehind")}</p>
          <div className="rounded-lg overflow-hidden border border-gold-dim/30 shadow-lg shadow-gold-dim/5">
            <ImageLightbox
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/living-experiment-infographic_05a0824a.jpeg"
              alt="The Living Experiment — Biological Intelligence Directing Digital Intelligence — The Same Model for Millennia. Tetra Handshake connecting Observer Player (Ir. Nigel T. Dearden, CEng) with ACAD (Contractor), MEMORIAL (Design Team), and CHECKER (Government Inspector)."
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
          <p className="text-center text-[10px] text-muted-foreground/60 mt-4 font-mono">
            {t("home.morallyNeutral")}
          </p>
        </div>
      </section>



      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-muted-foreground">
                {t("home.footerTitle")}{" "}
                <a href={`https://www.infrastructure-academy.com?lang=${lang}`} className="text-gold-dim hover:text-gold-bright transition-colors">
                  {t("home.footerAcademy")}
                </a>
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">www.infrastructure-academy.com</p>
              <p className="text-[10px] text-muted-foreground/40 mt-1">{t("home.footerAgents")}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/qr-infrastructure-academy_d5d9f029.png"
                alt="QR Code — www.infrastructure-academy.com"
                className="w-20 h-20 object-contain rounded"
              />
              <span className="text-[9px] text-muted-foreground/50">{t("home.scanExplore")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
