import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Loader2 } from "lucide-react";
import { FITS_TYPES, CRAFTS } from "@shared/gameData";
import { ARCHETYPES, type ArchetypeKey } from "@shared/relayDilemmas";
import { getPlayerBadge } from "@shared/badges";

interface ShareArchetypeCardProps {
  displayName: string;
  fitsType?: string | null;
  craftId?: string | null;
  archetype?: ArchetypeKey | null;
  totalXp: number;
  relaysCompleted: number;
  mode: string;
}

function formatXp(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toLocaleString();
}

export function ShareArchetypeCard({
  displayName,
  fitsType,
  craftId,
  archetype,
  totalXp,
  relaysCompleted,
  mode,
}: ShareArchetypeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);

  const fits = FITS_TYPES.find(f => f.id === fitsType);
  const craft = CRAFTS.find(c => c.id === craftId);
  const arch = archetype ? ARCHETYPES[archetype] : null;
  const badge = getPlayerBadge(totalXp);

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
    bgGrad.addColorStop(0.3, "#1a1510");
    bgGrad.addColorStop(0.7, "#1a1510");
    bgGrad.addColorStop(1, "#0c0a09");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = "rgba(212, 168, 67, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // ─── Gold Border ───
    ctx.strokeStyle = "rgba(212, 168, 67, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Corner accents
    ctx.strokeStyle = "#d4a843";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(20, 50); ctx.lineTo(20, 20); ctx.lineTo(50, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 50, 20); ctx.lineTo(W - 20, 20); ctx.lineTo(W - 20, 50); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, H - 50); ctx.lineTo(20, H - 20); ctx.lineTo(50, H - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 50, H - 20); ctx.lineTo(W - 20, H - 20); ctx.lineTo(W - 20, H - 50); ctx.stroke();

    // ─── Header ───
    ctx.fillStyle = "rgba(212, 168, 67, 0.5)";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText("THE REALITY ENGINE — iGO PLAYER CARD — iAAi", W / 2, 55);

    // ─── Player Name ───
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 48px serif";
    ctx.textAlign = "center";
    ctx.fillText(displayName || "Anonymous Player", W / 2, 120);

    // ─── Mode Badge ───
    const modeLabel = mode === "flight_deck" ? "FLIGHT DECK" : mode === "scholar" ? "SCHOLAR" : "EXPLORER";
    ctx.fillStyle = "rgba(212, 168, 67, 0.15)";
    const modeLabelWidth = 160;
    ctx.beginPath();
    ctx.roundRect(W / 2 - modeLabelWidth / 2, 135, modeLabelWidth, 28, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(212, 168, 67, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#d4a843";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(modeLabel, W / 2, 154);

    // ─── Left Column: FITS + Craft ───
    const leftX = 100;
    let leftY = 210;

    if (fits) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText("FITS TEMPERAMENT", leftX, leftY);
      leftY += 30;

      // Temperament pill
      ctx.fillStyle = fits.color + "20";
      ctx.beginPath();
      ctx.roundRect(leftX - 10, leftY - 18, 380, 50, 10);
      ctx.fill();
      ctx.strokeStyle = fits.color + "40";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = fits.color;
      ctx.font = "bold 32px serif";
      ctx.textAlign = "left";
      ctx.fillText(`${fits.abbr} — ${fits.name}`, leftX, leftY + 12);
      leftY += 60;

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "13px monospace";
      ctx.fillText(fits.description.slice(0, 55), leftX, leftY);
      leftY += 30;
    }

    if (craft) {
      leftY += 10;
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText("MPNC CRAFT ASSIGNMENT", leftX, leftY);
      leftY += 28;

      ctx.fillStyle = "#d4a843";
      ctx.font = "bold 24px serif";
      ctx.fillText(craft.name, leftX, leftY);
      leftY += 22;

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "12px monospace";
      ctx.fillText(`${craft.className} · ${craft.role}`, leftX, leftY);
    }

    // ─── Right Column: Stats ───
    const rightX = 640;
    let rightY = 210;

    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("MISSION STATISTICS", rightX, rightY);
    rightY += 10;

    // Stats background
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.beginPath();
    ctx.roundRect(rightX - 15, rightY, 470, 240, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const stats = [
      { label: "TOTAL XP", value: formatXp(totalXp), color: "#ffd700" },
      { label: "RELAYS COMPLETED", value: `${relaysCompleted} / 12`, color: relaysCompleted >= 12 ? "#ffd700" : "#a1a1aa" },
      { label: "BITPOINTS", value: Math.floor(totalXp / 100).toLocaleString(), color: "#a855f7" },
    ];

    if (arch) {
      stats.push({ label: "ARCHETYPE", value: arch.name.toUpperCase(), color: arch.color });
    }

    if (badge) {
      stats.push({ label: "RANK", value: `${badge.emoji} ${badge.name}`, color: badge.color });
    }

    stats.forEach((stat, i) => {
      const y = rightY + 35 + i * 44;
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(stat.label, rightX, y);
      ctx.fillStyle = stat.color;
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "right";
      ctx.fillText(stat.value, rightX + 440, y);
    });

    // ─── Footer ───
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText("iGO — GUIDED LEARNING PLATFORM — INFRASTRUCTURE ACADEMY · iAAi", W / 2, H - 50);
    ctx.fillStyle = "rgba(212, 168, 67, 0.3)";
    ctx.font = "10px monospace";
    ctx.fillText("twinearth.world — Navigate 12,000 years of civilisational infrastructure", W / 2, H - 32);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 1.0);
    });
  }, [displayName, fits, craft, arch, totalXp, relaysCompleted, mode, badge]);

  const handleShare = useCallback(async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) return;

      if (navigator.share && navigator.canShare) {
        const file = new File([blob], "my-archetype.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${displayName} — iGO Player Card`,
            text: `I'm a ${fits?.name || "Player"} in iGO! ${relaysCompleted}/12 relays explored, ${formatXp(totalXp)} XP. What's your archetype?\n\ntwinearth.world — Infrastructure Academy | iAAi`,
            files: [file],
          });
          return;
        }
      }

      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `igo-player-${(displayName || "card").toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }, [generateImage, displayName, fits, relaysCompleted, totalXp]);

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `igo-player-${(displayName || "card").toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }, [generateImage, displayName]);

  return (
    <div>
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
          Share My Archetype
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
