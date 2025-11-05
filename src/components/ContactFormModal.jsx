"use client";
import React, { useRef, useState } from "react";
import { useToast } from "./products/ToastProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";

const initial = { name: "", number: "", city: "", usage: [] };

export default function ContactFormModal({ open, onClose }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const { push } = useToast();
  const nameRef = useRef(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onToggleUsage = (value) => {
    setForm((f) => {
      const existing = Array.isArray(f.usage) ? f.usage : [];
      if (existing.includes(value)) {
        return { ...f, usage: existing.filter((v) => v !== value) };
      }
      return { ...f, usage: [...existing, value] };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.number ||
      !form.city ||
      !(form.usage && form.usage.length)
    ) {
      push({ type: "error", title: "Please fill all fields" });
      return;
    }
    setLoading(true);
    try {
      // Send usage as a comma-separated string for downstream integration
      const payload = {
        ...form,
        usage: Array.isArray(form.usage) ? form.usage.join(", ") : form.usage,
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit");
      push({ type: "success", title: "Form submitted" });
      setForm(initial);
      onClose?.();
    } catch (err) {
      push({
        type: "error",
        title: "Submission failed",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose?.();
      }}
    >
      <DialogContent
        showCloseButton
        onOpenAutoFocus={() => {
          // Ensure the Name field receives focus when the dialog opens
          try {
            nameRef.current?.focus();
          } catch {}
        }}
      >
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Fill in the form and we’ll get back to you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              ref={nameRef}
              type="text"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm text-gray-700"
              htmlFor="number"
            >
              Number
            </label>
            <input
              id="number"
              name="number"
              type="tel"
              value={form.number}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-700" htmlFor="city">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <span className="mb-2 block text-sm text-gray-700">Usage</span>

            <div className="space-y-2">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="usage"
                  value="interior"
                  checked={
                    Array.isArray(form.usage) && form.usage.includes("interior")
                  }
                  onChange={() => onToggleUsage("interior")}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-base font-medium text-gray-900">
                    For interior design projects
                  </div>
                  <div className="text-sm text-gray-600">
                    Homes, offices, and built-in fittings. Tell us about your
                    space and requirements.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="usage"
                  value="personal"
                  checked={
                    Array.isArray(form.usage) && form.usage.includes("personal")
                  }
                  onChange={() => onToggleUsage("personal")}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-base font-medium text-gray-900">
                    For personal use & small items
                  </div>
                  <div className="text-sm text-gray-600">
                    Gifts, small decorations, or single-piece orders. Let us
                    know the intended use.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <DialogFooter className="mt-2 flex justify-end gap-3">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
