const data = require('../data/restaurants.json');

function matchCategory(item) {
  const name = (item.name || item.restaurant_name || '').toLowerCase();
  const tags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : (item.tags || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();
  const text = `${name} ${tags} ${cat}`;

  if (/(chai|tea|bakery|bake|bakes|cafeteria|cafe|coffee|snacks|snack|juice|cool bar|coolbar)/i.test(name) || /(bakery|tea|snacks|juice|coolbar)/i.test(tags)) {
    return 'bakery';
  }
  if (/(mandi|mandhi|madhbi|kabsa|grill|barbecue|bbq|broast|broasted|shawarma|alfaham|al-faham|charcoal)/i.test(name) || /(mandi|grill|broast)/i.test(tags)) {
    return 'mandi';
  }
  if (/(sadya|sadhya|veg|vegetarian|mess|meals|thali|brahmin|nadan meals)/i.test(name) || /(meals|veg|vegetarian)/i.test(tags)) {
    return 'sadya';
  }
  if (/(porotta|parotta|paratha|thattukada|beef|puttu|appam|dosa|chilly|fry)/i.test(name) || /(porotta|puttu|beef)/i.test(tags)) {
    return 'porotta';
  }
  if (/(biriyani|biryani|malabar|thalassery|dum)/i.test(name) || /(biriyani|malabar)/i.test(tags)) {
    return 'biriyani';
  }
  return 'default';
}

const counts = {};
const samples = {};
data.forEach(item => {
  const cat = matchCategory(item);
  counts[cat] = (counts[cat] || 0) + 1;
  if (!samples[cat]) samples[cat] = [];
  if (samples[cat].length < 3) samples[cat].push(item.name);
});
console.log('Refined Category matches:', counts);
console.log('Samples:', samples);
