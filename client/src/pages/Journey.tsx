import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { RELAYS } from "@shared/gameData";
import { getPlayerBadge, getAllEarnedBadges, getNextBadge, BADGES } from "@shared/badges";
import {
  ArrowLeft, Flame, TreePine, Waves, Compass, Map, Ship,
  Cog, Train, Zap, Plane, Satellite, Brain, Trophy,
  Clock, Star, Target, Award, ChevronDown, ChevronUp
} from "lucide-react";

// Map relay numbers to icons
const RELAY_ICONS: Record<number, any> = {
  1: Flame, 2: TreePine, 3: Waves, 4: Compass, 5: Map, 6: Ship,
  7: Cog, 8: Train, 9: Zap, 10: Plane, 11: Satellite, 12: Brain,
};

function getRelayInfo(source: string, sourceId?: string | null) {
  // Parse relay number from source/sourceId
  const relayMatch = sourceId?.match(/relay-(\d+)/i) || source?.match(/relay[_-]?(\d+)/i);
  if (relayMatch) {
    const num = parseInt(relayMatch[1]);
    const relay = RELAYS.find(r => r.number === num);
    return relay || null;
  }
  // Node activations
  const nodeMatch = sourceId?.match(/node-(\d+)/i);
  if (nodeMatch) {
    const num = parseInt(nodeMatch[1]);
    const relay = RELAYS.find(r => r.number === num);
    return relay || null;
  }
  return null;
}

function getEventIcon(source: string) {
  if (source === "node_activation") return Target;
  if (source.includes("discovery") || source.includes("relay")) return Star;
  return Award;
}

function getEventColor(source: string) {
  if (source === "node_activation") return "text-purple-400 bg-purple-500/20 border-purple-500/30";
  if (source.includes("discovery")) return "text-cyan-400 bg-cyan-500/20 border-cyan-500/30";
  return "text-amber-400 bg-amber-500/20 border-amber-500/30";
}

function formatXp(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`;
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(0)}K`;
  return xp.toLocaleString();
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

interface TimelineEvent {
  id: number;
  amount: number;
  source: string;
  sourceId: string | null;
  description: string | null;
  createdAt: Date | string;
}

function TimelineItem({ event, cumulativeXp }: { event: TimelineEvent; cumulativeXp: number }) {
  const relay = getRelayInfo(event.source, event.sourceId);
  const Icon = relay ? (RELAY_ICONS[relay.number] || Star) : getEventIcon(event.source);
  const colorClass = relay ? "text-cyan-400 bg-cyan-500/20 border-cyan-500/30" : getEventColor(event.source);

  return (
    <div className="flex gap-3 group">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-0.5 flex-1 bg-slate-700/50 min-h-[24px]" />
      </div>

      {/* Event content */}
      <div className="pb-6 flex-1 min-w-0">
        <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 hover:border-slate-600/50 transition-colors">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm text-white font-medium leading-snug">
              {event.description || event.source.replace(/_/g, " ")}
            </p>
            <span className="text-xs font-bold text-emerald-400 whitespace-nowrap">
              +{formatXp(event.amount)} XP
            </span>
          </div>
          {relay && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs" style={{ color: relay.color }}>{relay.emoji}</span>
              <span className="text-xs text-slate-400">Relay {relay.number}: {relay.name}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-500 font-mono">
              {formatDate(event.createdAt)} at {formatTime(event.createdAt)}
            </span>
            <span className="text-[10px] text-slate-500">
              Total: {formatXp(cumulativeXp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeTimeline({ totalXp }: { totalXp: number }) {
  const earned = getAllEarnedBadges(totalXp);
  const next = getNextBadge(totalXp);

  return (
    <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-400" /> Achievement Badges
      </h3>
      <div className="flex flex-wrap gap-2">
        {BADGES.map((badge) => {
          const isEarned = totalXp >= badge.threshold;
          return (
            <div
              key={badge.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                isEarned
                  ? "border-amber-500/30 bg-amber-500/10 text-white"
                  : "border-slate-700/50 bg-slate-800/60 text-slate-500 opacity-50"
              }`}
            >
              <span>{badge.emoji}</span>
              <span>{badge.name}</span>
              <span className="text-[10px] text-slate-400 ml-1">({formatXp(badge.threshold)})</span>
            </div>
          );
        })}
      </div>
      {next && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Next: {next.badge.emoji} {next.badge.name}</span>
            <span>{Math.round(next.progress * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${next.progress * 100}%`,
                backgroundColor: next.badge.color,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Journey() {
  const { user, loading: authLoading } = useAuth();
  const [profileId, setProfileId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Get or create profile for explorer mode (most common)
  const getProfile = trpc.profile.getOrCreate.useMutation();
  const relayProgress = trpc.progress.getForProfile.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );
  const nodeActivations = trpc.dearden.activations.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );
  const timeline = trpc.journey.timeline.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  useEffect(() => {
    if (user) {
      getProfile.mutate(
        { mode: "explorer" },
        { onSuccess: (data) => { if (data) setProfileId(data.id); } }
      );
    }
  }, [user?.id]);

  const events = timeline.data ?? [];
  const displayEvents = showAll ? events : events.slice(0, 30);

  // Calculate cumulative XP for each event (from oldest to newest)
  const cumulativeXpMap = useMemo(() => {
    const sorted = [...events].reverse();
    const map: Record<number, number> = {};
    let running = 0;
    for (const e of sorted) {
      running += e.amount;
      map[e.id] = running;
    }
    return map;
  }, [events]);

  // Stats
  const totalXp = events.reduce((sum, e) => sum + e.amount, 0);
  const completedRelays = relayProgress.data?.filter(p => (p.completionPct ?? 0) >= 100).length ?? 0;
  const totalDiscoveries = events.filter(e => e.source.includes("discovery") || e.source.includes("relay")).length;
  const totalNodes = nodeActivations.data?.length ?? 0;

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
          <Clock className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">My Journey</h1>
          <p className="text-slate-400 mb-6">Sign in to view your exploration timeline and achievements.</p>
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
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Clock className="w-5 h-5 text-cyan-400" />
          <h1 className="text-lg font-bold text-white tracking-wide">MY JOURNEY</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-cyan-400">{formatXp(totalXp)}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Total XP</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-emerald-400">{completedRelays}/12</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Relays Done</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{totalDiscoveries}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Discoveries</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-400">{totalNodes}/60</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Nodes</div>
          </div>
        </div>

        {/* Badge Progress */}
        <BadgeTimeline totalXp={totalXp} />

        {/* Timeline */}
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-cyan-400" /> Activity Timeline
          </h2>

          {timeline.isLoading ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500">Loading your journey...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 border border-slate-700/30 rounded-lg">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No discoveries yet</p>
              <p className="text-sm text-slate-500 mt-1">Start exploring relays to build your timeline.</p>
              <Link href="/explore/1" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors">
                Begin Exploring
              </Link>
            </div>
          ) : (
            <div>
              {displayEvents.map((event) => (
                <TimelineItem
                  key={event.id}
                  event={event}
                  cumulativeXp={cumulativeXpMap[event.id] ?? 0}
                />
              ))}

              {events.length > 30 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {showAll ? (
                    <>Show Less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show All {events.length} Events <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom spacing for mobile tab bar */}
      <div className="h-24" />
    </div>
  );
}
