import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft, Shield, AlertTriangle, BookOpen, Award, Lock,
  ChevronRight, Key, Eye, CheckCircle, FileText, Wrench,
  ArrowDown, Users, Search, Filter, Database, X
} from "lucide-react";

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

const RECORD_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "governance_model", label: "Governance Model" },
  { value: "protocol", label: "Protocol" },
  { value: "design_document", label: "Design Document" },
];

const GOV_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "superseded", label: "Superseded" },
  { value: "draft", label: "Draft" },
];

const NODE_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "activated", label: "Activated" },
  { value: "pending", label: "Pending" },
  { value: "deactivated", label: "Deactivated" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "text-green-400 bg-green-500/15 border-green-500/30",
  superseded: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  draft: "text-blue-400 bg-blue-500/15 border-blue-500/30",
  activated: "text-green-400 bg-green-500/15 border-green-500/30",
  pending: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  deactivated: "text-red-400 bg-red-500/15 border-red-500/30",
  open: "text-blue-400 bg-blue-500/15 border-blue-500/30",
  in_progress: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  resolved: "text-green-400 bg-green-500/15 border-green-500/30",
  archived: "text-muted-foreground bg-muted/15 border-border/30",
};

export default function GovernanceDeck() {
  const [activeTab, setActiveTab] = useState<Tab>("power");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [expandedTier, setExpandedTier] = useState<number | null>(null);

  // Audit Trail filters
  const [auditSearch, setAuditSearch] = useState("");
  const [govRecordType, setGovRecordType] = useState("");
  const [govStatus, setGovStatus] = useState("");
  const [govBlockRef, setGovBlockRef] = useState("");
  const [nodeStatus, setNodeStatus] = useState("");
  const [auditSection, setAuditSection] = useState<"records" | "feedback" | "nodes">("records");

  // Stable query inputs
  const govQueryInput = useMemo(() => ({
    search: auditSearch || undefined,
    recordType: govRecordType || undefined,
    status: govStatus || undefined,
    blockRef: govBlockRef || undefined,
  }), [auditSearch, govRecordType, govStatus, govBlockRef]);

  const feedbackQueryInput = useMemo(() => ({
    search: auditSearch || undefined,
  }), [auditSearch]);

  const nodeQueryInput = useMemo(() => ({
    search: auditSearch || undefined,
    status: nodeStatus || undefined,
  }), [auditSearch, nodeStatus]);

  // tRPC queries
  const govRecords = trpc.governance.records.useQuery(govQueryInput, {
    enabled: activeTab === "audit" && auditSection === "records",
    placeholderData: (prev: any) => prev,
  });
  const feedbackReports = trpc.governance.feedbackReports.useQuery(feedbackQueryInput, {
    enabled: activeTab === "audit" && auditSection === "feedback",
    placeholderData: (prev: any) => prev,
  });
  const dcsnNodes = trpc.governance.dcsnNodes.useQuery(nodeQueryInput, {
    enabled: activeTab === "audit" && auditSection === "nodes",
    placeholderData: (prev: any) => prev,
  });

  const clearFilters = () => {
    setAuditSearch("");
    setGovRecordType("");
    setGovStatus("");
    setGovBlockRef("");
    setNodeStatus("");
  };

  const hasActiveFilters = auditSearch || govRecordType || govStatus || govBlockRef || nodeStatus;

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

          {/* ─── AUDIT TRAIL ─── */}
          {activeTab === "audit" && (
            <motion.div key="audit" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <div className="text-center space-y-3">
                <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">Live Database — Full Transparency</p>
                <h2 className="font-heading text-3xl md:text-4xl text-gold-gradient">Audit Trail</h2>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  Governance records, feedback reports, and DCSN network nodes — all pulled live from the database.
                </p>
              </div>

              {/* Section Tabs */}
              <div className="flex gap-2 justify-center flex-wrap">
                {([
                  { id: "records" as const, label: "Governance Records", count: govRecords.data?.length },
                  { id: "feedback" as const, label: "Feedback Reports", count: feedbackReports.data?.length },
                  { id: "nodes" as const, label: "DCSN Nodes", count: dcsnNodes.data?.length },
                ]).map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setAuditSection(s.id); clearFilters(); }}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      auditSection === s.id
                        ? "bg-gold/15 text-gold border border-gold/30"
                        : "text-muted-foreground hover:text-foreground bg-card border border-border/30"
                    }`}
                  >
                    {s.label}
                    {s.count !== undefined && (
                      <span className="ml-2 text-xs opacity-60">({s.count})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search & Filters */}
              <div className="bg-card border border-border/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={
                        auditSection === "records" ? "Search by title, ID, or description..." :
                        auditSection === "feedback" ? "Search by reporter name or verdict..." :
                        "Search by name or title..."
                      }
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground gap-1">
                      <X className="w-3 h-3" /> Clear
                    </Button>
                  )}
                </div>

                {/* Section-specific filters */}
                <div className="flex flex-wrap gap-2">
                  {auditSection === "records" && (
                    <>
                      <div className="flex items-center gap-1">
                        <Filter className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Type:</span>
                      </div>
                      {RECORD_TYPE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setGovRecordType(opt.value)}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            govRecordType === opt.value
                              ? "bg-gold/15 text-gold border border-gold/30"
                              : "text-muted-foreground hover:text-foreground bg-background/50 border border-border/30"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                      <div className="w-px h-5 bg-border/50 mx-1" />
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Status:</span>
                      </div>
                      {GOV_STATUS_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setGovStatus(opt.value)}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            govStatus === opt.value
                              ? "bg-gold/15 text-gold border border-gold/30"
                              : "text-muted-foreground hover:text-foreground bg-background/50 border border-border/30"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </>
                  )}
                  {auditSection === "nodes" && (
                    <>
                      <div className="flex items-center gap-1">
                        <Filter className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Status:</span>
                      </div>
                      {NODE_STATUS_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setNodeStatus(opt.value)}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            nodeStatus === opt.value
                              ? "bg-gold/15 text-gold border border-gold/30"
                              : "text-muted-foreground hover:text-foreground bg-background/50 border border-border/30"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </>
                  )}
                </div>

                {/* Block Ref filter for records */}
                {auditSection === "records" && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Block Ref:</span>
                    <Input
                      placeholder="e.g. B353, B402..."
                      value={govBlockRef}
                      onChange={(e) => setGovBlockRef(e.target.value)}
                      className="bg-background/50 max-w-[200px] h-8 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="space-y-3">
                {/* Governance Records */}
                {auditSection === "records" && (
                  <>
                    {govRecords.isLoading && (
                      <div className="text-center py-12 text-muted-foreground text-sm">Loading governance records...</div>
                    )}
                    {govRecords.data && govRecords.data.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground text-sm">No governance records match your filters.</div>
                    )}
                    {govRecords.data?.map((record: any) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border/50 rounded-xl p-5 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs text-gold bg-gold/10 border border-gold/30 px-2 py-0.5 rounded">{record.recordId}</span>
                              {record.version && <span className="text-xs text-muted-foreground">v{record.version}</span>}
                              {record.blockRef && <span className="text-xs font-mono text-muted-foreground/60">{record.blockRef}</span>}
                            </div>
                            <h4 className="font-heading text-foreground mt-2">{record.title}</h4>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded border whitespace-nowrap ${STATUS_COLORS[record.status] || "text-muted-foreground"}`}>
                            {record.status?.toUpperCase()}
                          </span>
                        </div>
                        {record.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{record.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
                          <span>Type: {record.recordType?.replace(/_/g, " ")}</span>
                          {record.compliance && <span>Compliance: {record.compliance}</span>}
                          <span>Created: {new Date(record.createdAt).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}

                {/* Feedback Reports */}
                {auditSection === "feedback" && (
                  <>
                    {feedbackReports.isLoading && (
                      <div className="text-center py-12 text-muted-foreground text-sm">Loading feedback reports...</div>
                    )}
                    {feedbackReports.data && feedbackReports.data.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground text-sm">No feedback reports match your filters.</div>
                    )}
                    {feedbackReports.data?.map((report: any) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border/50 rounded-xl p-5 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-gold font-heading">Node {String(report.nodeNumber).padStart(3, "0")}</span>
                              <span className="text-xs text-muted-foreground">{report.reporterName}</span>
                              {report.blockRef && <span className="text-xs font-mono text-muted-foreground/60">{report.blockRef}</span>}
                            </div>
                            <h4 className="font-heading text-foreground mt-2">{report.verdictTitle || report.reportType}</h4>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded border whitespace-nowrap ${STATUS_COLORS[report.status] || "text-muted-foreground"}`}>
                            {report.status?.toUpperCase()}
                          </span>
                        </div>
                        {report.verdictDetails && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{report.verdictDetails}</p>
                        )}
                        {report.prescription && (
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                            <p className="text-xs text-amber-400 font-heading mb-1">PRESCRIPTION</p>
                            <p className="text-xs text-foreground/80">{report.prescription}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
                          <span>Type: {report.reportType}</span>
                          <span>Source: {report.source}</span>
                          <span>Date: {report.reportDate}</span>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}

                {/* DCSN Nodes */}
                {auditSection === "nodes" && (
                  <>
                    {dcsnNodes.isLoading && (
                      <div className="text-center py-12 text-muted-foreground text-sm">Loading DCSN nodes...</div>
                    )}
                    {dcsnNodes.data && dcsnNodes.data.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground text-sm">No DCSN nodes match your filters.</div>
                    )}
                    {dcsnNodes.data?.map((node: any) => (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border/50 rounded-xl p-5 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-sm text-gold bg-gold/10 border border-gold/30 px-2 py-0.5 rounded">
                                NODE {String(node.nodeNumber).padStart(3, "0")}
                              </span>
                              <span className="text-xs text-muted-foreground">{node.level}</span>
                            </div>
                            <h4 className="font-heading text-foreground mt-2">{node.name}</h4>
                            {node.title && <p className="text-sm text-muted-foreground">{node.title}</p>}
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded border whitespace-nowrap ${STATUS_COLORS[node.status] || "text-muted-foreground"}`}>
                            {node.status?.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          {node.role && (
                            <div>
                              <span className="text-muted-foreground/60">Role</span>
                              <p className="text-foreground/80">{node.role}</p>
                            </div>
                          )}
                          {node.cell && (
                            <div>
                              <span className="text-muted-foreground/60">Cell</span>
                              <p className="text-foreground/80">{node.cell}</p>
                            </div>
                          )}
                          {node.intel && (
                            <div>
                              <span className="text-muted-foreground/60">Intel</span>
                              <p className="text-foreground/80">{node.intel}</p>
                            </div>
                          )}
                          {node.access && (
                            <div>
                              <span className="text-muted-foreground/60">Access</span>
                              <p className="text-foreground/80">{node.access}</p>
                            </div>
                          )}
                        </div>
                        {node.recruitedByName && (
                          <p className="text-[10px] text-muted-foreground/60">
                            Recruited by Node {String(node.recruitedByNode).padStart(3, "0")} ({node.recruitedByName}) — {node.activationDate}
                          </p>
                        )}
                        {node.notes && (
                          <p className="text-xs text-muted-foreground/80 italic">{node.notes}</p>
                        )}
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}

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
