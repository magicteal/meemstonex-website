"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { categoryBySlug } from "../lib/categories";
import { listProducts } from "../services/api";

const Navbar = dynamic(() => import("./Navbar"), {
  ssr: false,
  loading: () => <div className="h-16" />,
});
const ExpandableGrid = dynamic(
  () => import("./expandable-card-demo-standard"),
  { ssr: false, loading: () => <div className="h-64" /> }
);

export default function CategoryClient({ slug }) {
  const cat = categoryBySlug(slug);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!cat) return;
      setLoading(true);
      setError(null);
      try {
        const res = await listProducts({
          page: 1,
          pageSize: 100,
          filter: { categories: [cat.name] },
          sort: "name:asc",
        });
        if (mounted) setItems(res.items || []);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [cat?.name]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Navbar />
      <div className="flex items-center justify-between pt-8 md:pt-20">
        <h1 className="hero-heading text-4xl md:text-6xl font-black text-gray-900">
          {cat ? cat.name : "Category"}
        </h1>
        <Link
          href="/products"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          View all products
        </Link>
      </div>

      {!cat && (
        <p className="mt-6 text-gray-700">
          Unknown category.{" "}
          <Link href="/" className="underline">
            Go home
          </Link>
          .
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : items.length ? (
          <ExpandableGrid items={items} />
        ) : (
          <p className="text-gray-700">No products found in this category.</p>
        )}
      </div>
    </main>
  );
}
