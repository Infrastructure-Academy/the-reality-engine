import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Building2, GraduationCap, DollarSign, Gamepad2, RefreshCw, Smartphone } from "lucide-react";
import { trpc } from "@/lib/trpc";

const ROLE_CONFIG: Record<string, { label: string; icon: typeof Users; color: string; bg: string }> = {
  player: { label: "Player", icon: Gamepad2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  educator: { label: "Educator", icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-400/10" },
  institution: { label: "Institution", icon: Building2, color: "text-purple-400", bg: "bg-purple-400/10" },
  sponsor: { label: "Sponsor", icon: DollarSign, color: "text-amber-400", bg: "bg-amber-400/10" },
  backer: { label: "Backer", icon: DollarSign, color: "text-red-400", bg: "bg-red-400/10" },
  other: { label: "Other", icon: Users, color: "text-gray-400", bg: "bg-gray-400/10" },
};

export default function IgoAdmin() {
  const { data: registrations, isLoading, refetch } = trpc.igo.list.useQuery();
  const { data: stats } = trpc.igo.stats.useQuery();
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = registrations?.filter(r => roleFilter === "all" || r.role === roleFilter) ?? [];

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
            <h1 className="font-heading text-gold text-sm md:text-base tracking-wider">iGO REGISTRATIONS</h1>
            <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">ADMIN</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-muted-foreground hover:text-gold">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="container py-6 max-w-6xl mx-auto space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="bg-card border border-gold/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-heading text-gold">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Total</p>
            </div>
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
              const count = stats.byRole[key] ?? 0;
              return (
                <div key={key} className={`${cfg.bg} border border-border/30 rounded-lg p-4 text-center cursor-pointer hover:border-gold/30 transition-colors ${roleFilter === key ? "ring-1 ring-gold" : ""}`} onClick={() => setRoleFilter(roleFilter === key ? "all" : key)}>
                  <p className={`text-2xl font-heading ${cfg.color}`}>{count}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wider uppercase">{cfg.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* App Pre-Register Count */}
        {stats && stats.appPreRegisters > 0 && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-cyan-300">{stats.appPreRegisters} app pre-registrations</span>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setRoleFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${roleFilter === "all" ? "bg-gold text-black" : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"}`}>
            All ({stats?.total ?? 0})
          </button>
          {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
            <button key={key} onClick={() => setRoleFilter(roleFilter === key ? "all" : key)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${roleFilter === key ? "bg-gold text-black" : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"}`}>
              {cfg.label} ({stats?.byRole[key] ?? 0})
            </button>
          ))}
        </div>

        {/* Registrations Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Loading registrations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border/50 rounded-lg">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No registrations yet</p>
            <p className="text-muted-foreground text-xs mt-1">Share the iGO page to start collecting interest</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-muted-foreground font-medium">#</th>
                  <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-muted-foreground font-medium">Name</th>
                  <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-muted-foreground font-medium">Email</th>
                  <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-muted-foreground font-medium">Role</th>
                  <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-muted-foreground font-medium">Organisation</th>
                  <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-muted-foreground font-medium">App</th>
                  <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-muted-foreground font-medium">Message</th>
                  <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg, i) => {
                  const cfg = ROLE_CONFIG[reg.role] ?? ROLE_CONFIG.other;
                  const Icon = cfg.icon;
                  return (
                    <tr key={reg.id} className="border-b border-border/20 hover:bg-card/50 transition-colors">
                      <td className="py-3 px-3 text-muted-foreground text-xs">{i + 1}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{reg.name}</td>
                      <td className="py-3 px-3">
                        <a href={`mailto:${reg.email}`} className="text-cyan-400 hover:underline">{reg.email}</a>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${cfg.bg} ${cfg.color}`}>
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{reg.organisation || "—"}</td>
                      <td className="py-3 px-3">{reg.appPreRegister ? <Smartphone className="w-4 h-4 text-cyan-400" /> : "—"}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs max-w-[200px] truncate" title={reg.message ?? ""}>{reg.message || "—"}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs whitespace-nowrap">{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
