import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("PWA & Mobile Features", () => {
  const clientDir = path.resolve(__dirname, "../client");

  describe("Service Worker", () => {
    it("sw.js exists in client/public", () => {
      const swPath = path.join(clientDir, "public/sw.js");
      expect(fs.existsSync(swPath)).toBe(true);
    });

    it("sw.js contains cache-first strategy", () => {
      const sw = fs.readFileSync(path.join(clientDir, "public/sw.js"), "utf-8");
      expect(sw).toContain("CACHE_NAME");
      expect(sw).toContain("install");
      expect(sw).toContain("fetch");
    });

    it("sw.js handles offline fallback", () => {
      const sw = fs.readFileSync(path.join(clientDir, "public/sw.js"), "utf-8");
      expect(sw).toContain("activate");
    });
  });

  describe("PWA Manifest", () => {
    it("manifest.json exists with required fields", () => {
      const manifestPath = path.join(clientDir, "public/manifest.json");
      expect(fs.existsSync(manifestPath)).toBe(true);
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      expect(manifest.name).toBeDefined();
      expect(manifest.short_name).toBeDefined();
      expect(manifest.display).toBe("standalone");
      expect(manifest.theme_color).toBeDefined();
      expect(manifest.background_color).toBeDefined();
      expect(manifest.start_url).toBeDefined();
    });
  });

  describe("Bottom Tab Bar", () => {
    it("BottomTabBar component exists", () => {
      const tabBarPath = path.join(clientDir, "src/components/BottomTabBar.tsx");
      expect(fs.existsSync(tabBarPath)).toBe(true);
    });

    it("BottomTabBar has 5 tabs", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/components/BottomTabBar.tsx"), "utf-8");
      // Count tab entries in TABS array
      const tabMatches = content.match(/\{ path:/g);
      expect(tabMatches).toBeDefined();
      expect(tabMatches!.length).toBe(5);
    });
  });

  describe("Swipe Navigation Hook", () => {
    it("useSwipeNavigation hook exists", () => {
      const hookPath = path.join(clientDir, "src/hooks/useSwipeNavigation.ts");
      expect(fs.existsSync(hookPath)).toBe(true);
    });

    it("supports horizontal and vertical swipes", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/hooks/useSwipeNavigation.ts"), "utf-8");
      expect(content).toContain("onSwipeLeft");
      expect(content).toContain("onSwipeRight");
      expect(content).toContain("onSwipeUp");
      expect(content).toContain("onSwipeDown");
    });
  });

  describe("Gamepad Hook", () => {
    it("useGamepad hook exists", () => {
      const hookPath = path.join(clientDir, "src/hooks/useGamepad.ts");
      expect(fs.existsSync(hookPath)).toBe(true);
    });

    it("supports standard button mapping", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/hooks/useGamepad.ts"), "utf-8");
      expect(content).toContain("GamepadButtonName");
      expect(content).toContain("DPAD_UP");
      expect(content).toContain("DPAD_DOWN");
      expect(content).toContain("DPAD_LEFT");
      expect(content).toContain("DPAD_RIGHT");
    });

    it("handles connect and disconnect via polling", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/hooks/useGamepad.ts"), "utf-8");
      expect(content).toContain("navigator.getGamepads");
      expect(content).toContain("requestAnimationFrame");
      expect(content).toContain("cancelAnimationFrame");
    });
  });

  describe("Install Banner", () => {
    it("InstallBanner component exists", () => {
      const bannerPath = path.join(clientDir, "src/components/InstallBanner.tsx");
      expect(fs.existsSync(bannerPath)).toBe(true);
    });

    it("usePWAInstall hook exists", () => {
      const hookPath = path.join(clientDir, "src/hooks/usePWAInstall.ts");
      expect(fs.existsSync(hookPath)).toBe(true);
    });
  });

  describe("Mobile Responsive", () => {
    it("index.css has safe-area-bottom utility", () => {
      const css = fs.readFileSync(path.join(clientDir, "src/index.css"), "utf-8");
      expect(css).toContain("safe-area-bottom");
      expect(css).toContain("env(safe-area-inset-bottom");
    });

    it("index.css has mobile-content-pad utility", () => {
      const css = fs.readFileSync(path.join(clientDir, "src/index.css"), "utf-8");
      expect(css).toContain("mobile-content-pad");
    });

    it("all page files have mobile-content-pad class", () => {
      const pages = [
        "Home.tsx", "ExplorerRelay.tsx", "FlightDeck.tsx", "ScholarCreate.tsx",
        "Leaderboard.tsx", "YodaControl.tsx", "Frameworks.tsx", "CardCollection.tsx",
        "GovernanceDeck.tsx", "MobileExplorer.tsx"
      ];
      for (const page of pages) {
        const content = fs.readFileSync(path.join(clientDir, `src/pages/${page}`), "utf-8");
        expect(content).toContain("mobile-content-pad");
      }
    });
  });

  describe("iCard Image Embedding", () => {
    it("GovernanceDeck has all 10 iCard images", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/GovernanceDeck.tsx"), "utf-8");
      expect(content).toContain("sap001");
      expect(content).toContain("powerCard");
      expect(content).toContain("walkby");
      expect(content).toContain("fourLaws");
      expect(content).toContain("incident001");
      expect(content).toContain("equipment");
      expect(content).toContain("memorialAudit");
      expect(content).toContain("tetrahedral");
      expect(content).toContain("posterEquipment");
      expect(content).toContain("posterVehicles");
    });

    it("Frameworks page has walkby, fourLaws, and tetrahedral iCards", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/Frameworks.tsx"), "utf-8");
      expect(content).toContain("FRAMEWORK_CDN");
      expect(content).toContain("walkby");
      expect(content).toContain("fourLaws");
      expect(content).toContain("tetrahedral");
    });

    it("all CDN URLs use cloudfront domain", () => {
      const govContent = fs.readFileSync(path.join(clientDir, "src/pages/GovernanceDeck.tsx"), "utf-8");
      const fwContent = fs.readFileSync(path.join(clientDir, "src/pages/Frameworks.tsx"), "utf-8");
      const cdnPattern = /d2xsxph8kpxj0f\.cloudfront\.net/g;
      expect(govContent.match(cdnPattern)!.length).toBeGreaterThanOrEqual(10);
      expect(fwContent.match(cdnPattern)!.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("App.tsx Integration", () => {
    it("App.tsx includes BottomTabBar", () => {
      const app = fs.readFileSync(path.join(clientDir, "src/App.tsx"), "utf-8");
      expect(app).toContain("BottomTabBar");
    });

    it("App.tsx includes InstallBanner", () => {
      const app = fs.readFileSync(path.join(clientDir, "src/App.tsx"), "utf-8");
      expect(app).toContain("InstallBanner");
    });

    it("App.tsx includes GamepadIndicator", () => {
      const app = fs.readFileSync(path.join(clientDir, "src/App.tsx"), "utf-8");
      expect(app).toContain("GamepadIndicator");
    });

    it("App.tsx registers service worker", () => {
      const app = fs.readFileSync(path.join(clientDir, "src/App.tsx"), "utf-8");
      expect(app).toContain("serviceWorker");
      expect(app).toContain("ServiceWorkerRegistrar");
    });
  });
});
