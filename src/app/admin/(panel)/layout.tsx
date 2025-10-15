"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = React.useState<boolean | null>(
    null
  );

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/status", { cache: "no-store" });
        const data = await res.json();
        setAuthenticated(!!data?.authenticated);
      } catch {
        setAuthenticated(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.push("/admin/login");
    }
  };

  return (
    <div>
      {authenticated && (
        <header className="bg-neutral-900/50">
          <div className="container mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Meemstonex Admin</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
      )}
      <main>{children}</main>
    </div>
  );
}
