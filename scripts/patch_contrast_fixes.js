const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const contrastFixes = `
/* -------------------------------------------------------------------------- */
/* CRITICAL CONTRAST & ACCESSIBILITY FIXES (LIGHT & DARK MODES)              */
/* -------------------------------------------------------------------------- */

/* Health Hero Badge */
.health-badge {
  background: #d1fae5 !important;
  border: 1px solid #86efac !important;
  color: #065f46 !important;
  font-weight: 800 !important;
}

[data-theme="dark"] .health-badge {
  background: rgba(16, 185, 129, 0.14) !important;
  border-color: rgba(16, 185, 129, 0.35) !important;
  color: #6ee7b7 !important;
}

/* Health Quick Section Jump Pills */
.health-pill-link {
  background: #ffffff !important;
  border: 1.5px solid #cbd5e1 !important;
  color: #0f172a !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08) !important;
}

.health-pill-link:hover {
  background: #ecfdf5 !important;
  border-color: #047857 !important;
  color: #047857 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(4, 120, 87, 0.15) !important;
}

[data-theme="dark"] .health-pill-link {
  background: rgba(255, 255, 255, 0.06) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #f8fafc !important;
  box-shadow: none !important;
}

[data-theme="dark"] .health-pill-link:hover {
  background: rgba(16, 185, 129, 0.2) !important;
  border-color: rgba(16, 185, 129, 0.4) !important;
  color: #ffffff !important;
}

/* 11 Cities & Phrasebook Filter Tabs */
.city-tab-btn,
.phrase-tab-btn {
  background: #ffffff !important;
  border: 1.5px solid #cbd5e1 !important;
  color: #1e293b !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.05) !important;
  white-space: nowrap !important;
}

.city-tab-btn:hover,
.phrase-tab-btn:hover {
  background: #f1f5f9 !important;
  border-color: #94a3b8 !important;
  color: #0f172a !important;
}

.city-tab-btn.active,
.phrase-tab-btn.active {
  background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
  border-color: #047857 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35) !important;
}

[data-theme="dark"] .city-tab-btn,
[data-theme="dark"] .phrase-tab-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  color: #cbd5e1 !important;
  box-shadow: none !important;
}

[data-theme="dark"] .city-tab-btn:hover,
[data-theme="dark"] .phrase-tab-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
}

[data-theme="dark"] .city-tab-btn.active,
[data-theme="dark"] .phrase-tab-btn.active {
  background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
  border-color: #34d399 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.45) !important;
}
`;

css += '\n' + contrastFixes + '\n';
fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully appended critical contrast fixes to styles.css');
