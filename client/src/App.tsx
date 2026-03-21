import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ExplorerRelay from "./pages/ExplorerRelay";
import FlightDeck from "./pages/FlightDeck";
import ScholarCreate from "./pages/ScholarCreate";
import Leaderboard from "./pages/Leaderboard";
import YodaControl from "./pages/YodaControl";
import Frameworks from "./pages/Frameworks";
import CardCollection from "./pages/CardCollection";
import GovernanceDeck from "./pages/GovernanceDeck";
import Synthesis from "./pages/Synthesis";
import MobileExplorer from "./pages/MobileExplorer";
import { BottomTabBar } from "./components/BottomTabBar";
import { InstallBanner } from "./components/InstallBanner";
import { GamepadIndicator } from "./components/GamepadIndicator";
import { useEffect } from "react";

function Router() {
  return (
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
