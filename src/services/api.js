// Client-side service to call Next.js API routes backed by MongoDB
// Optional: fall back to in-memory mock API for local/offline dev when NEXT_PUBLIC_USE_MOCK=1
import {
  listProducts as mockListProducts,
  getProduct as mockGetProduct,
  createProduct as mockCreateProduct,
  updateProduct as mockUpdateProduct,
  deleteProduct as mockDeleteProduct,
  listCategories as mockListCategories,
  addCategory as mockAddCategory,
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
    minPrice: filter.priceRange?.[0],
    maxPrice: filter.priceRange?.[1],
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
