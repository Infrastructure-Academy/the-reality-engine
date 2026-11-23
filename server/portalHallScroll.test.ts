import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

function phoneRowPage(width: number): string {
  const halls = Array.from({ length: 13 }, (_, index) => index + 1);
  const buttons = halls
    .map(
      (number) =>
        `<div data-hall="${number}" style="width:4.6rem;flex-shrink:0;height:76px">${number}</div>`,
    )
    .join("");
  return `<!doctype html>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; width: ${width}px; overflow-x: hidden; }
  #row {
    width: 100%;
    min-width: 0;
    overflow-x: auto;
    touch-action: pan-x;
    overscroll-behavior-x: contain;
    pointer-events: auto;
  }
  #track { display: flex; width: max-content; align-items: flex-end; gap: 0.25rem; padding-right: 0.5rem; }
</style>
<body>
  <div style="overflow:hidden;width:${width}px">
    <div id="row" data-testid="portal-hall-row"><div id="track">${buttons}</div></div>
  </div>
  <pre id="out"></pre>
  <script>
    const row = document.getElementById("row");
    const reachable = [];
    for (let number = 1; number <= 12; number += 1) {
      const hall = document.querySelector('[data-hall="' + number + '"]');
      row.scrollLeft = hall.offsetLeft;
      const hallBox = hall.getBoundingClientRect();
      const rowBox = row.getBoundingClientRect();
      const shown = hallBox.left >= rowBox.left - 1 && hallBox.right <= rowBox.right + 1;
      if (shown) reachable.push(number);
    }
    const last = document.querySelector('[data-hall="13"]');
    row.scrollLeft = last.offsetLeft;
    const lastBox = last.getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    document.getElementById("out").textContent = JSON.stringify({
      clientWidth: row.clientWidth,
      scrollWidth: row.scrollWidth,
      reachable,
      thirteenInside: lastBox.left >= rowBox.left - 1 && lastBox.right <= rowBox.right + 1
    });
  </script>
</body>`;
}

describe("portal hall row on a phone", () => {
  it("keeps the row a sideways scrollport once the halls are shown", () => {
    const opening = source("client/src/components/PlanetOpening.tsx");
    expect(opening).toContain('data-testid="portal-hall-row"');
    expect(opening).toContain("overflow-x-auto");
    expect(opening).toContain("min-w-0");
    expect(opening).toContain("touch-pan-x");
    expect(opening).toContain("w-max");
    expect(opening).toContain('pointerEvents = showShafts ? "auto" : "none"');
    expect(opening).not.toContain('pointerEvents = "none"');
  });

  it("scrolls a 390px row far enough to reveal halls 1 through 12", () => {
    const dir = mkdtempSync(join(tmpdir(), "portal-hall-"));
    const file = join(dir, "row.html");
    writeFileSync(file, phoneRowPage(390));
    const chrome = spawnSync(
      "timeout",
      [
        "12",
        "google-chrome",
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=390,844",
        "--timeout=4000",
        "--dump-dom",
        `file://${file}`,
      ],
      { encoding: "utf8" },
    );
    expect([0, 124]).toContain(chrome.status);
    const match = chrome.stdout.match(/<pre id="out">([\s\S]*?)<\/pre>/);
    expect(match).toBeTruthy();
    const report = JSON.parse(match?.[1] ?? "{}") as {
      clientWidth: number;
      scrollWidth: number;
      reachable: number[];
      thirteenInside: boolean;
    };
    expect(report.clientWidth).toBeLessThanOrEqual(390);
    expect(report.scrollWidth).toBeGreaterThan(report.clientWidth);
    expect(report.reachable).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(report.thirteenInside).toBe(true);
  });
});
