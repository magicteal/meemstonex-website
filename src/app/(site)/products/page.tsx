import SectionHeader from "@/components/ui/section-header";
import ProductCard from "@/components/ui/product-card";
import React from "react";
import { readProducts } from "@/lib/productsStore"; // Import the readProducts function

// Define the Product type
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

// Make the component async to fetch data on the server
const ProductsPage = async () => {
  // Fetch products directly using the store function
  const products: Product[] = await readProducts();

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const { category } = product;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="text-white min-h-screen">
      <SectionHeader
        title="Our"
        highlight="Products"
        subtitle="Explore our handcrafted collection of stone marvels."
      />
      <div className="container mx-auto px-8 pb-32">
        {Object.keys(productsByCategory).length === 0 ? (
          <p className="text-center text-neutral-400">No products found.</p>
        ) : (
          Object.keys(productsByCategory).map((category) => (
            <div key={category} className="mb-24">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 pl-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-purple-400 to-indigo-400">
                  {category}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {productsByCategory[category].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
