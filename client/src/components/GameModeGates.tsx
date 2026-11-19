import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import {
  PLATE_EPISODES,
  PLATE_FOUNDATION,
  PLATE_GATES,
  PLATE_SUBTITLE,
  PLATE_TITLE,
  type PlateGate,
} from "@shared/plateGates";

function PlayableGate({ gate, enter, agesLabel }: { gate: PlateGate & { href: string }; enter: string; agesLabel: string }) {
  return (
    <Link
      href={gate.href}
      data-testid={`gate-${gate.id}`}
      aria-label={`${gate.name}, ${agesLabel} ${gate.ages}, ${enter}`}
      className="group flex min-h-28 flex-col justify-between rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-left transition-colors hover:border-amber-300 hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span>
        <span className="block font-heading text-base font-semibold tracking-wide text-foreground">{gate.name}</span>
        <span className="mt-1 block font-mono text-[11px] text-amber-200/80">
          {agesLabel} {gate.ages}
        </span>
      </span>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-heading tracking-wide text-amber-300">
        {enter}
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function ComingSoonGate({ gate, comingSoon, agesLabel }: { gate: PlateGate; comingSoon: string; agesLabel: string }) {
  return (
    <article
      data-testid={`gate-${gate.id}`}
      aria-disabled="true"
      aria-label={`${gate.name}, ${agesLabel} ${gate.ages}, ${comingSoon}`}
      className="flex min-h-28 flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4"
    >
      <span>
        <span className="block font-heading text-base font-semibold tracking-wide text-foreground/80">{gate.name}</span>
        <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
          {agesLabel} {gate.ages}
        </span>
      </span>
      <span className="mt-4 text-xs font-heading tracking-wide text-muted-foreground">{comingSoon}</span>
    </article>
  );
}

/**
 * The eleven plate gates on Home. Playable gates are real routes.
 * Later modules are labelled Coming soon and are not links.
 */
export function GameModeGates() {
  const t = useT();
  const enter = t("home.gates.enter");
  const comingSoon = t("home.gates.comingSoon");
  const agesLabel = t("home.gates.ages");

  return (
    <section id="game-gates" aria-labelledby="game-gates-title" className="container max-w-6xl px-4 pb-8 pt-2" data-testid="home-game-gates">
      <div className="mb-6 text-center">
        <h2 id="game-gates-title" className="font-heading text-2xl font-bold tracking-wide text-gold-gradient md:text-4xl">
          {PLATE_TITLE}
        </h2>
        <p className="mt-2 text-sm text-amber-200/80 md:text-base">{PLATE_SUBTITLE}</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t("home.gates.choose")}</p>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground/80">{t("home.gates.overlap")}</p>
      </div>

      <div className="space-y-8">
        {PLATE_EPISODES.map((episode) => {
          const gates = PLATE_GATES.filter((gate) => gate.episode === episode.id);
          const status = episode.playable ? t("home.gates.openToPlay") : comingSoon;
          return (
            <div key={episode.id}>
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="font-heading text-sm tracking-wide text-foreground md:text-base">
                  {`Episode ${episode.id} (Ages ${episode.ages}): ${episode.name}`}
                </h3>
                <p className={`text-[11px] font-heading tracking-wide ${episode.playable ? "text-amber-300" : "text-muted-foreground"}`}>
                  {status}
                </p>
              </div>
              <div
                className={
                  episode.id === 1
                    ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5"
                    : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                }
              >
                {gates.map((gate) =>
                  gate.href
                    ? <PlayableGate key={gate.id} gate={{ ...gate, href: gate.href }} enter={enter} agesLabel={agesLabel} />
                    : <ComingSoonGate key={gate.id} gate={gate} comingSoon={comingSoon} agesLabel={agesLabel} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center font-mono text-xs tracking-wide text-amber-200/70 md:text-sm">{PLATE_FOUNDATION}</p>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        <Link href="/play/igo" className="underline underline-offset-2 hover:text-amber-300">
          {t("home.gates.widerGuide")}
        </Link>
      </p>
    </section>
  );
}
