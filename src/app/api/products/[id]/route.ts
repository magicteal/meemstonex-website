import { NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/productsStore";

// GET a single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = await getProductById(parseInt(params.id));
  if (product) {
    return NextResponse.json(product);
  }
  return new NextResponse("Product not found", { status: 404 });
}

// PUT/PATCH handler to update a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedData = await request.json();
    const updatedProduct = await updateProduct(parseInt(params.id), updatedData);
    return NextResponse.json(updatedProduct);
  } catch (e: any) {
    return new NextResponse(e.message, { status: 404 });
  }
}

// DELETE handler to remove a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteProduct(parseInt(params.id));
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 404 });
  }
}