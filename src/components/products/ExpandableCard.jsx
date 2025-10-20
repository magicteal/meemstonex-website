"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Lightweight local implementation inspired by Aceternity Expandable Card
export default function ExpandableCard({ title, subtitle, image, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left focus:outline-none"
      >
        <Image
          src={image}
          alt=""
          width={224}
          height={160}
          className="h-20 w-28 rounded-md object-cover"
          sizes="(max-width: 768px) 112px, 224px"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className="text-sm text-gray-500">{subtitle}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{children}</p>
        </div>
        <div className="ml-2 text-gray-400">{open ? "▾" : "▸"}</div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden border-t border-gray-100 p-4"
          >
            <div className="text-sm text-gray-700">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
