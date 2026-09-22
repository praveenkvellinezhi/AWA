const fs = require('fs');
const content = fs.readFileSync('./lib/mock-data/templates.ts', 'utf8');
const catIds = new Set();
const catNames = new Set();
for (const m of content.matchAll(/categoryId:\s*"([^"]+)"/g)) {
  catIds.add(m[1]);
}
for (const m of content.matchAll(/categoryName:\s*"([^"]+)"/g)) {
  catNames.add(m[1]);
}
console.log('catIds in templates:', Array.from(catIds));
console.log('catNames in templates:', Array.from(catNames));

const catContent = fs.readFileSync('./lib/mock-data/categories.ts', 'utf8');
const officialCats = [];
for (const m of catContent.matchAll(/name:\s*"([^"]+)"/g)) {
  officialCats.push(m[1]);
}
console.log('Official category names:', officialCats);
