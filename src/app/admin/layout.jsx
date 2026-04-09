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

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r md:min-h-screen">
        <div className="p-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex md:flex-col gap-2 px-4 mt-2 md:mt-6 overflow-x-auto">
          <Link
            href="/admin/products"
            className={`whitespace-nowrap p-3 rounded-md ${
              pathname === "/admin/products"
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Products
          </Link>
          <Link
            href="/admin/categories"
            className={`whitespace-nowrap p-3 rounded-md ${
              pathname === "/admin/categories"
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Categories
          </Link>
          <div className="flex-1 md:hidden" />
          <button
            onClick={handleLogout}
            className="whitespace-nowrap md:mt-10 p-3 text-left rounded-md text-red-600 hover:bg-red-50 font-medium"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
