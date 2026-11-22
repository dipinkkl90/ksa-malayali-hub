const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const aboutFiles = [
  path.join(rootDir, 'about', 'index.html'),
  path.join(rootDir, 'about.html')
];

const cssPath = path.join(rootDir, 'css', 'styles.css');

// 1. Update about.html and about/index.html
aboutFiles.forEach(af => {
  if (!fs.existsSync(af)) return;
  let html = fs.readFileSync(af, 'utf8');

  // Replace the lead paragraph if old one exists or update current
  const leadPattern = /<p class="about-dj-lead"[^>]*>[\s\S]*?<\/p>/;
  const newLead = `<p class="about-dj-lead" style="font-weight:700; color:var(--text); font-size:1.02rem; line-height:1.65; margin-bottom:12px;">
            സൗദി അറേബ്യയിലെ പ്രവാസ ജീവിതത്തിൽ നാടൻ ഭക്ഷണം, ഇൻഷുറൻസ് ക്ലിനിക്കുകൾ, തൊഴിൽ നിയമങ്ങൾ, യാത്രാ വിവരങ്ങൾ എന്നിവ ഒറ്റയിടത്ത് കണ്ടെത്തുന്നതിൽ ഞങ്ങൾ നേരിട്ട് അനുഭവിച്ച പ്രയാസങ്ങളിൽ നിന്നാണ് ഈ ആശയം തുടങ്ങിയത്.
          </p>`;

  if (leadPattern.test(html)) {
    html = html.replace(leadPattern, newLead);
  }

  // Remove existing quote if already there, so we don't duplicate
  html = html.replace(/<blockquote class="about-dj-quote">[\s\S]*?<\/blockquote>\s*/g, '');

  // Add the blockquote right after about-dj-body
  const bodyPattern = /(<p class="about-dj-body"[^>]*>[\s\S]*?<\/p>)/;
  const blockquoteHtml = `
          <blockquote class="about-dj-quote">
            <p class="about-dj-quote-text">“തണൽ തന്ന മരങ്ങളോടും, ചൂടുവെയിൽ തന്ന വിറ്റാമിൻ D3-യ്ക്കും, വിയർത്തപ്പോൾ വീശിയടിച്ച മണൽക്കാറ്റിനും... പിന്നെ ഈ യാത്രയിൽ കൂടെനിന്ന ഓരോ പ്രവാസിക്കും ഹൃദയം നിറഞ്ഞ നന്ദി.”</p>
            <cite class="about-dj-quote-author">— D&J Techies</cite>
          </blockquote>`;

  if (bodyPattern.test(html)) {
    html = html.replace(bodyPattern, `$1${blockquoteHtml}`);
  }

  fs.writeFileSync(af, html, 'utf8');
  console.log(`✅ Updated ${path.relative(rootDir, af)} with new story text and creative quote`);
});

// 2. Add blockquote CSS to styles.css
let css = fs.readFileSync(cssPath, 'utf8');

// Remove old definition if present
css = css.replace(/\/\* D&J Techies Origin Story Blockquote \*\/[\s\S]*?\/\* END D&J Quote \*\/\s*/g, '');

const quoteCss = `
/* D&J Techies Origin Story Blockquote */
.about-dj-quote {
  margin: 18px 0 24px;
  padding: 16px 20px;
  background: rgba(217, 119, 6, 0.06);
  border-left: 4px solid #d97706 !important;
  border-radius: 0 14px 14px 0;
  font-family: 'Noto Sans Malayalam', sans-serif;
  position: relative;
  transition: all 0.2s ease;
}

[data-theme="dark"] .about-dj-quote {
  background: rgba(245, 158, 11, 0.08);
  border-left-color: #f59e0b !important;
}

.about-dj-quote-text {
  margin: 0 0 8px 0;
  font-family: 'Noto Sans Malayalam', sans-serif;
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.75;
  color: #1e293b;
  font-style: italic;
}

[data-theme="dark"] .about-dj-quote-text {
  color: #f1f5f9;
}

.about-dj-quote-author {
  display: block;
  font-family: 'Noto Sans Malayalam', sans-serif;
  font-size: 0.88rem;
  font-weight: 800;
  color: #047857;
  letter-spacing: 0.02em;
  font-style: normal;
}

[data-theme="dark"] .about-dj-quote-author {
  color: #34d399;
}
/* END D&J Quote */
`;

css += '\n' + quoteCss + '\n';
fs.writeFileSync(cssPath, css, 'utf8');
console.log('✅ Added .about-dj-quote styles with high contrast & Noto Sans Malayalam to css/styles.css');
