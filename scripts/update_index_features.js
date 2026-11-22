const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Remove the orphan admin telemetry box (lines ~1849-1871)
const orphanPattern = /<div class="traffic-public-notice">[\s\S]*?Reset Real Telemetry[\s\S]*?Done \/ Close<\/button>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

if (orphanPattern.test(html)) {
  html = html.replace(orphanPattern, '');
  console.log('Successfully removed orphan admin telemetry box');
} else {
  console.log('Orphan pattern not matched via regex, testing substring search');
  const startStr = '<div class="traffic-public-notice">';
  const endStr = 'Reset Real Telemetry</button>\n          <button type="button" id="admin-traffic-done-btn" class="btn-whatsapp-solid">Done / Close</button>\n        </div>\n      </div>\n    </div>\n  </div>';
  const startIdx = html.indexOf(startStr);
  const endIdx = html.indexOf(endStr);
  if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + html.substring(endIdx + endStr.length);
    console.log('Successfully removed orphan admin telemetry box via substring');
  } else {
    console.warn('Could not locate orphan admin telemetry box');
  }
}

// 2. Replace the contents of #working-features-section
const featuresSectionPattern = /<!-- SECTION: All 100% Working Features Directory[\s\S]*?<\/section>/;

const newFeaturesSection = `<!-- SECTION: All 100% Working Features Directory (സൗദി മലയാളി ഹബ്ബിൽ ലഭ്യമായ എല്ലാ സൗകര്യങ്ങളും) -->
  <section id="working-features-section" class="working-features-section" aria-labelledby="working-features-title">
    <div class="container">
      <div class="working-features-card">
        <div class="features-head">
          <div class="features-badge-wrap">
            <span class="features-trust-badge">✅ 100% VERIFIED WORKING FEATURES</span>
          </div>
          <h2 id="working-features-title" class="features-title">
            സൗദി മലയാളി ഹബ്ബിൽ ലഭ്യമായ എല്ലാ സൗകര്യങ്ങളും (All Features at a Glance)
          </h2>
          <p class="features-subtitle">
            സൗദി പ്രവാസികളുടെ ദൈനംദിന ജീവിതത്തിനും ജോലിക്കും യാത്രയ്ക്കും അത്യാവശ്യമായ 29+ സൗകര്യങ്ങൾ — 100% സൗജന്യമായി. താഴെയുള്ള ഏതൊരു സൗകര്യത്തിലും ക്ലിക്ക് ചെയ്താൽ നേരിട്ട് ആ പേജിലേക്ക് / ടൂളിലേക്ക് പോകാം.
          </p>

          <!-- Top Action Buttons -->
          <div class="features-actions-row">
            <button type="button" id="copy-features-list-btn" class="btn-features-action btn-features-copy">
              <span>📋 ലിസ്റ്റ് കോപ്പി ചെയ്യുക (Copy Full List)</span>
            </button>
            <a id="share-features-wa-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn-features-action btn-features-wa">
              <span>📲 WhatsApp-ൽ ഷെയർ ചെയ്യുക</span>
            </a>
          </div>
        </div>

        <!-- 5 Structured Category Cards Grid with Direct Clickable Navigation -->
        <div class="features-categories-grid">

          <!-- Category 1: ഭക്ഷണം, ഓഫറുകൾ & വിനോദം -->
          <div class="feature-category-card">
            <div class="category-card-header">
              <div class="category-icon-title">
                <span class="category-icon">🍽️</span>
                <div>
                  <h3 class="category-title-ml">ഭക്ഷണം, ഓഫറുകൾ & വിനോദം</h3>
                  <div class="category-title-en">Food, Mall Offers & Entertainment</div>
                </div>
              </div>
              <span class="category-count-pill">4 സൗകര്യങ്ങൾ</span>
            </div>
            <div class="category-links-list">
              <a href="#cards-grid" class="feature-dir-link" onclick="document.getElementById('view-grid-btn').click();">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🍲</span>
                  <div class="dir-link-text">
                    <strong>സൗദിയിലെ മലയാളി ഹോട്ടലുകൾ (11 നഗരങ്ങൾ)</strong>
                    <span>174+ മലയാളി റെസ്റ്റോറന്റുകൾ, തനത് വിഭവങ്ങൾ, മാപ്പ് & ഫോൺ നമ്പറുകൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="#hypers-section" class="feature-dir-link" onclick="document.getElementById('view-hypers-btn').click();">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🛍️</span>
                  <div class="dir-link-text">
                    <strong>സൂപ്പർമാർക്കറ്റ് & മാൾ ഓഫറുകൾ</strong>
                    <span>ലുലു, നെസ്റ്റോ, പാണ്ട, ഗ്രാൻഡ് ഹൈപ്പർ പ്രൊമോഷൻ ഫ്ലയറുകൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="#daily-section" class="feature-dir-link" onclick="document.getElementById('view-daily-btn').click();">
                <div class="dir-link-left">
                  <span class="dir-link-icon">💱</span>
                  <div class="dir-link-text">
                    <strong>ലൈവ് റിയാൽ & സ്വർണ്ണ നിരക്കുകൾ</strong>
                    <span>തത്സമയ കറൻസി കാൽക്കുലേറ്റർ, 24K/22K സ്വർണ്ണ വില, 29 ബാങ്ക് IBAN ചെക്കർ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="#cinemas-section" class="feature-dir-link" onclick="document.getElementById('view-cinemas-btn').click();">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🎬</span>
                  <div class="dir-link-text">
                    <strong>സിനിമകൾ (VOX & Muvi) & OTT റിലീസുകൾ</strong>
                    <span>സൗദി തിയേറ്റർ ടൈമിംഗുകളും പുതിയ മലയാളം OTT റിലീസുകളും</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>
            </div>
          </div>

          <!-- Category 2: പ്രവാസി സഹായി -->
          <div class="feature-category-card">
            <div class="category-card-header">
              <div class="category-icon-title">
                <span class="category-icon">🆘</span>
                <div>
                  <h3 class="category-title-ml">പ്രവാസി സഹായി & നിയമ സഹായം</h3>
                  <div class="category-title-en">Pravasi Sahayi, EOSB & Legal Aid</div>
                </div>
              </div>
              <span class="category-count-pill">6 സൗകര്യങ്ങൾ</span>
            </div>
            <div class="category-links-list">
              <a href="/sahayi.html#emergency-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🚨</span>
                  <div class="dir-link-text">
                    <strong>24/7 പ്രവാസി എമർജൻസി ഹെൽപ്പ്‌ലൈനുകൾ</strong>
                    <span>911 ഏകീകൃത എമർജൻസി, പോലീസ് (999), ആംബുലൻസ് (997), എംബസി ഹെൽപ്പ്‌ലൈൻ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/sahayi.html#eosb-calc-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">💰</span>
                  <div class="dir-link-text">
                    <strong>സൗദി സർവീസ് ആനുകൂല്യ (EOSB) കാൽക്കുലേറ്റർ</strong>
                    <span>സൗദി ലേബർ ലോ ആർട്ടിക്കിൾ 84 & 85 പ്രകാരമുള്ള ഗ്രാറ്റുവിറ്റി കൃത്യമായി കണക്കാക്കാം</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/sahayi.html#status-check-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">📄</span>
                  <div class="dir-link-text">
                    <strong>ഇഖാമ, ഹുറൂബ്, ഖിവ & ഫൈൻ സ്റ്റാറ്റസ് ഗൈഡ്</strong>
                    <span>അബ്ഷീർ, ഖിവ (Qiwa), MOCI ഔദ്യോഗിക പോർട്ടലുകൾ പരിശോധിക്കാനുള്ള നിർദ്ദേശങ്ങൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/sahayi.html#legal-aid-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">⚖️</span>
                  <div class="dir-link-text">
                    <strong>പ്രവാസി ലീഗൽ എയ്ഡ് & കോടതി നടപടികൾ</strong>
                    <span>ലേബർ കോർട്ട് പരാതികൾ, വേതന സംരക്ഷണം (WPS), വക്കാലത്ത് സുപ്രധാന ജാഗ്രതകൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/norka.html" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🏛️</span>
                  <div class="dir-link-text">
                    <strong>നോർക്ക റൂട്ട്സ് & പ്രവാസി ക്ഷേമനിധി ഗൈഡ്</strong>
                    <span>നോർക്ക ഐഡി കാർഡ്, ക്ഷേമനിധി പെൻഷൻ, സാന്ത്വന സഹായം, ഇൻഷുറൻസ് വിവരങ്ങൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/sahayi.html#scam-checker-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🛡️</span>
                  <div class="dir-link-text">
                    <strong>സൗദി ഓൺലൈൻ തട്ടിപ്പ് ജാഗ്രത (Scam Checker)</strong>
                    <span>വ്യാജ വിസ, ഫേക്ക് കോളിംഗ്, ഫിഷിംഗ് തട്ടിപ്പുകൾ മുൻകൂട്ടി തിരിച്ചറിയാനുള്ള ടൂൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>
            </div>
          </div>

          <!-- Category 3: ആരോഗ്യം, ഇൻഷുറൻസ് & സിം -->
          <div class="feature-category-card">
            <div class="category-card-header">
              <div class="category-icon-title">
                <span class="category-icon">🏥</span>
                <div>
                  <h3 class="category-title-ml">ആരോഗ്യം, ഇൻഷുറൻസ് & സിം</h3>
                  <div class="category-title-en">Health, Insurance & Saudi SIM Codes</div>
                </div>
              </div>
              <span class="category-count-pill">4 സൗകര്യങ്ങൾ</span>
            </div>
            <div class="category-links-list">
              <a href="/health.html#insurance-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🛡️</span>
                  <div class="dir-link-text">
                    <strong>CHI ഇൻഷുറൻസ് വാലിഡിറ്റി പരിശോധന</strong>
                    <span>ഇഖാമ നമ്പർ വഴി ഹെൽത്ത് ഇൻഷുറൻസ് പരിശോധനയും NPHIES പ്രൊവൈഡർ നെറ്റ്‌വർക്കും</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/health.html#clinics-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🏥</span>
                  <div class="dir-link-text">
                    <strong>11 നഗരങ്ങളിലെ മലയാളി പോളിക്ലിനിക്കുകൾ</strong>
                    <span>മലയാളി ഡോക്ടർമാരും ജീവനക്കാരുമുള്ള 48+ ക്ലിനിക്കുകൾ, ഫോൺ & ഗൂഗിൾ മാപ്പ്</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/health.html#customs-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">✈️</span>
                  <div class="dir-link-text">
                    <strong>യാത്രാ മരുന്ന് നിരോധന ലിസ്റ്റ് (Banned Medicines)</strong>
                    <span>കസകസ്, ട്രമഡോൾ, നാടൻ മരുന്നുകൾ എന്നിവയ്ക്കുള്ള എയർപോർട്ട് കസ്റ്റംസ് പരിശോധന</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/sahayi.html#sim-codes-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">📱</span>
                  <div class="dir-link-text">
                    <strong>സൗദി സിം കാർഡ് ബാലൻസ് & ഓഫർ കോഡുകൾ</strong>
                    <span>STC, Mobily, Zain, Virgin, Friendi, Lebara ഡയൽ കോഡുകൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>
            </div>
          </div>

          <!-- Category 4: ഭാഷ & വിജ്ഞാനം -->
          <div class="feature-category-card">
            <div class="category-card-header">
              <div class="category-icon-title">
                <span class="category-icon">🗣️</span>
                <div>
                  <h3 class="category-title-ml">ഭാഷ & ഡിജിറ്റൽ വിജ്ഞാനം</h3>
                  <div class="category-title-en">Voice Translator, Dictionary & E-Library</div>
                </div>
              </div>
              <span class="category-count-pill">4 സൗകര്യങ്ങൾ</span>
            </div>
            <div class="category-links-list">
              <a href="/health.html#voice-translator-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🎙️</span>
                  <div class="dir-link-text">
                    <strong>3-ഭാഷാ വോയ്സ് ട്രാൻസ്ലേറ്റർ (Voice Translator)</strong>
                    <span>മലയാളം ⇄ അറബിക്, ഇംഗ്ലീഷ്, ഹിന്ദി; മൈക്കിലൂടെ സംസാരിക്കാനും കേൾപ്പിക്കാനും</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/health.html#phrases-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">📖</span>
                  <div class="dir-link-text">
                    <strong>4-ഭാഷാ പ്രവാസി പോക്കറ്റ് ഡിക്ഷണറി</strong>
                    <span>മലയാളം, അറബിക്, ഇംഗ്ലീഷ്, ഹിന്ദി വാക്കുകളും ശബ്ദ ഉച്ചാരണവും തിരയാവുന്ന നിഘണ്ടു</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/explore.html?tab=library" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">📚</span>
                  <div class="dir-link-text">
                    <strong>മലയാളം ഡിജിറ്റൽ ഇ-ലൈബ്രറി (E-Library)</strong>
                    <span>ബഷീർ, എം.ടി ക്ലാസിക്കുകൾ, പ്രവാസി ഗൈഡുകൾ, സമ്പൂർണ്ണ PDF ഡൗൺലോഡ് & വായന</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="javascript:void(0)" class="feature-dir-link" onclick="window.openSearchModal && window.openSearchModal()">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🔍</span>
                  <div class="dir-link-text">
                    <strong>സൈറ്റ്-വൈഡ് തത്സമയ ലൈവ് സെർച്ച് (Instant Search)</strong>
                    <span>1 അക്ഷരം ടൈപ്പ് ചെയ്യുമ്പോൾ തന്നെ ഹോട്ടലുകൾ, സർവീസുകൾ, ടൂളുകൾ കണ്ടെത്താം</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>
            </div>
          </div>

          <!-- Category 5: യാത്ര & സൗദി ഗൈഡ് -->
          <div class="feature-category-card" style="grid-column: 1 / -1;">
            <div class="category-card-header">
              <div class="category-icon-title">
                <span class="category-icon">✈️</span>
                <div>
                  <h3 class="category-title-ml">യാത്ര & സൗദി സമഗ്ര ഗൈഡ്</h3>
                  <div class="category-title-en">Travel, Haramain Train, Prayer Times, Vision 2030 & Tourism</div>
                </div>
              </div>
              <span class="category-count-pill">11 സൗകര്യങ്ങൾ</span>
            </div>
            <div class="category-links-grid-2col">
              <a href="/travel.html#flight-timings-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🛫</span>
                  <div class="dir-link-text">
                    <strong>ലൈവ് ഫ്ലൈറ്റ് ടൈമിംഗ് & എയർപോർട്ട് സ്റ്റാറ്റസ്</strong>
                    <span>ജിദ്ദ, റിയാദ്, ദമ്മാം, മദീന, കൊച്ചി ലൈവ് ഫ്ലൈറ്റ് അറൈവൽ/ഡിപ്പാർച്ചർ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/saudi.html#haramain-train-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🚄</span>
                  <div class="dir-link-text">
                    <strong>ഹറമൈൻ ഹൈ-സ്പീഡ് ട്രെയിൻ സമഗ്ര ഗൈഡ്</strong>
                    <span>മക്ക, ജിദ്ദ എയർപോർട്ട്, മദീന ട്രെയിൻ ഷെഡ്യൂൾ, ലഗേജ് & ഔദ്യോഗിക ബുക്കിംഗ്</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/travel.html#saudi-buses-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🚌</span>
                  <div class="dir-link-text">
                    <strong>സൗദി ബസ് സർവീസുകൾ (SAPTCO / Northwest / Darb)</strong>
                    <span>ഇൻറർ-സിറ്റി എക്സ്പ്രസ്സ് ബസ് റൂട്ടുകൾ, ടിക്കറ്റ് നിരക്കുകൾ & ഓൺലൈൻ ബുക്കിംഗ്</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/travel.html#kerala-transit-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🚂</span>
                  <div class="dir-link-text">
                    <strong>കേരള ട്രെയിൻ & KSRTC ബുക്കിംഗ് ഗൈഡ്</strong>
                    <span>നാട്ടിലെത്തുമ്പോൾ ഉപയോഗിക്കാവുന്ന ട്രെയിൻ, കെ.എസ്.ആർ.ടി.സി സ്വിഫ്റ്റ് ബുക്കിംഗ്</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/saudi.html#prayer-times-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🕌</span>
                  <div class="dir-link-text">
                    <strong>11 നഗരങ്ങളിലെ ലൈവ് നമസ്കാര സമയം (Prayer Times)</strong>
                    <span>കൃത്യമായ ദൈനംദിന നമസ്കാര സമയങ്ങൾ, അടുത്ത നമസ്കാര കൗണ്ട്ഡൗൺ & അദാൻ സമയം</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/saudi.html#calendar-converter-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">📅</span>
                  <div class="dir-link-text">
                    <strong>ഹിജ്‌രി - ഗ്രിഗോറിയൻ കലണ്ടർ & ഡേറ്റ് കൺവെർട്ടർ</strong>
                    <span>ഉമ്മുൽ ഖുറാ കലണ്ടർ പ്രകാരം ഇംഗ്ലീഷ് തീയതി ഹിജ്‌രിയിലേക്ക് മാറ്റാനുള്ള ടൂൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/saudi.html#umrah-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🕋</span>
                  <div class="dir-link-text">
                    <strong>ഉംറ & സിയാറത്ത് സമഗ്ര ഗൈഡ് (Nusuk)</strong>
                    <span>നുസുക് ആപ്പ് പെർമിറ്റ്, ഉംറ നിർവ്വഹണ ഘട്ടങ്ങൾ & മക്ക-മദീന സന്ദർശന സ്ഥലങ്ങൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/saudi.html#vision-fifa-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🚀</span>
                  <div class="dir-link-text">
                    <strong>സൗദി വിഷൻ 2030 മെഗാ പ്രോജക്ടുകൾ</strong>
                    <span>നിയോം (The Line), ഖിദ്ദിയ, റെഡ് സീ, ദിരിയ, ന്യൂ മുറബ്ബ, റിയാദ് മെട്രോ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/saudi.html#vision-fifa-section" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">⚽</span>
                  <div class="dir-link-text">
                    <strong>ഫിഫ വേൾഡ് കപ്പ് 2034 (15 സ്റ്റേഡിയങ്ങൾ)</strong>
                    <span>റിയാദ്, ജിദ്ദ, ഖോബാർ, അബഹ, നിയോം സ്റ്റേഡിയങ്ങൾ, കപ്പാസിറ്റി & ഗൂഗിൾ മാപ്പ്സ്</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/explore.html?tab=tourism" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🧭</span>
                  <div class="dir-link-text">
                    <strong>സഞ്ചാരം & ഹിഡൻ സ്പോട്ടുകൾ (25 കേന്ദ്രങ്ങൾ)</strong>
                    <span>സൗദിയിലെ പ്രകൃതിദത്ത വിസ്മയങ്ങൾ, മലനിരകൾ, ബീച്ചുകൾ & മാപ്പ് റൂട്ടുകൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>

              <a href="/explore.html?tab=heritage" class="feature-dir-link">
                <div class="dir-link-left">
                  <span class="dir-link-icon">🌴</span>
                  <div class="dir-link-text">
                    <strong>സൗദി പൈതൃകം & കൃഷി (ഡേറ്റ് ഫാം & ഒട്ടകം)</strong>
                    <span>ചരിത്രപരമായ പൈതൃക കേന്ദ്രങ്ങൾ, ഈന്തപ്പന തോട്ടങ്ങൾ, ഒട്ടക സംസ്കാരം & 13 പ്രവിശ്യകൾ</span>
                  </div>
                </div>
                <span class="dir-link-arrow">↗</span>
              </a>
            </div>
          </div>

        </div>

        <!-- Bottom Action Buttons Bar -->
        <div class="features-footer-bar">
          <button type="button" id="copy-features-list-btn-bottom" class="btn-features-action btn-features-copy">
            <span>📋 മുഴുവൻ ലിസ്റ്റും കോപ്പി ചെയ്യുക</span>
          </button>
          <a id="share-features-wa-btn-bottom" href="#" target="_blank" rel="noopener noreferrer" class="btn-features-action btn-features-wa">
            <span>📲 സുഹൃത്തുക്കൾക്ക് WhatsApp-ൽ അയക്കുക</span>
          </a>
        </div>
      </div>
    </div>
  </section>`;

if (featuresSectionPattern.test(html)) {
  html = html.replace(featuresSectionPattern, newFeaturesSection);
  console.log('Successfully replaced #working-features-section');
} else {
  console.warn('Could not match #working-features-section pattern');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html updated successfully');
