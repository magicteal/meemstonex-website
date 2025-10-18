"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductCard({ product, onView, onQuickAdd }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4, boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={product.photo}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
            {product.name}
          </h3>
          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-sm font-medium text-blue-700">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {product.categories.slice(0, 3).map((c) => (
            <span
              key={c}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <button
            onClick={() => onView?.(product)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            View
          </button>
          {onQuickAdd && (
            <button
              onClick={() => onQuickAdd(product)}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              +
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
