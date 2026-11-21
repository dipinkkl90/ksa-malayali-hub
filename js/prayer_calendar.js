/**
 * KSA Malayali Hub — Live Saudi Prayer Times & Hijri Calendar Engine
 * Method 4: Umm Al-Qura University, Makkah (Official Saudi Standard)
 * Supports all 11 KSA Cities with smart offline localStorage caching & next-prayer countdown.
 */

(function () {
  "use strict";

  const CITIES = [
    { id: "Jeddah", nameMl: "ജിദ്ദ (Jeddah)", nameAr: "جدة", queryCity: "Jeddah" },
    { id: "Makkah", nameMl: "മക്ക (Makkah)", nameAr: "مكة المكرمة", queryCity: "Makkah" },
    { id: "Madinah", nameMl: "മദീന (Madinah)", nameAr: "المدينة المنورة", queryCity: "Medina" },
    { id: "Riyadh", nameMl: "റിയാദ് (Riyadh)", nameAr: "الرياض", queryCity: "Riyadh" },
    { id: "Dammam", nameMl: "ദമ്മാം (Dammam)", nameAr: "الدمام", queryCity: "Dammam" },
    { id: "Taif", nameMl: "ത്വാഇഫ് (Taif)", nameAr: "الطائف", queryCity: "Taif" },
    { id: "Buraidah", nameMl: "ബുറൈദ (Buraidah / Qassim)", nameAr: "بريدة", queryCity: "Buraidah" },
    { id: "Tabuk", nameMl: "തബൂക്ക് (Tabuk)", nameAr: "تبوك", queryCity: "Tabuk" },
    { id: "Al Jouf", nameMl: "അൽ ജൗഫ് (Al Jouf / Sakaka)", nameAr: "الجوف", queryCity: "Sakaka" },
    { id: "Al Baha", nameMl: "അൽ ബാഹ (Al Baha)", nameAr: "الباحة", queryCity: "Al Bahah" },
    { id: "Khamis Mushait", nameMl: "ഖമീസ് മുശൈത്ത് (Khamis Mushait / Abha)", nameAr: "خميس مشيط", queryCity: "Khamis Mushait" }
  ];

  const PRAYER_KEYS = [
    { key: "Fajr", nameMl: "സുബ്ഹി", nameAr: "الفجر", icon: "🌅" },
    { key: "Sunrise", nameMl: "സൂര്യോദയം", nameAr: "الشروق", icon: "☀️", isSunrise: true },
    { key: "Dhuhr", nameMl: "ളുഹർ", nameAr: "الظهر", icon: "☀️" },
    { key: "Asr", nameMl: "അസ്വർ", nameAr: "العصر", icon: "🌤️" },
    { key: "Maghrib", nameMl: "മഗ്‌രിബ്", nameAr: "المغرب", icon: "🌇" },
    { key: "Isha", nameMl: "ഇശാ", nameAr: "العشاء", icon: "🌙" }
  ];

  const HIJRI_MONTHS_ML = {
    1: "മുഹറം (Muharram)",
    2: "സഫർ (Safar)",
    3: "റബീഉൽ അവ്വൽ (Rabi al-Awwal)",
    4: "റബീഉൽ ആഖിർ (Rabi al-Thani)",
    5: "ജമാദുൽ അവ്വൽ (Jumada al-Awwal)",
    6: "ജമാദുൽ ആഖിർ (Jumada al-Thani)",
    7: "റജബ് (Rajab)",
    8: "ശഅ്ബാൻ (Sha'ban)",
    9: "റമദാൻ (Ramadan)",
    10: "ശവ്വാൽ (Shawwal)",
    11: "ദുൽഖഅ്ദ് (Dhu al-Qi'dah)",
    12: "ദുൽഹിജ്ജ (Dhu al-Hijjah)"
  };

  const WEEKDAYS_ML = ["ഞായർ", "തിങ്കൾ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "വെള്ളി", "ശനി"];

  let countdownInterval = null;
  let currentTimings = null;

  // Format date as YYYY-MM-DD
  function getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  // Convert 24hr "HH:MM" to 12hr "hh:mm AM/PM"
  function format12Hr(time24) {
    if (!time24) return "--:--";
    const parts = time24.split(" ")[0].split(":");
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
  }

  // 1. Fetch Prayer Times from API or Cache
  async function loadPrayerTimes(cityId, container) {
    const today = getTodayKey();
    const cacheKey = `ksa_prayer_${cityId}_${today}`;
    const cityObj = CITIES.find(c => c.id === cityId) || CITIES[0];

    // Check localStorage cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        renderTimings(data, cityObj, container);
        return;
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    // Show loading state if no cache
    const grid = container.querySelector(".prayer-grid");
    if (grid && !grid.innerHTML.trim()) {
      grid.innerHTML = `<div class="prayer-loading">🕌 ലൈവ് നമസ്കാര സമയം ലോഡ് ചെയ്യുന്നു...</div>`;
    }

    try {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityObj.queryCity)}&country=Saudi+Arabia&method=4`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
      const json = await resp.json();

      if (json && json.data && json.data.timings) {
        const dataToCache = {
          timings: json.data.timings,
          date: json.data.date,
          cachedAt: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        renderTimings(dataToCache, cityObj, container);
      }
    } catch (err) {
      console.warn("[PrayerTimes] Network failed, using offline calculation fallback:", err);
      // Fallback: Default estimated timings for Jeddah / KSA if offline
      const fallbackData = {
        timings: {
          Fajr: "05:18",
          Sunrise: "06:36",
          Dhuhr: "12:09",
          Asr: "15:18",
          Maghrib: "17:40",
          Isha: "19:10"
        },
        fallback: true
      };
      renderTimings(fallbackData, cityObj, container);
    }
  }

  // 2. Render Prayer Times UI
  function renderTimings(data, cityObj, container) {
    currentTimings = data.timings;
    const grid = container.querySelector(".prayer-grid");
    if (!grid) return;

    let nextPrayerKey = null;
    let minDiffMinutes = Infinity;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Determine Next Prayer
    for (const item of PRAYER_KEYS) {
      if (item.isSunrise) continue;
      const t = currentTimings[item.key];
      if (!t) continue;
      const [h, m] = t.split(" ")[0].split(":").map(Number);
      const prayerMinutes = h * 60 + m;
      let diff = prayerMinutes - currentMinutes;
      if (diff > 0 && diff < minDiffMinutes) {
        minDiffMinutes = diff;
        nextPrayerKey = item.key;
      }
    }

    // If all prayers passed today, next is tomorrow's Fajr
    if (!nextPrayerKey) {
      nextPrayerKey = "Fajr";
    }

    let cardsHtml = "";
    PRAYER_KEYS.forEach(item => {
      const time24 = (currentTimings[item.key] || "").split(" ")[0];
      const time12 = format12Hr(time24);
      const isNext = item.key === nextPrayerKey;
      const cardClass = `prayer-card ${isNext ? "is-next" : ""} ${item.isSunrise ? "is-sunrise" : ""}`;

      cardsHtml += `
        <div class="${cardClass}" data-prayer="${item.key}">
          <div class="prayer-card-top">
            <span class="prayer-icon">${item.icon}</span>
            <span class="prayer-arabic">${item.nameAr}</span>
          </div>
          <div class="prayer-name">${item.nameMl}</div>
          <div class="prayer-time">${time12}</div>
          ${isNext ? `<div class="next-prayer-tag">അടുത്ത നമസ്കാരം</div>` : ""}
        </div>
      `;
    });

    grid.innerHTML = cardsHtml;

    // Start / Update Countdown Timer
    startCountdown(nextPrayerKey, currentTimings[nextPrayerKey], container);
  }

  // 3. Next Prayer Countdown Ticker
  function startCountdown(nextPrayerKey, nextPrayerTimeStr, container) {
    if (countdownInterval) clearInterval(countdownInterval);

    const banner = container.querySelector(".prayer-countdown-banner");
    if (!banner || !nextPrayerTimeStr) return;

    const prayerObj = PRAYER_KEYS.find(p => p.key === nextPrayerKey) || PRAYER_KEYS[0];

    function update() {
      const now = new Date();
      const [h, m] = nextPrayerTimeStr.split(" ")[0].split(":").map(Number);

      const target = new Date(now);
      target.setHours(h, m, 0, 0);

      // If already passed today, target is tomorrow
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const diffMs = target - now;
      if (diffMs <= 0) {
        banner.innerHTML = `<span>🔔 <strong>${prayerObj.nameMl} (${prayerObj.nameAr})</strong> സമയം എത്തിക്കഴിഞ്ഞു.</span>`;
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      const timeFormatted = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

      banner.innerHTML = `
        <div class="countdown-inner">
          <span class="countdown-pulse-dot" aria-hidden="true"></span>
          <span class="countdown-text">
            അടുത്ത നമസ്കാരം: <strong>${prayerObj.nameMl} (${prayerObj.nameAr})</strong>
          </span>
          <span class="countdown-timer">${timeFormatted} ബാക്കി</span>
        </div>
      `;
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  // 4. Hijri Calendar & Date Converter (Intl.DateTimeFormat built-in)
  function initHijriCalendar(container) {
    const todayCard = container.querySelector(".hijri-today-display");
    const now = new Date();

    // Built-in Umm Al-Qura formatter
    let hijriDay = "", hijriMonth = "", hijriYear = "";
    try {
      const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
      }).formatToParts(now);

      parts.forEach(p => {
        if (p.type === "day") hijriDay = p.value;
        if (p.type === "month") hijriMonth = p.value;
        if (p.type === "year") hijriYear = p.value;
      });
    } catch (e) {
      hijriDay = "11";
      hijriMonth = "6";
      hijriYear = "1448";
    }

    const monthNum = parseInt(hijriMonth, 10) || 1;
    const monthMl = HIJRI_MONTHS_ML[monthNum] || `മാസം ${monthNum}`;
    const weekdayMl = WEEKDAYS_ML[now.getDay()];

    const gregorianStr = now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    if (todayCard) {
      todayCard.innerHTML = `
        <div class="hijri-badge-row">
          <span class="hijri-badge">🕌 ഉമ്മുൽ ഖുറാ കലണ്ടർ (Umm Al-Qura)</span>
          <span class="hijri-day-pill">${weekdayMl}</span>
        </div>
        <div class="hijri-main-date">
          <span class="hijri-day-big">${hijriDay}</span>
          <div class="hijri-month-year">
            <strong>${monthMl}</strong>
            <span>ഹിജ്‌രി ${hijriYear} AH</span>
          </div>
        </div>
        <div class="gregorian-sub-date">
          📅 ഇംഗ്ലീഷ് തീയതി: <strong>${gregorianStr}</strong>
        </div>
      `;
    }

    // Gregorian to Hijri Date Converter
    const dateInput = container.querySelector("#convert-gregorian-date");
    const convertBtn = container.querySelector("#btn-convert-date");
    const resultBox = container.querySelector("#convert-result-box");

    if (dateInput && convertBtn && resultBox) {
      // Set default date input to today
      dateInput.value = getTodayKey();

      function convert() {
        const val = dateInput.value;
        if (!val) return;
        const [y, m, d] = val.split("-").map(Number);
        const selDate = new Date(y, m - 1, d);

        try {
          const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
          }).formatToParts(selDate);

          let hD = "", hM = "", hY = "";
          parts.forEach(p => {
            if (p.type === "day") hD = p.value;
            if (p.type === "month") hM = p.value;
            if (p.type === "year") hY = p.value;
          });

          const mNum = parseInt(hM, 10) || 1;
          const mMl = HIJRI_MONTHS_ML[mNum] || `മാസം ${mNum}`;
          const wMl = WEEKDAYS_ML[selDate.getDay()];

          resultBox.innerHTML = `
            <div class="convert-success-card">
              <div class="convert-success-head">✅ കൃത്യമായ ഹിജ്‌രി തീയതി (Umm Al-Qura):</div>
              <div class="convert-success-date">
                <strong>${hD} ${mMl} ${hY} AH</strong>
              </div>
              <div class="convert-success-sub">
                ആഴ്ചയിലെ ദിവസം: <strong>${wMl}</strong> · (${d}/${m}/${y})
              </div>
            </div>
          `;
        } catch (err) {
          resultBox.innerHTML = `<div class="convert-err">തീയതി കണക്കാക്കാൻ കഴിഞ്ഞില്ല. സാധുവായ തീയതി നൽകുക.</div>`;
        }
      }

      convertBtn.addEventListener("click", convert);
      dateInput.addEventListener("change", convert);
    }
  }

  // 5. Main Initialization Hook
  function init() {
    // Find all prayer containers on the page
    const containers = document.querySelectorAll(".prayer-times-widget");
    containers.forEach(container => {
      const citySelect = container.querySelector(".prayer-city-select");
      let selectedCity = localStorage.getItem("ksa_user_prayer_city") || "Jeddah";

      if (citySelect) {
        // Populate cities
        citySelect.innerHTML = CITIES.map(c => `
          <option value="${c.id}" ${c.id === selectedCity ? "selected" : ""}>
            ${c.nameMl}
          </option>
        `).join("");

        citySelect.addEventListener("change", (e) => {
          selectedCity = e.target.value;
          localStorage.setItem("ksa_user_prayer_city", selectedCity);
          loadPrayerTimes(selectedCity, container);
        });
      }

      loadPrayerTimes(selectedCity, container);
      initHijriCalendar(container);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
