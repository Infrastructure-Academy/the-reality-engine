import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  Search, Users, Phone, MessageSquare, ArrowLeft,
  ChevronLeft, ChevronRight, UserCheck, Filter, Globe
} from "lucide-react";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value.toLocaleString()}</div>
        <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

export default function NetworkDirectory() {
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNameOnly, setHasNameOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const limit = 50;

  // Stabilize query input
  const queryInput = useMemo(() => ({
    search: search || undefined,
    page,
    limit,
    hasNameOnly: hasNameOnly || undefined,
  }), [search, page, limit, hasNameOnly]);

  const { data: stats } = trpc.agn.stats.useQuery(undefined, { enabled: !!user });
  const { data, isLoading } = trpc.agn.contacts.useQuery(queryInput, { enabled: !!user });
  const updateNotes = trpc.agn.updateNotes.useMutation();

  const contacts = data?.contacts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Users className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Network Directory</h1>
          <p className="text-slate-400 mb-6">Sign in to access the AGN contact directory.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Globe className="w-5 h-5 text-cyan-400" />
          <h1 className="text-lg font-bold text-white tracking-wide">AGN NETWORK DIRECTORY</h1>
          <span className="ml-auto text-xs text-slate-500 font-mono">ADMIN</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total Contacts" value={stats.total} icon={Users} color="bg-cyan-600" />
            <StatCard label="Named" value={stats.named} icon={UserCheck} color="bg-emerald-600" />
            <StatCard label="Phone Only" value={stats.phoneOnly} icon={Phone} color="bg-amber-600" />
            <StatCard label="Has Played" value={stats.hasPlayed} icon={MessageSquare} color="bg-purple-600" />
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 text-sm"
            />
          </div>
          <button
            onClick={() => { setHasNameOnly(!hasNameOnly); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              hasNameOnly
                ? "bg-cyan-600/20 border-cyan-500/50 text-cyan-300"
                : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
            Named Only
          </button>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            Showing <span className="text-white font-medium">{contacts.length}</span> of{" "}
            <span className="text-white font-medium">{total.toLocaleString()}</span> contacts
          </span>
          {totalPages > 1 && (
            <span className="text-slate-500 font-mono text-xs">
              Page {page}/{totalPages}
            </span>
          )}
        </div>

        {/* Contacts Table */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No contacts found</p>
              {search && <p className="text-sm text-slate-500 mt-1">Try a different search term</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/40">
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Msgs</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">First Seen</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Last Seen</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Played</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c: any) => (
                    <tr
                      key={c.id}
                      onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            c.name ? "bg-cyan-600/30 text-cyan-300" : "bg-slate-700 text-slate-400"
                          }`}>
                            {c.name ? c.name.charAt(0).toUpperCase() : "#"}
                          </div>
                          <div>
                            <div className="text-white font-medium">{c.name || c.displayName || "Unknown"}</div>
                            <div className="text-xs text-slate-500 sm:hidden">{c.phone || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs hidden sm:table-cell">{c.phone || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded text-xs font-medium ${
                          c.messageCount > 10 ? "bg-emerald-600/20 text-emerald-300" :
                          c.messageCount > 3 ? "bg-amber-600/20 text-amber-300" :
                          "bg-slate-700/50 text-slate-400"
                        }`}>
                          {c.messageCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">{c.firstMessage || "—"}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">{c.lastMessage || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        {c.hasPlayed ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <UserCheck className="w-3.5 h-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom spacing for mobile tab bar */}
      <div className="h-24" />
    </div>
  );
}
