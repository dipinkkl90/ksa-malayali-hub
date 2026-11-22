const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// ============================================================================
// 1. UPDATE js/vision_fifa.js
// ============================================================================
const visionFifaPath = path.join(rootDir, 'js', 'vision_fifa.js');
let visionCode = fs.readFileSync(visionFifaPath, 'utf8');

// Replace initVisionFIFA logic
const oldInitPattern = /function initVisionFIFA\(\) \{[\s\S]*?\n  if \(document\.readyState === "loading"\)/;

const newInitCode = `function initVisionFIFA() {
    const section = document.getElementById("worldcup-2034") || document.getElementById("saudi-vision-fifa-section");
    if (!section) return;

    let activeTab = "vision"; // "vision" or "fifa"
    let activeCity = "all";   // "all", "Riyadh", "Jeddah", "Al Khobar", "Abha", "NEOM"

    const btnTabVision = section.querySelector("#tab-btn-vision");
    const btnTabFIFA = section.querySelector("#tab-btn-fifa");
    const paneVision = section.querySelector("#pane-vision-2030");
    const paneFIFA = section.querySelector("#pane-fifa-2034");

    const projectsContainer = section.querySelector("#vision-projects-grid");
    const stadiumsContainer = section.querySelector("#fifa-stadiums-grid");
    const cityFilterContainer = section.querySelector("#stadium-city-filters");

    // 1. Render Vision 2030 Projects
    function renderVisionProjects() {
      if (!projectsContainer) return;

      projectsContainer.innerHTML = VISION_2030_DATA.projects.map(proj => \`
        <div class="mega-project-card" id="\${proj.id}">
          <div class="mega-project-header">
            <div class="mega-project-icon">\${proj.icon}</div>
            <div class="mega-project-titles">
              <span class="mega-project-tag">\${proj.tag}</span>
              <h3>\${proj.nameMl}</h3>
              <span class="mega-project-sub">\${proj.nameEn}</span>
            </div>
            <div class="mega-project-badges">
              <span class="mega-badge-location">📍 \${proj.location}</span>
              <span class="mega-badge-invest">💰 \${proj.investment}</span>
            </div>
          </div>

          <p class="mega-project-desc">\${proj.desc}</p>

          <div class="mega-subprojects-title">പ്രധാന സവിശേഷതകളും ഭാഗങ്ങളും:</div>
          <div class="mega-subprojects-grid">
            \${proj.subProjects.map(sub => \`
              <div class="mega-subproject-item">
                <strong>✨ \${escapeHtml(sub.name)}</strong>
                <p>\${escapeHtml(sub.desc)}</p>
              </div>
            \`).join("")}
          </div>
        </div>
      \`).join("");
    }

    // 2. Render FIFA 2034 Stadiums (All 15 Stadiums across 5 Cities)
    function renderStadiums() {
      if (!stadiumsContainer) return;

      const filtered = activeCity === "all"
        ? FIFA_STADIUMS_DATA
        : FIFA_STADIUMS_DATA.filter(s => s.city === activeCity);

      if (filtered.length === 0) {
        stadiumsContainer.innerHTML = \`<div class="empty-state"><p>ഈ നഗരത്തിൽ സ്റ്റേഡിയങ്ങൾ കണ്ടെത്തിയില്ല.</p></div>\`;
        return;
      }

      stadiumsContainer.innerHTML = filtered.map(stadium => {
        const isNew = stadium.status === "new";
        const statusBadgeClass = isNew ? "status-badge-new" : "status-badge-renovated";

        return \`
          <div class="stadium-card" id="\${stadium.id}">
            <div class="stadium-card-head">
              <div class="stadium-city-pill">📍 \${stadium.cityMl}</div>
              <span class="\${statusBadgeClass}">
                \${isNew ? "✨ പുതിയത് (New)" : "🔄 നവീകരിച്ചത് (Renovated)"}
              </span>
            </div>

            <h3 class="stadium-name-ml">\${escapeHtml(stadium.nameMl)}</h3>
            <div class="stadium-name-en">\${escapeHtml(stadium.nameEn)}</div>

            <div class="stadium-capacity-row">
              <span class="capacity-icon">🏟️</span>
              <span class="capacity-label">ശേഷി (Capacity):</span>
              <strong class="capacity-value">\${stadium.capacity} സീറ്റുകൾ</strong>
            </div>

            <div class="stadium-highlight-box">
              \${escapeHtml(stadium.highlight)}
            </div>

            <p class="stadium-desc">\${escapeHtml(stadium.desc)}</p>

            <a href="\${stadium.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-stadium-maps" title="Google Maps-ൽ സ്റ്റേഡിയം ലൊക്കേഷൻ കാണുക">
              <span>📍 Google Maps-ൽ കാണുക ➔</span>
            </a>
          </div>
        \`;
      }).join("");
    }

    // 3. Tab Switching
    function setTab(tab) {
      activeTab = tab;
      if (btnTabVision && btnTabFIFA) {
        btnTabVision.classList.toggle("active", tab === "vision");
        btnTabFIFA.classList.toggle("active", tab === "fifa");
        btnTabVision.setAttribute("aria-selected", tab === "vision");
        btnTabFIFA.setAttribute("aria-selected", tab === "fifa");
      }

      if (paneVision && paneFIFA) {
        paneVision.style.display = tab === "vision" ? "block" : "none";
        paneFIFA.style.display = tab === "fifa" ? "block" : "none";
      }
    }

    window.switchVisionFifaTab = setTab;

    if (btnTabVision) btnTabVision.addEventListener("click", () => setTab("vision"));
    if (btnTabFIFA) btnTabFIFA.addEventListener("click", () => setTab("fifa"));

    // 4. City Filter Buttons for Stadiums
    if (cityFilterContainer) {
      cityFilterContainer.querySelectorAll(".stadium-filter-pill").forEach(btn => {
        btn.addEventListener("click", () => {
          cityFilterContainer.querySelectorAll(".stadium-filter-pill").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          activeCity = btn.getAttribute("data-city") || "all";
          renderStadiums();
        });
      });
    }

    // 5. Hash navigation and jump pills
    function handleHash() {
      const hash = (window.location.hash || "").toLowerCase();
      if (hash.includes("worldcup") || hash.includes("fifa") || hash.includes("stadium")) {
        setTab("fifa");
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      } else if (hash.includes("vision")) {
        setTab("vision");
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    }

    window.addEventListener("hashchange", handleHash);

    // Attach click listeners to all jump pills
    document.querySelectorAll('a[href*="worldcup-2034"], a[href*="fifa"]').forEach(link => {
      link.addEventListener("click", () => {
        setTab("fifa");
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      });
    });

    document.querySelectorAll('a[href*="vision"]').forEach(link => {
      link.addEventListener("click", () => {
        setTab("vision");
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      });
    });

    // Initial Render
    renderVisionProjects();
    renderStadiums();

    const initialHash = (window.location.hash || "").toLowerCase();
    if (initialHash.includes("worldcup") || initialHash.includes("fifa") || initialHash.includes("stadium")) {
      setTab("fifa");
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      setTab("vision");
    }
  }

  if (document.readyState === "loading")`;

visionCode = visionCode.replace(oldInitPattern, newInitCode);
fs.writeFileSync(visionFifaPath, visionCode, 'utf8');
console.log('✅ Updated js/vision_fifa.js with hash handling, worldcup-2034 selector, and fifa tab activation');

// ============================================================================
// 2. UPDATE saudi/index.html AND saudi.html
// ============================================================================
const saudiFiles = [
  path.join(rootDir, 'saudi', 'index.html'),
  path.join(rootDir, 'saudi.html')
];

saudiFiles.forEach(sf => {
  if (!fs.existsSync(sf)) return;
  let html = fs.readFileSync(sf, 'utf8');

  // A. Section ID: id="worldcup-2034"
  html = html.replace(
    /<section id="saudi-vision-fifa-section" class="health-section"/g,
    '<section id="worldcup-2034" class="health-section saudi-vision-fifa-section"'
  );

  // Backward compatibility anchor if not already present
  if (!html.includes('id="saudi-vision-fifa-section"')) {
    html = html.replace(
      '<section id="worldcup-2034" class="health-section saudi-vision-fifa-section" aria-labelledby="vision-fifa-title">',
      '<section id="worldcup-2034" class="health-section saudi-vision-fifa-section" aria-labelledby="vision-fifa-title">\n      <a id="saudi-vision-fifa-section" style="display:block; position:relative; top:-90px; visibility:hidden;"></a>'
    );
  }

  // B. Quick Jump Pills at top of saudi page
  // Replace: <a href="#saudi-vision-fifa-section" class="saudi-pill-link" ...><span>⚽ വിഷൻ 2030 &amp; ഫിഫ 2034</span></a>
  html = html.replace(
    /<a href="#saudi-vision-fifa-section" class="saudi-pill-link"[^>]*>[\s\S]*?<span>⚽[^<]*<\/span>[\s\S]*?<\/a>/g,
    '<a href="#worldcup-2034" class="saudi-pill-link saudi-pill-fifa" style="border-color:#2563eb; background:rgba(37,99,235,0.18); color:#38bdf8; font-weight:800;">\n          <span>⚽ വേൾഡ് കപ്പ് 2034 &amp; വിഷൻ 2030</span>\n        </a>'
  );

  // C. In sub-navbar (.sub-nav-scroll-wrapper): add FIFA World Cup 2034 pill if missing
  if (!html.includes('data-sub="worldcup"')) {
    const targetSubNav = '<a href="/explore?tab=heritage" class="sub-nav-pill" data-sub="heritage">';
    const replacementSubNav = `<a href="/saudi#worldcup-2034" class="sub-nav-pill" data-sub="worldcup">
            <span class="sub-nav-icon">⚽</span>
            <span>വേൾഡ് കപ്പ് 2034 &amp; വിഷൻ 2030</span>
          </a>
          <a href="/explore?tab=heritage" class="sub-nav-pill" data-sub="heritage">`;
    html = html.replace(targetSubNav, replacementSubNav);
  }

  // D. Ensure absolute script paths
  html = html.replace(/src="\.\/js\//g, 'src="/js/');

  fs.writeFileSync(sf, html, 'utf8');
  console.log(`✅ Updated ${path.relative(rootDir, sf)}: section id="worldcup-2034", quick jump pill, and absolute script paths`);
});

// ============================================================================
// 3. UPDATE index.html (Card #20 link to /saudi#worldcup-2034 and subnav)
// ============================================================================
const indexPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Replace link for Card #20:
// <a href="/saudi.html#vision-fifa-section" class="feature-dir-link">
indexHtml = indexHtml.replace(
  /href="\/saudi(?:\.html)?#vision-fifa-section"/g,
  'href="/saudi#worldcup-2034"'
);

// Add sub-nav pill for FIFA World Cup if missing
if (!indexHtml.includes('data-sub="worldcup"')) {
  const targetSubNav = '<a href="/explore?tab=heritage" class="sub-nav-pill" data-sub="heritage">';
  const replacementSubNav = `<a href="/saudi#worldcup-2034" class="sub-nav-pill" data-sub="worldcup">
            <span class="sub-nav-icon">⚽</span>
            <span>വേൾഡ് കപ്പ് 2034</span>
          </a>
          <a href="/explore?tab=heritage" class="sub-nav-pill" data-sub="heritage">`;
  indexHtml = indexHtml.replace(targetSubNav, replacementSubNav);
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('✅ Updated index.html: Card #20 linked directly to /saudi#worldcup-2034 and subnav pill added');

// ============================================================================
// 4. UPDATE ALL OTHER PAGES SUBNAV WITH WORLDCUP PILL & ABSOLUTE SCRIPTS
// ============================================================================
const otherPages = [
  path.join(rootDir, 'about.html'),
  path.join(rootDir, 'about', 'index.html'),
  path.join(rootDir, 'explore.html'),
  path.join(rootDir, 'explore', 'index.html'),
  path.join(rootDir, 'health.html'),
  path.join(rootDir, 'health', 'index.html'),
  path.join(rootDir, 'norka.html'),
  path.join(rootDir, 'norka', 'index.html'),
  path.join(rootDir, 'sahayi.html'),
  path.join(rootDir, 'sahayi', 'index.html'),
  path.join(rootDir, 'travel.html'),
  path.join(rootDir, 'travel', 'index.html'),
];

otherPages.forEach(p => {
  if (!fs.existsSync(p)) return;
  let pageContent = fs.readFileSync(p, 'utf8');
  let changed = false;

  // Link Card 20 or other links to worldcup-2034 if present
  if (pageContent.includes('/saudi.html#vision-fifa-section') || pageContent.includes('#saudi-vision-fifa-section')) {
    pageContent = pageContent.replace(/href="\/saudi(?:\.html)?#(?:saudi-)?vision-fifa-section"/g, 'href="/saudi#worldcup-2034"');
    changed = true;
  }

  // Subnav pill
  if (!pageContent.includes('data-sub="worldcup"') && pageContent.includes('data-sub="heritage"')) {
    pageContent = pageContent.replace(
      '<a href="/explore?tab=heritage" class="sub-nav-pill" data-sub="heritage">',
      `<a href="/saudi#worldcup-2034" class="sub-nav-pill" data-sub="worldcup">
            <span class="sub-nav-icon">⚽</span>
            <span>വേൾഡ് കപ്പ് 2034</span>
          </a>
          <a href="/explore?tab=heritage" class="sub-nav-pill" data-sub="heritage">`
    );
    changed = true;
  }

  // Absolute script tags for subdirectory html files
  if (p.includes(path.sep + 'about' + path.sep) ||
      p.includes(path.sep + 'explore' + path.sep) ||
      p.includes(path.sep + 'health' + path.sep) ||
      p.includes(path.sep + 'norka' + path.sep) ||
      p.includes(path.sep + 'sahayi' + path.sep) ||
      p.includes(path.sep + 'travel' + path.sep)) {
    if (pageContent.includes('src="./js/')) {
      pageContent = pageContent.replace(/src="\.\/js\//g, 'src="/js/');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(p, pageContent, 'utf8');
    console.log(`✅ Updated ${path.relative(rootDir, p)}`);
  }
});
