const fs = require('fs');
const content = fs.readFileSync('./lib/mock-data/templates.ts', 'utf8');
const templates = content.split('{\n    id: "template-');
const byCat = {};
for (let i = 1; i < templates.length; i++) {
  const t = templates[i];
  const slugMatch = t.match(/slug:\s*"([^"]+)"/);
  const catMatch = t.match(/categoryId:\s*"([^"]+)"/);
  const nameMatch = t.match(/name:\s*"([^"]+)"/);
  if (slugMatch && catMatch) {
    const cat = catMatch[1];
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push({ slug: slugMatch[1], name: nameMatch ? nameMatch[1] : '' });
  }
}
for (const c in byCat) {
  console.log(c, byCat[c].slice(0, 2));
}
