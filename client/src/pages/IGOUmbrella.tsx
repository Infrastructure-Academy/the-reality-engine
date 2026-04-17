import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { ImageLightbox } from "@/components/ImageLightbox";

// ─── 12 MODES A–L ───
const MODES = [
  { letter: "A", name: "Relay Spinner", ages: "8–10", episode: 1, status: "live", dice: "Spinner", color: "#22c55e", description: "First contact with infrastructure. Spin the relay wheel, discover the 12 civilisational relays through play. The spinner makes the first threads.", generation: "Gen Alpha / Gen Beta" },
  { letter: "B", name: "Dungeon Crawl", ages: "10–12", episode: 1, status: "live", dice: "D6", color: "#22c55e", description: "Narrative exploration through relay dungeons. DAVID guides the adventure. iCards collected, XP earned, discoveries mapped.", generation: "Gen Alpha / Gen Beta" },
  { letter: "C", name: "Grey Matter", ages: "12–14", episode: 1, status: "live", dice: "D8", color: "#22c55e", description: "Strategic thinking unlocked. Deeper relay analysis, biomimicry connections, cross-relay pattern recognition begins.", generation: "Gen Alpha / Gen Z" },
  { letter: "D", name: "Flight Deck", ages: "14–18", episode: 1, status: "live", dice: "D10/D12", color: "#22c55e", description: "Immersive cockpit HUD mode. Full relay missions, FITS team play, companion bots, advanced discovery mechanics.", generation: "Gen Z" },
  { letter: "E", name: "Scholar", ages: "18+", episode: 1, status: "designed", dice: "D20", color: "#ffd700", description: "Full AD&D RPG format. DAVID as Dungeon Master. Thesis-quality work, ISI scoring, complete 12-relay odyssey.", generation: "Gen Z / Millennials" },
  { letter: "F", name: "Academic", ages: "University", episode: 1, status: "designed", dice: "D20", color: "#ffd700", description: "Professor-supervised programme. R3 Panel assessment, ISI scoring, peer review. Aligned to ABET, Washington Accord, AHEP4.", generation: "Gen Z / Millennials" },
  { letter: "G", name: "Graduate", ages: "22–29", episode: 2, status: "aspirational", dice: "Professional", color: "#94a3b8", description: "Early career infrastructure professional. CPD-aligned relay missions, graduate scheme integration, mentored progression.", generation: "Millennials" },
  { letter: "H", name: "Chartered", ages: "30+", episode: 2, status: "aspirational", dice: "Professional", color: "#94a3b8", description: "Chartered engineer pathway. ICE/IStructE/CIHT alignment, professional review preparation, strategic infrastructure analysis.", generation: "Millennials / Gen X" },
  { letter: "I", name: "Senior Leader", ages: "40+", episode: 3, status: "aspirational", dice: "Professional", color: "#94a3b8", description: "Infrastructure leadership. Strategic planning, governance frameworks, cross-sector synthesis, policy-level engagement.", generation: "Gen X" },
  { letter: "J", name: "Industry Leader", ages: "50+", episode: 3, status: "aspirational", dice: "Professional", color: "#94a3b8", description: "Sector-shaping influence. Industry-wide perspective, legacy infrastructure stewardship, next-generation mentoring.", generation: "Gen X / Baby Boomers" },
  { letter: "K", name: "Industry Champion", ages: "60+", episode: 3, status: "aspirational", dice: "Professional", color: "#94a3b8", description: "Recognised industry authority. Lifetime achievement integration, cross-generational knowledge transfer, institutional memory.", generation: "Baby Boomers" },
  { letter: "L", name: "Master Class", ages: "65+", episode: 3, status: "aspirational", dice: "Professional", color: "#94a3b8", description: "The capstone. Craftsmanship earned through decades of practice. Master Weaver status — the guild tradition fulfilled.", generation: "Baby Boomers / Silent Generation" },
];

