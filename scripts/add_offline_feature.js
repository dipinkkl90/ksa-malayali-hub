const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Update js/pwa.js
const pwaJsPath = path.join(rootDir, 'js', 'pwa.js');
let pwaJs = fs.readFileSync(pwaJsPath, 'utf8');

if (!pwaJs.includes('window.triggerPWAInstall')) {
  const triggerCode = `
  // 6. Global PWA Install & Offline Guide Trigger
  window.triggerPWAInstall = function() {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      showToast("✅ സൗദി മലയാളി ഹബ് നിങ്ങളുടെ ഫോണിൽ ഇതിനകം ഇൻസ്റ്റാൾ ചെയ്തിട്ടുണ്ട്! ഹോം സ്ക്രീനിൽ നിന്ന് നേരിട്ട് തുറക്കാം.", 4500);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice && choice.outcome === "accepted") {
          console.log("[PWA] User accepted installation from directory card");
        }
        deferredPrompt = null;
        hideInstallBanner();
      });
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      showToast("📲 iPhone-ൽ ആപ്പ് ആക്കാൻ: Safari താഴെ Share ബട്ടൺ അമർത്തി 'Add to Home Screen' തിരഞ്ഞെടുക്കുക.", 5500);
    } else {
      showToast("📲 ഫോണിൽ ഇൻസ്റ്റാൾ ചെയ്യാൻ: ബ്രൗസർ മെനുവിൽ (⋮) ക്ലിക്ക് ചെയ്ത് 'Install app' അല്ലെങ്കിൽ 'Add to Home screen' നൽകുക.", 5500);
    }
  };
`;
  pwaJs = pwaJs.replace('// Initialize all PWA components', triggerCode + '\n  // Initialize all PWA components');
  fs.writeFileSync(pwaJsPath, pwaJs, 'utf8');
  console.log('Updated js/pwa.js with window.triggerPWAInstall');
}

// 2. Update js/features_summary.js
const summaryJsPath = path.join(rootDir, 'js', 'features_summary.js');
let summaryJs = fs.readFileSync(summaryJsPath, 'utf8');

const oldCat4 = `🗣️ *4. ഭാഷ & വിജ്ഞാനം:*
• 🎙️ 3-ഭാഷാ വോയ്സ് ട്രാൻസ്ലേറ്റർ (മലയാളം ⇄ അറബിക്, ഇംഗ്ലീഷ്, ഹിന്ദി)
• 📖 4-ഭാഷാ പ്രവാസി ഡിക്ഷണറി & മെഡിക്കൽ സംഭാഷണങ്ങൾ
• 📚 മലയാളം ഡിജിറ്റൽ ഇ-ലൈബ്രറി (സമ്പൂർണ്ണ PDF ഡൗൺലോഡ്)
• 🔍 സൈറ്റ്-വൈഡ് ലൈവ് സെർച്ച് (1 അക്ഷരം ടൈപ്പ് ചെയ്യുമ്പോൾ തിരയാം)`;

const newCat4 = `🗣️ *4. ഭാഷ, ആപ്പ് & ഡിജിറ്റൽ വിജ്ഞാനം:*
• 📶 നെറ്റ് ഇല്ലാതെയും പ്രവർത്തിക്കും (Works Offline · PWA App) — Play Store ഇല്ലാതെ ഫോണിൽ ആപ്പ് ആയി ഇൻസ്റ്റാൾ ചെയ്യാം. ഇന്റർനെറ്റ് ഇല്ലാത്ത സമയത്തും എമർജൻസി നമ്പറുകൾ, ഗ്രാറ്റുവിറ്റി കാൽക്കുലേറ്റർ, 4-ഭാഷാ ഡിക്ഷണറി, സിം കോഡുകൾ, ഹിജ്രി കലണ്ടർ എന്നിവ തടസ്സമില്ലാതെ പ്രവർത്തിക്കും.
• 🎙️ 3-ഭാഷാ വോയ്സ് ട്രാൻസ്ലേറ്റർ (മലയാളം ⇄ അറബിക്, ഇംഗ്ലീഷ്, ഹിന്ദി)
• 📖 4-ഭാഷാ പ്രവാസി ഡിക്ഷണറി & മെഡിക്കൽ സംഭാഷണങ്ങൾ
• 📚 മലയാളം ഡിജിറ്റൽ ഇ-ലൈബ്രറി (സമ്പൂർണ്ണ PDF ഡൗൺലോഡ്)
• 🔍 സൈറ്റ്-വൈഡ് ലൈവ് സെർച്ച് (1 അക്ഷരം ടൈപ്പ് ചെയ്യുമ്പോൾ തിരയാം)`;

