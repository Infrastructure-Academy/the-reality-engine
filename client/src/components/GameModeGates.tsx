import { useState } from "react";
import { Link } from "wouter";
import {
  Award,
  Brain,
  Building2,
  ChevronRight,
  Compass,
  Dices,
  Flame,
  GraduationCap,
  Medal,
  Rocket,
  Swords,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import { beginFireBedFromGesture } from "@/lib/firePlayback";
import { useLitRelays, useSharedDiscoveryXp } from "@/lib/sharedProgress";
import { getPlayerBadge } from "@shared/badges";
import { QuestInstrumentBay } from "@/components/QuestInstruments";
import {
  PLATE_EPISODES,
  PLATE_FOUNDATION,
  PLATE_GATES,
  PLATE_SUBTITLE,
  PLATE_TITLE,
  type PlateEpisode,
  type PlateEpisodeId,
  type PlateGate,
} from "@shared/plateGates";

const ICONS: Record<string, LucideIcon> = {
  "relay-spinner": Dices,
  "dungeon-crawl": Swords,
  "grey-matter": Brain,
  "flight-deck": Rocket,
  scholar: GraduationCap,
  graduate: Award,
  chartered: Medal,
  "senior-leader": Compass,
  "industry-leader": Building2,
  champion: Flame,
  "mentor-class": Users,
};

const EPISODE_ICONS: Record<PlateEpisodeId, LucideIcon> = {
  1: Flame,
  2: Compass,
  3: Building2,
};

function formatXp(xp: number): string {
  return xp.toLocaleString("en-GB");
}

export function PressPlayMark() {
  const t = useT();
  const label = t("home.pressPlay");
  return (
    <Link
      href="/explore/spinner"
      data-testid="press-play-engage"
      aria-label={label}
      className="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl border border-amber-300/70 bg-[#0a1628] px-4 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-amber-300" aria-hidden="true">
        <path d="M8 5.14v13.72L19.5 12 8 5.14z" />
      </svg>
      <span className="font-heading text-sm tracking-wide sm:text-base">{label}</span>
    </Link>
  );
}

function DoorProgressStrip() {
  const t = useT();
  const discovered = useLitRelays().size;
  const xp = useSharedDiscoveryXp();
  const badge = getPlayerBadge(xp);
  const rank = badge?.name ?? t("home.door.rank");

  return (
    <div
      data-testid="home-progress-strip"
      className="sticky z-30 border-b border-amber-400/30 bg-[#0a1628]/95 px-3 py-2 backdrop-blur-md"
      style={{ top: "calc(36px + env(safe-area-inset-top, 0px))" }}
    >
      <p className="mx-auto flex max-w-6xl items-center justify-between gap-2 font-mono text-[11px] text-amber-100">
        <span className="inline-flex min-h-11 items-center rounded-full border border-amber-400/40 px-3 text-amber-200">{rank}</span>
        <span className="inline-flex min-h-11 items-center tabular-nums" data-testid="home-door-xp">{formatXp(xp)} {t("home.door.xp")}</span>
        <span className="inline-flex min-h-11 items-center tabular-nums" aria-label={`${discovered} ${t("home.door.ofTwelve")}`}>
          {discovered}/12
        </span>
      </p>
    </div>
  );
}

function StatusBadge({ live, label }: { live: boolean; label: string }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-heading tracking-wide ${live ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-300"}`}>
      {label}
    </span>
  );
}

function EpisodeDoor({
  episode,
  expanded,
  onChoose,
  liveLabel,
  comingSoon,
}: {
  episode: PlateEpisode;
  expanded: boolean;
  onChoose: () => void;
  liveLabel: string;
  comingSoon: string;
}) {
  const Icon = EPISODE_ICONS[episode.id];
  const agesLabel = `Episode ${episode.id} (Ages ${episode.ages}): ${episode.name}`;
  return (
    <button
      type="button"
      data-testid={`episode-door-${episode.id}`}
      aria-expanded={expanded}
      aria-label={agesLabel}
      onClick={onChoose}
      className="flex min-h-16 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      style={{
        borderColor: expanded ? episode.accent : `${episode.accent}66`,
        background: `linear-gradient(90deg, ${episode.accent}22, #0a1628)`,
      }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${episode.accent}22`, color: episode.accent }}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-heading text-sm text-amber-50">{episode.name}</span>
          <StatusBadge live={episode.playable} label={episode.playable ? liveLabel : comingSoon} />
        </span>
        <span className="mt-0.5 block font-mono text-[11px] text-amber-100/70">Ages {episode.ages}</span>
        <span className="block text-xs text-slate-300">{episode.hook}</span>
      </span>
    </button>
  );
}

function PlayableGate({ gate, enter, agesLabel, liveLabel }: { gate: PlateGate & { href: string }; enter: string; agesLabel: string; liveLabel: string }) {
  const Icon = ICONS[gate.id] ?? Flame;
  return (
    <Link
      href={gate.href}
      data-testid={`gate-${gate.id}`}
      aria-label={`${gate.name}, ${agesLabel} ${gate.ages}, ${gate.hook}, ${enter}`}
      className="flex min-h-16 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      style={{ borderColor: `${gate.accent}88`, background: `linear-gradient(90deg, ${gate.accent}18, #07111f)` }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${gate.accent}24`, color: gate.accent }}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-heading text-base text-amber-50">{gate.name}</span>
          <StatusBadge live label={liveLabel} />
        </span>
        <span className="mt-0.5 block font-mono text-[11px] text-amber-100/70">{agesLabel} {gate.ages}</span>
        <span className="block text-sm text-slate-200">{gate.hook}</span>
      </span>
      <span className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-3 text-xs font-heading text-amber-100" style={{ background: `${gate.accent}28` }}>
        {enter}
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function ComingSoonGate({ gate, comingSoon, agesLabel }: { gate: PlateGate; comingSoon: string; agesLabel: string }) {
  const Icon = ICONS[gate.id] ?? Flame;
  return (
    <article
      data-testid={`gate-${gate.id}`}
      aria-disabled="true"
      aria-label={`${gate.name}, ${agesLabel} ${gate.ages}, ${comingSoon}`}
      className="flex min-h-16 w-full items-center gap-3 rounded-xl border border-white/10 bg-[#07111f] px-3 py-2"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-heading text-base text-slate-200">{gate.name}</span>
          <StatusBadge live={false} label={comingSoon} />
        </span>
        <span className="mt-0.5 block font-mono text-[11px] text-slate-400">{agesLabel} {gate.ages}</span>
      </span>
    </article>
  );
}

/**
 * Age-routed door. First paint is the three episodes.
 * A chosen episode reveals its modes. Only Episode 1 modes are links.
 */
export function GameModeGates() {
  const t = useT();
  const [openEpisode, setOpenEpisode] = useState<PlateEpisodeId | null>(null);
  const enter = t("home.gates.enter");
  const comingSoon = t("home.gates.comingSoon");
  const liveLabel = t("home.gates.live");
  const agesLabel = t("home.gates.ages");
  const open = PLATE_EPISODES.find((episode) => episode.id === openEpisode) ?? null;
  const gates = open ? PLATE_GATES.filter((gate) => gate.episode === open.id) : [];

  return (
    <section id="game-gates" aria-labelledby="game-gates-title" data-testid="home-game-gates">
      <DoorProgressStrip />
      <div className="container max-w-6xl px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mb-3">
          <PressPlayMark />
        </div>
        <div className="mb-3 text-center">
          <h2 id="game-gates-title" className="font-heading text-xl font-bold tracking-wide text-gold-gradient md:text-3xl">
            {PLATE_TITLE}
          </h2>
          <p className="mt-1 text-xs text-amber-200/80 md:text-sm">{PLATE_SUBTITLE}</p>
        </div>

        <div className="mb-3 text-left">
          <QuestInstrumentBay variant="capture" />
        </div>

        <div className="space-y-2" role="group" aria-label={t("home.gates.chooseEpisode")}>
          {PLATE_EPISODES.map((episode) => (
            <EpisodeDoor
              key={episode.id}
              episode={episode}
              expanded={openEpisode === episode.id}
              onChoose={() => setOpenEpisode((current) => current === episode.id ? null : episode.id)}
              liveLabel={liveLabel}
              comingSoon={comingSoon}
            />
          ))}
        </div>

        {open ? (
          <div className="mt-3 space-y-2" data-testid={`episode-panel-${open.id}`}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="min-w-0 font-heading text-sm leading-snug text-amber-100">
                <span className="block text-[11px] text-amber-200/80">{`Episode ${open.id} · Ages ${open.ages}`}</span>
                <span className="block whitespace-nowrap">{open.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setOpenEpisode(null)}
                className="inline-flex min-h-11 items-center px-2 text-xs text-amber-200 underline-offset-2 hover:underline"
              >
                {t("home.gates.allEpisodes")}
              </button>
            </div>
            {gates.map((gate) =>
              gate.href
                ? <PlayableGate key={gate.id} gate={{ ...gate, href: gate.href }} enter={enter} agesLabel={agesLabel} liveLabel={liveLabel} />
                : <ComingSoonGate key={gate.id} gate={gate} comingSoon={comingSoon} agesLabel={agesLabel} />
            )}
            {open.playable ? (
              <Link
                href="/explore/1"
                data-testid="gate-listen-fire"
                onClick={() => beginFireBedFromGesture()}
                className="inline-flex min-h-11 items-center text-sm text-amber-200 underline underline-offset-2"
              >
                {t("home.gates.listenFire")}
              </Link>
            ) : null}
          </div>
        ) : null}

        <p className="mt-4 text-center font-mono text-[11px] tracking-wide text-amber-200/70">{PLATE_FOUNDATION}</p>
        <p className="mt-1 text-center text-[11px] text-slate-400">{t("home.gates.overlap")}</p>
        <p className="mt-2 text-center text-xs text-slate-400">
          <Link href="/play/igo" className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-amber-300">
            {t("home.gates.widerGuide")}
          </Link>
        </p>
      </div>
    </section>
  );
}
