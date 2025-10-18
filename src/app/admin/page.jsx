"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        // simple client-side routing to admin products editor
        router.push("/admin/products");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Admin login</h1>
      <p className="mt-2 text-sm text-gray-600">
        Sign in with the admin account to manage products.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
      <p className="mt-4 text-xs text-gray-500">
        Admin email and password are set in your `.env.local` (ADMIN_EMAIL /
        ADMIN_PASSWORD)
      </p>
    </main>
  );
}
