import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  FIRE_PREVIEW_PORTRAIT_URL,
  FIRE_PREVIEW_WIDE_URL,
  firePreviewPoster,
  firePreviewUrl,
} from "@/lib/firePreview";
import { FIRE_STORY_AUDIO_URL } from "@/lib/storyAudio";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const file = (path: string) => new URL(`../${path}`, import.meta.url);

describe("fire preview videos", () => {
  it("chooses the phone cut for a tall viewport and the wide cut otherwise", () => {
    expect(firePreviewUrl(true)).toBe("/video/fire-preview-9x16.mp4");
    expect(firePreviewUrl(false)).toBe("/video/fire-preview-16x9.mp4");
    expect(firePreviewPoster(true)).toBe("/video/fire-preview-9x16.jpg");
    expect(firePreviewPoster(false)).toBe("/video/fire-preview-16x9.jpg");
    expect(FIRE_PREVIEW_PORTRAIT_URL).toBe("/video/fire-preview-9x16.mp4");
    expect(FIRE_PREVIEW_WIDE_URL).toBe("/video/fire-preview-16x9.mp4");
  });

  it("keeps both cuts in the public tree and leaves the Fire story mp3 in place", () => {
    const portrait = file("client/public/video/fire-preview-9x16.mp4");
    const wide = file("client/public/video/fire-preview-16x9.mp4");
    const story = file("client/public/audio/relay-1-fire-en.mp3");
    const publishedPortrait = file("docs/video/fire-preview-9x16.mp4");
    const publishedWide = file("docs/video/fire-preview-16x9.mp4");
    const publishedStory = file("docs/audio/relay-1-fire-en.mp3");
    expect(existsSync(portrait)).toBe(true);
    expect(existsSync(wide)).toBe(true);
    expect(existsSync(story)).toBe(true);
    expect(existsSync(publishedPortrait)).toBe(true);
    expect(existsSync(publishedWide)).toBe(true);
    expect(existsSync(publishedStory)).toBe(true);
    expect(statSync(publishedPortrait).size).toBe(statSync(portrait).size);
    expect(statSync(publishedWide).size).toBe(statSync(wide).size);
    expect(statSync(portrait).size).toBeGreaterThan(1_000_000);
    expect(statSync(wide).size).toBeGreaterThan(1_000_000);
    expect(statSync(story).size).toBeGreaterThan(10_000);
    expect(FIRE_STORY_AUDIO_URL).toBe("/audio/relay-1-fire-en.mp3");
  });

  it("offers one user-controlled player on the Fire relay and does not autoplay", () => {
    const player = source("client/src/components/FirePreviewPlayer.tsx");
    expect(player).toContain("controls");
    expect(player).toContain("playsInline");
    expect(player).toContain('data-testid="fire-preview-video"');
    expect(player).not.toMatch(/autoPlay|autoplay/);
    expect(player).not.toContain(".play(");

    const relay = source("client/src/pages/ExplorerRelay.tsx");
    expect(relay).toContain("{relayNum === 1 && <FirePreviewPlayer />}");
    expect(relay).toContain("StoryPlayBar");

    const bar = source("client/src/components/StoryPlayBar.tsx");
    expect(bar).not.toMatch(/autoPlay|autoplay/);
    expect(bar).toContain('data-testid="story-play"');

    const home = source("client/src/components/GameModeGates.tsx");
    expect(home).not.toContain("fire-preview");
    const spinner = source("client/src/pages/RelaySpinner.tsx");
    expect(spinner).not.toContain("FirePreviewPlayer");
  });
});
