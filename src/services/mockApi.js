/**
 * README (how to run)
 * - This project uses Next.js + Tailwind CSS v4. To run locally:
 *   1) Install deps
 *   2) Start dev server
 *
 * The mock API below provides in-memory persistence with optional localStorage,
 * simulates network latency (200-800ms) and occasional errors for demo.
 * CRUD is fully functional without a backend.
 */

import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "mock_products_v1";
const STORAGE_CATS_KEY = "mock_categories_v1";

const randomDelay = () => 200 + Math.floor(Math.random() * 600);
// Default simulated network error rate. Can be overridden by
// NEXT_PUBLIC_MOCK_ERROR_RATE at build time. If NEXT_PUBLIC_USE_MOCK=1
// and no explicit NEXT_PUBLIC_MOCK_ERROR_RATE is provided, default to 0
// so local development isn't flaky by default.
const envRate = typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_MOCK_ERROR_RATE;
let errorRate = 0.1; // legacy default
if (typeof envRate !== "undefined") {
  const parsed = Number(envRate);
  if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) errorRate = parsed;
}
if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_USE_MOCK === "1" && typeof envRate === "undefined") {
  // when mock mode is explicitly enabled, avoid random failures unless user asked for them
  errorRate = 0;
}

export function setErrorRate(rate) {
  errorRate = Math.max(0, Math.min(1, rate));
}

function withLatency(result) {
  return new Promise((resolve, reject) => {
    const fail = Math.random() < errorRate;
    setTimeout(() => {
      if (fail) reject(new Error("Network error (simulated)"));
      else resolve(result);
    }, randomDelay());
  });
}

function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function loadState() {
  const ls = getStorage();
  if (!ls) return null;
  try {
    const items = JSON.parse(ls.getItem(STORAGE_KEY) || "[]");
    const categories = JSON.parse(ls.getItem(STORAGE_CATS_KEY) || "[]");
    return { items, categories };
  } catch {
    return null;
  }
}

function saveState(items, categories) {
  const ls = getStorage();
  if (!ls) return;
  ls.setItem(STORAGE_KEY, JSON.stringify(items));
  ls.setItem(STORAGE_CATS_KEY, JSON.stringify(categories));
}

function withoutPrice(item) {
  if (!item || typeof item !== "object") return item;
  const rest = { ...item };
  delete rest.price;
  return rest;
}

// Seed data
const seedCategories = [
  "Accessories",
  "Apparel",
  "Electronics",
  "Home",
  "Outdoor",
  "Sports",
  "Office",
];

const samplePhotos = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526178611754-5403e6f7e859?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514328355161-9f2e1e233b76?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
];

function seedProducts() {
  const names = [
    "Aurora Headphones",
    "Nimbus Hoodie",
    "Cascade Backpack",
    "Lumen Desk Lamp",
    "Pulse Smartwatch",
    "Summit Water Bottle",
    "Voyager Sunglasses",
    "Harbor Mug",
    "Breeze T-Shirt",
    "Echo Bluetooth Speaker",
    "Orbit Mouse",
    "Trek Running Shoes",
  ];
  const categories = [
    ["Electronics", "Accessories"],
    ["Apparel"],
    ["Outdoor", "Sports"],
    ["Home", "Office"],
    ["Electronics"],
    ["Sports", "Outdoor"],
    ["Accessories"],
    ["Home"],
    ["Apparel"],
    ["Electronics"],
    ["Electronics", "Office"],
    ["Sports", "Apparel"],
  ];

  return names.map((name, i) => ({
    id: uuidv4(),
    name,
    categories: categories[i],
    photos: [
      samplePhotos[i % samplePhotos.length],
      samplePhotos[(i + 1) % samplePhotos.length],
      samplePhotos[(i + 2) % samplePhotos.length],
    ],
    photo: samplePhotos[i % samplePhotos.length],
    description:
      "High-quality product designed for everyday use. Durable materials, modern aesthetic, and great performance.",
    featured: false,
  }));
}

let DB = { items: seedProducts(), categories: [...seedCategories] };
const persisted = loadState();
if (persisted && Array.isArray(persisted.items) && persisted.items.length) {
  DB = {
    items: persisted.items.map(withoutPrice),
    categories: Array.isArray(persisted.categories) ? persisted.categories : [],
  };
}

