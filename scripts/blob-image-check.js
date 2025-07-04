// blob-image-check.js
// Script to compare referenced image names in src/constants/images.ts with actual images in Vercel Blob storage
// Usage: node scripts/blob-image-check.js

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_LIST_URL = 'https://api.vercel.com/v2/blob/list?prefix=images/';
const IMAGES_TS_PATH = path.resolve(__dirname, '../src/constants/images.ts');

if (!BLOB_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN not found in .env');
  process.exit(1);
}

// 1. Fetch all blob image names from Vercel Blob storage
async function fetchBlobImageNames() {
  const res = await fetch(BLOB_LIST_URL, {
    headers: {
      Authorization: `Bearer ${BLOB_TOKEN}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch blob list: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  // Each item has a key like 'images/1-NEST-Haus-...'
  return data.blobs.map(blob => path.basename(blob.key));
}

// 2. Parse images.ts to extract all referenced image names (recursively)
function extractImageNamesFromObject(obj) {
  const names = [];
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Only include if not a fallback URL
      if (!obj[key].startsWith('/api/placeholder/')) {
        names.push(obj[key]);
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      names.push(...extractImageNamesFromObject(obj[key]));
    }
  }
  return names;
}

function getAllReferencedImageNames() {
  // Use require with ts-node or parse as JS
  // We'll use a simple regex-based parse for now
  const fileContent = fs.readFileSync(IMAGES_TS_PATH, 'utf8');
  // Find the export const IMAGES = { ... } as const;
  const match = fileContent.match(/export const IMAGES = (\{[\s\S]*?\}) as const;/);
  if (!match) {
    throw new Error('Could not find IMAGES object in images.ts');
  }
  // Use eval in a sandboxed way (not recommended for untrusted code)
  // We'll convert the TypeScript object to JSON by removing comments and trailing commas
  let objStr = match[1]
    .replace(/\/[/*][^*]*[*/]/g, '') // Remove comments
    .replace(/([\w\d_]+):/g, '"$1":') // Add quotes to keys
    .replace(/,\s*}/g, '}') // Remove trailing commas
    .replace(/,\s*]/g, ']');
  // Remove as const, export, etc.
  try {
    const obj = JSON.parse(objStr);
    return extractImageNamesFromObject(obj);
  } catch (e) {
    throw new Error('Failed to parse IMAGES object from images.ts: ' + e.message);
  }
}

(async () => {
  try {
    console.log('🔎 Fetching blob image names from Vercel Blob storage...');
    const blobImageNames = await fetchBlobImageNames();
    console.log(`Found ${blobImageNames.length} images in blob storage.`);

    console.log('🔎 Extracting referenced image names from images.ts...');
    const referencedImageNames = getAllReferencedImageNames();
    console.log(`Found ${referencedImageNames.length} referenced image names in images.ts.`);

    // Compare
    const missingInBlob = referencedImageNames.filter(name => !blobImageNames.includes(name));
    const unusedInCode = blobImageNames.filter(name => !referencedImageNames.includes(name));

    console.log('\n=== Images referenced in code but missing in blob storage ===');
    if (missingInBlob.length === 0) {
      console.log('✅ None!');
    } else {
      missingInBlob.forEach(name => console.log('❌', name));
    }

    console.log('\n=== Images present in blob storage but not referenced in code ===');
    if (unusedInCode.length === 0) {
      console.log('✅ None!');
    } else {
      unusedInCode.forEach(name => console.log('⚠️', name));
    }

    console.log('\nDone.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})(); 