/**
 * The visitor stands in the Relay 2 chamber from the issued sensory board.
 * The poster title and the thirteen-hall footer stay off the picture.
 * Canopy light is a slow green breath through the leaves. It is not a flame.
 */
import {
  TREE_CHAMBER_HEIGHT,
  TREE_CHAMBER_SRC,
  TREE_CHAMBER_WIDTH,
} from "@shared/tectonTreesDeck";

export function TreeCanopy() {
  return (
    <figure data-testid="tree-canopy" className="w-full">
      <div className="relative w-full overflow-hidden bg-[#06140c]">
        <img
          src={TREE_CHAMBER_SRC}
          alt="Tree hall. An LED canopy of leaves over a living tree, with bark, seed specimens, planting beds, and a green wall."
          width={TREE_CHAMBER_WIDTH}
          height={TREE_CHAMBER_HEIGHT}
          decoding="async"
          fetchPriority="high"
          data-testid="tree-canopy-plate"
          className="block h-auto w-full"
        />
        <div className="tree-canopy-light pointer-events-none absolute inset-0" aria-hidden="true" />
      </div>
      <figcaption
        data-testid="tree-caption"
        className="bg-[#06140c] px-4 py-3 text-center font-sans text-base not-italic leading-relaxed tracking-normal text-emerald-50"
      >
        LED canopy. Growth across the leaves. 8,000 BCE.
      </figcaption>
    </figure>
  );
}
