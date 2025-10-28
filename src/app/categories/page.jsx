"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { categories } from "../../lib/categories";

const Navbar = dynamic(() => import("../../components/Navbar"), {
  ssr: false,
  loading: () => <div className="h-16" />,
});

export default function CategoriesIndexPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Navbar />
      <div className="pt-8 md:pt-20">
        <h1 className="hero-heading text-5xl md:text-6xl font-black text-gray-900">
          Categories
        </h1>
        <p className="mt-3 text-gray-700">
          Browse all product categories and explore our collection.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="rounded-md border border-gray-200 bg-white px-5 py-6 text-center text-gray-900 shadow-sm transition hover:shadow-md"
          >
            <span className="text-base md:text-lg font-semibold tracking-wide">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
