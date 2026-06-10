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
    <main className="relative flex min-h-screen w-screen flex-col items-center justify-center bg-black text-blue-50 p-4 font-general overflow-x-hidden">
      {/* Background soft glow decoration */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-blue-500/10 to-transparent" />
      
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col">
        <div className="text-center mb-8">
          <h1 className="special-font text-5xl font-black text-blue-50 leading-[0.8] tracking-widest uppercase mb-3">
            Ad<b>m</b>in
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-general text-blue-200/40">
            Timeless Marble Portal
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. admin@meemstonex"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
              Password Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-xs font-robert-regular">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 text-[10px] rounded-full font-black uppercase tracking-[0.3em] bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing In…" : "Access Portal"}
          </button>
        </form>
      </div>
    </main>
  );
}
