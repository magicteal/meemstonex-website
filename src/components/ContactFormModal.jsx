"use client";
import React, { useRef, useState } from "react";
import Modal from "./products/Modal";
import { useToast } from "./products/ToastProvider";

const initial = { name: "", number: "", city: "", usage: "interior" };

export default function ContactFormModal({ open, onClose }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const { push } = useToast();
  const nameRef = useRef(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.number || !form.city || !form.usage) {
      push({ type: "error", title: "Please fill all fields" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <Modal
      open={open}
      onClose={onClose}
      title="Contact Us"
      initialFocusRef={nameRef}
    >
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
          <label className="mb-1 block text-sm text-gray-700" htmlFor="number">
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
          <label className="mb-1 block text-sm text-gray-700" htmlFor="usage">
            Usage
          </label>
          <select
            id="usage"
            name="usage"
            value={form.usage}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="interior">For Interior</option>
            <option value="personal">Personal Use</option>
          </select>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
