"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { listProducts } from "../../services/api";
import Image from "next/image";

const Navbar = dynamic(() => import("../../components/Navbar"), {
  ssr: false,
  loading: () => <div className="h-16" />,
});
const CategorySelect = dynamic(
  () => import("../../components/products/CategorySelect"),
  { ssr: false, loading: () => <div className="h-10 w-48 bg-gray-100" /> }
);
const Modal = dynamic(() => import("../../components/products/Modal"), {
  ssr: false,
  loading: () => null,
});
const ExpandableGrid = dynamic(
  () => import("../../components/expandable-card-demo-standard"),
  { ssr: false, loading: () => <div className="h-64" /> }
);

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
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
          // increase pageSize so newly added items are more likely to appear
          pageSize: 100,
          filter: { q: debouncedQ, categories: categoryFilter },
          sort,
        });
        setHasMore(res.page * res.pageSize < res.total);
        // Reset vs append logic; also guard against accidental duplicate IDs
        if (reset) setItems(res.items);
        else
          setItems((prev) => {
            const seen = new Set(prev.map((p) => p.id));
            const merged = [...prev];
            res.items.forEach((p) => {
              if (!seen.has(p.id)) merged.push(p);
            });
            return merged;
          });
        setPage(nextPage + 1);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [page, debouncedQ, categoryFilter, sort, loading]
  );

  // initial and on filter change
  useEffect(() => {
    setPage(1);
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, categoryFilter.join(","), sort]);

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
      <Navbar />
      <div className="flex flex-col items-start gap-6">
        <h1 className="hero-heading text-6xl md:text-7xl pt-8 md:pt-20 font-black text-gray-900">
          Products
        </h1>

        <div className="w-full">
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Filter by categories
              </label>
              <div className="w-full">
                <CategorySelect
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  allowCreate={false}
                />
              </div>
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
        {/* Group by category: show heading then a grid of ExpandableCards
            NOTE: a product may belong to multiple categories. Add each product
            to every category group it belongs to so it appears under all
            relevant headings. */}
        {(() => {
          const map = new Map();
          items.forEach((it) => {
            const cats = Array.isArray(it.categories) && it.categories.length
              ? it.categories
              : ["Uncategorized"];
            cats.forEach((c) => {
              const key = c || "Uncategorized";
              if (!map.has(key)) map.set(key, []);
              // avoid adding the same product twice to a category
              const list = map.get(key);
              if (!list.some((p) => p.id === it.id)) list.push(it);
            });
          });
          return Array.from(map.entries()).map(([cat, prods]) => (
            <div key={cat}>
              <h2 className="mb-3 text-lg md:text-xl font-semibold text-gray-800">
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
            <div className="relative h-64 w-full">
              {(() => {
                const modalSrc = Array.isArray(selected.photos)
                  ? selected.photos.find(
                      (photo) => typeof photo === "string" && photo.trim()
                    )
                  : typeof selected.photo === "string" && selected.photo.trim()
                  ? selected.photo.trim()
                  : null;

                return modalSrc ? (
                  <Image
                    src={modalSrc}
                    alt={selected.name}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div
                    className="h-full w-full rounded-lg bg-gray-100"
                    aria-hidden="true"
                  />
                );
              })()}
            </div>
            <div>
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
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Sizing (Feet and inches): </span>
                  {(selected.size_feet || "N/A") +
                    (selected.size_inches ? ` / ${selected.size_inches}` : "")}
                </p>
                <p>
                  <span className="font-medium">Material 100% NATURAL MARBLE: </span>
                  {selected.material || "N/A"}
                </p>
                <p>
                  <span className="font-medium">CUSTOMISE OPTION: </span>
                  {selected.customization || "N/A"}
                </p>
                <p>
                  <span className="font-medium">FACILITY END TO END SERVICES: </span>
                  {selected.service || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
