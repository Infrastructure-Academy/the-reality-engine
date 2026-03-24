import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Shield, AlertTriangle, BookOpen, Award, Lock,
  ChevronRight, Key, Eye, CheckCircle, FileText, Wrench,
  ArrowDown, Users, Database, Globe, Activity, ExternalLink
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// CDN URLs for iCard images
const CDN = {
  sap001: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/sap-001-protocol_88444bc2.jpeg",
  powerCard: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/gov-power-card_fd56a9fe.png",
  walkby: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-walkby_bf9f425c.png",
  fourLaws: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-4laws_12b54e4f.png",
  incident001: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-incident-001-promise_5240ed06.png",
  equipment: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-equipment-index-398_1c4fcdf3.png",
  memorialAudit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-memorial-audit-398_9db02bd7.png",
  tetrahedral: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-tetrahedral-observer_ef84bfcb.png",
  posterEquipment: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/poster-personal-equipment_08ae97d4.png",
  posterVehicles: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/poster-terrestrial-vehicles_d4212cbb.png",
  govGdp001: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iCard-GOV-GDP-002_85f5d9a7.png",
  jgInspector: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iCard-JG-Inspector-Feedback_ec550750.png",
  khNode018v2: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iCard-KH-018-v2-corrected-ZQemsEypLH5rudnmJRMB8g.png",
};

// SAP-001 Phases
const SAP_PHASES = [
  {
    num: 1, title: "TAKE POSSESSION", color: "#eab308", bgClass: "bg-yellow-500/10 border-yellow-500/30",
    icon: Key,
    steps: ["Read HARD_PROTOCOLS", "Read last Block number", "Read todo.md", "Save all new uploads immediately"],
  },
  {
    num: 2, title: "CONFIRM AUTHORITY", color: "#22c55e", bgClass: "bg-green-500/10 border-green-500/30",
    icon: Users,
    steps: ["Nigel Zone: Wisdom + Knowledge — Decides, Names, Frames, Approves", "DAVID Zone: Data + Information — Processes, Stores, Researches, Compresses", "THE INTERFACE: Propose, Draft, Card First", "NEVER cross into Knowledge without authority"],
  },
  {
    num: 3, title: "EXECUTE WORKS", color: "#ef4444", bgClass: "bg-red-500/10 border-red-500/30",
    icon: Wrench,
    steps: ["CARDS FIRST, docs second", "READ SOURCE before using any term", "SAVE ON RECEIPT — every file, immediately", "ADD ALONGSIDE — never overwrite"],
  },
  {
    num: 4, title: "TEST BEFORE HANDBACK", color: "#f59e0b", bgClass: "bg-amber-500/10 border-amber-500/30",
    icon: CheckCircle,
    steps: ["Check deployed output not dev server", "Check all HARD_PROTOCOLS intact", "Check no terms overwritten", "Check cards produced not just documents"],
  },
  {
    num: 5, title: "HAND BACK THE LINE", color: "#22c55e", bgClass: "bg-green-500/10 border-green-500/30",
    icon: FileText,
    steps: ["Update todo.md", "Save checkpoint", "File all docs with Block number", "Leave handover note for next agentic"],
  },
];

