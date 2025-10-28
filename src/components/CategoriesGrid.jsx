"use client";

import Link from "next/link";
import { categories } from "../lib/categories";

export default function CategoriesGrid({ title = "Categories" }) {
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold text-blue-50">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="group relative rounded-md border border-white/10 bg-white/5 p-5 text-center text-blue-50 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="pointer-events-none select-none text-sm md:text-base font-medium tracking-wide">
              {c.name}
            </span>
            <span className="absolute inset-0 rounded-md ring-1 ring-inset ring-white/10 group-hover:ring-white/20" />
          </Link>
        ))}
      </div>
    </section>
  );
}
