"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { getBlogBySlug } from "../../../services/api";

const Navbar = dynamic(() => import("../../../components/Navbar"), {
  ssr: false,
  loading: () => <div className="h-16" />,
});
const Footer = dynamic(() => import("../../../components/Footer"), {
  ssr: false,
  loading: () => <div className="h-24 bg-black" />,
});

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBlogBySlug(slug);
        if (!active) return;
        if (res?.error) setError(res.error);
        else setPost(res);
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <main className="relative min-h-screen bg-black text-blue-50 w-screen overflow-x-hidden">
      <Navbar />

      {loading && (
        <div className="flex-center w-full py-40 pt-48">
          <div className="three-body scale-75">
            <div className="three-body__dot bg-blue-50"></div>
            <div className="three-body__dot bg-blue-50"></div>
            <div className="three-body__dot bg-blue-50"></div>
          </div>
        </div>
      )}

      {!loading && (error || !post) && (
        <div className="pt-40 pb-20 px-4 text-center">
          <p className="text-blue-50/50 uppercase tracking-[0.3em] font-general mb-6">
            Post not found
          </p>
          <Link
            href="/blog"
            className="inline-block text-[10px] uppercase tracking-[0.3em] text-blue-200/60 hover:text-blue-50 font-general transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      )}

      {!loading && post && !error && (
        <>
          {/* Cinematic Header Block */}
          <div className="relative pt-32 pb-16 md:pt-48 md:pb-20 px-4 w-full flex flex-col items-center justify-center border-b border-white/10">
            <Link
              href="/blog"
              className="font-general text-[10px] uppercase tracking-widest text-blue-200/50 mb-6 hover:text-blue-50 transition-colors"
            >
              ← Back to Blog
            </Link>
            <h1 className="special-font text-4xl sm:text-6xl md:text-7xl font-black text-center text-blue-50 leading-tight tracking-widest uppercase max-w-5xl">
              {post.title}
            </h1>
          </div>

          <article className="mx-auto max-w-3xl px-4 py-16">
            {post.image && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 mb-12">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              </div>
            )}

            <div className="space-y-6 text-blue-50/80 font-robert-regular text-base md:text-lg leading-relaxed">
              {String(post.body || "")
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
            </div>
          </article>
        </>
      )}

      <Footer />
    </main>
  );
}
