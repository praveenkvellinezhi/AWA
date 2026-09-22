const fs = require('fs');

// Read templates.ts
const content = fs.readFileSync('./lib/mock-data/templates.ts', 'utf8');

// Parse templates by evaluating or extracting them
// Let's extract id, categoryId, categoryName, tags, description
const templates = [];
const blocks = content.split(/\{\s*id:\s*"/g).slice(1);

for (const b of blocks) {
  const id = b.split('"')[0];
  const catIdMatch = b.match(/categoryId:\s*"([^"]+)"/);
  const catNameMatch = b.match(/categoryName:\s*"([^"]+)"/);
  const tagsMatch = b.match(/tags:\s*\[([^\]]+)\]/);
  const descMatch = b.match(/description:\s*"([^"]+)"/);
  
  const categoryId = catIdMatch ? catIdMatch[1] : '';
  const categoryName = catNameMatch ? catNameMatch[1] : '';
  const tags = tagsMatch ? tagsMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')) : [];
  const description = descMatch ? descMatch[1] : '';
  
  templates.push({ id, categoryId, categoryName, tags, description });
}

console.log('Total parsed templates:', templates.length);

const tabs = [
  "All",
  "Image Generation",
  "Video Generation",
  "Website Making",
  "Slides & Presentations",
  "Poster & Design"
];

for (const tab of tabs) {
  let matched = [];
  if (tab === "All") {
    matched = templates;
  } else if (tab === "Image Generation") {
    matched = templates.filter(t => 
      t.categoryId === "cat-image-gen" ||
      t.categoryName.toLowerCase().includes("image") ||
      t.tags.some(tag => tag.toLowerCase().includes("image"))
    );
  } else if (tab === "Video Generation") {
    matched = templates.filter(t => 
      t.categoryId === "cat-video-gen" ||
      t.categoryName.toLowerCase().includes("video") ||
      t.tags.some(tag => tag.toLowerCase().includes("video"))
    );
  } else if (tab === "Poster & Design") {
    matched = templates.filter(t => 
      t.categoryId === "cat-poster-design" ||
      t.categoryName.toLowerCase().includes("poster") ||
      t.tags.some(tag => tag.toLowerCase().includes("poster"))
    );
  } else if (tab === "Slides & Presentations") {
    matched = templates.filter(t => 
      t.categoryId === "cat-slides-presentations" ||
      t.categoryName.toLowerCase().includes("slide") ||
      t.tags.some(tag => tag.toLowerCase().includes("slide"))
    );
  } else if (tab === "Website Making") {
    matched = templates.filter(t => 
      t.categoryId === "cat-website-making" ||
      t.categoryId === "cat-web-code" ||
      t.categoryName.toLowerCase().includes("website") ||
      t.tags.some(tag => tag.toLowerCase().includes("website") || tag.toLowerCase() === "web") ||
      t.description.toLowerCase().includes("website") ||
      t.description.toLowerCase().includes("landing page") ||
      t.categoryName === "Saas" ||
      t.categoryName === "Portfolio"
    );
  }
  console.log(`Tab "${tab}": ${matched.length} templates`);
}

for (const t of templates) {
  const isImage = t.categoryId === 'cat-image-gen' || t.categoryName.toLowerCase().includes('image') || t.tags.some(tag => tag.toLowerCase().includes('image'));
  const isVideo = t.categoryId === 'cat-video-gen' || t.categoryName.toLowerCase().includes('video') || t.tags.some(tag => tag.toLowerCase().includes('video'));
  const isPoster = t.categoryId === 'cat-poster-design' || t.categoryName.toLowerCase().includes('poster') || t.tags.some(tag => tag.toLowerCase().includes('poster'));
  const isSlides = t.categoryId === 'cat-slides-presentations' || t.categoryName.toLowerCase().includes('slide') || t.tags.some(tag => tag.toLowerCase().includes('slide'));
  const isWebsite = t.categoryId === 'cat-website-making' || t.categoryId === 'cat-web-code' || t.categoryName.toLowerCase().includes('website') || t.tags.some(tag => tag.toLowerCase().includes('website') || tag.toLowerCase() === 'web') || t.description.toLowerCase().includes('website') || t.description.toLowerCase().includes('landing page') || t.categoryName === 'Saas' || t.categoryName === 'Portfolio';
  
  if (!isImage && !isVideo && !isPoster && !isSlides && !isWebsite) {
    console.log('Unmapped template:', t.id, 'categoryId:', t.categoryId, 'categoryName:', t.categoryName);
  }
}

