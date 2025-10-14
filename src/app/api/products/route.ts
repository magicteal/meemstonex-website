import { NextResponse } from "next/server";
import { readProducts, addProduct, Product } from "@/lib/productsStore"; // Import Product type

export async function GET() {
  const products: Product[] = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const newProductData = await request.json();
    const { id, ...data } = newProductData;
    const createdProduct = await addProduct(data);
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (e: unknown) { // Use unknown instead of any
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return NextResponse.json(
      { error: errorMessage || "Failed to create product" },
      { status: 400 }
    );
  }
}