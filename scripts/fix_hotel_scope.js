const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../js/saudi_page.js');
let code = fs.readFileSync(filePath, 'utf8');

// Extract HOTEL_FOOD_COVERS and getHotelFoodCover block
const startMarker = '// 6–8 Curated, lightweight Kerala food cover photos';
const endMarker = 'return HOTEL_FOOD_COVERS.default;\n  }';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const fullBlock = code.substring(startIndex, endIndex + endMarker.length);
  
  // Remove block from inside initHotels()
  code = code.replace(fullBlock, '');

  // Place block before function initHotels()
  const insertBefore = 'function initHotels() {';
  code = code.replace(insertBefore, fullBlock + '\n\n  ' + insertBefore);

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully moved HOTEL_FOOD_COVERS and getHotelFoodCover before initHotels()');
} else {
  console.error('Could not find markers to move block');
  process.exit(1);
}
