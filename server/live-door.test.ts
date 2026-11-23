import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { RELAYS } from "../shared/gameData";
import { INVENTIONS } from "../shared/inventions";
import { PROLOGUE_BEGIN_LABEL, PROLOGUE_SCENES } from "../shared/prologueScenes";
import { PROLOGUE_RECORDINGS, prologueRecordingUrl } from "../client/src/lib/prologueAudio";
import {
  ACADEMY_HOST,
  ACADEMY_URL,
  CLASSIC_XP_FALLBACK,
  DUNGEON_COUNT,
  DUNGEON_ROOM_COUNT,
  GREY_MATTER_PATH,
  SCHOLAR_PATH,
  STATED_GENERATIONS,
  classicXpPerDiscovery,
  continueDungeonLabel,
  countExploredRelays,
  discoveryCount,
  dungeonsCleared,
  litRelayIndexes,
  mergeRelayProgress,
  parseRelayQuery,
  presentPlayerCopy,
  recordDiscovery,
} from "../shared/playerProgress";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function caller(user: TrpcContext["user"]) {
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie() {} } as unknown as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

describe("live-door route and progress fixes", () => {
  it("names the canonical Grey Matter and Scholar paths", () => {
    expect(GREY_MATTER_PATH).toBe("/explore/greymatter");
    expect(SCHOLAR_PATH).toBe("/create");
    expect(ACADEMY_URL).toBe("https://www.infrastructure-academy.com");
    expect(ACADEMY_HOST).toBe("www.infrastructure-academy.com");
  });

  it("opens a named relay from the home query and ignores a bad one", () => {
    expect(parseRelayQuery("?relay=1")).toBe(1);
    expect(parseRelayQuery("?relay=12")).toBe(12);
    expect(parseRelayQuery("?relay=0")).toBeNull();
    expect(parseRelayQuery("?relay=13")).toBeNull();
    expect(parseRelayQuery("?relay=grey-matter")).toBeNull();
    expect(parseRelayQuery("")).toBeNull();
  });

  it("lights the collection grid from discoveries, not only the spinner", () => {
    let map = recordDiscovery({}, 1, 0).map;
    map = recordDiscovery(map, 12, 0).map;
    const lit = litRelayIndexes({ discoveries: map, spinnerCollection: [], earnedPowers: [] });
    expect(lit).toEqual([0, 11]);
    expect(discoveryCount(map)).toBe(2);
  });

  it("shares a Grey Matter power onto the same grid", () => {
    const lit = litRelayIndexes({ discoveries: {}, spinnerCollection: [], earnedPowers: [2] });
    expect(lit).toEqual([1]);
  });

  it("counts a relay as explored after one discovery, before it is complete", () => {
    const rows = Array.from({ length: 12 }, (_, index) => ({
      relayNumber: index + 1,
      completionPct: 11,
      discoveredItems: [0],
    }));
    expect(countExploredRelays(rows)).toBe(12);
    expect(rows.every((row) => (row.completionPct ?? 0) < 100)).toBe(true);
  });

  it("does not let a later mode erase discoveries or XP already stored", () => {
    const merged = mergeRelayProgress(
      { discoveredItems: [0], completionPct: 11, xpEarned: 49_222 },
      { discoveredItems: [1], completionPct: 22, xpEarned: 0 },
    );
    expect(merged.discoveredItems).toEqual([0, 1]);
    expect(merged.completionPct).toBe(22);
    expect(merged.xpEarned).toBe(49_222);
  });

  it("uses the large classic XP economy for Hearth, never a flat +100", () => {
    const hearthCount = INVENTIONS[1].length;
    expect(INVENTIONS[1][0].name).toBe("Hearth");
    expect(classicXpPerDiscovery(442_998, hearthCount)).toBe(49_222);
    expect(classicXpPerDiscovery(null, hearthCount)).toBe(Math.floor(CLASSIC_XP_FALLBACK / hearthCount));
    expect(classicXpPerDiscovery(undefined, hearthCount)).toBeGreaterThan(100);
    const mobile = source("client/src/pages/MobileExplorer.tsx");
    expect(mobile).toContain("classicXpPerDiscovery");
    expect(mobile).not.toContain("+ 100");
    expect(mobile).not.toContain('t("explore.title")');
    expect(mobile).not.toContain('t("tab.rank")');
  });

  it("labels the saved dungeon relay without an off-by-one", () => {
    expect(continueDungeonLabel(1, RELAYS)).toEqual({ number: 1, name: "Fire" });
    expect(continueDungeonLabel(2, RELAYS)).toEqual({ number: 2, name: "Tree" });
  });

  it("counts cleared dungeons out of twelve, and rooms out of eight", () => {
    expect(DUNGEON_COUNT).toBe(12);
    expect(DUNGEON_ROOM_COUNT).toBe(8);
    expect(dungeonsCleared(["1-0"])).toBe(0);
    const oneDungeon = Array.from({ length: 8 }, (_, room) => `4-${room}`);
    expect(dungeonsCleared(oneDungeon)).toBe(1);
    expect(dungeonsCleared([...oneDungeon, "5-0"])).toBe(1);
  });

  it("keeps six unique prologue beats and story text on the final slide", () => {
    expect(PROLOGUE_SCENES).toHaveLength(6);
    const texts = PROLOGUE_SCENES.map((scene) => scene.text);
    expect(new Set(texts).size).toBe(6);
    const last = PROLOGUE_SCENES[5];
    expect(last.text).toContain("Fire");
    expect(last.subtext.length).toBeGreaterThan(0);
    expect(PROLOGUE_BEGIN_LABEL).toBe("BEGIN RELAY 1");
    expect(source("client/src/pages/Prologue.tsx")).toContain("scene.text");
    expect(source("client/src/pages/Prologue.tsx")).toContain("PROLOGUE_BEGIN_LABEL");
    const page = source("client/src/pages/Prologue.tsx");
    expect(page).not.toContain("davidSpeak");
    expect(page).not.toContain("speechSynthesis");
    expect(page).toContain("pointerdown");
    expect(page).toContain("prologueRecordingUrl");
    expect(prologueRecordingUrl("scene2", "en")).toBe("/audio/prologue/02_signal.mp3");
    expect(prologueRecordingUrl("scene2", "zh-HK")).toBeNull();
    expect(PROLOGUE_RECORDINGS.map((row) => row.sceneId)).toEqual(PROLOGUE_SCENES.map((scene) => scene.id));
    for (const row of PROLOGUE_RECORDINGS) {
      for (const root of ["client/public", "docs"]) {
        const path = new URL(`../${root}/audio/prologue/${row.file}`, import.meta.url);
        const bytes = readFileSync(path);
        expect(createHash("sha256").update(bytes).digest("hex")).toBe(row.sha256);
        expect(statSync(path).size).toBe(row.bytes);
      }
    }
  });

  it("repairs missing spaces and raw markdown in player-facing narrative", () => {
    expect(presentPlayerCopy("infrastructure.Your odyssey begins.")).toBe("infrastructure. Your odyssey begins.");
    expect(presentPlayerCopy("system.The clock is ticking.")).toBe("system. The clock is ticking.");
    expect(presentPlayerCopy("Field.Like the Yaka Arrow.")).toBe("Field. Like the Yaka Arrow.");
    expect(presentPlayerCopy("thesis.Like the Quill Mask.")).toBe("thesis. Like the Quill Mask.");
    expect(presentPlayerCopy("You discover **Controlled Fire**.")).toBe("You discover Controlled Fire.");
    expect(presentPlayerCopy("1.7M XP")).toBe("1.7M XP");
  });

  it("states 500 generations", () => {
    expect(STATED_GENERATIONS).toBe(500);
    expect(source("client/src/pages/Home.tsx")).toContain("STATED_GENERATIONS");
    expect(source("client/src/pages/Home.tsx")).not.toContain("useCountUp");
  });

  it("routes Grey Matter, Scholar, relay queries, and the Academy front door", () => {
    const app = source("client/src/App.tsx");
    expect(app).toContain('path={"/explore/grey-matter"}');
    expect(app).toContain('path={"/explore/greymatter"}');
    expect(app).toContain('path={"/scholar"}');
    expect(app).toContain('path={"/create"}');
    const homeLinks = source("shared/plateGates.ts") + source("client/src/components/InteractivePipeline.tsx") + source("client/src/components/PipelineHotspots.tsx") + source("client/src/components/ContinueBanner.tsx");
    expect(homeLinks).not.toContain("/explore/grey-matter");
    expect(homeLinks).not.toContain('"/scholar"');
    expect(homeLinks).toContain("GREY_MATTER_PATH");
    expect(homeLinks).toContain("SCHOLAR_PATH");
    expect(source("client/src/components/NetworkBar.tsx")).toContain("ACADEMY_URL");
    expect(source("server/routers.ts")).toContain("ACADEMY_HOST");
    expect(source("server/routers.ts")).not.toContain("infra-acad-kuqzaex2.manus.space");
  });

  it("does not serve iGO registrations to an anonymous or non-admin caller", async () => {
    const anonymous = caller(null);
    await expect(anonymous.igo.list()).rejects.toBeInstanceOf(TRPCError);
    await expect(anonymous.igo.stats()).rejects.toMatchObject({ code: "FORBIDDEN" });
    const player = caller({
      id: 2,
      openId: "player",
      email: "player@example.com",
      name: "Player",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    });
    await expect(player.igo.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(player.igo.stats()).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(source("client/src/pages/IgoAdmin.tsx")).toContain('user?.role === "admin"');
  });

  it("shows framework content for the selected tab and does not claim an empty catalogue while loading", () => {
    const frameworks = source("client/src/pages/Frameworks.tsx");
    expect(frameworks).toContain('data-framework-panel={activeTab}');
    expect(frameworks).toContain('activeTab === "laws"');
    expect(frameworks).not.toContain('<AnimatePresence mode="wait">');
    const media = source("client/src/pages/MediaGallery.tsx");
    expect(media).toContain("media.loadingCatalogue");
    expect(media).not.toContain("{stats?.total ?? 0} assets across {bridges.length} bridges");
  });
});
