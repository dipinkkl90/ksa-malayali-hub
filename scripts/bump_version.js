const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Update sw.js
const swPath = path.join(rootDir, 'sw.js');
if (fs.existsSync(swPath)) {
  let sw = fs.readFileSync(swPath, 'utf8');
  sw = sw.replace(/const CACHE_VERSION = "ksa-malayali-hub-v\d+";/, 'const CACHE_VERSION = "ksa-malayali-hub-v13";');
  sw = sw.replace(/const DYNAMIC_CACHE = "ksa-malayali-dynamic-v\d+";/, 'const DYNAMIC_CACHE = "ksa-malayali-dynamic-v12";');
  fs.writeFileSync(swPath, sw, 'utf8');
  console.log('sw.js cache version bumped to v13');
}

// 2. Update styles.css and js query versions in all HTML files
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory() && !full.includes('.git') && !full.includes('node_modules')) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const htmlFiles = walk(rootDir);
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('styles.css?v=')) {
    content = content.replace(/styles\.css\?v=[^"'\s>]+/g, 'styles.css?v=20261122_v31');
  }
  if (content.includes('vision_fifa.js?v=')) {
    content = content.replace(/vision_fifa\.js\?v=[^"'\s>]+/g, 'vision_fifa.js?v=20261122_v31');
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log('Bumped asset versions in', path.relative(rootDir, file));
});
