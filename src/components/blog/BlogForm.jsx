"use client";
import { useEffect, useRef, useState } from "react";
import { mockUpload } from "../../services/api";

export default function BlogForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [image, setImage] = useState(initial?.image || "");
  const [body, setBody] = useState(initial?.body || "");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title || "");
    setImage(initial.image || "");
    setBody(initial.body || "");
  }, [initial?.title, initial?.image, initial?.body]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!image.trim()) errs.image = "Cover image is required";
    if (!body.trim()) errs.body = "Body is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFile = async (file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImage(preview);
    setUploading(true);
    try {
      const url = await mockUpload(file);
      if (url) setImage(url);
    } finally {
      setUploading(false);
      try {
        URL.revokeObjectURL(preview);
      } catch {}
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({
      title: title.trim(),
      image: image.trim(),
      body: body.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6 text-white">
      <div>
        <label
          htmlFor="blog-title"
          className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2"
        >
          Blog Title
        </label>
        <input
          ref={titleRef}
          id="blog-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. The Art of Marble Carving"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
          Cover Image
        </label>
        <div className="space-y-3 border border-white/5 p-3 rounded-2xl bg-neutral-900/50">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            disabled={uploading}
            className="text-xs text-neutral-400 w-full cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50/10 file:text-blue-200 hover:file:bg-blue-50/20 file:transition-all"
            aria-label="Upload cover image"
          />
          {image && (
            <div className="relative rounded-lg overflow-hidden aspect-video bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Cover preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                ×
              </button>
            </div>
          )}
          {uploading && (
            <p className="text-xs text-blue-400 animate-pulse">Uploading to S3...</p>
          )}
        </div>
        {errors.image && (
          <p className="mt-1 text-sm text-red-400">{errors.image}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="blog-body"
          className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2"
        >
          Blog Body
        </label>
        <textarea
          id="blog-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          placeholder="Write your blog post here. Separate paragraphs with a blank line."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-robert-regular leading-relaxed"
        />
        {errors.body && (
          <p className="mt-1 text-sm text-red-400">{errors.body}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs text-white uppercase tracking-wider font-bold hover:bg-white/10 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          aria-busy={uploading}
          className={
            "rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer " +
            (uploading
              ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-blue-600 hover:text-white")
          }
        >
          {uploading ? "Uploading…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
