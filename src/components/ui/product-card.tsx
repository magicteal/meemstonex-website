import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden group relative bg-neutral-900",
        className
      )}
    >
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={400}
        className="object-cover w-full h-80 transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="p-6 absolute bottom-0 left-0 right-0">
        <p className="text-sm text-neutral-400">{product.category}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{product.name}</h3>
        <p className="text-lg text-green-400 font-semibold mt-2">
          {product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
