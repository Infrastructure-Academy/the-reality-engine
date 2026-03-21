import { getPlayerBadge, getNextBadge, getAllEarnedBadges, type Badge } from "@shared/badges";

interface BadgeChipProps {
  badge: Badge;
  size?: "sm" | "md";
}

/** Small inline badge pill */
export function BadgeChip({ badge, size = "sm" }: BadgeChipProps) {
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const px = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 ${px} rounded-full font-bold font-mono ${textSize}`}
      style={{
        backgroundColor: badge.bgColor,
        borderColor: badge.borderColor,
        color: badge.color,
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <span>{badge.emoji}</span>
      <span>{badge.name.split(" ")[0]}</span>
    </span>
  );
}

interface BadgeRowProps {
  totalXp: number;
  showProgress?: boolean;
}

/** Shows the player's current badge + optional progress to next */
export function BadgeRow({ totalXp, showProgress = false }: BadgeRowProps) {
  const badge = getPlayerBadge(totalXp);
  const next = getNextBadge(totalXp);

  if (!badge && !next) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {badge && <BadgeChip badge={badge} />}
      {showProgress && next && (
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1.5 rounded-full bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(next.progress * 100)}%`,
                backgroundColor: next.badge.color,
              }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground font-mono">
            {next.badge.emoji} {Math.round(next.progress * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}

interface BadgeCollectionProps {
  totalXp: number;
}

/** Full badge collection display — shows earned and locked badges */
export function BadgeCollection({ totalXp }: BadgeCollectionProps) {
  const earned = getAllEarnedBadges(totalXp);
  const { BADGES } = require("@shared/badges");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {BADGES.map((badge: Badge) => {
        const isEarned = earned.some(e => e.id === badge.id);
        return (
          <div
            key={badge.id}
            className={`p-3 rounded-lg border transition-all ${
              isEarned
                ? "border-opacity-100"
                : "opacity-40 grayscale border-border/30"
            }`}
            style={{
              backgroundColor: isEarned ? badge.bgColor : undefined,
              borderColor: isEarned ? badge.borderColor : undefined,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{badge.emoji}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: isEarned ? badge.color : undefined }}>
                  {badge.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isEarned ? badge.description : `Requires ${(badge.threshold / 1_000_000).toFixed(1)}M XP`}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
