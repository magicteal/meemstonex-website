"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../../components/products/ProductCard";
import CategorySelect from "../../components/products/CategorySelect";
import Modal from "../../components/products/Modal";
import { listProducts } from "../../services/mockApi";
import ExpandableGrid from "../../components/expandable-card-demo-standard";

/**
 * Folder structure suggestion
 * - src/services/mockApi.js
 * - src/components/products/{Modal.jsx,ToastProvider.jsx,ProductCard.jsx,ProductForm.jsx,CategorySelect.jsx}
 * - src/app/products/page.jsx (public catalogue)
 * - src/app/admin/products/page.jsx (admin editor)
 *
 * How to run with mock data
 * - Install dependencies and run dev server; mock API seeds localStorage and simulates latency.
 */

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sort, setSort] = useState("name:asc");
  const [selected, setSelected] = useState(null);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);
      setError(null);
      try {
        const nextPage = reset ? 1 : page;
        const res = await listProducts({
          page: nextPage,
          pageSize: 9,
          filter: { q: debouncedQ, categories: categoryFilter, priceRange },
          sort,
        });
        setHasMore(res.page * res.pageSize < res.total);
        if (reset) setItems(res.items);
        else setItems((prev) => [...prev, ...res.items]);
        setPage(nextPage + 1);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [page, debouncedQ, categoryFilter, priceRange, sort, loading]
  );

  // initial and on filter change
  useEffect(() => {
    setPage(1);
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, categoryFilter.join(","), priceRange.join(","), sort]);

  const onView = (p) => setSelected(p);

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) load();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, load]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col items-start gap-6">
        <h1 className="hero-heading text-5xl font-black text-gray-900">
          Products
        </h1>
        <br />
        <div className="flex-1">
          <div className="mt-2 flex items-center gap-3">
            {/* <select
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="name:asc">Name A→Z</option>
              <option value="name:desc">Name Z→A</option>
              <option value="price:asc">Price Low→High</option>
              <option value="price:desc">Price High→Low</option>
            </select> */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Filter by categories
              </label>
              <CategorySelect
                value={categoryFilter}
                onChange={setCategoryFilter}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Min</label>
              <input
                type="number"
                className="w-24 rounded-lg border px-2 py-1 text-sm"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
              />
              <label className="text-sm text-gray-600">Max</label>
              <input
                type="number"
                className="w-24 rounded-lg border px-2 py-1 text-sm"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      <section className="mt-6 space-y-8">
        {/* Group by category: show heading then a grid of ExpandableCards */}
        {(() => {
          const map = new Map();
          items.forEach((it) => {
            it.categories.length ? it.categories[0] : "Uncategorized";
            const key = it.categories.length
              ? it.categories[0]
              : "Uncategorized";
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(it);
          });
          return Array.from(map.entries()).map(([cat, prods]) => (
            <div key={cat}>
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                {cat}
              </h2>
              {/* The demo component now handles its own layout and spans full width */}
              <ExpandableGrid items={prods} />
            </div>
          ));
        })()}
      </section>

      <div ref={sentinelRef} className="h-10" />
      {loading && <p className="mt-2 text-sm text-gray-600">Loading…</p>}
      {!hasMore && !loading && (
        <p className="mt-2 text-sm text-gray-600">End of results</p>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
      >
        {selected && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.photo}
              alt={selected.name}
              className="h-64 w-full rounded-lg object-cover"
            />
            <div>
              <p className="text-lg font-semibold text-blue-700">
                ${selected.price.toFixed(2)}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {selected.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-gray-700">{selected.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
