import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BottomTabBar } from "./components/BottomTabBar";
import { InstallBanner } from "./components/InstallBanner";
import { GamepadIndicator } from "./components/GamepadIndicator";
import { DiscoveryHints } from "./components/DiscoveryHints";
import { EyeOpenAnimation } from "./components/EyeOpenAnimation";
import { lazy, Suspense, useEffect } from "react";

// ─── Eagerly loaded (critical path) ───
import Home from "./pages/Home";
import ExplorerRelay from "./pages/ExplorerRelay";

// ─── Lazy loaded (heavy pages, code-split) ───
const FlightDeck = lazy(() => import("./pages/FlightDeck"));
const ScholarCreate = lazy(() => import("./pages/ScholarCreate"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const YodaControl = lazy(() => import("./pages/YodaControl"));
const Frameworks = lazy(() => import("./pages/Frameworks"));
const CardCollection = lazy(() => import("./pages/CardCollection"));
const GovernanceDeck = lazy(() => import("./pages/GovernanceDeck"));
const Synthesis = lazy(() => import("./pages/Synthesis"));
const MobileExplorer = lazy(() => import("./pages/MobileExplorer"));
const ChallengeLanding = lazy(() => import("./pages/ChallengeLanding"));
const NetworkDirectory = lazy(() => import("./pages/NetworkDirectory"));
const Journey = lazy(() => import("./pages/Journey"));
const MediaGallery = lazy(() => import("./pages/MediaGallery"));
const BridgeHub = lazy(() => import("./pages/BridgeHub"));
const Resources = lazy(() => import("./pages/Resources"));
const ExplorerSelect = lazy(() => import("./pages/ExplorerSelect"));
const RelaySpinner = lazy(() => import("./pages/RelaySpinner"));
const DungeonCrawl = lazy(() => import("./pages/DungeonCrawl"));
const GreyMatter = lazy(() => import("./pages/GreyMatter"));
const AppraisalQuestionnaire = lazy(() => import("./pages/AppraisalQuestionnaire"));
const Prologue = lazy(() => import("./pages/Prologue"));
const IGOUmbrella = lazy(() => import("./pages/IGOUmbrella"));
const IgoAdmin = lazy(() => import("./pages/IgoAdmin"));

// ─── Loading fallback ───
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-mono tracking-wider">LOADING MODULE...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/explore"} component={ExplorerSelect} />
        <Route path={"/explore/prologue"} component={Prologue} />
        <Route path={"/explore/spinner"} component={RelaySpinner} />
        <Route path={"/explore/dungeon"} component={DungeonCrawl} />
        <Route path={"/explore/greymatter"} component={GreyMatter} />
        <Route path={"/explore/:relayNum"} component={ExplorerRelay} />
        <Route path={"/flight-deck"} component={FlightDeck} />
        <Route path={"/create"} component={ScholarCreate} />
        <Route path={"/leaderboard"} component={Leaderboard} />
        <Route path={"/yoda"} component={YodaControl} />
        <Route path={"/frameworks"} component={Frameworks} />
        <Route path={"/cards"} component={CardCollection} />
        <Route path={"/governance"} component={GovernanceDeck} />
        <Route path={"/synthesis"} component={Synthesis} />
        <Route path={"/m/explore"} component={MobileExplorer} />
        <Route path={"/m/explore/:relayNum"} component={MobileExplorer} />
        <Route path={"/challenge/:code"} component={ChallengeLanding} />
        <Route path={"/network"} component={NetworkDirectory} />
        <Route path={"/journey"} component={Journey} />
        <Route path={"/media"} component={MediaGallery} />
        <Route path={"/bridges"} component={BridgeHub} />
        <Route path={"/resources"} component={Resources} />
        <Route path={"/appraisal"} component={AppraisalQuestionnaire} />
        <Route path={"/play/igo"} component={IGOUmbrella} />
        <Route path={"/admin/igo"} component={IgoAdmin} />
        <Route path={"/exhibition"} component={IGOUmbrella} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Force update on every load to clear stale caches from v2
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((reg) => {
          reg.update(); // Force check for new SW immediately
          console.log("[SW] Registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[SW] Registration failed:", err);
        });
    }
  }, []);
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <ServiceWorkerRegistrar />
          <EyeOpenAnimation />
          <Router />
          <BottomTabBar />
          <InstallBanner />
          <GamepadIndicator />
          <DiscoveryHints />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
