import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Globe, Database, Activity, Users, Gamepad2, BookOpen, Image, ExternalLink, RefreshCw, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const BRIDGE_ICONS: Record<string, typeof Globe> = {
  "ACAD SITE": BookOpen,
  "MEMORIAL SITE": Globe,
  "TRE GAME": Gamepad2,
  "CHART ROOM": Activity,
};

const BRIDGE_COLORS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  "ACAD SITE": { border: "border-blue-500/40", bg: "bg-blue-500/10", text: "text-blue-400", glow: "shadow-blue-500/20" },
  "MEMORIAL SITE": { border: "border-purple-500/40", bg: "bg-purple-500/10", text: "text-purple-400", glow: "shadow-purple-500/20" },
  "TRE GAME": { border: "border-cyan-500/40", bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
  "CHART ROOM": { border: "border-amber-500/40", bg: "bg-amber-500/10", text: "text-amber-400", glow: "shadow-amber-500/20" },
};

const DB_ACCESS_COLORS: Record<string, string> = {
  MASTER: "bg-green-500/20 text-green-400 border-green-500/30",
  CONNECTED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SHARED: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "API BRIDGE": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const STATUS_ICONS: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  failed: XCircle,
  partial: AlertTriangle,
};

const STATUS_COLORS: Record<string, string> = {
  success: "text-green-400",
  failed: "text-red-400",
  partial: "text-amber-400",
};

