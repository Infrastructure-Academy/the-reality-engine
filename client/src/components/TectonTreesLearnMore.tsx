import { useEffect, useRef } from "react";
import {
  TECTON_TREES_DECK,
  TREE_CARD_HEIGHT,
  TREE_CARD_WIDTH,
  tectonTreeSrc,
  type TectonTreeCard,
} from "@shared/tectonTreesDeck";
import { protocolLine, treeProtocolFor } from "@shared/tectonTreesProtocol";

function pad(number: number): string {
  return String(number).padStart(2, "0");
}

function categoryRuns(deck: readonly TectonTreeCard[]): { category: string; cards: TectonTreeCard[] }[] {
  const runs: { category: string; cards: TectonTreeCard[] }[] = [];
  for (const card of deck) {
    const last = runs[runs.length - 1];
    if (!last || last.category !== card.category) {
      runs.push({ category: card.category, cards: [card] });
    } else {
      last.cards.push(card);
    }
  }
  return runs;
}

/**
 * The Tecton tree iCards, in deck order, under the nine Tree discoveries.
 * A tap opens the illustrated plate. No new speech is generated.
 */
export function TectonTreesLearnMore({
  opened,
  onOpen,
  onClose,
}: {
  opened: number | null;
  onOpen: (order: number) => void;
  onClose: () => void;
}) {
  const openedCard = opened ? TECTON_TREES_DECK[opened - 1] : undefined;
  const runs = categoryRuns(TECTON_TREES_DECK);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  // Opening a plate adds one history entry on this same hall. Back pops that
  // entry and closes the plate. It does not leave /explore/2 for Fire.
  useEffect(() => {
    if (opened == null) return;
    window.history.pushState({ treePlate: opened }, "");
    const onPop = () => onCloseRef.current();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [opened]);

  return (
    <section
      aria-labelledby="tecton-trees-title"
      data-testid="tecton-trees-learn-more"
      className="mt-10 scroll-mb-28 border-t border-emerald-300/25 pb-28 pt-8"
    >
      <p className="font-sans text-xs tracking-[0.22em] text-emerald-200/80 uppercase">Learn more</p>
      <h2 id="tecton-trees-title" className="mt-1 font-sans text-xl font-semibold tracking-normal text-emerald-50">
        Tecton Trees Deck
      </h2>
      <p className="mt-2 max-w-prose font-sans text-sm leading-relaxed text-emerald-100/90">
        Relay Block 2 of 12. Forty-seven trees, in deck order. Each one opens its Tecton iCard. The nine discoveries above are unchanged.
      </p>
      <div className="mt-5 flex flex-col gap-6">
        {runs.map((run) => (
          <div key={`${run.category}-${run.cards[0].order}`}>
            <p className="font-sans text-xs tracking-[0.18em] text-emerald-200/70 uppercase">{run.category}</p>
            <ol className="mt-2 grid grid-cols-2 gap-3">
              {run.cards.map((card) => (
                <TreeFace key={card.order} card={card} onOpen={() => onOpen(card.order)} />
              ))}
            </ol>
          </div>
        ))}
      </div>
      {openedCard ? <TreePlate card={openedCard} onClose={onClose} /> : null}
    </section>
  );
}

function TreeFace({ card, onOpen }: { card: TectonTreeCard; onOpen: () => void }) {
  const protocol = treeProtocolFor(card);
  return (
    <li className="list-none scroll-mb-28">
      <button
        type="button"
        onClick={onOpen}
        data-testid={`tree-card-${pad(card.order)}`}
        className="w-full touch-manipulation scroll-mb-28 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
      >
        <img
          src={tectonTreeSrc(card.order)}
          alt=""
          width={TREE_CARD_WIDTH}
          height={TREE_CARD_HEIGHT}
          decoding="async"
          fetchPriority={card.order <= 4 ? "high" : "auto"}
          className="block aspect-[408/607] w-full rounded-md border border-emerald-200/40 bg-[#06140c] object-cover"
        />
        <span className="mt-1.5 block font-sans text-sm font-medium leading-snug text-emerald-50">
          {`${pad(card.number)} ${card.name}`}
        </span>
        <span className="mt-0.5 block font-sans text-xs leading-snug text-emerald-100/75">{card.latin}</span>
        {protocol ? (
          <span className="mt-1 block scroll-mb-28 font-sans text-[11px] leading-snug text-emerald-100/80" data-testid={`tree-protocol-${pad(card.order)}`}>
            {protocolLine(protocol)}
          </span>
        ) : null}
      </button>
    </li>
  );
}

function TreePlate({ card, onClose }: { card: TectonTreeCard; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card.order]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tecton-tree-plate-title"
      data-testid="tree-plate"
      className="fixed inset-0 z-[80] overflow-y-auto bg-[#06140c]"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-emerald-200/20 bg-[#06140c]/95 px-3 py-2">
        <p id="tecton-tree-plate-title" className="font-sans text-sm font-medium text-emerald-50">
          {`${pad(card.number)} ${card.name}`}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          data-testid="tree-plate-close"
          className="inline-flex min-h-11 touch-manipulation items-center rounded-lg border border-emerald-200/40 px-3 font-sans text-sm text-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
        >
          Close
        </button>
      </div>
      <img
        src={tectonTreeSrc(card.order)}
        alt={`${card.name}. ${card.latin}.`}
        width={TREE_CARD_WIDTH}
        height={TREE_CARD_HEIGHT}
        data-testid="tree-plate-image"
        className="mx-auto block w-full max-w-[430px]"
      />
      <div className="mx-auto max-w-[430px] px-4 py-4 pb-24" data-testid={`tree-note-${pad(card.order)}`}>
        <p className="font-sans text-base leading-relaxed text-emerald-50">{card.note}</p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-emerald-100/70">
          Read the note. This tree has no separate recording.
        </p>
      </div>
    </div>
  );
}
