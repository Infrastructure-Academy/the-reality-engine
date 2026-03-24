import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const clientDir = path.join(__dirname, "..", "client");

describe("Engagement Layer — JG Inspector Feedback Response", () => {
  describe("Shared Engagement Utilities", () => {
    it("useEngagementFx hook exists", () => {
      const hookPath = path.join(clientDir, "src/hooks/useEngagementFx.ts");
      expect(fs.existsSync(hookPath)).toBe(true);
    });

    it("useEngagementFx exports web-typed sound functions", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/hooks/useEngagementFx.ts"), "utf-8");
      expect(content).toContain("playWebTypedDiscovery");
      expect(content).toContain("playMilestoneFanfare");
      expect(content).toContain("playPhaseTransition");
      expect(content).toContain("playWebTypedNodeActivation");
    });

    it("useEngagementFx has 5 web-typed sound signatures", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/hooks/useEngagementFx.ts"), "utf-8");
      // 5 Great Webs with distinct audio profiles
      expect(content).toContain("Natural");
      expect(content).toContain("Machine");
      expect(content).toContain("Digital");
      expect(content).toContain("Biological");
      expect(content).toContain("Consciousness");
    });

    it("MilestoneOverlay component exists and supports percentage milestones", () => {
      const compPath = path.join(clientDir, "src/components/MilestoneOverlay.tsx");
      expect(fs.existsSync(compPath)).toBe(true);
      const content = fs.readFileSync(compPath, "utf-8");
      expect(content).toContain("25%");
      expect(content).toContain("50%");
      expect(content).toContain("75%");
      expect(content).toContain("100%");
    });

    it("StreakIndicator component exists and shows combo labels", () => {
      const compPath = path.join(clientDir, "src/components/StreakIndicator.tsx");
      expect(fs.existsSync(compPath)).toBe(true);
      const content = fs.readFileSync(compPath, "utf-8");
      expect(content).toContain("STREAK");
      expect(content).toContain("COMBO");
      expect(content).toContain("ON FIRE");
      expect(content).toContain("BLAZING");
    });

    it("DiscoveryBurst component exists and uses webColor prop", () => {
      const compPath = path.join(clientDir, "src/components/DiscoveryBurst.tsx");
      expect(fs.existsSync(compPath)).toBe(true);
      const content = fs.readFileSync(compPath, "utf-8");
      expect(content).toContain("webColor");
      expect(content).toContain("Particle");
    });

    it("RelaySummaryCard component exists with relay stats", () => {
      const compPath = path.join(clientDir, "src/components/RelaySummaryCard.tsx");
      expect(fs.existsSync(compPath)).toBe(true);
      const content = fs.readFileSync(compPath, "utf-8");
      expect(content).toContain("inventionsFound");
      expect(content).toContain("totalInventions");
      expect(content).toContain("onContinue");
    });
  });

  describe("Explorer Mode Engagement Wiring", () => {
    it("ExplorerRelay imports engagement FX", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/ExplorerRelay.tsx"), "utf-8");
      expect(content).toContain("useEngagementFx");
    });

    it("ExplorerRelay uses DiscoveryBurst component", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/ExplorerRelay.tsx"), "utf-8");
      expect(content).toContain("DiscoveryBurst");
    });

    it("ExplorerRelay uses MilestoneOverlay component", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/ExplorerRelay.tsx"), "utf-8");
      expect(content).toContain("MilestoneOverlay");
    });

    it("ExplorerRelay uses StreakIndicator component", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/ExplorerRelay.tsx"), "utf-8");
      expect(content).toContain("StreakIndicator");
    });

    it("ExplorerRelay uses RelaySummaryCard component", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/ExplorerRelay.tsx"), "utf-8");
      expect(content).toContain("RelaySummaryCard");
    });

    it("ExplorerRelay calls playWebTypedDiscovery on card reveal", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/ExplorerRelay.tsx"), "utf-8");
      expect(content).toContain("playWebTypedDiscovery");
    });
  });

  describe("Flight Deck Mode Engagement Wiring", () => {
    it("FlightDeck imports engagement FX", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/FlightDeck.tsx"), "utf-8");
      expect(content).toContain("useEngagementFx");
    });

    it("FlightDeck uses MilestoneOverlay component", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/FlightDeck.tsx"), "utf-8");
      expect(content).toContain("MilestoneOverlay");
    });

    it("FlightDeck uses DiscoveryBurst component", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/FlightDeck.tsx"), "utf-8");
      expect(content).toContain("DiscoveryBurst");
    });

    it("FlightDeck calls playWebTypedNodeActivation on node click", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/FlightDeck.tsx"), "utf-8");
      expect(content).toContain("playWebTypedNodeActivation");
    });
  });

  describe("Scholar Mode Engagement Wiring", () => {
    it("ScholarCreate imports engagement FX", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/ScholarCreate.tsx"), "utf-8");
      expect(content).toContain("useEngagementFx");
    });

    it("ScholarCreate uses MilestoneOverlay component", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/ScholarCreate.tsx"), "utf-8");
      expect(content).toContain("MilestoneOverlay");
    });

    it("ScholarCreate calls playPhaseTransition on phase changes", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/ScholarCreate.tsx"), "utf-8");
      expect(content).toContain("playPhaseTransition");
    });
  });

  describe("Appraisal Questionnaire", () => {
    it("AppraisalQuestionnaire page exists", () => {
      const pagePath = path.join(clientDir, "src/pages/AppraisalQuestionnaire.tsx");
      expect(fs.existsSync(pagePath)).toBe(true);
    });

    it("AppraisalQuestionnaire has age group selection", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/AppraisalQuestionnaire.tsx"), "utf-8");
      expect(content).toContain("ageGroup");
      expect(content).toContain("8-10");
      expect(content).toContain("14-18");
      expect(content).toContain("18+");
    });

    it("AppraisalQuestionnaire has mode selection", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/AppraisalQuestionnaire.tsx"), "utf-8");
      expect(content).toContain("Explorer");
      expect(content).toContain("Flight Deck");
      expect(content).toContain("Scholar");
    });

    it("AppraisalQuestionnaire has engagement questions", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/AppraisalQuestionnaire.tsx"), "utf-8");
      expect(content).toContain("ENGAGEMENT_QUESTIONS");
      expect(content).toContain("overall_fun");
      expect(content).toContain("clicking_feel");
      expect(content).toContain("story_engagement");
    });

    it("AppraisalQuestionnaire has open-ended feedback fields", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/AppraisalQuestionnaire.tsx"), "utf-8");
      expect(content).toContain("favourite_moment");
      expect(content).toContain("what_would_improve");
      expect(content).toContain("additional_comments");
    });

    it("AppraisalQuestionnaire route is wired in App.tsx", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/App.tsx"), "utf-8");
      expect(content).toContain("AppraisalQuestionnaire");
      expect(content).toContain("/appraisal");
    });

    it("AppraisalQuestionnaire uses notifyOwner on submit", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/AppraisalQuestionnaire.tsx"), "utf-8");
      expect(content).toContain("notifyOwner");
    });
  });

  describe("Game Design Parameters v2.0", () => {
    it("GDP document exists and is v2.0", () => {
      const gdpPath = path.join(__dirname, "..", "Game-Design-Parameters.md");
      expect(fs.existsSync(gdpPath)).toBe(true);
      const content = fs.readFileSync(gdpPath, "utf-8");
      expect(content).toContain("v2.0");
    });

    it("GDP v2.0 contains Engagement Layer section", () => {
      const content = fs.readFileSync(path.join(__dirname, "..", "Game-Design-Parameters.md"), "utf-8");
      expect(content).toContain("Engagement Layer");
    });

    it("GDP v2.0 contains Appraisal section", () => {
      const content = fs.readFileSync(path.join(__dirname, "..", "Game-Design-Parameters.md"), "utf-8");
      expect(content).toContain("Appraisal");
    });

    it("GDP v2.0 contains Inspector Feedback Response", () => {
      const content = fs.readFileSync(path.join(__dirname, "..", "Game-Design-Parameters.md"), "utf-8");
      expect(content).toContain("Inspector Feedback");
      expect(content).toContain("Jonathan Green");
    });

    it("Resources page links to GDP v2.0 PDF", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/Resources.tsx"), "utf-8");
      expect(content).toContain("v2.0");
      expect(content).toContain("Game-Design-Parameters-v2.0");
    });
  });

  describe("GovernanceDeck iCards", () => {
    it("GovernanceDeck has GOV-GDP-002 card", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/GovernanceDeck.tsx"), "utf-8");
      expect(content).toContain("GOV-GDP-002");
    });

    it("GovernanceDeck has JG Inspector Node Report card", () => {
      const content = fs.readFileSync(path.join(clientDir, "src/pages/GovernanceDeck.tsx"), "utf-8");
      expect(content).toContain("Inspector Node Report");
      expect(content).toContain("jgInspector");
    });
  });
});
