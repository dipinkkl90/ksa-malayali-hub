const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../assets/food_covers');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const images = {
  'biriyani.jpg': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&h=320&q=80',
  'porotta.jpg': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&h=320&q=80',
  'sadya.jpg': 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=600&h=320&q=80',
  'mandi.jpg': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&h=320&q=80',
  'bakery.jpg': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&h=320&q=80',
  'kerala_platter.jpg': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&h=320&q=80',
  'beef_roast.jpg': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&h=320&q=80',
  'tea_snacks.jpg': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=320&q=80'
};

function download(filename, url) {
  return new Promise((resolve, reject) => {
    const dest = path.join(dir, filename);
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, resp => {
          resp.pipe(file);
          file.on('finish', () => file.close(resolve));
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      } else {
        reject(new Error(`Failed with status ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function run() {
  for (const [name, url] of Object.entries(images)) {
    console.log('Downloading', name, '...');
    await download(name, url);
    const stat = fs.statSync(path.join(dir, name));
    console.log('Saved', name, 'size:', stat.size);
  }
  console.log('All 8 food cover photos downloaded successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
