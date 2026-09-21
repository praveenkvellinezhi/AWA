const fs = require('fs');
const content = fs.readFileSync('./lib/mock-data/templates.ts', 'utf8');
const lines = content.split('\n');
const templates = [];
let current = {};
for (const line of lines) {
  const idMatch = line.match(/id:\s*"([^"]+)"/);
  const nameMatch = line.match(/name:\s*"([^"]+)"/);
  const catMatch = line.match(/categoryName:\s*"([^"]+)"/);
  if (idMatch && idMatch[1].startsWith('template-')) {
    current = { id: idMatch[1] };
    templates.push(current);
  }
  if (nameMatch && current.id && !current.name) {
    current.name = nameMatch[1];
  }
  if (catMatch && current.id && !current.categoryName) {
    current.categoryName = catMatch[1];
  }
}
console.log(JSON.stringify(templates, null, 2));
