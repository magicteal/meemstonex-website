"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../../../components/products/Modal";
import ProductForm from "../../../components/products/ProductForm";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../../../services/mockApi";
import { useToast } from "../../../components/products/ToastProvider";

export default function ProductsEditorPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { push, remove } = useToast();
  const newBtnRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listProducts({
        page: 1,
        pageSize: 100,
        sort: "name:asc",
      });
      setItems(res.items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // keyboard shortcut: n to open new modal
  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === "n") setOpenCreate(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const onCreate = async (payload) => {
    const toastId = push({
      title: "Creating…",
      description: "Please wait",
      duration: 0,
    });
    try {
      const created = await createProduct(payload);
      setItems((prev) => [created, ...prev]);
      push({ title: "Product created", type: "success" });
      setOpenCreate(false);
    } catch (e) {
      push({
        title: "Failed to create",
        description: e.message,
        type: "error",
      });
    } finally {
      remove(toastId);
    }
  };

  const onUpdate = async (id, patch) => {
    const toastId = push({ title: "Saving…", duration: 0 });
    try {
      const updated = await updateProduct(id, patch);
      setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
      push({ title: "Changes saved", type: "success" });
      setEditItem(null);
    } catch (e) {
      push({ title: "Failed to save", description: e.message, type: "error" });
    } finally {
      remove(toastId);
    }
  };

  const onDelete = async (id) => {
    let deleted;
    try {
      deleted = await deleteProduct(id);
    } catch (e) {
      // handle error gracefully and show toast
      push({ title: "Delete failed", description: e.message, type: "error" });
      return;
    }

    setItems((prev) => prev.filter((p) => p.id !== id));
    let undo = true;
    const idToast = push({
      title: "Product deleted",
      description: "Undo within 5 seconds",
      type: "success",
      duration: 5000,
      action: (
        <div className="mt-2">
          <button
            className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
            onClick={async () => {
              undo = false;
              // re-create deleted item
              const { id: _id, ...rest } = deleted;
              const restored = await createProduct(rest);
              setItems((prev) => [restored, ...prev]);
            }}
          >
            Undo
          </button>
        </div>
      ),
    });
    // after 5s, if not undone do nothing (already deleted)
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products Editor</h1>
        <button
          ref={newBtnRef}
          onClick={() => setOpenCreate(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          New Product (n)
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2">Photo</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Categories</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {items.map((p) => (
                <motion.tr
                  key={p.id}
                  className="border-t"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <td className="px-3 py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.photo}
                      alt=""
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {p.name}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {p.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">${p.price.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => setEditItem(p)}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {loading && <p className="p-3 text-sm text-gray-600">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="p-3 text-sm text-gray-600">No products.</p>
        )}
      </div>

      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create Product"
      >
        <ProductForm
          onSubmit={onCreate}
          onCancel={() => setOpenCreate(false)}
          submitLabel="Create"
        />
      </Modal>

      <Modal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        title={`Edit: ${editItem?.name ?? ""}`}
      >
        {editItem && (
          <ProductForm
            initial={editItem}
            onSubmit={(payload) => onUpdate(editItem.id, payload)}
            onCancel={() => setEditItem(null)}
            submitLabel="Save"
          />
        )}
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirm Delete"
      >
        {confirmDelete && (
          <div>
            <p className="text-sm text-gray-700">
              Are you sure you want to delete <b>{confirmDelete.name}</b>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Tests (pseudo) */}
      {/*
      describe('Products editor', () => {
        it('creates a product', async () => {
          // open modal, fill form, submit, expect new row appears
        });
        it('validates edit form', async () => {
          // open edit, clear name, expect error message and disabled submit
        });
        it('delete + undo', async () => {
          // delete row, toast shows, click Undo, row reappears
        });
      });
      */}
    </main>
  );
}