function applyFilterSort(items, { filter = {}, sort } = {}) {
  let results = [...items];
  if (filter.q) {
    const q = filter.q.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (typeof filter.featured === "boolean") {
    results = results.filter((p) => Boolean(p.featured) === filter.featured);
  }
  if (filter.categories && filter.categories.length) {
    results = results.filter((p) =>
      filter.categories.every((c) => p.categories.includes(c))
    );
  }
  if (sort) {
    const [key, dir] = sort.split(":");
    results.sort((a, b) => {
      const mult = dir === "desc" ? -1 : 1;
      if (key === "name") return a.name.localeCompare(b.name) * mult;
      return 0;
    });
  }
  return results;
}

export async function listProducts({
  page = 1,
  pageSize = 12,
  filter = {},
  sort,
} = {}) {
  const results = applyFilterSort(DB.items, { filter, sort });
  const total = results.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = results.slice(start, end).map(withoutPrice);
  return withLatency({ items: pageItems, total, page, pageSize });
}

export async function getProduct(id) {
  const item = DB.items.find((p) => p.id === id);
  if (!item) throw new Error("Product not found");
  return withLatency(withoutPrice({ ...item }));
}

export async function createProduct(product) {
  const { ...safeProduct } = product || {};
  const id = uuidv4();
  // Ensure photos array exists and photo field for backward compatibility
  const photos = Array.isArray(safeProduct.photos) && safeProduct.photos.length
    ? safeProduct.photos
        .filter((photo) => typeof photo === "string" && photo.trim())
        .map((photo) => photo.trim())
    : safeProduct.photo
    ? [String(safeProduct.photo).trim()].filter(Boolean)
    : [];
  const newItem = withoutPrice({
    id,
    featured: false,
    ...safeProduct,
    photos,
    photo: photos[0] || safeProduct.photo,
  });
  DB.items.unshift(newItem);
  // track categories
  if (Array.isArray(newItem.categories)) {
    newItem.categories.forEach((c) => {
      if (!DB.categories.includes(c)) DB.categories.push(c);
    });
  }
  saveState(DB.items, DB.categories);
  return withLatency(withoutPrice({ ...newItem }));
}

export async function updateProduct(id, patch) {
  const idx = DB.items.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  
  // Handle photos array update
  const { ...safePatch } = patch || {};
  const updates = { ...safePatch };
  if ("photos" in safePatch) {
    const photoArray = Array.isArray(safePatch.photos)
      ? safePatch.photos
          .filter((photo) => typeof photo === "string" && photo.trim())
          .map((photo) => photo.trim())
      : [];
    if (photoArray.length > 0) {
      updates.photos = photoArray;
      updates.photo = photoArray[0];
    }
  } else if ("photo" in safePatch && safePatch.photo) {
    const onePhoto = String(safePatch.photo).trim();
    if (onePhoto) {
      updates.photos = [onePhoto];
      updates.photo = onePhoto;
    }
  }
  
  const updated = withoutPrice({ ...DB.items[idx], ...updates });
  DB.items[idx] = updated;
  // update categories
  if (safePatch.categories) {
    safePatch.categories.forEach((c) => {
      if (!DB.categories.includes(c)) DB.categories.push(c);
    });
  }
  saveState(DB.items, DB.categories);
  return withLatency(withoutPrice({ ...updated }));
}

export async function deleteProduct(id) {
  const idx = DB.items.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  const [removed] = DB.items.splice(idx, 1);
  saveState(DB.items, DB.categories);
  return withLatency(withoutPrice({ ...removed }));
}

export async function listCategories() {
  return withLatency([...DB.categories]);
}

export async function addCategory(name) {
  if (!name) throw new Error("Category name required");
  if (!DB.categories.includes(name)) DB.categories.push(name);
  saveState(DB.items, DB.categories);
  return withLatency(name);
}

export const mockUpload = async (fileOrUrl) => {
  // If a URL string is provided, call the server upload proxy which for demo returns the same URL.
  if (typeof fileOrUrl === "string") {
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fileOrUrl }),
      });
      const data = await res.json();
      return withLatency(data.url || fileOrUrl);
    } catch {
      return withLatency(fileOrUrl);
    }
  }

  // For File objects in the browser we still create an object URL for preview (no real upload in this demo)
  // If a File/Blob is provided, read it as a data URL and POST to our upload API which will forward to AWS S3.
  try {
    const readDataUrl = () =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrUrl);
      });

    const dataUrl = await readDataUrl();
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: dataUrl }),
    });
    const data = await res.json();
    if (data && data.url) return withLatency(data.url);
    // fallback to object URL preview
    const objUrl = URL.createObjectURL(fileOrUrl);
    return withLatency(objUrl);
  } catch {
    const objUrl = URL.createObjectURL(fileOrUrl);
    return withLatency(objUrl);
  }
};

const HOMEPAGE_SETTINGS_KEY = "mock_homepage_settings_v1";

