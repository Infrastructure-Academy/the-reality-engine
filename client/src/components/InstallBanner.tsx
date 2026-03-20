import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * InstallBanner — Shows a dismissible banner prompting PWA installation.
 * Only visible when the browser supports installation and app is not already installed.
 */
export function InstallBanner() {
  const { canInstall, isInstalled, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || isInstalled || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[55] md:bottom-4 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-card/95 backdrop-blur-md border border-gold/30 rounded-xl p-4 shadow-lg shadow-black/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-heading text-foreground">Install The Reality Engine</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add to your home screen for the full experience — works offline.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                className="bg-gold hover:bg-gold-bright text-black font-heading tracking-wider text-xs h-8"
                onClick={() => install()}
              >
                Install App
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground text-xs h-8"
                onClick={() => setDismissed(true)}
              >
                Not now
              </Button>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
