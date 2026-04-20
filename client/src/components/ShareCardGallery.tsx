import { useState, useRef, useCallback } from "react";
import { Share2, Copy, Check, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageLightbox } from "@/components/ImageLightbox";

interface ShareCard {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  shareText: string;
}

const SHARE_CARDS: ShareCard[] = [
  {
    id: "civil-truth",
    title: "Civil Engineering Truth",
    subtitle: "The skill now lost",
    imageUrl:
      "/manus-storage/share-card-civil-truth-fixed_7ef0693a.png",
    shareText:
      "Infrastructure is the invisible foundation of civilisation. Civil engineering — the skill now lost — iAAi recovers it digitally.\n\ntwinearth.world — Infrastructure Academy | iAAi",
  },
  {
    id: "authenticity",
    title: "Authenticity & Reputational Certainty",
    subtitle: "Built by a real civil engineer",
    imageUrl:
      "/manus-storage/share-card-authenticity-fixed_da4880dd.png",
    shareText:
      "iGO is built on authenticity and reputational certainty — a real civil engineer, real infrastructure, real education.\n\ntwinearth.world — Infrastructure Academy | iAAi",
  },
  {
    id: "founder",
    title: "Founder's Vision",
    subtitle: "Learning was always meant to be fun",
    imageUrl:
      "/manus-storage/share-card-founder-fixed_10188111.png",
    shareText:
      '"iGO is not eGO or GOslow — it is a shaping tool and an edutainment Rosetta Stone to be played with like a toy. Learning was always meant to be fun." — Ir. Nigel T. Dearden\n\ntwinearth.world — Infrastructure Academy | iAAi',
  },
];

const SITE_URL = "https://twinearth.world";
const SWIPE_THRESHOLD = 50; // minimum px to trigger swipe

/** Copy text to clipboard with fallback */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

/** Download image from URL */
async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback: open in new tab
    window.open(url, "_blank");
  }
}

/** Custom hook for touch swipe detection */
function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swiping = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swiping.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Only treat as swipe if horizontal movement > vertical (prevent scroll hijack)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      swiping.current = true;
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (swiping.current && Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    }
    touchStartX.current = null;
    touchStartY.current = null;
    swiping.current = false;
  }, [onSwipeLeft, onSwipeRight]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}

function ShareCardItem({ card }: { card: ShareCard }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Try sharing with image file if supported
        const response = await fetch(card.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `igo-${card.id}.png`, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `iGO — ${card.title}`,
            text: card.shareText,
            url: SITE_URL,
            files: [file],
          });
          return;
        }
      } catch {
        // Fall through to text-only share
      }

      // Text-only share fallback
      try {
        await navigator.share({
          title: `iGO — ${card.title}`,
          text: card.shareText,
          url: SITE_URL,
        });
        return;
      } catch {
        // User cancelled or error — fall through to copy
      }
    }

    // Final fallback: copy to clipboard
    const success = await copyToClipboard(`${card.shareText}\n${SITE_URL}`);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyText = async () => {
    const success = await copyToClipboard(`${card.shareText}\n${SITE_URL}`);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    downloadImage(card.imageUrl, `igo-share-${card.id}.png`);
  };

  return (
    <div className="flex flex-col">
      {/* Card image with lightbox */}
      <div className="rounded-lg overflow-hidden border border-amber-500/20 mb-3">
        <ImageLightbox
          src={card.imageUrl}
          alt={`${card.title} — ${card.subtitle}`}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Card info */}
      <h4 className="font-heading text-sm tracking-wider text-foreground mb-0.5">{card.title}</h4>
      <p className="text-[10px] text-muted-foreground mb-3">{card.subtitle}</p>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex-1 gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyText}
          className="gap-1.5 border-border/40 text-muted-foreground hover:text-foreground text-xs"
          title="Copy share text"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="gap-1.5 border-border/40 text-muted-foreground hover:text-foreground text-xs"
          title="Download image"
        >
          <Download className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function ShareCardGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = useCallback(
    () => setActiveIndex((i) => (i > 0 ? i - 1 : SHARE_CARDS.length - 1)),
    []
  );
  const handleNext = useCallback(
    () => setActiveIndex((i) => (i < SHARE_CARDS.length - 1 ? i + 1 : 0)),
    []
  );

  // Swipe: left = next, right = prev
  const swipeHandlers = useSwipe(handleNext, handlePrev);

  return (
    <div className="w-full">
      {/* Desktop: 2x2 grid */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {SHARE_CARDS.map((card) => (
          <ShareCardItem key={card.id} card={card} />
        ))}
      </div>

      {/* Mobile: swipeable carousel */}
      <div className="md:hidden" {...swipeHandlers}>
        <ShareCardItem card={SHARE_CARDS[activeIndex]} />

        {/* Swipe hint (first visit only) */}
        <p className="text-center text-[9px] text-amber-400/40 mt-2 tracking-wider">
          ← SWIPE TO BROWSE →
        </p>

        {/* Navigation dots + arrows */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-amber-500/40 transition-colors"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            {SHARE_CARDS.map((card, i) => (
              <button
                key={card.id}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIndex
                    ? "bg-amber-400 scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to card ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-amber-500/40 transition-colors"
            aria-label="Next card"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
          {activeIndex + 1} / {SHARE_CARDS.length}
        </p>
      </div>
    </div>
  );
}
