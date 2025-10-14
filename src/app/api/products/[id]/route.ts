import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/productsStore";

type AsyncRouteContext = {
  params: {
    id: string;
  };
};

// GET a single product by ID
export async function GET(
  request: NextRequest,
  { params }: AsyncRouteContext
) {
  try {
    const product = await getProductById(parseInt(params.id, 10));
    if (product) {
      return NextResponse.json(product);
    }
    return new NextResponse("Product not found", { status: 404 });
  } catch (e) {
    return new NextResponse("Error fetching product", { status: 500 });
  }
}

// PUT/PATCH handler to update a product
export async function PUT(
  request: NextRequest,
  { params }: AsyncRouteContext
) {
  try {
    const updatedData = await request.json();
    const updatedProduct = await updateProduct(
      parseInt(params.id, 10),
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
  { params }: AsyncRouteContext
) {
  try {
    await deleteProduct(parseInt(params.id, 10));
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (e: unknown) { // Use unknown instead of any
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return new NextResponse(errorMessage, { status: 404 });
  }
}