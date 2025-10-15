import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CometCard } from "@/components/ui/comet-card";

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
    <CometCard className={cn("w-full", className)}>
      <div className="rounded-2xl overflow-hidden group relative bg-neutral-900 border border-neutral-800">
        <Image
          src={product.image}
          alt={product.name}
          width={360}
          height={240}
          loading="lazy"
          className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {/* soft rim glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-none"
          style={{ boxShadow: "inset 0 0 60px rgba(128,65,255,0.02)" }}
        />
        <div className="p-4 absolute bottom-0 left-0 right-0">
          <p className="text-xs text-neutral-400">{product.category}</p>
          <h3 className="text-lg font-bold text-white mt-1">{product.name}</h3>
          <p className="text-sm text-green-400 font-semibold mt-2">
            {product.price}
          </p>
        </div>
      </div>
    </CometCard>
  );
};

export default ProductCard;
