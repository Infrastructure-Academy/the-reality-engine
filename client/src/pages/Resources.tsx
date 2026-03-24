import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, BookOpen, Shield, Scroll, Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ResourceDoc {
  id: string;
  title: string;
  subtitle: string;
  version: string;
  block: string;
  category: "handbook" | "design" | "protocol" | "paper";
  icon: typeof FileText;
  color: string;
  description: string;
  sections: string[];
  status: "ACTIVE" | "LOCKED" | "DRAFT";
  pdfUrl?: string;
}

const DOCUMENTS: ResourceDoc[] = [
  {
    id: "junior-handbook",
    title: "Junior Player's Handbook",
    subtitle: "The Basic Set — Ages 8–14",
    version: "v1.1",
    block: "B400",
    category: "handbook",
    icon: BookOpen,
    color: "#eab308",
    description: "Your guide to the 12 Civilisational Relays, five Great Webs, four game modes, and the mission to push the clock back from midnight.",
    sections: ["12 Relays", "5 Great Webs", "4 Explorer Modes", "XP & BitPoints", "DAVID AI Guide", "FITS Preview", "MPNC Fleet", "iCards"],
    status: "ACTIVE",
    pdfUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/Junior-Players-Handbook-v1.1_4426768e.pdf",
  },
  {
    id: "advanced-handbook",
    title: "Advanced Player's Handbook",
    subtitle: "Flight Deck & Scholar — Ages 14+",
    version: "v1.0",
    block: "B401",
    category: "handbook",
    icon: BookOpen,
    color: "#3b82f6",
    description: "The complete guide to the Flight Deck cockpit, Scholar mode, full 6 ability scores, FITS temperament, Dearden Field, thesis writing, and academic assessment.",
    sections: ["Flight Deck HUD", "Dearden Field", "MPNC Fleet", "6 Ability Scores", "FITS Temperament", "Scholar Mode", "Thesis Writing", "Academic Grading"],
    status: "ACTIVE",
    pdfUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/Advanced-Players-Handbook-v1.0_39238d09.pdf",
  },
  {
    id: "game-design-params",
    title: "Game Design Parameters",
    subtitle: "The Complete Design Bible",
    version: "v2.0",
    block: "B401",
    category: "design",
    icon: Scroll,
    color: "#a855f7",
    description: "Architecture, philosophy, reward mechanics, content structure, engagement systems, and implementation decisions for the world's first AI-guided infrastructure education platform. v2.0 adds Engagement Layer, Appraisal System, and Inspector Feedback Response.",
    sections: ["Design Philosophy", "Content Architecture", "Player Progression", "FITS System", "MPNC Fleet", "Ability Scores", "Dearden Field", "DAVID AI", "Visual & Audio Design", "Engagement Layer", "Platform Architecture", "Design Decisions Log", "Appraisal System", "Inspector Feedback Response"],
    status: "ACTIVE",
    pdfUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/Game-Design-Parameters-v2.0_119ba6da.pdf",
  },
  {
    id: "tp-016",
    title: "TP-016 — ISI Complete Record",
    subtitle: "Infrastructure Significance Index",
    version: "v1.0",
    block: "B398",
    category: "paper",
    icon: FileText,
    color: "#22c55e",
    description: "The complete record of the Infrastructure Significance Index — Sustainability, Survival, and $ignificance across 12 Civilisational Relays. Includes the Survival Formula, Human Blip, and Mobilisation Clock.",
    sections: ["ISI Triple Index", "Elemental Clock", "Human Blip", "Survival Formula", "Harrison's 4-Grid", "2.58% Counterweight", "1 Billion Target", "Mobilisation Clock"],
    status: "LOCKED",
  },
  {
    id: "tp-017",
    title: "TP-017 — Explorer Mode Options",
    subtitle: "Three Sub-Modes for Ages 8–14",
    version: "v1.0",
    block: "B399",
    category: "paper",
    icon: FileText,
    color: "#0891b2",
    description: "Research-backed proposal for three Explorer sub-modes: Relay Spinner (one-armed bandit), Dungeon Crawl (Basic D&D), and Power of Grey Matter (He-Man transformation).",
    sections: ["Mode A: Relay Spinner", "Mode B: Dungeon Crawl", "Mode C: Grey Matter", "Reward Mechanics", "ISI Connection", "Implementation Architecture"],
    status: "LOCKED",
  },
  {
    id: "sap-001",
    title: "SAP-001 — System Assurance Protocol",
    subtitle: "Rail Possession Logic for Man + Machine",
    version: "v1.0",
    block: "B353",
    category: "protocol",
    icon: Shield,
    color: "#ef4444",
    description: "Five-phase protocol governing the handover between human authority (Nigel Zone) and AI execution (DAVID Zone). Based on rail possession logic.",
    sections: ["Take Possession", "Confirm Authority", "Execute Works", "Test Before Handback", "Hand Back the Line"],
    status: "LOCKED",
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  handbook: { label: "HANDBOOK", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  design: { label: "DESIGN BIBLE", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  paper: { label: "TURING PAPER", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  protocol: { label: "PROTOCOL", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
  LOCKED: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  DRAFT: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function Resources() {
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
            <h1 className="font-heading text-gold text-sm md:text-base tracking-wider">RESOURCES</h1>
            <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">BETA</span>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl mx-auto space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">An Infrastructure Odyssey — Episode 1: Calories to Consciousness</p>
          <h2 className="font-heading text-3xl md:text-4xl text-gold-gradient">Document Library</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            The complete collection of handbooks, design documents, Turing Papers, and governance protocols
            that define The Reality Engine. Three volumes — Perspective, Guide, and Game — one mission.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="text-center">
            <p className="font-heading text-gold text-lg">{DOCUMENTS.length}</p>
            <p className="text-[10px] text-muted-foreground tracking-wider">DOCUMENTS</p>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="text-center">
            <p className="font-heading text-cyan-400 text-lg">{DOCUMENTS.filter(d => d.status === "LOCKED").length}</p>
            <p className="text-[10px] text-muted-foreground tracking-wider">LOCKED</p>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="text-center">
            <p className="font-heading text-green-400 text-lg">{DOCUMENTS.filter(d => d.status === "ACTIVE").length}</p>
            <p className="text-[10px] text-muted-foreground tracking-wider">ACTIVE</p>
          </div>
        </div>

        {/* Document Cards */}
        <div className="space-y-4">
          {DOCUMENTS.map((doc, i) => {
            const Icon = doc.icon;
            const cat = CATEGORY_LABELS[doc.category];
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-gold/30 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${doc.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: doc.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-heading text-foreground text-base">{doc.title}</h3>
                        <span className="text-[10px] font-mono text-muted-foreground/60">{doc.version}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${cat.color}`}>{cat.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${STATUS_COLORS[doc.status]}`}>{doc.status}</span>
                      </div>
                      <p className="text-xs text-gold-dim mb-2">{doc.subtitle}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{doc.description}</p>

                      {/* Section Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {doc.sections.map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border/50 text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Download + Block Reference */}
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-[10px] font-mono text-muted-foreground/50">{doc.block} — DIAMOND Classification</p>
                        {doc.pdfUrl && (
                          <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button variant="outline" size="sm" className="gap-1.5 text-[10px] h-7 border-gold/30 text-gold hover:bg-gold/10">
                              <Download className="w-3 h-3" /> Download PDF
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Three Volumes Context */}
        <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
          <h4 className="font-heading text-gold text-sm text-center">BOOK 1 — EPISODE 1: CALORIES TO CONSCIOUSNESS</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-center">
              <p className="font-heading text-amber-400 text-sm">THE PERSPECTIVE</p>
              <p className="text-xs text-muted-foreground mt-1">Part 1 (A & B)</p>
              <p className="text-[10px] text-foreground/60 mt-2">Narrative foundation — the story of 12,000 years</p>
            </div>
            <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-center">
              <p className="font-heading text-blue-400 text-sm">THE GUIDE</p>
              <p className="text-xs text-muted-foreground mt-1">Part 2 (A, B & C)</p>
              <p className="text-[10px] text-foreground/60 mt-2">4-Pillar Framework — Observational → Educational → Application → Thesis</p>
            </div>
            <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-center">
              <p className="font-heading text-green-400 text-sm">THE GAME</p>
              <p className="text-xs text-muted-foreground mt-1">Part 3 — The Reality Engine</p>
              <p className="text-[10px] text-foreground/60 mt-2">Interactive platform — Explorer, Flight Deck, Scholar</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/governance">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Shield className="w-3 h-3" /> Governance Deck
            </Button>
          </Link>
          <Link href="/frameworks">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <FileText className="w-3 h-3" /> Frameworks
            </Button>
          </Link>
          <Link href="/media">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <ExternalLink className="w-3 h-3" /> Media Catalogue
            </Button>
          </Link>
          <Link href="/bridges">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <ExternalLink className="w-3 h-3" /> Bridge Hub
            </Button>
          </Link>
        </div>

        <p className="text-center text-muted-foreground text-xs italic">
          "The line is not safe until the system is tested." — iAAi Block 353
        </p>
      </main>
    </div>
  );
}
