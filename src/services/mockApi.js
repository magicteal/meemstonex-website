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
  const prices = [
    129.99, 59.0, 79.99, 39.99, 199.0, 24.5, 89.0, 19.5, 25.0, 149.0, 49.99,
    119.0,
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
    price: prices[i],
    photo: samplePhotos[i % samplePhotos.length],
    description:
      "High-quality product designed for everyday use. Durable materials, modern aesthetic, and great performance.",
  }));
}

let DB = { items: seedProducts(), categories: [...seedCategories] };
const persisted = loadState();
if (persisted && Array.isArray(persisted.items) && persisted.items.length) {
  DB = persisted;
}

function applyFilterSort(items, { filter = {}, sort } = {}) {
  let results = [...items];
  if (filter.q) {
    const q = filter.q.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (filter.categories && filter.categories.length) {
    results = results.filter((p) =>
      filter.categories.every((c) => p.categories.includes(c))
    );
  }
  if (filter.priceRange) {
    const [min, max] = filter.priceRange;
    results = results.filter((p) => p.price >= min && p.price <= max);
  }
  if (sort) {
    const [key, dir] = sort.split(":");
    results.sort((a, b) => {
      const mult = dir === "desc" ? -1 : 1;
      if (key === "name") return a.name.localeCompare(b.name) * mult;
      if (key === "price") return (a.price - b.price) * mult;
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
  const pageItems = results.slice(start, end);
  return withLatency({ items: pageItems, total, page, pageSize });
}

export async function getProduct(id) {
  const item = DB.items.find((p) => p.id === id);
  if (!item) throw new Error("Product not found");
  return withLatency({ ...item });
}

export async function createProduct(product) {
  const id = uuidv4();
  const newItem = { id, ...product };
  DB.items.unshift(newItem);
  // track categories
  newItem.categories.forEach((c) => {
    if (!DB.categories.includes(c)) DB.categories.push(c);
  });
  saveState(DB.items, DB.categories);
  return withLatency({ ...newItem });
}

export async function updateProduct(id, patch) {
  const idx = DB.items.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  const updated = { ...DB.items[idx], ...patch };
  DB.items[idx] = updated;
  // update categories
  if (patch.categories) {
    patch.categories.forEach((c) => {
      if (!DB.categories.includes(c)) DB.categories.push(c);
    });
  }
  saveState(DB.items, DB.categories);
  return withLatency({ ...updated });
}

export async function deleteProduct(id) {
  const idx = DB.items.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  const [removed] = DB.items.splice(idx, 1);
  saveState(DB.items, DB.categories);
  return withLatency({ ...removed });
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
  // If a File/Blob is provided, read it as a data URL and POST to our upload API which will forward to Cloudinary.
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
  } catch (err) {
    const objUrl = URL.createObjectURL(fileOrUrl);
    return withLatency(objUrl);
  }
};
