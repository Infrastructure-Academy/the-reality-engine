import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "wouter";
import { ImageLightbox } from "@/components/ImageLightbox";
import { PipelineHotspots } from "@/components/PipelineHotspots";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Gamepad2, GraduationCap, Building2, HandCoins, Users, ChevronRight,
  Smartphone, Globe, Flame, TreePine, Waves, Sailboat, Compass, Ship,
  Factory, Train, Plane, Satellite, Atom, Network, Layers, ArrowDown,
  CheckCircle2, Sparkles, Target, BookOpen, Shield, Zap, Trophy
} from "lucide-react";

// ─── 12 MODES A–L (v4 terminology) ───
const MODES = [
  { letter: "A", name: "Relay Spinner", ages: "8–10", ageMin: 8, ageMax: 10, episode: 1, status: "live" as const, dice: "Spinner", color: "#22c55e", description: "First contact with infrastructure. Spin the relay wheel, discover the 12 civilisational relays through play.", generation: "Gen Alpha / Gen Beta" },
  { letter: "B", name: "Dungeon Crawl", ages: "10–12", ageMin: 10, ageMax: 12, episode: 1, status: "live" as const, dice: "D6", color: "#22c55e", description: "Narrative exploration through relay dungeons. DAVID guides the adventure. iCards collected, XP earned.", generation: "Gen Alpha / Gen Beta" },
  { letter: "C", name: "Grey Matter", ages: "12–14", ageMin: 12, ageMax: 14, episode: 1, status: "live" as const, dice: "D8", color: "#22c55e", description: "Strategic thinking unlocked. Deeper relay analysis, biomimicry connections, cross-relay pattern recognition.", generation: "Gen Alpha / Gen Z" },
  { letter: "D", name: "Flight Deck", ages: "14–18", ageMin: 14, ageMax: 18, episode: 1, status: "live" as const, dice: "D10/D12", color: "#22c55e", description: "Immersive cockpit HUD mode. Full relay missions, FITS team play, companion bots.", generation: "Gen Z" },
  { letter: "E", name: "Scholar", ages: "18+", ageMin: 18, ageMax: 22, episode: 1, status: "designed" as const, dice: "D20", color: "#ffd700", description: "Full AD&D RPG format. DAVID as Dungeon Master. Thesis-quality work, ISI scoring.", generation: "Gen Z / Millennials" },
  { letter: "F", name: "Academic", ages: "University", ageMin: 18, ageMax: 25, episode: 1, status: "designed" as const, dice: "D20", color: "#ffd700", description: "Professor-supervised programme. R3 Panel assessment, ISI scoring, peer review.", generation: "Gen Z / Millennials" },
  { letter: "G", name: "Graduate", ages: "22–29", ageMin: 22, ageMax: 29, episode: 2, status: "aspirational" as const, dice: "Professional", color: "#3b82f6", description: "Early career infrastructure professional. CPD-aligned relay missions, graduate scheme integration.", generation: "Millennials" },
  { letter: "H", name: "Chartered", ages: "30+", ageMin: 30, ageMax: 39, episode: 2, status: "aspirational" as const, dice: "Professional", color: "#3b82f6", description: "Chartered engineer pathway. ICE/IStructE/CIHT alignment, professional review preparation.", generation: "Millennials / Gen X" },
  { letter: "I", name: "Senior Leader", ages: "40+", ageMin: 40, ageMax: 49, episode: 3, status: "aspirational" as const, dice: "Professional", color: "#a855f7", description: "Infrastructure leadership. Strategic planning, governance frameworks, cross-sector synthesis.", generation: "Gen X" },
  { letter: "J", name: "Industry Leader", ages: "50+", ageMin: 50, ageMax: 59, episode: 3, status: "aspirational" as const, dice: "Professional", color: "#a855f7", description: "Sector-shaping influence. Industry-wide perspective, legacy infrastructure stewardship.", generation: "Gen X / Baby Boomers" },
  { letter: "K", name: "Industry Champion", ages: "60+", ageMin: 60, ageMax: 64, episode: 3, status: "aspirational" as const, dice: "Professional", color: "#a855f7", description: "Recognised industry authority. Lifetime achievement integration, cross-generational knowledge transfer.", generation: "Baby Boomers" },
  { letter: "L", name: "Master Class", ages: "65+", ageMin: 65, ageMax: 100, episode: 3, status: "aspirational" as const, dice: "Professional", color: "#a855f7", description: "The capstone. Craftsmanship earned through decades of practice. Master Weaver status.", generation: "Baby Boomers / Silent Generation" },
];

