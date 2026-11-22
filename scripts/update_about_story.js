const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Update index.html - Remove about-dj-section so it only lives on /about
const indexHtmlPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const startTag = '<!-- About D&J Techies — Our Origin Story Section -->';
const endTag = '</section>\n\n  \n  <!-- SECTION: All 100% Working Features Directory';

if (indexHtml.includes(startTag)) {
  const startIndex = indexHtml.indexOf(startTag);
  const endSectionIndex = indexHtml.indexOf('<!-- SECTION: All 100% Working Features Directory', startIndex);
  if (startIndex !== -1 && endSectionIndex !== -1) {
    indexHtml = indexHtml.slice(0, startIndex) + indexHtml.slice(endSectionIndex);
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
    console.log('Successfully removed about-dj-section from index.html (Home page)');
  }
}

// 2. Update js/i18n.js
const i18nPath = path.join(rootDir, 'js', 'i18n.js');
let i18n = fs.readFileSync(i18nPath, 'utf8');

const oldLeadMl = 'aboutLead: "സൗദി അറേബ്യയിലെ യാത്രകളിലും പ്രവാസ ജീവിതത്തിലും നാടൻ കേരള ഭക്ഷണശാലകൾ കണ്ടെത്തുന്നതിൽ രണ്ട് വ്യക്തികൾ എന്ന നിലയിൽ ഞങ്ങൾ നേരിട്ട് അനുഭവിച്ച പ്രയാസങ്ങളിൽ നിന്നാണ് ഈ ആശയം തുടങ്ങിയത്.",';
const newLeadMl = 'aboutLead: "സൗദി അറേബ്യയിലെ പ്രവാസ ജീവിതത്തിൽ നാടൻ ഭക്ഷണം, ഇൻഷുറൻസ് ക്ലിനിക്കുകൾ, തൊഴിൽ നിയമങ്ങൾ, യാത്രാ വിവരങ്ങൾ എന്നിവ ഒറ്റയിടത്ത് കണ്ടെത്തുന്നതിൽ ഞങ്ങൾ നേരിട്ട് അനുഭവിച്ച പ്രയാസങ്ങളിൽ നിന്നാണ് ഈ ആശയം തുടങ്ങിയത്.",';

if (i18n.includes(oldLeadMl)) {
  i18n = i18n.replace(oldLeadMl, newLeadMl);
} else {
  // Regex replacement
  i18n = i18n.replace(/aboutLead:\s*"സൗദി അറേബ്യയിലെ യാത്രകളിലും[^"]+",/, newLeadMl);
}

const oldLeadEn = 'aboutLead: "D&J Techies began with two individuals who faced the exact everyday challenges Malayalis experience while living and travelling across Saudi Arabia — finding authentic, dependable Kerala food away from home.",';
const newLeadEn = 'aboutLead: "D&J Techies began with two individuals who faced the exact everyday challenges Malayalis experience while living across Saudi Arabia — finding authentic Kerala food, insurance clinics, labor law guides, and travel information all in one place.",';

if (i18n.includes(oldLeadEn)) {
  i18n = i18n.replace(oldLeadEn, newLeadEn);
}

fs.writeFileSync(i18nPath, i18n, 'utf8');
console.log('Successfully updated js/i18n.js');

