// Client-side service to call Next.js API routes backed by MongoDB
// Optional: fall back to in-memory mock API for local/offline dev when NEXT_PUBLIC_USE_MOCK=1
import {
  listProducts as mockListProducts,
  createProduct as mockCreateProduct,
  updateProduct as mockUpdateProduct,
  deleteProduct as mockDeleteProduct,
  listCategories as mockListCategories,
  addCategory as mockAddCategory,
  getHomepageSettings as mockGetHomepageSettings,
  updateHomepageSettings as mockUpdateHomepageSettings,
} from "./mockApi";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1";

function toQuery(params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v == null || v === "") continue;
    if (Array.isArray(v)) sp.set(k, v.join(","));
    else sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export async function listProducts({
  page = 1,
  pageSize = 12,
  filter = {},
  sort = "name:asc",
} = {}) {
  const q = {
    page,
    pageSize,
    sort,
    q: filter.q,
    categories: filter.categories,
    featured:
      typeof filter.featured === "boolean"
        ? String(filter.featured)
        : undefined,
  };
  if (USE_MOCK) return mockListProducts({ page, pageSize, filter, sort });
  try {
    const res = await fetch(`/api/products${toQuery(q)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to list products (${res.status})`);
    return res.json();
  } catch (e) {
    if (!USE_MOCK) throw e;
    return mockListProducts({ page, pageSize, filter, sort });
  }
}

export async function createProduct(payload) {
  if (USE_MOCK) return mockCreateProduct(payload);
  try {
    const res = await fetch(`/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to create product (${res.status})`);
    return res.json();
  } catch (e) {
    if (!USE_MOCK) throw e;
    return mockCreateProduct(payload);
  }
}

export async function updateProduct(id, patch) {
  if (USE_MOCK) return mockUpdateProduct(id, patch);
  try {
    const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`Failed to update product (${res.status})`);
    return res.json();
  } catch (e) {
    if (!USE_MOCK) throw e;
    return mockUpdateProduct(id, patch);
  }
}

export async function deleteProduct(id) {
  if (USE_MOCK) return mockDeleteProduct(id);
  try {
    const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete product (${res.status})`);
    return res.json();
  } catch (e) {
    if (!USE_MOCK) throw e;
    return mockDeleteProduct(id);
  }
}

export async function listCategories() {
  if (USE_MOCK) return mockListCategories();
  try {
    const res = await fetch(`/api/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to list categories (${res.status})`);
    return res.json();
  } catch (e) {
    // Graceful fallback to mock so UI remains usable without DB
    console.warn(
      "listCategories: falling back to mock due to error:",
      e?.message || e
    );
    return mockListCategories();
  }
}

export async function addCategory(name) {
  if (USE_MOCK) return mockAddCategory(name);
  try {
    const res = await fetch(`/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok && res.status !== 200)
      throw new Error(`Failed to add category (${res.status})`);
    return res.json();
  } catch (e) {
    // Graceful fallback to mock so admin can proceed even if DB is down
    console.warn(
      "addCategory: falling back to mock due to error:",
      e?.message || e
    );
    return mockAddCategory(name);
  }
}

// Re-export mockUpload so ProductForm keeps working without change
export { mockUpload } from "./mockApi";

export async function renameCategory(oldName, newName) {
  const res = await fetch(`/api/categories`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldName, newName }),
  });
  if (!res.ok) throw new Error(`Failed to rename category (${res.status})`);
  return res.json();
}

export async function deleteCategory(name) {
  const res = await fetch(`/api/categories?name=${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete category (${res.status})`);
  return res.json();
}

// Admin: reset all categories and remove from all products
export async function resetAllCategories() {
  const res = await fetch(`/api/categories?all=true`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to reset categories (${res.status})`);
  return res.json();
}

export async function listBlogs({ page = 1, pageSize = 12 } = {}) {
  const res = await fetch(`/api/blogs${toQuery({ page, pageSize })}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to list blogs (${res.status})`);
  return res.json();
}

export async function getBlogBySlug(slug) {
  const res = await fetch(`/api/blogs${toQuery({ slug })}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load blog (${res.status})`);
  return res.json();
}

export async function createBlog(payload) {
  const res = await fetch(`/api/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Failed to create blog (${res.status})`);
  return data;
}

export async function updateBlog(id, payload) {
  const res = await fetch(`/api/blogs/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Failed to update blog (${res.status})`);
  return data;
}

export async function deleteBlog(id) {
  const res = await fetch(`/api/blogs/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Failed to delete blog (${res.status})`);
  return data;
}

let homepageSettingsPromise = null;
let homepageSettingsCache = null;
let homepageSettingsCacheTime = 0;
const CACHE_TTL = 5000; // Cache settings for 5 seconds to deduplicate parallel requests

export async function getHomepageSettings() {
  if (USE_MOCK) return mockGetHomepageSettings();

  const now = Date.now();
  if (homepageSettingsCache && (now - homepageSettingsCacheTime < CACHE_TTL)) {
    return homepageSettingsCache;
  }

  if (homepageSettingsPromise) {
    return homepageSettingsPromise;
  }

  homepageSettingsPromise = (async () => {
    try {
      const res = await fetch(`/api/homepage`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load settings (${res.status})`);
      const data = await res.json();
      homepageSettingsCache = data;
      homepageSettingsCacheTime = Date.now();
      return data;
    } catch (e) {
      if (!USE_MOCK) throw e;
      return mockGetHomepageSettings();
    } finally {
      homepageSettingsPromise = null;
    }
  })();

  return homepageSettingsPromise;
}


export async function updateHomepageSettings(settings) {
  if (USE_MOCK) return mockUpdateHomepageSettings(settings);
  try {
    const res = await fetch(`/api/admin/homepage`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error(`Failed to save settings (${res.status})`);
    return res.json();
  } catch (e) {
    if (!USE_MOCK) throw e;
    return mockUpdateHomepageSettings(settings);
  }
}
