import { useState, useMemo, useCallback, Fragment } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  Search, Users, Phone, MessageSquare, ArrowLeft,
  ChevronLeft, ChevronRight, UserCheck, Filter, Globe,
  Tag, Plus, X, Check, Palette, Trash2, Edit2, Zap
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

const TAG_COLORS = [
  "#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444",
  "#06b6d4", "#ec4899", "#f97316", "#14b8a6", "#6b7280",
];

function TagBadge({ name, color, onRemove }: { name: string; color: string; onRemove?: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color + "33", borderColor: color + "66", borderWidth: 1 }}
    >
      <span style={{ color }}>{name}</span>
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="ml-0.5 hover:opacity-70">
          <X className="w-3 h-3" style={{ color }} />
        </button>
      )}
    </span>
  );
}

function CreateTagDialog({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(TAG_COLORS[0]);
  const [desc, setDesc] = useState("");
  const createTag = trpc.agn.createTag.useMutation({
    onSuccess: () => { onCreated(); onClose(); },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-cyan-400" /> Create Tag
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Committee"
              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {TAG_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? "border-white scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Description (optional)</label>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Brief description..."
              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button
              onClick={() => createTag.mutate({ name, color, description: desc || undefined })}
              disabled={!name.trim() || createTag.isPending}
              className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-500 transition-colors disabled:opacity-50"
            >
              {createTag.isPending ? "Creating..." : "Create Tag"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TagAssignDropdown({ contactId, existingTags, allTags, onAssigned }: {
  contactId: number;
  existingTags: { tagId: number; tagName: string | null; tagColor: string | null }[];
  allTags: { id: number; name: string; color: string | null }[];
  onAssigned: () => void;
}) {
  const assignTag = trpc.agn.assignTag.useMutation({ onSuccess: onAssigned });
  const availableTags = allTags.filter(t => !existingTags.some(et => et.tagId === t.id));

  if (availableTags.length === 0) {
    return <div className="text-xs text-slate-500 py-1">All tags assigned</div>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {availableTags.map(t => (
        <button
          key={t.id}
          onClick={(e) => { e.stopPropagation(); assignTag.mutate({ contactId, tagId: t.id }); }}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-dashed transition-colors hover:border-solid"
          style={{ borderColor: (t.color || "#6b7280") + "66", color: t.color || "#6b7280" }}
        >
          <Plus className="w-3 h-3" /> {t.name}
        </button>
      ))}
    </div>
  );
}

export default function NetworkDirectory() {
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNameOnly, setHasNameOnly] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(undefined);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [bulkTagMode, setBulkTagMode] = useState(false);
  const limit = 50;

  const utils = trpc.useUtils();

  const queryInput = useMemo(() => ({
    search: search || undefined,
    page,
    limit,
    hasNameOnly: hasNameOnly || undefined,
    tagId: selectedTagId,
  }), [search, page, limit, hasNameOnly, selectedTagId]);

  const { data: stats } = trpc.agn.stats.useQuery(undefined, { enabled: !!user });
  const { data, isLoading } = trpc.agn.contacts.useQuery(queryInput, { enabled: !!user });
  const { data: allTags } = trpc.agn.tags.useQuery(undefined, { enabled: !!user });
  const updateNotes = trpc.agn.updateNotes.useMutation();
  const removeTag = trpc.agn.removeTag.useMutation({
    onSuccess: () => utils.agn.contacts.invalidate(),
  });
  const bulkAssignTag = trpc.agn.bulkAssignTag.useMutation({
    onSuccess: () => {
      utils.agn.contacts.invalidate();
      setSelectedContacts(new Set());
      setBulkTagMode(false);
    },
  });

  const contacts = data?.contacts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const toggleContact = useCallback((id: number) => {
    setSelectedContacts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedContacts(new Set(contacts.map((c: any) => c.id)));
  }, [contacts]);

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
            <StatCard label="Has Played" value={stats.hasPlayed} icon={Zap} color="bg-purple-600" />
          </div>
        )}

        {/* Tag Filter Chips */}
        {allTags && allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-slate-500" />
            <button
              onClick={() => { setSelectedTagId(undefined); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !selectedTagId ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50" : "bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-white"
              }`}
            >
              All
            </button>
            {allTags.map((tag: any) => (
              <button
                key={tag.id}
                onClick={() => { setSelectedTagId(selectedTagId === tag.id ? undefined : tag.id); setPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  selectedTagId === tag.id ? "border-white/50" : "border-transparent hover:border-white/20"
                }`}
                style={{
                  backgroundColor: (tag.color || "#6b7280") + (selectedTagId === tag.id ? "44" : "22"),
                  color: tag.color || "#6b7280",
                }}
              >
                {tag.name}
              </button>
            ))}
            <button
              onClick={() => setShowCreateTag(true)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/60 text-slate-400 border border-dashed border-slate-600 hover:text-white hover:border-slate-400 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> New Tag
            </button>
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
          <button
            onClick={() => { setBulkTagMode(!bulkTagMode); setSelectedContacts(new Set()); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              bulkTagMode
                ? "bg-purple-600/20 border-purple-500/50 text-purple-300"
                : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white"
            }`}
          >
            <Tag className="w-4 h-4" />
            Bulk Tag
          </button>
        </div>

        {/* Bulk Tag Actions */}
        {bulkTagMode && selectedContacts.size > 0 && allTags && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-purple-300 font-medium">
              {selectedContacts.size} selected
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-xs text-slate-400">Assign tag:</span>
            {allTags.map((tag: any) => (
              <button
                key={tag.id}
                onClick={() => bulkAssignTag.mutate({ contactIds: Array.from(selectedContacts), tagId: tag.id })}
                className="px-2 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80"
                style={{ backgroundColor: (tag.color || "#6b7280") + "33", borderColor: (tag.color || "#6b7280") + "66", color: tag.color || "#6b7280" }}
              >
                {tag.name}
              </button>
            ))}
            {bulkAssignTag.isPending && <span className="text-xs text-slate-400">Assigning...</span>}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            Showing <span className="text-white font-medium">{contacts.length}</span> of{" "}
            <span className="text-white font-medium">{total.toLocaleString()}</span> contacts
          </span>
          {bulkTagMode && (
            <button onClick={selectAll} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              Select all on page
            </button>
          )}
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
                    {bulkTagMode && (
                      <th className="w-10 px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedContacts.size === contacts.length && contacts.length > 0}
                          onChange={() => {
                            if (selectedContacts.size === contacts.length) setSelectedContacts(new Set());
                            else selectAll();
                          }}
                          className="rounded border-slate-600"
                        />
                      </th>
                    )}
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Tags</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Msgs</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c: any) => (
                    <Fragment key={c.id}>
                      <tr
                        onClick={() => !bulkTagMode && setExpandedId(expandedId === c.id ? null : c.id)}
                        className={`border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-colors ${
                          expandedId === c.id ? "bg-slate-700/20" : ""
                        }`}
                      >
                        {bulkTagMode && (
                          <td className="w-10 px-3 py-3" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedContacts.has(c.id)}
                              onChange={() => toggleContact(c.id)}
                              className="rounded border-slate-600"
                            />
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              c.hasPlayed ? "bg-emerald-600/30 text-emerald-300 ring-2 ring-emerald-500/30" :
                              c.name ? "bg-cyan-600/30 text-cyan-300" : "bg-slate-700 text-slate-400"
                            }`}>
                              {c.name ? c.name.charAt(0).toUpperCase() : "#"}
                            </div>
                            <div className="min-w-0">
                              <div className="text-white font-medium truncate">{c.name || c.displayName || "Unknown"}</div>
                              <div className="text-xs text-slate-500 sm:hidden">{c.phone || "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs hidden sm:table-cell">{c.phone || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(c.tags || []).map((t: any) => (
                              <TagBadge
                                key={t.tagId}
                                name={t.tagName || ""}
                                color={t.tagColor || "#6b7280"}
                                onRemove={() => removeTag.mutate({ contactId: c.id, tagId: t.tagId })}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded text-xs font-medium ${
                            c.messageCount > 10 ? "bg-emerald-600/20 text-emerald-300" :
                            c.messageCount > 3 ? "bg-amber-600/20 text-amber-300" :
                            "bg-slate-700/50 text-slate-400"
                          }`}>
                            {c.messageCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {c.hasPlayed ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                              <Zap className="w-3.5 h-3.5" /> Linked
                            </span>
                          ) : (
                            <span className="text-xs text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                      {/* Expanded Row */}
                      {expandedId === c.id && !bulkTagMode && (
                        <tr key={`${c.id}-expanded`} className="border-b border-slate-700/30 bg-slate-800/30">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div>
                                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Details</div>
                                  <div className="text-sm text-slate-300 space-y-1">
                                    <div>Display Name: <span className="text-white">{c.displayName || "—"}</span></div>
                                    <div>First Message: <span className="text-white">{c.firstMessage || "—"}</span></div>
                                    <div>Last Message: <span className="text-white">{c.lastMessage || "—"}</span></div>
                                    {c.linkedProfileId && (
                                      <div>Profile ID: <span className="text-emerald-400 font-mono">#{c.linkedProfileId}</span></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Assign Tags</div>
                                  {allTags && (
                                    <TagAssignDropdown
                                      contactId={c.id}
                                      existingTags={c.tags || []}
                                      allTags={allTags}
                                      onAssigned={() => utils.agn.contacts.invalidate()}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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

      {/* Create Tag Dialog */}
      {showCreateTag && (
        <CreateTagDialog
          onClose={() => setShowCreateTag(false)}
          onCreated={() => utils.agn.tags.invalidate()}
        />
      )}

      {/* Bottom spacing */}
      <div className="h-24" />
    </div>
  );
}
