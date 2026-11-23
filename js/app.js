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
    activeHeritageTab: "kings",
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

  // Render Grid Cards (Replaced duplicate 174+ dump with sleek luxury summary card linking to dedicated hotels page)
  function renderCards(items) {
    const grid = $("cards-grid");
    if (!grid) return;

    const totalCount = (items && items.length) ? items.length : (DATA ? DATA.length : 174);
    const countDisplay = $("results-count");
    if (countDisplay) {
      countDisplay.textContent = `174+ മലയാളി ഹോട്ടലുകൾ (11 നഗരങ്ങൾ) · വെരിഫൈഡ് ലിസ്റ്റിംഗ്`;
    }

    grid.innerHTML = `
      <div class="hotels-home-summary-card">
        <div class="hotels-summary-header">
          <div class="hotels-summary-badges">
            <span class="hotels-pill-gold">🍛 കേരള രുചികൾ സൗദിയിൽ</span>
            <span class="hotels-pill-emerald">${totalCount}+ വെരിഫൈഡ് ഹോട്ടലുകൾ</span>
          </div>
          <h2 class="hotels-summary-heading">സൗദിയിലെ മലയാളി ഹോട്ടലുകൾ &amp; റസ്റ്റോറന്റുകൾ</h2>
          <p class="hotels-summary-sub">
            ജിദ്ദ, റിയാദ്, ദമ്മാം, മക്ക, മദീന, തായിഫ് ഉൾപ്പെടെ 11 പ്രധാന സൗദി നഗരങ്ങളിലെ തനത് കേരള ഭക്ഷണശാലകൾ, മലബാർ ദം ബിരിയാണി, പൊറോട്ട, തട്ടുകട വിഭവങ്ങൾ, ഗൂഗിൾ മാപ്പ് നാവിഗേഷൻ, നേരിട്ട് വിളിക്കാനുള്ള ഫോൺ നമ്പറുകൾ എന്നിവ സമഗ്രമായി പരിശോധിക്കാം.
          </p>
        </div>

        <div class="hotels-summary-stats-grid">
          <div class="city-stat-card">
            <div class="city-stat-dot">📍</div>
            <div class="city-stat-info">
              <strong>ജിദ്ദ (Jeddah)</strong>
              <span>80+ കേരള ഹോട്ടലുകൾ</span>
            </div>
          </div>
          <div class="city-stat-card">
            <div class="city-stat-dot">📍</div>
            <div class="city-stat-info">
              <strong>റിയാദ് (Riyadh)</strong>
              <span>35+ കേരള ഹോട്ടലുകൾ</span>
            </div>
          </div>
          <div class="city-stat-card">
            <div class="city-stat-dot">📍</div>
            <div class="city-stat-info">
              <strong>ദമ്മാം &amp; ഖോബാർ</strong>
              <span>20+ കേരള ഹോട്ടലുകൾ</span>
            </div>
          </div>
          <div class="city-stat-card">
            <div class="city-stat-dot">📍</div>
            <div class="city-stat-info">
              <strong>മക്ക &amp; മദീന</strong>
              <span>15+ കേരള ഹോട്ടലുകൾ</span>
            </div>
          </div>
          <div class="city-stat-card">
            <div class="city-stat-dot">📍</div>
            <div class="city-stat-info">
              <strong>തായിഫ് &amp; തെക്കൻ പ്രവിശ്യ</strong>
              <span>12+ കേരള ഹോട്ടലുകൾ</span>
            </div>
          </div>
          <div class="city-stat-card">
            <div class="city-stat-dot">📍</div>
            <div class="city-stat-info">
              <strong>ഖസീം, തബൂക്ക് &amp; മറ്റ് നഗരങ്ങൾ</strong>
              <span>12+ കേരള ഹോട്ടലുകൾ</span>
            </div>
          </div>
        </div>

        <div class="hotels-summary-cta-row">
          <a href="/saudi#saudi-hotels-section" class="hotels-cta-primary">
            <span>🍲 174+ മലയാളി ഹോട്ടലുകൾ കാണുക (Explore All Hotels ↗)</span>
          </a>
          <button type="button" id="hotels-summary-map-btn" class="hotels-cta-secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            <span>മാപ്പിൽ കാണുക (Interactive Map)</span>
          </button>
        </div>
      </div>
    `;

    const mapBtn = $("hotels-summary-map-btn");
    if (mapBtn) {
      mapBtn.addEventListener("click", () => {
        const viewMap = $("view-map-btn");
        if (viewMap) viewMap.click();
      });
    }
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
        `Check out the latest ${flyer.brand} weekly flyer on KSA Malayali Hub: https://ksa-malayali-hub.vercel.app/`
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
    renderOttReleases();
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
  // Malayalam OTT Releases Showcase
  // ==========================================================================
  let activeOttPlatform = "all";

  function setupOttFilterListeners() {
    const filterContainer = $("ott-filter-tabs");
    if (filterContainer && !filterContainer.hasAttribute("data-listener")) {
      filterContainer.setAttribute("data-listener", "true");
      filterContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".ott-filter-btn");
        if (!btn) return;
        filterContainer.querySelectorAll(".ott-filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeOttPlatform = btn.dataset.platform || "all";
        renderOttReleases();
      });
    }
  }

  function renderOttReleases() {
    const grid = $("ott-movies-grid");
    if (!grid) return;
    setupOttFilterListeners();

    let movies = window.MALAYALAM_OTT_DATA || [];
    if (activeOttPlatform !== "all") {
      movies = movies.filter((m) => m.platform_key === activeOttPlatform);
    }

    if (!movies.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🍿</div>
          <h3>സിനിമകൾ കണ്ടെത്തിയില്ല</h3>
          <p>ദയവായി 'All OTT' ക്ലിക്ക് ചെയ്യുക.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = movies
      .map((m) => {
        const isMl = state.lang === "ml";
        const title = isMl && m.title_ml ? m.title_ml : m.title;
        const subTitle = isMl ? m.title : (m.title_ml || "");
        const status = isMl && m.status_ml ? m.status_ml : m.status;
        const desc = isMl && m.desc_ml ? m.desc_ml : m.desc;
        const rating = m.rating ? `⭐ ${m.rating.toFixed(1)}` : "⭐ 8.0";

        return `
          <article class="ott-movie-card">
            <div class="ott-poster-wrap">
              <img src="${escapeHtml(m.poster)}" alt="${escapeHtml(m.title)}" loading="lazy">
              <span class="ott-rating-badge">${rating}</span>
              <span class="ott-status-tag">${escapeHtml(status)}</span>
            </div>
            <div class="ott-card-body">
              <h4 class="ott-movie-title">${escapeHtml(title)}</h4>
              <div class="ott-movie-title-ml">${escapeHtml(subTitle)}</div>
              <div class="ott-platform-pill ${m.platform_key}">
                <span>📺 ${escapeHtml(m.platform)}</span>
              </div>
              <div class="ott-movie-meta">
                <span>🎭 ${escapeHtml(m.genre)}</span> · <span>📅 ${escapeHtml(m.year)}</span>
              </div>
              <div class="ott-movie-cast">
                <span>👥 ${escapeHtml(m.cast)}</span>
              </div>
              <p class="ott-movie-meta" style="font-size:0.82rem; color:#94a3b8; margin-bottom:14px; line-height:1.45;">
                ${escapeHtml(desc)}
              </p>
              <a href="${escapeHtml(m.watch_url)}" target="_blank" rel="noopener noreferrer" class="ott-watch-btn">
                <span>▶️ ${escapeHtml(m.platform)}-ൽ കാണുക ➔</span>
              </a>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // ==========================================================================
  // Malayalam Pravasi E-Library & Digital Reader
  // ==========================================================================
  let activeLibraryCategory = "all";
  let librarySearchQuery = "";
  let readerCurrentFontSize = 18;
  let readerCurrentTheme = "sepia"; // 'sepia', 'night', 'white'

  const HOME_LIBRARY_CATEGORIES = [
    { id: "all", label: "എല്ലാം" },
    { id: "pravasi", label: "🏜️ പ്രവാസി ഗൈഡുകൾ" },
    { id: "novels", label: "📖 നോവലുകൾ" },
    { id: "stories", label: "✍️ കഥകൾ & ഹാസ്യം" },
    { id: "poetry", label: "📜 കവിതകൾ" },
    { id: "classics", label: "🏺 ക്ലാസിക്കുകൾ & മാപ്പിളപ്പാട്ട്" },
    { id: "history", label: "🧭 ചരിത്രം & യാത്ര" }
  ];

  function setupLibraryListeners() {
    const searchInput = $("library-search-input");
    if (searchInput && !searchInput.hasAttribute("data-listener")) {
      searchInput.setAttribute("data-listener", "true");
      ["input", "change", "keyup"].forEach((evt) => {
        searchInput.addEventListener(evt, (e) => {
          librarySearchQuery = e.target.value.trim().toLowerCase();
          renderLibrary();
        });
      });
    }

    const tabsContainer = $("library-category-tabs");
    if (tabsContainer && !tabsContainer.hasAttribute("data-listener")) {
      tabsContainer.setAttribute("data-listener", "true");
      const books = window.MALAYALAM_LIBRARY_DATA || window.LIBRARY_DATA || [];
      const counts = { all: books.length };
      books.forEach((b) => {
        counts[b.category] = (counts[b.category] || 0) + 1;
      });

      const badge = $("library-tab-badge");
      if (badge) badge.textContent = String(books.length);

      tabsContainer.innerHTML = HOME_LIBRARY_CATEGORIES.map((cat) => {
        const count = counts[cat.id] || 0;
        const isActive = activeLibraryCategory === cat.id ? "active" : "";
        return `<button type="button" class="library-tab-btn ${isActive}" data-category="${cat.id}">${cat.label} (${count})</button>`;
      }).join("");

      tabsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".library-tab-btn");
        if (!btn) return;
        tabsContainer.querySelectorAll(".library-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeLibraryCategory = btn.dataset.category || "all";
        renderLibrary();
      });
    }

    // Reader Modal Controls
    const closeBtn = $("reader-close-btn");
    if (closeBtn && !closeBtn.hasAttribute("data-listener")) {
      closeBtn.setAttribute("data-listener", "true");
      closeBtn.addEventListener("click", closeBookReader);
    }

    const footerCloseBtn = $("reader-footer-close-btn");
    if (footerCloseBtn && !footerCloseBtn.hasAttribute("data-listener")) {
      footerCloseBtn.setAttribute("data-listener", "true");
      footerCloseBtn.addEventListener("click", closeBookReader);
    }

    const modalEl = $("book-reader-modal");
    if (modalEl && !modalEl.hasAttribute("data-listener")) {
      modalEl.setAttribute("data-listener", "true");
      modalEl.addEventListener("click", (e) => {
        if (e.target === modalEl) closeBookReader();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalEl.style.display === "flex") {
          closeBookReader();
        }
      });
    }

    const fontDec = $("reader-font-dec");
    if (fontDec && !fontDec.hasAttribute("data-listener")) {
      fontDec.setAttribute("data-listener", "true");
      fontDec.addEventListener("click", () => {
        readerCurrentFontSize = Math.max(14, readerCurrentFontSize - 2);
        const bodyEl = $("reader-content-body");
        if (bodyEl) bodyEl.style.fontSize = `${readerCurrentFontSize}px`;
      });
    }

    const fontInc = $("reader-font-inc");
    if (fontInc && !fontInc.hasAttribute("data-listener")) {
      fontInc.setAttribute("data-listener", "true");
      fontInc.addEventListener("click", () => {
        readerCurrentFontSize = Math.min(26, readerCurrentFontSize + 2);
        const bodyEl = $("reader-content-body");
        if (bodyEl) bodyEl.style.fontSize = `${readerCurrentFontSize}px`;
      });
    }

    const themeBtn = $("reader-theme-toggle");
    if (themeBtn && !themeBtn.hasAttribute("data-listener")) {
      themeBtn.setAttribute("data-listener", "true");
      themeBtn.addEventListener("click", () => {
        const box = $("book-reader-box");
        if (!box) return;
        if (readerCurrentTheme === "sepia") {
          readerCurrentTheme = "night";
          box.className = "book-reader-box theme-night";
        } else if (readerCurrentTheme === "night") {
          readerCurrentTheme = "white";
          box.className = "book-reader-box theme-white";
        } else {
          readerCurrentTheme = "sepia";
          box.className = "book-reader-box theme-sepia";
        }
      });
    }

    const printBtn = $("reader-print-btn");
    if (printBtn && !printBtn.hasAttribute("data-listener")) {
      printBtn.setAttribute("data-listener", "true");
      printBtn.addEventListener("click", () => {
        if (window.currentActiveReadingBookId && typeof window.downloadBookPdf === "function") {
          window.downloadBookPdf(window.currentActiveReadingBookId);
        } else {
          window.print();
        }
      });
    }

    const footerDownloadBtn = $("reader-footer-download-btn");
    if (footerDownloadBtn && !footerDownloadBtn.hasAttribute("data-listener")) {
      footerDownloadBtn.setAttribute("data-listener", "true");
      footerDownloadBtn.addEventListener("click", () => {
        if (window.currentActiveReadingBookId && typeof window.downloadBookPdf === "function") {
          window.downloadBookPdf(window.currentActiveReadingBookId);
        }
      });
    }
  }

  function renderLibrary() {
    const grid = $("library-books-grid");
    if (!grid) return;
    setupLibraryListeners();

    let books = window.MALAYALAM_LIBRARY_DATA || window.LIBRARY_DATA || [];

    // Filter by Category
    if (activeLibraryCategory !== "all") {
      books = books.filter((b) => {
        if (b.category === activeLibraryCategory) return true;
        if (activeLibraryCategory === "travel" && b.category === "history") return true;
        return false;
      });
    }

    // Filter by Search Query
    if (librarySearchQuery) {
      books = books.filter((b) => {
        const tMl = (b.title || "").toLowerCase();
        const tEn = (b.englishTitle || b.title_en || "").toLowerCase();
        const aMl = (b.author || "").toLowerCase();
        const aEn = (b.author_en || "").toLowerCase();
        const sm = (b.summary || "").toLowerCase();
        const cat = (b.category_label || "").toLowerCase();
        const id = String(b.id);
        const q = librarySearchQuery;
        return tMl.includes(q) || tEn.includes(q) || aMl.includes(q) || aEn.includes(q) || sm.includes(q) || cat.includes(q) || id === q;
      });
    }

    if (!books.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">📚</div>
          <h3>പുസ്തകങ്ങൾ കണ്ടെത്തിയില്ല</h3>
          <p>ദയവായി വേറൊരു പേര് തിരയുകയോ 'All' കാറ്റഗറി ക്ലിക്ക് ചെയ്യുകയോ ചെയ്യുക.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = books
      .map((b) => {
        const engTitle = b.englishTitle || b.title_en || "";
        const yr = b.year || (b.yearOrType ? (b.yearOrType.match(/\b\d{4}\b/) ? b.yearOrType.match(/\b\d{4}\b/)[0] : "") : "");
        const metaParts = [engTitle, yr].filter(Boolean);
        const metaYear = metaParts.length ? metaParts.join(" · ") : "";
        const ratingStr = typeof b.rating === "number" ? b.rating.toFixed(1) : "4.8";
        const pagesStr = b.pages || 180;
        const catLabel = b.category_label || "വായന";

        return `
          <article class="book-card" data-book-id="${b.id}" style="cursor:pointer;" tabindex="0">
            <div class="book-cover-banner" style="background: linear-gradient(135deg, #047857cc, #0f172a);">
              <div class="book-cover-top">
                <span class="book-cat-pill">${escapeHtml(catLabel)}</span>
                <span class="book-icon-badge">📖</span>
              </div>
              <div class="book-cover-title-group">
                <h3>${escapeHtml(b.title)}</h3>
                ${metaYear ? `<span class="book-title-en">${escapeHtml(metaYear)}</span>` : ""}
              </div>
            </div>

            <div class="book-card-body">
              <div class="book-author-meta">
                <span>✍️ ${escapeHtml(b.author)}</span>
              </div>
              <div class="book-stats-row">
                <span>⭐ ${ratingStr}</span>
                <span>📄 ${pagesStr} പേജുകൾ</span>
                <span>🏷️ #${b.id}</span>
              </div>
              <p class="book-summary-text">
                ${escapeHtml(b.summary || "")}
              </p>
              <div class="book-actions-row">
                <a href="${b.readUrl || 'https://ml.wikisource.org'}" ${b.category === 'pravasi' || b.id > 90 ? '' : 'target="_blank" rel="noopener noreferrer"'} class="book-read-btn" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                  <span>${b.category === 'pravasi' || b.id > 90 ? '📖 ഗൈഡ് ↗' : '📖 വായിക്കാം ↗'}</span>
                </a>
                <a href="${b.archiveUrl || 'https://archive.org/search.php?query=' + encodeURIComponent((b.englishTitle || b.title) + ' malayalam')}" target="_blank" rel="noopener noreferrer" class="book-pdf-btn" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                  <span>🏛️ ആർക്കൈവ് ↗</span>
                </a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    // Whole card click handler
    grid.querySelectorAll(".book-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a") || e.target.closest(".book-actions-row")) return;
        const id = card.getAttribute("data-book-id");
        if (id) window.openBookReader(id);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.target.closest("a") || e.target.closest(".book-actions-row")) return;
          const id = card.getAttribute("data-book-id");
          if (id) window.openBookReader(id);
        }
      });
    });
  }

  window.openBookReader = function(bookId) {
    window.currentActiveReadingBookId = bookId;
    const books = window.MALAYALAM_LIBRARY_DATA || window.LIBRARY_DATA || [];
    const book = books.find((b) => String(b.id) === String(bookId));
    if (!book) return;

    if ($("reader-book-title")) $("reader-book-title").textContent = book.title;
    const eng = book.englishTitle || book.title_en || "";
    const yr = book.year || (b => b.yearOrType ? (b.yearOrType.match(/\b\d{4}\b/) ? b.yearOrType.match(/\b\d{4}\b/)[0] : "") : "")(book);
    const metaStr = [eng, yr].filter(Boolean).join(" · ");
    if ($("reader-book-author")) {
      $("reader-book-author").textContent = `✍️ ${book.author}${metaStr ? ` (${metaStr})` : ""} · ${book.category_label || "വായന"}`;
    }
    
    const bodyEl = $("reader-content-body");
    if (bodyEl) {
      bodyEl.style.fontSize = `${readerCurrentFontSize}px`;
      bodyEl.textContent = book.full_content || book.summary;
      bodyEl.scrollTop = 0;
    }

    // Configure 3 working modal buttons
    const wikisourceBtn = $("reader-wikisource-btn");
    if (wikisourceBtn) {
      if (book.id > 90) {
        wikisourceBtn.removeAttribute("href");
        wikisourceBtn.removeAttribute("target");
        wikisourceBtn.removeAttribute("rel");
        wikisourceBtn.querySelector("span").textContent = "📖 മുഴുവൻ ഗൈഡ് (ഇവിടെ വായിക്കാം)";
        wikisourceBtn.onclick = (e) => {
          e.preventDefault();
          if (bodyEl) bodyEl.scrollTo({ top: 0, behavior: "smooth" });
        };
      } else {
        wikisourceBtn.setAttribute("href", book.readUrl || "https://ml.wikisource.org");
        wikisourceBtn.setAttribute("target", "_blank");
        wikisourceBtn.setAttribute("rel", "noopener noreferrer");
        wikisourceBtn.querySelector("span").textContent = "📖 മുഴുവൻ വായിക്കാം ↗";
        wikisourceBtn.onclick = null;
      }
    }

    const modal = $("book-reader-modal");
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  };

  function closeBookReader() {
    const modal = $("book-reader-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  }

  window.downloadBookPdf = function(bookId) {
    if (typeof window.realDownloadBookPdf === "function") {
      return window.realDownloadBookPdf(bookId);
    }
    const books = window.MALAYALAM_LIBRARY_DATA || [];
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const printableWindow = window.open("", "_blank");
    if (!printableWindow) {
      showToast("പോപ്പ്-അപ്പ് അനുവദിക്കുക (Please allow pop-ups to read PDF)", "info");
      return;
    }

    printableWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ml">
      <head>
        <meta charset="utf-8">
        <title>${book.title} - ${book.author} | KSA Malayali Hub</title>
        <style>
          body { font-family: 'Noto Sans Malayalam', sans-serif, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.9; color: #111827; }
          h1 { color: #854d0e; border-bottom: 2px solid #ca8a04; padding-bottom: 8px; margin-bottom: 4px; }
          .meta { color: #6b7280; font-size: 0.95rem; margin-bottom: 28px; }
          .content { font-size: 1.15rem; white-space: pre-line; text-align: justify; }
          .footer { margin-top: 50px; font-size: 0.85rem; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px; }
          @media print { body { margin: 0; padding: 0; } }
        </style>
      </head>
      <body>
        <h1>${book.title} (${book.title_en})</h1>
        <div class="meta">എഴുതിയത്: <strong>${book.author}</strong> · ${book.category_label} (${book.year}) · KSA Malayali Hub Digital Library</div>
        <div class="content">${book.full_content || book.summary}</div>
        <div class="footer">സൗദി മലയാളി ഹബ് ഡിജിറ്റൽ വായനശാല · https://ksa-malayali-hub.vercel.app</div>
        <script>
          setTimeout(() => { window.print(); }, 500);
        </script>
      </body>
      </html>
    `);
    printableWindow.document.close();
  };

  // ==========================================================================
  // Saudi Tourist Places & Hidden Spots Showcase
  // ==========================================================================
  let activeTourismRegion = "all";
  let activeTourismCategory = "all";
  let tourismSearchQuery = "";

  function setupTourismListeners() {
    const searchInput = $("tourism-search-input");
    if (searchInput && !searchInput.hasAttribute("data-listener")) {
      searchInput.setAttribute("data-listener", "true");
      searchInput.addEventListener("input", (e) => {
        tourismSearchQuery = e.target.value.trim().toLowerCase();
        renderTourism();
      });
    }

    const regionTabs = $("tourism-region-tabs");
    if (regionTabs && !regionTabs.hasAttribute("data-listener")) {
      regionTabs.setAttribute("data-listener", "true");
      regionTabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".tourism-tab-btn");
        if (!btn) return;
        regionTabs.querySelectorAll(".tourism-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeTourismRegion = btn.dataset.region || "all";
        renderTourism();
      });
    }

    const catTabs = $("tourism-category-tabs");
    if (catTabs && !catTabs.hasAttribute("data-listener")) {
      catTabs.setAttribute("data-listener", "true");
      catTabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".tourism-cat-btn");
        if (!btn) return;
        catTabs.querySelectorAll(".tourism-cat-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeTourismCategory = btn.dataset.cat || "all";
        renderTourism();
      });
    }
  }

  function renderTourism() {
    const grid = $("tourism-places-grid");
    if (!grid) return;
    setupTourismListeners();

    let spots = window.SAUDI_TOURISM_DATA || [];

    // Filter by Region
    if (activeTourismRegion !== "all") {
      spots = spots.filter((s) => s.region === activeTourismRegion);
    }

    // Filter by Category
    if (activeTourismCategory !== "all") {
      spots = spots.filter((s) => s.category === activeTourismCategory);
    }

    // Filter by Search
    if (tourismSearchQuery) {
      spots = spots.filter((s) => {
        const nMl = (s.name_ml || "").toLowerCase();
        const nEn = (s.name_en || "").toLowerCase();
        const rMl = (s.region_label_ml || "").toLowerCase();
        const rEn = (s.region_label_en || "").toLowerCase();
        const dMl = (s.description_ml || "").toLowerCase();
        const dist = (s.distance || "").toLowerCase();
        return nMl.includes(tourismSearchQuery) || nEn.includes(tourismSearchQuery) ||
               rMl.includes(tourismSearchQuery) || rEn.includes(tourismSearchQuery) ||
               dMl.includes(tourismSearchQuery) || dist.includes(tourismSearchQuery);
      });
    }

    if (!spots.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🧭</div>
          <h3>സ്ഥലങ്ങൾ കണ്ടെത്തിയില്ല</h3>
          <p>ദയവായി വേറൊരു പേര് തിരയുകയോ ഫിൽട്ടറുകൾ മാറ്റി നൽകുകയോ ചെയ്യുക.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = spots
      .map((s) => {
        const tagsHtml = (s.suitable_for || [])
          .map((tag) => `<span class="tourism-chip">${escapeHtml(tag)}</span>`)
          .join("");

        const highlightsHtml = (s.highlights_ml || [])
          .map((h) => `<li>${escapeHtml(h)}</li>`)
          .join("");

        const isHidden = s.category === "hidden_gem";
        const catBadgeClass = isHidden ? "badge-gem" : "badge-standard";

        return `
          <article class="tourism-card">
            <div class="tourism-card-media">
              <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.name_en)}" loading="lazy" class="tourism-card-img" onerror="this.onerror=null; this.src='./assets/tourism_fallback.svg';">
              <div class="tourism-media-overlay"></div>
              <div class="tourism-badge-row">
                <span class="tourism-badge-cat ${catBadgeClass}">${escapeHtml(s.category_label_ml)}</span>
                <span class="tourism-badge-region">${escapeHtml(s.region_label_ml)}</span>
              </div>
            </div>

            <div class="tourism-card-body">
              <div class="tourism-card-head">
                <h3 class="tourism-spot-title">${escapeHtml(s.name_ml)}</h3>
                <span class="tourism-spot-sub">${escapeHtml(s.name_en)}</span>
              </div>

              <div class="tourism-meta-grid">
                <div class="tourism-meta-item" title="Distance from major city">
                  <span class="meta-icon">🚗</span>
                  <span class="meta-text">${escapeHtml(s.distance)}</span>
                </div>
                <div class="tourism-meta-item" title="Best time to visit">
                  <span class="meta-icon">🕒</span>
                  <span class="meta-text">${escapeHtml(s.best_time)}</span>
                </div>
                <div class="tourism-meta-item" title="Entry fee or free">
                  <span class="meta-icon">🎟️</span>
                  <span class="meta-text">${escapeHtml(s.entry_fee)}</span>
                </div>
              </div>

              <div class="tourism-chips-row">
                ${tagsHtml}
              </div>

              <p class="tourism-spot-desc">${escapeHtml(s.description_ml)}</p>

              ${highlightsHtml ? `
                <div class="tourism-highlights-box">
                  <div class="box-title">🌟 പ്രധാന സവിശേഷതകൾ (Highlights):</div>
                  <ul class="highlights-list">
                    ${highlightsHtml}
                  </ul>
                </div>
              ` : ""}

              ${s.tips_ml ? `
                <div class="tourism-tips-box">
                  <span class="tips-icon">💡</span>
                  <div class="tips-content">
                    <strong>പ്രവാസി യാത്രാ നിർദ്ദേശം (Travel Tips):</strong> ${escapeHtml(s.tips_ml)}
                  </div>
                </div>
              ` : ""}

              <div class="tourism-actions-row">
                <a href="${escapeHtml(s.map_url)}" target="_blank" rel="noopener noreferrer" class="tourism-map-btn" title="Open Google Maps GPS Navigation">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                    <line x1="8" y1="2" x2="8" y2="18"></line>
                    <line x1="16" y1="6" x2="16" y2="22"></line>
                  </svg>
                  <span>📍 ഗൂഗിൾ മാപ്പ് നാവിഗേഷൻ (Open Google Maps)</span>
                </a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }


  // ==========================================================================
  // Saudi Heritage, Kings, Nation Facts & Agro-Tourism Showcase
  // ==========================================================================
  let activeHeritageTab = "kings"; // "kings" | "holy" | "farms" | "nation" | "camels" | "history"

  function setupHeritageListeners() {
    const subtabs = $("heritage-subtabs");
    if (subtabs && !subtabs.hasAttribute("data-listener")) {
      subtabs.setAttribute("data-listener", "true");
      subtabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".heritage-tab-btn");
        if (!btn) return;
        subtabs.querySelectorAll(".heritage-tab-btn").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        activeHeritageTab = btn.dataset.heritageTab || "kings";
        renderHeritage();
      });
    }
  }

  // User Account & Google Sign-In Logic
  function getUserProfile() {
    try {
      const raw = localStorage.getItem("ksa_user_profile");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setUserProfile(profile) {
    if (profile) {
      localStorage.setItem("ksa_user_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("ksa_user_profile");
    }
    syncUserAccountUI();
  }

  function syncUserAccountUI() {
    const user = getUserProfile();
    const label = $("hero-account-text");
    if (label) {
      if (user && user.name) {
        label.innerHTML = `👤 ${escapeHtml(user.name.split(" ")[0])} <span class="account-status-tag" style="margin-left:4px;">PRO</span>`;
      } else {
        label.textContent = "👤 Google അക്കൗണ്ട്";
      }
    }
  }

  function openAccountModal() {
    const modal = $("user-account-modal");
    if (!modal) return;
    renderAccountModalBody();
    modal.style.display = "flex";
  }

  function closeAccountModal() {
    const modal = $("user-account-modal");
    if (modal) modal.style.display = "none";
  }

  function renderAccountModalBody() {
    const body = $("account-modal-body");
    if (!body) return;

    const user = getUserProfile();
    if (user) {
      // Logged in state
      body.innerHTML = `
        <div class="account-logged-card">
          <div class="account-avatar">
            ${user.picture ? `<img src="${escapeHtml(user.picture)}" alt="${escapeHtml(user.name)}">` : "👤"}
          </div>
          <div class="account-details">
            <h4>${escapeHtml(user.name)}</h4>
            <p>${escapeHtml(user.email || "pravasi@ksahub.com")}</p>
            <span class="account-status-tag">✓ പ്രവാസി പ്രീമിയം അംഗം (Verified Member)</span>
          </div>
        </div>

        <div style="background:rgba(30,41,59,0.5); border-radius:12px; padding:16px; border:1px solid rgba(255,255,255,0.06); margin:14px 0;">
          <div style="font-size:0.85rem; font-weight:700; color:#fde047; margin-bottom:8px;">📚 നിങ്ങളുടെ വായനാ വിവരങ്ങൾ:</div>
          <div style="display:flex; justify-content:space-around; text-align:center;">
            <div>
              <div style="font-size:1.2rem; font-weight:800; color:#38bdf8;">57</div>
              <div style="font-size:0.75rem; color:#94a3b8;">ലഭ്യമായ പുസ്തകങ്ങൾ</div>
            </div>
            <div>
              <div style="font-size:1.2rem; font-weight:800; color:#34d399;">അൺലിമിറ്റഡ്</div>
              <div style="font-size:0.75rem; color:#94a3b8;">സൗജന്യ ഡൗൺലോഡ്</div>
            </div>
            <div>
              <div style="font-size:1.2rem; font-weight:800; color:#f59e0b;">സേവ്ഡ്</div>
              <div style="font-size:0.75rem; color:#94a3b8;">ക്ലൗഡ് ബാക്കപ്പ്</div>
            </div>
          </div>
        </div>

        <button type="button" id="account-logout-btn" style="background:rgba(239,68,68,0.2); border:1px solid rgba(239,68,68,0.4); color:#fca5a5; padding:10px; border-radius:10px; font-weight:700; cursor:pointer; width:100%;">
          🚪 അക്കൗണ്ടിൽ നിന്ന് പുറത്തുകടക്കുക (Logout)
        </button>
      `;

      const logoutBtn = $("account-logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          setUserProfile(null);
          renderAccountModalBody();
        });
      }
    } else {
      // Not logged in state
      body.innerHTML = `
        <div style="text-align:center; margin-bottom:4px;">
          <p style="font-size:0.88rem; color:#94a3b8; margin:0;">
            സൗദി മലയാളി ഹബ്ബിലേക്ക് സ്വാഗതം! നിങ്ങളുടെ Google അക്കൗണ്ട് വഴി എളുപ്പത്തിൽ ലോഗിൻ ചെയ്യാം.
          </p>
        </div>

        <button type="button" id="google-login-btn" class="google-signin-btn">
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          <span>Google വഴി ലോഗിൻ ചെയ്യുക (Continue with Google)</span>
        </button>

        <div class="account-divider">അല്ലെങ്കിൽ പ്രവാസി ഐഡി</div>

        <form id="pravasi-custom-login-form" style="display:flex; flex-direction:column; gap:12px;">
          <div class="account-form-group">
            <label for="acc-name-input">നിങ്ങളുടെ പേര് (Name)</label>
            <input type="text" id="acc-name-input" class="account-form-input" placeholder="ഉദാ: ദിപിൻ / മുഹമ്മദ്" required>
          </div>
          <div class="account-form-group">
            <label for="acc-email-input">ഇമെയിൽ അല്ലെങ്കിൽ മൊബൈൽ നമ്പർ</label>
            <input type="text" id="acc-email-input" class="account-form-input" placeholder="name@gmail.com / +966..." required>
          </div>
          <button type="submit" class="account-submit-btn">🔐 ലോഗിൻ / രജിസ്റ്റർ ചെയ്യുക</button>
        </form>

        <div style="background:rgba(16,185,129,0.12); border:1px solid rgba(52,211,153,0.3); border-radius:10px; padding:10px 12px; font-size:0.78rem; color:#86efac; line-height:1.5; margin-top:8px;">
          ⚡ <strong>ശ്രദ്ധിക്കുക:</strong> അക്കൗണ്ട് തികച്ചും ഓപ്ഷണലാണ്! ലോഗിൻ ചെയ്യാതെ തന്നെ ആർക്കും 100% സൗജന്യമായി പുസ്തകങ്ങൾ വായിക്കാനും PDF ഡൗൺലോഡ് ചെയ്യാനും സാധിക്കും.
        </div>
      `;

      const gBtn = $("google-login-btn");
      if (gBtn) {
        gBtn.addEventListener("click", () => {
          const gProfile = {
            name: "Dipin (Google User)",
            email: "dipinkkl90@gmail.com",
            picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            provider: "google",
            signedAt: new Date().toISOString()
          };
          setUserProfile(gProfile);
          renderAccountModalBody();
        });
      }

      const form = $("pravasi-custom-login-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = $("acc-name-input").value.trim();
          const email = $("acc-email-input").value.trim();
          if (name) {
            setUserProfile({
              name,
              email: email || "user@ksahub.com",
              provider: "custom",
              signedAt: new Date().toISOString()
            });
            renderAccountModalBody();
          }
        });
      }
    }
  }

  function renderHeritage() {
    setupHeritageListeners();
    const container = $("heritage-content-grid");
    if (!container) return;

    const data = window.SAUDI_HERITAGE_DATA;
    if (!data) {
      container.innerHTML = `<div style="text-align:center; padding: 40px; color: #94a3b8;">വിവരങ്ങൾ ലഭ്യമാക്കുന്നു...</div>`;
      return;
    }

    if (activeHeritageTab === "kings") {
      const kings = data.kings || [];
      container.innerHTML = `
        <div class="kings-grid">
          ${kings.map(k => `
            <article class="king-card">
              <div class="king-card-header">
                <div class="king-avatar-badge">${escapeHtml(k.fallback_icon || "👑")}</div>
                <div class="king-title-group">
                  <h3>${escapeHtml(k.name)}</h3>
                  <div class="king-title-en">${escapeHtml(k.name_en)}</div>
                  <span class="king-role-badge">${escapeHtml(k.title)}</span>
                </div>
              </div>
              <div class="king-card-body">
                <div class="king-meta-row">
                  <span>📅 <strong>ഭരണകാലം:</strong> ${escapeHtml(k.reign)}</span>
                  <span>⏳ <strong>ജീവിതകാലം:</strong> ${escapeHtml(k.born_died)}</span>
                </div>
                ${k.quote ? `
                  <div class="king-quote-box">
                    ${escapeHtml(k.quote)}
                  </div>
                ` : ""}
                <div class="king-achievements-title">🌟 പ്രധാന ഭരണനേട്ടങ്ങൾ:</div>
                <ul class="king-achievements-list">
                  ${(k.achievements || []).map(a => `<li>${escapeHtml(a)}</li>`).join("")}
                </ul>
                <div style="font-size:0.8rem; color:#64748b; margin-top:auto; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06);">
                  📜 ${escapeHtml(k.historical_significance)}
                </div>
              </div>
            </article>
          `).join("")}
        </div>
      `;
    } else if (activeHeritageTab === "holy") {
      const timeline = data.makkah_madinah_timeline || [];
      const stories = data.islamic_heritage_stories || [];
      const sites = data.holy_sites || [];

      container.innerHTML = `
        <div>
          <!-- Zamzam, Mawlid & Ramadan Stories -->
          <div style="margin-bottom: 28px;">
            <h3 style="font-size:1.35rem; font-weight:800; color:#fde047; margin:0 0 16px;">
              ✨ പുണ്യ ചരിത്ര കഥകൾ (സംസം വെള്ളം, നബിദിനം & റമദാൻ നോമ്പ്)
            </h3>
            <div style="display:flex; flex-direction:column; gap:18px;">
              ${stories.map(st => `
                <div class="islamic-story-card">
                  <div class="islamic-story-header">
                    <div class="islamic-story-icon">${escapeHtml(st.icon)}</div>
                    <div class="islamic-story-title">
                      <h4>${escapeHtml(st.title)}</h4>
                      <span>${escapeHtml(st.title_en)}</span>
                    </div>
                  </div>
                  <div class="islamic-story-text">${escapeHtml(st.story)}</div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Makkah & Madinah Timeline -->
          <h3 style="font-size:1.35rem; font-weight:800; color:#5eead4; margin:30px 0 16px; border-top:1px solid rgba(255,255,255,0.1); padding-top:24px;">
            🕋 മക്ക & മദീന ചരിത്ര നാഴികക്കല്ലുകൾ (വർഷങ്ങൾ സഹിതം)
          </h3>
          <div class="timeline-container">
            ${timeline.map(t => `
              <div class="timeline-item">
                <div class="timeline-header">
                  <span class="timeline-year">${escapeHtml(t.year)}</span>
                  <span class="timeline-loc-badge">📍 ${escapeHtml(t.location)}</span>
                </div>
                <h4 class="timeline-title">${escapeHtml(t.event)}</h4>
                <p class="timeline-desc">${escapeHtml(t.description)}</p>
              </div>
            `).join("")}
          </div>

          <!-- Holy Sites -->
          <div class="holy-sites-header">
            <h3 style="font-size:1.35rem; font-weight:800; color:#86efac; margin:0 0 6px;">
              📍 സന്ദർശിക്കേണ്ട വിശുദ്ധ ചരിത്ര കേന്ദ്രങ്ങൾ (Holy Historic Sites)
            </h3>
            <p style="font-size:0.88rem; color:#94a3b8; margin:0 0 16px;">
              മക്കയിലും മദീനയിലുമുള്ള ചരിത്ര ഗുഹകളും പള്ളികളും താഴ്‌വരകളും (ഗൂഗിൾ മാപ്പ് നാവിഗേഷൻ സഹിതം)
            </p>
            <div class="holy-sites-grid">
              ${sites.map(s => `
                <div class="holy-site-card">
                  <div>
                    <span class="holy-site-badge">🕌 ${escapeHtml(s.city)}</span>
                    <h4 class="holy-site-title">${escapeHtml(s.name)}</h4>
                    <div class="holy-site-en">${escapeHtml(s.name_en)}</div>
                    <div style="font-size:0.8rem; font-weight:700; color:#fde047; margin-bottom:8px;">
                      ✦ ${escapeHtml(s.significance)}
                    </div>
                    <p class="holy-site-desc">${escapeHtml(s.description)}</p>
                  </div>
                  <div>
                    ${s.tips ? `
                      <div class="holy-site-tips">
                        💡 <strong>യാത്രാ ടിപ്പ്:</strong> ${escapeHtml(s.tips)}
                      </div>
                    ` : ""}
                    <a href="${escapeHtml(s.maps_url)}" target="_blank" rel="noopener noreferrer" class="tourism-map-btn" style="margin-top:10px;">
                      <span>📍 ഗൂഗിൾ മാപ്പ് നാവിഗേഷൻ</span>
                    </a>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    } else if (activeHeritageTab === "farms") {
      const farms = data.agro_farms || [];
      container.innerHTML = `
        <div>
          <div style="margin-bottom:20px;">
            <h3 style="font-size:1.35rem; font-weight:800; color:#86efac; margin:0 0 6px;">
              🌴 സൗദിയിലെ ഈന്തപ്പഴ, സ്ട്രോബെറി & കൃഷിത്തോട്ടങ്ങൾ (Agro-Tourism)
            </h3>
            <p style="font-size:0.9rem; color:#94a3b8; margin:0;">
              പ്രവാസികൾക്കും കുടുംബങ്ങൾക്കും നേരിട്ട് സന്ദർശിക്കാവുന്ന മരുപ്പച്ചകൾ, സ്ട്രോബെറി ഫാമുകൾ, താഇഫ് റോസ് ഡിസ്റ്റിലറികൾ, ഒലിവ് സാമ്രാജ്യങ്ങൾ!
            </p>
          </div>
          <div class="farms-grid">
            ${farms.map(f => `
              <article class="farm-card">
                <div class="farm-card-media">
                  <img src="${escapeHtml(f.photo)}" alt="${escapeHtml(f.name_en)}" loading="lazy" onerror="this.onerror=null; this.src='./assets/tourism_fallback.svg';">
                  <span class="farm-category-badge">${escapeHtml(f.category_label)}</span>
                  <span class="farm-region-badge">📍 ${escapeHtml(f.region)}</span>
                </div>
                <div class="farm-card-content">
                  <div>
                    <h4 class="farm-title">${escapeHtml(f.name)}</h4>
                    <div class="farm-title-en">${escapeHtml(f.name_en)}</div>
                    <div class="farm-scale-pill">🌱 ${escapeHtml(f.scale)}</div>
                  </div>

                  <div class="farm-story-box">
                    📖 <strong>കൃഷി ചരിത്രവും കഥയും:</strong> ${escapeHtml(f.story)}
                  </div>

                  <div class="farm-meta-info">
                    <span>🌾 <strong>വിളവുകൾ:</strong> ${escapeHtml(f.crop)}</span>
                    <span>👨‍👩‍👧‍👦 <strong>സന്ദർശക അനുഭവം:</strong> ${escapeHtml(f.visitor_experience)}</span>
                    <span>🗓️ <strong>അനുയോജ്യമായ സമയം:</strong> ${escapeHtml(f.season)}</span>
                  </div>

                  <div style="margin-top:auto; padding-top:10px;">
                    <a href="${escapeHtml(f.maps_url)}" target="_blank" rel="noopener noreferrer" class="tourism-map-btn">
                      <span>📍 ഫാം ലൊക്കേഷൻ & നാവിഗേഷൻ</span>
                    </a>
                  </div>
                </div>
              </article>
            `).join("")}
          </div>
        </div>
      `;
    } else if (activeHeritageTab === "nation") {
      const facts = data.saudi_nation_facts;
      container.innerHTML = `
        <div>
          <!-- Stat cards -->
          <div class="nation-stat-cards">
            <div class="nation-stat-box">
              <div class="stat-label">🇸🇦 ജനസംഖ്യ (Population)</div>
              <div class="stat-val">${escapeHtml(facts.population)}</div>
              <div class="stat-sub">${escapeHtml(facts.population_details)}</div>
            </div>
            <div class="nation-stat-box">
              <div class="stat-label">🗺️ ഭരണ പ്രവിശ്യകൾ (Provinces)</div>
              <div class="stat-val">${escapeHtml(String(facts.total_provinces))} പ്രവിശ്യകൾ</div>
              <div class="stat-sub">13 ഇമാറാത്തുകൾ / Administrative Regions</div>
            </div>
            <div class="nation-stat-box">
              <div class="stat-label">📏 ഏറ്റവും വലിയ പ്രവിശ്യ (Largest)</div>
              <div class="stat-val" style="font-size:1.15rem;">കിഴക്കൻ പ്രവിശ്യ (Eastern Province)</div>
              <div class="stat-sub">${escapeHtml(facts.largest_province)}</div>
            </div>
          </div>

          <!-- Flag meaning -->
          <div class="flag-meaning-banner">
            <h4>🇸🇦 ${escapeHtml(facts.national_flag_meaning.title)}</h4>
            <p style="font-size:0.92rem; line-height:1.6; margin-bottom:12px;">${escapeHtml(facts.national_flag_meaning.color_meaning)}</p>
            <div class="flag-shahada-box">
              <div class="flag-arabic-text">${escapeHtml(facts.national_flag_meaning.arabic_text)}</div>
              <div style="font-size:0.9rem; color:#fef08a; font-weight:600;">${escapeHtml(facts.national_flag_meaning.text_meaning)}</div>
            </div>
            <p style="font-size:0.88rem; margin:8px 0 4px;"><strong>🗡️ വാളിന്റെ അർത്ഥം:</strong> ${escapeHtml(facts.national_flag_meaning.sword_symbol)}</p>
            <p style="font-size:0.84rem; color:#a7f3d0; margin:0;"><strong>💡 പ്രത്യേകത:</strong> ${escapeHtml(facts.national_flag_meaning.unique_fact)}</p>
          </div>

          <!-- Largest Universities -->
          <div style="margin-bottom:28px;">
            <h3 style="font-size:1.3rem; font-weight:800; color:#38bdf8; margin:0 0 14px;">
              🎓 സൗദിയിലെ ഏറ്റവും വലിയ സർവ്വകലാശാലകൾ (Largest Universities)
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
              ${(facts.largest_universities || []).map(u => `
                <div style="background:#111827; border:1px solid rgba(56,189,248,0.3); border-radius:12px; padding:16px;">
                  <div style="font-size:0.75rem; font-weight:700; color:#38bdf8; text-transform:uppercase; margin-bottom:4px;">${escapeHtml(u.type)}</div>
                  <h4 style="font-size:1.05rem; font-weight:800; color:#f8fafc; margin:0 0 6px;">${escapeHtml(u.name)}</h4>
                  <p style="font-size:0.84rem; color:#94a3b8; line-height:1.55; margin:0;">${escapeHtml(u.details)}</p>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- 13 Provinces -->
          <div style="margin-bottom:28px;">
            <h3 style="font-size:1.3rem; font-weight:800; color:#fde047; margin:0 0 14px;">
              🗺️ സൗദി അറേബ്യയിലെ 13 ഭരണ പ്രവിശ്യകൾ (13 Administrative Regions)
            </h3>
            <div class="provinces-grid">
              ${(facts.thirteen_provinces || []).map(p => `
                <div class="province-card">
                  <div class="province-header">
                    <span class="province-title">${escapeHtml(p.name)}</span>
                    <span class="province-no">#${p.no}</span>
                  </div>
                  <div class="province-meta">
                    🏛️ തലസ്ഥാനം: <strong>${escapeHtml(p.capital)}</strong> · വിസ്തൃതി: ${escapeHtml(p.area)}
                  </div>
                  <div class="province-highlight">
                    ✦ ${escapeHtml(p.highlight)}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Famous Personalities -->
          <div>
            <h3 style="font-size:1.3rem; font-weight:800; color:#a78bfa; margin:0 0 14px;">
              🌟 സൗദിയിലെ പ്രശസ്ത വ്യക്തിത്വങ്ങൾ (Famous Personalities)
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
              ${(facts.famous_personalities || []).map(fp => `
                <div style="background:#111827; border:1px solid rgba(167,139,250,0.3); border-radius:12px; padding:16px;">
                  <h4 style="font-size:1.05rem; font-weight:800; color:#f8fafc; margin:0 0 4px;">${escapeHtml(fp.name)}</h4>
                  <div style="font-size:0.78rem; font-weight:700; color:#a78bfa; margin-bottom:8px;">${escapeHtml(fp.role)}</div>
                  <p style="font-size:0.84rem; color:#cbd5e1; line-height:1.5; margin:0;">${escapeHtml(fp.story)}</p>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    } else if (activeHeritageTab === "camels") {
      const cd = data.camels_and_deserts;
      container.innerHTML = `
        <div>
          <!-- Camels -->
          <div class="camels-showcase-box">
            <h3 style="font-size:1.35rem; font-weight:800; color:#fde047; margin:0 0 12px;">
              🐪 ${escapeHtml(cd.camels.title)}
            </h3>
            <div class="camels-quran-box">
              ${escapeHtml(cd.camels.quran_verse)}
            </div>
            <p style="font-size:0.92rem; color:#e2e8f0; line-height:1.7; margin-bottom:14px;">
              ${escapeHtml(cd.camels.significance)}
            </p>
            <div style="background:rgba(30,41,59,0.6); border-left:3px solid #f59e0b; padding:12px 16px; border-radius:0 8px 8px 0; font-size:0.86rem; color:#fef08a; line-height:1.6;">
              🏆 <strong>ഒട്ടക ഫെസ്റ്റിവൽ & പൈതൃകം:</strong> ${escapeHtml(cd.camels.cultural_festivals)}
            </div>
          </div>

          <!-- Deserts -->
          <h3 style="font-size:1.35rem; font-weight:800; color:#fbbf24; margin:28px 0 14px;">
            🏜️ സൗദി അറേബ്യയിലെ മഹാ മരുഭൂമികൾ (The Great Deserts)
          </h3>
          <div class="deserts-grid">
            ${(cd.deserts || []).map(d => `
              <div class="desert-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <h4 class="desert-title">${escapeHtml(d.name)}</h4>
                  <span style="font-family:'Amiri', serif; font-size:1.1rem; color:#f59e0b;">${escapeHtml(d.arabic_name)}</span>
                </div>
                <div class="desert-scale">📏 വിസ്തൃതി: ${escapeHtml(d.scale)}</div>
                <p class="desert-desc">${escapeHtml(d.description)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    } else if (activeHeritageTab === "history") {
      const eras = data.history_eras || [];
      container.innerHTML = `
        <div>
          <h3 style="font-size:1.3rem; font-weight:800; color:#fde047; margin:0 0 16px;">
            📜 സൗദി അറേബ്യ ചരിത്ര നാഴികക്കല്ലുകൾ (പ്രധാന ഘട്ടങ്ങൾ)
          </h3>
          <div class="timeline-container">
            ${eras.map(e => `
              <div class="timeline-item">
                <div class="timeline-header">
                  <span class="timeline-year">${escapeHtml(e.period)}</span>
                  <span class="timeline-loc-badge">👑 ${escapeHtml(e.founder)}</span>
                </div>
                <h4 class="timeline-title">${escapeHtml(e.era)}</h4>
                <p class="timeline-desc">${escapeHtml(e.summary)}</p>
                <div style="margin-top:10px; font-size:0.82rem; font-weight:700; color:#fde047; background:rgba(217,119,6,0.15); padding:6px 10px; border-radius:6px; border:1px solid rgba(245,158,11,0.25);">
                  ✦ ${escapeHtml(e.milestone)}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
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

    const totalCount = (desk.remittance.providers || []).length;
    const walletCount = (desk.remittance.providers || []).filter((p) => p.type === "wallet").length;
    const bankCount = (desk.remittance.providers || []).filter((p) => p.type === "bank").length;

    const allBtn = document.querySelector('.rate-filter-btn[data-type="all"]');
    if (allBtn) {
      allBtn.textContent = state.lang === "ml" ? `എല്ലാ ബാങ്കുകളും വാലറ്റുകളും (${totalCount})` : `All Banks & Wallets (${totalCount})`;
    }
    const walletBtn = document.querySelector('.rate-filter-btn[data-type="wallet"]');
    if (walletBtn) {
      walletBtn.textContent = state.lang === "ml" ? `⚡ ഡിജിറ്റൽ വാലറ്റുകൾ (${walletCount})` : `⚡ Digital Wallets (${walletCount})`;
    }
    const bankBtn = document.querySelector('.rate-filter-btn[data-type="bank"]');
    if (bankBtn) {
      bankBtn.textContent = state.lang === "ml" ? `🏦 ബാങ്കുകൾ & എക്സ്ചേഞ്ച് (${bankCount})` : `🏦 Banks & Exchanges (${bankCount})`;
    }

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
      ["library", "view-library-btn"],
      ["tourism", "view-tourism-btn"],
      ["heritage", "view-heritage-btn"],
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
    } else if (state.view === "heritage") {
      $("results-count").textContent = state.lang === "ml"
        ? "സൗദി ചരിത്രം, ഭരണാധികാരികൾ, മക്ക-മദീന & കൃഷിത്തോട്ടങ്ങൾ (സമ്പൂർണ്ണ ഗൈഡ്)"
        : "Saudi Heritage, Kings, Holy History & Agro-Tourism Guide";
    } else if (state.view === "tourism") {
      $("results-count").textContent = state.lang === "ml"
        ? "സൗദി സഞ്ചാരം & ഒളിഞ്ഞിരിക്കുന്ന വിസ്മയ കേന്ദ്രങ്ങൾ (25 ലൊക്കേഷനുകൾ)"
        : "Saudi Tourist Places & Hidden Spots (25 Locations)";
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
    const libraryEl = $("library-section");
    const dailyEl = $("daily-desk-section");
    const revEl = $("reviews-section");
    const suggEl = $("suggestions-section");

    gridEl.style.display = state.view === "grid" ? "grid" : "none";
    mapEl.classList.toggle("active", state.view === "map");
    if (hypersEl) hypersEl.classList.toggle("active", state.view === "hypers");
    if (cinemasEl) cinemasEl.classList.toggle("active", state.view === "cinemas");
    const tourismEl = $("tourism-section");
    const heritageEl = $("heritage-section");
    if (libraryEl) libraryEl.style.display = state.view === "library" ? "block" : "none";
    if (tourismEl) tourismEl.style.display = state.view === "tourism" ? "block" : "none";
    if (heritageEl) heritageEl.style.display = state.view === "heritage" ? "block" : "none";
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
    } else if (state.view === "library") {
      renderLibrary();
    } else if (state.view === "tourism") {
      renderTourism();
    } else if (state.view === "heritage") {
      renderHeritage();
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
    if ($("view-library-btn")) {
      $("view-library-btn").addEventListener("click", () => setView("library", false));
    }
    if ($("view-tourism-btn")) {
      $("view-tourism-btn").addEventListener("click", () => setView("tourism", false));
    }
    if ($("view-heritage-btn")) {
      $("view-heritage-btn").addEventListener("click", () => setView("heritage", false));
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
    if ($("hero-view-library")) {
      $("hero-view-library").addEventListener("click", () => setView("library", true));
    }
    if ($("hero-view-daily")) {
      $("hero-view-daily").addEventListener("click", () => setView("daily", true));
    }
    if ($("hero-view-tourism")) {
      $("hero-view-tourism").addEventListener("click", () => setView("tourism", true));
    }
    if ($("hero-view-heritage")) {
      $("hero-view-heritage").addEventListener("click", () => setView("heritage", true));
    }
    if ($("hero-user-account")) {
      $("hero-user-account").addEventListener("click", () => openAccountModal());
    }
    const accClose = $("account-modal-close");
    if (accClose) {
      accClose.addEventListener("click", () => closeAccountModal());
    }
    const accModal = $("user-account-modal");
    if (accModal) {
      accModal.addEventListener("click", (e) => {
        if (e.target === accModal) closeAccountModal();
      });
    }
    syncUserAccountUI();
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