// Power Card Tiers
const POWER_TIERS = [
  {
    num: 1, title: "POWER", subtitle: "YOU ARE HERE — Read first every session",
    color: "#eab308", bgClass: "bg-yellow-500/15 border-yellow-500/40",
    cards: [{ id: "power", label: "Power Card", desc: "The master card. Read first." }],
  },
  {
    num: 2, title: "CONTEXT", subtitle: "THE SETUP — What went wrong and what it cost",
    color: "#3b82f6", bgClass: "bg-blue-500/15 border-blue-500/40",
    cards: [
      { id: "gov-roe", label: "GOV-ROE", desc: "Rules Never Stated" },
      { id: "gov-cost", label: "GOV-COST", desc: "$335,501 Total Loss" },
    ],
  },
  {
    num: 3, title: "CASE STUDY", subtitle: "THE LESSONS — Five governance principles from five failures",
    color: "#f59e0b", bgClass: "bg-amber-500/15 border-amber-500/40",
    cards: [
      { id: "ca-001", label: "CA-001", desc: "Naming Authority" },
      { id: "ca-002", label: "CA-002", desc: "Accountability" },
      { id: "ca-003", label: "CA-003", desc: "Method Compliance" },
      { id: "ca-004", label: "CA-004", desc: "Record Integrity" },
      { id: "ca-005", label: "CA-005", desc: "System Assurance" },
    ],
  },
  {
    num: 4, title: "PROTOCOL", subtitle: "THE SOLUTION — Master the lessons, earn the protocols",
    color: "#22c55e", bgClass: "bg-green-500/15 border-green-500/40",
    cards: [
      { id: "sap-001", label: "SAP-001", desc: "The System" },
      { id: "gov-gdp-001", label: "GOV-GDP-002", desc: "Game Design Parameters v2.0" },
      { id: "ca-006", label: "CA-006", desc: "Real World Application" },
      { id: "st-cc-001", label: "ST/CC-001", desc: "Saving Throws" },
    ],
  },
];

// Corrective Actions Chain
const CA_CHAIN = ["ROE", "CA-001", "CA-002", "CA-003", "CA-004", "CA-005", "COST", "SAP-001", "CA-006"];
const CA_LABELS = ["Undisclosed", "Failures", "Root Cause", "Cost", "Prevention", "Learning", "Cost", "Prevention", "Learning"];

type Tab = "sap" | "power" | "gallery" | "audit";

