"use client";
import { useEffect, useRef, useState } from "react";
import { mockUpload } from "../../services/api";
import CategorySelect from "./CategorySelect";

export default function ProductForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}) {
  const [name, setName] = useState(initial?.name || "");
  const [categories, setCategories] = useState(initial?.categories || []);
  const [sizeFeet, setSizeFeet] = useState(initial?.size_feet || "");
  const [sizeInches, setSizeInches] = useState(initial?.size_inches || "");
  const [material, setMaterial] = useState(initial?.material || "");
  const [customization, setCustomization] = useState(
    initial?.customization || ""
  );
  const [service, setService] = useState(initial?.service || "");
  const [photos, setPhotos] = useState(() => {
    if (Array.isArray(initial?.photos) && initial.photos.length) {
      return initial.photos.filter((p) => typeof p === "string");
    }
    if (initial?.photo) {
      return [initial.photo];
    }
    return [""];
  });
  const [description, setDescription] = useState(initial?.description || "");
  const [featured, setFeatured] = useState(!!initial?.featured);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(() =>
    new Array(Math.max(photos.length, 1)).fill(false)
  );
  const nameRef = useRef(null);

  useEffect(() => {
    if (!initial) return; // only sync when editing
    setName(initial.name || "");
    setCategories(initial.categories || []);
    setSizeFeet(initial.size_feet || "");
    setSizeInches(initial.size_inches || "");
    setMaterial(initial.material || "");
    setCustomization(initial.customization || "");
    setService(initial.service || "");
    
    const newPhotos = [];
    if (Array.isArray(initial.photos) && initial.photos.length) {
      initial.photos.forEach((p) => {
        newPhotos.push(p || "");
      });
    } else if (initial.photo) {
      newPhotos.push(initial.photo);
    }
    if (!newPhotos.length) newPhotos.push("");
    setPhotos(newPhotos);
    setUploading(new Array(newPhotos.length).fill(false));
    
    setDescription(initial.description || "");
    setFeatured(!!initial.featured);
  }, [
    initial?.name,
    initial?.photo,
    JSON.stringify(initial?.photos || []),
    initial?.description,
    initial?.size_feet,
    initial?.size_inches,
    initial?.material,
    initial?.customization,
    initial?.service,
    JSON.stringify(initial?.categories || []),
    initial?.featured,
  ]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    const hasPhoto = photos.some(p => p && p.trim());
    if (!hasPhoto) errs.photos = "At least one photo is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFile = async (index, file) => {
    const preview = URL.createObjectURL(file);
    setPhotos(prev => {
      const next = [...prev];
      next[index] = preview;
      return next;
    });
    
    setUploading((prev) => {
      const next = [...prev];
      while (next.length <= index) next.push(false);
      next[index] = true;
      return next;
    });
    
    try {
      const url = await mockUpload(file);
      if (url) {
        setPhotos(prev => {
          const next = [...prev];
          next[index] = url;
          return next;
        });
      }
    } finally {
      setUploading((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
      try {
        URL.revokeObjectURL(preview);
      } catch (e) {}
    }
  };

  const onFileChange = async (index, e) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(index, file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: name.trim(),
      categories,
      size_feet: sizeFeet.trim(),
      size_inches: sizeInches.trim(),
      material: material.trim(),
      customization: customization.trim(),
      service: service.trim(),
      photos: photos.filter(p => p && p.trim()),
      description: description.trim(),
      currency: "INR",
      featured,
    };
    onSubmit?.(payload);
  };

  const anyUploading = uploading.some(Boolean);

  const addPhotoSlot = () => {
    setPhotos((prev) => [...prev, ""]);
    setUploading((prev) => [...prev, false]);
  };

  const removePhotoAt = (index) => {
    setPhotos((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [""];
    });
    setUploading((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [false];
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6 text-white">
      <div>
        <label
          htmlFor="name"
          className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2"
        >
          Product Name
        </label>
        <input
          ref={nameRef}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
          Categories Tagging
        </label>
        <div className="mt-1">
          <CategorySelect value={categories} onChange={setCategories} />
        </div>
      </div>

      <div>
        <label
          htmlFor="size-feet"
          className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2"
        >
          Sizing (Feet / Inches)
        </label>
        <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            id="size-feet"
            type="text"
            value={sizeFeet}
            onChange={(e) => setSizeFeet(e.target.value)}
            placeholder="Feet (e.g. 5)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <input
            id="size-inches"
            type="text"
            value={sizeInches}
            onChange={(e) => setSizeInches(e.target.value)}
            placeholder="Inches (e.g. 8)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="material"
          className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2"
        >
          Material Structure (e.g. 100% Natural Marble)
        </label>
        <input
          id="material"
          type="text"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      <div>
        <label
          htmlFor="customization"
          className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2"
        >
          Customisation Capability (e.g. Available)
        </label>
        <input
          id="customization"
          type="text"
          value={customization}
          onChange={(e) => setCustomization(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      <div>
        <label
          htmlFor="service"
          className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2"
        >
          End-to-End Services (e.g. Facility Delivery & Installation)
        </label>
        <input
          id="service"
          type="text"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
          Product Images
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="space-y-2 border border-white/5 p-3 rounded-2xl bg-neutral-900/50">
              <span className="text-[10px] font-bold text-neutral-500 block">Slot {index + 1}</span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(index, e)}
                  disabled={!!uploading[index]}
                  className="text-xs text-neutral-400 w-full cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50/10 file:text-blue-200 hover:file:bg-blue-50/20 file:transition-all"
                  aria-label={`Upload photo ${index + 1}`}
                />
              </div>
              {photo && (
                <div className="relative rounded-lg overflow-hidden aspect-video bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhotoAt(index)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}
              {!!uploading[index] && (
                <p className="text-xs text-blue-400 animate-pulse">Uploading to S3...</p>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPhotoSlot}
          className="mt-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs text-white transition-all uppercase tracking-wider font-bold cursor-pointer"
        >
          + Add another image
        </button>
        {errors.photos && (
          <p className="mt-1 text-sm text-red-400">{errors.photos}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2"
        >
          Product Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-4">
        <input
          id="featured"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="featured" className="text-xs font-bold uppercase tracking-wider text-neutral-300 cursor-pointer">
          Featured (Showcase in home flow ring)
        </label>
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
          disabled={anyUploading}
          aria-busy={anyUploading}
          className={
            "rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer " +
            (anyUploading
              ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-blue-600 hover:text-white")
          }
        >
          {anyUploading ? "Uploading…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
