"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductCard({ product, onView, onQuickAdd }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative h-[420px] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-xl"
    >
      <Image
        src={product.photo}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Black Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black" />
      
      {/* Content Container (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-xl font-black uppercase tracking-tight text-white special-font">
            {product.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {product.categories.slice(0, 2).map((c) => (
              <span
                key={c}
                className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-white/70 backdrop-blur-md border border-white/10"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-1 flex items-center gap-2">
          <button
            onClick={() => onView?.(product)}
            className="flex-1 rounded-full bg-white py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-blue-600 hover:text-white"
          >
            View Product
          </button>
          {onQuickAdd && (
            <button
              onClick={() => onQuickAdd(product)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:bg-blue-600"
            >
              +
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
