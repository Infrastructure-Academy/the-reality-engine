import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Check, Loader2 } from "lucide-react";

interface ShareCardProps {
  patternTitle: string;
  dominant: "west" | "east" | "nomadic";
  isBalanced: boolean;
  perspectives: { west: number; east: number; nomadic: number };
  totalXp: number;
  discoveries: number;
  completedRelays: number;
  isComplete: boolean;
}

const PERSPECTIVE_COLORS: Record<string, string> = {
  west: "#3b82f6",
  east: "#ef4444",
  nomadic: "#f59e0b",
};

const PERSPECTIVE_ICONS: Record<string, string> = {
  west: "🏛️",
  east: "🏯",
  nomadic: "🏕️",
};

function formatXp(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toLocaleString();
}

export function ShareCard({
  patternTitle,
  dominant,
  isBalanced,
  perspectives,
  totalXp,
  discoveries,
  completedRelays,
  isComplete,
}: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const W = 1200;
    const H = 630;
    canvas.width = W;
    canvas.height = H;

    // ─── Background ───
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#0c0a09");
    bgGrad.addColorStop(0.5, "#1c1917");
    bgGrad.addColorStop(1, "#0c0a09");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid pattern
    ctx.strokeStyle = "rgba(6, 182, 212, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // ─── Border ───
    ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Corner accents
    const cornerSize = 30;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    // Top-left
    ctx.beginPath(); ctx.moveTo(20, 50); ctx.lineTo(20, 20); ctx.lineTo(50, 20); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(W - 50, 20); ctx.lineTo(W - 20, 20); ctx.lineTo(W - 20, 50); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(20, H - 50); ctx.lineTo(20, H - 20); ctx.lineTo(50, H - 20); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(W - 50, H - 20); ctx.lineTo(W - 20, H - 20); ctx.lineTo(W - 20, H - 50); ctx.stroke();

    // ─── Title ───
    ctx.fillStyle = "rgba(245, 158, 11, 0.6)";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.letterSpacing = "4px";
    ctx.fillText("THE REALITY ENGINE — INFRASTRUCTURE ODYSSEY", W / 2, 60);

    // ─── Archetype Title ───
    const titleColor = isBalanced
      ? "#f59e0b"
      : PERSPECTIVE_COLORS[dominant];
    ctx.fillStyle = titleColor;
    ctx.font = "bold 52px serif";
    ctx.textAlign = "center";
    ctx.fillText(patternTitle, W / 2, 140);

    // Subtitle
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "16px monospace";
    ctx.fillText(
      isComplete ? "ODYSSEY COMPLETE — ALL 12 RELAYS TRAVERSED" : `${completedRelays}/12 RELAYS EXPLORED`,
      W / 2,
      175
    );

    // ─── Radar Triangle ───
    const cx = 300, cy = 360, r = 130;
    const total = perspectives.west + perspectives.east + perspectives.nomadic || 1;
    const wPct = perspectives.west / total;
    const ePct = perspectives.east / total;
    const nPct = perspectives.nomadic / total;

    const triPoints = [
      { x: cx, y: cy - r },
      { x: cx - r * Math.sin(Math.PI * 2 / 3), y: cy + r * Math.cos(Math.PI * 2 / 3) },
      { x: cx + r * Math.sin(Math.PI * 2 / 3), y: cy + r * Math.cos(Math.PI * 2 / 3) },
    ];

    // Grid
    [0.33, 0.66, 1].forEach(level => {
      ctx.beginPath();
      triPoints.forEach((p, i) => {
        const px = cx + (p.x - cx) * level;
        const py = cy + (p.y - cy) * level;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Axis lines
    triPoints.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();
    });

    // Data triangle
    const dataPoints = [
      { x: cx + wPct * (triPoints[0].x - cx) * 2, y: cy + wPct * (triPoints[0].y - cy) * 2 },
      { x: cx + ePct * (triPoints[1].x - cx) * 2, y: cy + ePct * (triPoints[1].y - cy) * 2 },
      { x: cx + nPct * (triPoints[2].x - cx) * 2, y: cy + nPct * (triPoints[2].y - cy) * 2 },
    ];

    ctx.beginPath();
    dataPoints.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#3b82f6";
    ctx.fillText(`🏛️ WEST ${Math.round(wPct * 100)}%`, triPoints[0].x, triPoints[0].y - 16);
    ctx.fillStyle = "#ef4444";
    ctx.fillText(`🏯 EAST ${Math.round(ePct * 100)}%`, triPoints[1].x - 10, triPoints[1].y + 22);
    ctx.fillStyle = "#f59e0b";
    ctx.fillText(`🏕️ NOMADIC ${Math.round(nPct * 100)}%`, triPoints[2].x + 10, triPoints[2].y + 22);

    // ─── Stats Panel (right side) ───
    const statsX = 680;
    const statsY = 240;
    const statsW = 440;

    // Stats background
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.beginPath();
    ctx.roundRect(statsX, statsY, statsW, 280, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Stats title
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("MISSION STATISTICS", statsX + 24, statsY + 30);

    // Stat rows
    const stats = [
      { label: "TOTAL XP", value: formatXp(totalXp), color: "#f59e0b" },
      { label: "DISCOVERIES", value: discoveries.toString(), color: "#06b6d4" },
      { label: "RELAYS COMPLETED", value: `${completedRelays} / 12`, color: isComplete ? "#f59e0b" : "#a1a1aa" },
      { label: "BITPOINTS", value: Math.floor(totalXp / 100).toLocaleString(), color: "#a855f7" },
      { label: "DOMINANT PERSPECTIVE", value: isBalanced ? "BALANCED" : dominant.toUpperCase(), color: isBalanced ? "#f59e0b" : PERSPECTIVE_COLORS[dominant] },
    ];

    stats.forEach((stat, i) => {
      const y = statsY + 60 + i * 44;
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(stat.label, statsX + 24, y);
      ctx.fillStyle = stat.color;
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "right";
      ctx.fillText(stat.value, statsX + statsW - 24, y);
    });

    // ─── Footer ───
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText("THE REALITY ENGINE — GUIDED LEARNING PLATFORM — AN INFRASTRUCTURE ODYSSEY", W / 2, H - 35);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 1.0);
    });
  }, [patternTitle, dominant, isBalanced, perspectives, totalXp, discoveries, completedRelays, isComplete]);

  const handleShare = useCallback(async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) return;

      // Try native share first (mobile)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], "my-pattern.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${patternTitle} — The Reality Engine`,
            text: `I'm "${patternTitle}" in The Reality Engine! ${completedRelays}/12 relays explored. What's your civilisational pattern?`,
            files: [file],
          });
          return;
        }
      }

      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reality-engine-${patternTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }, [generateImage, patternTitle, completedRelays]);

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reality-engine-${patternTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }, [generateImage, patternTitle]);

  return (
    <div>
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button
          onClick={handleShare}
          disabled={generating}
          className="gap-2 bg-amber-600 hover:bg-amber-500 text-white font-heading tracking-wider"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          Share My Pattern
        </Button>
        <Button
          onClick={handleDownload}
          disabled={generating}
          variant="outline"
          className="gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        >
          <Download className="w-4 h-4" />
          Download Card
        </Button>
      </div>
    </div>
  );
}
