import { useEffect, useRef } from "react";
import { TECTON_FIRE_DECK, tectonIcardSrc, type TectonFireCard } from "@shared/tectonFireDeck";

function pad(number: number): string {
  return String(number).padStart(2, "0");
}

/**
 * The 48 Tecton iCards, in deck order, under the nine harnessed discoveries.
 * A tap opens the illustrated plate. No new speech is generated.
 */
export function TectonFireLearnMore({
  opened,
  onOpen,
  onClose,
  onHear,
}: {
  opened: number | null;
  onOpen: (number: number) => void;
  onClose: () => void;
  onHear?: (recordedAs: string) => void;
}) {
  const openedCard = opened ? TECTON_FIRE_DECK[opened - 1] : undefined;

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
        Relay Block 1 of 12. Forty-eight fire phenomena, in deck order. Each one opens its Tecton iCard. The nine discoveries above are unchanged.
      </p>
      <div className="mt-5 flex flex-col gap-6">
        {TECTON_FIRE_DECK.map((card, index) => {
          const previous = TECTON_FIRE_DECK[index - 1];
          const showCategory = !previous || previous.category !== card.category;
          return (
            <div key={card.number} className={showCategory ? "" : "contents"}>
              {showCategory ? (
                <p className="font-sans text-xs tracking-[0.18em] text-amber-200/70 uppercase">{card.category}</p>
              ) : null}
              {showCategory ? (
                <ol className="grid grid-cols-2 gap-3">
                  {TECTON_FIRE_DECK.filter((item) => item.category === card.category).map((item) => (
                    <TectonFace key={item.number} card={item} onOpen={() => onOpen(item.number)} />
                  ))}
                </ol>
              ) : null}
            </div>
          );
        })}
      </div>
      {openedCard ? <TectonPlate card={openedCard} onClose={onClose} onHear={onHear} /> : null}
    </section>
  );
}

function TectonFace({ card, onOpen }: { card: TectonFireCard; onOpen: () => void }) {
  return (
    <li className="list-none">
      <button
        type="button"
        onClick={onOpen}
        data-testid={`tecton-card-${pad(card.number)}`}
        className="w-full touch-manipulation text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
      >
        <img
          src={tectonIcardSrc(card.number)}
          alt=""
          width={1400}
          height={1885}
          loading="lazy"
          className="aspect-[1400/1885] w-full rounded-md border border-amber-200/40 bg-[#07101c] object-cover"
        />
        <span className="mt-1.5 block font-sans text-sm font-medium leading-snug text-amber-50">
          {`${pad(card.number)} ${card.name}`}
        </span>
        <span className="mt-0.5 block font-sans text-xs leading-snug text-amber-100/75">{card.latin}</span>
      </button>
    </li>
  );
}

function TectonPlate({
  card,
  onClose,
  onHear,
}: {
  card: TectonFireCard;
  onClose: () => void;
  onHear?: (recordedAs: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
  }, [card.number]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tecton-plate-title"
      data-testid="tecton-plate"
      className="fixed inset-0 z-[80] overflow-y-auto bg-[#070b14]"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-amber-200/20 bg-[#070b14]/95 px-3 py-2">
        <p id="tecton-plate-title" className="font-sans text-sm font-medium text-amber-50">
          {`${pad(card.number)} ${card.name}`}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          data-testid="tecton-plate-close"
          className="inline-flex min-h-11 touch-manipulation items-center rounded-lg border border-amber-200/40 px-3 font-sans text-sm text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          Close
        </button>
      </div>
      <img
        src={tectonIcardSrc(card.number)}
        alt={`${card.name}. ${card.latin}.`}
        width={1400}
        height={1885}
        data-testid="tecton-plate-image"
        className="mx-auto block w-full max-w-[430px]"
      />
      <div className="mx-auto max-w-[430px] px-4 py-4 pb-24" data-testid={`tecton-note-${pad(card.number)}`}>
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
    </div>
  );
}
