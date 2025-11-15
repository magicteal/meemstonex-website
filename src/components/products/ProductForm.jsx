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
  const [price, setPrice] = useState(
    initial?.price != null ? String(initial.price) : ""
  );
  const [photos, setPhotos] = useState(() => {
    if (Array.isArray(initial?.photos) && initial.photos.length) {
      const p = [...initial.photos];
      while (p.length < 3) p.push("");
      return p.slice(0, 3);
    }
    if (initial?.photo) {
      return [initial.photo, "", ""];
    }
    return ["", "", ""];
  });
  const [description, setDescription] = useState(initial?.description || "");
  const [featured, setFeatured] = useState(!!initial?.featured);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState([false, false, false]);
  const nameRef = useRef(null);

  useEffect(() => {
    if (!initial) return; // only sync when editing
    setName(initial.name || "");
    setCategories(initial.categories || []);
    setPrice(initial.price != null ? String(initial.price) : "");
    
    const newPhotos = ["", "", ""];
    if (Array.isArray(initial.photos) && initial.photos.length) {
      initial.photos.slice(0, 3).forEach((p, i) => {
        newPhotos[i] = p || "";
      });
    } else if (initial.photo) {
      newPhotos[0] = initial.photo;
    }
    setPhotos(newPhotos);
    
    setDescription(initial.description || "");
    setFeatured(!!initial.featured);
  }, [
    initial?.name,
    initial?.photo,
    JSON.stringify(initial?.photos || []),
    initial?.description,
    initial?.price,
    JSON.stringify(initial?.categories || []),
    initial?.featured,
  ]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    const p = parseFloat(price);
    if (Number.isNaN(p) || p < 0) errs.price = "Enter a valid price";
    const hasPhoto = photos.some(p => p && p.trim());
    if (!hasPhoto) errs.photos = "At least one photo is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFile = async (index, file) => {
    // show an immediate local preview for perceived performance
    const preview = URL.createObjectURL(file);
    setPhotos(prev => {
      const next = [...prev];
      next[index] = preview;
      return next;
    });
    
    setUploading(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    
    try {
      const url = await mockUpload(file);
      // replace preview with final uploaded URL
      if (url) {
        setPhotos(prev => {
          const next = [...prev];
          next[index] = url;
          return next;
        });
      }
    } finally {
      setUploading(prev => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
      // revoke the object URL when upload finishes
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
      price: parseFloat(price),
      photos: photos.filter(p => p && p.trim()),
      description: description.trim(),
      currency: "INR",
      featured,
    };
    onSubmit?.(payload);
  };

  const anyUploading = uploading.some(Boolean);

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          ref={nameRef}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Categories
        </label>
        <div className="mt-1">
          <CategorySelect value={categories} onChange={setCategories} />
        </div>
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-invalid={!!errors.price}
          aria-describedby={errors.price ? "price-error" : undefined}
        />
        {errors.price && (
          <p id="price-error" className="mt-1 text-sm text-red-600">
            {errors.price}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos (up to 3)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(index, e)}
                  disabled={uploading[index]}
                  className="text-xs w-full"
                  aria-label={`Upload photo ${index + 1}`}
                />
              </div>
              {photos[index] && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[index]}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotos(prev => {
                        const next = [...prev];
                        next[index] = "";
                        return next;
                      });
                    }}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              {uploading[index] && (
                <p className="text-xs text-gray-500">Uploading...</p>
              )}
            </div>
          ))}
        </div>
        {errors.photos && (
          <p className="mt-1 text-sm text-red-600">{errors.photos}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
        />
        <label htmlFor="featured" className="text-sm text-gray-800">
          Featured (show on homepage)
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={anyUploading}
          aria-busy={anyUploading}
          className={
            "rounded-lg px-3 py-2 text-sm font-medium text-white " +
            (anyUploading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700")
          }
        >
          {anyUploading ? "Uploading…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
