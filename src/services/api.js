// Client-side service to call Next.js API routes backed by MongoDB

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
  const res = await fetch(`/api/products${toQuery(q)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to list products (${res.status})`);
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetch(`/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create product (${res.status})`);
  return res.json();
}

export async function updateProduct(id, patch) {
  const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update product (${res.status})`);
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete product (${res.status})`);
  return res.json();
}

export async function listCategories() {
  const res = await fetch(`/api/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to list categories (${res.status})`);
  return res.json();
}

export async function addCategory(name) {
  const res = await fetch(`/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok && res.status !== 200)
    throw new Error(`Failed to add category (${res.status})`);
  return res.json();
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
