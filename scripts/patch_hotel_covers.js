const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Update js/saudi_page.js
const saudiPageJsPath = path.join(rootDir, 'js/saudi_page.js');
let saudiJs = fs.readFileSync(saudiPageJsPath, 'utf8');

const foodCoversCode = `
  // 6–8 Curated, lightweight Kerala food cover photos (local assets with remote CDN fallback)
  const HOTEL_FOOD_COVERS = {
    biriyani: {
      local: "./assets/food_covers/biriyani.jpg",
      remote: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&h=320&q=80",
      alt: "Kerala Malabar Biriyani"
    },
    porotta: {
      local: "./assets/food_covers/porotta.jpg",
      remote: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&h=320&q=80",
      alt: "Kerala Porotta & Curry"
    },
    beef: {
      local: "./assets/food_covers/beef_roast.jpg",
      remote: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&h=320&q=80",
      alt: "Kerala Beef Roast & Thattukada dishes"
    },
    sadya: {
      local: "./assets/food_covers/sadya.jpg",
      remote: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=600&h=320&q=80",
      alt: "Kerala Sadya & Vegetarian Meals"
    },
    mandi: {
      local: "./assets/food_covers/mandi.jpg",
      remote: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&h=320&q=80",
      alt: "Arabic Mandi & Charcoal Grill"
    },
    bakery: {
      local: "./assets/food_covers/tea_snacks.jpg",
      remote: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=320&q=80",
      alt: "Kerala Chai, Snacks & Bakery"
    },
    default: {
      local: "./assets/food_covers/kerala_platter.jpg",
      remote: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&h=320&q=80",
      alt: "Authentic Kerala Cuisine Platter"
    }
  };

  function getHotelFoodCover(item) {
    const name = (item.name || item.restaurant_name || "").toLowerCase();
    const tags = Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : (item.tags || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();
    const dishes = Array.isArray(item.popular_dishes) ? item.popular_dishes.join(" ").toLowerCase() : "";
    const evidence = (item.kerala_food_evidence || "").toLowerCase();
    const text = (name + " " + tags + " " + cat + " " + dishes + " " + evidence).toLowerCase();

    // 1. Bakery / Tea / Cafeteria
    if (/(chai|tea|bakery|bake|bakes|cafeteria|cafe|coffee|snacks|snack|juice|cool bar|coolbar|shake)/i.test(name) ||
        /(bakery|tea|snacks|juice|coolbar)/i.test(tags)) {
      return HOTEL_FOOD_COVERS.bakery;
    }

    // 2. Mandi / Grill / Broast
    if (/(mandi|mandhi|madhbi|kabsa|grill|barbecue|bbq|broast|broasted|shawarma|alfaham|al-faham|charcoal|tikka|sheesh)/i.test(name) ||
        /(mandi|grill|broast|shawarma|alfaham)/i.test(tags)) {
      return HOTEL_FOOD_COVERS.mandi;
    }

    // 3. Sadya / Veg / Mess
    if (/(sadya|sadhya|veg|vegetarian|mess|meals|thali|brahmin|nadan meals)/i.test(name) ||
        /(meals|veg|vegetarian|sadya)/i.test(tags)) {
      return HOTEL_FOOD_COVERS.sadya;
    }

    // 4. Porotta / Thattukada / Beef spots
    if (/(porotta|parotta|paratha|thattukada|beef|puttu|appam|dosa|chilly|curry|roast|fry)/i.test(name) ||
        /(porotta|puttu|beef|thattukada)/i.test(tags)) {
      if (/beef|roast|fry/i.test(name + " " + tags)) {
        return HOTEL_FOOD_COVERS.beef;
      }
      return HOTEL_FOOD_COVERS.porotta;
    }

    // 5. Biriyani / Malabar spots
    if (/(biriyani|biryani|malabar|thalassery|dum|kuzhimanthi)/i.test(name) ||
        /(biriyani|malabar|thalassery)/i.test(tags)) {
      return HOTEL_FOOD_COVERS.biriyani;
    }

    // 6. Default fallback
    return HOTEL_FOOD_COVERS.default;
  }
`;

// Insert food covers logic before renderHotels
if (!saudiJs.includes('HOTEL_FOOD_COVERS')) {
  saudiJs = saudiJs.replace('function renderHotels() {', foodCoversCode + '\n    function renderHotels() {');
}

// Replace card markup inside grid.innerHTML = filtered.map(...)
const oldCardMarkupRegex = /return `\s*<article class="saudi-hotel-card">[\s\S]*?<\/article>\s*`;/m;

