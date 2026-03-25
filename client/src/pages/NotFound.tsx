import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield">
      <SiteHeader title="Page Not Found" showBack />
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="text-center max-w-md mx-auto px-6">
          <Compass className="w-16 h-16 text-gold mx-auto mb-6 opacity-60" />
          <h1 className="font-heading text-5xl font-bold text-gold-gradient mb-3">404</h1>
          <h2 className="font-heading text-xl text-foreground/80 mb-4">Signal Lost</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            The coordinates you entered don't match any known relay or node in the Dearden Field.
            Return to mission control to recalibrate.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-primary text-primary-foreground font-heading tracking-wider"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Mission Control
          </Button>
        </div>
      </div>
    </div>
  );
}
