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
    // show an immediate local preview for perceived performance
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
      // replace preview with final uploaded URL
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
          htmlFor="size-feet"
          className="block text-sm font-medium text-gray-700"
        >
          Sizing (Feet and inches)
        </label>
        <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            id="size-feet"
            type="text"
            value={sizeFeet}
            onChange={(e) => setSizeFeet(e.target.value)}
            placeholder="Feet"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            id="size-inches"
            type="text"
            value={sizeInches}
            onChange={(e) => setSizeInches(e.target.value)}
            placeholder="Inches"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="material"
          className="block text-sm font-medium text-gray-700"
        >
          Material 100% NATURAL MARBLE
        </label>
        <input
          id="material"
          type="text"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div>
        <label
          htmlFor="customization"
          className="block text-sm font-medium text-gray-700"
        >
          CUSTOMISE OPTION
        </label>
        <input
          id="customization"
          type="text"
          value={customization}
          onChange={(e) => setCustomization(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div>
        <label
          htmlFor="service"
          className="block text-sm font-medium text-gray-700"
        >
          FACILITY END TO END SERVICES
        </label>
        <input
          id="service"
          type="text"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(index, e)}
                  disabled={!!uploading[index]}
                  className="text-xs w-full"
                  aria-label={`Upload photo ${index + 1}`}
                />
              </div>
              {photo && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhotoAt(index)}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              {!!uploading[index] && (
                <p className="text-xs text-gray-500">Uploading...</p>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPhotoSlot}
          className="mt-2 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          + Add another image
        </button>
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
