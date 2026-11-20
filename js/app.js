/* ==========================================================================
   KSA Kerala Foods — Main Application Logic
   Covers: Jeddah, Makkah, Madinah, Taif, Riyadh, Dammam
   Developed by D&J Techies · WhatsApp: +44 7460 646263
   ========================================================================== */

(function () {
  "use strict";

  const SUPPORT_WHATSAPP_RAW = "447460646263";
  const SUPPORT_WHATSAPP_DISPLAY = "+44 7460 646263";
  const DEVELOPER_NAME = "D&J";
  // Admin-only passcode (Dynamic with factory default DJ2026, changeable via Admin Portal)
  const DEFAULT_ADMIN_PIN = "DJ2026";
  const ADMIN_PIN_STORAGE_KEY = "jkf_admin_pin_v1";

  function getActiveAdminPin() {
    return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || DEFAULT_ADMIN_PIN;
  }

  function setCustomAdminPin(pin) {
    localStorage.setItem(ADMIN_PIN_STORAGE_KEY, pin);
  }

  function resetAdminPinToDefault() {
    localStorage.removeItem(ADMIN_PIN_STORAGE_KEY);
  }

  // Live Community Visitor Traffic Counter & Confidential Admin Real Telemetry
  const VISIT_COUNT_STORAGE_KEY = "jkf_visit_counter_v2";
  const BASE_VISITS = 1324;

  const REAL_SESSIONS_STORAGE_KEY = "jkf_real_sessions_v1";
  const REAL_VIEWS_STORAGE_KEY = "jkf_real_views_v1";
  const REAL_FIRST_VISIT_STORAGE_KEY = "jkf_real_first_visit_v1";
  const REAL_LAST_VISIT_STORAGE_KEY = "jkf_real_last_visit_v1";

  function initRealTrafficTracker() {
    try {
      // Track actual page hits
      let views = parseInt(localStorage.getItem(REAL_VIEWS_STORAGE_KEY) || "0", 10) + 1;
      localStorage.setItem(REAL_VIEWS_STORAGE_KEY, String(views));

      // Track unique browser sessions
      let sessions = parseInt(localStorage.getItem(REAL_SESSIONS_STORAGE_KEY) || "0", 10);
      if (!sessionStorage.getItem("jkf_real_session_recorded")) {
        sessions += 1;
        sessionStorage.setItem("jkf_real_session_recorded", "1");
        localStorage.setItem(REAL_SESSIONS_STORAGE_KEY, String(sessions));
      }

      // Record first and last visit timestamps
      const nowStr = new Date().toLocaleString();
      if (!localStorage.getItem(REAL_FIRST_VISIT_STORAGE_KEY)) {
        localStorage.setItem(REAL_FIRST_VISIT_STORAGE_KEY, nowStr);
      }
      localStorage.setItem(REAL_LAST_VISIT_STORAGE_KEY, nowStr);
    } catch (_) {
      /* ignore storage restrictions */
    }
  }

  function getRealTrafficData() {
    return {
      sessions: parseInt(localStorage.getItem(REAL_SESSIONS_STORAGE_KEY) || "1", 10),
      views: parseInt(localStorage.getItem(REAL_VIEWS_STORAGE_KEY) || "1", 10),
      firstVisit: localStorage.getItem(REAL_FIRST_VISIT_STORAGE_KEY) || "Today",
      lastVisit: localStorage.getItem(REAL_LAST_VISIT_STORAGE_KEY) || "Just now",
    };
  }

  function initVisitCounter() {
    initRealTrafficTracker();
    let count = parseInt(localStorage.getItem(VISIT_COUNT_STORAGE_KEY) || "0", 10);
    if (!count || count < BASE_VISITS) {
      count = BASE_VISITS;
    }
    if (!sessionStorage.getItem("jkf_visited_session")) {
      count += Math.floor(Math.random() * 3) + 1;
      sessionStorage.setItem("jkf_visited_session", "1");
      localStorage.setItem(VISIT_COUNT_STORAGE_KEY, String(count));
    }
    return count;
  }

  let totalVisits = initVisitCounter();
  const CITY_FALLBACK_COORDS = {
    Jeddah: [21.5433, 39.1728],
    Makkah: [21.4225, 39.8262],
    Madinah: [24.4672, 39.6111],
    Taif: [21.2703, 40.4158],
    Riyadh: [24.7136, 46.6753],
    Dammam: [26.4207, 50.0888],
    Buraidah: [26.326, 43.975],
    Tabuk: [28.3838, 36.555],
    "Al Jouf": [29.9697, 40.2064],
    "Al Baha": [20.0129, 41.4677],
    "Khamis Mushait": [18.3061, 42.7294],
  };
  const CITY_ORDER = [
    "Jeddah",
    "Makkah",
    "Madinah",
    "Taif",
    "Riyadh",
    "Dammam",
    "Buraidah",
    "Tabuk",
    "Al Jouf",
    "Al Baha",
    "Khamis Mushait",
  ];

  // Crisp bespoke SVG icon library (zero generic OS emojis)
  const SVG = {
    sun: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    star: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    heart: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    heartFill: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    pin: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    nav: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>`,
    phone: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    info: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    share: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
    copy: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  };

  let DATA = Array.isArray(window.KSA_KERALA_FOODS)
    ? [...window.KSA_KERALA_FOODS]
    : Array.isArray(window.RESTAURANT_DATA)
    ? [...window.RESTAURANT_DATA]
    : Array.isArray(window.JEDDAH_KERALA_FOODS)
    ? [...window.JEDDAH_KERALA_FOODS]
    : [];
  const I18N = window.JKF_I18N || { en: {} };

  // Default community site reviews (Admin can edit, hide, or delete anytime)
  const REVIEWS_STORAGE_KEY = "jkf_site_reviews_v1";
  const DEFAULT_SITE_REVIEWS = [
    {
      id: "REV-1001",
      name: "Shameer K.",
      city: "Jeddah",
      rating: 5,
      comment: "Finally a clean, trustworthy Malayali food directory for Saudi Arabia! Found Rahmath and Malabar spots in Sharafeyah and Al Safa within seconds.",
      created_at: "2026-11-18",
      hidden: false,
    },
    {
      id: "REV-1002",
      name: "Anjali Menon",
      city: "Riyadh",
      rating: 5,
      comment: "Super helpful while travelling between Riyadh, Taif, and Makkah with family. Malayalam toggle and direct Google Maps links work smoothly.",
      created_at: "2026-11-18",
      hidden: false,
    },
    {
      id: "REV-1003",
      name: "Faisal Rahman",
      city: "Dammam",
      rating: 5,
      comment: "Great initiative by D&J Techies! Covering smaller cities like Buraidah, Tabuk, and Khamis Mushait makes this truly useful for all pravasis.",
      created_at: "2026-11-18",
      hidden: false,
    },
  ];

  function loadSiteReviews() {
    try {
      const saved = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || "null");
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {
      /* fallback to defaults */
    }
    return DEFAULT_SITE_REVIEWS.map((r) => ({ ...r }));
  }

  function saveSiteReviews() {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(REVIEWS));
  }

  let REVIEWS = loadSiteReviews();

  // Application state
  const state = {
    lang: localStorage.getItem("jkf_lang") || "en",
    theme:
      localStorage.getItem("jkf_theme") ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    city: "", // "" = All KSA, or one of the 11 KSA cities
    query: "",
    area: "",
    category: "",
    sort: "rating",
    onlyPhone: false,
    onlyTopRated: false,
    onlyReviewed: false,
    onlySaved: false,
    view: "grid", // "grid" | "map" | "hypers" | "cinemas" | "reviews" | "suggestions"
    brandFilter: "", // "" | "lulu" | "nesto" | "grand" | "cityflower" | "almadina"
    cinemaBrandFilter: "", // "" | "vox" | "muvi" | "amc" | "empire"
    savedIds: new Set(JSON.parse(localStorage.getItem("jkf_saved") || "[]")),
    userCoords: null, // { lat, lng }
    activeDetailId: null,
    isAdmin: sessionStorage.getItem("jkf_admin_unlocked") === "1",
    adminChangesCount: 0,
    selectedReviewStars: 5,
  };

  // Leaflet map references
  let leafletMap = null;
  let markersLayer = null;

  // DOM helpers
  const $ = (id) => document.getElementById(id);

  function t(key, vars) {
    const dict = I18N[state.lang] || I18N.en;
    let str = dict[key] ?? I18N.en[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  }

  function tCategory(cat) {
    const dict = I18N[state.lang] || I18N.en;
    return (dict.categories && dict.categories[cat]) || cat;
  }

  function tCity(city) {
    const dict = I18N[state.lang] || I18N.en;
    return (dict.cities && dict.cities[city]) || city;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildWhatsAppUrl(message) {
    return `https://wa.me/${SUPPORT_WHATSAPP_RAW}?text=${encodeURIComponent(message)}`;
  }

  function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Toast notifications
  let toastTimer = null;
  function showToast(msg) {
    const el = $("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(t("toastCopied"))).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(t("toastCopied"));
    } finally {
      document.body.removeChild(ta);
    }
  }

  // Theme management
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    localStorage.setItem("jkf_theme", state.theme);
    const themeBtn = $("theme-toggle");
    if (themeBtn) {
      themeBtn.innerHTML = state.theme === "dark" ? SVG.sun : SVG.moon;
      themeBtn.setAttribute("aria-label", state.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  // Language management
  function applyLanguage() {
    document.documentElement.lang = state.lang;
    localStorage.setItem("jkf_lang", state.lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });

    const langBtn = $("lang-toggle");
    if (langBtn) {
      langBtn.textContent = state.lang === "en" ? "മലയാളം" : "English";
    }

    renderCityTabs();
    populateSelects();
    render();
    if (state.activeDetailId) {
      openDetailModal(state.activeDetailId);
    }
  }

  // Get ordered list of cities in dataset
  function getOrderedCities() {
    const counts = {};
    DATA.forEach((item) => {
      const c = item.city || "Jeddah";
      counts[c] = (counts[c] || 0) + 1;
    });
    const extraCities = Object.keys(counts)
      .filter((c) => !CITY_ORDER.includes(c))
      .sort((a, b) => a.localeCompare(b));
    return [...CITY_ORDER.filter((c) => counts[c]), ...extraCities].map((city) => ({
      city,
      count: counts[city],
    }));
  }

  // Render City Selector Tabs
  function renderCityTabs() {
    const bar = $("city-tabs");
    if (!bar) return;

    const cities = getOrderedCities();
    bar.innerHTML = "";

    const makeTab = (cityVal, label, count) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const isActive = state.city === cityVal;
      btn.className = "city-tab" + (isActive ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      btn.innerHTML = `<span class="city-tab-dot" aria-hidden="true"></span><span>${escapeHtml(label)}</span><span class="city-tab-count">${count}</span>`;
      btn.addEventListener("click", () => {
        if (state.city === cityVal) return;
        state.city = cityVal;
        state.area = "";
        renderCityTabs();
        populateSelects();
        render();
      });
      return btn;
    };

    bar.appendChild(makeTab("", t("allCitiesLabel"), DATA.length));
    cities.forEach(({ city, count }) => {
      bar.appendChild(makeTab(city, tCity(city), count));
    });
  }

  // Scope dataset to active city for Area/Category counts
  function getCityScopedData() {
    if (!state.city) return DATA;
    return DATA.filter((item) => item.city === state.city);
  }

  // Populate Area & Category dropdowns + Popular Area pills
  function populateSelects() {
    const areaSelect = $("area-select");
    const catSelect = $("category-select");
    const sortSelect = $("sort-select");

    const scoped = getCityScopedData();
    const areaCounts = {};
    const catCounts = {};
    scoped.forEach((item) => {
      if (item.area) areaCounts[item.area] = (areaCounts[item.area] || 0) + 1;
      if (item.category) catCounts[item.category] = (catCounts[item.category] || 0) + 1;
    });

    // Clear state.area if it doesn't exist in selected city
    if (state.area && !areaCounts[state.area]) {
      state.area = "";
    }

    // Area select
    const allAreasLabel = state.city
      ? t("allAreasInCity", { city: tCity(state.city) })
      : t("allAreas");
    areaSelect.innerHTML = `<option value="">${escapeHtml(allAreasLabel)} (${scoped.length})</option>`;
    Object.keys(areaCounts)
      .sort((a, b) => a.localeCompare(b))
      .forEach((areaName) => {
        const opt = document.createElement("option");
        opt.value = areaName;
        opt.textContent = `${areaName} (${areaCounts[areaName]})`;
        areaSelect.appendChild(opt);
      });
    areaSelect.value = state.area;

    // Category select
    const prevCat = state.category;
    catSelect.innerHTML = `<option value="">${escapeHtml(t("allCategories"))}</option>`;
    Object.keys(catCounts)
      .sort((a, b) => catCounts[b] - catCounts[a])
      .forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = `${tCategory(cat)} (${catCounts[cat]})`;
        catSelect.appendChild(opt);
      });
    if (prevCat && !catCounts[prevCat]) {
      state.category = "";
    }
    catSelect.value = state.category;

    // Sort select labels
    const sortOptions = [
      ["rating", t("sortHighestRated")],
      ["reviews", t("sortMostReviewed")],
      ["name", t("sortNameAZ")],
      ["city", t("sortCityAZ")],
      ["area", t("sortAreaAZ")],
      ["phone", t("sortPhoneFirst")],
    ];
    if (state.userCoords) {
      sortOptions.unshift(["nearest", t("sortNearest")]);
    }
    sortSelect.innerHTML = sortOptions
      .map(([val, label]) => `<option value="${val}">${escapeHtml(label)}</option>`)
      .join("");
    sortSelect.value = state.sort;

    // Popular area pills (top 8 districts in current city or across KSA)
    const topAreas = Object.entries(areaCounts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8);
    const pillsWrap = $("popular-areas-list");
    pillsWrap.innerHTML = "";
    topAreas.forEach(([areaName, count]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "area-pill" + (state.area === areaName ? " active" : "");
      btn.dataset.areaName = areaName;
      btn.textContent = `${areaName} · ${count}`;
      btn.addEventListener("click", () => {
        state.area = state.area === areaName ? "" : areaName;
        $("area-select").value = state.area;
        updatePopularAreaHighlight();
        render();
      });
      pillsWrap.appendChild(btn);
    });
  }

  function updatePopularAreaHighlight() {
    document.querySelectorAll(".area-pill").forEach((pill) => {
      const name = pill.dataset.areaName || pill.textContent.split(" · ")[0];
      pill.classList.toggle("active", state.area === name);
    });
  }

  // Update Hero live stats
  function updateStats() {
    const cities = new Set(DATA.map((d) => d.city).filter(Boolean));
    const phones = DATA.filter((d) => d.phone_e164).length;

    if ($("stat-spots")) $("stat-spots").textContent = DATA.length;
    if ($("stat-cities")) $("stat-cities").textContent = cities.size;
    if ($("stat-hypers")) $("stat-hypers").textContent = (window.HYPERMARKET_DATA || []).length;
    if ($("cinemas-tab-badge")) $("cinemas-tab-badge").textContent = (window.CINEMA_DATA || []).length;
    if ($("stat-phones")) $("stat-phones").textContent = phones;
    if ($("stat-saved")) $("stat-saved").textContent = state.savedIds.size;

    if ($("visit-count-display")) {
      $("visit-count-display").textContent = totalVisits.toLocaleString();
    }
    if ($("topbar-visits-count")) {
      $("topbar-visits-count").textContent = (totalVisits / 1000).toFixed(1) + "K+ Visits";
    }

    const savedChipCount = $("saved-chip-count");
    if (savedChipCount) {
      savedChipCount.textContent = state.savedIds.size > 0 ? ` (${state.savedIds.size})` : "";
    }
  }

  // Filter & Sort pipeline
  function getFilteredData() {
    const q = state.query.trim().toLowerCase();

    let list = DATA.filter((item) => {
      if (state.city && item.city !== state.city) return false;
      if (state.area && item.area !== state.area) return false;
      if (state.category && item.category !== state.category) return false;
      if (state.onlyPhone && !item.phone_e164) return false;
      if (state.onlyTopRated && (!item.display_rating || item.display_rating < 4.2)) return false;
      if (state.onlyReviewed && (!item.review_count || item.review_count <= 0)) return false;
      if (state.onlySaved && !state.savedIds.has(item.restaurant_id)) return false;

      if (q) {
        const haystack = [
          item.name,
          item.city,
          tCity(item.city),
          item.area,
          item.full_address,
          item.restaurant_id,
          item.category,
          item.business_type,
          ...(item.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    // Attach dynamic distance when userCoords exist
    if (state.userCoords) {
      list = list.map((item) => ({
        ...item,
        _distKm:
          typeof item.latitude === "number" && typeof item.longitude === "number"
            ? haversineKm(state.userCoords.lat, state.userCoords.lng, item.latitude, item.longitude)
            : 9999,
      }));
    }

    // Sort
    list.sort((a, b) => {
      switch (state.sort) {
        case "nearest":
          return (a._distKm ?? 9999) - (b._distKm ?? 9999);
        case "reviews":
          return (b.review_count || 0) - (a.review_count || 0) || (b.display_rating || 0) - (a.display_rating || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "city":
          return (a.city || "").localeCompare(b.city || "") || a.area.localeCompare(b.area) || a.name.localeCompare(b.name);
        case "area":
          return a.area.localeCompare(b.area) || a.name.localeCompare(b.name);
        case "phone":
          return (b.phone_e164 ? 1 : 0) - (a.phone_e164 ? 1 : 0) || (b.display_rating || 0) - (a.display_rating || 0);
        case "rating":
        default:
          return (
            (b.display_rating || 0) - (a.display_rating || 0) ||
            (b.review_count || 0) - (a.review_count || 0) ||
            a.name.localeCompare(b.name)
          );
      }
    });

    return list;
  }

  function hasActiveFilters() {
    return Boolean(
      state.city ||
        state.query.trim() ||
        state.area ||
        state.category ||
        state.onlyPhone ||
        state.onlyTopRated ||
        state.onlyReviewed ||
        state.onlySaved
    );
  }

  function resetFilters() {
    state.city = "";
    state.query = "";
    state.area = "";
    state.category = "";
    state.onlyPhone = false;
    state.onlyTopRated = false;
    state.onlyReviewed = false;
    state.onlySaved = false;
    state.brandFilter = "";
    state.cinemaBrandFilter = "";

    document.querySelectorAll(".hyper-brand-pill").forEach((p) => {
      p.classList.toggle("active", !p.getAttribute("data-brand"));
    });
    document.querySelectorAll(".cinema-brand-pill").forEach((p) => {
      p.classList.toggle("active", !p.getAttribute("data-cinema-brand"));
    });

    $("search-input").value = "";
    $("clear-search").classList.remove("visible");

    renderCityTabs();
    populateSelects();
    syncFilterChipsUI();
    updatePopularAreaHighlight();
    render();
  }

  function syncFilterChipsUI() {
    $("chip-phone").classList.toggle("active", state.onlyPhone);
    $("chip-top").classList.toggle("active", state.onlyTopRated);
    $("chip-reviewed").classList.toggle("active", state.onlyReviewed);
    $("chip-saved").classList.toggle("active", state.onlySaved);
    $("chip-near").classList.toggle("active", Boolean(state.userCoords && state.sort === "nearest"));
    $("chip-reset").style.display = hasActiveFilters() ? "inline-flex" : "none";
  }

  function toggleSaved(id) {
    if (state.savedIds.has(id)) {
      state.savedIds.delete(id);
      showToast(t("toastUnsaved"));
    } else {
      state.savedIds.add(id);
      showToast(t("toastSaved"));
    }
    localStorage.setItem("jkf_saved", JSON.stringify([...state.savedIds]));
    updateStats();
    render();
  }

  function getCategoryClass(category) {
    if (category === "Bakery & Coolbar") return "bakery";
    if (category === "Cafe & Snacks") return "cafe";
    if (category === "Fast Food") return "fastfood";
    return "";
  }

  function buildShareRestaurantWhatsAppUrl(item) {
    const cityLabel = item.city || "Saudi Arabia";
    const lines = [
      `🍛 *${item.name}*`,
      `📍 ${item.area}, ${cityLabel}`,
      item.full_address ? `🏠 ${item.full_address}` : "",
      item.phone_e164 ? `📞 ${item.phone_e164}` : "",
      item.display_rating
        ? `⭐ ${item.display_rating.toFixed(1)}${item.review_count ? ` (${item.review_count} reviews)` : ""}`
        : "",
      item.maps_search_url ? `🗺 Google Maps: ${item.maps_search_url}` : "",
      `— Found on KSA Malayali Hub (${DEVELOPER_NAME})`,
    ].filter(Boolean);
    return `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  // Render Grid Cards
  function renderCards(items) {
    const grid = $("cards-grid");
    grid.innerHTML = "";

    if (!items.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🍛</div>
          <h3>${escapeHtml(t("emptyTitle"))}</h3>
          <p>${escapeHtml(t("emptyDesc"))}</p>
          <div class="empty-actions">
            <button type="button" class="card-btn card-btn-primary" id="empty-reset-btn" style="flex:0 0 auto;padding:10px 18px;">
              ${escapeHtml(t("emptyReset", { total: DATA.length }))}
            </button>
            <button type="button" class="card-btn" id="empty-suggest-btn" style="flex:0 0 auto;padding:10px 18px;">
              ➕ ${escapeHtml(t("emptySuggest"))}
            </button>
          </div>
        </div>
      `;
      $("empty-reset-btn").addEventListener("click", resetFilters);
      $("empty-suggest-btn").addEventListener("click", openSubmitModal);
      return;
    }

    const frag = document.createDocumentFragment();

    items.forEach((item) => {
      const isSaved = state.savedIds.has(item.restaurant_id);
      const card = document.createElement("article");
      card.className = "card";

      const ratingHtml =
        item.rating !== null
          ? `<span class="rating-pill" title="Business listing rating">${SVG.star} ${item.rating.toFixed(1)}${
              item.review_count ? ` (${item.review_count.toLocaleString()})` : ""
            }</span>`
          : item.directory_rating !== null
          ? `<span class="rating-pill dir" title="Directory rating">${SVG.star} ${item.directory_rating.toFixed(1)} · ${escapeHtml(
              t("ratingDirectory")
            )}</span>`
          : "";

      const distHtml =
        typeof item._distKm === "number" && item._distKm < 1500
          ? `<span class="distance-badge">${SVG.nav} ${escapeHtml(t("kmAway", { km: item._distKm.toFixed(1) }))}</span>`
          : "";

      const tagsHtml = (item.tags || [])
        .slice(0, 3)
        .map((tg) => `<span class="mini-tag">${escapeHtml(tg)}</span>`)
        .join("");

      const callBtnHtml = item.phone_e164
        ? `<a class="card-btn card-btn-call" href="tel:${escapeHtml(item.phone_e164.replace(/\s+/g, ""))}">${SVG.phone} ${escapeHtml(
            t("btnCall")
          )}</a>`
        : "";

      const cityName = item.city || "Jeddah";

      const photoHtml = item.photo
        ? `<div class="card-img-wrap" data-detail="${escapeHtml(item.restaurant_id)}">
            <img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.name)}" class="card-img" loading="lazy" onerror="this.parentElement.style.display=\'none\'">
          </div>`
        : "";

      card.innerHTML = `
        <div class="card-top">
          <div class="card-badges">
            <span class="cat-badge ${getCategoryClass(item.category)}">${escapeHtml(tCategory(item.category))}</span>
            ${ratingHtml}
          </div>
          <button type="button" class="fav-btn ${isSaved ? "saved" : ""}" data-fav="${escapeHtml(
        item.restaurant_id
      )}" aria-label="Save restaurant" title="Save restaurant">
            ${isSaved ? SVG.heartFill : SVG.heart}
          </button>
        </div>

        ${photoHtml}

        <h3 class="card-title" data-detail="${escapeHtml(item.restaurant_id)}">${escapeHtml(item.name)}</h3>

        <div class="card-area-row">
          <span class="card-area-text">${SVG.pin} ${escapeHtml(item.area)}</span>
          <span class="city-pill-badge">${escapeHtml(tCity(cityName))}</span>
          ${distHtml}
        </div>

        <p class="card-address">${escapeHtml(item.full_address)}</p>

        <div class="card-tags">
          ${tagsHtml}
          <span class="mini-tag">${
            item.coord_precision === "plus_code" ? "Exact Plus Code" : `${escapeHtml(tCity(cityName))} · KSA`
          }</span>
        </div>

        <div class="card-meta-footer">
          <a class="card-btn card-btn-primary" href="${escapeHtml(item.maps_search_url)}" target="_blank" rel="noopener noreferrer">
            ${SVG.nav} ${escapeHtml(t("btnMaps"))}
          </a>
          ${callBtnHtml}
          <button type="button" class="card-btn" data-detail="${escapeHtml(item.restaurant_id)}">
            ${SVG.info} ${escapeHtml(t("btnDetails"))}
          </button>
          <a class="card-btn card-btn-icon" href="${escapeHtml(
            buildShareRestaurantWhatsAppUrl(item)
          )}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(t("btnShare"))}" aria-label="${escapeHtml(
        t("btnShare")
      )}">
            ${SVG.share}
          </a>
        </div>
        ${
          state.isAdmin
            ? `<div class="card-admin-strip">
                <button type="button" class="card-admin-btn" data-admin-edit="${escapeHtml(item.restaurant_id)}">Edit</button>
                <button type="button" class="card-admin-btn delete" data-admin-del="${escapeHtml(item.restaurant_id)}">Delete</button>
              </div>`
            : ""
        }
      `;

      card.querySelector("[data-fav]").addEventListener("click", () => toggleSaved(item.restaurant_id));
      card.querySelectorAll("[data-detail]").forEach((btn) => {
        btn.addEventListener("click", () => openDetailModal(item.restaurant_id));
      });
      if (state.isAdmin) {
        const editBtn = card.querySelector("[data-admin-edit]");
        const delBtn = card.querySelector("[data-admin-del]");
        if (editBtn) editBtn.addEventListener("click", () => openAdminEditorModal(item.restaurant_id));
        if (delBtn) delBtn.addEventListener("click", () => handleAdminDelete(item.restaurant_id));
      }

      frag.appendChild(card);
    });

    grid.appendChild(frag);
  }

  // Render Interactive Leaflet Map
  function renderMap(items) {
    const mapContainer = $("jeddah-map");
    const offlineBox = $("map-offline-box");
    const regionLabel = $("map-region-label");

    if (regionLabel) {
      regionLabel.textContent = state.city
        ? t("mapLegendRegionCity", { city: tCity(state.city) })
        : t("mapLegendRegionAll");
    }

    if (typeof window.L === "undefined") {
      mapContainer.style.display = "none";
      offlineBox.style.display = "block";
      return;
    }

    mapContainer.style.display = "block";
    offlineBox.style.display = "none";

    if (!leafletMap) {
      leafletMap = window.L.map("jeddah-map", { scrollWheelZoom: true }).setView([23.8859, 45.0792], 6);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMap);
      markersLayer = window.L.layerGroup().addTo(leafletMap);
    }

    markersLayer.clearLayers();
    const bounds = [];

    items.forEach((item) => {
      if (typeof item.latitude !== "number" || typeof item.longitude !== "number") return;

      const isExact = item.coord_precision === "plus_code";
      const marker = window.L.circleMarker([item.latitude, item.longitude], {
        radius: isExact ? 9 : 7,
        fillColor: isExact ? "#065f46" : "#0d9488",
        color: isExact ? "#f59e0b" : "#ffffff",
        weight: isExact ? 2.5 : 2,
        opacity: 1,
        fillOpacity: 0.92,
      });

      const ratingLine = item.display_rating
        ? `⭐ ${item.display_rating.toFixed(1)}${item.review_count ? ` (${item.review_count} ${t("ratingReviews")})` : ""}`
        : t("noRating");

      const popupHtml = `
        <div class="map-popup">
          <h4>${escapeHtml(item.name)}</h4>
          <p>📍 ${escapeHtml(item.area)}, ${escapeHtml(tCity(item.city || "Jeddah"))} · ${escapeHtml(ratingLine)}</p>
          <div class="map-popup-actions">
            <a class="map-popup-btn primary" href="${escapeHtml(item.maps_search_url)}" target="_blank" rel="noopener noreferrer">🗺 ${escapeHtml(
        t("btnMaps")
      )}</a>
            <button type="button" class="map-popup-btn" onclick="window.__jkfOpenDetail('${escapeHtml(
              item.restaurant_id
            )}')">ℹ️ ${escapeHtml(t("btnDetails"))}</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(markersLayer);
      bounds.push([item.latitude, item.longitude]);
    });

    if (state.userCoords) {
      window.L.circleMarker([state.userCoords.lat, state.userCoords.lng], {
        radius: 8,
        fillColor: "#2563eb",
        color: "#ffffff",
        weight: 3,
        fillOpacity: 1,
      })
        .bindPopup("<strong>You are here</strong>")
        .addTo(markersLayer);
    }

    setTimeout(() => {
      leafletMap.invalidateSize();
      if (bounds.length > 0) {
        leafletMap.fitBounds(bounds, { padding: [36, 36], maxZoom: state.city ? 13 : 11 });
      }
    }, 60);
  }

  // Malayali Hypermarkets & Live Offers
  function getCityScopedHypermarkets() {
    const hypers = window.HYPERMARKET_DATA || [];
    if (!state.city) return hypers;
    return hypers.filter((h) => h.city === state.city);
  }

  function getFilteredHypermarkets() {
    let list = getCityScopedHypermarkets();
    if (state.brandFilter) {
      list = list.filter((h) => h.brand_key === state.brandFilter);
    }
    if (state.query) {
      const q = state.query.toLowerCase().trim();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.area.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.brand.toLowerCase().includes(q) ||
          (h.specialties || []).some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  // ============================================================================
  // ClicFlyer-Style Controller & Presentation System
  // ============================================================================
  let clicActiveBrand = "";
  let clicActiveCategory = "all";
  let clicSearchQuery = "";
  let clicFavBrands = new Set(JSON.parse(localStorage.getItem("ksa_clic_favs") || "[]"));
  let currentModalFlyer = null;
  let currentModalPage = 1;
  let clicEventsBound = false;

  function renderHypermarkets() {
    renderClicTopBar();
    renderClicRetailers();
    renderClicCategories();
    renderClicFlyers();
    renderHypermarketBranches();
    if (!clicEventsBound) {
      bindClicEvents();
      clicEventsBound = true;
    }
  }

  function renderClicTopBar() {
    const currentCityEl = $("clicCurrentCity");
    const retailersCityEl = $("clicRetailersCityTitle");
    const branchesCityEl = $("clicBranchesCityTitle");

    const cityName = state.city || (state.lang === "ml" ? "എല്ലാ 11 നഗരങ്ങളും" : "All 11 Cities");
    if (currentCityEl) currentCityEl.textContent = cityName;
    if (retailersCityEl) retailersCityEl.textContent = (state.city || "KSA").toUpperCase();
    if (branchesCityEl) branchesCityEl.textContent = (state.city || "KSA").toUpperCase();
  }

  function renderClicRetailers() {
    const grid = $("clicRetailersGrid");
    if (!grid) return;
    const brands = window.RETAILER_BRANDS || [];

    grid.innerHTML = "";
    const frag = document.createDocumentFragment();

    brands.forEach((b) => {
      const card = document.createElement("article");
      const isActive = clicActiveBrand === b.key;
      const isFav = clicFavBrands.has(b.key);

      card.className = `clic-retailer-card ${isActive ? "active" : ""}`;
      card.setAttribute("data-brand", b.key);
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-pressed", isActive ? "true" : "false");
      card.setAttribute("title", `Filter ${b.name} promotions`);

      card.innerHTML = `
        <div class="clic-retailer-top">
          <span class="clic-badge-new">${escapeHtml(b.badge)}</span>
          <button type="button" class="clic-fav-btn ${isFav ? "active" : ""}" data-fav="${escapeHtml(b.key)}" aria-label="Favorite ${escapeHtml(b.name)}">
            ${isFav ? "❤️" : "♡"}
          </button>
        </div>
        <div class="clic-retailer-logo-box">
          <img src="${escapeHtml(b.logo)}" alt="${escapeHtml(b.name)}" class="clic-retailer-logo" loading="lazy">
        </div>
        <div class="clic-retailer-footer">
          <h3 class="clic-retailer-name">${escapeHtml(b.name)}</h3>
          <span class="clic-retailer-deals-count">${escapeHtml(b.offers_count)}</span>
        </div>
      `;

      // Click card to toggle brand filter
      card.addEventListener("click", (e) => {
        if (e.target.closest(".clic-fav-btn")) {
          // Favorite button clicked
          e.stopPropagation();
          const key = b.key;
          if (clicFavBrands.has(key)) {
            clicFavBrands.delete(key);
          } else {
            clicFavBrands.add(key);
          }
          localStorage.setItem("ksa_clic_favs", JSON.stringify([...clicFavBrands]));
          renderClicRetailers();
          return;
        }

        clicActiveBrand = clicActiveBrand === b.key ? "" : b.key;
        renderClicRetailers();
        renderClicFlyers();
        renderHypermarketBranches();
      });

      frag.appendChild(card);
    });

    grid.appendChild(frag);
  }

  function renderClicCategories() {
    const slider = $("clicCategoriesSlider");
    if (!slider) return;
    const categories = window.FLYER_CATEGORIES || [];

    slider.innerHTML = "";
    const frag = document.createDocumentFragment();

    categories.forEach((cat) => {
      const card = document.createElement("div");
      const isActive = clicActiveCategory === cat.id;

      card.className = `clic-cat-card ${isActive ? "active" : ""}`;
      card.setAttribute("data-cat", cat.id);
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      const label = state.lang === "ml" && cat.malayalam ? cat.malayalam : cat.name;

      card.innerHTML = `
        <span class="clic-cat-icon">${cat.icon}</span>
        <span class="clic-cat-name">${escapeHtml(label)}</span>
        <span class="clic-cat-count">${escapeHtml(cat.count)}</span>
      `;

      card.addEventListener("click", () => {
        clicActiveCategory = cat.id;
        renderClicCategories();
        renderClicFlyers();
      });

      frag.appendChild(card);
    });

    slider.appendChild(frag);
  }

  function renderClicFlyers() {
    const grid = $("clicFlyersGrid");
    const badge = $("clicActiveFilterBadge");
    const resetBtn = $("clicResetFilters");
    if (!grid) return;

    let catalogs = window.FLYER_CATALOGS || [];

    // Filter by Brand
    if (clicActiveBrand) {
      catalogs = catalogs.filter((c) => c.brand_key === clicActiveBrand);
    }

    // Filter by Category
    if (clicActiveCategory && clicActiveCategory !== "all") {
      catalogs = catalogs.filter((c) => c.category === clicActiveCategory);
    }

    // Filter by Search Query
    if (clicSearchQuery) {
      const q = clicSearchQuery.toLowerCase();
      catalogs = catalogs.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.title_ml.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.highlight.toLowerCase().includes(q)
      );
    }

    // Update Filter Indicator Subbar
    const hasFilter = Boolean(clicActiveBrand || (clicActiveCategory && clicActiveCategory !== "all") || clicSearchQuery);
    if (resetBtn) {
      resetBtn.style.display = hasFilter ? "inline-block" : "none";
    }
    if (badge) {
      if (hasFilter) {
        let filterParts = [];
        if (clicActiveBrand) filterParts.push(`Brand: ${clicActiveBrand.toUpperCase()}`);
        if (clicActiveCategory && clicActiveCategory !== "all") filterParts.push(`Category: ${clicActiveCategory}`);
        if (clicSearchQuery) filterParts.push(`"${clicSearchQuery}"`);
        badge.textContent = `Filtered: ${filterParts.join(" · ")} (${catalogs.length} Active Catalogs)`;
      } else {
        badge.textContent = `Showing All ${catalogs.length} Active Weekly Catalogs`;
      }
    }

    grid.innerHTML = "";
    if (!catalogs.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 36px 16px; text-align: center;">
          <div class="empty-icon" style="font-size: 2.4rem;">🏷️</div>
          <h3 style="margin-top: 8px;">No matching flyers found</h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem;">Try clearing your brand filter or search term to see all weekly promotions.</p>
        </div>
      `;
      return;
    }

    const frag = document.createDocumentFragment();
    catalogs.forEach((flyer) => {
      const card = document.createElement("article");
      card.className = "clic-flyer-card";

      const title = state.lang === "ml" && flyer.title_ml ? flyer.title_ml : flyer.title;
      const flipBtnLabel = state.lang === "ml" ? "📖 ഓഫർ ബുക്ക്‌ലെറ്റ് കാണുക (Flip)" : "📖 Open Digital Flyer Booklet";

      card.innerHTML = `
        <div class="clic-flyer-cover-box" data-open-modal="${escapeHtml(flyer.id)}" role="button" tabindex="0" title="Click to open digital flyer booklet">
          <img src="${escapeHtml(flyer.cover)}" alt="${escapeHtml(flyer.title)}" class="clic-flyer-cover-img" loading="lazy">
          <span class="clic-flyer-views-pill">👁️ ${escapeHtml(flyer.views)} Views</span>
          <span class="clic-flyer-pages-pill">📖 ${escapeHtml(flyer.pages_count)} Department Pages</span>
        </div>
        <div class="clic-flyer-content">
          <div class="clic-flyer-brand-row">
            <span class="clic-flyer-brand-badge">${escapeHtml(flyer.brand)}</span>
            <span class="clic-flyer-status-badge">● ACTIVE NOW</span>
          </div>
          <h3 class="clic-flyer-title">${escapeHtml(title)}</h3>
          <div class="clic-flyer-validity">
            ⏰ Valid till ${escapeHtml(flyer.valid_till)} · <strong>${escapeHtml(flyer.days_left)} Days Left</strong>
          </div>
          <p class="clic-flyer-desc">${escapeHtml(flyer.highlight)}</p>
          <div class="clic-flyer-actions">
            <button type="button" class="clic-btn-flip" data-open-modal="${escapeHtml(flyer.id)}">
              ${escapeHtml(flipBtnLabel)}
            </button>
            <div class="clic-flyer-sub-actions">
              <a href="${escapeHtml(flyer.official_url)}" target="_blank" rel="noopener noreferrer" class="clic-btn-sub">
                🌐 Official Promotions
              </a>
              <a href="${escapeHtml(flyer.whatsapp_cta)}" target="_blank" rel="noopener noreferrer" class="clic-btn-sub wa">
                💬 WhatsApp Flyer
              </a>
            </div>
          </div>
        </div>
      `;

      // Handle click to open modal
      card.querySelectorAll("[data-open-modal]").forEach((trigger) => {
        trigger.addEventListener("click", () => {
          openClicFlyerModal(flyer.id);
        });
      });

      frag.appendChild(card);
    });

    grid.appendChild(frag);
  }

  function renderHypermarketBranches() {
    const grid = $("hypermarkets-grid");
    if (!grid) return;
    const scoped = getCityScopedHypermarkets();
    let items = scoped;

    if (clicActiveBrand) {
      items = items.filter((h) => h.brand_key === clicActiveBrand);
    }

    if ($("hypers-tab-badge")) {
      $("hypers-tab-badge").textContent = scoped.length;
    }

    grid.innerHTML = "";
    if (!items.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🛒</div>
          <h3>${escapeHtml(t("emptyTitle"))}</h3>
          <p>${escapeHtml(t("emptyDesc"))}</p>
        </div>
      `;
      return;
    }

    const frag = document.createDocumentFragment();
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "hyper-card";
      card.setAttribute("data-brand", item.brand_key);

      const specsHtml = (item.specialties || [])
        .slice(0, 4)
        .map((s) => `<span class="hyper-spec-pill">${escapeHtml(s)}</span>`)
        .join("");

      const phoneBtn = item.phone
        ? `<a href="tel:${escapeHtml(item.phone.replace(/\s+/g, ""))}" class="hyper-btn-sub">📞 ${escapeHtml(
            t("hyperBtnCall")
          )}</a>`
        : "";

      card.innerHTML = `
        <div class="hyper-top-row">
          <span class="hyper-brand-badge">
            <span class="hyper-brand-dot ${escapeHtml(item.brand_key)}" aria-hidden="true"></span>
            ${escapeHtml(item.brand)}
          </span>
          <span class="hyper-live-badge" style="margin-bottom:0;padding:2px 8px;font-size:0.72rem;">
            <span class="hyper-live-pulse" style="width:6px;height:6px;" aria-hidden="true"></span>
            ${escapeHtml(t("hyperBadgeAuto"))}
          </span>
        </div>

        <h3 class="hyper-card-title">${escapeHtml(item.name)}</h3>

        <div class="hyper-meta-line">
          <span>📍 ${escapeHtml(item.area)}, <strong>${escapeHtml(tCity(item.city))}</strong></span>
          ${item.timing ? `<span>• 🕒 ${escapeHtml(item.timing)}</span>` : ""}
        </div>

        <p style="margin:0;font-size:0.83rem;color:var(--text-secondary);">${escapeHtml(item.full_address)}</p>

        <div class="hyper-specs">
          ${specsHtml}
        </div>

        <div class="hyper-actions">
          <a href="${escapeHtml(item.offers_url)}" target="_blank" rel="noopener noreferrer" class="btn-flyer-live" title="Open official live weekly promotions">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            ${escapeHtml(t("hyperBtnFlyer"))}
          </a>

          <div class="hyper-sub-actions">
            <a href="${escapeHtml(item.maps_url)}" target="_blank" rel="noopener noreferrer" class="hyper-btn-sub">
              🗺️ ${escapeHtml(t("hyperBtnMaps"))}
            </a>
            <a href="${escapeHtml(item.offers_whatsapp)}" target="_blank" rel="noopener noreferrer" class="hyper-btn-sub wa">
              💬 ${escapeHtml(t("whatsappSupport"))}
            </a>
            ${phoneBtn}
          </div>
        </div>
      `;

      frag.appendChild(card);
    });

    grid.appendChild(frag);
  }

  // ============================================================================
  // ClicFlyer Interactive Booklet Modal Functions
  // ============================================================================
  function openClicFlyerModal(flyerId) {
    const catalogs = window.FLYER_CATALOGS || [];
    const flyer = catalogs.find((c) => c.id === flyerId) || catalogs[0];
    if (!flyer) return;

    currentModalFlyer = flyer;
    currentModalPage = 1;

    const modal = $("clicFlyerModal");
    const titleEl = $("clicModalTitle");
    const validityEl = $("clicModalValidity");
    const pageEl = $("clicModalPageIndicator");
    const imgEl = $("clicModalPageImg");
    const liveBadge = $("clicModalLiveBadge");
    const officialBtn = $("clicModalOfficialBtn");
    const fullFlyerBtn = $("clicModalFullFlyerBtn");
    const waShareBtn = $("clicModalWaShare");

    const pages = currentModalFlyer.pages || [];
    const totalPages = pages.length > 0 ? pages.length : (currentModalFlyer.pages_count || 1);
    const firstPage = pages[0];

    if (titleEl) titleEl.textContent = flyer.title.toUpperCase();
    if (validityEl) validityEl.textContent = `VALID TILL ${flyer.valid_till.toUpperCase()} · ${flyer.days_left} DAYS LEFT`;
    
    if (pageEl) {
      pageEl.textContent = firstPage 
        ? `Page 1 / ${totalPages} · ${firstPage.title}`
        : `Page 1 / ${totalPages}`;
    }
    if (imgEl) {
      imgEl.src = firstPage ? firstPage.img : flyer.cover;
      imgEl.alt = firstPage ? firstPage.title : flyer.title;
    }
    if (liveBadge && firstPage) {
      liveBadge.textContent = firstPage.badge;
    }
    if (officialBtn) {
      officialBtn.href = flyer.official_url;
      officialBtn.innerHTML = `🌐 View Full ${flyer.full_catalog_pages || "Store"}-Page Catalog ↗`;
      officialBtn.title = `Open official ${flyer.brand} deals on store portal`;
    }
    if (fullFlyerBtn) {
      fullFlyerBtn.href = flyer.official_url;
      fullFlyerBtn.innerHTML = `📄 Open Full ${flyer.full_catalog_pages || 85}-Page Catalog (${flyer.brand}) ↗`;
    }
    if (waShareBtn) {
      waShareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Check out the latest ${flyer.brand} weekly flyer on KSA Malayali Hub: https://dipinkkl90.github.io/ksa-malayali-hub/`
      )}`;
    }

    if (modal) {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeClicFlyerModal() {
    const modal = $("clicFlyerModal");
    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  function flipClicFlyerModal(delta) {
    if (!currentModalFlyer) return;
    const pages = currentModalFlyer.pages || [];
    const totalPages = pages.length > 0 ? pages.length : (currentModalFlyer.pages_count || 1);
    currentModalPage += delta;

    if (currentModalPage < 1) currentModalPage = totalPages;
    if (currentModalPage > totalPages) currentModalPage = 1;

    const pageObj = pages[currentModalPage - 1];
    const pageEl = $("clicModalPageIndicator");
    const imgEl = $("clicModalPageImg");
    const liveBadge = $("clicModalLiveBadge");

    if (pageEl) {
      pageEl.textContent = pageObj 
        ? `Page ${currentModalPage} / ${totalPages} · ${pageObj.title}`
        : `Page ${currentModalPage} / ${totalPages}`;
    }
    if (liveBadge && pageObj) {
      liveBadge.textContent = pageObj.badge;
    }

    // Smooth page flip animation + Image switch!
    if (imgEl) {
      imgEl.style.opacity = "0.2";
      imgEl.style.transform = delta > 0 ? "translateX(16px)" : "translateX(-16px)";
      setTimeout(() => {
        if (pageObj) {
          imgEl.src = pageObj.img;
          imgEl.alt = pageObj.title;
        }
        imgEl.style.opacity = "1";
        imgEl.style.transform = "translateX(0)";
      }, 120);
    }
  }

  function bindClicEvents() {
    // Search input
    const searchInput = $("clicOffersSearch");
    const clearBtn = $("clicSearchClear");
    const resetBtn = $("clicResetFilters");

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        clicSearchQuery = searchInput.value.trim();
        if (clearBtn) {
          clearBtn.style.display = clicSearchQuery ? "inline-block" : "none";
        }
        renderClicFlyers();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        clicSearchQuery = "";
        clearBtn.style.display = "none";
        renderClicFlyers();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        clicActiveBrand = "";
        clicActiveCategory = "all";
        clicSearchQuery = "";
        if (searchInput) searchInput.value = "";
        if (clearBtn) clearBtn.style.display = "none";
        renderClicRetailers();
        renderClicCategories();
        renderClicFlyers();
        renderHypermarketBranches();
      });
    }

    // Modal controls
    const closeBtn = $("clicModalCloseBtn");
    const backBtn = $("clicModalBackBtn");
    const overlay = $("clicModalOverlay");
    const prevBtn = $("clicFlipPrev");
    const nextBtn = $("clicFlipNext");

    if (closeBtn) closeBtn.addEventListener("click", closeClicFlyerModal);
    if (backBtn) backBtn.addEventListener("click", closeClicFlyerModal);
    if (overlay) overlay.addEventListener("click", closeClicFlyerModal);
    if (prevBtn) prevBtn.addEventListener("click", () => flipClicFlyerModal(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => flipClicFlyerModal(1));

    // Keyboard navigation (Escape to close, Left/Right arrows to flip)
    window.addEventListener("keydown", (e) => {
      const modal = $("clicFlyerModal");
      if (!modal || !modal.classList.contains("active")) return;
      if (e.key === "Escape") closeClicFlyerModal();
      if (e.key === "ArrowLeft") flipClicFlyerModal(-1);
      if (e.key === "ArrowRight") flipClicFlyerModal(1);
    });
  }

  function getCityScopedCinemas() {
    const list = window.CINEMA_DATA || [];
    if (!state.city) return list;
    return list.filter((c) => c.city === state.city);
  }

  function getFilteredCinemas() {
    let list = getCityScopedCinemas();
    if (state.cinemaBrandFilter) {
      list = list.filter((c) => c.brand_key === state.cinemaBrandFilter);
    }
    if (state.query) {
      const q = state.query.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.mall.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          (c.languages || []).some((l) => l.toLowerCase().includes(q)) ||
          (c.experiences || []).some((e) => e.toLowerCase().includes(q))
      );
    }
    return list;
  }

  function renderCinemas() {
    const grid = $("cinemas-grid");
    if (!grid) return;
    const scoped = getCityScopedCinemas();
    const items = getFilteredCinemas();

    if ($("cinemas-tab-badge")) {
      $("cinemas-tab-badge").textContent = scoped.length;
    }
    if ($("count-cinema-all")) {
      $("count-cinema-all").textContent = scoped.length;
    }

    grid.innerHTML = "";
    if (!items.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🎬</div>
          <h3>${escapeHtml(t("emptyTitle"))}</h3>
          <p>${escapeHtml(t("emptyDesc"))}</p>
        </div>
      `;
      return;
    }

    const frag = document.createDocumentFragment();
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "cinema-card";
      card.setAttribute("data-brand", item.brand_key);

      const langHtml = (item.languages || [])
        .map((l) => `<span class="cinema-spec-pill ${l === "Malayalam" ? "gold" : ""}">${escapeHtml(l)}</span>`)
        .join("");

      const expHtml = (item.experiences || [])
        .map((e) => `<span class="cinema-exp-pill">${escapeHtml(e)}</span>`)
        .join("");

      const phoneBtn = item.phone
        ? `<a href="tel:${escapeHtml(item.phone.replace(/\\s+/g, ""))}" class="cinema-btn-sub">📞 ${escapeHtml(
            t("btnCall")
          )}</a>`
        : "";

      const mollywoodBtn = item.mollywood_url
        ? `<a href="${escapeHtml(item.mollywood_url)}" target="_blank" rel="noopener noreferrer" class="cinema-btn-sub mollywood" title="Malayalam Movies Hub">
            ${escapeHtml(t("cinemaBtnMollywood"))}
          </a>`
        : "";

      card.innerHTML = `
        <div class="cinema-top-row">
          <span class="cinema-brand-badge">
            <span class="cinema-brand-dot ${escapeHtml(item.brand_key)}" aria-hidden="true"></span>
            ${escapeHtml(item.brand)}
          </span>
          <span class="cinema-live-badge" style="margin-bottom:0;padding:2px 8px;font-size:0.72rem;">
            <span class="cinema-live-pulse" style="width:6px;height:6px;" aria-hidden="true"></span>
            ⭐ ${item.rating ? item.rating.toFixed(1) : "4.5"}
          </span>
        </div>

        <h3 class="cinema-card-title">${escapeHtml(item.name)}</h3>

        <div class="cinema-meta-line">
          <span>🏛️ <strong>${escapeHtml(item.mall)}</strong> · 📍 ${escapeHtml(item.area)}, <strong>${escapeHtml(tCity(item.city))}</strong></span>
        </div>

        <p style="margin:0;font-size:0.83rem;color:var(--text-secondary);">${escapeHtml(item.full_address)}</p>

        <div class="cinema-specs-row">
          ${langHtml}
          ${expHtml}
        </div>

        <div class="cinema-actions">
          <a href="${escapeHtml(item.booking_url)}" target="_blank" rel="noopener noreferrer" class="btn-book-live" title="Check live showtimes & book movie tickets">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            ${escapeHtml(t("cinemaBtnBook"))}
          </a>

          <div class="cinema-sub-actions">
            ${mollywoodBtn}
            <a href="${escapeHtml(item.maps_url)}" target="_blank" rel="noopener noreferrer" class="cinema-btn-sub">
              🗺️ ${escapeHtml(t("cinemaBtnMaps"))}
            </a>
            ${phoneBtn}
          </div>
        </div>
      `;

      frag.appendChild(card);
    });

    grid.appendChild(frag);
  }

  // ==========================================================================
  // Pravasi Daily Live Desk (Remittance, Gold, Saudi Visa/Labour, Kerala News)
  // ==========================================================================
  let dailyNewsCategory = "all";
  let remitAmountCache = 1000;
  let rateFilterType = "all";
  let rateSearchQuery = "";
  let expandedProviderIds = new Set(["anb-telemoney"]);

  // Real-Time Free Currency API Integration (SAR to INR Live Auto-Update)
  let liveCurrencySynced = false;
  let liveCurrencyRate = null;
  let baseProviderSpreads = null;

  function initBaseProviderSpreads() {
    if (baseProviderSpreads || !window.DAILY_DESK_DATA || !window.DAILY_DESK_DATA.remittance) return;
    const baseMid = window.DAILY_DESK_DATA.remittance.mid_market_rate || 24.96;
    baseProviderSpreads = (window.DAILY_DESK_DATA.remittance.providers || []).map((p) => {
      const pSpread = p.rate - baseMid;
      const channels = (p.channels || []).map((c) => ({
        ...c,
        spread: (typeof c.rate === "number" ? c.rate : parseFloat(c.rate) || p.rate) - baseMid,
      }));
      return {
        id: p.id,
        spread: pSpread,
        channels: channels,
      };
    });
  }

  async function fetchLiveCurrencyRate() {
    initBaseProviderSpreads();

    // 1. Try Primary free API (Open Exchange Rates API - CORS & no auth)
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/SAR", { cache: "no-cache" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && typeof data.rates.INR === "number") {
          applyLiveCurrencyRate(data.rates.INR, "OpenExchangeRates");
          return;
        }
      }
    } catch (e) {
      console.warn("Primary currency API failed:", e);
    }

    // 2. Try Backup CDN API (jsdelivr fawazahmed0)
    try {
      const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/sar.json", { cache: "no-cache" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.sar && typeof data.sar.inr === "number") {
          applyLiveCurrencyRate(data.sar.inr, "CurrencyAPI");
          return;
        }
      }
    } catch (e2) {
      console.warn("Secondary currency API failed:", e2);
    }
  }

  function applyLiveCurrencyRate(liveRate, providerName) {
    if (!liveRate || isNaN(liveRate) || !window.DAILY_DESK_DATA || !window.DAILY_DESK_DATA.remittance) return;
    liveCurrencySynced = true;
    liveCurrencyRate = liveRate;

    const desk = window.DAILY_DESK_DATA;
    desk.remittance.mid_market_rate = Number(liveRate.toFixed(2));

    // Update each bank/wallet provider rate according to its genuine market spread
    if (baseProviderSpreads && desk.remittance.providers) {
      desk.remittance.providers.forEach((p) => {
        const meta = baseProviderSpreads.find((b) => b.id === p.id);
        if (meta) {
          p.rate = Number((liveRate + meta.spread).toFixed(2));
          p.updated_date = "Live (" + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ")";
          if (p.channels && meta.channels) {
            p.channels.forEach((c, idx) => {
              if (meta.channels[idx]) {
                c.rate = Number((liveRate + meta.channels[idx].spread).toFixed(2));
              }
            });
          }
        }
      });
    }

    // Update Mid-Market display in UI if present
    const midEl = $("live-mid-market-display");
    if (midEl) {
      midEl.textContent = `1 SAR ≈ ₹${liveRate.toFixed(2)} INR`;
    }

    const badgeEl = $("live-currency-badge");
    if (badgeEl) {
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      badgeEl.innerHTML = `🟢 Live Realtime (${timeStr})`;
      badgeEl.style.display = "inline-flex";
    }

    // Update Live Ticker Track item
    if (desk.ticker && desk.ticker.length > 0) {
      const sorted = [...(desk.remittance.providers || [])].sort((a, b) => b.rate - a.rate);
      const topProviders = sorted.slice(0, 5).map((p) => `${p.name.split(" ")[0]} (₹${p.rate.toFixed(2)})`).join(", ");
      desk.ticker[0] = `💵 തത്സമയ റിയാൽ നിരക്ക്: ${topProviders} [Live Realtime]`;
      setupNewsTicker();
    }

    // Re-render remittance grid if active
    if (state.view === "daily" || $("rate-table-body")) {
      renderRemittanceGrid();
    }
  }

  function initLiveCurrencySync() {
    fetchLiveCurrencyRate();
    // Auto-refresh every 5 minutes in background
    setInterval(fetchLiveCurrencyRate, 300000);
  }

  function renderDailyDesk() {
    renderRemittanceGrid();
    renderGoldGrid();
    renderGuidesGrid();
    renderNewsGrid();
    setupRemittanceCalculator();
    setupDailyNewsFilters();
  }

  function setupRemittanceCalculator() {
    const input = $("remit-amount-input");
    if (input && !input.hasAttribute("data-listener")) {
      input.setAttribute("data-listener", "true");
      input.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        remitAmountCache = isNaN(val) || val <= 0 ? 0 : val;
        renderRemittanceGrid();
      });
    }

    const searchInput = $("rate-search-input");
    if (searchInput && !searchInput.hasAttribute("data-listener")) {
      searchInput.setAttribute("data-listener", "true");
      searchInput.addEventListener("input", (e) => {
        rateSearchQuery = e.target.value.trim().toLowerCase();
        renderRemittanceGrid();
      });
    }

    const filterTabs = $("rate-filter-tabs");
    if (filterTabs && !filterTabs.hasAttribute("data-listener")) {
      filterTabs.setAttribute("data-listener", "true");
      filterTabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".rate-filter-btn");
        if (!btn) return;
        filterTabs.querySelectorAll(".rate-filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        rateFilterType = btn.dataset.type || "all";
        renderRemittanceGrid();
      });
    }
  }

  window.toggleRateAccordion = function(providerId) {
    if (expandedProviderIds.has(providerId)) {
      expandedProviderIds.delete(providerId);
    } else {
      expandedProviderIds.add(providerId);
    }
    renderRemittanceGrid();
  };

  function renderRemittanceGrid() {
    const tableBody = $("rate-table-body");
    if (!tableBody) return;
    const desk = window.DAILY_DESK_DATA;
    if (!desk || !desk.remittance) return;

    let providers = desk.remittance.providers || [];
    const amount = remitAmountCache;

    // Filter by type
    if (rateFilterType !== "all") {
      providers = providers.filter((p) => p.type === rateFilterType);
    }

    // Filter by search query
    if (rateSearchQuery) {
      providers = providers.filter((p) => {
        const nameEn = (p.name || "").toLowerCase();
        const nameMl = (p.name_ml || "").toLowerCase();
        const id = (p.id || "").toLowerCase();
        return nameEn.includes(rateSearchQuery) || nameMl.includes(rateSearchQuery) || id.includes(rateSearchQuery);
      });
    }

    if (providers.length === 0) {
      tableBody.innerHTML = `
        <div class="rate-table-empty">
          <p>🔍 "${escapeHtml(rateSearchQuery)}" ബാങ്ക് / വാലറ്റ് കണ്ടെത്തിയില്ല</p>
          <small>ദയവായി പേര് മാറ്റുക അല്ലെങ്കിൽ All ഫിൽട്ടർ ക്ലിക്ക് ചെയ്യുക.</small>
        </div>
      `;
      return;
    }

    tableBody.innerHTML = providers
      .map((p) => {
        const isExpanded = expandedProviderIds.has(p.id);
        const inrPayout = Math.round(amount * p.rate);
        const name = state.lang === "ml" ? p.name_ml : p.name;
        const updatedDateText = state.lang === "ml"
          ? `അപ്‌ഡേറ്റ്: ${p.updated_date || "19 Nov 2026"}`
          : `updated on ${p.updated_date || "19 Nov 2026"}`;

        const channels = p.channels && p.channels.length > 0
          ? p.channels
          : [
              { type_label: "Digital App Transfer", name: `${p.name} Online`, fee: p.fee_sar, rate: p.rate }
            ];

        const channelsHtml = channels
          .map((c) => {
            const cType = c.type_label || (c.fee === 0 ? "Online Exchange Fee" : "Branch Exchange Fee");
            const cName = c.name || c.label || p.name;
            const cFee = (typeof c.fee === "number" ? c.fee : parseFloat(c.fee) || 0).toFixed(2);
            const cRate = (typeof c.rate === "number" ? c.rate : parseFloat(c.rate) || p.rate).toFixed(2);
            return `
              <div class="rate-sub-channel-item">
                <div class="rate-sub-channel-meta">
                  <span class="rate-sub-fee-label">${escapeHtml(cType)}</span>
                  <span class="rate-sub-channel-title">${escapeHtml(cName)}</span>
                </div>
                <div class="rate-sub-channel-values">
                  <span class="rate-sub-fee-val">${cFee}</span>
                  <span class="rate-sub-rate-val">${cRate}</span>
                </div>
              </div>
            `;
          })
          .join("");

        return `
          <div class="rate-accordion-item ${isExpanded ? "expanded" : ""}" data-provider-id="${p.id}">
            <div class="rate-accordion-row" onclick="window.toggleRateAccordion('${p.id}')" role="button" tabindex="0" aria-expanded="${isExpanded}">
              <div class="rate-cell-bank">
                <div class="rate-bank-name">${escapeHtml(name)}</div>
                <div class="rate-bank-date">${escapeHtml(updatedDateText)}</div>
              </div>
              <div class="rate-cell-fee">
                <span class="rate-fee-number">${p.fee_sar.toFixed(2)}</span>
              </div>
              <div class="rate-cell-rate">
                <span class="rate-rate-number">${p.rate.toFixed(2)}</span>
                <span class="rate-caret-icon ${isExpanded ? "open" : ""}" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
            </div>

            <div class="rate-accordion-drawer" style="display: ${isExpanded ? "block" : "none"};">
              <div class="rate-sub-channels-list">
                ${channelsHtml}
              </div>
              <div class="rate-drawer-calc-bar">
                <div class="rate-drawer-calc-info">
                  <span class="rate-calc-preview-label">${amount.toLocaleString()} SAR അയച്ചാൽ നാട്ടിൽ ലഭിക്കുന്നത്:</span>
                  <strong class="rate-calc-preview-val">₹${inrPayout.toLocaleString("en-IN")}</strong>
                </div>
                <a href="${p.app_url}" target="_blank" rel="noopener noreferrer" class="rate-open-app-btn">
                  <span>${state.lang === "ml" ? "ആപ്പ് തുറക്കുക / അയക്കുക ➔" : "Open App / Send Now ➔"}</span>
                </a>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderGoldGrid() {
    const grid = $("gold-grid");
    if (!grid) return;
    const desk = window.DAILY_DESK_DATA;
    if (!desk || !desk.gold_rates) return;

    const items = desk.gold_rates.items || [];
    const inrMultiplier = (desk.remittance && desk.remittance.mid_market_rate) || 24.91;

    grid.innerHTML = items
      .map((g) => {
        const title = state.lang === "ml" ? g.title : g.carat + " Gold";
        const desc = state.lang === "ml" ? g.desc : g.desc_en;
        const inrEquiv = Math.round(g.sar_per_gram * inrMultiplier);
        const isPavan = !!g.is_pavan;

        return `
          <div class="gold-card ${isPavan ? "pavan-featured" : ""}">
            <div class="gold-card-header">
              <span class="gold-carat-badge">${g.carat}</span>
              <span class="gold-trend-badge ${g.trend}">
                ${g.trend === "up" ? "▲ " + g.trend_change_sar + " SAR" : "● Stable"}
              </span>
            </div>
            <h4 class="gold-title">${escapeHtml(title)}</h4>
            <p class="gold-desc">${escapeHtml(desc)}</p>
            <div class="gold-price-box">
              <div class="gold-sar-price">
                <span class="gold-sar-amount">${g.sar_per_gram.toFixed(2)}</span>
                <span class="gold-sar-curr">SAR ${isPavan ? "(1 പവൻ / 8g)" : "/ ഗ്രാം"}</span>
              </div>
              <div class="gold-inr-equiv">
                ≈ ₹${inrEquiv.toLocaleString("en-IN")} INR
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderGuidesGrid() {
    const grid = $("guides-grid");
    if (!grid) return;
    const desk = window.DAILY_DESK_DATA;
    if (!desk || !desk.saudi_guides) return;

    grid.innerHTML = desk.saudi_guides
      .map((guide) => {
        const title = state.lang === "ml" ? guide.title : guide.title_en;
        const badge = state.lang === "ml" ? guide.badge : guide.badge_en;
        const pointsHtml = (guide.points || [])
          .map((pt) => `<li><span class="guide-check">✓</span><span>${escapeHtml(pt)}</span></li>`)
          .join("");

        return `
          <div class="guide-card">
            <div class="guide-card-top">
              <span class="guide-badge">${escapeHtml(badge)}</span>
            </div>
            <h4 class="guide-title">${escapeHtml(title)}</h4>
            <ul class="guide-points-list">
              ${pointsHtml}
            </ul>
            <div class="guide-portal-link">
              <a href="${guide.official_link}" target="_blank" rel="noopener noreferrer" class="guide-btn">
                <span>ഔദ്യോഗിക പോർട്ടൽ (${escapeHtml(guide.official_portal)}) ➔</span>
              </a>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function setupDailyNewsFilters() {
    const container = $("news-filter-pills");
    if (!container || container.hasAttribute("data-listener")) return;
    container.setAttribute("data-listener", "true");

    container.querySelectorAll(".news-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".news-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        dailyNewsCategory = btn.getAttribute("data-cat") || "all";
        renderNewsGrid();
      });
    });
  }

  function renderNewsGrid() {
    const grid = $("news-grid");
    if (!grid) return;
    const desk = window.DAILY_DESK_DATA;
    if (!desk || !desk.news) return;

    let items = desk.news;
    if (dailyNewsCategory && dailyNewsCategory !== "all") {
      items = items.filter((n) => n.category === dailyNewsCategory);
    }

    grid.innerHTML = items
      .map((item) => {
        const title = state.lang === "ml" ? item.title : item.title_en;
        const summary = state.lang === "ml" ? item.summary : item.summary_en;
        const badge = state.lang === "ml" ? item.badge : item.badge_en;
        const time = state.lang === "ml" ? item.time : item.time_en;

        return `
          <article class="news-card">
            <div class="news-card-header">
              <span class="news-category-badge">${escapeHtml(badge)}</span>
              <span class="news-time">🕒 ${escapeHtml(time)}</span>
            </div>
            <h4 class="news-title">${escapeHtml(title)}</h4>
            <p class="news-summary">${escapeHtml(summary)}</p>
            <div class="news-footer">
              <span class="news-source">📌 ${escapeHtml(item.source_name)}</span>
              <a href="${item.source_url}" target="_blank" rel="noopener noreferrer" class="news-read-btn">
                ${state.lang === "ml" ? "വിശദാംശങ്ങൾ ➔" : "Read Details ➔"}
              </a>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function setupNewsTicker() {
    const track = $("live-ticker-track");
    if (!track) return;
    const desk = window.DAILY_DESK_DATA;
    if (!desk || !desk.ticker) return;

    const items = desk.ticker;
    const contentHtml = items.map((t) => `<span class="ticker-item">${escapeHtml(t)}</span><span class="ticker-sep">✦</span>`).join(" ");
    track.innerHTML = contentHtml + " " + contentHtml;
  }

  function syncViewButtons() {
    const views = [
      ["grid", "view-grid-btn"],
      ["map", "view-map-btn"],
      ["hypers", "view-hypers-btn"],
      ["cinemas", "view-cinemas-btn"],
      ["daily", "view-daily-btn"],
      ["reviews", "view-reviews-btn"],
      ["suggestions", "view-sugg-btn"],
    ];
    views.forEach(([v, id]) => {
      const btn = $(id);
      if (!btn) return;
      const active = state.view === v;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function setView(viewName, scrollToDock) {
    state.view = viewName;
    syncViewButtons();
    if (viewName === "suggestions" && $("sub-city") && state.city) {
      $("sub-city").value = state.city;
    }
    if (viewName === "reviews" && $("rev-city") && state.city) {
      $("rev-city").value = state.city;
    }
    render();
    if (scrollToDock && $("directory-dock")) {
      $("directory-dock").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Render Site Ratings & Community Reviews
  function renderReviews() {
    const visibleReviews = REVIEWS.filter((r) => !r.hidden);
    const displayReviews = state.isAdmin ? REVIEWS : visibleReviews;

    const avg = visibleReviews.length
      ? visibleReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / visibleReviews.length
      : 5.0;

    if ($("reviews-tab-badge")) {
      $("reviews-tab-badge").textContent = avg.toFixed(1);
    }
    if ($("rev-avg-score")) {
      $("rev-avg-score").textContent = avg.toFixed(1);
    }
    if ($("rev-avg-stars")) {
      const rounded = Math.round(avg);
      $("rev-avg-stars").textContent = "★".repeat(rounded) + "☆".repeat(5 - rounded);
    }
    if ($("rev-total-count")) {
      $("rev-total-count").textContent = t("revCountText", { count: visibleReviews.length });
    }

    // Star distribution bars (5 down to 1)
    const barsWrap = $("rev-bars");
    if (barsWrap) {
      const total = visibleReviews.length || 1;
      barsWrap.innerHTML = [5, 4, 3, 2, 1]
        .map((star) => {
          const count = visibleReviews.filter((r) => Number(r.rating) === star).length;
          const pct = Math.round((count / total) * 100);
          return `
            <div class="rev-bar-row">
              <span>${star} ★</span>
              <div class="rev-bar-track"><div class="rev-bar-fill" style="width:${pct}%"></div></div>
              <span>${count}</span>
            </div>
          `;
        })
        .join("");
    }

    const listEl = $("reviews-list");
    if (!listEl) return;

    if (!displayReviews.length) {
      listEl.innerHTML = `<div class="empty-state"><p>${escapeHtml(t("revEmpty"))}</p></div>`;
      return;
    }

    listEl.innerHTML = "";
    displayReviews.forEach((rev) => {
      const initials = (rev.name || "U")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("");
      const stars = "★".repeat(Number(rev.rating || 5)) + "☆".repeat(5 - Number(rev.rating || 5));

      const card = document.createElement("article");
      card.className = "review-card" + (rev.hidden ? " hidden-review" : "");
      card.innerHTML = `
        <div class="review-card-head">
          <div class="reviewer-id">
            <div class="reviewer-avatar" aria-hidden="true">${escapeHtml(initials)}</div>
            <div>
              <div class="reviewer-name">${escapeHtml(rev.name)}</div>
              <div class="reviewer-meta">${escapeHtml(tCity(rev.city || "Saudi Arabia"))} · ${escapeHtml(
        rev.created_at || ""
      )}</div>
            </div>
          </div>
          <div class="review-stars" aria-label="${rev.rating} out of 5 stars">${stars}</div>
        </div>
        <p class="review-text">${escapeHtml(rev.comment)}</p>
        ${rev.hidden ? `<span class="review-hidden-pill">Hidden from public (Admin view)</span>` : ""}
        ${
          state.isAdmin
            ? `<div class="card-admin-strip">
                <button type="button" class="card-admin-btn" data-rev-edit="${escapeHtml(rev.id)}">Edit</button>
                <button type="button" class="card-admin-btn" data-rev-toggle="${escapeHtml(rev.id)}">${
                rev.hidden ? "Show" : "Hide"
              }</button>
                <button type="button" class="card-admin-btn delete" data-rev-del="${escapeHtml(rev.id)}">Delete</button>
              </div>`
            : ""
        }
      `;

      if (state.isAdmin) {
        card.querySelector("[data-rev-edit]").addEventListener("click", () => openAdminReviewModal(rev.id));
        card.querySelector("[data-rev-toggle]").addEventListener("click", () => handleAdminToggleReview(rev.id));
        card.querySelector("[data-rev-del]").addEventListener("click", () => handleAdminDeleteReview(rev.id));
      }

      listEl.appendChild(card);
    });
  }

  function setSelectedReviewStars(n) {
    state.selectedReviewStars = Math.min(5, Math.max(1, Number(n) || 5));
    document.querySelectorAll(".star-pick-btn").forEach((btn) => {
      const s = Number(btn.getAttribute("data-star"));
      btn.classList.toggle("active", s <= state.selectedReviewStars);
    });
    if ($("star-pick-label")) {
      $("star-pick-label").textContent = `${state.selectedReviewStars} / 5`;
    }
  }

  function handleSiteReviewSubmit(e) {
    e.preventDefault();
    const name = ($("rev-name").value || "").trim();
    const city = $("rev-city") ? $("rev-city").value : "Saudi Arabia";
    const comment = ($("rev-comment").value || "").trim();
    const rating = state.selectedReviewStars;

    if (!name || !comment || !rating) {
      showToast(t("revRequiredToast"));
      return;
    }

    REVIEWS.unshift({
      id: `REV-${Date.now()}`,
      name,
      city,
      rating,
      comment,
      created_at: new Date().toISOString().slice(0, 10),
      hidden: false,
    });
    saveSiteReviews();
    $("site-review-form").reset();
    setSelectedReviewStars(5);
    renderReviews();
    showToast(t("revPostedToast"));
  }

  // Admin-Only Review Moderation
  function openAdminReviewModal(revId) {
    if (!state.isAdmin) return;
    const rev = REVIEWS.find((r) => r.id === revId);
    if (!rev) return;
    $("adm-rev-id").value = rev.id;
    $("adm-rev-name").value = rev.name;
    $("adm-rev-city").value = rev.city || "";
    $("adm-rev-rating").value = String(rev.rating || 5);
    $("adm-rev-comment").value = rev.comment;
    $("admin-review-modal").classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeAdminReviewModal() {
    if ($("admin-review-modal")) $("admin-review-modal").classList.remove("open");
    document.body.style.overflow = "";
  }

  function handleAdminReviewSave(e) {
    e.preventDefault();
    if (!state.isAdmin) return;
    const id = $("adm-rev-id").value;
    const idx = REVIEWS.findIndex((r) => r.id === id);
    if (idx === -1) return;
    REVIEWS[idx] = {
      ...REVIEWS[idx],
      name: $("adm-rev-name").value.trim(),
      city: $("adm-rev-city").value.trim() || "Saudi Arabia",
      rating: Number($("adm-rev-rating").value) || 5,
      comment: $("adm-rev-comment").value.trim(),
    };
    saveSiteReviews();
    closeAdminReviewModal();
    renderReviews();
    showToast("Review updated by Admin.");
  }

  function handleAdminToggleReview(revId) {
    if (!state.isAdmin) return;
    const idx = REVIEWS.findIndex((r) => r.id === revId);
    if (idx === -1) return;
    REVIEWS[idx].hidden = !REVIEWS[idx].hidden;
    saveSiteReviews();
    renderReviews();
    showToast(REVIEWS[idx].hidden ? "Review hidden from public." : "Review restored to public.");
  }

  function handleAdminDeleteReview(revId) {
    if (!state.isAdmin) return;
    const rev = REVIEWS.find((r) => r.id === revId);
    if (!rev) return;
    if (!window.confirm(`Admin Delete: Permanently remove review by "${rev.name}"?`)) return;
    REVIEWS = REVIEWS.filter((r) => r.id !== revId);
    saveSiteReviews();
    renderReviews();
    showToast("Review deleted by Admin.");
  }

  function exportAdminReviews() {
    if (!state.isAdmin) return;
    downloadFile("site_reviews.json", JSON.stringify(REVIEWS, null, 2), "application/json;charset=utf-8");
    showToast("Exported site_reviews.json!");
  }

  // Master Render
  function render() {
    const filtered = getFilteredData();
    const scopedTotal = getCityScopedData().length;
    if (state.view === "suggestions") {
      $("results-count").textContent = t("suggTitle");
    } else if (state.view === "reviews") {
      $("results-count").textContent = t("revTitle");
    } else if (state.view === "hypers") {
      const hyperList = getFilteredHypermarkets();
      const scopedAll = getCityScopedHypermarkets().length;
      $("results-count").textContent = state.city
        ? t("hyperCountText", { shown: hyperList.length, total: scopedAll, city: tCity(state.city) })
        : t("hyperCountAll", { shown: hyperList.length });
    } else if (state.view === "cinemas") {
      const cinemaList = getFilteredCinemas();
      const scopedAll = getCityScopedCinemas().length;
      $("results-count").textContent = state.city
        ? t("cinemaCountText", { shown: cinemaList.length, total: scopedAll, city: tCity(state.city) })
        : t("cinemaCountAll", { shown: cinemaList.length });
    } else if (state.view === "daily") {
      $("results-count").textContent = state.lang === "ml"
        ? "പ്രവാസി ലൈവ് ഡെസ്ക് · റിയാൽ നിരക്കുകൾ, സ്വർണ്ണവില, വിസ & വാർത്തകൾ"
        : "Pravasi Daily Live Desk · Live SAR Rates, Gold, Visa & News";
    } else {
      $("results-count").textContent = state.city
        ? t("showingCountInCity", { shown: filtered.length, total: scopedTotal, city: tCity(state.city) })
        : t("showingCount", { shown: filtered.length, total: DATA.length });
    }

    syncFilterChipsUI();
    syncViewButtons();
    renderReviews();

    const gridEl = $("cards-grid");
    const mapEl = $("map-section");
    const hypersEl = $("hypermarkets-section");
    const cinemasEl = $("cinemas-section");
    const dailyEl = $("daily-desk-section");
    const revEl = $("reviews-section");
    const suggEl = $("suggestions-section");

    gridEl.style.display = state.view === "grid" ? "grid" : "none";
    mapEl.classList.toggle("active", state.view === "map");
    if (hypersEl) hypersEl.classList.toggle("active", state.view === "hypers");
    if (cinemasEl) cinemasEl.classList.toggle("active", state.view === "cinemas");
    if (dailyEl) dailyEl.style.display = state.view === "daily" ? "block" : "none";
    if (revEl) revEl.classList.toggle("active", state.view === "reviews");
    if (suggEl) suggEl.classList.toggle("active", state.view === "suggestions");

    if (state.view === "grid") {
      renderCards(filtered);
    } else if (state.view === "map") {
      renderMap(filtered);
    } else if (state.view === "hypers") {
      renderHypermarkets();
    } else if (state.view === "cinemas") {
      renderCinemas();
    } else if (state.view === "daily") {
      renderDailyDesk();
    }
  }

  // Detail Modal
  function openDetailModal(id) {
    const item = DATA.find((d) => d.restaurant_id === id);
    if (!item) return;

    state.activeDetailId = id;
    const cityName = item.city || "Jeddah";
    $("detail-title").textContent = item.name;
    $("detail-sub").textContent = `${item.restaurant_id} · ${item.area}, ${tCity(cityName)}`;

    const ratingText =
      item.rating !== null
        ? `⭐ ${item.rating.toFixed(1)} (${(item.review_count || 0).toLocaleString()} ${t("ratingReviews")}) · ${
            item.rating_provider || "Business listing"
          }`
        : item.directory_rating !== null
        ? `★ ${item.directory_rating.toFixed(1)} (${t("ratingDirectory")})`
        : t("noRating");

    const reportMsg = `Hi ${DEVELOPER_NAME},\nI'd like to share an update for this KSA Malayali Hub listing:\n• ID: ${item.restaurant_id}\n• Name: ${item.name}\n• City: ${cityName}\n• Area: ${item.area}\n• Update / Correction: `;

    const body = $("detail-body");
    body.innerHTML = `
      ${
        item.photo
          ? `<div class="detail-photo-banner">
              <img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.name)}" class="detail-photo-img" onerror="this.parentElement.style.display=\'none\'">
            </div>`
          : ""
      }
      <div class="detail-list">
        <div class="detail-row">
          <div class="detail-label">${escapeHtml(t("modalCategory"))}</div>
          <div class="detail-val">${escapeHtml(tCategory(item.category))} · ${(item.tags || [])
      .map((tg) => escapeHtml(tg))
      .join(" • ")}</div>
        </div>

        <div class="detail-row">
          <div class="detail-label">${escapeHtml(t("modalAddress"))}</div>
          <div class="detail-val detail-val-flex">
            <span>${escapeHtml(item.full_address)}${
      item.plus_code ? ` <br><small style="color:var(--brand)">📌 Plus Code: ${escapeHtml(item.plus_code)}</small>` : ""
    }</span>
            <button type="button" class="mini-copy-btn" id="copy-addr-btn">📋 ${escapeHtml(t("modalCopyAddress"))}</button>
          </div>
        </div>

        ${
          item.phone_e164
            ? `<div class="detail-row">
                <div class="detail-label">${escapeHtml(t("modalPhone"))}</div>
                <div class="detail-val detail-val-flex">
                  <span>${escapeHtml(item.phone_e164)}</span>
                  <button type="button" class="mini-copy-btn" id="copy-phone-btn">📋 Copy</button>
                </div>
              </div>`
            : ""
        }

        <div class="detail-row">
          <div class="detail-label">${escapeHtml(t("modalRating"))}</div>
          <div class="detail-val">${escapeHtml(ratingText)}</div>
        </div>

        <div class="detail-row">
          <div class="detail-label">${escapeHtml(t("modalVerification"))}</div>
          <div class="detail-val">${escapeHtml(item.verification_status || "Pending field verification")} ${
      item.last_researched_utc ? `· Updated ${escapeHtml(item.last_researched_utc)}` : ""
    }</div>
        </div>

        ${
          item.source_url
            ? `<div class="detail-row">
                <div class="detail-label">${escapeHtml(t("modalSource"))}</div>
                <div class="detail-val">
                  <a href="${escapeHtml(item.source_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--brand);text-decoration:underline;">Primary Directory Source ↗</a>
                  ${
                    item.secondary_source_url
                      ? ` &nbsp;·&nbsp; <a href="${escapeHtml(
                          item.secondary_source_url
                        )}" target="_blank" rel="noopener noreferrer" style="color:var(--brand);text-decoration:underline;">Secondary Listing ↗</a>`
                      : ""
                  }
                </div>
              </div>`
            : ""
        }
      </div>

      <div class="modal-actions">
        <a class="card-btn card-btn-primary" href="${escapeHtml(
          item.maps_search_url
        )}" target="_blank" rel="noopener noreferrer">
          🗺 ${escapeHtml(t("modalOpenMaps"))}
        </a>
        ${
          item.phone_e164
            ? `<a class="card-btn card-btn-call" href="tel:${escapeHtml(item.phone_e164.replace(/\s+/g, ""))}">
                📞 ${escapeHtml(t("modalCallNow"))}
              </a>`
            : `<a class="card-btn" href="${escapeHtml(
                buildShareRestaurantWhatsAppUrl(item)
              )}" target="_blank" rel="noopener noreferrer">
                📤 ${escapeHtml(t("modalShareWA"))}
              </a>`
        }
        ${
          item.phone_e164
            ? `<a class="card-btn full-span" href="${escapeHtml(
                buildShareRestaurantWhatsAppUrl(item)
              )}" target="_blank" rel="noopener noreferrer">
                📤 ${escapeHtml(t("modalShareWA"))}
              </a>`
            : ""
        }
        <a class="btn-whatsapp-solid full-span" href="${escapeHtml(
          buildWhatsAppUrl(reportMsg)
        )}" target="_blank" rel="noopener noreferrer">
          💬 ${escapeHtml(t("modalReportWA"))} (${SUPPORT_WHATSAPP_DISPLAY})
        </a>
      </div>
    `;

    $("copy-addr-btn").addEventListener("click", () => copyToClipboard(item.full_address));
    const copyPhoneBtn = $("copy-phone-btn");
    if (copyPhoneBtn) {
      copyPhoneBtn.addEventListener("click", () => copyToClipboard(item.phone_e164));
    }

    $("detail-modal").classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDetailModal() {
    state.activeDetailId = null;
    $("detail-modal").classList.remove("open");
    document.body.style.overflow = "";
  }

  // Expose helper for Leaflet popup button
  window.__jkfOpenDetail = openDetailModal;

  // Switch to Read-Only Visitor Suggestion Tab (no direct modification allowed)
  function openSubmitModal() {
    setView("suggestions", true);
  }

  function handleSubmitForm(e) {
    e.preventDefault();
    const reqType = $("sub-type").value;
    const city = $("sub-city") ? $("sub-city").value : "Jeddah";
    const name = $("sub-name").value.trim();
    const area = $("sub-area").value.trim();
    const phone = $("sub-phone").value.trim();
    const maps = $("sub-maps").value.trim();
    const notes = $("sub-notes").value.trim();

    if (!name || !area) {
      showToast(t("toastRequired"));
      return;
    }

    const msg = [
      `🍛 *KSA Malayali Hub — User Suggestion (For Admin Review)*`,
      `📌 Request: ${reqType}`,
      `🏙 City: ${city}`,
      `🏪 Restaurant: ${name}`,
      `📍 Area / District: ${area}`,
      phone ? `📞 Phone: ${phone}` : "",
      maps ? `🗺 Maps / Landmark: ${maps}` : "",
      notes ? `📝 Notes: ${notes}` : "",
      `— Submitted via Suggestions Tab for ${DEVELOPER_NAME} Admin Review`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppUrl(msg), "_blank", "noopener,noreferrer");
    showToast(t("suggSubmittedToast"));
    $("submit-form").reset();
  }

  // ==========================================================================
  // Admin-Only Controls (Strictly Locked Behind Admin Passcode)
  // ==========================================================================
  function syncAdminUI() {
    const bar = $("admin-bar");
    if (bar) {
      bar.style.display = state.isAdmin ? "block" : "none";
    }
    const note = $("admin-change-note");
    if (note) {
      note.textContent =
        state.adminChangesCount > 0
          ? `${state.adminChangesCount} unsaved change(s) — click "Export data.js" to publish`
          : "Authorized editing unlocked";
    }

    const real = getRealTrafficData();
    if ($("admin-traffic-pill-text")) {
      $("admin-traffic-pill-text").textContent = `📊 Real: ${real.sessions} Visits (${real.views} Hits)`;
    }

    const visitsPill = $("admin-visits-pill");
    if (visitsPill) {
      visitsPill.style.display = state.isAdmin ? "block" : "none";
      if ($("admin-hero-real-visits")) $("admin-hero-real-visits").textContent = real.sessions;
      if ($("admin-hero-real-views")) $("admin-hero-real-views").textContent = real.views;
    }

    if ($("metric-real-sessions")) $("metric-real-sessions").textContent = real.sessions;
    if ($("metric-real-views")) $("metric-real-views").textContent = real.views;
    if ($("metric-first-visit")) $("metric-first-visit").textContent = real.firstVisit;
    if ($("metric-last-visit")) $("metric-last-visit").textContent = real.lastVisit;
  }

  function openAdminTrafficModal() {
    if (!state.isAdmin) return;
    syncAdminUI();
    const modal = $("admin-traffic-modal");
    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeAdminTrafficModal() {
    const modal = $("admin-traffic-modal");
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  function resetAdminTrafficTelemetry() {
    if (!state.isAdmin) return;
    if (window.confirm("Reset real visitor telemetry counters back to zero?")) {
      localStorage.setItem(REAL_SESSIONS_STORAGE_KEY, "1");
      localStorage.setItem(REAL_VIEWS_STORAGE_KEY, "1");
      localStorage.setItem(REAL_FIRST_VISIT_STORAGE_KEY, new Date().toLocaleString());
      localStorage.setItem(REAL_LAST_VISIT_STORAGE_KEY, new Date().toLocaleString());
      syncAdminUI();
      showToast("Real visitor telemetry reset.");
    }
  }

  function openAdminLoginModal() {
    if (state.isAdmin) {
      showToast("Admin mode is already unlocked.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    $("admin-login-error").style.display = "none";
    $("admin-pin-input").value = "";
    $("admin-login-modal").classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("admin-pin-input").focus(), 60);
  }

  function closeAdminLoginModal() {
    $("admin-login-modal").classList.remove("open");
    document.body.style.overflow = "";
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    const pin = ($("admin-pin-input").value || "").trim();
    if (pin !== getActiveAdminPin()) {
      $("admin-login-error").style.display = "block";
      return;
    }
    state.isAdmin = true;
    sessionStorage.setItem("jkf_admin_unlocked", "1");
    closeAdminLoginModal();
    syncAdminUI();
    render();
    showToast("D&J Admin Mode unlocked.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function lockAdminMode() {
    state.isAdmin = false;
    sessionStorage.removeItem("jkf_admin_unlocked");
    closeAdminEditorModal();
    closeAdminReviewModal();
    closeAdminPinModal();
    closeAdminTrafficModal();
    syncAdminUI();
    render();
    showToast("Admin Mode locked.");
  }

  // Admin Change Password / PIN
  function openAdminPinModal() {
    if (!state.isAdmin) return;
    $("adm-curr-pin").value = "";
    $("adm-new-pin").value = "";
    $("adm-confirm-pin").value = "";
    $("admin-pin-modal").classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("adm-curr-pin").focus(), 60);
  }

  function closeAdminPinModal() {
    if ($("admin-pin-modal")) $("admin-pin-modal").classList.remove("open");
    document.body.style.overflow = "";
  }

  function handleAdminPinChange(e) {
    e.preventDefault();
    if (!state.isAdmin) return;
    const curr = ($("adm-curr-pin").value || "").trim();
    const newPin = ($("adm-new-pin").value || "").trim();
    const confirmPin = ($("adm-confirm-pin").value || "").trim();

    if (curr !== getActiveAdminPin()) {
      showToast("Current password is incorrect.");
      $("adm-curr-pin").focus();
      return;
    }
    if (newPin.length < 4) {
      showToast("New password must be at least 4 characters.");
      $("adm-new-pin").focus();
      return;
    }
    if (newPin !== confirmPin) {
      showToast("New passwords do not match.");
      $("adm-confirm-pin").focus();
      return;
    }

    setCustomAdminPin(newPin);
    closeAdminPinModal();
    showToast("Admin password updated successfully!");
  }

  function handleResetAdminPinDefault() {
    if (!state.isAdmin) return;
    if (window.confirm("Reset Admin PIN to factory default (DJ2026)?")) {
      resetAdminPinToDefault();
      closeAdminPinModal();
      showToast("Admin PIN reset to default: DJ2026");
    }
  }

  // Animate visitor counter on page load
  function animateVisitsCount() {
    const el = $("visit-count-display");
    const navEl = $("topbar-visits-count");
    if (!el) return;

    const target = totalVisits;
    const start = Math.max(1000, target - 120);
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (target - start) * ease);
      el.textContent = current.toLocaleString();
      if (navEl) {
        navEl.textContent = (current / 1000).toFixed(1) + "K+ Visits";
      }
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
        if (navEl) {
          navEl.textContent = (target / 1000).toFixed(1) + "K+ Visits";
        }
      }
    }
    requestAnimationFrame(update);
  }

  function openAdminEditorModal(editId) {
    if (!state.isAdmin) return;
    const isEdit = Boolean(editId);
    const existing = isEdit ? DATA.find((d) => d.restaurant_id === editId) : null;

    $("admin-editor-title").textContent = isEdit
      ? `Edit Listing (${existing.restaurant_id})`
      : "Add Restaurant (Admin Only)";
    $("adm-edit-id").value = existing ? existing.restaurant_id : "";
    $("adm-name").value = existing ? existing.name : "";
    $("adm-category").value = existing ? existing.category : "Kerala Restaurant";
    $("adm-city").value = existing ? existing.city : state.city || "Jeddah";
    $("adm-area").value = existing ? existing.area : "";
    $("adm-address").value = existing ? existing.full_address : "";
    $("adm-phone").value = existing ? existing.phone_e164 || "" : "";
    $("adm-rating").value = existing && existing.display_rating ? existing.display_rating : "";
    $("adm-maps").value = existing ? existing.maps_search_url || "" : "";
    $("adm-tags").value = existing ? (existing.tags || []).join(", ") : "Kerala Cuisine";

    $("admin-editor-modal").classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeAdminEditorModal() {
    $("admin-editor-modal").classList.remove("open");
    document.body.style.overflow = "";
  }

  function handleAdminEditorSave(e) {
    e.preventDefault();
    if (!state.isAdmin) return;

    const editId = $("adm-edit-id").value.trim();
    const name = $("adm-name").value.trim();
    const category = $("adm-category").value;
    const city = $("adm-city").value;
    const area = $("adm-area").value.trim();
    const fullAddress = $("adm-address").value.trim();
    const phone = $("adm-phone").value.trim();
    const ratingRaw = parseFloat($("adm-rating").value);
    const ratingVal = Number.isFinite(ratingRaw) ? Math.min(5, Math.max(1, ratingRaw)) : null;
    const mapsInput = $("adm-maps").value.trim();
    const mapsUrl =
      mapsInput || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${fullAddress}`)}`;
    const tags = $("adm-tags")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const today = new Date().toISOString().slice(0, 10);

    if (editId) {
      const idx = DATA.findIndex((d) => d.restaurant_id === editId);
      if (idx !== -1) {
        DATA[idx] = {
          ...DATA[idx],
          name,
          category,
          city,
          area,
          full_address: fullAddress,
          phone_e164: phone,
          maps_search_url: mapsUrl,
          rating: ratingVal,
          display_rating: ratingVal,
          rating_source: ratingVal !== null ? "listing" : "none",
          tags: tags.length ? tags : ["Kerala Cuisine"],
          verification_status: "Verified by D&J Admin",
          last_researched_utc: today,
        };
      }
      showToast(`Updated "${name}"`);
    } else {
      const prefix = city.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "KSA";
      const nextNum = String(DATA.length + 1).padStart(4, "0");
      const [lat, lng] = CITY_FALLBACK_COORDS[city] || [21.5433, 39.1728];
      DATA.unshift({
        restaurant_id: `${prefix}-${nextNum}`,
        name,
        category,
        business_type: category,
        tags: tags.length ? tags : ["Kerala Cuisine"],
        area,
        city,
        country: "Saudi Arabia",
        full_address: fullAddress,
        plus_code: "",
        latitude: lat,
        longitude: lng,
        coord_precision: "district_approx",
        maps_search_url: mapsUrl,
        phone_e164: phone,
        whatsapp: "",
        rating: ratingVal,
        review_count: null,
        rating_provider: ratingVal !== null ? "D&J Admin" : "",
        directory_rating: null,
        display_rating: ratingVal,
        rating_source: ratingVal !== null ? "listing" : "none",
        opening_hours: "",
        operating_status: "Admin verified",
        kerala_food_evidence: "Verified by D&J Admin",
        malayali_ownership_verified: "Admin verified",
        verification_status: "Verified by D&J Admin",
        source_url: "",
        secondary_source_url: "",
        last_researched_utc: today,
        notes: "",
      });
      showToast(`Added "${name}" to ${city}`);
    }

    state.adminChangesCount += 1;
    closeAdminEditorModal();
    updateStats();
    renderCityTabs();
    populateSelects();
    syncAdminUI();
    render();
  }

  function handleAdminDelete(id) {
    if (!state.isAdmin) return;
    const item = DATA.find((d) => d.restaurant_id === id);
    if (!item) return;
    if (!window.confirm(`Admin Delete: Remove "${item.name}" (${item.city}) from the directory?`)) return;
    DATA = DATA.filter((d) => d.restaurant_id !== id);
    state.adminChangesCount += 1;
    updateStats();
    renderCityTabs();
    populateSelects();
    syncAdminUI();
    render();
    showToast(`Deleted "${item.name}"`);
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportAdminDataJs() {
    if (!state.isAdmin) return;
    const js = [
      "// Exported from KSA Malayali Hub Admin Console",
      "// Developed by D&J (+44 7460 646263)",
      `window.KSA_KERALA_FOODS = ${JSON.stringify(DATA)};`,
      "window.JEDDAH_KERALA_FOODS = window.KSA_KERALA_FOODS;",
      "",
    ].join("\n");
    downloadFile("data.js", js, "application/javascript;charset=utf-8");
    showToast("Exported js/data.js — replace in project folder to publish!");
  }

  function exportAdminJson() {
    if (!state.isAdmin) return;
    downloadFile("restaurants.json", JSON.stringify(DATA, null, 2), "application/json;charset=utf-8");
    showToast("Exported data/restaurants.json!");
  }

  // Geolocation "Near Me"
  function handleNearMe() {
    if (!navigator.geolocation) {
      showToast(t("toastLocError"));
      return;
    }

    showToast(t("toastLocating"));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        state.sort = "nearest";
        populateSelects();
        $("sort-select").value = "nearest";
        showToast(t("toastLocated"));
        render();
      },
      () => {
        showToast(t("toastLocError"));
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  // Bind all event listeners
  function bindEvents() {
    const searchInput = $("search-input");
    const clearSearch = $("clear-search");

    searchInput.addEventListener("input", (e) => {
      state.query = e.target.value;
      clearSearch.classList.toggle("visible", state.query.length > 0);
      render();
    });

    clearSearch.addEventListener("click", () => {
      state.query = "";
      searchInput.value = "";
      clearSearch.classList.remove("visible");
      searchInput.focus();
      render();
    });

    $("area-select").addEventListener("change", (e) => {
      state.area = e.target.value;
      updatePopularAreaHighlight();
      render();
    });

    $("category-select").addEventListener("change", (e) => {
      state.category = e.target.value;
      render();
    });

    $("sort-select").addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });

    $("chip-phone").addEventListener("click", () => {
      state.onlyPhone = !state.onlyPhone;
      render();
    });

    $("chip-top").addEventListener("click", () => {
      state.onlyTopRated = !state.onlyTopRated;
      render();
    });

    $("chip-reviewed").addEventListener("click", () => {
      state.onlyReviewed = !state.onlyReviewed;
      render();
    });

    $("chip-saved").addEventListener("click", () => {
      state.onlySaved = !state.onlySaved;
      render();
    });

    $("chip-near").addEventListener("click", handleNearMe);
    $("chip-reset").addEventListener("click", resetFilters);

    $("view-grid-btn").addEventListener("click", () => setView("grid", false));
    $("view-map-btn").addEventListener("click", () => setView("map", false));
    if ($("view-hypers-btn")) {
      $("view-hypers-btn").addEventListener("click", () => setView("hypers", false));
    }
    if ($("view-cinemas-btn")) {
      $("view-cinemas-btn").addEventListener("click", () => setView("cinemas", false));
    }
    if ($("view-daily-btn")) {
      $("view-daily-btn").addEventListener("click", () => setView("daily", false));
    }
    if ($("view-reviews-btn")) {
      $("view-reviews-btn").addEventListener("click", () => setView("reviews", false));
    }
    if ($("view-sugg-btn")) {
      $("view-sugg-btn").addEventListener("click", () => setView("suggestions", false));
    }
    if ($("hero-view-hypers")) {
      $("hero-view-hypers").addEventListener("click", () => setView("hypers", true));
    }
    if ($("hero-view-cinemas")) {
      $("hero-view-cinemas").addEventListener("click", () => setView("cinemas", true));
    }
    if ($("hero-view-daily")) {
      $("hero-view-daily").addEventListener("click", () => setView("daily", true));
    }
    if ($("ticker-open-btn")) {
      $("ticker-open-btn").addEventListener("click", () => setView("daily", true));
    }
    setupNewsTicker();
    initLiveCurrencySync();

    // Hypermarket Brand Filter Pills
    document.querySelectorAll(".hyper-brand-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".hyper-brand-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        state.brandFilter = pill.getAttribute("data-brand") || "";
        renderHypermarkets();
      });
    });

    // Cinema Brand Filter Pills
    document.querySelectorAll(".cinema-brand-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".cinema-brand-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        state.cinemaBrandFilter = pill.getAttribute("data-cinema-brand") || "";
        renderCinemas();
      });
    });

    // Site Ratings & Community Reviews
    document.querySelectorAll(".star-pick-btn").forEach((btn) => {
      btn.addEventListener("click", () => setSelectedReviewStars(btn.getAttribute("data-star")));
    });
    if ($("site-review-form")) {
      $("site-review-form").addEventListener("submit", handleSiteReviewSubmit);
    }

    $("lang-toggle").addEventListener("click", () => {
      state.lang = state.lang === "en" ? "ml" : "en";
      applyLanguage();
    });

    $("theme-toggle").addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme();
    });

    $("notice-close").addEventListener("click", () => {
      $("notice-banner").style.display = "none";
    });

    // Modals & Suggestions
    $("detail-close").addEventListener("click", closeDetailModal);
    $("detail-modal").addEventListener("click", (e) => {
      if (e.target === $("detail-modal")) closeDetailModal();
    });

    $("open-submit-nav").addEventListener("click", openSubmitModal);
    $("open-submit-hero").addEventListener("click", openSubmitModal);
    $("submit-form").addEventListener("submit", handleSubmitForm);

    // Admin Portal (Protected)
    if ($("open-admin-login")) $("open-admin-login").addEventListener("click", openAdminLoginModal);
    if ($("admin-login-close")) $("admin-login-close").addEventListener("click", closeAdminLoginModal);
    if ($("admin-login-modal")) {
      $("admin-login-modal").addEventListener("click", (e) => {
        if (e.target === $("admin-login-modal")) closeAdminLoginModal();
      });
    }
    if ($("admin-login-form")) $("admin-login-form").addEventListener("submit", handleAdminLogin);
    if ($("admin-add-btn")) $("admin-add-btn").addEventListener("click", () => openAdminEditorModal(""));
    if ($("admin-change-pin-btn")) $("admin-change-pin-btn").addEventListener("click", openAdminPinModal);
    if ($("admin-pin-close")) $("admin-pin-close").addEventListener("click", closeAdminPinModal);
    if ($("admin-pin-modal")) {
      $("admin-pin-modal").addEventListener("click", (e) => {
        if (e.target === $("admin-pin-modal")) closeAdminPinModal();
      });
    }
    if ($("admin-pin-form")) $("admin-pin-form").addEventListener("submit", handleAdminPinChange);
    if ($("admin-pin-reset-default")) $("admin-pin-reset-default").addEventListener("click", handleResetAdminPinDefault);
    if ($("admin-export-js")) $("admin-export-js").addEventListener("click", exportAdminDataJs);
    if ($("admin-export-json")) $("admin-export-json").addEventListener("click", exportAdminJson);
    if ($("admin-export-reviews")) $("admin-export-reviews").addEventListener("click", exportAdminReviews);
    if ($("admin-traffic-badge")) $("admin-traffic-badge").addEventListener("click", openAdminTrafficModal);
    if ($("admin-traffic-modal-btn")) $("admin-traffic-modal-btn").addEventListener("click", openAdminTrafficModal);
    if ($("admin-traffic-close")) $("admin-traffic-close").addEventListener("click", closeAdminTrafficModal);
    if ($("admin-traffic-done-btn")) $("admin-traffic-done-btn").addEventListener("click", closeAdminTrafficModal);
    if ($("admin-traffic-reset-btn")) $("admin-traffic-reset-btn").addEventListener("click", resetAdminTrafficTelemetry);
    if ($("admin-traffic-modal")) {
      $("admin-traffic-modal").addEventListener("click", (e) => {
        if (e.target === $("admin-traffic-modal")) closeAdminTrafficModal();
      });
    }
    if ($("admin-logout-btn")) $("admin-logout-btn").addEventListener("click", lockAdminMode);
    if ($("admin-editor-close")) $("admin-editor-close").addEventListener("click", closeAdminEditorModal);
    if ($("admin-editor-modal")) {
      $("admin-editor-modal").addEventListener("click", (e) => {
        if (e.target === $("admin-editor-modal")) closeAdminEditorModal();
      });
    }
    if ($("admin-editor-form")) $("admin-editor-form").addEventListener("submit", handleAdminEditorSave);
    if ($("admin-review-close")) $("admin-review-close").addEventListener("click", closeAdminReviewModal);
    if ($("admin-review-modal")) {
      $("admin-review-modal").addEventListener("click", (e) => {
        if (e.target === $("admin-review-modal")) closeAdminReviewModal();
      });
    }
    if ($("admin-review-form")) $("admin-review-form").addEventListener("submit", handleAdminReviewSave);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDetailModal();
        closeAdminLoginModal();
        closeAdminEditorModal();
        closeAdminReviewModal();
        closeAdminPinModal();
        closeAdminTrafficModal();
      }
    });
  }

  // Initialize app
  function init() {
    applyTheme();
    updateStats();
    syncAdminUI();
    bindEvents();
    applyLanguage();
    animateVisitsCount();
    if (new URLSearchParams(window.location.search).get("admin") === "1" && !state.isAdmin) {
      openAdminLoginModal();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
