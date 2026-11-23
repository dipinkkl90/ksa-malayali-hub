/**
 * KSA Malayali Hub - Discreet Admin & Privacy-Safe Activity Logger
 * Developed by D&J Techies (+44 7460 646263)
 * 
 * Features:
 * 1. Privacy-safe event tracking (No PII, No IP, Ring-buffered in localStorage)
 * 2. Supabase Cloud Sync (REST API integration for public.activity_logs)
 * 3. Discreet 5-tap footer trigger, #admin hash, ?admin=1, or Ctrl+Shift+A shortcut
 * 4. Protected Admin Login modal & interactive Analytics Dashboard (Local & Cloud views)
 * 5. Live search, category filters, CSV/JSON export, clear logs, and session management
 */

(function () {
  "use strict";

  const STORAGE_KEY = "ksa_hub_activity_logs_v1";
  const AUTH_KEY = "ksa_admin_authenticated";
  const SUPABASE_CONFIG_KEY = "ksa_supabase_config_v1";
  const MAX_LOGS = 500;

  // Credential validation (discreet client-side admin)
  const ADMIN_CREDS = {
    user: "admin",
    altUser: "djtechies",
    pass: "malayali2030",
    altPass: "djksa2026"
  };

  // Helper to detect device & browser safely
  function getDeviceInfo() {
    const ua = navigator.userAgent || "";
    let device = "Desktop";
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      device = "Tablet";
    } else if (/mobile|iphone|ipod|android|blackberry|iemobile|kindle/i.test(ua)) {
      device = "Mobile";
    }

    let os = "Unknown OS";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
    else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua)) os = "Linux";

    let browser = "Browser";
    if (/chrome|crios/i.test(ua) && !/edg|opr\//i.test(ua)) browser = "Chrome";
    else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/edg/i.test(ua)) browser = "Edge";
    else if (/opr\//i.test(ua)) browser = "Opera";

    return { device, platform: `${os} · ${browser}` };
  }

  // Format timestamp in KSA Time (UTC+3)
  function formatKSATime(isoString) {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Riyadh",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }).format(d);
    } catch (e) {
      return isoString;
    }
  }

  // Initial realistic activity seeds if storage is freshly initialized
  function getInitialSeedLogs() {
    const now = Date.now();
    const min = 60 * 1000;
    const hour = 60 * min;

    return [
      {
        id: "seed_1",
        timestamp: new Date(now - 8 * min).toISOString(),
        timeKSA: formatKSATime(new Date(now - 8 * min).toISOString()),
        category: "PAGE_VIEW",
        action: "ഹോം പേജ് സന്ദർശിച്ചു",
        details: "റൂട്ട്: /index.html · ജിദ്ദ/റിയാദ് യൂസർ",
        device: "Mobile",
        platform: "Android · Chrome"
      },
      {
        id: "seed_2",
        timestamp: new Date(now - 22 * min).toISOString(),
        timeKSA: formatKSATime(new Date(now - 22 * min).toISOString()),
        category: "SIM_CODE",
        action: "STC (സവാ) ബാലൻസ് കോഡ് കോപ്പി ചെയ്തു",
        details: "കോഡ്: *166# (Dial: *166#)",
        device: "Mobile",
        platform: "iOS · Safari"
      },
      {
        id: "seed_3",
        timestamp: new Date(now - 45 * min).toISOString(),
        timeKSA: formatKSATime(new Date(now - 45 * min).toISOString()),
        category: "EOSB_CALC",
        action: "സർവീസ് ആനുകൂല്യം (EOSB) കണക്കുകൂട്ടി",
        details: "ബേസിക് ശമ്പളം: 4,500 SAR · കാലാവധി: 4 വർഷം",
        device: "Mobile",
        platform: "Android · Chrome"
      },
      {
        id: "seed_4",
        timestamp: new Date(now - 75 * min).toISOString(),
        timeKSA: formatKSATime(new Date(now - 75 * min).toISOString()),
        category: "RIDDLE_GAME",
        action: "ദിഗംബരൻ കുസൃതിച്ചോദ്യ മത്സരം തുടങ്ങി",
        details: "ചോദ്യം: 3 ഓപ്ഷനുകൾ · ശരിയുത്തരം നൽകി (Score: 1/1)",
        device: "Mobile",
        platform: "Android · Chrome"
      },
      {
        id: "seed_5",
        timestamp: new Date(now - 2 * hour).toISOString(),
        timeKSA: formatKSATime(new Date(now - 2 * hour).toISOString()),
        category: "PDF_DOWNLOAD",
        action: "പ്രവാസി യാത്രാ ഗൈഡ് PDF ഡൗൺലോഡ് ചെയ്തു",
        details: "ഫയൽ: pravasi-travel-guide-ksa.pdf",
        device: "Desktop",
        platform: "Windows · Chrome"
      },
      {
        id: "seed_6",
        timestamp: new Date(now - 3 * hour).toISOString(),
        timeKSA: formatKSATime(new Date(now - 3 * hour).toISOString()),
        category: "PAGE_VIEW",
        action: "ഹെൽത്ത് & ഇൻഷുറൻസ് പോർട്ടൽ സന്ദർശിച്ചു",
        details: "റൂട്ട്: /health#sim-codes-section",
        device: "Mobile",
        platform: "iOS · Safari"
      },
      {
        id: "seed_7",
        timestamp: new Date(now - 4 * hour).toISOString(),
        timeKSA: formatKSATime(new Date(now - 4 * hour).toISOString()),
        category: "SEARCH",
        action: "തിരച്ചിൽ നടത്തി: 'അൽ ബൈക്ക് ജിദ്ദ'",
        details: "ഫലങ്ങൾ: 12 റസ്റ്റോറന്റുകൾ",
        device: "Mobile",
        platform: "Android · Chrome"
      }
    ];
  }

  // --- Supabase Cloud Sync Engine ---
  const SupabaseSync = {
    getConfig() {
      try {
        const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
        if (stored) return JSON.parse(stored);
        if (window.KSA_SUPABASE_CONFIG) return window.KSA_SUPABASE_CONFIG;
      } catch (e) {
        console.warn("[SupabaseSync] Config parse error:", e);
      }
      return {
        url: "",
        anonKey: "",
        adminEmail: "",
        enabled: false
      };
    },

    saveConfig(cfg) {
      try {
        localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(cfg));
        window.dispatchEvent(new CustomEvent("hub:supabase_config_updated", { detail: cfg }));
      } catch (e) {
        console.error("[SupabaseSync] saveConfig error:", e);
      }
    },

    isEnabled() {
      const cfg = this.getConfig();
      return !!(cfg && cfg.enabled && cfg.url && cfg.anonKey);
    },

    async insertLog(payload) {
      if (!this.isEnabled()) return;
      const cfg = this.getConfig();
      try {
        const endpoint = `${cfg.url.replace(/\/+$/, "")}/rest/v1/activity_logs`;
        await fetch(endpoint, {
          method: "POST",
          headers: {
            "apikey": cfg.anonKey,
            "Authorization": `Bearer ${cfg.anonKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.debug("[SupabaseSync] insertLog skipped/offline:", err.message);
      }
    },

    async fetchLogs() {
      if (!this.isEnabled()) return [];
      const cfg = this.getConfig();
      try {
        const endpoint = `${cfg.url.replace(/\/+$/, "")}/rest/v1/activity_logs?select=*&order=created_at.desc&limit=500`;
        const res = await fetch(endpoint, {
          headers: {
            "apikey": cfg.anonKey,
            "Authorization": `Bearer ${cfg.anonKey}`
          }
        });
        if (!res.ok) {
          throw new Error(`Supabase returned status ${res.status}`);
        }
        const data = await res.json();
        return (data || []).map(row => ({
          id: row.id,
          timestamp: row.created_at,
          timeKSA: formatKSATime(row.created_at),
          category: row.event_type || "PAGE_VIEW",
          action: (row.details || "").split(" · ")[0] || row.event_type || "Activity",
          details: (row.details || "").includes(" · ") ? (row.details || "").split(" · ").slice(1).join(" · ") : (row.page_path || ""),
          device: (row.device_type || "").includes("Mobile") ? "Mobile" : ((row.device_type || "").includes("Tablet") ? "Tablet" : "Desktop"),
          platform: row.device_type || "Web Browser"
        }));
      } catch (err) {
        console.warn("[SupabaseSync] fetchLogs error:", err);
        throw err;
      }
    },

    async clearLogs() {
      if (!this.isEnabled()) return false;
      const cfg = this.getConfig();
      try {
        const endpoint = `${cfg.url.replace(/\/+$/, "")}/rest/v1/activity_logs?id=neq.00000000-0000-0000-0000-000000000000`;
        const res = await fetch(endpoint, {
          method: "DELETE",
          headers: {
            "apikey": cfg.anonKey,
            "Authorization": `Bearer ${cfg.anonKey}`,
            "Prefer": "return=minimal"
          }
        });
        return res.ok;
      } catch (err) {
        console.warn("[SupabaseSync] clearLogs error:", err);
        return false;
      }
    }
  };

  window.SupabaseSync = SupabaseSync;

  // --- Core Logger Engine ---
  const HubLogger = {
    getLogs() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          const seeds = getInitialSeedLogs();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
          return seeds;
        }
        return JSON.parse(raw);
      } catch (err) {
        console.warn("[HubLogger] Read error, resetting:", err);
        return [];
      }
    },

    saveLogs(logs) {
      try {
        const trimmed = logs.slice(0, MAX_LOGS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        window.dispatchEvent(new CustomEvent("hub:logs_updated", { detail: { count: trimmed.length } }));
      } catch (err) {
        console.error("[HubLogger] Save error:", err);
      }
    },

    logEvent(category, action, details) {
      const logs = this.getLogs();
      const now = new Date();
      const iso = now.toISOString();
      const { device, platform } = getDeviceInfo();

      const newEntry = {
        id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        timestamp: iso,
        timeKSA: formatKSATime(iso),
        category: category || "PAGE_VIEW",
        action: action || "Unknown Action",
        details: typeof details === "object" ? JSON.stringify(details) : (details || ""),
        device,
        platform
      };

      logs.unshift(newEntry);
      this.saveLogs(logs);

      // Async fire-and-forget sync to Supabase if configured
      if (typeof SupabaseSync !== "undefined" && SupabaseSync.isEnabled()) {
        SupabaseSync.insertLog({
          event_type: category || "PAGE_VIEW",
          page_path: window.location.pathname + (window.location.hash || ""),
          details: `${action || ''} · ${typeof details === 'object' ? JSON.stringify(details) : (details || '')}`,
          device_type: `${device} (${platform})`
        });
      }

      return newEntry;
    },

    clearLogs() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent("hub:logs_updated", { detail: { count: 0 } }));
    },

    computeStats(logs) {
      const stats = {
        total: logs.length,
        pageViews: 0,
        eosbCalcs: 0,
        pdfDownloads: 0,
        simCodes: 0,
        riddles: 0,
        searches: 0,
        mobileCount: 0,
        desktopCount: 0
      };

      logs.forEach(l => {
        if (l.category === "PAGE_VIEW") stats.pageViews++;
        else if (l.category === "EOSB_CALC") stats.eosbCalcs++;
        else if (l.category === "PDF_DOWNLOAD") stats.pdfDownloads++;
        else if (l.category === "SIM_CODE") stats.simCodes++;
        else if (l.category === "RIDDLE_GAME") stats.riddles++;
        else if (l.category === "SEARCH") stats.searches++;

        if (l.device === "Mobile") stats.mobileCount++;
        else stats.desktopCount++;
      });

      const totalDevices = stats.mobileCount + stats.desktopCount;
      stats.mobilePct = totalDevices > 0 ? Math.round((stats.mobileCount / totalDevices) * 100) : 0;
      stats.desktopPct = totalDevices > 0 ? (100 - stats.mobilePct) : 0;

      return stats;
    },

    getStats() {
      return this.computeStats(this.getLogs());
    },

    exportCSV(customLogs) {
      const logs = customLogs || this.getLogs();
      if (!logs.length) {
        alert("എക്‌സ്‌പോർട്ട് ചെയ്യാൻ ലോഗുകൾ ലഭ്യമല്ല!");
        return;
      }

      const headers = ["ID", "Timestamp (KSA)", "Category", "Action", "Details", "Device", "Platform"];
      const rows = logs.map(l => [
        `"${(l.id || '').replace(/"/g, '""')}"`,
        `"${(l.timeKSA || l.timestamp || '').replace(/"/g, '""')}"`,
        `"${(l.category || '').replace(/"/g, '""')}"`,
        `"${(l.action || '').replace(/"/g, '""')}"`,
        `"${(l.details || '').replace(/"/g, '""')}"`,
        `"${(l.device || '').replace(/"/g, '""')}"`,
        `"${(l.platform || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `ksa_malayali_hub_activity_logs_${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    exportJSON(customLogs) {
      const logs = customLogs || this.getLogs();
      const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `ksa_malayali_hub_activity_logs_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  window.HubLogger = HubLogger;

  // --- Admin Modal & Dashboard Component ---
  const HubAdmin = {
    isOpen: false,
    currentFilter: "ALL",
    searchQuery: "",
    viewMode: "local", // "local" | "supabase" | "settings"
    cloudLogs: [],
    isLoadingCloud: false,
    cloudError: null,

    isAuthenticated() {
      return sessionStorage.getItem(AUTH_KEY) === "true";
    },

    login(username, password) {
      const u = (username || "").trim().toLowerCase();
      const p = (password || "").trim();

      if (
        (u === ADMIN_CREDS.user || u === ADMIN_CREDS.altUser) &&
        (p === ADMIN_CREDS.pass || p === ADMIN_CREDS.altPass)
      ) {
        sessionStorage.setItem(AUTH_KEY, "true");
        HubLogger.logEvent("PAGE_VIEW", "അഡ്മിൻ പോർട്ടലിൽ വിജയകരമായി ലോഗിൻ ചെയ്തു", "Admin Session Authenticated");
        return true;
      }
      return false;
    },

    logout() {
      sessionStorage.removeItem(AUTH_KEY);
      HubLogger.logEvent("PAGE_VIEW", "അഡ്മിൻ ലോഗ്ഔട്ട് ചെയ്തു", "Admin Session Ended");
      this.render();
    },

    open() {
      this.injectStyles();
      this.ensureModalDOM();
      this.isOpen = true;
      const modal = document.getElementById("ksa-admin-modal");
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        this.render();
      }
    },

    close() {
      this.isOpen = false;
      const modal = document.getElementById("ksa-admin-modal");
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
      if (window.location.hash === "#admin" || window.location.hash === "#admin-login") {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    },

    async loadCloudLogs() {
      this.isLoadingCloud = true;
      this.cloudError = null;
      this.render();
      try {
        const logs = await SupabaseSync.fetchLogs();
        this.cloudLogs = logs || [];
      } catch (err) {
        this.cloudError = err.message || "Failed to fetch from Supabase";
      } finally {
        this.isLoadingCloud = false;
        this.render();
      }
    },

    injectStyles() {
      if (document.getElementById("ksa-admin-styles")) return;
      const style = document.createElement("style");
      style.id = "ksa-admin-styles";
      style.textContent = `
        /* Admin Modal Backdrop & Container */
        .ksa-admin-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
          font-family: var(--font-sans, "Inter", "Noto Sans Malayalam", sans-serif);
        }
        .ksa-admin-backdrop.active {
          opacity: 1;
          pointer-events: auto;
        }

        .ksa-admin-dialog {
          background: #09131c;
          border: 1.5px solid rgba(245, 158, 11, 0.35);
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(245, 158, 11, 0.15);
          width: 100%;
          max-width: 980px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: #f1f5f9;
          transform: translateY(20px) scale(0.97);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ksa-admin-backdrop.active .ksa-admin-dialog {
          transform: translateY(0) scale(1);
        }

        /* Login Dialog Box Specific */
        .ksa-admin-dialog.login-mode {
          max-width: 440px;
        }

        /* Header */
        .ksa-admin-header {
          background: linear-gradient(135deg, #064e3b 0%, #0f172a 100%);
          padding: 18px 22px;
          border-bottom: 1px solid rgba(245, 158, 11, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .ksa-admin-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ksa-admin-shield {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
        }
        .ksa-admin-title-wrap h2 {
          margin: 0;
          font-size: 1.12rem;
          font-weight: 800;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ksa-admin-title-wrap p {
          margin: 3px 0 0;
          font-size: 0.76rem;
          color: #94a3b8;
        }
        .ksa-admin-close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ksa-admin-close-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #ffffff;
          border-color: #ef4444;
        }

        /* Body container */
        .ksa-admin-body {
          padding: 22px;
          overflow-y: auto;
          flex: 1;
        }

        /* Mode Selector Tabs */
        .ksa-admin-tabs-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 12px;
        }
        .ksa-admin-tab-btn {
          background: #0f172a;
          border: 1px solid #334155;
          color: #cbd5e1;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .ksa-admin-tab-btn:hover {
          border-color: #f59e0b;
          color: #ffffff;
        }
        .ksa-admin-tab-btn.active {
          background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
          border-color: #10b981;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }
        .ksa-cloud-status-badge {
          margin-left: auto;
          font-size: 0.72rem;
          padding: 3px 9px;
          border-radius: 999px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .ksa-cloud-status-badge.connected {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        .ksa-cloud-status-badge.disconnected {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.25);
        }

        /* Settings Card */
        .ksa-admin-settings-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 600px;
          margin: 0 auto;
          text-align: left;
        }
        .ksa-admin-settings-title {
          font-size: 1rem;
          font-weight: 800;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ksa-admin-settings-desc {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.5;
        }

        /* Login Form */
        .ksa-admin-login-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ksa-admin-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }
        .ksa-admin-input-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #cbd5e1;
        }
        .ksa-admin-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .ksa-admin-input {
          width: 100%;
          background: #0f172a;
          border: 1.5px solid #334155;
          border-radius: 10px;
          padding: 11px 14px;
          color: #ffffff;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ksa-admin-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
        }
        .ksa-admin-pass-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 4px;
        }
        .ksa-admin-login-btn {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: #ffffff;
          border: 1px solid #10b981;
          border-radius: 10px;
          padding: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.15s, box-shadow 0.2s;
          margin-top: 6px;
        }
        .ksa-admin-login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.35);
        }
        .ksa-admin-login-btn:active {
          transform: scale(0.98);
        }
        .ksa-admin-error-box {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.84rem;
          display: none;
          text-align: left;
        }
        .ksa-admin-demo-hint {
          font-size: 0.74rem;
          color: #64748b;
          text-align: center;
          margin-top: 8px;
        }

        /* Dashboard Overview Grid */
        .ksa-admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .ksa-admin-stat-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ksa-admin-stat-val {
          font-size: 1.45rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }
        .ksa-admin-stat-lbl {
          font-size: 0.74rem;
          color: #94a3b8;
          font-weight: 600;
        }

        /* Action Toolbar */
        .ksa-admin-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          background: rgba(15, 23, 42, 0.5);
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ksa-admin-search-input {
          flex: 1;
          min-width: 220px;
          background: #09131c;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 8px 12px;
          color: #ffffff;
          font-size: 0.85rem;
          outline: none;
        }
        .ksa-admin-search-input:focus {
          border-color: #f59e0b;
        }
        .ksa-admin-actions-group {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
        .ksa-admin-btn {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .ksa-admin-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }
        .ksa-admin-btn.btn-export {
          background: rgba(5, 150, 105, 0.2);
          border-color: #059669;
          color: #6ee7b7;
        }
        .ksa-admin-btn.btn-export:hover {
          background: #059669;
          color: #ffffff;
        }
        .ksa-admin-btn.btn-danger {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }
        .ksa-admin-btn.btn-danger:hover {
          background: #ef4444;
          color: #ffffff;
        }

        /* Filter Pills */
        .ksa-admin-filters {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin-bottom: 12px;
        }
        .ksa-admin-filter-pill {
          background: #0f172a;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .ksa-admin-filter-pill.active {
          background: #f59e0b;
          border-color: #f59e0b;
          color: #000000;
          font-weight: 700;
        }

        /* Table & Card Stream */
        .ksa-admin-table-wrap {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow: hidden;
          background: #060e17;
        }
        .ksa-admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
          text-align: left;
        }
        .ksa-admin-table th {
          background: #0f172a;
          color: #cbd5e1;
          font-weight: 700;
          padding: 10px 14px;
          border-bottom: 1px solid #334155;
        }
        .ksa-admin-table td {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          vertical-align: middle;
        }
        .ksa-admin-table tr:hover td {
          background: rgba(255, 255, 255, 0.03);
        }

        /* Category Badges */
        .ksa-cat-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .ksa-cat-PAGE_VIEW { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .ksa-cat-EOSB_CALC { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .ksa-cat-PDF_DOWNLOAD { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
        .ksa-cat-SIM_CODE { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
        .ksa-cat-RIDDLE_GAME { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
        .ksa-cat-SEARCH { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); }

        .ksa-device-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 7px;
          border-radius: 999px;
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.06);
          color: #94a3b8;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .ksa-admin-dialog {
            max-height: 96vh;
            border-radius: 16px;
          }
          .ksa-admin-header {
            padding: 14px 16px;
          }
          .ksa-admin-body {
            padding: 14px;
          }
          .ksa-admin-table th:nth-child(5),
          .ksa-admin-table td:nth-child(5) {
            display: none;
          }
          .ksa-admin-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `;
      document.head.appendChild(style);
    },

    ensureModalDOM() {
      if (document.getElementById("ksa-admin-modal")) return;

      const backdrop = document.createElement("div");
      backdrop.id = "ksa-admin-modal";
      backdrop.className = "ksa-admin-backdrop";
      backdrop.setAttribute("role", "dialog");
      backdrop.setAttribute("aria-modal", "true");
      backdrop.setAttribute("aria-label", "അഡ്മിൻ പോർട്ടൽ · KSA Malayali Hub");

      backdrop.innerHTML = `
        <div class="ksa-admin-dialog" id="ksa-admin-dialog">
          <div class="ksa-admin-header">
            <div class="ksa-admin-title-wrap">
              <div class="ksa-admin-shield" aria-hidden="true">🛡️</div>
              <div>
                <h2 id="ksa-admin-head-title">അഡ്മിൻ പോർട്ടൽ <span style="font-size:0.75rem; color:#f59e0b; font-weight:600;">D&amp;J Techies</span></h2>
                <p id="ksa-admin-head-sub">KSA Malayali Hub സിസ്റ്റം അനലിറ്റിക്സ് &amp; മോണിറ്ററിംഗ്</p>
              </div>
            </div>
            <button type="button" class="ksa-admin-close-btn" id="ksa-admin-close-btn" title="ക്ലോസ് ചെയ്യുക" aria-label="Close">✕</button>
          </div>
          <div class="ksa-admin-body" id="ksa-admin-body">
            <!-- Dynamic Content -->
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);

      document.getElementById("ksa-admin-close-btn").addEventListener("click", () => this.close());

      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) this.close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) this.close();
      });
    },

    render() {
      const body = document.getElementById("ksa-admin-body");
      const dialog = document.getElementById("ksa-admin-dialog");
      const headTitle = document.getElementById("ksa-admin-head-title");
      const headSub = document.getElementById("ksa-admin-head-sub");

      if (!body) return;

      if (!this.isAuthenticated()) {
        // --- LOGIN VIEW ---
        if (dialog) dialog.className = "ksa-admin-dialog login-mode";
        headTitle.innerHTML = `അഡ്മിൻ ലോഗിൻ <span style="font-size:0.75rem; color:#f59e0b; font-weight:600;">D&amp;J TECHIES</span>`;
        headSub.textContent = "സിസ്റ്റം ആക്റ്റിവിറ്റി ലോഗുകൾ കാണാൻ ലോഗിൻ ചെയ്യുക";

        body.innerHTML = `
          <form class="ksa-admin-login-card" id="ksa-admin-login-form">
            <div class="ksa-admin-error-box" id="ksa-login-error"></div>
            
            <div class="ksa-admin-input-group">
              <label for="ksa-admin-user">യൂസർനെയിം (Username)</label>
              <input type="text" id="ksa-admin-user" class="ksa-admin-input" placeholder="admin" required autofocus autocomplete="username">
            </div>

            <div class="ksa-admin-input-group">
              <label for="ksa-admin-pass">പാസ്‌വേഡ് (Password)</label>
              <div class="ksa-admin-input-wrap">
                <input type="password" id="ksa-admin-pass" class="ksa-admin-input" placeholder="••••••••" required autocomplete="current-password">
                <button type="button" class="ksa-admin-pass-toggle" id="ksa-pass-toggle" title="പാസ്‌വേഡ് കാണിക്കുക">👁️</button>
              </div>
            </div>

            <button type="submit" class="ksa-admin-login-btn">
              <span>ലോഗിൻ ചെയ്യുക (Login)</span>
              <span>➔</span>
            </button>

            <div class="ksa-admin-demo-hint">
              🔒 പൂർണ്ണമായും രഹസ്യവും ഡിസ്‌ക്രീറ്റുമായ അഡ്മിൻ കൺസോൾ · D&amp;J Techies (+44 7460 646263)
            </div>
          </form>
        `;

        const form = document.getElementById("ksa-admin-login-form");
        const userInp = document.getElementById("ksa-admin-user");
        const passInp = document.getElementById("ksa-admin-pass");
        const toggleBtn = document.getElementById("ksa-pass-toggle");
        const errorBox = document.getElementById("ksa-login-error");

        toggleBtn.addEventListener("click", () => {
          if (passInp.type === "password") {
            passInp.type = "text";
            toggleBtn.textContent = "🔒";
          } else {
            passInp.type = "password";
            toggleBtn.textContent = "👁️";
          }
        });

        form.addEventListener("submit", (e) => {
          e.preventDefault();
          errorBox.style.display = "none";
          const success = this.login(userInp.value, passInp.value);
          if (success) {
            this.render();
          } else {
            errorBox.textContent = "❌ തെറ്റായ യൂസർനെയിം അല്ലെങ്കിൽ പാസ്‌വേഡ്! വീണ്ടും ശ്രമിക്കുക.";
            errorBox.style.display = "block";
            passInp.value = "";
            passInp.focus();
          }
        });

      } else {
        // --- DASHBOARD VIEW ---
        if (dialog) dialog.className = "ksa-admin-dialog";
        headTitle.innerHTML = `ആക്റ്റിവിറ്റി ലോഗുകൾ <span style="font-size:0.75rem; color:#10b981; font-weight:700;">🟢 ആക്റ്റീവ് സെഷൻ</span>`;
        headSub.textContent = "D&J Techies · പ്രൈവസി-സേഫ് മോണിറ്ററിംഗ് & ക്ലൗഡ് അനലിറ്റിക്സ്";

        const sbConfig = SupabaseSync.getConfig();
        const isSbConnected = SupabaseSync.isEnabled();

        // 1. Settings View
        if (this.viewMode === "settings") {
          body.innerHTML = `
            <div class="ksa-admin-tabs-row">
              <button type="button" class="ksa-admin-tab-btn" id="tab-btn-local">💻 ലോക്കൽ ലോഗുകൾ</button>
              <button type="button" class="ksa-admin-tab-btn" id="tab-btn-cloud">☁️ ക്ലൗഡ് ലോഗുകൾ (Supabase)</button>
              <button type="button" class="ksa-admin-tab-btn active" id="tab-btn-settings">⚙️ Supabase Settings</button>
            </div>

            <div class="ksa-admin-settings-card">
              <div class="ksa-admin-settings-title">
                <span>☁️ Supabase Cloud Database Configuration</span>
              </div>
              <p class="ksa-admin-settings-desc">
                സന്ദർശകരുടെ ഉപയോഗ വിവരങ്ങൾ Supabase PostgreSQL ഡാറ്റാബേസിൽ (<code>public.activity_logs</code>) സുരക്ഷിതമായി സൂക്ഷിക്കാൻ നിങ്ങളുടെ Supabase ക്രെഡൻഷ്യലുകൾ ഇവിടെ നൽകുക.
              </p>

              <form id="ksa-supabase-config-form" style="display:flex; flex-direction:column; gap:12px;">
                <div class="ksa-admin-input-group">
                  <label for="sb-url">Supabase Project URL</label>
                  <input type="url" id="sb-url" class="ksa-admin-input" placeholder="https://xxxxxxxx.supabase.co" value="${this.escapeHTML(sbConfig.url || '')}" required>
                </div>

                <div class="ksa-admin-input-group">
                  <label for="sb-anon">Supabase Anon Public Key</label>
                  <input type="text" id="sb-anon" class="ksa-admin-input" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${this.escapeHTML(sbConfig.anonKey || '')}" required>
                </div>

                <div class="ksa-admin-input-group">
                  <label for="sb-email">Admin Email (RLS Read/Delete നായി)</label>
                  <input type="email" id="sb-email" class="ksa-admin-input" placeholder="your-admin-email@gmail.com" value="${this.escapeHTML(sbConfig.adminEmail || '')}">
                </div>

                <div style="display:flex; align-items:center; gap:10px; margin-top:6px;">
                  <button type="submit" class="ksa-admin-login-btn" style="flex:1; margin:0;">
                    <span>💾 സേവ് ചെയ്ത് കണക്റ്റ് ചെയ്യുക</span>
                  </button>
                  <button type="button" id="btn-disconnect-sb" class="ksa-admin-btn btn-danger" style="padding:11px 16px;">
                    <span>ഡിസ്കണക്റ്റ് ചെയ്യുക</span>
                  </button>
                </div>
              </form>

              <div style="margin-top:14px; background:#050c14; border:1px solid #1e293b; border-radius:10px; padding:12px; font-size:0.75rem; color:#94a3b8;">
                <strong style="color:#f59e0b;">💡 Supabase SQL സ്കീമ:</strong> പ്രോജക്റ്റിലെ <code>supabase_schema.sql</code> ഫയൽ കോപ്പി ചെയ്ത് Supabase SQL Editor-ൽ റൺ ചെയ്താൽ <code>public.activity_logs</code> ടേബിളും RLS പോളിസികളും ഇൻസ്റ്റന്റായി റെഡിയാകും!
              </div>
            </div>
          `;

          document.getElementById("tab-btn-local").addEventListener("click", () => {
            this.viewMode = "local";
            this.render();
          });
          document.getElementById("tab-btn-cloud").addEventListener("click", () => {
            this.viewMode = "supabase";
            if (!this.cloudLogs.length) this.loadCloudLogs();
            else this.render();
          });

          const form = document.getElementById("ksa-supabase-config-form");
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const url = document.getElementById("sb-url").value.trim();
            const anonKey = document.getElementById("sb-anon").value.trim();
            const adminEmail = document.getElementById("sb-email").value.trim();
            SupabaseSync.saveConfig({ url, anonKey, adminEmail, enabled: true });
            alert("✅ Supabase കോൺഫിഗറേഷൻ സേവ് ചെയ്തു! ക്ലൗഡ് ലോഗുകൾ ലോഡ് ചെയ്യുന്നു...");
            this.viewMode = "supabase";
            this.loadCloudLogs();
          });

          document.getElementById("btn-disconnect-sb").addEventListener("click", () => {
            if (confirm("Supabase ഡിസ്കണക്റ്റ് ചെയ്യണമെന്നുറപ്പാണോ?")) {
              SupabaseSync.saveConfig({ url: "", anonKey: "", adminEmail: "", enabled: false });
              this.cloudLogs = [];
              alert("Supabase ഡിസ്കണക്റ്റ് ചെയ്തു.");
              this.viewMode = "local";
              this.render();
            }
          });

          return;
        }

        // 2. Data Determination (Local vs Cloud)
        const isCloudMode = this.viewMode === "supabase";
        let activeLogs = isCloudMode ? this.cloudLogs : HubLogger.getLogs();
        let stats = HubLogger.computeStats(activeLogs);

        // Filter and Search
        let filtered = activeLogs.filter(l => {
          if (this.currentFilter !== "ALL" && l.category !== this.currentFilter) {
            return false;
          }
          if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            const text = `${l.action} ${l.details} ${l.category} ${l.device} ${l.platform}`.toLowerCase();
            return text.includes(q);
          }
          return true;
        });

        body.innerHTML = `
          <!-- Mode Selector Tabs -->
          <div class="ksa-admin-tabs-row">
            <button type="button" class="ksa-admin-tab-btn ${!isCloudMode ? 'active' : ''}" id="tab-btn-local">
              <span>💻 ലോക്കൽ ലോഗുകൾ</span>
            </button>
            <button type="button" class="ksa-admin-tab-btn ${isCloudMode ? 'active' : ''}" id="tab-btn-cloud">
              <span>☁️ ക്ലൗഡ് ലോഗുകൾ (Supabase)</span>
            </button>
            <button type="button" class="ksa-admin-tab-btn" id="tab-btn-settings" title="Supabase Settings">
              <span>⚙️ Supabase Settings</span>
            </button>

            <span class="ksa-cloud-status-badge ${isSbConnected ? 'connected' : 'disconnected'}">
              <span>${isSbConnected ? '🟢 Supabase Active' : '⚪ Local Mode'}</span>
            </span>
          </div>

          ${isCloudMode && !isSbConnected ? `
            <div style="background:rgba(245, 158, 11, 0.12); border:1px solid rgba(245, 158, 11, 0.35); border-radius:12px; padding:18px; margin-bottom:16px; text-align:center;">
              <h4 style="margin:0 0 6px; color:#fde68a;">☁️ Supabase ക്ലൗഡ് കണക്റ്റ് ചെയ്തിട്ടില്ല</h4>
              <p style="margin:0 0 12px; font-size:0.82rem; color:#cbd5e1;">ക്ലൗഡ് ലോഗുകൾ സൂക്ഷിക്കാനും കാണാനും Supabase പ്രോജക്റ്റ് URL-ഉം Anon Key-യും നൽകുക.</p>
              <button type="button" id="btn-quick-config-sb" class="ksa-admin-btn btn-export">⚙️ Configure Supabase Now</button>
            </div>
          ` : ''}

          ${isCloudMode && this.cloudError ? `
            <div style="background:rgba(239, 68, 68, 0.15); border:1px solid rgba(239, 68, 68, 0.4); color:#fca5a5; padding:12px; border-radius:10px; margin-bottom:14px; font-size:0.82rem;">
              ⚠️ Supabase പിശക്: ${this.escapeHTML(this.cloudError)}
            </div>
          ` : ''}

          <!-- Stats Summary -->
          <div class="ksa-admin-stats-grid">
            <div class="ksa-admin-stat-card">
              <span class="ksa-admin-stat-val">${stats.total}</span>
              <span class="ksa-admin-stat-lbl">📊 ആകെ ഇവന്റുകൾ</span>
            </div>
            <div class="ksa-admin-stat-card">
              <span class="ksa-admin-stat-val">${stats.pageViews}</span>
              <span class="ksa-admin-stat-lbl">📄 പേജ് സന്ദർശനം</span>
            </div>
            <div class="ksa-admin-stat-card">
              <span class="ksa-admin-stat-val">${stats.eosbCalcs}</span>
              <span class="ksa-admin-stat-lbl">🧮 EOSB കണക്കുകൂട്ടലുകൾ</span>
            </div>
            <div class="ksa-admin-stat-card">
              <span class="ksa-admin-stat-val">${stats.pdfDownloads}</span>
              <span class="ksa-admin-stat-lbl">📥 PDF ഡൗൺലോഡ്</span>
            </div>
            <div class="ksa-admin-stat-card">
              <span class="ksa-admin-stat-val">${stats.simCodes}</span>
              <span class="ksa-admin-stat-lbl">📱 സിം കോഡ് ക്ലിക്കുകൾ</span>
            </div>
            <div class="ksa-admin-stat-card">
              <span class="ksa-admin-stat-val">${stats.riddles}</span>
              <span class="ksa-admin-stat-lbl">😜 കുസൃതിച്ചോദ്യം</span>
            </div>
            <div class="ksa-admin-stat-card">
              <span class="ksa-admin-stat-val">${stats.mobilePct}%</span>
              <span class="ksa-admin-stat-lbl">📱 മൊബൈൽ വിഹിതം</span>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="ksa-admin-toolbar">
            <input type="text" id="ksa-admin-search" class="ksa-admin-search-input" placeholder="ലോഗുകളിൽ തിരയുക... (Search actions, codes, routes)" value="${this.searchQuery}">
            <div class="ksa-admin-actions-group">
              <button type="button" class="ksa-admin-btn" id="ksa-admin-refresh-btn" title="റീഫ്രഷ് ചെയ്യുക">
                <span>🔄 ${this.isLoadingCloud ? 'ലോഡ് ചെയ്യുന്നു...' : 'Refresh'}</span>
              </button>
              <button type="button" class="ksa-admin-btn btn-export" id="ksa-admin-csv-btn" title="CSV ആയി ഡൗൺലോഡ് ചെയ്യുക">📥 Export CSV</button>
              <button type="button" class="ksa-admin-btn btn-export" id="ksa-admin-json-btn" title="JSON ആയി ഡൗൺലോഡ് ചെയ്യുക">📥 Export JSON</button>
              <button type="button" class="ksa-admin-btn btn-danger" id="ksa-admin-clear-btn" title="ലോഗുകൾ നീക്കം ചെയ്യുക">🗑️ Clear Logs</button>
              <button type="button" class="ksa-admin-btn" id="ksa-admin-logout-btn" title="അഡ്മിൻ ലോഗ്ഔട്ട്">🔒 Logout</button>
            </div>
          </div>

          <!-- Category Filter Pills -->
          <div class="ksa-admin-filters">
            <button type="button" class="ksa-admin-filter-pill ${this.currentFilter === 'ALL' ? 'active' : ''}" data-cat="ALL">🌐 എല്ലാം (${activeLogs.length})</button>
            <button type="button" class="ksa-admin-filter-pill ${this.currentFilter === 'PAGE_VIEW' ? 'active' : ''}" data-cat="PAGE_VIEW">📄 പേജ് സന്ദർശനം (${stats.pageViews})</button>
            <button type="button" class="ksa-admin-filter-pill ${this.currentFilter === 'EOSB_CALC' ? 'active' : ''}" data-cat="EOSB_CALC">🧮 കാൽക്കുലേറ്റർ (${stats.eosbCalcs})</button>
            <button type="button" class="ksa-admin-filter-pill ${this.currentFilter === 'PDF_DOWNLOAD' ? 'active' : ''}" data-cat="PDF_DOWNLOAD">📥 PDF ഡൗൺലോഡ് (${stats.pdfDownloads})</button>
            <button type="button" class="ksa-admin-filter-pill ${this.currentFilter === 'SIM_CODE' ? 'active' : ''}" data-cat="SIM_CODE">📱 സിം കോഡുകൾ (${stats.simCodes})</button>
            <button type="button" class="ksa-admin-filter-pill ${this.currentFilter === 'RIDDLE_GAME' ? 'active' : ''}" data-cat="RIDDLE_GAME">😜 കുസൃതിച്ചോദ്യം (${stats.riddles})</button>
            <button type="button" class="ksa-admin-filter-pill ${this.currentFilter === 'SEARCH' ? 'active' : ''}" data-cat="SEARCH">🔍 തിരച്ചിലുകൾ (${stats.searches})</button>
          </div>

          <!-- Table Container -->
          <div class="ksa-admin-table-wrap">
            <table class="ksa-admin-table">
              <thead>
                <tr>
                  <th style="width: 140px;">സമയം (KSA Time)</th>
                  <th style="width: 130px;">വിഭാഗം</th>
                  <th>പ്രവർത്തനം (Action)</th>
                  <th>വിശദാംശങ്ങൾ (Details)</th>
                  <th style="width: 110px;">ഡിവൈസ്</th>
                </tr>
              </thead>
              <tbody id="ksa-admin-table-body">
                ${filtered.length === 0 ? `
                  <tr>
                    <td colspan="5" style="text-align: center; padding: 30px; color: #94a3b8;">
                      ${this.isLoadingCloud ? 'ലോഗുകൾ ക്ലൗഡിൽ നിന്ന് ലോഡ് ചെയ്യുന്നു...' : 'ലോഗുകൾ ഒന്നും കണ്ടെത്താനായില്ല.'}
                    </td>
                  </tr>
                ` : filtered.map(item => `
                  <tr>
                    <td style="font-family: monospace; font-size: 0.74rem; color: #94a3b8; white-space: nowrap;">
                      ${item.timeKSA || formatKSATime(item.timestamp)}
                    </td>
                    <td>
                      <span class="ksa-cat-badge ksa-cat-${item.category || 'PAGE_VIEW'}">
                        ${this.getCategoryIcon(item.category)} ${item.category}
                      </span>
                    </td>
                    <td style="font-weight: 700;">
                      ${this.escapeHTML(item.action)}
                    </td>
                    <td style="color: #cbd5e1; font-size: 0.78rem;">
                      ${this.escapeHTML(item.details)}
                    </td>
                    <td>
                      <span class="ksa-device-badge">
                        ${item.device === 'Mobile' ? '📱' : '💻'} ${item.device || 'Desktop'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

        // Wire View Mode Tabs
        document.getElementById("tab-btn-local").addEventListener("click", () => {
          this.viewMode = "local";
          this.render();
        });
        document.getElementById("tab-btn-cloud").addEventListener("click", () => {
          this.viewMode = "supabase";
          if (!this.cloudLogs.length) this.loadCloudLogs();
          else this.render();
        });
        document.getElementById("tab-btn-settings").addEventListener("click", () => {
          this.viewMode = "settings";
          this.render();
        });

        const quickConfigBtn = document.getElementById("btn-quick-config-sb");
        if (quickConfigBtn) {
          quickConfigBtn.addEventListener("click", () => {
            this.viewMode = "settings";
            this.render();
          });
        }

        // Search Input
        const searchInput = document.getElementById("ksa-admin-search");
        if (searchInput) {
          searchInput.addEventListener("input", (e) => {
            this.searchQuery = e.target.value.trim();
            this.render();
            const newSearch = document.getElementById("ksa-admin-search");
            if (newSearch) {
              newSearch.focus();
              newSearch.setSelectionRange(newSearch.value.length, newSearch.value.length);
            }
          });
        }

        // Toolbar Actions
        document.getElementById("ksa-admin-refresh-btn").addEventListener("click", () => {
          if (isCloudMode) this.loadCloudLogs();
          else this.render();
        });

        document.getElementById("ksa-admin-csv-btn").addEventListener("click", () => {
          HubLogger.exportCSV(activeLogs);
        });

        document.getElementById("ksa-admin-json-btn").addEventListener("click", () => {
          HubLogger.exportJSON(activeLogs);
        });

        document.getElementById("ksa-admin-logout-btn").addEventListener("click", () => this.logout());

        document.getElementById("ksa-admin-clear-btn").addEventListener("click", async () => {
          if (isCloudMode) {
            if (confirm("Supabase ക്ലൗഡിലെ എല്ലാ ആക്റ്റിവിറ്റി ലോഗുകളും നീക്കം ചെയ്യണമെന്നുറപ്പാണോ?")) {
              const ok = await SupabaseSync.clearLogs();
              if (ok) {
                alert("✅ Supabase ക്ലൗഡ് ലോഗുകൾ ക്ലിയർ ചെയ്തു!");
                this.loadCloudLogs();
              } else {
                alert("⚠️ Supabase ലോഗുകൾ ക്ലിയർ ചെയ്യാൻ സാധിച്ചില്ല (RLS Policy പരിശോധിക്കുക).");
              }
            }
          } else {
            if (confirm("എല്ലാ ലോക്കൽ ആക്റ്റിവിറ്റി ലോഗുകളും പൂർണ്ണമായി നീക്കം ചെയ്യണമെന്നുറപ്പാണോ?")) {
              HubLogger.clearLogs();
              this.render();
            }
          }
        });

        // Filter Pills
        body.querySelectorAll(".ksa-admin-filter-pill").forEach(pill => {
          pill.addEventListener("click", () => {
            this.currentFilter = pill.getAttribute("data-cat");
            this.render();
          });
        });
      }
    },

    getCategoryIcon(cat) {
      switch (cat) {
        case "PAGE_VIEW": return "📄";
        case "EOSB_CALC": return "🧮";
        case "PDF_DOWNLOAD": return "📥";
        case "SIM_CODE": return "📱";
        case "RIDDLE_GAME": return "😜";
        case "SEARCH": return "🔍";
        default: return "✨";
      }
    },

    escapeHTML(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
  };

  window.HubAdmin = HubAdmin;

  // --- Discreet 5-Tap Trigger on Footer Copyright ---
  function setupDiscreetTrigger() {
    let tapCount = 0;
    let tapTimer = null;

    function handleFooterTap(e) {
      tapCount++;
      clearTimeout(tapTimer);

      tapTimer = setTimeout(() => {
        tapCount = 0;
      }, 3000);

      if (tapCount >= 5) {
        tapCount = 0;
        clearTimeout(tapTimer);
        HubAdmin.open();
      }
    }

    function bindFooter() {
      const targets = [
        document.querySelector(".footer-disclaimer"),
        document.querySelector(".footer-bottom-row"),
        document.querySelector(".site-footer"),
        document.querySelector(".footer-brand-name"),
        document.querySelector(".studio-monogram")
      ].filter(Boolean);

      targets.forEach(el => {
        el.addEventListener("click", handleFooterTap);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bindFooter);
    } else {
      bindFooter();
    }

    function checkUrlTrigger() {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === "#admin" || hash === "#admin-login" || params.get("admin") === "1") {
        setTimeout(() => HubAdmin.open(), 300);
      }
    }

    window.addEventListener("hashchange", checkUrlTrigger);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", checkUrlTrigger);
    } else {
      checkUrlTrigger();
    }

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        HubAdmin.open();
      }
    });
  }

  // --- Automatic Page View Logging ---
  function autoLogPageView() {
    const pageName = document.title || window.location.pathname;
    const cleanPath = window.location.pathname + (window.location.hash ? window.location.hash : "");
    HubLogger.logEvent("PAGE_VIEW", `സന്ദർശിച്ചു: ${pageName}`, `റൂട്ട്: ${cleanPath}`);
  }

  // --- Global Event Hooks for High-Value Features ---
  function setupEventHooks() {
    document.addEventListener("click", (e) => {
      const simDial = e.target.closest('a[href^="tel:"]');
      if (simDial) {
        const href = simDial.getAttribute("href") || "";
        const code = decodeURIComponent(href.replace("tel:", ""));
        const card = simDial.closest(".sim-card, .sim-provider-group, .health-card");
        const providerName = card ? (card.querySelector("h3, h4, strong")?.textContent?.trim() || "Telecom") : "Telecom";
        HubLogger.logEvent("SIM_CODE", `${providerName} ഡയൽ ലിങ്ക് ക്ലിക്ക് ചെയ്തു`, `കോഡ്: ${code}`);
        return;
      }

      const copyBtn = e.target.closest("button.sim-copy-btn, button[data-copy], button[onclick*='copySimCode']");
      if (copyBtn) {
        const code = copyBtn.getAttribute("data-code") || copyBtn.closest(".sim-code-row, div")?.querySelector("code")?.textContent || "";
        HubLogger.logEvent("SIM_CODE", "സിം കോഡ് കോപ്പി ചെയ്തു", `കോഡ്: ${code}`);
        return;
      }

      const calcBtn = e.target.closest("#btn-calculate-eosb, button[onclick*='calculateEOSB'], button[id*='eosb']");
      if (calcBtn) {
        const salary = document.getElementById("eosb-salary")?.value || "";
        const years = document.getElementById("eosb-years")?.value || "";
        HubLogger.logEvent("EOSB_CALC", "സർവീസ് ആനുകൂല്യം (EOSB) കണക്കുകൂട്ടി", `ശമ്പളം: ${salary || 'N/A'} SAR, കാലയളവ്: ${years || 'N/A'} വർഷം`);
        return;
      }

      const pdfBtn = e.target.closest("button[id*='pdf'], a[href*='.pdf'], button[onclick*='export'], button[onclick*='downloadPdf']");
      if (pdfBtn) {
        const label = pdfBtn.textContent?.trim() || "Document PDF";
        HubLogger.logEvent("PDF_DOWNLOAD", `PDF ഡൗൺലോഡ് ട്രിഗർ ചെയ്തു: ${label.slice(0, 30)}`, window.location.pathname);
        return;
      }

      const riddleChip = e.target.closest("button.diga-quick-pill, button.riddle-choice-btn, button#digambaran-game-next");
      if (riddleChip) {
        const text = riddleChip.textContent?.trim() || "";
        if (text.includes("കുസൃതി") || text.includes("ചോദ്യം") || text.includes("അടുത്ത")) {
          HubLogger.logEvent("RIDDLE_GAME", `ദിഗംബരൻ കുസൃതിച്ചോദ്യം: ${text.slice(0, 30)}`, "Interactive Riddle Game");
        }
      }
    }, true);

    const searchInputs = document.querySelectorAll("input[type='search'], #site-search-input, #library-search-input");
    searchInputs.forEach(input => {
      input.addEventListener("change", (e) => {
        const val = e.target.value?.trim();
        if (val && val.length >= 2) {
          HubLogger.logEvent("SEARCH", `തിരച്ചിൽ നടത്തി: '${val.slice(0, 30)}'`, window.location.pathname);
        }
      });
    });
  }

  setupDiscreetTrigger();
  setupEventHooks();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoLogPageView);
  } else {
    autoLogPageView();
  }

})();
