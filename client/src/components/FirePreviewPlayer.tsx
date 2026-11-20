import { useEffect, useState } from "react";
import {
  FIRE_PREVIEW_TALL_QUERY,
  firePreviewPoster,
  firePreviewUrl,
  type FirePreviewCut,
} from "@/lib/firePreview";

function currentCut(): FirePreviewCut {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "portrait";
  return window.matchMedia(FIRE_PREVIEW_TALL_QUERY).matches ? "portrait" : "wide";
}

/**
 * Inline review player for the Fire relay.
 * Native controls only: nothing plays until the visitor presses play.
 */
export function FirePreviewPlayer() {
  const [cut, setCut] = useState<FirePreviewCut>(currentCut);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(FIRE_PREVIEW_TALL_QUERY);
    const apply = () => setCut(media.matches ? "portrait" : "wide");
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const portrait = cut === "portrait";
  const src = firePreviewUrl(portrait);
  const poster = firePreviewPoster(portrait);

  return (
    <figure data-testid="fire-preview" data-cut={cut} className="mb-6">
      <figcaption className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-300">
        Fire preview — Ignition, The Composer
      </figcaption>
      <video
        key={src}
        data-testid="fire-preview-video"
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        width={portrait ? 1080 : 1920}
        height={portrait ? 1920 : 1080}
        aria-label="Fire preview, Ignition — The Composer"
        className={
          portrait
            ? "mx-auto block h-auto max-h-[38vh] w-auto max-w-full rounded-xl bg-black sm:max-h-[70vh]"
            : "mx-auto block aspect-video h-auto max-h-[70vh] w-full rounded-xl bg-black object-contain"
        }
      />
    </figure>
  );
}
