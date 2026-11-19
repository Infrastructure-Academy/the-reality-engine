export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/** Public Quest door. GitHub Pages serves this after merge to main. */
export const QUEST_PUBLIC_URL = "https://app.infrastructure-academy.com";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  // The public Pages door has no OAuth portal. Keep the link on the Quest site.
  if (!oauthPortalUrl || !appId) return `${QUEST_PUBLIC_URL}/`;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
