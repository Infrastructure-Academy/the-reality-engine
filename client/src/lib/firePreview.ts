/** Phone cut of the Fire review preview. Served as a static file, same way as the story mp3. */
export const FIRE_PREVIEW_PORTRAIT_URL = "/video/fire-preview-9x16.mp4";

/** Widescreen cut of the same Fire review preview. */
export const FIRE_PREVIEW_WIDE_URL = "/video/fire-preview-16x9.mp4";

/** Still shown before play. It does not start the video. */
export const FIRE_PREVIEW_PORTRAIT_POSTER = "/video/fire-preview-9x16.jpg";
export const FIRE_PREVIEW_WIDE_POSTER = "/video/fire-preview-16x9.jpg";

/**
 * Tall viewports, including an iPhone held upright, get the 9:16 cut.
 * Wide viewports get the 16:9 cut.
 */
export const FIRE_PREVIEW_TALL_QUERY = "(max-aspect-ratio: 1/1)";

export type FirePreviewCut = "portrait" | "wide";

export function firePreviewUrl(tallViewport: boolean): string {
  return tallViewport ? FIRE_PREVIEW_PORTRAIT_URL : FIRE_PREVIEW_WIDE_URL;
}

export function firePreviewPoster(tallViewport: boolean): string {
  return tallViewport ? FIRE_PREVIEW_PORTRAIT_POSTER : FIRE_PREVIEW_WIDE_POSTER;
}
