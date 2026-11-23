/**
 * Films already held as playback sources. The public doors loop this reel
 * so the picture keeps moving. None of these are generated here, and none
 * are GitHub Release download URLs.
 */
export const HELD_DOOR_FILMS = [
  {
    title: "Flight Deck",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/flightdeck-clip-v5_b45064f9.mp4",
  },
  {
    title: "Scholar",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/scholar-clip-v6_adca97d1.mp4",
  },
  {
    title: "Relay Spinner",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v1-relay-spinner_641673d9.mp4",
  },
  {
    title: "Dungeon Crawl",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v2-dungeon-crawl_3914ce50.mp4",
  },
  {
    title: "Grey Matter",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v3-grey-matter_5eaff673.mp4",
  },
  {
    title: "Flight Deck Spec",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v4a-v2_4d1e0f2d.mp4",
  },
  {
    title: "Starborne",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v4b-starborne-v2_3da00f9a.mp4",
  },
  {
    title: "Star Wars Alt",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v4b-starwars-v2_4c907eed.mp4",
  },
  {
    title: "Scholar's Secret",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v5a-v2_a35db770.mp4",
  },
  {
    title: "Middle-Earth",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v5b-v2_7d94978c.mp4",
  },
  {
    title: "iGO trailer",
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/iGO_trailer_v7_6a22857c.mp4",
  },
] as const;

/** Start on the door's own film, then continue through the rest, then loop. */
export function doorReelFrom(src: string): string[] {
  const urls = HELD_DOOR_FILMS.map((film) => film.src);
  const start = urls.indexOf(src);
  if (start < 0) return [src, ...urls];
  return [...urls.slice(start), ...urls.slice(0, start)];
}

export function doorFilmTitle(src: string): string {
  return HELD_DOOR_FILMS.find((film) => film.src === src)?.title ?? "Film";
}
