import { promises as fs } from "fs";
import path from "path";
import { products as seedProducts } from "@/lib/products-seed"; // Using a seed file

export type Product = (typeof seedProducts)[number];

const dataDir = path.join(process.cwd(), "src", "data");
const jsonPath = path.join(dataDir, "products.json");

// Function to ensure the JSON file exists, creating it from a seed if not.
async function ensureJsonFile() {
  try {
    await fs.access(jsonPath);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      jsonPath,
      JSON.stringify(seedProducts, null, 2),
      "utf8"
    );
  }
}

// Reads all products from products.json
export async function readProducts(): Promise<Product[]> {
  await ensureJsonFile();
  const raw = await fs.readFile(jsonPath, "utf8");
  return JSON.parse(raw);
}

// Writes an array of products to products.json
export async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(jsonPath, JSON.stringify(products, null, 2), "utf8");
}

// Gets a single product by its ID
export async function getProductById(
  id: number
): Promise<Product | undefined> {
  const list = await readProducts();
  return list.find((p) => p.id === id);
}

// Adds a new product to the list
export async function addProduct(product: Omit<Product, "id">): Promise<Product> {
  const list = await readProducts();
  const newId =
    list.length > 0 ? Math.max(...list.map((p) => p.id)) + 1 : 1;
  const newProduct = { ...product, id: newId };
  const next = [...list, newProduct];
  await writeProducts(next);
  return newProduct;
}

// Updates an existing product
export async function updateProduct(
  id: number,
  patch: Partial<Product>
): Promise<Product> {
  const list = await readProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  const updated = { ...list[idx], ...patch, id };
  list[idx] = updated;
  await writeProducts(list);
  return updated;
}

// Deletes a product by its ID
export async function deleteProduct(id: number): Promise<void> {
  const list = await readProducts();
  const next = list.filter((p) => p.id !== id);
  if (list.length === next.length) {
    throw new Error("Product not found to delete");
  }
  await writeProducts(next);
}