"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { slugify } from "../lib/categories";
import { listCategories, listProducts } from "../services/api";

const Navbar = dynamic(() => import("./Navbar"), {
  ssr: false,
  loading: () => <div className="h-16" />,
});
const ExpandableGrid = dynamic(
  () => import("./expandable-card-demo-standard"),
  { ssr: false, loading: () => <div className="h-64" /> }
);
const Footer = dynamic(() => import("./Footer"), {
  ssr: false,
  loading: () => <div className="h-24 bg-black" />,
});

export default function CategoryClient({ slug }) {
  const [cat, setCat] = useState(null);
  const [catLoading, setCatLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function resolveCategory() {
      setCatLoading(true);
      try {
        const names = await listCategories();
        if (!mounted) return;
        const match = (names || []).find((name) => slugify(name) === slug);
        setCat(match ? { name: match, slug: slugify(match) } : null);
      } catch (err) {
        console.error("Failed to load categories:", err);
        if (mounted) setCat(null);
      } finally {
        if (mounted) setCatLoading(false);
      }
    }
    resolveCategory();
    return () => {
      mounted = false;
    };
  }, [slug]);

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
    <main className="relative min-h-screen bg-black text-blue-50 w-screen overflow-x-hidden">
      <Navbar />
      
      {/* Cinematic Header Block */}
      <div className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-4 w-full flex flex-col items-center justify-center border-b border-white/10">
        <p className="font-general text-[10px] uppercase tracking-widest text-blue-200/50 mb-4">
          Exclusive Collection
        </p>
        <h1 className="hero-heading special-font text-5xl sm:text-7xl md:text-[8rem] font-black text-center text-blue-50 leading-[0.8]">
          {cat ? (
             cat.name.split(" ").map((word, i) => (
                <span key={i} className="inline-block relative">
                   {word.slice(0, Math.ceil(word.length/2))}<b>{word.slice(Math.ceil(word.length/2), Math.ceil(word.length/2)+1)}</b>{word.slice(Math.ceil(word.length/2)+1)}&nbsp;
                </span>
             ))
          ) : "Category"}
        </h1>

        <div className="mt-12">
          <Link
            href="/products"
            className="rounded-full border border-blue-50/20 bg-blue-50/5 px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold text-blue-50 hover:bg-blue-50/10 transition-all duration-300"
          >
            View all products
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 min-h-[40vh]">
        {!catLoading && !cat && (
          <p className="text-center text-blue-50/70 py-20 font-robert-regular text-lg">
            This realm expands beyond known coordinates.{" "}
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors underline">
              Return Home
            </Link>
          </p>
        )}

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-5 text-red-200 text-center font-robert-regular">
            {error}
          </div>
        )}

        <div className="mt-8 transition-opacity duration-500">
          {loading ? (
            <div className="flex-center w-full py-20">
              <div className="three-body">
                <div className="three-body__dot bg-blue-50"></div>
                <div className="three-body__dot bg-blue-50"></div>
                <div className="three-body__dot bg-blue-50"></div>
              </div>
            </div>
          ) : items.length ? (
            <div className="dark">
               {/* Force dark mode for expandable grid mapping within this specific container */}
               <ExpandableGrid items={items} />
            </div>
          ) : (
            <p className="text-center text-blue-50/60 py-20 font-robert-regular text-lg">
              No elegant creations currently dwell in this category.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