// ─── 3 EPISODES ───
const EPISODES = [
  { num: 1, name: "RELAY & REMEMBER", ages: "8–22", modes: "A–F", color: "#22c55e" },
  { num: 2, name: "EXPLORE FORWARD", ages: "22–50", modes: "G–H", color: "#3b82f6" },
  { num: 3, name: "BUILD FORWARD", ages: "40–65+", modes: "I–L", color: "#a855f7" },
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

// ─── GENERATIONAL MAP ───
const GENERATIONS = [
  { name: "Gen Beta", born: "2025–2039", modes: "A–B", color: "#22c55e" },
  { name: "Gen Alpha", born: "2013–2025", modes: "A–C", color: "#22c55e" },
  { name: "Gen Z", born: "1997–2012", modes: "C–F", color: "#3b82f6" },
  { name: "Millennials", born: "1981–1996", modes: "F–H", color: "#8b5cf6" },
  { name: "Gen X", born: "1965–1980", modes: "H–J", color: "#f59e0b" },
  { name: "Baby Boomers", born: "1946–1964", modes: "J–L", color: "#ef4444" },
  { name: "Silent Generation", born: "1928–1945", modes: "L", color: "#94a3b8" },
];

// ─── CDN IMAGES ───
const CDN = {
  masterGrid: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/iGO_Master_Grid_v3_2c433f65.png",
  generationsTimeline: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/icard_generations_timeline_a74f8d24.png",
  lifecyclePipeline: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/IMG_5369_750f301c.PNG",
};

export default function IGOUmbrella() {
  const [showContent, setShowContent] = useState(false);
  const [selectedMode, setSelectedMode] = useState<typeof MODES[0] | null>(null);
  const [filterEpisode, setFilterEpisode] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  const filteredModes = useMemo(() => {
    if (filterEpisode === null) return MODES;
    return MODES.filter(m => m.episode === filterEpisode);
  }, [filterEpisode]);

  const statusBadge = (status: string) => {
    if (status === "live") return <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PoC BETA LIVE</span>;
    if (status === "designed") return <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/30">PoC BETA DESIGNED</span>;
    return <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-sm bg-slate-500/20 text-slate-300 border border-slate-500/30">PoC BETA ASPIRATIONAL</span>;
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #050510 0%, #0a1628 10%, #0a1628 90%, #050510 100%)" }}>
      {/* ── HEADER NAV ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3" style={{ background: "linear-gradient(180deg, rgba(5,5,16,0.95) 0%, rgba(10,22,40,0.8) 100%)", backdropFilter: "blur(12px)" }}>
        <Link href="/explore" className="flex items-center gap-2 text-amber-400/70 hover:text-amber-400 transition-colors">
          <span className="text-lg">←</span>
          <span className="font-sans text-xs tracking-wider hidden sm:inline">EXPLORE</span>
        </Link>
        <div className="text-center">
          <span className="font-bold text-amber-400 text-sm tracking-[0.25em]">iGO</span>
          <span className="ml-2 px-2 py-0.5 bg-orange-500/15 border border-orange-500/40 text-orange-400 font-mono text-[8px] tracking-widest rounded-sm">PoC BETA</span>
        </div>
        <Link href="/" className="text-amber-400/50 hover:text-amber-400 font-sans text-xs tracking-wider transition-colors">
          HOME
        </Link>
      </div>

      <div className="pt-20 px-4 max-w-7xl mx-auto pb-24">
        {/* ── HERO ── */}
        <section className={`text-center mb-16 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="tracking-[0.4em] mb-3 font-bold" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", color: "#ffd700", textShadow: "0 0 60px rgba(255,215,0,0.3), 0 0 120px rgba(255,215,0,0.1)" }}>
            iGO
          </h1>
          <p className="text-white/80 tracking-[0.2em] text-lg sm:text-xl mb-2 font-semibold">
            ONE GAME. ALL AGES. 8–65+
          </p>
          <p className="text-white/50 italic text-base sm:text-lg max-w-2xl mx-auto mb-4">
            Where you go, iGO follows.
          </p>
          <p className="text-amber-400/50 text-xs tracking-[0.15em] uppercase font-mono">
            12 Relays &middot; 12 Formats &middot; One Game
          </p>

          {/* Master Grid Image */}
          <div className="mt-8 max-w-4xl mx-auto">
            <ImageLightbox
              src={CDN.masterGrid}
              alt="iGO Master Grid — 12 Formats A–L"
              className="w-full rounded-lg border border-amber-400/20 hover:border-amber-400/40 transition-colors"
            />
            <p className="text-white/25 text-[9px] font-mono mt-2 tracking-wider">B-ARCH-001 v5 — All modes PoC Beta</p>
          </div>
        </section>

        {/* ── LIFECYCLE PIPELINE ── */}
        <section className={`mb-16 transition-all duration-1000 delay-100 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-sm tracking-[0.2em] text-center mb-6 font-bold">HOW IT WORKS</h2>
          <div className="max-w-4xl mx-auto">
            <ImageLightbox
              src={CDN.lifecyclePipeline}
              alt="iGO Lifecycle Pipeline — 3-layer progression"
              className="w-full rounded-lg border border-white/10 hover:border-amber-400/30 transition-colors"
            />
          </div>
        </section>

        {/* ── EPISODE FILTER ── */}
        <section className={`mb-10 transition-all duration-1000 delay-200 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex flex-wrap justify-center gap-3 mb-2">
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
                <span className="ml-2 text-white/20 text-[10px]">({ep.modes})</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── 12 MODE GRID ── */}
        <section className={`mb-16 transition-all duration-1000 delay-300 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-sm tracking-[0.2em] text-center mb-6 font-bold">THE 12 GAME FORMATS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredModes.map(mode => {
              const isLive = mode.status === "live";
              return (
                <div
                  key={mode.letter}
                  className={`relative rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer group ${
                    isLive
                      ? "border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                      : mode.status === "designed"
                      ? "border-amber-500/20 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                      : "border-white/10 hover:border-white/25"
                  }`}
                  style={{ background: "linear-gradient(180deg, rgba(10,22,40,0.9) 0%, rgba(5,5,16,0.95) 100%)" }}
                  onClick={() => setSelectedMode(selectedMode?.letter === mode.letter ? null : mode)}
                >
                  {/* Mode letter badge */}
                  <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${mode.color}20`, color: mode.color, border: `1px solid ${mode.color}40` }}>
                    {mode.letter}
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3 z-10">
                    {statusBadge(mode.status)}
                  </div>

                  <div className="pt-14 px-4 pb-4">
                    <h3 className="text-white text-base tracking-[0.1em] mb-1 font-bold">{mode.name}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-white/40 text-xs font-mono">Ages {mode.ages}</span>
                      <span className="text-white/20">|</span>
                      <span className="text-white/40 text-xs font-mono">{mode.dice}</span>
                      <span className="text-white/20">|</span>
                      <span className="text-xs font-mono" style={{ color: EPISODES[mode.episode - 1].color + "90" }}>EP.{mode.episode}</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{mode.description}</p>

                    {/* Expanded detail on click */}
                    {selectedMode?.letter === mode.letter && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white/30 text-[10px] font-mono">COMMUNITY:</span>
                          <span className="text-amber-400/70 text-xs">{mode.generation}</span>
                        </div>
                        {isLive ? (
                          <Link href="/explore" className="inline-block mt-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-emerald-300 text-xs font-bold tracking-wider hover:bg-emerald-500/30 transition-colors">
                            PLAY NOW
                          </Link>
                        ) : (
                          <span className="inline-block mt-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded text-white/30 text-xs font-bold tracking-wider">
                            COMING SOON
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── GENERATIONAL COMMUNITY MAP ── */}
        <section className={`mb-16 transition-all duration-1000 delay-[400ms] ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-sm tracking-[0.2em] text-center mb-2 font-bold">FIND YOUR COMMUNITY</h2>
          <p className="text-center text-white/40 text-xs mb-6 max-w-xl mx-auto">
            Same game, same relays, same scoring — different entry point, different peer group. Just like the 8 language blocks: one game, many communities.
          </p>

          <div className="max-w-3xl mx-auto">
            {/* Generations Timeline iCard */}
            <div className="mb-8 flex justify-center">
              <ImageLightbox
                src={CDN.generationsTimeline}
                alt="The Generations — A Timeline (Block 365)"
                className="max-w-xs rounded-lg border border-amber-400/20 hover:border-amber-400/40 transition-colors"
              />
            </div>

            {/* Generation → Mode mapping */}
            <div className="space-y-2">
              {GENERATIONS.map(gen => (
                <div key={gen.name} className="flex items-center gap-4 px-4 py-3 rounded-lg border border-white/5 hover:border-white/15 transition-colors" style={{ background: "rgba(10,22,40,0.6)" }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: gen.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-white text-sm tracking-wider font-bold">{gen.name}</span>
                    <span className="text-white/30 text-xs ml-2 font-mono">({gen.born})</span>
                  </div>
                  <div className="flex-shrink-0 px-3 py-1 rounded bg-white/5 border border-white/10">
                    <span className="text-amber-400/80 text-xs font-mono tracking-wider">Modes {gen.modes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE THREE EPISODES ── */}
        <section className={`mb-16 transition-all duration-1000 delay-500 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-sm tracking-[0.2em] text-center mb-6 font-bold">THE THREE EPISODES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {EPISODES.map(ep => (
              <div key={ep.num} className="rounded-lg p-5 border border-white/10 text-center" style={{ background: `linear-gradient(180deg, ${ep.color}08 0%, rgba(5,5,16,0.95) 100%)` }}>
                <div className="text-3xl mb-2 font-bold" style={{ color: ep.color }}>EP.{ep.num}</div>
                <h3 className="text-white text-sm tracking-[0.15em] mb-2 font-bold">{ep.name}</h3>
                <p className="text-white/40 text-xs font-mono mb-1">Ages {ep.ages}</p>
                <p className="text-white/30 text-xs font-mono">Modes {ep.modes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── EXHIBITION GALLERY ── */}
        <section className={`mb-16 transition-all duration-1000 delay-[600ms] ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-sm tracking-[0.2em] text-center mb-2 font-bold">THE REALITY ENGINE EXHIBITION</h2>
          <p className="text-center text-white/40 text-xs mb-6">13 Immersive Halls — The Physical Manifestation of iGO</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {HALLS.map(hall => (
              <div key={hall.num} className="rounded-lg overflow-hidden border border-white/10 hover:border-amber-400/30 transition-all cursor-pointer group">
                <ImageLightbox
                  src={hall.img}
                  alt={`Hall ${hall.num}: ${hall.relay}`}
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="p-2" style={{ background: "rgba(5,5,16,0.95)" }}>
                  <p className="text-amber-400 text-[9px] font-mono tracking-wider">HALL {hall.num}</p>
                  <p className="text-white text-xs font-bold tracking-wider">{hall.relay.toUpperCase()}</p>
                  <p className="text-white/40 text-[8px] font-mono">{hall.era}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── THE FOUNDATION ── */}
        <section className={`mb-16 transition-all duration-1000 delay-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="max-w-3xl mx-auto text-center rounded-lg p-8 border border-amber-400/20" style={{ background: "linear-gradient(180deg, rgba(255,215,0,0.03) 0%, rgba(10,22,40,0.9) 100%)" }}>
            <h2 className="text-amber-400 text-sm tracking-[0.2em] mb-4 font-bold">THE PERMANENT FOUNDATION</h2>
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
            <p className="text-white/50 text-xs leading-relaxed max-w-xl mx-auto mb-4">
              Every mode — from Relay Spinner (age 8) to Master Class (age 65+) — traverses the same 12 civilisational relays, the same 5 Great Webs, and the same 60-node Dearden Field. The content deepens. The architecture never changes.
            </p>
            <p className="text-amber-400/60 text-xs font-bold tracking-[0.15em]">
              SAME 12 RELAYS &middot; SAME 5 WEBS &middot; SAME 91+ INVENTIONS &middot; SAME DAVID AI
            </p>
          </div>
        </section>

        {/* ── PLAY ENTRY POINTS ── */}
        <section className={`mb-16 transition-all duration-1000 delay-[800ms] ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-amber-400 text-sm tracking-[0.2em] text-center mb-6 font-bold">ENTER THE GAME</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link href="/explore" className="block rounded-lg p-6 border border-emerald-500/30 hover:border-emerald-400/60 transition-all text-center group" style={{ background: "linear-gradient(180deg, #0a2618 0%, #0a1628 100%)" }}>
              <div className="text-emerald-300 text-lg tracking-[0.15em] mb-2 group-hover:text-emerald-200 transition-colors font-bold">PLAY NOW</div>
              <p className="text-white/40 text-xs">Modes A–D are live. Explorer, Dungeon Crawl, Grey Matter, Flight Deck.</p>
              <p className="text-emerald-400/50 text-[9px] font-mono mt-2">PoC Beta — Ages 8–18</p>
            </Link>
            <div className="rounded-lg p-6 border border-white/10 text-center" style={{ background: "linear-gradient(180deg, rgba(10,22,40,0.9) 0%, rgba(5,5,16,0.95) 100%)" }}>
              <div className="text-white/40 text-lg tracking-[0.15em] mb-2 font-bold">MODES E–L</div>
              <p className="text-white/30 text-xs">Scholar, Academic, Graduate, Chartered, Senior Leader, Industry Leader, Industry Champion, Master Class.</p>
              <p className="text-amber-400/40 text-[9px] font-mono mt-2">Coming Soon — PoC Beta</p>
            </div>
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
            INFRASTRUCTURE ACADEMY &middot; iAAi
          </p>
        </footer>
      </div>
    </div>
  );
}
