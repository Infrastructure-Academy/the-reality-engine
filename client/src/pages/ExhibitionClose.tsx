import { Link } from "wouter";
import { PORTAL_PATH, V6_CLIPS, ZERO_IS_NOT_A_HALL } from "@shared/exhibitionPortal";
import { ExhibitionClip } from "@/components/ExhibitionClip";
import { EXHIBITION_PLATE_TYPE } from "@/components/ExplorerVideo";

const closeClip = V6_CLIPS.find((clip) => clip.id === "13_close");

/** The Fractal Connector epilogue. Not a relay, and not a fourteenth hall. */
export default function ExhibitionClose() {
  return (
    <div className="mobile-content-pad min-h-screen overflow-x-hidden bg-[#050912] text-amber-50" data-testid="portal-close">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href={PORTAL_PATH}
          className="inline-flex min-h-11 touch-manipulation items-center text-sm text-amber-100 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          Back to the floor
        </Link>
        <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/80">Epilogue</p>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-12">
        <h1 className="font-heading text-amber-50" style={EXHIBITION_PLATE_TYPE}>
          Fractal Connector
        </h1>
        <p className="mt-2 text-amber-50" style={EXHIBITION_PLATE_TYPE}>
          The Exhibition Itself
        </p>
        <p className="mt-3 text-amber-50" style={EXHIBITION_PLATE_TYPE} data-testid="portal-close-line">
          The epilogue of Episode 1. The motto is held as shown. {ZERO_IS_NOT_A_HALL}
        </p>
        {closeClip ? <ExhibitionClip clip={closeClip} testId="portal-close-film" /> : null}
        <p className="mt-6 text-amber-50" style={EXHIBITION_PLATE_TYPE}>
          Human Nodes stays hall 12. This room is the epilogue.
        </p>
        <Link
          href="/explore/12"
          className="mt-4 inline-flex min-h-12 touch-manipulation items-center justify-center rounded-xl border border-amber-300/70 px-4 text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          style={EXHIBITION_PLATE_TYPE}
        >
          Human Nodes
        </Link>
      </main>
    </div>
  );
}
