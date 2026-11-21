// KSA Malayali Hub — Progressive Web App Service Worker (v4.0)
// High-performance Offline Cache & Dynamic Resilience
const CACHE_VERSION = "ksa-malayali-hub-v5";
const DYNAMIC_CACHE = "ksa-malayali-dynamic-v4";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/sahayi",
  "/sahayi.html",
  "/sahayi/index.html",
  "/health",
  "/health.html",
  "/health/index.html",
  "/saudi",
  "/saudi.html",
  "/saudi/index.html",
  "/about",
  "/about.html",
  "/about/index.html",
  "/travel",
  "/travel.html",
  "/travel/index.html",
  "/norka",
  "/norka.html",
  "/norka/index.html",
  "/explore",
  "/explore.html",
  "/explore/index.html",
  "/js/explore.js",
  "/js/prayer_calendar.js",
  "/js/translator.js",
  "/css/styles.css",
  "/js/app.js",
  "/js/data.js",
  "/js/i18n.js",
  "/js/sahayi.js",
  "/js/health.js",
  "/js/health_data.js",
  "/js/saudi_page.js",
  "/js/tourism_data.js",
  "/js/hypermarkets_data.js",
  "/js/cinemas_data.js",
  "/js/daily_desk_data.js",
  "/js/library_data.js",
  "/js/saudi_heritage_data.js",
  "/manifest.webmanifest",
  "/manifest.json",
  "/assets/favicon.svg",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/icon-maskable-512.png",
  "/assets/apple-touch-icon.png"
];

// Install: Cache all core assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return Promise.allSettled(
        CORE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Pre-cache skipped for ${url}:`, err.message);
          })
        )
      );
    })
  );
});

// Activate: Clean up legacy caches & claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION && k !== DYNAMIC_CACHE)
          .map((k) => {
            console.log(`[SW] Purging outdated cache: ${k}`);
            return caches.delete(k);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch dispatcher
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET requests or unsupported schemes (e.g. chrome-extension, tel, whatsapp)
  if (req.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // 1. Dynamic Network-First targets (Currency API, live rate checks, third-party API)
  const isDynamicAPI =
    url.hostname.includes("open.er-api.com") ||
    url.hostname.includes("api.exchangerate") ||
    url.pathname.includes("/api/");

  if (isDynamicAPI) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match(req).then((cached) => {
            if (cached) return cached;
            return new Response(
              JSON.stringify({ offline: true, rates: { INR: 22.45 } }),
              { headers: { "Content-Type": "application/json" } }
            );
          });
        })
    );
    return;
  }

  // 2. Navigation Requests (HTML Pages): Network-First for real-time freshness, Cache fallback when offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match(req).then((cached) => {
            if (cached) return cached;
            return caches.match("/index.html");
          });
        })
    );
    return;
  }

  // 3. Static Assets: Cache-First with Network Fallback
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Stale-while-revalidate for local origin assets
        if (url.origin === self.location.origin) {
          fetch(req).then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, networkRes));
            }
          }).catch(() => {/* offline, keep cached */});
        }
        return cached;
      }

      // Not in cache: fetch from network and store in dynamic cache
      return fetch(req)
        .then((networkRes) => {
          if (networkRes && (networkRes.status === 200 || networkRes.type === "opaque")) {
            const clone = networkRes.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          // If offline and request is an image, return SVG fallback
          if (req.destination === "image") {
            return caches.match("/assets/favicon.svg");
          }
          return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
        });
    })
  );
});