// ─── 3 EPISODES ───
const EPISODES = [
  { num: 1, name: "RELAY & REMEMBER", ages: "8–22", modes: "A–F", color: "#22c55e", desc: "Learn the 12 relays through play, narrative, and academic rigour" },
  { num: 2, name: "EXPLORE FORWARD", ages: "22–50", modes: "G–H", color: "#3b82f6", desc: "Apply relay knowledge to professional infrastructure careers" },
  { num: 3, name: "BUILD FORWARD", ages: "40–65+", modes: "I–L", color: "#a855f7", desc: "Lead, champion, and teach — the guild tradition fulfilled" },
];

// ─── 13 EXHIBITION HALL CARDS ───
const HALLS = [
  { num: 1, relay: "Fire", era: "10,000 BCE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/82f11f50-0df7-40c1-9018-fe3738f8aff2_44edee48.jpg" },
  { num: 2, relay: "Tree", era: "8,000 BCE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/9c0c3bf6-f497-44f9-8fa8-3ba3d885dcb5_c82a3ea2.jpg" },
  { num: 3, relay: "River", era: "5,000 BCE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/ab5c471f-561f-403d-9118-1f54808d665e_aee683ff.jpg" },
  { num: 4, relay: "Horse", era: "4,000 BCE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/2afb98ff-c705-4126-a202-1d9b65431b86_7e739320.jpg" },
  { num: 5, relay: "Roads", era: "3,000 BCE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/b6cf56b4-b863-4c78-a9df-4a3c0f986245_60732f19.jpg" },
  { num: 6, relay: "Ships", era: "2,000 BCE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/11ea3068-ea4e-4f9b-823b-cf46daaf04b1_93089084.jpg" },
  { num: 7, relay: "Loom", era: "1,000 BCE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/60191938-25d6-4330-b9d0-5b2dd26d2811_2fc301a0.jpg" },
  { num: 8, relay: "Rail", era: "1825 CE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/c2b8c9cc-68f5-48a8-8a52-4b739a7d9bd6_d9c79671.jpg" },
  { num: 9, relay: "Engine", era: "1769 CE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/43e264f2-fdaa-467f-9a91-318382426e48_1ea9ba3b.jpg" },
  { num: 10, relay: "AAA Triad", era: "1903 CE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/a02b3156-e2a1-48c9-820d-fcab560dcaff_010dee84.jpg" },
  { num: 11, relay: "Orbit", era: "1957 CE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/c47969d6-e1e7-4237-8498-71d42a2da5d1_2ad7fa74.jpg" },
  { num: 12, relay: "Human Nodes", era: "2024 CE", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/e9cfd1b1-98e9-4ad9-bab6-266e99cac609_f294410f.jpg" },
  { num: 13, relay: "Fractal Connector", era: "Q4 2026", img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/fbe2a66a-c63e-4c3e-9fc6-979ee4a617cc_14080485.jpg" },
];

// ─── SUPPORTER ROLES ───
const SUPPORTER_ROLES = [
  { key: "player" as const, icon: Gamepad2, label: "Player", desc: "I want to play iGO" },
  { key: "educator" as const, icon: GraduationCap, label: "Educator", desc: "I want to use iGO in my classroom" },
  { key: "institution" as const, icon: Building2, label: "Institution", desc: "University, school, or professional body" },
  { key: "sponsor" as const, icon: HandCoins, label: "Sponsor / Backer", desc: "I want to fund the scale-up" },
  { key: "other" as const, icon: Users, label: "Other", desc: "General interest or partnership" },
];

// ─── CDN IMAGES ───
const CDN = {
  masterGrid: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iGO_Master_Grid_v5_54307353.png",
  iCardUmbrella: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard_igo_umbrella_9a19d3a0.png",
  generationsTimeline: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/icard_generations_timeline_a74f8d24.png",
  lifecyclePipeline: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iGO_Pipeline_v3_fixed_4c69f89d.png",
};

// ─── IMPACT STATS ───
const IMPACT_STATS = [
  { value: "12", label: "RELAYS", icon: Globe },
  { value: "5", label: "GREAT WEBS", icon: Zap },
  { value: "91+", label: "INVENTIONS", icon: BookOpen },
  { value: "12", label: "GAME FORMATS", icon: Layers },
  { value: "8–65+", label: "AGE RANGE", icon: Users },
  { value: "24M", label: "XP CAP", icon: Trophy },
];

export default function IGOUmbrella() {
  const [showContent, setShowContent] = useState(false);
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [filterEpisode, setFilterEpisode] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<typeof MODES[0] | null>(null);
  const { user } = useAuth();

  // ─── Registration form state ───
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState<typeof SUPPORTER_ROLES[number]["key"]>("player");
  const [regOrg, setRegOrg] = useState("");
  const [regMessage, setRegMessage] = useState("");
  const [regAppPre, setRegAppPre] = useState(true);
  const [regSubmitted, setRegSubmitted] = useState(false);

  const registerMutation = trpc.igo.register.useMutation({
    onSuccess: () => {
      setRegSubmitted(true);
      toast.success("Thank you! Your interest has been registered.");
    },
    onError: (err) => {
      toast.error(err.message || "Registration failed. Please try again.");
    },
  });

  const { data: igoStats } = trpc.igo.stats.useQuery();

  const registerRef = useRef<HTMLDivElement>(null);
  const exhibitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(t);
  }, []);

  // ─── OG Meta Tags for social sharing ───
  useEffect(() => {
    const ogImage = CDN.iCardUmbrella;
    const ogTitle = "iGO — One Game. All Ages. 8–65+. | Infrastructure Academy";
    const ogDesc = "12 civilisational relays. 12 game formats. A lifelong learning system spanning ages 8 to 65+. Join as a player, educator, institution, or backer.";
    const ogUrl = window.location.href;
    const setMeta = (prop: string, content: string, attr = "property") => {
      let el = document.querySelector(`meta[${attr}="${prop}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.content = content;
    };
    document.title = ogTitle;
    setMeta("og:title", ogTitle);
    setMeta("og:description", ogDesc);
    setMeta("og:image", ogImage);
    setMeta("og:url", ogUrl);
    setMeta("og:type", "website");
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", ogTitle, "name");
    setMeta("twitter:description", ogDesc, "name");
    setMeta("twitter:image", ogImage, "name");
    return () => { document.title = "The Reality Engine"; };
  }, []);

  // Pre-fill name/email from auth
  useEffect(() => {
    if (user) {
      if (user.name && !regName) setRegName(user.name);
      if (user.email && !regEmail) setRegEmail(user.email);
    }
  }, [user]);

  const matchedModes = useMemo(() => {
    if (selectedAge === null) return [];
    return MODES.filter(m => selectedAge >= m.ageMin && selectedAge <= m.ageMax);
  }, [selectedAge]);

  const filteredModes = useMemo(() => {
    if (filterEpisode === null) return MODES;
    return MODES.filter(m => m.episode === filterEpisode);
  }, [filterEpisode]);

  const scrollToRegister = () => {
    registerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    registerMutation.mutate({
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      organisation: regOrg.trim() || undefined,
      message: regMessage.trim() || undefined,
      appPreRegister: regAppPre,
    });
  };

  const statusBadge = (status: string) => {
    if (status === "live") return <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LIVE</span>;
    if (status === "designed") return <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/30">DESIGNED</span>;
    return <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-sm bg-slate-500/20 text-slate-300 border border-slate-500/30">ASPIRATIONAL</span>;
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #050510 0%, #0a1628 10%, #0a1628 90%, #050510 100%)" }}>
      {/* ── STICKY HEADER ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3" style={{ background: "linear-gradient(180deg, rgba(5,5,16,0.97) 0%, rgba(10,22,40,0.85) 100%)", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="flex items-center gap-2 text-amber-400/70 hover:text-amber-400 transition-colors">
          <span className="text-lg">←</span>
          <span className="font-sans text-xs tracking-wider hidden sm:inline">HOME</span>
        </Link>
        <div className="text-center">
          <span className="font-bold text-amber-400 text-sm tracking-[0.25em]">iGO</span>
          <span className="ml-2 px-2 py-0.5 bg-orange-500/15 border border-orange-500/40 text-orange-400 font-mono text-[8px] tracking-widest rounded-sm">PoC BETA</span>
        </div>
        <button onClick={scrollToRegister} className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold tracking-wider rounded hover:bg-amber-500/30 transition-colors">
          JOIN
        </button>
      </div>

      <div className="pt-20 px-4 max-w-7xl mx-auto pb-24">

        {/* ══════════════════════════════════════════════════════════════
            SECTION 1: HERO — THE PITCH
        ══════════════════════════════════════════════════════════════ */}
        <section className={`text-center mb-20 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="mb-6">
            <h1 className="tracking-[0.4em] mb-3 font-bold" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", color: "#ffd700", textShadow: "0 0 60px rgba(255,215,0,0.3), 0 0 120px rgba(255,215,0,0.1)" }}>
              iGO
            </h1>
            <p className="text-white/90 tracking-[0.15em] text-xl sm:text-2xl mb-3 font-semibold">
              ONE GAME. ALL AGES. 8–65+
            </p>
            <p className="text-amber-400/70 italic text-lg sm:text-xl max-w-2xl mx-auto mb-6">
              Where you go, iGO follows.
            </p>
          </div>

          {/* Value proposition */}
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-white/60 text-base sm:text-lg leading-relaxed">
              The world's first <span className="text-amber-400 font-semibold">lifelong infrastructure learning game</span>. 
              12 civilisational relays. 12 game formats. From a child's first spin to a Master Weaver's capstone. 
              One architecture, one scoring system, one community — <span className="text-white/80 font-semibold">scaled across every generation</span>.
            </p>
          </div>

          {/* Impact stats bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-4xl mx-auto mb-10">
            {IMPACT_STATS.map(s => (
              <div key={s.label} className="text-center py-3 px-2 rounded-lg border border-white/5" style={{ background: "rgba(255,215,0,0.03)" }}>
                <s.icon className="w-4 h-4 mx-auto mb-1 text-amber-400/60" />
                <div className="text-amber-400 text-lg sm:text-xl font-bold">{s.value}</div>
                <div className="text-white/30 text-[8px] sm:text-[9px] font-mono tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pipeline v3 (interactive hotspots) + iCard Portrait */}
          <div className="max-w-5xl mx-auto mb-8 space-y-6">
            <div className="rounded-lg border border-amber-400/20 overflow-hidden">
              <PipelineHotspots />
            </div>
            <div className="max-w-xs mx-auto">
              <ImageLightbox
                src={CDN.iCardUmbrella}
                alt="iGO iCard — Architecture Overview, Block 471, SAP Verified"
                className="w-full rounded-lg border border-amber-400/20 hover:border-amber-400/40 transition-colors"
              />
            </div>
            <p className="text-white/20 text-[9px] font-mono mt-2 tracking-wider text-center">B-ARCH-001 — Pipeline v3 + iCard B471K-IGO-001</p>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/explore" className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wider rounded-lg transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <Gamepad2 className="w-4 h-4" /> PLAY NOW — MODES A–D LIVE
            </Link>
            <button onClick={scrollToRegister} className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-sm tracking-wider rounded-lg hover:bg-amber-500/30 transition-all">
              <HandCoins className="w-4 h-4" /> SUPPORT THE MISSION
            </button>
          </div>

          {/* Social proof counter */}
          {igoStats && igoStats.total > 0 && (
            <p className="text-white/30 text-xs mt-4 font-mono tracking-wider">
              <span className="text-amber-400/60 font-bold">{igoStats.total}</span> people have registered interest
            </p>
          )}

          <div className="mt-10 flex justify-center">
            <ArrowDown className="w-5 h-5 text-amber-400/30 animate-bounce" />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 2: FIND YOUR MODE — Interactive Age Router
        ══════════════════════════════════════════════════════════════ */}
        <section className={`mb-20 transition-all duration-1000 delay-100 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-lg sm:text-xl tracking-[0.2em] text-center mb-2 font-bold">FIND YOUR MODE</h2>
          <p className="text-center text-white/40 text-sm mb-8 max-w-xl mx-auto">
            Tap your age bracket. iGO shows you where you enter the game.
          </p>

          {/* Age selector buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-3xl mx-auto">
            {[
              { label: "8–10", age: 9 }, { label: "10–12", age: 11 }, { label: "12–14", age: 13 },
              { label: "14–18", age: 16 }, { label: "18–22", age: 20 }, { label: "22–29", age: 25 },
              { label: "30–39", age: 35 }, { label: "40–49", age: 45 }, { label: "50–59", age: 55 },
              { label: "60–64", age: 62 }, { label: "65+", age: 70 },
            ].map(a => (
              <button
                key={a.label}
                onClick={() => setSelectedAge(selectedAge === a.age ? null : a.age)}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold tracking-wider transition-all border ${
                  selectedAge === a.age
                    ? "bg-amber-400/20 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                    : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white/70"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Result panel */}
          {selectedAge !== null && matchedModes.length > 0 && (
            <div className="max-w-2xl mx-auto rounded-xl p-6 border border-amber-400/30 mb-4" style={{ background: "linear-gradient(180deg, rgba(255,215,0,0.06) 0%, rgba(10,22,40,0.95) 100%)" }}>
              <p className="text-amber-400/60 text-xs font-mono tracking-wider mb-3">YOUR RECOMMENDED MODE{matchedModes.length > 1 ? "S" : ""}</p>
              <div className="space-y-3">
                {matchedModes.map(m => (
                  <div key={m.letter} className="flex items-start gap-4 p-3 rounded-lg border border-white/10" style={{ background: "rgba(10,22,40,0.6)" }}>
                    <div className="w-10 h-10 rounded flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ backgroundColor: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40` }}>
                      {m.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white text-base font-bold tracking-wider">{m.name}</h3>
                        {statusBadge(m.status)}
                      </div>
                      <p className="text-white/40 text-xs font-mono mt-0.5">Ages {m.ages} · {m.dice} · EP.{m.episode} · {m.generation}</p>
                      <p className="text-white/50 text-sm mt-1">{m.description}</p>
                      {m.status === "live" && (
                        <Link href="/explore" className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded text-emerald-300 text-xs font-bold tracking-wider hover:bg-emerald-500/30 transition-colors">
                          PLAY NOW <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 3: HOW IT WORKS — Lifecycle Pipeline
        ══════════════════════════════════════════════════════════════ */}
        <section className={`mb-20 transition-all duration-1000 delay-200 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-lg sm:text-xl tracking-[0.2em] text-center mb-2 font-bold">HOW IT WORKS</h2>
          <p className="text-center text-white/40 text-sm mb-8 max-w-xl mx-auto">
            Three episodes. One lifelong journey. Same 12 relays at every stage.
          </p>

          {/* 3 Episode cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {EPISODES.map(ep => (
              <div key={ep.num} className="rounded-xl p-6 border border-white/10 text-center hover:border-white/20 transition-all" style={{ background: `linear-gradient(180deg, ${ep.color}08 0%, rgba(5,5,16,0.95) 100%)` }}>
                <div className="text-4xl mb-2 font-bold" style={{ color: ep.color }}>EP.{ep.num}</div>
                <h3 className="text-white text-sm tracking-[0.15em] mb-2 font-bold">{ep.name}</h3>
                <p className="text-white/40 text-xs font-mono mb-2">Ages {ep.ages} · Modes {ep.modes}</p>
                <p className="text-white/50 text-xs leading-relaxed">{ep.desc}</p>
              </div>
            ))}
          </div>

          {/* Lifecycle Pipeline image — full width, no lightbox */}
          <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 mt-4">
            <img
              src={CDN.lifecyclePipeline}
              alt="iGO Lifecycle Timeline — The Complete Pipeline"
              className="w-full block"
              style={{ display: "block", margin: 0, padding: 0 }}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 4: THE 12 GAME FORMATS
        ══════════════════════════════════════════════════════════════ */}
        <section className={`mb-20 transition-all duration-1000 delay-300 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-lg sm:text-xl tracking-[0.2em] text-center mb-6 font-bold">THE 12 GAME FORMATS</h2>

          {/* Episode filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              onClick={() => setFilterEpisode(null)}
              className={`px-4 py-2 rounded-lg text-xs tracking-[0.15em] transition-all border font-bold ${filterEpisode === null ? "bg-amber-400/20 border-amber-400/50 text-amber-400" : "bg-transparent border-white/10 text-white/40 hover:border-white/30"}`}
            >
              ALL 12 MODES
            </button>
            {EPISODES.map(ep => (
              <button
                key={ep.num}
                onClick={() => setFilterEpisode(ep.num)}
                className={`px-4 py-2 rounded-lg text-xs tracking-[0.15em] transition-all border font-bold ${filterEpisode === ep.num ? "bg-amber-400/20 border-amber-400/50 text-amber-400" : "bg-transparent border-white/10 text-white/40 hover:border-white/30"}`}
              >
                EP.{ep.num}: {ep.name}
              </button>
            ))}
          </div>

          {/* Mode cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredModes.map(mode => {
              const isLive = mode.status === "live";
              return (
                <div
                  key={mode.letter}
                  className={`relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer group ${
                    isLive
                      ? "border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                      : mode.status === "designed"
                      ? "border-amber-500/20 hover:border-amber-400/50"
                      : "border-white/10 hover:border-white/25"
                  }`}
                  style={{ background: "linear-gradient(180deg, rgba(10,22,40,0.9) 0%, rgba(5,5,16,0.95) 100%)" }}
                  onClick={() => setSelectedMode(selectedMode?.letter === mode.letter ? null : mode)}
                >
                  <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${mode.color}20`, color: mode.color, border: `1px solid ${mode.color}40` }}>
                    {mode.letter}
                  </div>
                  <div className="absolute top-3 right-3 z-10">{statusBadge(mode.status)}</div>

                  <div className="pt-14 px-4 pb-4">
                    <h3 className="text-white text-base tracking-[0.1em] mb-1 font-bold">{mode.name}</h3>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-white/40 text-xs font-mono">Ages {mode.ages}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-white/40 text-xs font-mono">{mode.dice}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-xs font-mono" style={{ color: EPISODES[mode.episode - 1].color + "90" }}>EP.{mode.episode}</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{mode.description}</p>

                    {selectedMode?.letter === mode.letter && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-white/30 text-[10px] font-mono mb-1">COMMUNITY: <span className="text-amber-400/70">{mode.generation}</span></p>
                        {isLive ? (
                          <Link href="/explore" className="inline-flex items-center gap-1 mt-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-emerald-300 text-xs font-bold tracking-wider hover:bg-emerald-500/30 transition-colors">
                            PLAY NOW <ChevronRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); scrollToRegister(); }} className="inline-flex items-center gap-1 mt-2 px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 text-xs font-bold tracking-wider hover:bg-amber-500/30 transition-colors">
                            REGISTER INTEREST <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 5: EXHIBITION HALL GALLERY
        ══════════════════════════════════════════════════════════════ */}
        <section ref={exhibitionRef} className={`mb-20 transition-all duration-1000 delay-[400ms] ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-lg sm:text-xl tracking-[0.2em] text-center mb-2 font-bold">THE EXHIBITION</h2>
          <p className="text-center text-white/40 text-sm mb-8 max-w-xl mx-auto">
            13 immersive halls. The physical manifestation of iGO — from Fire to the Fractal Connector.
          </p>

          {/* Horizontal scroll carousel */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {HALLS.map(hall => (
                <div key={hall.num} className="flex-shrink-0 w-48 sm:w-56 snap-start rounded-xl overflow-hidden border border-white/10 hover:border-amber-400/30 transition-all group">
                  <ImageLightbox
                    src={hall.img}
                    alt={`Hall ${hall.num}: ${hall.relay}`}
                    className="w-full aspect-[3/4] object-cover"
                    loading="lazy"
                  />
                  <div className="p-3" style={{ background: "rgba(5,5,16,0.95)" }}>
                    <p className="text-amber-400 text-[9px] font-mono tracking-wider">HALL {hall.num}</p>
                    <p className="text-white text-sm font-bold tracking-wider">{hall.relay.toUpperCase()}</p>
                    <p className="text-white/40 text-[10px] font-mono">{hall.era}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Scroll hint */}
            <div className="absolute right-0 top-0 bottom-4 w-16 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(5,5,16,0.9))" }} />
          </div>
          <p className="text-center text-white/20 text-xs mt-3 font-mono tracking-wider">← SCROLL TO EXPLORE ALL 13 HALLS →</p>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 6: THE PERMANENT FOUNDATION
        ══════════════════════════════════════════════════════════════ */}
        <section className={`mb-20 transition-all duration-1000 delay-500 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="max-w-3xl mx-auto text-center rounded-xl p-8 border border-amber-400/20" style={{ background: "linear-gradient(180deg, rgba(255,215,0,0.04) 0%, rgba(10,22,40,0.9) 100%)" }}>
            <h2 className="text-amber-400 text-lg tracking-[0.2em] mb-6 font-bold">THE PERMANENT FOUNDATION</h2>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-amber-400 text-3xl font-bold">12</div>
                <div className="text-white/40 text-xs font-mono mt-1">RELAYS</div>
              </div>
              <div>
                <div className="text-amber-400 text-3xl font-bold">5</div>
                <div className="text-white/40 text-xs font-mono mt-1">GREAT WEBS</div>
              </div>
              <div>
                <div className="text-amber-400 text-3xl font-bold">60</div>
                <div className="text-white/40 text-xs font-mono mt-1">NODE DEARDEN FIELD</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xl mx-auto mb-4">
              Every mode — from Relay Spinner (age 8) to Master Class (age 65+) — traverses the same 12 civilisational relays, the same 5 Great Webs, and the same 60-node Dearden Field. The content deepens. The architecture never changes.
            </p>
            <p className="text-amber-400/60 text-xs font-bold tracking-[0.15em]">
              SAME 12 RELAYS · SAME 5 WEBS · SAME 91+ INVENTIONS · SAME DAVID AI
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 7: GENERATIONS TIMELINE
        ══════════════════════════════════════════════════════════════ */}
        <section className={`mb-20 transition-all duration-1000 delay-[600ms] ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-lg sm:text-xl tracking-[0.2em] text-center mb-2 font-bold">EVERY GENERATION. ONE GAME.</h2>
          <p className="text-center text-white/40 text-sm mb-8 max-w-xl mx-auto">
            Same game, same relays, same scoring — different entry point, different peer group.
          </p>
          <div className="max-w-md mx-auto mb-6">
            <ImageLightbox
              src={CDN.generationsTimeline}
              alt="The Generations — A Timeline"
              className="w-full rounded-lg border border-amber-400/20 hover:border-amber-400/40 transition-colors"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 8: SUPPORT THE MISSION — Registration + Backers
        ══════════════════════════════════════════════════════════════ */}
        <section ref={registerRef} className={`mb-20 transition-all duration-1000 delay-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-lg sm:text-xl tracking-[0.2em] text-center mb-2 font-bold">SUPPORT THE MISSION</h2>
          <p className="text-center text-white/40 text-sm mb-8 max-w-2xl mx-auto">
            Whether you want to play, teach, partner, or fund — register your interest below. 
            We're building the world's first lifelong infrastructure learning game and we need your support to scale.
          </p>

          {regSubmitted ? (
            <div className="max-w-lg mx-auto text-center rounded-xl p-8 border border-emerald-500/30" style={{ background: "linear-gradient(180deg, rgba(34,197,94,0.06) 0%, rgba(10,22,40,0.95) 100%)" }}>
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold tracking-wider mb-2">REGISTERED</h3>
              <p className="text-white/50 text-sm mb-4">Thank you for your interest in iGO. We'll be in touch.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/explore" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider rounded-lg transition-all">
                  <Gamepad2 className="w-4 h-4" /> PLAY NOW
                </Link>
                <button onClick={() => setRegSubmitted(false)} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white/50 font-bold text-xs tracking-wider rounded-lg hover:bg-white/10 transition-all">
                  REGISTER ANOTHER
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleRegister} className="rounded-xl p-6 sm:p-8 border border-amber-400/20" style={{ background: "linear-gradient(180deg, rgba(255,215,0,0.03) 0%, rgba(10,22,40,0.95) 100%)" }}>
                {/* Role selector */}
                <div className="mb-6">
                  <label className="text-white/50 text-xs font-mono tracking-wider mb-3 block">I AM A...</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SUPPORTER_ROLES.map(r => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setRegRole(r.key)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                          regRole === r.key
                            ? "bg-amber-400/15 border-amber-400/50 text-amber-300"
                            : "bg-transparent border-white/10 text-white/40 hover:border-white/25"
                        }`}
                      >
                        <r.icon className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold tracking-wider">{r.label}</div>
                          <div className="text-[9px] opacity-60">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-white/50 text-xs font-mono tracking-wider mb-1 block">NAME *</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors placeholder:text-white/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-mono tracking-wider mb-1 block">EMAIL *</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors placeholder:text-white/20"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Organisation (conditional) */}
                {(regRole === "institution" || regRole === "sponsor" || regRole === "educator") && (
                  <div className="mb-4">
                    <label className="text-white/50 text-xs font-mono tracking-wider mb-1 block">ORGANISATION</label>
                    <input
                      type="text"
                      value={regOrg}
                      onChange={e => setRegOrg(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors placeholder:text-white/20"
                      placeholder="University, company, or institution name"
                    />
                  </div>
                )}

                {/* Message */}
                <div className="mb-4">
                  <label className="text-white/50 text-xs font-mono tracking-wider mb-1 block">MESSAGE (OPTIONAL)</label>
                  <textarea
                    value={regMessage}
                    onChange={e => setRegMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors placeholder:text-white/20 resize-none"
                    placeholder="Tell us about your interest in iGO..."
                  />
                </div>

                {/* App pre-register toggle */}
                <div className="flex items-center gap-3 mb-6 p-3 rounded-lg border border-white/5" style={{ background: "rgba(255,215,0,0.02)" }}>
                  <button
                    type="button"
                    onClick={() => setRegAppPre(!regAppPre)}
                    className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 relative ${regAppPre ? "bg-emerald-500" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${regAppPre ? "left-5" : "left-1"}`} />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-amber-400/60" />
                      <span className="text-white/70 text-xs font-bold tracking-wider">PRE-REGISTER FOR iGO MOBILE APP</span>
                    </div>
                    <p className="text-white/30 text-[10px] mt-0.5">Get early access when the iGO app launches</p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm tracking-wider rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registerMutation.isPending ? "REGISTERING..." : "REGISTER MY INTEREST"}
                </button>

                {!user && (
                  <p className="text-center text-white/20 text-[10px] mt-3">
                    Already have an account? <a href={getLoginUrl()} className="text-amber-400/50 hover:text-amber-400 underline">Sign in</a> to auto-fill your details.
                  </p>
                )}
              </form>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 9: WHY BACK iGO — For Financial Supporters
        ══════════════════════════════════════════════════════════════ */}
        <section className={`mb-20 transition-all duration-1000 delay-[800ms] ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-lg sm:text-xl tracking-[0.2em] text-center mb-2 font-bold">WHY BACK iGO?</h2>
          <p className="text-center text-white/40 text-sm mb-8 max-w-2xl mx-auto">
            A proven concept. A working prototype. A clear path to scale.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle2, title: "PROOF OF CONCEPT LIVE", desc: "4 game modes (A–D) operational with real players. Full database, AI narration, XP scoring, leaderboards — all working." },
              { icon: Target, title: "TOTAL ADDRESSABLE MARKET", desc: "Every person aged 8–65+ who interacts with infrastructure. That's everyone. 12 entry points across 7 generations." },
              { icon: Sparkles, title: "UNIQUE IP", desc: "12 civilisational relays, 91+ inventions, 60-node Dearden Field, DAVID AI, 4 archetypes — no competitor has this architecture." },
              { icon: BookOpen, title: "ACADEMIC ALIGNMENT", desc: "Mapped to ABET, Washington Accord, AHEP4, UN SDGs. Ready for university integration from day one." },
              { icon: Shield, title: "GOVERNANCE IN PLACE", desc: "Tetrahedral Observer protocol, SAP-001 governance, full audit trail. Built for institutional trust." },
              { icon: Smartphone, title: "MOBILE APP ROADMAP", desc: "Web PoC proves the concept. Mobile app (AR-enabled for Modes G–L) is the scale vehicle. Pre-registration open now." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-5 border border-white/10 hover:border-amber-400/20 transition-all" style={{ background: "linear-gradient(180deg, rgba(10,22,40,0.8) 0%, rgba(5,5,16,0.95) 100%)" }}>
                <item.icon className="w-6 h-6 text-amber-400/70 mb-3" />
                <h3 className="text-white text-xs tracking-[0.15em] mb-2 font-bold">{item.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button onClick={scrollToRegister} className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-sm tracking-wider rounded-lg hover:bg-amber-500/30 transition-all">
              <HandCoins className="w-4 h-4" /> REGISTER AS A BACKER
            </button>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 10: PLAY ENTRY POINTS
        ══════════════════════════════════════════════════════════════ */}
        <section className={`mb-16 transition-all duration-1000 delay-[900ms] ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-lg tracking-[0.2em] text-center mb-6 font-bold">ENTER THE GAME</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link href="/explore" className="block rounded-xl p-6 border border-emerald-500/30 hover:border-emerald-400/60 transition-all text-center group" style={{ background: "linear-gradient(180deg, #0a2618 0%, #0a1628 100%)" }}>
              <Gamepad2 className="w-8 h-8 text-emerald-300 mx-auto mb-3 group-hover:text-emerald-200 transition-colors" />
              <div className="text-emerald-300 text-lg tracking-[0.15em] mb-2 group-hover:text-emerald-200 transition-colors font-bold">PLAY NOW</div>
              <p className="text-white/40 text-xs">Modes A–D are live. Explorer, Dungeon Crawl, Grey Matter, Flight Deck.</p>
              <p className="text-emerald-400/50 text-[9px] font-mono mt-2">PoC Beta — Ages 8–18</p>
            </Link>
            <button onClick={scrollToRegister} className="block rounded-xl p-6 border border-amber-500/20 hover:border-amber-400/50 transition-all text-center group" style={{ background: "linear-gradient(180deg, rgba(255,215,0,0.03) 0%, #0a1628 100%)" }}>
              <HandCoins className="w-8 h-8 text-amber-400/60 mx-auto mb-3 group-hover:text-amber-400 transition-colors" />
              <div className="text-amber-400/80 text-lg tracking-[0.15em] mb-2 group-hover:text-amber-400 transition-colors font-bold">BACK THE PROJECT</div>
              <p className="text-white/30 text-xs">Help us scale from PoC to global platform. Educators, institutions, sponsors welcome.</p>
              <p className="text-amber-400/40 text-[9px] font-mono mt-2">Register Interest — All Roles</p>
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="text-center pb-12">
          <p className="text-white/30 text-sm italic mb-1">
            Based on the trilogy by Nigel T. Dearden CEng CWEM
          </p>
          <p className="text-white/15 text-xs font-mono">
            Episode 1: Calories to Consciousness
          </p>
          <p className="text-orange-400/30 text-xs mt-2 tracking-wider font-mono">
            PoC BETA — All modes in test mode
          </p>
          <p className="text-amber-400/20 text-xs mt-4 tracking-[0.3em] font-bold">
            INFRASTRUCTURE ACADEMY · iAAi
          </p>
        </footer>
      </div>
    </div>
  );
}
