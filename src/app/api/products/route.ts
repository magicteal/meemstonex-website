import { NextResponse } from "next/server";
import { readProducts, addProduct, Product } from "@/lib/productsStore"; // Import Product type

export async function GET() {
  const products: Product[] = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const newProductData = await request.json();
    const { name, category, price, image } = newProductData as Partial<Product>;
    const createdProduct = await addProduct({
      // Basic whitelist of product fields; ignore any provided id
      name: name ?? "",
      category: category ?? "",
      price: price ?? "",
      image: image ?? "",
    });
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (e: unknown) { // Use unknown instead of any
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return NextResponse.json(
      { error: errorMessage || "Failed to create product" },
      { status: 400 }
    );
  }
}