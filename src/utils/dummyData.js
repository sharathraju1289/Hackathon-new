import localImageMap from './localImageMap.json';

// Generate unique image URLs via picsum.photos seeds to avoid storing long lists
const picsumImage = (propIndex, imgIndex, w = 1200, h = 800) => {
  // deterministic seed per property+image avoids duplication and keeps images varied
  return `https://picsum.photos/seed/house-${propIndex}-${imgIndex}/${w}/${h}`;
};

// Property types (added 'Land')
const TYPES = ["Rent", "Sale", "PG", "Lease", "Land"];
const LOCATIONS = [
  "Bandra, Mumbai", "Koramangala, Bangalore", "Jubilee Hills, Hyderabad", 
  "Vasant Kunj, Delhi", "Kalyani Nagar, Pune", "Adyar, Chennai", 
  "Whitefield, Bangalore", "Gachibowli, Hyderabad"
];

// Reusing deterministic generation to keep outputs stable between runs
export const generateProperties = (count = 100, imagesPerProperty = 5) => {
  return Array.from({ length: count }, (_, i) => {
    const typeValue = (i * 7) % TYPES.length;
    const locValue = (i * 13) % LOCATIONS.length;

    const type = TYPES[typeValue];
    const location = LOCATIONS[locValue];

    let basePriceValue = 0;
    let priceStr = "";

    if (type === "Sale") {
      basePriceValue = ((i * 1373) % 900) * 100000 + 5000000;
      priceStr = `₹${basePriceValue.toLocaleString('en-IN')}`;
    } else if (type === "Lease") {
      basePriceValue = ((i * 841) % 50) * 100000 + 1000000;
      priceStr = `₹${basePriceValue.toLocaleString('en-IN')}/yr`;
    } else if (type === "Rent") {
      basePriceValue = ((i * 71) % 100) * 1000 + 15000;
      priceStr = `₹${basePriceValue.toLocaleString('en-IN')}/mo`;
    } else if (type === "PG") {
      basePriceValue = ((i * 37) % 15) * 1000 + 6000;
      priceStr = `₹${basePriceValue.toLocaleString('en-IN')}/mo`;
    } else if (type === "Land") {
      basePriceValue = ((i * 97) % 500) * 10000 + 200000; // land pricing
      priceStr = `₹${basePriceValue.toLocaleString('en-IN')}`;
    }

    // remote images (fallback) via picsum
    const propertyImages = Array.from({ length: imagesPerProperty }, (_, j) => picsumImage(i, j));

    // local image paths that the downloader will create at `public/images/{category}`
    const category = type === 'PG' ? 'pg' : type === 'Land' ? 'land' : 'house';
    const computedLocalImages = Array.from({ length: imagesPerProperty }, (_, j) => `/images/${category}/${category}-${i}-${j}.jpg`);

    // prefer actual existing local images from the generated map; fall back to computedLocalImages, then remote
    const propId = `prop-${i}`;
    const mappedLocal = (localImageMap && localImageMap[propId] && localImageMap[propId].length) ? localImageMap[propId] : computedLocalImages;
    const finalImages = (mappedLocal && mappedLocal.length) ? mappedLocal : propertyImages;

    return {
      id: `prop-${i}`,
      title: `Modern ${type} Property in ${location.split(',')[0]}`,
      type: type,
      basePriceValue,
      price: priceStr,
      location: location,
      beds: (i % 4) + 1,
      baths: (i % 3) + 1,
      sqft: ((i * 313) % 3000) + 500,
      // primary images (local-first)
      image: finalImages[0],
      images: finalImages,
      // keep computed local images for reference
      localImage: computedLocalImages[0],
      localImages: computedLocalImages,
      isWishlisted: false,
    };
  });
};