const defaultSettings = {
  hero: {
    heading: "MEEMSTONEX",
    paragraph: "Enter the world of Meemstonex, where raw natural stones are transformed into timeless architectural masterpieces. Crafting unmatched luxury for three generations, our premium marble collection brings custom precision and breathtaking beauty to your spaces.",
    buttonTitle: "Explore Products",
    buttonLink: "/products",
    videos: [
      "/videos/hero-1.mp4",
      "/videos/hero-2.mp4",
      "/videos/hero-3.mp4",
      "/videos/hero-4.mp4",
      "/videos/hero-2.mp4"
    ]
  },
  about: {
    imageUrl: "/img/sub-hero.png",
    title: "Disc<b>o</b>ver the world of <br /> W<b>o</b>rld with Meemstonex",
    subtext: "Welcome to Meemstonex",
    trailImages: [
      "/products/P1.jpg",
      "/products/P2.jpg",
      "/products/P3.jpg",
      "/products/P4.jpg",
      "/products/P5.jpg",
      "/products/P6.jpg",
      "/products/P7.jpg"
    ]
  },
  ourProcess: {
    subtitle: "Our Process",
    title: "YOUR DREAM TEMPLE IN 5 STEPS",
    description: "Looking to design your Dream Temple? Here's how you can get started.",
    steps: [
      "Lets Connect One on One",
      "Explore our Catalog",
      "Place The Order",
      "Approval",
      "Delivery and Installation"
    ]
  },
  features: {
    subtitle: "Where Everyday Elegance Meets a World of Interconnected Luxury",
    description: "Immerse yourself in a rich and ever-expanding universe where our vibrant array of marble products seamlessly converge, creating an interconnected overlay of refined experiences within your home"
  },
  stats: {
    imageUrl: "/img/numbersBG.jpg",
    subtitle: "Completed Custom Projects",
    title: "COMPLETED CUSTOM PROJECTS",
    items: [
      { value: "80+", label: "Projects" },
      { value: "100+", label: "Cities" },
      { value: "28+", label: "Years Experience" }
    ]
  },
  story: {
    subtitle: "the multiversal world of meemstonex",
    title: "The st<b>o</b>ry of <br /> generations",
    description: "For three generations, Meemstonex Marble has shaped the poetry of stone where earth’s finest artistry becomes a family’s enduring legacy. From the first chisel strike to today’s modern craftsmanship, our heritage lives in every vein, every polish, and every masterpiece we create. Guided by passion, precision, and pride, we honor nature’s grandeur by transforming raw marble into timeless expressions of beauty and strength. At Meemstonex, we don’t just work with stone we preserve tradition, craft stories, and carve the legacy of generations into every surface we touch",
    buttonTitle: "discover products"
  },
  contact: {
    imageUrl: "/img/abdul.jpg",
    subtitle: "Contact Meemstonex",
    title: "Let's b<b>u</b>ild the <br /> new e<b>r</b>a of <br /> ma<b>r</b>bles toge<b>t</b>her",
    buttonTitle: "contact us"
  }
};

let mockHomepageSettings = defaultSettings;

function ensureBoldTags(text) {
  if (!text) return "";
  
  // Normalize text for comparison with default keys
  const normalized = text.replace(/<\/?b>/gi, "").toLowerCase().replace(/\s+/g, " ").trim();
  
  const DEFAULT_MAP = {
    "discover the world of <br /> world with meemstonex": "Disc<b>o</b>ver the world of <br /> W<b>o</b>rld with Meemstonex",
    "the story of <br /> generations": "The st<b>o</b>ry of <br /> generations",
    "let's build the <br /> new era of <br /> marbles together": "Let's b<b>u</b>ild the <br /> new e<b>r</b>a of <br /> ma<b>r</b>bles toge<b>t</b>her"
  };
  
  if (DEFAULT_MAP[normalized]) {
    return DEFAULT_MAP[normalized];
  }
  
  // Otherwise, auto-inject bold tags into words of length >= 3
  let clean = text.replace(/<\/?b>/gi, "");
  
  const words = clean.split(" ");
  const stopWords = ["the", "of", "and", "in", "to", "with", "a", "an", "for", "on", "at", "by", "is", "it"];
  
  const processed = words.map(word => {
    // If it is an HTML tag or stop word, return as is
    if (word.includes("<") || word.includes(">") || word.includes("/") || stopWords.includes(word.toLowerCase())) {
      return word;
    }
    
    // Remove punctuation to calculate correct word length and index
    let cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, "");
    if (cleanWord.length < 3) {
      return word;
    }
    
    // Find middle index of clean word
    let mid = Math.floor(cleanWord.length / 2);
    let targetChar = cleanWord[mid];
    
    // Find index of target character in original word
    let idx = word.indexOf(targetChar);
    if (idx !== -1) {
      return word.slice(0, idx) + "<b>" + targetChar + "</b>" + word.slice(idx + 1);
    }
    return word;
  });
  
  return processed.join(" ");
}

try {
  if (typeof window !== "undefined") {
    const ls = window.localStorage.getItem(HOMEPAGE_SETTINGS_KEY);
    if (ls) mockHomepageSettings = JSON.parse(ls);
  }
} catch (e) {}

export async function getHomepageSettings() {
  const copy = JSON.parse(JSON.stringify(mockHomepageSettings));
  if (copy.about && copy.about.title) {
    copy.about.title = ensureBoldTags(copy.about.title);
  }
  if (copy.story && copy.story.title) {
    copy.story.title = ensureBoldTags(copy.story.title);
  }
  if (copy.contact && copy.contact.title) {
    copy.contact.title = ensureBoldTags(copy.contact.title);
  }
  return withLatency(copy);
}

export async function updateHomepageSettings(settings) {
  mockHomepageSettings = JSON.parse(JSON.stringify(settings));
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HOMEPAGE_SETTINGS_KEY, JSON.stringify(mockHomepageSettings));
    }
  } catch (e) {}
  return withLatency(mockHomepageSettings);
}
