const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = [
  'about.html', 'about/index.html',
  'health.html', 'health/index.html',
  'sahayi.html', 'sahayi/index.html',
  'saudi.html', 'saudi/index.html'
];

files.forEach(file => {
  const p = path.join(rootDir, file);
  if (fs.existsSync(p)) {
    let html = fs.readFileSync(p, 'utf8');
    if (!html.includes('data-theme=')) {
      html = html.replace('<html lang="ml" dir="ltr">', '<html lang="ml" dir="ltr" data-theme="light">');
      fs.writeFileSync(p, html, 'utf8');
      console.log('Added data-theme="light" to', file);
    }
  }
});
