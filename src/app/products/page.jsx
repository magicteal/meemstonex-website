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
const Footer = dynamic(() => import("../../components/Footer"), {
  ssr: false,
  loading: () => <div className="h-24 bg-black" />,
});

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
    <main className="relative min-h-screen bg-black text-blue-50 w-screen overflow-x-hidden">
      <Navbar />
      
      {/* Cinematic Header Block */}
      <div className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-4 w-full flex flex-col items-center justify-center border-b border-white/10">
        <p className="font-general text-[10px] uppercase tracking-widest text-blue-200/50 mb-6">
          Complete Inventory
        </p>
        <h1 className="special-font text-6xl sm:text-8xl md:text-[10rem] font-black text-center text-blue-50 leading-[0.8] tracking-widest uppercase">
          Pr<b>o</b>ducts
        </h1>

        <div className="mt-16 w-full max-w-4xl px-4">
           <p className="mb-6 text-[10px] font-general uppercase tracking-[0.3em] text-blue-200/40 text-center">
             Filter by Category
           </p>
           <div className="w-full">
             <CategorySelect
               value={categoryFilter}
               onChange={setCategoryFilter}
               allowCreate={false}
             />
           </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20">
        {error && (
          <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-5 text-red-200 text-center font-robert-regular">
            {error}
          </div>
        )}

        <section className="space-y-32">
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
              <div key={cat} className="dark">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
                   <h2 className="text-4xl md:text-6xl font-black text-blue-50 uppercase tracking-widest special-font">
                     {cat}
                   </h2>
                   <p className="text-blue-50/40 text-[10px] uppercase tracking-[0.2em] font-general">
                     {prods.length} Creations Found
                   </p>
                </div>
                <ExpandableGrid items={prods} />
              </div>
            ));
          })()}
        </section>

        <div ref={sentinelRef} className="h-10" />
        {loading && (
          <div className="flex-center w-full py-10">
            <div className="three-body scale-75">
              <div className="three-body__dot bg-blue-50"></div>
              <div className="three-body__dot bg-blue-50"></div>
              <div className="three-body__dot bg-blue-50"></div>
            </div>
          </div>
        )}
        {!hasMore && !loading && items.length > 0 && (
          <p className="mt-16 pb-10 text-center text-xs text-blue-50/40 uppercase tracking-[0.3em] font-general border-t border-white/5 pt-16">End of catalog</p>
        )}
      </div>

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
      <Footer />
    </main>
  );
}