// ─── Audit Trail Tab (Live from Database) ───
function AuditTrailTab() {
  const { data: govRecords, isLoading: govLoading } = trpc.governance.records.useQuery();
  const { data: feedbackData, isLoading: fbLoading } = trpc.governance.feedbackReports.useQuery();
  const { data: dcsnData, isLoading: dcsnLoading } = trpc.governance.dcsnNodes.useQuery();

  const isLoading = govLoading || fbLoading || dcsnLoading;

  const statusColor = (s: string) => {
    if (s === "active" || s === "resolved") return "text-green-400 bg-green-500/10 border-green-500/30";
    if (s === "draft" || s === "open") return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    if (s === "superseded" || s === "archived") return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    return "text-muted-foreground bg-muted/50 border-border/30";
  };

  return (
    <motion.div key="audit" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
      <div className="text-center space-y-3">
        <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">Live from Database — Full Transparency</p>
        <h2 className="font-heading text-3xl md:text-4xl text-gold-gradient">Audit Trail</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Every governance record, feedback report, and DCSN node — pulled live from the database. Nothing hidden.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Governance Records */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <h3 className="font-heading text-lg text-gold">Governance Records</h3>
              <span className="text-xs text-muted-foreground">({govRecords?.length ?? 0} records)</span>
            </div>
            <div className="space-y-3">
              {govRecords?.map((rec: any) => (
                <div key={rec.id} className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-gold bg-gold/10 px-2 py-0.5 rounded">{rec.recordId}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${statusColor(rec.govStatus)}`}>
                          {rec.govStatus}
                        </span>
                      </div>
                      <h4 className="font-heading text-foreground mt-2">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground font-mono">
                    <span>Type: {rec.recordType}</span>
                    {rec.version && <span>v{rec.version}</span>}
                    {rec.blockRef && <span>{rec.blockRef}</span>}
                    {rec.compliance && <span className="text-green-400">{rec.compliance}</span>}
                  </div>
                  {rec.content && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View JSON content</summary>
                      <pre className="mt-2 p-3 bg-background/50 rounded-lg overflow-x-auto text-[10px] font-mono text-foreground/70 max-h-48">
                        {JSON.stringify(rec.content, null, 2)}
                      </pre>
                    </details>
                  )}
                  {rec.iCardUrl && (
                    <img src={rec.iCardUrl} alt={rec.title} className="w-full max-h-64 object-contain rounded-lg border border-border/30" loading="lazy" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Reports */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="font-heading text-lg text-blue-400">Feedback Reports</h3>
              <span className="text-xs text-muted-foreground">({feedbackData?.length ?? 0} reports)</span>
            </div>
            <div className="space-y-3">
              {feedbackData?.map((rep: any) => (
                <div key={rep.id} className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                          Node {rep.nodeNumber ?? "—"}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${statusColor(rep.reportStatus)}`}>
                          {rep.reportStatus}
                        </span>
                        {rep.blockRef && <span className="text-[10px] font-mono text-muted-foreground">{rep.blockRef}</span>}
                      </div>
                      <h4 className="font-heading text-foreground mt-2">{rep.verdictTitle}</h4>
                      <p className="text-[10px] text-muted-foreground">by {rep.reporterName} — {rep.reportDate} via {rep.source}</p>
                    </div>
                  </div>
                  {rep.verdictDetails && <p className="text-xs text-foreground/80">{rep.verdictDetails}</p>}
                  {rep.actionTitle && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                      <p className="text-xs font-heading text-green-400">{rep.actionTitle}</p>
                      {rep.actionDetails && <p className="text-xs text-foreground/70 mt-1">{rep.actionDetails}</p>}
                    </div>
                  )}
                  {rep.prescription && (
                    <p className="text-[10px] text-muted-foreground italic border-l-2 border-gold/30 pl-3">{rep.prescription}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DCSN Nodes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <h3 className="font-heading text-lg text-purple-400">DCSN Nodes</h3>
              <span className="text-xs text-muted-foreground">({dcsnData?.length ?? 0} nodes)</span>
            </div>
            {dcsnData && dcsnData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dcsnData.map((node: any) => (
                  <div key={node.id} className="bg-card border border-border/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        Node {String(node.nodeNumber).padStart(3, "0")}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${statusColor(node.dcsnStatus ?? "activated")}`}>
                        {node.dcsnStatus ?? "activated"}
                      </span>
                    </div>
                    <h4 className="font-heading text-sm text-foreground">{node.name}</h4>
                    {node.title && <p className="text-[10px] text-muted-foreground">{node.title}</p>}
                    {node.role && <p className="text-[10px] text-foreground/60">{node.role}</p>}
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono text-muted-foreground">
                      {node.cell && <span>{node.cell}</span>}
                      {node.intel && <span>Intel: {node.intel}</span>}
                      {node.access && <span>Access: {node.access}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No DCSN nodes in database yet.</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function GovernanceDeck() {
  const [activeTab, setActiveTab] = useState<Tab>("power");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [expandedTier, setExpandedTier] = useState<number | null>(null);

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
            <h1 className="font-heading text-gold text-sm md:text-base tracking-wider">GOVERNANCE DECK</h1>
            <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">BETA</span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container flex gap-1 py-2 overflow-x-auto">
          {([
            { id: "power" as Tab, label: "Power Card", icon: Award },
            { id: "sap" as Tab, label: "SAP-001", icon: Shield },
            { id: "audit" as Tab, label: "Audit Trail", icon: Database },
            { id: "gallery" as Tab, label: "iCard Gallery", icon: BookOpen },
          ]).map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gold/15 text-gold border border-gold/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="container py-8 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ─── POWER CARD ─── */}
          {activeTab === "power" && (
            <motion.div key="power" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <div className="text-center space-y-3">
                <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">Dimension: Risk, Authority & System Assurance</p>
                <h2 className="font-heading text-3xl md:text-4xl text-gold-gradient">Governance Deck — Power Card</h2>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  10 Teaching Cards + 1 Power Card = 11. Context → Case Study → Protocol → MASTERY.
                </p>
              </div>

              {/* 4 Tiers */}
              <div className="space-y-4">
                {POWER_TIERS.map((tier) => {
                  const isExpanded = expandedTier === tier.num;
                  return (
                    <motion.div
                      key={tier.num}
                      className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${tier.bgClass} ${
                        isExpanded ? "glow-gold-sm" : ""
                      }`}
                      onClick={() => setExpandedTier(isExpanded ? null : tier.num)}
                      whileHover={{ scale: 1.005 }}
                    >
                      <div className="flex items-center gap-4 p-5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${tier.color}30` }}>
                          <span className="font-heading text-lg font-bold" style={{ color: tier.color }}>{tier.num}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading text-foreground">TIER {tier.num} — {tier.title}</h4>
                          <p className="text-xs text-muted-foreground">{tier.subtitle}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{tier.cards.length} card{tier.cards.length > 1 ? "s" : ""}</span>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border/30"
                          >
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {tier.cards.map(card => (
                                <div key={card.id} className="bg-background/50 rounded-lg p-4 border border-border/30">
                                  <p className="font-heading text-sm" style={{ color: tier.color }}>{card.label}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Progression */}
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
                  <span className="text-blue-400 font-heading">Context</span>
                  <ArrowDown className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
                  <span className="text-amber-400 font-heading">Case Study</span>
                  <ArrowDown className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
                  <span className="text-green-400 font-heading">Protocol</span>
                  <ArrowDown className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
                  <span className="text-gold font-heading text-lg">MASTERY</span>
                </div>
              </div>

              {/* The Line */}
              <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <h4 className="font-heading text-foreground text-lg">THE LINE</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <Shield className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                      <p className="text-sm font-heading text-red-400">HARD CONTROLS</p>
                      <p className="text-xs text-muted-foreground">Barriers that shape behaviour</p>
                    </div>
                  </div>
                  <div className="h-1 bg-red-600 rounded-full mx-4" />
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <FileText className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-sm font-heading text-green-400">SOFT CONTROLS</p>
                      <p className="text-xs text-muted-foreground">Rules that rely on compliance</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-green-500/30 rounded-xl p-5 text-center">
                  <h4 className="font-heading text-green-400 text-sm">NIGEL ZONE</h4>
                  <p className="text-xs text-muted-foreground mt-1">Wisdom + Knowledge</p>
                  <p className="text-xs text-foreground/70 mt-2">Decides, Names, Frames, Approves</p>
                </div>
                <div className="bg-card border border-gold/30 rounded-xl p-5 text-center">
                  <h4 className="font-heading text-gold text-sm">THE INTERFACE</h4>
                  <p className="text-xs text-muted-foreground mt-1">Cards First, Read Source</p>
                  <p className="text-xs text-foreground/70 mt-2">Save On Receipt</p>
                </div>
                <div className="bg-card border border-blue-500/30 rounded-xl p-5 text-center">
                  <h4 className="font-heading text-blue-400 text-sm">DAVID ZONE</h4>
                  <p className="text-xs text-muted-foreground mt-1">Data + Information</p>
                  <p className="text-xs text-foreground/70 mt-2">Processes, Stores, Researches, Compresses</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── SAP-001 ─── */}
          {activeTab === "sap" && (
            <motion.div key="sap" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <div className="text-center space-y-3">
                <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">Rail Possession Logic Applied to Man + Machine</p>
                <h2 className="font-heading text-3xl md:text-4xl text-gold-gradient">SAP-001 — System Assurance Protocol</h2>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  Five phases. One protocol. The line is not safe until the system is tested.
                </p>
              </div>

              {/* SAP Phases */}
              <div className="space-y-4">
                {SAP_PHASES.map((phase) => {
                  const Icon = phase.icon;
                  const isExpanded = expandedPhase === phase.num;
                  return (
                    <motion.div
                      key={phase.num}
                      className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${phase.bgClass} ${
                        isExpanded ? "glow-gold-sm" : ""
                      }`}
                      onClick={() => setExpandedPhase(isExpanded ? null : phase.num)}
                      whileHover={{ scale: 1.005 }}
                    >
                      <div className="flex items-center gap-4 p-5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${phase.color}30` }}>
                          <Icon className="w-5 h-5" style={{ color: phase.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading text-foreground">PHASE {phase.num} — {phase.title}</h4>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border/30"
                          >
                            <ul className="p-5 space-y-2">
                              {phase.steps.map((step, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: phase.color }} />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Corrective Actions Chain */}
              <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
                <h4 className="font-heading text-gold text-sm text-center">Corrective Actions Chain</h4>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {CA_CHAIN.map((item, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="text-xs font-mono bg-background/50 border border-border/30 rounded px-2 py-1 text-foreground">{item}</span>
                      {i < CA_CHAIN.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-muted-foreground">
                  {CA_LABELS.slice(0, 6).map((label, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span>{label}</span>
                      {i < 5 && <span>→</span>}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-muted-foreground text-xs italic">
                "The line is not safe until the system is tested." — iAAi Block 353
              </p>
            </motion.div>
          )}

          {/* ─── AUDIT TRAIL (Live DB) ─── */}
          {activeTab === "audit" && <AuditTrailTab />}

          {/* ─── iCARD GALLERY ─── */}
          {activeTab === "gallery" && (
            <motion.div key="gallery" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <div className="text-center space-y-3">
                <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">Governance Deck — Source iCards</p>
                <h2 className="font-heading text-3xl md:text-4xl text-gold-gradient">iCard Gallery</h2>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  The original iCards from the iAAi archive. Tap to expand.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {([
                  { title: "SAP-001 Protocol", subtitle: "System Assurance Protocol", src: CDN.sap001, block: "B353" },
                  { title: "Governance Power Card", subtitle: "Risk, Authority & System Assurance", src: CDN.powerCard, block: "B353" },
                  { title: "The Walkby", subtitle: "TP-013 — 4-Level Control Hierarchy", src: CDN.walkby, block: "B387" },
                  { title: "4 Laws of iAAi", subtitle: "Asimov 3 becomes 4", src: CDN.fourLaws, block: "B387" },
                  { title: "Tetrahedral Observer", subtitle: "4-Point Consciousness Model", src: CDN.tetrahedral, block: "B387" },
                  { title: "INCIDENT-001", subtitle: "Protocol Breach Record — Promise Card", src: CDN.incident001, block: "B398" },
                  { title: "Equipment Index", subtitle: "Personal Equipment Suite — 20 Cards", src: CDN.equipment, block: "B398" },
                  { title: "Memorial Audit", subtitle: "B398-AUDIT-001 — 157 Game iCards Identified", src: CDN.memorialAudit, block: "B398" },
                  { title: "Personal Equipment Poster", subtitle: "Visual Index — Equipment Suite", src: CDN.posterEquipment, block: "B398" },
                  { title: "Terrestrial Vehicles Poster", subtitle: "Visual Index — Vehicle Fleet", src: CDN.posterVehicles, block: "B398" },
                  { title: "GOV-GDP-002", subtitle: "Game Design Parameters v2.1 — The Design Bible", src: CDN.govGdp001, block: "B402" },
                  { title: "Inspector Node Report", subtitle: "Jonathan Green — LinkedIn Review, 24 March 2026", src: CDN.jgInspector, block: "B401" },
                  { title: "Node 018 Report v2", subtitle: "Khanh Huynh — Marketing Intelligence, Market Analyst / Beta Tester, 24 March 2026", src: CDN.khNode018v2, block: "B402" },
                ]).map(card => (
                  <div key={card.title} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                    <img
                      src={card.src}
                      alt={card.title}
                      className="w-full object-contain max-h-[500px]"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h4 className="font-heading text-gold text-sm">{card.title}</h4>
                      <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                      <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">{card.block}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
