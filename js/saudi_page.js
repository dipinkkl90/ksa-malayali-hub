// KSA Malayali Hub — Saudi Guide & Hotels Engine (/saudi)

(function () {
  'use strict';

  // 1. Path Normalizer for GitHub Pages subpath compatibility
  function normalizeLinks() {
    const path = window.location.pathname;
    const isGitHub = window.location.hostname.includes("github.io");
    const repoMatch = path.match(/^(\/[^\/]+)\//);
    const prefix = isGitHub && repoMatch ? repoMatch[1] : "";
    if (prefix) {
      document.querySelectorAll("a[href^='/']").forEach(a => {
        const href = a.getAttribute("href");
        if (!href.startsWith(prefix) && href !== "#" && !href.startsWith("#")) {
          let target = prefix + href;
          if (href !== "/" && !target.endsWith(".html") && !target.endsWith("/")) {
            target += ".html";
          } else if (href === "/") {
            target = prefix + "/";
          }
          a.setAttribute("href", target);
        }
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 2. Hotels & Restaurants Directory
  let currentHotelCity = "all";
  let searchKeyword = "";

  function initHotels() {
    const cityButtons = document.querySelectorAll(".hotel-city-btn");
    const searchInput = document.getElementById("saudi-hotel-search");
    const grid = document.getElementById("saudi-hotels-grid");
    const countBadge = document.getElementById("saudi-hotels-count");

    if (!grid) return;

    cityButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        cityButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentHotelCity = btn.getAttribute("data-city") || "all";
        renderHotels();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchKeyword = e.target.value.trim().toLowerCase();
        renderHotels();
      });
    }

    renderHotels();

    function renderHotels() {
      const allHotels = window.KSA_KERALA_FOODS || [];
      const filtered = allHotels.filter(item => {
        const matchesCity = (currentHotelCity === "all") || (item.city && item.city.toLowerCase() === currentHotelCity.toLowerCase());
        if (!matchesCity) return false;

        if (!searchKeyword) return true;

        const name = (item.name || item.restaurant_name || "").toLowerCase();
        const area = (item.area || "").toLowerCase();
        const city = (item.city || "").toLowerCase();
        const tags = Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : (item.tags || "").toLowerCase();
        const dishes = Array.isArray(item.popular_dishes) ? item.popular_dishes.join(" ").toLowerCase() : "";

        return name.includes(searchKeyword) ||
               area.includes(searchKeyword) ||
               city.includes(searchKeyword) ||
               tags.includes(searchKeyword) ||
               dishes.includes(searchKeyword);
      });

      if (countBadge) {
        countBadge.textContent = `${filtered.length} മലയാളി ഹോട്ടലുകൾ`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(15,23,42,0.6); border-radius: 16px; border: 1px dashed rgba(255,255,255,0.15);">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
            <h4 style="color:#ffffff; margin:0 0 6px;">ഹോട്ടലുകൾ ഒന്നും കണ്ടെത്തിയില്ല</h4>
            <p style="color:#94a3b8; font-size:0.9rem; margin:0;">മറ്റൊരു നഗരമോ പേരോ തിരഞ്ഞുനോക്കൂ.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const rawName = item.name || item.restaurant_name || "Kerala Restaurant";
        const name = escapeHtml(rawName);
        const city = escapeHtml(item.city || "Jeddah");
        const area = escapeHtml(item.area || "");
        const rating = parseFloat(item.display_rating || item.directory_rating || item.rating) || 4.5;
        const phone = (item.phone_e164 || item.phone || "").trim();
        const mapsUrl = item.maps_search_url || item.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawName + " " + city + " Saudi Arabia")}`;
        const tags = Array.isArray(item.tags) ? item.tags : (item.tags ? String(item.tags).split(",") : ["Kerala Cuisine"]);
        const dishes = Array.isArray(item.popular_dishes) ? item.popular_dishes : [];

        const waText = encodeURIComponent(`Hi! Check out this Kerala restaurant in ${city}: ${rawName} (${area}). Found on KSA Malayali Hub: https://ksa-malayali-hub.vercel.app/saudi`);
        const waShareUrl = `https://wa.me/?text=${waText}`;

        return `
          <article class="saudi-hotel-card">
            <div class="saudi-hotel-card-header">
              <div class="saudi-hotel-city-badge">📍 ${city} · ${area}</div>
              <div class="saudi-hotel-rating">★ ${rating.toFixed(1)}</div>
            </div>

            <h3 class="saudi-hotel-name">${name}</h3>
            
            <div class="saudi-hotel-tags">
              ${tags.slice(0, 3).map(t => `<span class="saudi-hotel-tag">${escapeHtml(t.trim())}</span>`).join("")}
            </div>

            ${dishes.length > 0 ? `
              <div class="saudi-hotel-dishes">
                <span>🍲 <strong>പ്രശസ്ത വിഭവങ്ങൾ:</strong> ${escapeHtml(dishes.slice(0, 3).join(", "))}</span>
              </div>
            ` : ""}

            <div class="saudi-hotel-actions">
              <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="saudi-btn-map" title="Open Google Maps Directions">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                <span>Google Maps ↗</span>
              </a>

              ${phone ? `
                <a href="tel:${phone}" class="saudi-btn-call" title="Call Hotel">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>വിളിക്കുക</span>
                </a>
              ` : `
                <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="saudi-btn-call" title="View Phone on Google Maps">
                  <span>ഫോൺ നമ്പർ ↗</span>
                </a>
              `}

              <a href="${waShareUrl}" target="_blank" rel="noopener noreferrer" class="saudi-btn-share" title="Share on WhatsApp">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.03 2C6.5 2 2 6.48 2 12c0 1.77.46 3.5 1.34 5.02L2 22l5.13-1.34A9.96 9.96 0 0 0 12.03 22C17.55 22 22 17.52 22 12S17.55 2 12.03 2zm5.82 14.17c-.24.68-1.42 1.3-1.97 1.38-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.02-1.31-4.99-4.38-5.14-4.58-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.52c.28-.3.61-.38.81-.38h.59c.19 0 .44-.07.69.53.25.61.85 2.09.92 2.24.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.31.32-.13.62.18.3.79 1.31 1.7 2.12 1.17 1.04 2.15 1.37 2.46 1.52.3.15.48.13.66-.08.18-.2.76-.89.96-1.19.2-.3.41-.25.69-.15.28.1 1.78.84 2.08.99.3.15.51.23.58.36.08.13.08.76-.16 1.44z"/></svg>
              </a>
            </div>
          </article>
        `;
      }).join("");
    }
  }

  // 3. Saudi Kings & Founders
  function initKings() {
    const container = document.getElementById("saudi-kings-grid");
    const data = window.SAUDI_HERITAGE_DATA;
    if (!container || !data || !data.kings) return;

    container.innerHTML = data.kings.map(k => `
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
          <div style="font-size:0.82rem; color:#94a3b8; margin-top:auto; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06);">
            📜 ${escapeHtml(k.historical_significance)}
          </div>
        </div>
      </article>
    `).join("");
  }

  // 4. Holy Makkah & Madinah & Zamzam Stories
  function initHolyStories() {
    const container = document.getElementById("saudi-holy-stories-container");
    const data = window.SAUDI_HERITAGE_DATA;
    if (!container || !data || !data.islamic_heritage_stories) return;

    container.innerHTML = data.islamic_heritage_stories.map(st => `
      <div class="islamic-story-card">
        <div class="islamic-story-header">
          <div class="islamic-story-icon">${escapeHtml(st.icon)}</div>
          <div class="islamic-story-title">
            <h4>${escapeHtml(st.title)}</h4>
            <span>${escapeHtml(st.title_en)}</span>
          </div>
        </div>
        <div class="islamic-story-text">${escapeHtml(st.story)}</div>
        ${st.highlights ? `
          <div class="islamic-highlights-box">
            <strong>✨ ചരിത്ര പ്രാധാന്യം:</strong>
            <ul>
              ${st.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
      </div>
    `).join("");
  }

  // 5. Tourism & Farms
  function initTourism() {
    const container = document.getElementById("saudi-tourism-grid");
    const spots = window.SAUDI_TOURISM_DATA || [];
    if (!container || !spots.length) return;

    container.innerHTML = spots.slice(0, 12).map(item => {
      const nameMl = escapeHtml(item.name_ml || item.name_en);
      const nameEn = escapeHtml(item.name_en || "");
      const region = escapeHtml(item.region_label_ml || item.region_label_en || "");
      const category = escapeHtml(item.category_label_ml || item.category || "വിനോദസഞ്ചാരം");
      const desc = escapeHtml(item.description_ml || "");
      const mapUrl = item.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name_en + " Saudi Arabia")}`;
      const img = item.image || "./assets/tourism/alula.svg";

      return `
        <article class="tourism-card">
          <div class="tourism-card-media">
            <img src="${img}" alt="${nameEn}" class="tourism-card-img" onerror="this.src='./assets/favicon.svg'">
            <div class="tourism-media-overlay">
              <span class="tourism-category-pill">${category}</span>
              <span class="tourism-region-pill">📍 ${region}</span>
            </div>
          </div>
          <div class="tourism-card-body">
            <div class="tourism-card-head">
              <h3 style="font-size:1.15rem; font-weight:800; color:#ffffff; margin:0 0 4px;">${nameMl}</h3>
              <div style="font-size:0.85rem; color:#94a3b8; font-weight:600;">${nameEn}</div>
            </div>
            <p style="font-size:0.88rem; color:#cbd5e1; line-height:1.55; margin:0;">${desc}</p>
            <div style="margin-top:auto; padding-top:12px;">
              <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="saudi-btn-map" style="width:100%; justify-content:center;">
                <span>ഗൂഗിൾ മാപ്പിൽ കാണുക ➔</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // 6. National Facts & 13 Provinces
  function initFacts() {
    const container = document.getElementById("saudi-facts-container");
    const data = window.SAUDI_HERITAGE_DATA;
    if (!container || !data || !data.saudi_nation_facts) return;

    const f = data.saudi_nation_facts;
    const provinces = f.thirteen_provinces || [];
    const flag = f.national_flag_meaning || {};

    container.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px; margin-bottom:28px;">
        <div class="facts-stat-card">
          <div class="facts-stat-icon">🇸🇦</div>
          <div class="facts-stat-label">ദേശീയ പതാകയിലെ അർത്ഥം</div>
          <div class="facts-stat-val" style="font-size:1rem; font-weight:700; color:#34d399; margin-bottom:4px;">
            ${escapeHtml(flag.arabic_text || "لا إله إلا الله محمد رسول الله")}
          </div>
          <div style="font-size:0.86rem; color:#e2e8f0; line-height:1.4;">
            ${escapeHtml(flag.text_meaning || "")}
          </div>
          <div style="font-size:0.82rem; color:#fde047; margin-top:8px;">
            🗡️ ${escapeHtml(flag.sword_symbol || "")}
          </div>
        </div>

        <div class="facts-stat-card">
          <div class="facts-stat-icon">🗺️</div>
          <div class="facts-stat-label">ആകെ പ്രവിശ്യകൾ (സ്റ്റേറ്റുകൾ)</div>
          <div class="facts-stat-val" style="font-size:1.8rem; font-weight:800; color:#34d399;">
            ${f.total_provinces || 13} പ്രവിശ്യകൾ
          </div>
          <div style="font-size:0.84rem; color:#cbd5e1; margin-top:6px; line-height:1.4;">
            ${escapeHtml(f.largest_province || "കിഴക്കൻ പ്രവിശ്യ (Eastern Province)")}
          </div>
        </div>

        <div class="facts-stat-card">
          <div class="facts-stat-icon">🎓</div>
          <div class="facts-stat-label">ഏറ്റവും വലിയ യൂണിവേഴ്സിറ്റി</div>
          <div class="facts-stat-val" style="font-size:1.05rem; font-weight:800; color:#60a5fa;">
            ${escapeHtml((f.largest_universities && f.largest_universities[0] && (f.largest_universities[0].name_ml || f.largest_universities[0].name)) || "കിംഗ് സൗദ് യൂണിവേഴ്സിറ്റി")}
          </div>
          <div style="font-size:0.82rem; color:#94a3b8; margin-top:6px;">
            ${escapeHtml((f.largest_universities && f.largest_universities[0] && f.largest_universities[0].details) || "")}
          </div>
        </div>

        <div class="facts-stat-card">
          <div class="facts-stat-icon">👥</div>
          <div class="facts-stat-label">സൗദി ജനസംഖ്യ</div>
          <div class="facts-stat-val" style="font-size:1.6rem; font-weight:800; color:#f59e0b;">
            ${escapeHtml(f.population || "32.2 ദശലക്ഷം")}
          </div>
          <div style="font-size:0.82rem; color:#94a3b8; margin-top:6px;">
            ${escapeHtml(f.population_details || "")}
          </div>
        </div>
      </div>

      <h3 style="font-size:1.25rem; font-weight:800; color:#ffffff; margin:0 0 14px;">🏛️ സൗദിയിലെ 13 ഭരണ പ്രവിശ്യകൾ (13 Provinces)</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">
        ${provinces.map(p => `
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <strong style="color:#ffffff; font-size:1rem;">${escapeHtml(p.name)}</strong>
              <span style="font-size:0.75rem; background:rgba(52,211,153,0.15); color:#6ee7b7; padding:2px 8px; border-radius:9999px;">തലസ്ഥാനം: ${escapeHtml(p.capital)}</span>
            </div>
            <p style="font-size:0.85rem; color:#94a3b8; margin:0; line-height:1.4;">${escapeHtml(p.highlights)}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  // 7. Camels and Deserts
  function initCamels() {
    const container = document.getElementById("saudi-camels-container");
    const data = window.SAUDI_HERITAGE_DATA;
    if (!container || !data || !data.camels_and_deserts) return;

    const cd = data.camels_and_deserts;
    const camels = cd.camels || {};
    const deserts = cd.deserts || [];

    container.innerHTML = `
      <div style="background:rgba(15,23,42,0.7); border:1px solid rgba(212,175,55,0.3); border-radius:18px; padding:24px; margin-bottom:24px;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <span style="font-size:2rem; line-height:1;">🐪</span>
          <div>
            <h3 style="color:#fde047; font-size:1.25rem; font-weight:800; margin:0;">${escapeHtml(camels.title || "അൽ ഇബിൽ (ഒട്ടകം) — മരുഭൂമിയുടെ കപ്പൽ")}</h3>
            <span style="color:#94a3b8; font-size:0.85rem;">The Camel & Desert Heritage of Saudi Arabia</span>
          </div>
        </div>
        <p style="color:#cbd5e1; font-size:0.92rem; line-height:1.6; margin:0 0 16px;">
          ${escapeHtml(camels.significance || "സൗദി അറേബ്യൻ സംസ്കാരത്തിലും ചരിത്രത്തിലും ഒട്ടകങ്ങൾക്കുള്ള സ്ഥാനം അതുല്യമാണ്. വിശുദ്ധ ഖുർആനിലും ഇവയെക്കുറിച്ച് പരാമർശമുണ്ട്.")}
        </p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
          <div style="background:rgba(255,255,255,0.03); border-radius:12px; padding:12px;">
            <strong style="color:#ffffff; font-size:0.9rem;">🎪 ഒട്ടകോത്സവം (Camel Festival):</strong>
            <p style="color:#94a3b8; font-size:0.84rem; margin:4px 0 0;">${escapeHtml(camels.cultural_festivals || "കിംഗ് അബ്ദുൽ അസീസ് ഒട്ടകോത്സവം ലോകത്തിലെ ഏറ്റവും വലിയ ഒട്ടക മേളയാണ്.")}</p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border-radius:12px; padding:12px;">
            <strong style="color:#ffffff; font-size:0.9rem;">📖 വിശുദ്ധ ഖുർആൻ സൂക്തം:</strong>
            <p style="color:#94a3b8; font-size:0.84rem; margin:4px 0 0;">${escapeHtml(camels.quran_verse || "അവർ ഒട്ടകത്തിലേക്ക് നോക്കുന്നില്ലേ, അത് എങ്ങനെ സൃഷ്ടിക്കപ്പെട്ടിരിക്കുന്നുവെന്ന് (സൂറത്തുൽ ഗാശിയ).")}</p>
          </div>
        </div>
      </div>

      <h3 style="font-size:1.2rem; font-weight:800; color:#ffffff; margin:0 0 14px;">🏜️ സൗദിയിലെ പ്രധാന മരുഭൂമികൾ (Deserts)</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:14px;">
        ${deserts.map(d => `
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:16px;">
            <h4 style="color:#f59e0b; font-size:1.05rem; font-weight:800; margin:0 0 6px;">${escapeHtml(d.name)} (${escapeHtml(d.arabic_name || "")})</h4>
            <div style="font-size:0.8rem; color:#6ee7b7; margin-bottom:6px;">📏 ${escapeHtml(d.scale || "")}</div>
            <p style="color:#cbd5e1; font-size:0.86rem; line-height:1.5; margin:0;">${escapeHtml(d.description)}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  // 8. Initialize all sections
  document.addEventListener("DOMContentLoaded", () => {
    normalizeLinks();
    initHotels();
    initKings();
    initHolyStories();
    initTourism();
    initFacts();
    initCamels();
  });

})();
