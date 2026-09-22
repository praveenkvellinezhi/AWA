const fs = require('fs');
const content = fs.readFileSync('./lib/mock-data/templates.ts', 'utf8');
const urls = new Set();
for (const m of content.matchAll(/"(\/images\/[^"]+)"/g)) {
  urls.add(m[1]);
}
console.log('Image URLs in templates.ts:');
console.log(Array.from(urls));
