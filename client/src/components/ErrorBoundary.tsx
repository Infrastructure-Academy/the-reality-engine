import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

/**
 * Detects stale chunk / dynamic import failures.
 * These happen when the browser has cached old Vite chunk filenames
 * but the server has new chunks with different hashes after a redeploy.
 */
function isChunkLoadError(error: Error): boolean {
  const msg = error.message || "";
  return (
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Loading chunk") ||
    msg.includes("Loading CSS chunk") ||
    msg.includes("Importing a module script failed") ||
    (error.name === "TypeError" && msg.includes("fetch"))
  );
}

const CHUNK_RELOAD_KEY = "tre-chunk-reload-ts";

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const isChunk = isChunkLoadError(error);
    return { hasError: true, error, isChunkError: isChunk };
  }

  componentDidCatch(error: Error) {
    if (isChunkLoadError(error)) {
      // Auto-reload once to fetch fresh chunks — but prevent infinite reload loops
      const lastReload = sessionStorage.getItem(CHUNK_RELOAD_KEY);
      const now = Date.now();
      // Only auto-reload if we haven't reloaded in the last 10 seconds
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
        console.warn("[ErrorBoundary] Stale chunk detected — auto-reloading...");
        window.location.reload();
        return;
      }
      console.warn("[ErrorBoundary] Stale chunk detected but already reloaded recently — showing manual reload button.");
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <h2 className="text-xl mb-4">
              {this.state.isChunkError
                ? "A new version is available."
                : "An unexpected error occurred."}
            </h2>

            {this.state.isChunkError ? (
              <p className="text-sm text-muted-foreground mb-6 text-center">
                The app has been updated since your last visit. Please reload to
                get the latest version.
              </p>
            ) : (
              <div className="p-4 w-full rounded bg-muted overflow-auto mb-6">
                <pre className="text-sm text-muted-foreground whitespace-break-spaces">
                  {this.state.error?.stack}
                </pre>
              </div>
            )}

            <button
              onClick={() => {
                // Clear the reload guard so the fresh load can try again
                sessionStorage.removeItem(CHUNK_RELOAD_KEY);
                window.location.reload();
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
