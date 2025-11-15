"use client";

import React, { useEffect, useState } from "react";
import Panorama3DSlider from "./PanoramaRing";
import { listProducts } from "../services/api";
import { slugify } from "../lib/categories";

// Section wrapper placed after Our Process with proper padding to match theme
export default function CoverFlowCarousel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await listProducts({
          page: 1,
          pageSize: 20,
          filter: { featured: true },
          sort: "name:asc",
        });
        if (!mounted) return;
        const mapped = (res.items || []).map((p) => ({
          id: p.id,
          title: p.name,
          imageUrl: (Array.isArray(p.photos) && p.photos.length) ? p.photos[0] : (p.photo || ""),
          href:
            Array.isArray(p.categories) && p.categories.length
              ? `/categories/${slugify(p.categories[0])}`
              : "/products",
        }));
        setItems(mapped);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load featured");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-widest text-white sm:text-3xl md:text-4xl">
            Featured Products
          </h2>
          {error && (
            <p className="mt-2 text-sm text-red-300">{error}</p>
          )}
        </div>
      </div>
      {/* Pass items to the panorama ring; it has internal fallback if empty */}
      <Panorama3DSlider items={items} />
    </section>
  );
}