export default function BridgeHub() {
  const { user } = useAuth();

  const { data: status, isLoading: statusLoading } = trpc.bridge.status.useQuery();
  const { data: registry = [], isLoading: registryLoading } = trpc.bridge.registry.useQuery();
  const { data: mediaStats } = trpc.media.stats.useQuery();
  const { data: syncHistory = [], refetch: refetchHistory } = trpc.bridge.syncHistory.useQuery({ limit: 10 });

  const [syncing, setSyncing] = useState<string | null>(null);

  const syncAll = trpc.bridge.syncAll.useMutation({
    onMutate: () => setSyncing("all"),
    onSuccess: (data) => {
      setSyncing(null);
      refetchHistory();
      const memStatus = (data.memorial as any)?.status || "unknown";
      const chartStatus = (data.chartRoom as any)?.status || "unknown";
      toast.success(`Sync Complete: Memorial ${memStatus} | Chart Room ${chartStatus}`);
    },
    onError: (err) => {
      setSyncing(null);
      toast.error(`Sync Failed: ${err.message}`);
    },
  });

  const syncMemorial = trpc.bridge.syncMemorial.useMutation({
    onMutate: () => setSyncing("memorial"),
    onSuccess: (data) => {
      setSyncing(null);
      refetchHistory();
      toast.success(`Memorial Sync: ${(data as any)?.status || "done"}`);
    },
    onError: (err) => {
      setSyncing(null);
      toast.error(`Sync Failed: ${err.message}`);
    },
  });

  const syncChartRoom = trpc.bridge.syncChartRoom.useMutation({
    onMutate: () => setSyncing("chart"),
    onSuccess: (data) => {
      setSyncing(null);
      refetchHistory();
      toast.success(`Chart Room Sync: ${(data as any)?.status || "done"}`);
    },
    onError: (err) => {
      setSyncing(null);
      toast.error(`Sync Failed: ${err.message}`);
    },
  });

  const isLoading = statusLoading || registryLoading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold font-mono tracking-tight">BRIDGE HUB</h1>
              <p className="text-xs text-muted-foreground">Tetrahedral Observer — Four Operational Bridges</p>
            </div>
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={() => syncAll.mutate()}
                disabled={!!syncing}
              >
                <RefreshCw className={`w-3 h-3 ${syncing === "all" ? "animate-spin" : ""}`} />
                {syncing === "all" ? "Syncing..." : "Sync All"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* TRE Status Card */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-cyan-500/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-mono text-green-400">TRE — OPERATIONAL</span>
              <span className="text-[10px] text-muted-foreground ml-auto font-mono">
                {new Date(status.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Players", value: status.stats.players, icon: Users },
                { label: "Relays", value: status.stats.relays, icon: Gamepad2 },
                { label: "Contacts", value: status.stats.contacts, icon: Globe },
                { label: "Media", value: status.stats.mediaAssets, icon: Image },
                { label: "Total XP", value: status.stats.totalXpEarned.toLocaleString(), icon: Activity },
              ].map((s) => (
                <div key={s.label} className="bg-background/50 rounded-lg p-3 text-center">
                  <s.icon className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
                  <p className="text-lg font-bold font-mono">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bridge Registry */}
        <div>
          <h2 className="text-sm font-mono text-muted-foreground mb-3 tracking-wider">BRIDGE REGISTRY</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registry.map((bridge, i) => {
                const Icon = BRIDGE_ICONS[bridge.name] || Globe;
                const colors = BRIDGE_COLORS[bridge.name] || BRIDGE_COLORS["TRE GAME"];
                const dbColor = DB_ACCESS_COLORS[bridge.dbAccess] || DB_ACCESS_COLORS["API BRIDGE"];
                const bridgeKey = bridge.name === "MEMORIAL SITE" ? "MEMORIAL" : bridge.name === "CHART ROOM" ? "CHART_ROOM" : null;
                const lastSync = bridgeKey ? syncHistory.find((s: any) => s.bridge === bridgeKey) : null;
                
                return (
                  <motion.div
                    key={bridge.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-card border ${colors.border} rounded-xl p-5 hover:shadow-lg ${colors.glow} transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm">{bridge.name}</h3>
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">{bridge.subtitle}</p>
                      </div>
                      {user && bridgeKey && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-8 w-8"
                          onClick={() => bridgeKey === "MEMORIAL" ? syncMemorial.mutate() : syncChartRoom.mutate()}
                          disabled={!!syncing}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${
                            (syncing === "memorial" && bridgeKey === "MEMORIAL") || 
                            (syncing === "chart" && bridgeKey === "CHART_ROOM") ||
                            syncing === "all"
                              ? "animate-spin" : ""
                          }`} />
                        </Button>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${dbColor}`}>
                        <Database className="w-3 h-3 inline mr-1" />
                        {bridge.dbAccess}
                      </span>
                      {mediaStats?.bridges?.[bridge.name === "TRE GAME" ? "TRE" : bridge.name === "ACAD SITE" ? "ACAD" : bridge.name === "MEMORIAL SITE" ? "MEMORIAL" : "CHART"] ? (
                        <span className="text-[10px] text-muted-foreground">
                          <Image className="w-3 h-3 inline mr-1" />
                          {mediaStats.bridges[bridge.name === "TRE GAME" ? "TRE" : bridge.name === "ACAD SITE" ? "ACAD" : bridge.name === "MEMORIAL SITE" ? "MEMORIAL" : "CHART"]} assets
                        </span>
                      ) : null}
                    </div>

                    {/* Last Sync Status */}
                    {lastSync && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        {(() => {
                          const SIcon = STATUS_ICONS[(lastSync as any).status] || Clock;
                          const sColor = STATUS_COLORS[(lastSync as any).status] || "text-muted-foreground";
                          return (
                            <>
                              <SIcon className={`w-3 h-3 ${sColor}`} />
                              <span>Last sync: {new Date((lastSync as any).syncedAt).toLocaleString()}</span>
                              <span className={sColor}>({(lastSync as any).status})</span>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-border/50">
                      <a
                        href={`https://${bridge.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs ${colors.text} hover:underline flex items-center gap-1`}
                      >
                        {bridge.domain}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sync History */}
        {syncHistory.length > 0 && (
          <div>
            <h2 className="text-sm font-mono text-muted-foreground mb-3 tracking-wider">SYNC HISTORY</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="divide-y divide-border/50">
                {syncHistory.map((entry: any) => {
                  const SIcon = STATUS_ICONS[entry.status] || Clock;
                  const sColor = STATUS_COLORS[entry.status] || "text-muted-foreground";
                  return (
                    <div key={entry.id} className="px-4 py-3 flex items-center gap-3 text-sm">
                      <SIcon className={`w-4 h-4 shrink-0 ${sColor}`} />
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-xs">{entry.bridge}</span>
                        <span className="text-muted-foreground text-xs ml-2">{entry.syncType}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] ${sColor}`}>{entry.status}</span>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(entry.syncedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2">
          <Link href="/media">
            <Button variant="outline" size="sm" className="text-xs">
              <Image className="w-3 h-3 mr-1" /> Media Catalogue ({mediaStats?.total ?? 0})
            </Button>
          </Link>
          <Link href="/network">
            <Button variant="outline" size="sm" className="text-xs">
              <Users className="w-3 h-3 mr-1" /> Network Directory
            </Button>
          </Link>
          <Link href="/governance">
            <Button variant="outline" size="sm" className="text-xs">
              <Activity className="w-3 h-3 mr-1" /> Governance Deck
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
