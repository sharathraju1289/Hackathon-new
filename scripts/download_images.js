#!/usr/bin/env node
/**
 * Simple image downloader for property images.
 * Defaults: provider=unsplash, properties=100, imagesPerProperty=5
 * Usage:
 *   PROVIDER=unsplash PROPERTIES=100 IMAGES_PER=5 node scripts/download_images.js
 * or
 *   node scripts/download_images.js --provider=unsplash --properties=100 --imagesPer=5
 *
 * NOTE: This script uses source.unsplash.com by default (no API key required).
 * Downloading many images may take time; run with smaller numbers to test.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(a => {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      args[k] = v || true;
    }
  });
  return args;
}

const args = parseArgs();
const provider = (args.provider || process.env.PROVIDER || 'unsplash').toLowerCase();
const properties = parseInt(args.properties || process.env.PROPERTIES || '100', 10) || 100;
const imagesPer = parseInt(args.imagesPer || process.env.IMAGES_PER || '5', 10) || 5;
const outDir = path.resolve(process.cwd(), args.output || process.env.OUTPUT || 'public/images');
// Optional: override search queries for all categories (comma-separated)
const queriesOverride = (args.queries || process.env.QUERIES || '').toString();
// Delay between requests (ms) and retry settings
const delayMs = parseInt(args.delay || process.env.DELAY || '300', 10) || 300;
const maxRetries = parseInt(args.retries || process.env.RETRIES || '4', 10) || 4;

// categories can be overridden with env var CATEGORIES or --categories=house,pg
const defaultCategories = ['house', 'pg', 'land'];
const categoriesArg = (args.categories || process.env.CATEGORIES || '').toString();
const categories = categoriesArg
  ? categoriesArg.split(',').map(s => s.trim()).filter(Boolean)
  : defaultCategories;

const queryMap = {
  house: 'house,home',
  pg: 'pg accommodation,hostel',
  land: 'land,plot'
};

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

ensureDir(outDir);
categories.forEach(c => ensureDir(path.join(outDir, c)));

function download(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (redirects > 8) return reject(new Error('Too many redirects'));
        // follow redirect
        res.resume();
        return download(res.headers.location, dest, redirects + 1).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(resolve));
      fileStream.on('error', (err) => reject(err));
    });
    req.on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function downloadWithRetries(url, dest, retries = maxRetries) {
  let attempt = 0;
  while (true) {
    try {
      await download(url, dest);
      return;
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const backoff = 500 * Math.pow(2, attempt - 1);
      console.warn(`Retry ${attempt}/${retries} for ${url}: ${err.message}; backing off ${backoff}ms`);
      await sleep(backoff);
    }
  }
}

function providerUrl(provider, category, pIndex, imgIndex) {
  if (provider === 'picsum') {
    return `https://picsum.photos/seed/${category}-${pIndex}-${imgIndex}/1200/800`;
  }
  // default to Unsplash Source (no API key)
  // allow overriding queries for all categories (useful to force villa/house/apartment queries)
  const qStr = queriesOverride || queryMap[category] || category;
  const q = encodeURIComponent(qStr);
  // add a pseudo-random sig to vary images
  return `https://source.unsplash.com/1200x800/?${q}&sig=${pIndex}-${imgIndex}`;
}

async function main() {
  console.log(`Downloading images (provider=${provider}) into ${outDir}`);
  console.log(`Properties: ${properties}, imagesPerProperty: ${imagesPer}`);

  for (let i = 0; i < properties; i++) {
    const category = categories[i % categories.length];
    const categoryDir = path.join(outDir, category);

    for (let j = 0; j < imagesPer; j++) {
      const filename = `${category}-${i}-${j}.jpg`;
      const dest = path.join(categoryDir, filename);
      if (fs.existsSync(dest)) {
        process.stdout.write('.');
        continue;
      }

      const url = providerUrl(provider, category, i, j);
      try {
        process.stdout.write('D');
        await downloadWithRetries(url, dest);
        process.stdout.write('');
        console.log(`\nSaved: ${path.relative(process.cwd(), dest)}`);
      } catch (err) {
        console.error(`\nFailed to download ${url}: ${err.message}`);
        // fallback to picsum
        try {
          const fallback = `https://picsum.photos/seed/${category}-${i}-${j}/1200/800`;
          await downloadWithRetries(fallback, dest);
          console.log(`Fallback saved: ${path.relative(process.cwd(), dest)}`);
        } catch (err2) {
          console.error(`Fallback failed for ${dest}: ${err2.message}`);
        }
      }

      // small delay to reduce rate of requests
      await sleep(delayMs);
    }
  }

  console.log('Done downloading images.');
}

main().catch(err => {
  console.error('Error', err);
  process.exit(1);
});