if (summaryJs.includes('🗣️ *4. ഭാഷ & വിജ്ഞാനം:*')) {
  summaryJs = summaryJs.replace(oldCat4, newCat4);
  fs.writeFileSync(summaryJsPath, summaryJs, 'utf8');
  console.log('Updated js/features_summary.js FEATURES_TEXT with Offline PWA bullet');
} else {
  // Try regex replace if exact text differed slightly
  summaryJs = summaryJs.replace(/🗣️ \*4\. [^\*]+\*:\n/, `🗣️ *4. ഭാഷ, ആപ്പ് & ഡിജിറ്റൽ വിജ്ഞാനം:*\n• 📶 നെറ്റ് ഇല്ലാതെയും പ്രവർത്തിക്കും (Works Offline · PWA App) — Play Store ഇല്ലാതെ ഫോണിൽ ആപ്പ് ആയി ഇൻസ്റ്റാൾ ചെയ്യാം. ഇന്റർനെറ്റ് ഇല്ലാത്ത സമയത്തും എമർജൻസി നമ്പറുകൾ, ഗ്രാറ്റുവിറ്റി കാൽക്കുലേറ്റർ, 4-ഭാഷാ ഡിക്ഷണറി, സിം കോഡുകൾ, ഹിജ്രി കലണ്ടർ എന്നിവ തടസ്സമില്ലാതെ പ്രവർത്തിക്കും.\n`);
  fs.writeFileSync(summaryJsPath, summaryJs, 'utf8');
  console.log('Regex updated js/features_summary.js with Offline PWA bullet');
}

// 3. Update index.html
const indexHtmlPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Update Category 4 in index.html
const cat4HeaderTarget = `<h3 class="category-title-ml">ഭാഷ & ഡിജിറ്റൽ വിജ്ഞാനം</h3>
                  <div class="category-title-en">Voice Translator, Dictionary & E-Library</div>
                </div>
              </div>
              <span class="category-count-pill">4 സൗകര്യങ്ങൾ</span>`;

const cat4HeaderReplacement = `<h3 class="category-title-ml">ഭാഷ, ആപ്പ് & ഡിജിറ്റൽ വിജ്ഞാനം</h3>
                  <div class="category-title-en">Voice Translator, Offline App & E-Library</div>
                </div>
              </div>
              <span class="category-count-pill">5 സൗകര്യങ്ങൾ</span>`;