// 3. Update about.html and about/index.html
const storySectionHtml = `      <!-- ഞങ്ങളുടെ കഥ · D&J TECHIES (Origin Story) -->
      <section id="about-dj-section" class="about-dj-card" style="margin-top:24px; margin-bottom:28px;">
        <div class="about-dj-header">
          <div class="about-dj-eyebrow">
            <span class="about-dj-dot" aria-hidden="true"></span>
            <span>ഞങ്ങളുടെ കഥ · D&J TECHIES</span>
          </div>
          <h2 style="font-size:1.45rem; font-weight:800; color:var(--text); margin-bottom:14px; line-height:1.28;">
            രണ്ട് വ്യക്തികൾ നേരിട്ട പ്രശ്നങ്ങളിൽ നിന്ന് പിറന്നൊരു പരിഹാരം
          </h2>
          <p class="about-dj-lead" style="font-weight:700; color:var(--text); font-size:1.02rem; line-height:1.65; margin-bottom:12px;">
            സൗദി അറേബ്യയിലെ പ്രവാസ ജീവിതത്തിൽ നാടൻ ഭക്ഷണം, ഇൻഷുറൻസ് ക്ലിനിക്കുകൾ, തൊഴിൽ നിയമങ്ങൾ, യാത്രാ വിവരങ്ങൾ എന്നിവ ഒറ്റയിടത്ത് കണ്ടെത്തുന്നതിൽ ഞങ്ങൾ നേരിട്ട് അനുഭവിച്ച പ്രയാസങ്ങളിൽ നിന്നാണ് ഈ ആശയം തുടങ്ങിയത്.
          </p>
          <p class="about-dj-body" style="color:var(--text-secondary); font-size:0.95rem; line-height:1.7; margin-bottom:24px;">
            ഞങ്ങൾ നേരിട്ട ആ പ്രശ്നങ്ങൾക്ക് മറ്റുള്ളവർക്കും ഉപകാരപ്പെടുന്ന പ്രായോഗികമായ ഒരു പരിഹാരം എന്ന നിലയ്ക്കാണ് D&J Techies ഈ പ്ലാറ്റ്ഫോം രൂപകൽപ്പന ചെയ്തത്. സൗദിയിലെ 11 നഗരങ്ങളിലെയും മലയാളികൾക്ക് വിശ്വസ്തവും എളുപ്പത്തിൽ ഉപയോഗിക്കാവുന്നതുമായ ഒരു ഡിജിറ്റൽ സഹായിയാണിത്.
          </p>
        </div>

        <div class="about-pillars">
          <article class="about-pillar">
            <div class="about-pillar-icon" aria-hidden="true">D&J</div>
            <h3 style="color:var(--text); font-size:1rem; font-weight:700; margin:0 0 6px;">രണ്ട് വ്യക്തികൾ, ഒരു ലക്ഷ്യം</h3>
            <p style="color:var(--text-secondary); font-size:0.88rem; line-height:1.5; margin:0;">ഞങ്ങൾ നേരിട്ട യഥാർത്ഥ പ്രയാസങ്ങൾക്ക് സാങ്കേതികവിദ്യയിലൂടെ ശാശ്വത പരിഹാരം കണ്ടെത്തുന്നു.</p>
          </article>

          <article class="about-pillar">
            <div class="about-pillar-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <h3 style="color:var(--text); font-size:1rem; font-weight:700; margin:0 0 6px;">അഡ്മിൻ വെരിഫൈഡ് കൃത്യത</h3>
            <p style="color:var(--text-secondary); font-size:0.88rem; line-height:1.5; margin:0;">സൗദിയിലെ 11 നഗരങ്ങളിലെയും വിവരങ്ങൾ അഡ്മിൻ നേരിട്ട് പരിശോധിച്ച് വിശ്വാസ്യത ഉറപ്പാക്കുന്നു.</p>
          </article>

          <article class="about-pillar">
            <div class="about-pillar-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <h3 style="color:var(--text); font-size:1rem; font-weight:700; margin:0 0 6px;">നേരിട്ടുള്ള സപ്പോർട്ട്</h3>
            <p style="color:var(--text-secondary); font-size:0.88rem; line-height:1.5; margin:0;">അഭിപ്രായങ്ങൾക്കോ സഹായത്തിനോ +44 7460 646263 എന്ന നമ്പറിൽ D&J Techies-മായി ബന്ധപ്പെടാം.</p>
          </article>
        </div>
      </section>\n\n`;

function updateAboutFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // If about-dj-section already exists in about file, remove or replace it
  if (content.includes('id="about-dj-section"')) {
    const reg = /<!-- ഞങ്ങളുടെ കഥ · D&J TECHIES[\s\S]*?<\/section>/;
    content = content.replace(reg, '');
  }

  // Insert right before `<div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:24px; margin-top:20px;">\n        <h2 style="color:#fde047; font-size:1.25rem; font-weight:800; margin-bottom:12px;">🌟 ഞങ്ങളുടെ ലക്ഷ്യം`
  const missionTarget = '<h2 style="color:#fde047; font-size:1.25rem; font-weight:800; margin-bottom:12px;">🌟 ഞങ്ങളുടെ ലക്ഷ്യം';
  const missionPos = content.indexOf(missionTarget);
  if (missionPos !== -1) {
    const beforeMissionDiv = content.lastIndexOf('<div style="border-top:', missionPos);
    if (beforeMissionDiv !== -1) {
      content = content.slice(0, beforeMissionDiv) + storySectionHtml + content.slice(beforeMissionDiv);
    } else {
      content = content.slice(0, missionPos) + storySectionHtml + content.slice(missionPos);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated', path.relative(rootDir, filePath));
}

updateAboutFile(path.join(rootDir, 'about.html'));
updateAboutFile(path.join(rootDir, 'about', 'index.html'));
