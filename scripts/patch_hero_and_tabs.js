const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'css', 'styles.css');

// 1. Patch index.html prayer button
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const oldPrayerPattern = /<a href="\/saudi#saudi-prayer-calendar-section" class="hero-cta-ghost"[^>]*>[\s\S]*?<span>🕌 നമസ്കാര സമയം<\/span>[\s\S]*?<\/a>/;
const newPrayerButton = `<a href="/saudi#saudi-prayer-calendar-section" class="hero-cta-ghost hero-cta-prayer" style="border-color:rgba(52,211,153,0.4); background:rgba(4,120,87,0.25); color:#ffffff !important; text-decoration:none;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
            <span style="color:#ffffff !important;">🕌 നമസ്കാര സമയം</span>
          </a>`;

if (oldPrayerPattern.test(indexHtml)) {
  indexHtml = indexHtml.replace(oldPrayerPattern, newPrayerButton);
  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log('✅ Successfully updated prayer button in index.html to crisp white #ffffff');
} else {
  console.warn('⚠️ Prayer button pattern not matched in index.html');
}

// 2. Patch css/styles.css
let css = fs.readFileSync(cssPath, 'utf8');

// Replace continuous pulsing animations on hero buttons so they are completely still by default
const heroFixes = `
/* ==========================================================================
   HERO BUTTONS CLEANUP (PROMPT 10) & VIEW-SWITCHER BULLETPROOF SINGLE-LINE FIX
   ========================================================================== */

/* 1. HERO QUICK-ACTION PILL BUTTONS: Strictly No Idle Animations, Subtle Scale(1.02) Hover */
.hero-cta-row button,
.hero-cta-row a,
.hero-cta-gold,
.hero-cta-ghost,
.hero-cta-tourism,
.hero-cta-heritage,
.hero-cta-account,
.hero-cta-library,
.hero-cta-daily,
.hero-cta-prayer,
.hero-pill-badge {
  animation: none !important;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease !important;
}

.hero-cta-row button:hover,
.hero-cta-row a:hover,
.hero-cta-gold:hover,
.hero-cta-ghost:hover,
.hero-cta-tourism:hover,
.hero-cta-heritage:hover,
.hero-cta-account:hover,
.hero-cta-library:hover,
.hero-cta-daily:hover,
.hero-cta-prayer:hover {
  transform: scale(1.02) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
}

.hero-cta-row button:active,
.hero-cta-row a:active {
  transform: scale(0.98) !important;
}

/* Prayer Time Hero Button White Contrast */
.hero-cta-prayer,
.hero-cta-prayer span {
  color: #ffffff !important;
}
.hero-cta-prayer svg {
  stroke: #ffffff !important;
  color: #ffffff !important;
}

/* 2. VIEW SWITCHER TABS: Bulletproof Single-Line, Zero Wrapping, Elegant Pill Radius */
.view-switcher {
  display: inline-flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch !important;
  scrollbar-width: none !important;
  white-space: nowrap !important;
  max-width: 100% !important;
  gap: 6px !important;
  padding: 5px 6px !important;
  box-sizing: border-box !important;
}

.view-switcher::-webkit-scrollbar {
  display: none !important;
}

.view-btn {
  display: inline-flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: center !important;
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  flex: 0 0 auto !important;
  flex-shrink: 0 !important;
  width: auto !important;
  max-width: none !important;
  height: 42px !important;
  min-height: 42px !important;
  max-height: 42px !important;
  line-height: 1 !important;
  border-radius: 9999px !important;
  padding: 8px 16px !important;
  box-sizing: border-box !important;
  text-align: center !important;
  vertical-align: middle !important;
}

.view-btn > * {
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  flex-shrink: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  line-height: 1 !important;
}

.view-btn span {
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  display: inline !important;
  line-height: 1 !important;
}

.view-btn svg {
  display: inline-block !important;
  flex-shrink: 0 !important;
  vertical-align: middle !important;
}

.view-tab-pill {
  white-space: nowrap !important;
  word-break: keep-all !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  height: 20px !important;
  padding: 0 8px !important;
  border-radius: 9999px !important;
  margin-left: 2px !important;
}

/* Active Pill Style - Sleek proportions, never bloated */
.view-btn.active {
  height: 42px !important;
  min-height: 42px !important;
  max-height: 42px !important;
  border-radius: 9999px !important;
  padding: 8px 18px !important;
}

[data-theme="dark"] .view-btn.active {
  background: var(--gold-bright) !important;
  color: #161002 !important;
  box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3) !important;
}

[data-theme="dark"] .view-btn.active .view-tab-pill {
  background: rgba(22, 16, 2, 0.22) !important;
  color: #161002 !important;
  border: 1px solid rgba(22, 16, 2, 0.25) !important;
}

/* Mobile View Switcher Override Protection */
@media (max-width: 768px) {
  .view-switcher {
    display: flex !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    width: 100% !important;
  }
  .view-btn {
    flex: 0 0 auto !important;
    flex-shrink: 0 !important;
    white-space: nowrap !important;
    height: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;
    padding: 6px 14px !important;
    font-size: 0.82rem !important;
  }
  .view-btn span {
    white-space: nowrap !important;
    word-break: keep-all !important;
  }
}
`;

css += '\n' + heroFixes + '\n';
fs.writeFileSync(cssPath, css, 'utf8');
console.log('✅ Successfully added Hero & View-Switcher bulletproof styles to styles.css');
