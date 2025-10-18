"use client";

import React, { useId, useState } from "react";
// Changed import to the main 'framer-motion' package for standard practice
import { AnimatePresence, motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description?: string;
}

export default function ProductExpandableCard({
  product,
}: {
  product: Product;
}) {
  const [open, setOpen] = useState(false);
  // useId ensures the layoutId is unique if this component is used multiple times
  const id = useId();

  return (
    <>
      <div className="w-full px-4">
        {/* Collapsed Card */}
        <motion.div
          // This ID connects the collapsed card to the expanded modal
          layoutId={`card-container-${product.id}-${id}`}
          onClick={() => setOpen(true)}
          className="max-w-[1200px] mx-auto p-4 cursor-pointer rounded-xl bg-transparent hover:bg-white/20 transition-colors"
          style={{ borderRadius: "1rem" }} // Ensure consistent border-radius for the animation
        >
          <div className="flex items-center gap-4">
            <motion.div
              // Connect the images
              layoutId={`card-image-${product.id}-${id}`}
              className="flex-shrink-0"
              style={{ borderRadius: "0.5rem" }} // Match modal image border-radius
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 rounded-md object-cover"
              />
            </motion.div>
            <div className="flex-1">
              <motion.h3
                // Connect the titles
                layoutId={`card-title-${product.id}-${id}`}
                className="text-lg font-semibold text-white"
              >
                {product.name}
              </motion.h3>
              <p className="text-sm text-neutral-400">{product.category}</p>
              {product.description && (
                <p className="text-sm text-neutral-500 mt-1 hidden md:block">
                  {product.description}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <button className="bg-white text-black px-4 py-2 rounded-full">
                View
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Expanded Modal */}
            <div className="fixed inset-0 z-50 grid place-items-center p-4">
              <motion.div
                // This ID connects the expanded modal to the collapsed card
                layoutId={`card-container-${product.id}-${id}`}
                className="w-full max-w-2xl bg-white text-black rounded-2xl overflow-hidden shadow-xl"
                style={{ borderRadius: "1rem" }}
              >
                <motion.div
                  // Connect the images
                  layoutId={`card-image-${product.id}-${id}`}
                  className="w-full h-80 overflow-hidden"
                  style={{ borderRadius: "0" }} // Image container itself doesn't need rounding
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <motion.h3
                        // Connect the titles
                        layoutId={`card-title-${product.id}-${id}`}
                        className="text-2xl font-bold"
                      >
                        {product.name}
                      </motion.h3>
                      <p className="text-neutral-600 mt-2">
                        {product.category}
                      </p>
                    </div>
                    <div>
                      {/* We wrap the close button in a motion div to fade it in */}
                      <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.2 },
                        }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="px-3 py-1 bg-neutral-200 rounded"
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>

                  {/* Fade in the content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.15 } }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mt-4 text-neutral-700">
                      <p>Price: {product.price}</p>
                      <p className="mt-4">Detailed description coming soon.</p>
                    </div>

                    <div className="mt-6">
                      <a
                        href="#"
                        className="inline-block bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Enquire
                      </a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
