"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { listBlogs } from "../../services/api";

const Navbar = dynamic(() => import("../../components/Navbar"), {
  ssr: false,
  loading: () => <div className="h-16" />,
});
const Footer = dynamic(() => import("../../components/Footer"), {
  ssr: false,
  loading: () => <div className="h-24 bg-black" />,
});

function excerpt(text, length = 160) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  return clean.slice(0, length).trim() + "…";
}

export default function BlogPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listBlogs({ page: 1, pageSize: 100 });
        if (active) setItems(res.items || []);
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-blue-50 w-screen overflow-x-hidden">
      <Navbar />

      {/* Cinematic Header Block */}
      <div className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-4 w-full flex flex-col items-center justify-center border-b border-white/10">
        <p className="font-general text-[10px] uppercase tracking-widest text-blue-200/50 mb-6">
          Stories &amp; Insights
        </p>
        <h1 className="special-font text-6xl sm:text-8xl md:text-[10rem] font-black text-center text-blue-50 leading-[0.8] tracking-widest uppercase">
          Bl<b>o</b>g
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20">
        {error && (
          <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-5 text-red-200 text-center font-robert-regular">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex-center w-full py-20">
            <div className="three-body scale-75">
              <div className="three-body__dot bg-blue-50"></div>
              <div className="three-body__dot bg-blue-50"></div>
              <div className="three-body__dot bg-blue-50"></div>
            </div>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-center text-blue-50/40 uppercase tracking-[0.3em] font-general py-20">
            No posts yet. Check back soon.
          </p>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block border border-white/10 rounded-lg overflow-hidden bg-white/[0.02] hover:border-white/30 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-900" aria-hidden="true" />
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-blue-50 leading-tight group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm text-blue-50/50 font-robert-regular leading-relaxed">
                    {excerpt(post.body)}
                  </p>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-blue-200/40 font-general">
                    Read More →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
