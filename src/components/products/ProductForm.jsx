"use client";
import { useEffect, useRef, useState } from "react";
import { mockUpload } from "../../services/mockApi";
import CategorySelect from "./CategorySelect";

export default function ProductForm({
  initial = {},
  onSubmit,
  onCancel,
  submitLabel = "Save",
}) {
  const [name, setName] = useState(initial.name || "");
  const [categories, setCategories] = useState(initial.categories || []);
  const [price, setPrice] = useState(initial.price?.toString() || "");
  const [photo, setPhoto] = useState(initial.photo || "");
  const [description, setDescription] = useState(initial.description || "");
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    setName(initial.name || "");
    setCategories(initial.categories || []);
    setPrice(initial.price != null ? String(initial.price) : "");
    setPhoto(initial.photo || "");
    setDescription(initial.description || "");
  }, [initial]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    const p = parseFloat(price);
    if (Number.isNaN(p) || p < 0) errs.price = "Enter a valid price";
    if (!photo) errs.photo = "Photo is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFile = async (file) => {
    setUploading(true);
    try {
      const url = await mockUpload(file);
      setPhoto(url);
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const onUrlUpload = async () => {
    if (!photo) return;
    setUploading(true);
    try {
      const url = await mockUpload(photo);
      setPhoto(url);
    } finally {
      setUploading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: name.trim(),
      categories,
      price: parseFloat(price),
      photo,
      description: description.trim(),
    };
    onSubmit?.(payload);
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
        <label className="block text-sm font-medium text-gray-700">Photo</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            aria-label="Upload photo"
          />
          <input
            type="url"
            placeholder="Or paste image URL"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="button"
            onClick={onUrlUpload}
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Use URL
          </button>
        </div>
        {errors.photo && (
          <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
        )}
        {photo && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt="Preview"
              className="h-32 w-32 rounded-md object-cover"
            />
          </div>
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
          rows={4}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
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
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
