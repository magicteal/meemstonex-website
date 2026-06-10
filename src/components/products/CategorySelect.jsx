"use client";
import { useEffect, useState } from "react";
import { addCategory, listCategories } from "../../services/api";

export default function CategorySelect({
  value = [],
  onChange,
  allowCreate = true,
}) {
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    listCategories().then((cats) => mounted && setOptions(cats));
    return () => {
      mounted = false;
    };
  }, []);

  const toggle = (cat) => {
    const next = value.includes(cat)
      ? value.filter((c) => c !== cat)
      : [...value, cat];
    onChange?.(next);
  };

  const create = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const newCat = await addCategory(input.trim());
      setOptions((opts) => (opts.includes(newCat) ? opts : [...opts, newCat]));
      onChange?.([...(value || []), newCat]);
      setInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all duration-300 ${
              value.includes(opt)
                ? "bg-blue-50 text-black border-blue-50 shadow-[0_0_15px_rgba(239,246,255,0.5)]"
                : "bg-blue-50/5 text-blue-50/70 border-white/10 hover:border-blue-50/30 hover:bg-blue-50/10"
            }`}
            aria-pressed={value.includes(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      {allowCreate && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new category"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="New category name"
          />
          <button
            type="button"
            onClick={create}
            disabled={loading}
            className="rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all px-4 py-2.5 text-xs font-black uppercase tracking-wider disabled:opacity-50 cursor-pointer"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
