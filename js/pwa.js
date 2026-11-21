/**
 * KSA Malayali Hub — Progressive Web App Controller (v1.0)
 * Handles Service Worker Registration, Install Prompts, and Offline Monitoring
 */

(function () {
  "use strict";

  let deferredPrompt = null;
  const DISMISS_KEY = "ksa_pwa_install_dismissed_v1";
  const IOS_DISMISS_KEY = "ksa_pwa_ios_dismissed_v1";

  // 1. Service Worker Registration
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // Determine correct sw path whether on root or subdirectory
      const swPath = window.location.pathname.includes("/sahayi/") ||
                     window.location.pathname.includes("/health/") ||
                     window.location.pathname.includes("/saudi/") ||
                     window.location.pathname.includes("/about/")
                     ? "/sw.js"
                     : "./sw.js";

      navigator.serviceWorker
        .register(swPath)
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);

          // Check for worker updates
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  showToast("പുതിയ അപ്ഡേറ്റ് ലഭ്യമാണ്! പേജ് റീഫ്രഷ് ചെയ്യുക.", 4000);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    });
  }

  // 2. Offline / Online Network Monitoring
  function initOfflineMonitor() {
    const banner = document.createElement("div");
    banner.id = "pwa-offline-banner";
    banner.className = "pwa-offline-banner";
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML = `
      <div class="pwa-offline-inner">
        <span class="pwa-offline-icon" aria-hidden="true">📡</span>
        <span class="pwa-offline-text">
          <strong>ഓഫ്ലൈൻ മോഡ്:</strong> എമർജൻസി നമ്പറുകൾ, കാൽക്കുലേറ്റർ, അറബിക് സഹായി എന്നിവ ഇപ്പോഴും പ്രവർത്തിക്കും.
        </span>
      </div>
    `;
    document.body.prepend(banner);

    function updateOnlineStatus() {
      if (!navigator.onLine) {
        banner.classList.add("visible");
        document.body.classList.add("is-offline");
      } else {
        if (banner.classList.contains("visible")) {
          banner.classList.remove("visible");
          document.body.classList.remove("is-offline");
          showToast("✅ കണക്ഷൻ തിരിച്ചെത്തി (Online)", 3000);
        }
      }
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Initial check
    if (!navigator.onLine) {
      updateOnlineStatus();
    }
  }

  // 3. Android / Chromium "Install App" Prompt
  function initInstallPrompt() {
    // Check if already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent automatic mini-infobar on mobile Chrome
      e.preventDefault();
      deferredPrompt = e;

      // Check if user dismissed recently (within 7 days)
      const dismissedTime = localStorage.getItem(DISMISS_KEY);
      if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 7 * 24 * 60 * 60 * 1000) {
        return;
      }

      showInstallBanner();
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      hideInstallBanner();
      showToast("🎉 സൗദി മലയാളി ഹബ് ഇൻസ്റ്റാൾ ചെയ്തു! ഹോം സ്ക്രീനിൽ കാണാം.", 5000);
    });
  }

  function showInstallBanner() {
    if (document.getElementById("pwa-install-banner")) return;

    const banner = document.createElement("aside");
    banner.id = "pwa-install-banner";
    banner.className = "pwa-install-banner";
    banner.setAttribute("aria-label", "Install KSA Malayali Hub Web App");
    banner.innerHTML = `
      <div class="pwa-install-content">
        <img src="/assets/icon-192.png" alt="App Icon" class="pwa-install-app-icon" width="42" height="42" onerror="this.src='/assets/favicon.svg'">
        <div class="pwa-install-copy">
          <strong class="pwa-install-title">സൗദി മലയാളി ഹബ്</strong>
          <p class="pwa-install-desc">📲 ആപ്പ് ആയി ഫോണിൽ ഇൻസ്റ്റാൾ ചെയ്യാം (ഓഫ്ലൈനിലും പ്രവർത്തിക്കും)</p>
        </div>
      </div>
      <div class="pwa-install-actions">
        <button type="button" id="pwa-install-btn" class="pwa-btn-install">ഇൻസ്റ്റാൾ ചെയ്യുക</button>
        <button type="button" id="pwa-dismiss-btn" class="pwa-btn-dismiss" aria-label="Dismiss banner">✕</button>
      </div>
    `;

    document.body.appendChild(banner);

    // Trigger transition
    requestAnimationFrame(() => banner.classList.add("show"));

    const installBtn = document.getElementById("pwa-install-btn");
    const dismissBtn = document.getElementById("pwa-dismiss-btn");

    if (installBtn) {
      installBtn.addEventListener("click", async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          console.log("[PWA] User accepted installation");
        }
        deferredPrompt = null;
        hideInstallBanner();
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
        hideInstallBanner();
      });
    }
  }

  function hideInstallBanner() {
    const banner = document.getElementById("pwa-install-banner");
    if (banner) {
      banner.classList.remove("show");
      setTimeout(() => banner.remove(), 300);
    }
  }

  // 4. iOS Safari Add to Home Screen Tip
  function initIOSPrompt() {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (!isIOS || isStandalone) return;

    const dismissedTime = localStorage.getItem(IOS_DISMISS_KEY);
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    const tip = document.createElement("aside");
    tip.id = "pwa-ios-tip";
    tip.className = "pwa-ios-tip";
    tip.setAttribute("aria-label", "iOS Installation Guide");
    tip.innerHTML = `
      <div class="pwa-ios-content">
        <span class="pwa-ios-icon" aria-hidden="true">📲</span>
        <span>iPhone-ൽ ആപ്പ് ആക്കാൻ Share ബട്ടൺ (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" style="vertical-align:-2px;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>) അമർത്തി <strong>'Add to Home Screen'</strong> തിരഞ്ഞെടുക്കുക.</span>
      </div>
      <button type="button" id="pwa-ios-dismiss" class="pwa-btn-dismiss" aria-label="Dismiss tip">✕</button>
    `;

    document.body.appendChild(tip);
    requestAnimationFrame(() => tip.classList.add("show"));

    document.getElementById("pwa-ios-dismiss")?.addEventListener("click", () => {
      localStorage.setItem(IOS_DISMISS_KEY, Date.now().toString());
      tip.classList.remove("show");
      setTimeout(() => tip.remove(), 300);
    });
  }

  // 5. Offline Fallback for external internet-only links
  function initOfflineLinkInterceptor() {
    document.addEventListener("click", (e) => {
      if (navigator.onLine) return;

      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      // If clicking external link when offline (Google Maps, external portals)
      if (href.startsWith("http") && !href.includes(window.location.hostname)) {
        e.preventDefault();
        showToast("⚠️ നിങ്ങൾ ഇപ്പോൾ ഓഫ്ലൈനിലാണ്. ഇന്റർനെറ്റ് ഉള്ളപ്പോൾ ഈ ലിങ്ക് പ്രവർത്തിക്കും.", 4000);
      }
    });
  }

  // Helper Toast Notification
  function showToast(msg, duration = 3000) {
    const existing = document.getElementById("pwa-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "pwa-toast";
    toast.className = "pwa-toast";
    toast.setAttribute("role", "alert");
    toast.textContent = msg;

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Initialize all PWA components
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initOfflineMonitor();
      initInstallPrompt();
      initIOSPrompt();
      initOfflineLinkInterceptor();
    });
  } else {
    initOfflineMonitor();
    initInstallPrompt();
    initIOSPrompt();
    initOfflineLinkInterceptor();
  }
})();
