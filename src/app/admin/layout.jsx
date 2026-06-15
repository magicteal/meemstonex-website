"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin") {
    // Top-level admin page is the login page. Don't show dashboard shell here.
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const menuItems = [
    { name: "Products", href: "/admin/products" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Blogs", href: "/admin/blogs" },
    { name: "Homepage CMS", href: "/admin/homepage" },
  ];

  return (
    <div className="dark flex min-h-screen bg-neutral-950 text-white flex-col md:flex-row font-general">
      <aside className="w-full md:w-64 bg-black/60 border-b md:border-b-0 md:border-r border-white/10 md:min-h-screen flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-black uppercase tracking-widest special-font text-blue-50">
            Ad<b>m</b>in Panel
          </h2>
        </div>
        <nav className="flex md:flex-col gap-2 p-4 overflow-x-auto custom-scrollbar md:overflow-visible flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap p-3 rounded-md text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-bold"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="flex-1 md:hidden" />
          <button
            onClick={handleLogout}
            className="whitespace-nowrap md:mt-auto p-3 text-left rounded-md font-bold text-xs uppercase tracking-wider transition-all text-red-400 hover:text-white hover:bg-red-600/20 border border-red-500/10 hover:border-red-500/30 cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 bg-neutral-950 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
