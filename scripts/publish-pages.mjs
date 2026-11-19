/**
 * Publish the Quest client to /docs for GitHub Pages.
 *
 * GitHub Pages for this repo is already set to branch main, folder /docs,
 * custom domain app.infrastructure-academy.com. Merging this output to main
 * is what makes https://app.infrastructure-academy.com/ serve the game.
 * This script does not deploy, patch, or call any manus.space host.
 *
 *   pnpm pages
 *
 * Then commit /docs, including CNAME, index.html, 404.html, and the assets.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docs = path.join(root, "docs");
const cnamePath = path.join(docs, "CNAME");
const expectedCname = "app.infrastructure-academy.com";

const previousCname = fs.existsSync(cnamePath)
  ? fs.readFileSync(cnamePath, "utf8").trim()
  : expectedCname;

if (previousCname !== expectedCname) {
  console.error(`Refusing to publish: docs/CNAME is "${previousCname}", expected ${expectedCname}`);
  process.exit(1);
}

const build = spawnSync("pnpm", ["exec", "vite", "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, VITE_PAGES: "1" },
});

function restoreCname() {
  fs.mkdirSync(docs, { recursive: true });
  fs.writeFileSync(cnamePath, `${expectedCname}\n`);
}

if (build.status !== 0) {
  restoreCname();
  process.exit(build.status ?? 1);
}

restoreCname();

const indexPath = path.join(docs, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error("Vite did not write docs/index.html");
  process.exit(1);
}

let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(/<script[^>]*src="[^"]*umami"[^>]*><\/script>\s*/gi, "");
html = html.replace(/<script[^>]*>[^<]*__MANUS_HOST_DEV__[\s\S]*?<\/script>\s*/gi, "");
fs.writeFileSync(indexPath, html);
fs.copyFileSync(indexPath, path.join(docs, "404.html"));
fs.writeFileSync(path.join(docs, ".nojekyll"), "");

const manusDir = path.join(docs, "__manus__");
if (fs.existsSync(manusDir)) fs.rmSync(manusDir, { recursive: true, force: true });
const gitkeep = path.join(docs, ".gitkeep");
if (fs.existsSync(gitkeep)) fs.rmSync(gitkeep);

const published = fs.readFileSync(indexPath, "utf8");
const problems = [];
if (!published.includes("<div id=\"root\">") && !published.includes("<div id=\"root\"></div>")) {
  problems.push("index.html has no #root");
}
if (/manus-runtime|__MANUS_HOST_DEV__|Made with Manus|manus\.space/i.test(published)) {
  problems.push("index.html still exposes Manus");
}
if (!fs.existsSync(path.join(docs, "404.html"))) problems.push("404.html missing");
const assetDir = path.join(docs, "assets");
if (!fs.existsSync(assetDir)) problems.push("assets directory missing");
if (fs.readFileSync(cnamePath, "utf8").trim() !== expectedCname) problems.push("CNAME was not preserved");

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`Published Quest to ${docs}`);
console.log("GitHub Pages will serve it at https://app.infrastructure-academy.com/ after merge to main.");
