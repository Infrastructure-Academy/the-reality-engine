/**
 * iAAi Network Bar — NAV-001
 * Cross-site navigation infrastructure.
 * Fixed top, dark navy #0a1628, 36px height, 4 site links with agent colours.
 * Active state: agent colour underline (3px solid) on current site (TRE).
 * Mobile: all 4 links visible — no hamburger menu.
 * Behaviour: same-tab navigation within iAAi network.
 * Tooltips: show agent name + role on hover.
 */

const SITES = [
  {
    id: "acad",
    label: "ACAD",
    agent: "MAX",
    role: "The Contractor",
    color: "#DC2626",
    url: "https://infra-acad-kuqzaex2.manus.space",
  },
  {
    id: "tre",
    label: "TRE",
    agent: "DAVID",
    role: "The Checker",
    color: "#2563EB",
    url: "/", // current site
    active: true,
  },
  {
    id: "memorial",
    label: "MEMORIAL",
    agent: "ISAAC",
    role: "The Lead",
    color: "#16A34A",
    url: "https://nigelmemorial-ucmtq9dn.manus.space",
  },
  {
    id: "chartroom",
    label: "CHART ROOM",
    agent: "JENNY",
    role: "The Client",
    color: "#06B6D4",
    url: "https://xgrowthtrk-2a93yo5z.manus.space",
  },
] as const;

export function NetworkBar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-0"
      style={{
        height: "36px",
        backgroundColor: "#0a1628",
      }}
    >
      {SITES.map((site) => {
        const isActive = "active" in site && site.active;
        return (
          <a
            key={site.id}
            href={site.url}
            title={`${site.agent} — ${site.role}`}
            className="group relative flex items-center justify-center px-3 sm:px-5 h-full text-[10px] sm:text-[11px] font-mono tracking-wider transition-opacity hover:opacity-100 whitespace-nowrap"
            style={{
              color: isActive ? site.color : "#FFFFFF",
              opacity: isActive ? 1 : 0.7,
              borderBottom: isActive ? `3px solid ${site.color}` : "3px solid transparent",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0 hidden sm:block"
              style={{ backgroundColor: site.color }}
            />
            {site.label}
            {/* Tooltip — visible on hover (desktop only) */}
            <span
              className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono tracking-wide whitespace-nowrap z-[10000]"
              style={{
                backgroundColor: "#0f1d32",
                border: `1px solid ${site.color}40`,
                color: site.color,
              }}
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: site.color }}
              />
              {site.agent} — {site.role}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
