/**
 * SocialFollowButtons — X (with follower count), Facebook Follow, LinkedIn Follow
 * Matches the Chart Room header style: compact pill buttons in a row.
 * Social handles pulled from Infrastructure Academy for consistency.
 */

// ─── Social Config (consistent with Infrastructure Academy) ───
const SOCIAL_LINKS = {
  x: {
    handle: "@dearden_ni37258",
    url: "https://x.com/dearden_ni37258",
    label: "X",
  },
  facebook: {
    url: "https://www.facebook.com/share/1Fcxyhbsw3/",
    label: "Follow",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/nigeldearden",
    label: "Follow",
  },
} as const;

// ─── X (Twitter) SVG Icon ───
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── Facebook SVG Icon ───
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ─── LinkedIn SVG Icon ───
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface SocialFollowButtonsProps {
  /** Optional X follower count to display — synced from Chart Room */
  followerCount?: number;
  /** Compact mode for mobile */
  compact?: boolean;
}

export function SocialFollowButtons({ followerCount, compact = false }: SocialFollowButtonsProps) {
  const xCount = followerCount ?? null;

  return (
    <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2"}`}>
      {/* X / Twitter — pill with follower count */}
      <a
        href={SOCIAL_LINKS.x.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`Follow ${SOCIAL_LINKS.x.handle} on X`}
        className={`
          inline-flex items-center gap-1.5 rounded-full
          bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30
          text-white transition-all duration-200
          ${compact ? "px-2.5 py-1" : "px-3 py-1.5"}
        `}
      >
        <XIcon className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
        {xCount !== null && (
          <span className={`font-mono font-bold ${compact ? "text-[10px]" : "text-xs"}`}>
            {xCount}
          </span>
        )}
      </a>

      {/* Facebook Follow — blue pill */}
      <a
        href={SOCIAL_LINKS.facebook.url}
        target="_blank"
        rel="noopener noreferrer"
        title="Follow on Facebook"
        className={`
          inline-flex items-center gap-1.5 rounded-full
          bg-[#1877F2] hover:bg-[#166FE5] border border-[#1877F2]/50
          text-white transition-all duration-200
          ${compact ? "px-2.5 py-1" : "px-3 py-1.5"}
        `}
      >
        <FacebookIcon className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span className={`font-semibold ${compact ? "text-[10px]" : "text-xs"}`}>
          {SOCIAL_LINKS.facebook.label}
        </span>
      </a>

      {/* LinkedIn Follow — blue pill */}
      <a
        href={SOCIAL_LINKS.linkedin.url}
        target="_blank"
        rel="noopener noreferrer"
        title="Connect on LinkedIn"
        className={`
          inline-flex items-center gap-1.5 rounded-full
          bg-[#0A66C2] hover:bg-[#004182] border border-[#0A66C2]/50
          text-white transition-all duration-200
          ${compact ? "px-2.5 py-1" : "px-3 py-1.5"}
        `}
      >
        <LinkedInIcon className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span className={`font-semibold ${compact ? "text-[10px]" : "text-xs"}`}>
          {SOCIAL_LINKS.linkedin.label}
        </span>
      </a>
    </div>
  );
}
