const fs = require('fs');
// Let's inspect how templates match each category
const content = fs.readFileSync('./lib/mock-data/templates.ts', 'utf8');

// Check templates count per category
const categories = [
  'Image Generation',
  'Video Generation',
  'Website Making',
  'Slides & Presentations',
  'Poster & Design'
];

console.log('Testing category matching in templates...');
