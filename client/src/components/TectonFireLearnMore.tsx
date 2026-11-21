import { useState } from "react";
import { TECTON_FIRE_DECK, type TectonFireCard } from "@shared/tectonFireDeck";

function pad(number: number): string {
  return String(number).padStart(2, "0");
}

/**
 * Learn-more reading for the 48 Tecton phenomena.
 * Sits under the nine harnessed discoveries. No new speech is generated.
 */
export function TectonFireLearnMore({ onHear }: { onHear?: (recordedAs: string) => void }) {
  const [openNumber, setOpenNumber] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="tecton-fire-title"
      data-testid="tecton-learn-more"
      className="mt-10 border-t border-amber-300/25 pt-8"
    >
      <p className="font-sans text-xs tracking-[0.22em] text-amber-200/80 uppercase">Learn more</p>
      <h2 id="tecton-fire-title" className="mt-1 font-sans text-xl font-semibold tracking-normal text-amber-50">
        Tecton Fire Deck
      </h2>
      <p className="mt-2 max-w-prose font-sans text-sm leading-relaxed text-amber-100/90">
        Relay Block 1 of 12. Forty-eight fire phenomena, in deck order, for anyone who wants to read further. The nine discoveries above are unchanged.
      </p>
      <ol className="mt-5 flex flex-col gap-3">
        {TECTON_FIRE_DECK.map((card, index) => {
          const previous = TECTON_FIRE_DECK[index - 1];
          const showCategory = !previous || previous.category !== card.category;
          const open = openNumber === card.number;
          return (
            <li key={card.number} className="flex flex-col gap-2">
              {showCategory ? (
                <p className="pt-2 font-sans text-xs tracking-[0.18em] text-amber-200/70 uppercase">{card.category}</p>
              ) : null}
              <TectonRow card={card} open={open} onToggle={() => setOpenNumber(open ? null : card.number)} onHear={onHear} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function TectonRow({
  card,
  open,
  onToggle,
  onHear,
}: {
  card: TectonFireCard;
  open: boolean;
  onToggle: () => void;
  onHear?: (recordedAs: string) => void;
}) {
  return (
    <article className="rounded-xl border border-amber-300/30 bg-[#100c09]" data-testid={`tecton-card-${pad(card.number)}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex min-h-14 w-full touch-manipulation items-start gap-3 px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
      >
        <span className="mt-0.5 w-8 shrink-0 font-mono text-xs text-amber-200">{pad(card.number)}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-sans text-base font-medium leading-snug text-amber-50">{card.name}</span>
          <span className="mt-0.5 block font-sans text-sm leading-snug text-amber-100/75">{card.latin}</span>
        </span>
      </button>
      {open ? (
        <div className="border-t border-amber-300/20 px-3 py-3" data-testid={`tecton-note-${pad(card.number)}`}>
          <p className="font-sans text-base leading-relaxed text-amber-50">{card.note}</p>
          {card.recordedAs && onHear ? (
            <button
              type="button"
              onClick={() => onHear(card.recordedAs!)}
              className="mt-3 inline-flex min-h-11 touch-manipulation items-center rounded-lg border border-amber-300/50 px-3 font-sans text-sm text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
            >
              Hear the recorded discovery
            </button>
          ) : (
            <p className="mt-3 font-sans text-sm leading-relaxed text-amber-100/70">Read the note. This phenomenon has no separate recording.</p>
          )}
        </div>
      ) : null}
    </article>
  );
}
