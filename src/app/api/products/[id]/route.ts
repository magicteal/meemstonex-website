import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/productsStore";

// Next.js 15 route handlers receive params as a Promise in the context
type RouteContext = {
  params: Promise<{ id: string }>; 
};

// GET a single product by ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const product = await getProductById(parseInt(id, 10));
    if (product) {
      return NextResponse.json(product);
    }
    return new NextResponse("Product not found", { status: 404 });
  } catch {
    return new NextResponse("Error fetching product", { status: 500 });
  }
}

// PUT/PATCH handler to update a product
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const updatedData = await request.json();
    const updatedProduct = await updateProduct(
      parseInt(id, 10),
      updatedData
    );
    return NextResponse.json(updatedProduct);
  } catch (e: unknown) { // Use unknown instead of any
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return new NextResponse(errorMessage, { status: 404 });
  }
}

// DELETE handler to remove a product
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    await deleteProduct(parseInt(id, 10));
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (e: unknown) { // Use unknown instead of any
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return new NextResponse(errorMessage, { status: 404 });
  }
}