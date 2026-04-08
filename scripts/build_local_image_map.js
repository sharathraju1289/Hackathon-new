#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const imagesRoot = path.resolve(process.cwd(), 'public', 'images');
const outFile = path.resolve(process.cwd(), 'src', 'utils', 'localImageMap.json');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

function buildMap() {
  const map = {};
  if (!fs.existsSync(imagesRoot)) {
    console.warn('No images directory found at', imagesRoot);
    fs.writeFileSync(outFile, JSON.stringify(map, null, 2));
    return;
  }

  const files = walk(imagesRoot);
  for (const f of files) {
    const rel = path.relative(imagesRoot, f);
    // rel like 'house/house-0-0.jpg'
    const parts = rel.split(path.sep);
    if (parts.length !== 2) continue;
    const [category, filename] = parts;
    const m = filename.match(/^[a-zA-Z]+-(\d+)-(\d+)\.[a-zA-Z]+$/);
    if (!m) continue;
    const idx = m[1];
    const propId = `prop-${idx}`;
    const webPath = `/images/${category}/${filename}`;
    map[propId] = map[propId] || [];
    map[propId].push(webPath);
  }

  // Prefer raster images (jpg/png/webp) when available so genuine photos
  // are selected before SVG placeholders. Then fallback to filename sort.
  const rasterExts = new Set(['.jpg', '.jpeg', '.png', '.webp']);
  Object.keys(map).forEach(k => {
    map[k].sort((a, b) => {
      const aExt = path.extname(a).toLowerCase();
      const bExt = path.extname(b).toLowerCase();
      const aIsRaster = rasterExts.has(aExt);
      const bIsRaster = rasterExts.has(bExt);
      if (aIsRaster && !bIsRaster) return -1;
      if (bIsRaster && !aIsRaster) return 1;
      return a.localeCompare(b);
    });
  });

  // ensure output directory exists
  const outDir = path.dirname(outFile);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outFile, JSON.stringify(map, null, 2));
  console.log('Wrote local image map to', outFile);
}

buildMap();