const newCardMarkup = `const cover = getHotelFoodCover(item);
        const coverLocal = cover.local;
        const coverRemote = cover.remote;
        const coverAlt = escapeHtml(cover.alt + " - " + rawName);

        return \`
          <article class="saudi-hotel-card">
            <div class="saudi-hotel-cover-wrap">
              <img 
                src="\${coverLocal}" 
                alt="\${coverAlt}" 
                class="saudi-hotel-cover-img" 
                loading="lazy" 
                decoding="async"
                onerror="this.onerror=null; this.src='\${coverRemote}'; this.onerror=function(){this.parentElement.classList.add('has-fallback'); this.style.display='none';};"
              />
              <div class="saudi-hotel-cover-fallback" aria-hidden="true">
                <span class="saudi-hotel-fallback-icon">🍽️</span>
              </div>
              <div class="saudi-hotel-cover-overlay">
                <div class="saudi-hotel-city-badge">📍 \${city}\${area ? \` · \${area}\` : ''}</div>
                <div class="saudi-hotel-rating">⭐ \${rating.toFixed(1)}</div>
              </div>
            </div>

            <div class="saudi-hotel-content">
              <h3 class="saudi-hotel-name">\${name}</h3>
              
              <div class="saudi-hotel-tags">
                \${tags.slice(0, 3).map(t => \`<span class="saudi-hotel-tag">\${escapeHtml(t.trim())}</span>\`).join("")}
              </div>

              \${dishes.length > 0 ? \`
                <div class="saudi-hotel-dishes">
                  <span>🍲 <strong>പ്രശസ്ത വിഭവങ്ങൾ:</strong> \${escapeHtml(dishes.slice(0, 3).join(", "))}</span>
                </div>
              \` : ""}

              <div class="saudi-hotel-actions">
                <a href="\${mapsUrl}" target="_blank" rel="noopener noreferrer" class="saudi-btn-map" title="Open Google Maps Directions">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                  <span>Google Maps ↗</span>
                </a>

                \${phone ? \`
                  <a href="tel:\${phone}" class="saudi-btn-call" title="Call Hotel">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>വിളിക്കുക</span>
                  </a>
                \` : \`
                  <a href="\${mapsUrl}" target="_blank" rel="noopener noreferrer" class="saudi-btn-call" title="View Phone on Google Maps">
                    <span>ഫോൺ നമ്പർ ↗</span>
                  </a>
                \`}

                <a href="\${waShareUrl}" target="_blank" rel="noopener noreferrer" class="saudi-btn-share" title="Share on WhatsApp">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.03 2C6.5 2 2 6.48 2 12c0 1.77.46 3.5 1.34 5.02L2 22l5.13-1.34A9.96 9.96 0 0 0 12.03 22C17.55 22 22 17.52 22 12S17.55 2 12.03 2zm5.82 14.17c-.24.68-1.42 1.3-1.97 1.38-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.02-1.31-4.99-4.38-5.14-4.58-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.52c.28-.3.61-.38.81-.38h.59c.19 0 .44-.07.69.53.25.61.85 2.09.92 2.24.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.31.32-.13.62.18.3.79 1.31 1.7 2.12 1.17 1.04 2.15 1.37 2.46 1.52.3.15.48.13.66-.08.18-.2.76-.89.96-1.19.2-.3.41-.25.69-.15.28.1 1.78.84 2.08.99.3.15.51.23.58.36.08.13.08.76-.16 1.44z"/></svg>
                </a>
              </div>
            </div>
          </article>
        \`;`;

saudiJs = saudiJs.replace(oldCardMarkupRegex, newCardMarkup);
fs.writeFileSync(saudiPageJsPath, saudiJs, 'utf8');
console.log('Successfully patched js/saudi_page.js with smart food cover matching & markup');

// 2. Update css/styles.css
const cssPath = path.join(rootDir, 'css/styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const oldHotelCssRegex = /\/\* Saudi Hotels Grid \*\/[\s\S]*?\.saudi-hotel-name \{/m;

const newHotelCss = `/* Saudi Hotels Grid */
.saudi-hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.saudi-hotel-card {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.saudi-hotel-card:hover {
  border-color: rgba(212, 175, 55, 0.45);
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
}

/* 160px-tall Rounded Top Cover Image Container */
.saudi-hotel-cover-wrap {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-top-left-radius: 17px;
  border-top-right-radius: 17px;
  background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.saudi-hotel-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.saudi-hotel-card:hover .saudi-hotel-cover-img {
  transform: scale(1.05);
}

/* Fallback Emerald Gradient with 🍽️ Icon on Error / Offline */
.saudi-hotel-cover-fallback {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #043226 0%, #065f46 50%, #047857 100%);
}

.saudi-hotel-cover-wrap.has-fallback .saudi-hotel-cover-fallback {
  display: flex;
}

.saudi-hotel-fallback-icon {
  font-size: 2.6rem;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
  opacity: 0.9;
}

/* Subtle Dark Gradient Overlay at Bottom of Cover Photo */
.saudi-hotel-cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px 14px 10px;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 55%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  z-index: 2;
  pointer-events: none;
}

.saudi-hotel-city-badge {
  font-size: 0.78rem;
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 3px 10px;
  border-radius: 9999px;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.22);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.saudi-hotel-rating {
  font-size: 0.82rem;
  font-weight: 800;
  color: #fde047;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 3px 9px;
  border-radius: 8px;
  border: 1px solid rgba(245, 158, 11, 0.5);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
  flex-shrink: 0;
}

.saudi-hotel-content {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}

.saudi-hotel-name {`;

css = css.replace(oldHotelCssRegex, newHotelCss);
fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated css/styles.css with hotel cover image & overlay styles');

// 3. Update sw.js CORE_ASSETS
const swPath = path.join(rootDir, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');

const foodCoversAssets = [
  '  "/assets/food_covers/biriyani.jpg",',
  '  "/assets/food_covers/porotta.jpg",',
  '  "/assets/food_covers/sadya.jpg",',
  '  "/assets/food_covers/mandi.jpg",',
  '  "/assets/food_covers/bakery.jpg",',
  '  "/assets/food_covers/kerala_platter.jpg",',
  '  "/assets/food_covers/beef_roast.jpg",',
  '  "/assets/food_covers/tea_snacks.jpg",'
].join('\n');

if (!sw.includes('/assets/food_covers/biriyani.jpg')) {
  sw = sw.replace('  "/assets/tourism_fallback.svg",', '  "/assets/tourism_fallback.svg",\n' + foodCoversAssets);
  fs.writeFileSync(swPath, sw, 'utf8');
  console.log('Successfully added food cover assets to sw.js CORE_ASSETS');
}
