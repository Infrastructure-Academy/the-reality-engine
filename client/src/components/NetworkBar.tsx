/**
 * iAAi Network Bar — NAV-INSTALL-001
 * 5-site cross-site navigation infrastructure.
 * Fixed top, dark navy #0a1628, 36px height, z-index 60.
 * Font: 11px, text white #FFFFFF, icons 14×14 SVG inline in agent colour.
 * Active tab: agent colour underline (3px solid) — text stays white.
 * XCHANGE: dimmed (opacity 0.5) until live.
 * Mobile: all 5 links visible — no hamburger menu.
 * Behaviour: same-tab navigation within iAAi network.
 */

/* 14×14 SVG icon paths per site */
const ICONS: Record<string, { path: string; viewBox?: string }> = {
  academy: {
    // Graduation cap
    path: "M7 2L0 6l7 4 7-4-7-4zM2 7.5v3L7 14l5-3.5v-3L7 11 2 7.5z",
  },
  quest: {
    // Shield / checker
    path: "M7 0L1 3v5c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V3L7 0zm0 2l4 2v4c0 2.4-1.8 4.6-4 5.1V2z",
  },
  xchange: {
    // Columns / storefront
    path: "M1 1h2v10H1V1zm4 0h2v10H5V1zm4 0h2v10H9V1zm-8 11h12v1H1v-1zM3 0h8l2 1H1l2-1z",
  },
  memorial: {
    // Star
    path: "M7 0l2.1 4.4L14 5.1l-3.5 3.4.8 4.9L7 11.1l-4.3 2.3.8-4.9L0 5.1l4.9-.7L7 0z",
  },
  news: {
    // Flag
    path: "M2 0v14h1V0H2zm2 1v7l4-1.5L12 8V1L8 2.5 4 1z",
  },
};

const SITES = [
  {
    id: "academy",
    label: "ACADEMY",
    agent: "MAX",
    role: "The Contractor — Hardening",
    color: "#DC2626",
    url: "https://infra-acad-kuqzaex2.manus.space",
  },
  {
    id: "quest",
    label: "QUEST",
    agent: "DAVID",
    role: "The Checker — Quenching",
    color: "#2563EB",
    url: "/", // current site
    active: true,
  },
  {
    id: "xchange",
    label: "XCHANGE",
    agent: "ATLAS",
    role: "The Supplier — Forging",
    color: "#D4A843",
    url: "#", // PENDING BUILD — not yet live
    pending: true,
  },
  {
    id: "memorial",
    label: "MEMORIAL",
    agent: "ISAAC",
    role: "The Lead — Tempering",
    color: "#16A34A",
    url: "https://nigelmemorial-ucmtq9dn.manus.space",
  },
  {
    id: "news",
    label: "NEWS",
    agent: "JENNY",
    role: "The Client — Observer",
    color: "#06B6D4",
    url: "https://xgrowthtrk-2a93yo5z.manus.space",
  },
] as const;

function SiteIcon({ siteId, color, size = 14 }: { siteId: string; color: string; size?: number }) {
  const icon = ICONS[siteId];
  if (!icon) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox || "0 0 14 14"}
      fill={color}
      className="flex-shrink-0"
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}

export function NetworkBar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 flex items-center justify-center gap-0"
      style={{
        height: "36px",
        backgroundColor: "#0a1628",
        zIndex: 60,
      }}
    >
      {SITES.map((site) => {
        const isActive = "active" in site && site.active;
        const isPending = "pending" in site && site.pending;
        return (
          <a
            key={site.id}
            href={isPending ? undefined : site.url}
            onClick={isPending ? (e: React.MouseEvent) => e.preventDefault() : undefined}
            title={`${site.agent} — ${site.role}${isPending ? " (Coming Soon)" : ""}`}
            className="group relative flex items-center justify-center gap-1.5 px-2 sm:px-3 h-full text-[11px] tracking-wider transition-opacity hover:opacity-100 whitespace-nowrap"
            style={{
              color: "#FFFFFF",
              opacity: isPending ? 0.5 : 1,
              borderBottom: isActive ? `3px solid ${site.color}` : "3px solid transparent",
              cursor: isPending ? "default" : "pointer",
            }}
          >
            <SiteIcon siteId={site.id} color={site.color} />
            <span>{site.label}</span>
            {/* Tooltip — visible on hover (desktop only) */}
            <span
              className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] tracking-wide whitespace-nowrap z-[10000]"
              style={{
                backgroundColor: "#0f1d32",
                border: `1px solid ${site.color}40`,
                color: site.color,
              }}
            >
              <SiteIcon siteId={site.id} color={site.color} size={10} />
              {site.agent} — {site.role}
              {isPending && (
                <span className="ml-1 text-[8px] opacity-60">[PENDING]</span>
              )}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
