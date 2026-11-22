const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Update .pwa-install-banner styles
const oldPwaBannerPattern = /\/\* PWA Install Banner \*\/[\s\S]*?\.pwa-install-banner\.show \{[\s\S]*?\}[\s\S]*?@media \(min-width: 769px\) \{[\s\S]*?\.pwa-install-banner \{[\s\S]*?\}[\s\S]*?\}/;

const newPwaBanner = `/* PWA Install Banner - Guaranteed Zero Overlap with Floating WhatsApp & Navigation */
.pwa-install-banner {
  position: fixed !important;
  left: 20px !important;
  right: auto !important;
  bottom: 24px !important;
  max-width: 420px !important;
  width: auto !important;
  z-index: 140 !important;
  background: #064e3b;
  border: 1.5px solid #f59e0b;
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.pwa-install-banner.show {
  opacity: 1 !important;
  transform: translateY(0) !important;
  pointer-events: auto !important;
}

@media (max-width: 768px) {
  .pwa-install-banner {
    left: 14px !important;
    right: 14px !important;
    bottom: calc(140px + env(safe-area-inset-bottom, 0px)) !important;
    max-width: none !important;
    width: auto !important;
  }
}`;

if (oldPwaBannerPattern.test(css)) {
  css = css.replace(oldPwaBannerPattern, newPwaBanner);
  console.log('Successfully updated .pwa-install-banner in css/styles.css');
} else {
  console.warn('Could not match old .pwa-install-banner pattern');
}

// 2. Update .working-features styles to support 5 categories
const oldFeaturesGridPattern = /\/\* Features Grid \*\/[\s\S]*?@media \(max-width: 640px\) \{[\s\S]*?\.working-features-card \{[\s\S]*?\}[\s\S]*?\.features-grid-list \{[\s\S]*?\}[\s\S]*?\.btn-features-action \{[\s\S]*?\}[\s\S]*?\}/;

const newFeaturesGrid = `/* 5-Category Working Features Directory Grid */
.features-categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 900px) {
  .features-categories-grid {
    grid-template-columns: 1fr;
  }
}

.feature-category-card {
  background: var(--surface-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.feature-category-card:hover {
  border-color: rgba(4, 120, 87, 0.4);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

[data-theme="dark"] .feature-category-card {
  background: #111d20;
  border-color: rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .feature-category-card:hover {
  border-color: var(--gold-border);
}

.category-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.category-icon-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  font-size: 1.8rem;
  line-height: 1;
  flex-shrink: 0;
}

.category-title-ml {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 2px;
  line-height: 1.35;
}

.category-title-en {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
}

.category-count-pill {
  font-size: 0.74rem;
  font-weight: 800;
  background: rgba(4, 120, 87, 0.1);
  color: var(--brand);
  border: 1px solid rgba(4, 120, 87, 0.25);
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}

[data-theme="dark"] .category-count-pill {
  background: rgba(245, 158, 11, 0.15);
  color: var(--gold-bright);
  border-color: rgba(245, 158, 11, 0.3);
}

.category-links-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-links-grid-2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (max-width: 680px) {
  .category-links-grid-2col {
    grid-template-columns: 1fr;
  }
}

.feature-dir-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  text-decoration: none;
  color: var(--text);
  min-height: 52px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.feature-dir-link:hover {
  background: rgba(4, 120, 87, 0.05);
  border-color: var(--brand);
  transform: translateX(3px);
}

[data-theme="dark"] .feature-dir-link {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.06);
  color: #f8fafc;
}

[data-theme="dark"] .feature-dir-link:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--brand-light);
  transform: translateX(3px);
}

.dir-link-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.dir-link-icon {
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.dir-link-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dir-link-text strong {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.35;
}

[data-theme="dark"] .dir-link-text strong {
  color: #f8fafc;
}

.dir-link-text span {
  font-size: 0.76rem;
  color: var(--text-muted);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dir-link-arrow {
  font-size: 1rem;
  font-weight: 800;
  color: var(--brand);
  opacity: 0.6;
  flex-shrink: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.feature-dir-link:hover .dir-link-arrow {
  opacity: 1;
  transform: translate(2px, -2px);
}

[data-theme="dark"] .dir-link-arrow {
  color: var(--gold-bright);
}

.features-footer-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 22px;
  border-top: 1px solid var(--border);
}

@media (max-width: 640px) {
  .working-features-card {
    padding: 22px 16px;
  }
  .btn-features-action {
    width: 100%;
  }
}`;

if (oldFeaturesGridPattern.test(css)) {
  css = css.replace(oldFeaturesGridPattern, newFeaturesGrid);
  console.log('Successfully updated .features-categories-grid in css/styles.css');
} else {
  console.warn('Could not match old .features-grid-list pattern');
}

// 3. Add view-btn nowrap and health hero / clinic suggest contrast fixes
const additionalFixes = `
/* Additional Global Contrast & Layout Protections */
.view-btn {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.view-btn span {
  white-space: nowrap !important;
}

.view-tab-pill {
  white-space: nowrap !important;
}

.health-title {
  color: #047857 !important;
}

[data-theme="dark"] .health-title {
  color: #5eead4 !important;
}

.health-subtitle {
  color: #334155 !important;
}

[data-theme="dark"] .health-subtitle {
  color: #cbd5e1 !important;
}

.clinic-suggest-cta {
  background: linear-gradient(135deg, #064e3b 0%, #047857 100%) !important;
  border: 1px solid rgba(245, 158, 11, 0.4) !important;
  border-radius: 16px !important;
  padding: 24px !important;
  color: #ffffff !important;
}

.clinic-suggest-cta .clinic-suggest-text h4 {
  color: #fde047 !important;
  font-size: 1.15rem !important;
  font-weight: 800 !important;
  margin: 0 0 6px !important;
}

.clinic-suggest-cta .clinic-suggest-text p {
  color: #f8fafc !important;
  font-size: 0.92rem !important;
  line-height: 1.55 !important;
  margin: 0 !important;
}
`;

css += '\n' + additionalFixes;

fs.writeFileSync(cssPath, css, 'utf8');
console.log('css/styles.css updated successfully');
