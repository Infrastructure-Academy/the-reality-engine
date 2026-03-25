import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

interface SiteHeaderProps {
  /** Page title displayed in the header */
  title?: string;
  /** Show back arrow instead of home icon (still links home) */
  showBack?: boolean;
  /** Additional right-side content */
  rightContent?: React.ReactNode;
  /** Custom className for the header */
  className?: string;
}

export function SiteHeader({ title, showBack = false, rightContent, className = "" }: SiteHeaderProps) {
  return (
    <header className={`sticky top-0 z-20 border-b border-border/50 backdrop-blur-md bg-background/80 ${className}`}>
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
              {showBack ? <ArrowLeft className="w-4 h-4" /> : <Home className="w-4 h-4" />}
              <span className="hidden sm:inline">{showBack ? "Back" : "Home"}</span>
            </Button>
          </Link>
          {title && (
            <>
              <span className="text-muted-foreground/50">/</span>
              <h1 className="text-sm font-medium text-foreground truncate">{title}</h1>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iaai-logo_4636799f.jpeg"
              alt="iAAi — Infrastructure Academy"
              className="h-8 w-auto object-contain"
            />
          </Link>
          {rightContent}
        </div>
      </div>
    </header>
  );
}
