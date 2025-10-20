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
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`rounded-full px-3 py-1 text-sm border ${
              value.includes(opt)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            } hover:opacity-90`}
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
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="New category name"
          />
          <button
            type="button"
            onClick={create}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
