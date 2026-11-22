// KSA Malayali Hub — Health & Language Portal Engine (ആരോഗ്യം & ഭാഷ)

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
        if (!href.startsWith(prefix) && href !== "#") {
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

  // 2. Polyclinics City Tabs & Grid Renderer
  let currentCity = "Jeddah";

  function initClinics() {
    const cityButtons = document.querySelectorAll(".city-tab-btn");
    const container = document.getElementById("clinics-cards-container");
    const cityTitle = document.getElementById("clinics-current-city-title");
    const cityCount = document.getElementById("clinics-current-city-count");

    if (!container || !cityButtons.length) return;

    cityButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        cityButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCity = btn.getAttribute("data-city") || "Jeddah";
        renderClinicsForCity(currentCity);
      });
    });

    renderClinicsForCity(currentCity);

    function renderClinicsForCity(cityKey) {
      const clinics = (HEALTH_DATA.clinicsByCity && HEALTH_DATA.clinicsByCity[cityKey]) || [];
      const cityNameMl = getCityNameMl(cityKey);

      if (cityTitle) cityTitle.textContent = `${cityNameMl} (${clinics.length} കേന്ദ്രങ്ങൾ)`;
      if (cityCount) cityCount.textContent = `${clinics.length} ക്ലിനിക്കുകൾ`;

      if (clinics.length === 0) {
        container.innerHTML = `
          <div class="clinic-empty-state">
            <p>ഈ നഗരത്തിലെ ക്ലിനിക്കുകൾ ഉടൻ അപ്ഡേറ്റ് ചെയ്യുന്നതാണ്.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = clinics.map(clinic => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.mapsQuery)}`;
        const callBtn = clinic.phone ? `
          <a href="tel:${clinic.phone}" class="clinic-call-btn" title="Call Unified KSA Number">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>വിളിക്കുക (${clinic.phone})</span>
          </a>
        ` : '';

        return `
          <article class="clinic-card">
            <div class="clinic-card-top">
              <div class="clinic-badge-row">
                <span class="clinic-city-pill">${clinic.areaMl || clinic.area}</span>
                ${clinic.isAbeerUnified ? '<span class="clinic-tag-abeer">● അബീർ ഗ്രൂപ്പ് ശൃംഖല</span>' : '<span class="clinic-tag-general">● പ്രവാസി ക്ലിനിക്ക്</span>'}
              </div>
              <h3 class="clinic-name-ml">${clinic.nameMl}</h3>
              <div class="clinic-name-en">${clinic.name}</div>
              <div class="clinic-area-loc">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${clinic.area}</span>
              </div>
              ${clinic.note ? `<p class="clinic-note">💡 ${clinic.note}</p>` : ''}
            </div>

            <div class="clinic-actions-row">
              <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="clinic-map-btn" title="Open Google Maps location and details">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
                <span>ഗൂഗിൾ മാപ്പ് (Google Maps) ↗</span>
              </a>
              ${callBtn}
            </div>
          </article>
        `;
      }).join("");
    }

    function getCityNameMl(key) {
      const names = {
        "Jeddah": "ജിദ്ദ (Jeddah)",
        "Makkah": "മക്ക (Makkah)",
        "Madinah": "മദീന (Madinah)",
        "Taif": "തായിഫ് (Taif)",
        "Riyadh": "റിയാദ് (Riyadh)",
        "Dammam": "ദമ്മാം & ഖോബാർ (Dammam / Khobar)",
        "Buraidah": "ബുറൈദ (Buraidah / Al Qassim)",
        "Tabuk": "തബൂക്ക് (Tabuk)",
        "AlJouf": "അൽ ജൗഫ് / സകാക്ക (Al Jouf)",
        "AlBaha": "അൽ ബഹ (Al Baha)",
        "Khamis": "ഖമീസ് മുശൈത്ത് (Khamis Mushait)"
      };
      return names[key] || key;
    }
  }

  // 3. Customs Checklist Renderer
  function initCustoms() {
    const container = document.getElementById("customs-grid-container");
    if (!container || !HEALTH_DATA.customsChecklist) return;

    container.innerHTML = HEALTH_DATA.customsChecklist.map(item => {
      const isBanned = item.category === "banned";
      const cardClass = isBanned ? "customs-card banned" : "customs-card allowed";
      const badgeIcon = isBanned ? "❌" : "✅";
      const badgeClass = isBanned ? "customs-badge-red" : "customs-badge-green";

      return `
        <div class="${cardClass}">
          <div class="customs-card-header">
            <span class="${badgeClass}">${badgeIcon} ${item.statusText}</span>
            <span class="customs-risk-tag ${item.riskLevel.toLowerCase()}">${item.riskLevel}</span>
          </div>
          <h3 class="customs-item-title">${item.titleMl}</h3>
          <p class="customs-item-desc">${item.descMl}</p>
        </div>
      `;
    }).join("");
  }

  // 4. Arabic-Malayalam Phrasebook Renderer & Web Speech Synthesis
  let currentPhraseCategory = "hospital";

  function initPhrasebook() {
    const categoryButtons = document.querySelectorAll(".phrase-tab-btn");
    const container = document.getElementById("phrases-grid-container");

    if (!container || !categoryButtons.length) return;

    categoryButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        categoryButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentPhraseCategory = btn.getAttribute("data-category") || "hospital";
        renderPhrases(currentPhraseCategory);
      });
    });

    renderPhrases(currentPhraseCategory);

    function renderPhrases(categoryKey) {
      const phrases = (HEALTH_DATA.phrasebook && HEALTH_DATA.phrasebook[categoryKey]) || [];
      if (!phrases.length) return;

      container.innerHTML = phrases.map((item, index) => {
        return `
          <div class="phrase-card">
            <div class="phrase-card-head">
              <span class="phrase-index">#${index + 1}</span>
              <button type="button" class="phrase-speak-btn" data-ar="${encodeURIComponent(item.ar)}" title="Listen to Arabic Pronunciation">
                <span class="speak-icon">🔊</span>
                <span>കേൾക്കാം</span>
              </button>
            </div>

            <div class="phrase-ar-box" dir="rtl" lang="ar">
              ${item.ar}
            </div>

            <div class="phrase-ml-phonetic">
              <span class="label">ഉച്ചാരണം (മലയാളത്തിൽ):</span>
              <strong class="text">${item.mlPhonetic}</strong>
            </div>

            <div class="phrase-en-phonetic">
              <span>English: <em>${item.enPhonetic}</em></span>
            </div>

            <div class="phrase-ml-meaning">
              <span class="meaning-icon">👉</span>
              <span class="meaning-text">${item.mlMeaning}</span>
            </div>
          </div>
        `;
      }).join("");

      // Wire speech synthesis on all listen buttons
      container.querySelectorAll(".phrase-speak-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const rawAr = decodeURIComponent(btn.getAttribute("data-ar") || "");
          speakArabic(rawAr, btn);
        });
      });
    }

    function speakArabic(arabicText, btn) {
      if (!('speechSynthesis' in window)) {
        alert("നിങ്ങളുടെ ഫോണിൽ / ബ്രൗസറിൽ സൗണ്ട് സിന്തസിസ് ലഭ്യമല്ല.");
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(arabicText);
        utterance.lang = "ar-SA";
        utterance.rate = 0.85; // Slightly slower pacing for learners
        utterance.pitch = 1.0;

        btn.classList.add("speaking");
        utterance.onend = () => btn.classList.remove("speaking");
        utterance.onerror = () => btn.classList.remove("speaking");

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("SpeechSynthesis error:", e);
        btn.classList.remove("speaking");
      }
    }
  }


  // 5. Saudi Telecom & SIM Card Balance & Offer Codes Controller
  const SAUDI_SIM_PROVIDERS = [
    {
      id: "stc",
      name: "STC (Sawa)",
      nameMl: "എസ്.ടി.സി (സവാ)",
      badge: "Saudi Telecom Company",
      codes: [
        { label: "പ്രധാന ബാലൻസ് (Main Balance)", code: "*166#", tel: "*166%23", desc: "അക്കൗണ്ട് ബാലൻസും വാലിഡിറ്റിയും അറിയാൻ" },
        { label: "ഡാറ്റ ബാലൻസ് (Data Balance)", code: "*166*9#", tel: "*166*9%23", desc: "ശേഷിക്കുന്ന നെറ്റ് ഡാറ്റയും എംബിയും അറിയാൻ" },
        { label: "സ്വന്തം നമ്പർ (Know Your Number)", code: "*150#", tel: "*150%23", desc: "നിങ്ങളുടെ സിം നമ്പർ സ്ക്രീനിൽ കാണാൻ" },
        { label: "റീചാർജ് കാർഡ് (Recharge)", code: "*155*RechargeCode#", tel: "*155%23", desc: "*155* കൂപ്പൺ നമ്പർ # എന്ന് ഡയൽ ചെയ്യുക" },
        { label: "കസ്റ്റമർ കെയർ (Customer Care)", code: "900", tel: "900", desc: "STC 24/7 സൗജന്യ കസ്റ്റമർ സപ്പോർട്ട്" }
      ]
    },
    {
      id: "mobily",
      name: "Mobily",
      nameMl: "മൊബീലി (Mobily)",
      badge: "Etihad Etisalat",
      codes: [
        { label: "പ്രധാന ബാലൻസ് (Main Balance)", code: "*1411#", tel: "*1411%23", desc: "പ്രധാന വോയ്സ് ബാലൻസും കാലാവധിയും" },
        { label: "ഡാറ്റ ബാലൻസ് (Data Balance)", code: "*1411*2#", tel: "*1411*2%23", desc: "നെറ്റ് ഡാറ്റ എംബി ബാലൻസ് അറിയാൻ" },
        { label: "സ്വന്തം നമ്പർ (Know Your Number)", code: "*222#", tel: "*222%23", desc: "നിങ്ങളുടെ മൊബീലി സിം നമ്പർ അറിയാൻ" },
        { label: "റീചാർജ് കാർഡ് (Recharge)", code: "*1400*RechargeCode#", tel: "*1400%23", desc: "*1400* കൂപ്പൺ നമ്പർ # എന്ന് ഡയൽ ചെയ്യുക" },
        { label: "കസ്റ്റമർ കെയർ (Customer Care)", code: "1100", tel: "1100", desc: "മൊബീലി 24/7 കസ്റ്റമർ കെയർ നമ്പർ" }
      ]
    },
    {
      id: "zain",
      name: "Zain KSA",
      nameMl: "സെയ്ൻ (Zain)",
      badge: "Zain Telecom",
      codes: [
        { label: "പ്രധാന ബാലൻസ് (Main Balance)", code: "*142#", tel: "*142%23", desc: "പ്രധാന ബാലൻസും വാലിഡിറ്റിയും" },
        { label: "ഡാറ്റ ബാലൻസ് (Data Balance)", code: "*142#", tel: "*142%23", desc: "ഡാറ്റ അറിയാൻ *142# അല്ലെങ്കിൽ 'BC' എന്ന് 959 ലേക്ക് SMS ചെയ്യുക" },
        { label: "സ്വന്തം നമ്പർ (Know Your Number)", code: "*144#", tel: "*144%23", desc: "സെയ്ൻ സിം നമ്പർ സ്ക്രീനിൽ ലഭിക്കാൻ" },
        { label: "റീചാർജ് കാർഡ് (Recharge)", code: "*141*RechargeCode#", tel: "*141%23", desc: "*141* റീചാർജ് കോഡ് # എന്ന് ഡയൽ ചെയ്യുക" },
        { label: "കസ്റ്റമർ കെയർ (Customer Care)", code: "959", tel: "959", desc: "സെയ്ൻ 24/7 കസ്റ്റമർ സർവീസ് നമ്പർ" }
      ]
    },
    {
      id: "virgin",
      name: "Virgin Mobile",
      nameMl: "വേർജിൻ (Virgin)",
      badge: "Virgin Mobile KSA",
      codes: [
        { label: "പ്രധാന ബാലൻസ് (Main Balance)", code: "*102#", tel: "*102%23", desc: "പ്രധാന അക്കൗണ്ട് ബാലൻസ് അറിയാൻ" },
        { label: "ഡാറ്റ ബാലൻസ് (Data Balance)", code: "*104#", tel: "*104%23", desc: "ഇന്റർനെറ്റ് ഡാറ്റ ശേഷിപ്പ് അറിയാൻ" },
        { label: "സ്വന്തം നമ്പർ (Know Your Number)", code: "*115#", tel: "*115%23", desc: "നിങ്ങളുടെ വേർജിൻ നമ്പർ അറിയാൻ" },
        { label: "റീചാർജ് കാർഡ് (Recharge)", code: "*101*RechargeCode#", tel: "*101%23", desc: "*101* റീചാർജ് കോഡ് # എന്ന് ഡയൽ ചെയ്യുക" },
        { label: "കസ്റ്റമർ കെയർ (Customer Care)", code: "1789", tel: "1789", desc: "വേർജിൻ കസ്റ്റമർ കെയർ ഹെൽപ്പ്‌ലൈൻ" }
      ]
    },
    {
      id: "friendi",
      name: "FRiENDi Mobile",
      nameMl: "ഫ്രെണ്ടി (Friendi)",
      badge: "Virgin Mobile Middle East",
      codes: [
        { label: "പ്രധാന ബാലൻസ് (Main Balance)", code: "*102#", tel: "*102%23", desc: "ഫ്രെണ്ടി മെയിൻ ബാലൻസ് അറിയാൻ" },
        { label: "ഡാറ്റ ബാലൻസ് (Data Balance)", code: "*108#", tel: "*108%23", desc: "ഇന്റർനെറ്റ് ബണ്ടിൽ ബാലൻസ് പരിശോധിക്കാൻ" },
        { label: "സ്വന്തം നമ്പർ (Know Your Number)", code: "*110#", tel: "*110%23", desc: "നിങ്ങളുടെ ഫ്രെണ്ടി മൊബൈൽ നമ്പർ അറിയാൻ" },
        { label: "റീചാർജ് കാർഡ് (Recharge)", code: "*101*RechargeCode#", tel: "*101%23", desc: "*101* റീചാർജ് കോഡ് # ഡയൽ ചെയ്യുക" },
        { label: "കസ്റ്റമർ കെയർ (Customer Care)", code: "166000", tel: "166000", desc: "ഫ്രെണ്ടി കസ്റ്റമർ സർവീസ് നമ്പർ" }
      ]
    },
    {
      id: "lebara",
      name: "Lebara Mobile",
      nameMl: "ലെബാര (Lebara)",
      badge: "Lebara KSA",
      codes: [
        { label: "പ്രധാന ബാലൻസ് (Main Balance)", code: "*110#", tel: "*110%23", desc: "ലെബാര മെയിൻ അക്കൗണ്ട് ബാലൻസ്" },
        { label: "ഡാറ്റ ബാലൻസ് (Data Balance)", code: "*110#", tel: "*110%23", desc: "ഡാറ്റ ബാലൻസ് പരിശോധിക്കാൻ (അല്ലെങ്കിൽ Lebara ആപ്പ്)" },
        { label: "സ്വന്തം നമ്പർ (Know Your Number)", code: "*000#", tel: "*000%23", desc: "ലെബാര സിം നമ്പർ സ്ക്രീനിൽ കാണാൻ" },
        { label: "റീചാർജ് കാർഡ് (Recharge)", code: "*111*RechargeCode#", tel: "*111%23", desc: "*111* റീചാർജ് കൂപ്പൺ നമ്പർ # ഡയൽ ചെയ്യുക" },
        { label: "കസ്റ്റമർ കെയർ (Customer Care)", code: "1755", tel: "1755", desc: "ലെബാര കസ്റ്റമർ സപ്പോർട്ട് ഹെൽപ്പ്‌ലൈൻ" }
      ]
    }
  ];

  function showSimToast(msg) {
    const existing = document.getElementById("pwa-toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.id = "pwa-toast";
    toast.className = "pwa-toast show";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function initSimCodes() {
    const container = document.getElementById("sim-cards-grid-container");
    const tabsContainer = document.getElementById("sim-provider-tabs");
    if (!container) return;

    function renderSimCards(filterId = "all") {
      const providersToRender = filterId === "all" 
        ? SAUDI_SIM_PROVIDERS 
        : SAUDI_SIM_PROVIDERS.filter(p => p.id === filterId);

      container.innerHTML = providersToRender.map(p => `
        <div class="sim-provider-card" id="sim-card-${p.id}">
          <div class="sim-provider-header">
            <div class="sim-provider-title">
              <h3>${p.nameMl}</h3>
              <span>${p.name} · ${p.badge}</span>
            </div>
            <span class="sim-provider-badge">📶 4G/5G ലൈവ്</span>
          </div>
          <div class="sim-codes-list">
            ${p.codes.map(c => `
              <div class="sim-code-row">
                <div class="sim-code-info">
                  <strong>${c.label}</strong>
                  <span>${c.desc}</span>
                </div>
                <div class="sim-code-dial-wrap">
                  <span class="sim-code-val">${c.code}</span>
                  <a href="tel:${c.tel}" class="btn-sim-dial" title="ഫോണിൽ ഉടൻ ഡയൽ ചെയ്യുക">📞 ഡയൽ ചെയ്യുക</a>
                  <button type="button" class="btn-sim-copy" data-code="${c.code}" title="കോഡ് കോപ്പി ചെയ്യുക">📋 കോപ്പി</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("");
    }

    renderSimCards("all");

    if (tabsContainer) {
      tabsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".sim-tab-btn");
        if (!btn) return;
        tabsContainer.querySelectorAll(".sim-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const prov = btn.getAttribute("data-provider") || "all";
        renderSimCards(prov);
      });
    }

    // Copy action delegation
    container.addEventListener("click", (e) => {
      const copyBtn = e.target.closest(".btn-sim-copy");
      if (!copyBtn) return;
      const code = copyBtn.getAttribute("data-code");
      if (!code) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          showSimToast(`കോഡ് കോപ്പി ചെയ്തു: ${code} ✅`);
        }).catch(() => {
          fallbackCopyText(code);
        });
      } else {
        fallbackCopyText(code);
      }
    });

    function fallbackCopyText(text) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showSimToast(`കോഡ് കോപ്പി ചെയ്തു: ${text} ✅`);
      } catch (e) {
        showSimToast(`കോഡ്: ${text}`);
      }
      document.body.removeChild(ta);
    }

    // Auto smooth-scroll to #sim-codes-section if in hash
    if (window.location.hash === "#sim-codes-section") {
      setTimeout(() => {
        const sec = document.getElementById("sim-codes-section");
        if (sec) sec.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  }

  // 6. Initialize on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    normalizeLinks();
    initClinics();
    initCustoms();
    initPhrasebook();
    initSimCodes();
  });

})();
