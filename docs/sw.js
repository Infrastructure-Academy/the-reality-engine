// The Reality Engine — Service Worker v3
// CRITICAL FIX: v2 cached stale Vite chunks causing blank screen
// Strategy: nuke ALL old caches, network-only for JS/CSS assets
const CACHE_NAME = "tre-cache-v3";

// Install: skip waiting immediately to activate new SW
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate: delete ALL caches (including current) to clear stale chunks
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-only for assets, passthrough for everything else
self.addEventListener("fetch", (event) => {
  // Let the browser handle everything normally — no caching at all
  // This ensures Vite's hashed chunks always load fresh from server
  return;
});