const offlineCardHtml = `              <!-- Offline PWA App Feature Card -->
              <a href="javascript:void(0)" class="feature-dir-link feature-pwa-offline-highlight" id="dir-offline-pwa-link" onclick="window.triggerPWAInstall && window.triggerPWAInstall()" title="ഫോണിൽ ഇൻസ്റ്റാൾ ചെയ്യുക (Works Offline)">
                <div class="dir-link-left">
                  <span class="dir-link-icon" style="font-size:1.35rem;">📶</span>
                  <div class="dir-link-text">
                    <strong style="color:var(--brand); display:flex; align-items:center; gap:6px;">
                      📶 നെറ്റ് ഇല്ലാതെയും പ്രവർത്തിക്കും (Works Offline · PWA App)
                      <span style="font-size:0.68rem; font-weight:800; background:#047857; color:#fff; padding:2px 7px; border-radius:999px;">PWA</span>
                    </strong>
                    <span>Play Store ഇല്ലാതെ ഫോണിൽ ആപ്പ് ആയി ഇൻസ്റ്റാൾ ചെയ്യാം. ഇന്റർനെറ്റ് ഇല്ലാത്ത സമയത്തും എമർജൻസി നമ്പറുകൾ, ഗ്രാറ്റുവിറ്റി കാൽക്കുലേറ്റർ, 4-ഭാഷാ ഡിക്ഷണറി, സിം കോഡുകൾ, ഹിജ്രി കലണ്ടർ എന്നിവ തടസ്സമില്ലാതെ പ്രവർത്തിക്കും.</span>
                  </div>
                </div>
                <span class="dir-link-arrow" style="background:#047857; color:#ffffff; border-radius:50%; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; font-size:0.85rem; font-weight:800;" title="ഇൻസ്റ്റാൾ ചെയ്യുക">⬇️</span>
              </a>\n\n`;

if (indexHtml.includes(cat4HeaderTarget)) {
  indexHtml = indexHtml.replace(cat4HeaderTarget, cat4HeaderReplacement);
  console.log('Updated Category 4 header in index.html to 5 സൗകര്യങ്ങൾ');
}

// Insert offlineCardHtml right after `<div class="category-links-list">` of Category 4
const cat4LinksListTarget = `<!-- Category 4: ഭാഷ & ഡിജിറ്റൽ വിജ്ഞാനം -->`;
const cat4LinksListTargetAlt = `<!-- Category 4:`;

const pos = indexHtml.indexOf('Voice Translator, Dictionary & E-Library');
const pos2 = indexHtml.indexOf('Voice Translator, Offline App & E-Library');
const actualPos = pos !== -1 ? pos : pos2;

if (actualPos !== -1) {
  const listPos = indexHtml.indexOf('<div class="category-links-list">', actualPos);
  if (listPos !== -1 && !indexHtml.includes('dir-offline-pwa-link')) {
    const insertIndex = listPos + '<div class="category-links-list">\n'.length;
    indexHtml = indexHtml.slice(0, insertIndex) + offlineCardHtml + indexHtml.slice(insertIndex);
    console.log('Inserted Offline PWA Card into Category 4 of index.html');
  }
}

// Update subtitle from 29+ to 30+
indexHtml = indexHtml.replace('29+ സൗകര്യങ്ങൾ', '30+ സൗകര്യങ്ങൾ');

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('Saved index.html');

// 4. Update css/styles.css
const cssPath = path.join(rootDir, 'css', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

if (!css.includes('.feature-pwa-offline-highlight')) {
  const pwaCss = `
/* Feature Directory: Offline PWA Highlight Card */
.feature-pwa-offline-highlight {
  background: linear-gradient(135deg, rgba(4, 120, 87, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%) !important;
  border: 1.5px solid rgba(4, 120, 87, 0.35) !important;
  box-shadow: 0 2px 8px rgba(4, 120, 87, 0.08) !important;
  cursor: pointer !important;
}

.feature-pwa-offline-highlight:hover {
  background: linear-gradient(135deg, rgba(4, 120, 87, 0.14) 0%, rgba(245, 158, 11, 0.14) 100%) !important;
  border-color: #047857 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(4, 120, 87, 0.16) !important;
}

[data-theme="dark"] .feature-pwa-offline-highlight {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%) !important;
  border-color: rgba(52, 211, 153, 0.35) !important;
}

[data-theme="dark"] .feature-pwa-offline-highlight:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(245, 158, 11, 0.18) 100%) !important;
  border-color: #34d399 !important;
}
`;
  css += '\n' + pwaCss + '\n';
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Appended .feature-pwa-offline-highlight CSS to css/styles.css');
}
