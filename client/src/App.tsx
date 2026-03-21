import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BottomTabBar } from "./components/BottomTabBar";
import { InstallBanner } from "./components/InstallBanner";
import { GamepadIndicator } from "./components/GamepadIndicator";
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
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
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
          <Router />
          <BottomTabBar />
          <InstallBanner />
          <GamepadIndicator />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
