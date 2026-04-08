#!/usr/bin/env node
/*
 * Generate simple SVG placeholder images for categories/properties.
 * Usage examples:
 *   CATEGORIES=house PROPERTIES=100 IMAGES_PER=5 node scripts/generate_placeholders.js
 *   node scripts/generate_placeholders.js --categories=house,pg --properties=50 --imagesPer=3 --force
 */
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(a => {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      args[k] = v === undefined ? true : v;
    }
  });
  return args;
}

const args = parseArgs();
const categories = (args.categories || process.env.CATEGORIES || 'house,pg,land').toString()
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const properties = parseInt(args.properties || process.env.PROPERTIES || '100', 10) || 100;
const imagesPer = parseInt(args.imagesPer || process.env.IMAGES_PER || '5', 10) || 5;
const outDir = path.resolve(process.cwd(), args.output || process.env.OUTPUT || 'public/images');
const force = !!(args.force || process.env.FORCE === 'true');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

ensureDir(outDir);
categories.forEach(c => ensureDir(path.join(outDir, c)));

function svgFor(category, propIndex, imgIndex) {
  const w = 1200;
  const h = 800;
  const colors = {
    house: '#f0f9ff',
    pg: '#fff7e6',
    land: '#f1fff0'
  };
  const bg = colors[category] || '#eeeeee';
  const title = `${category.toUpperCase()} ${propIndex}-${imgIndex}`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n` +
    `<rect width="100%" height="100%" fill="${bg}"/>\n` +
    `<g fill="#333" font-family="Arial, Helvetica, sans-serif">\n` +
    `<text x="50%" y="45%" font-size="56" text-anchor="middle">${title}</text>\n` +
    `<text x="50%" y="55%" font-size="28" text-anchor="middle">Placeholder image</text>\n` +
    `</g>\n` +
    `</svg>`;
}

let created = 0;
let skipped = 0;
for (const category of categories) {
  for (let i = 0; i < properties; i++) {
    for (let j = 0; j < imagesPer; j++) {
      const filename = `${category}-${i}-${j}.svg`;
      const dest = path.join(outDir, category, filename);
      if (fs.existsSync(dest) && !force) {
        skipped++;
        continue;
      }
      try {
        fs.writeFileSync(dest, svgFor(category, i, j));
        created++;
      } catch (err) {
        console.error('Failed to write', dest, err.message);
      }
    }
  }
}

console.log(`Generated placeholders: ${created}, skipped: ${skipped}`);
