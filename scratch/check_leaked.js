const fs = require('fs');
const content = fs.readFileSync('./lib/mock-data/templates.ts', 'utf8');
const templates = content.split('{\n    id: "template-');
console.log('Total templates parsed:', templates.length - 1);
let leaked = 0;
for (let i = 1; i < templates.length; i++) {
  const t = templates[i];
  const id = 'template-' + t.substring(0, t.indexOf('"'));
  const catMatch = t.match(/categoryId:\s*"([^"]+)"/);
  const cat = catMatch ? catMatch[1] : '';
  const hasV0 = t.includes('Use v0, Figma') || t.includes('deploy to your preferred platform');
  if (hasV0 && !cat.includes('web')) {
    console.log('Leaked in:', id, 'category:', cat);
    leaked++;
  }
}
console.log('Total leaked found:', leaked);
