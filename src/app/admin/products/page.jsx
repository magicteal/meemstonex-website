"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../../../components/products/Modal";
import ProductForm from "../../../components/products/ProductForm";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  resetAllCategories,
} from "../../../services/api";
import { useToast } from "../../../components/products/ToastProvider";
import Image from "next/image";

export default function ProductsEditorPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { push, remove } = useToast();
  const newBtnRef = useRef(null);
  const [resettingCats, setResettingCats] = useState(false);

  const PAGE_SIZE = 100;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const load = async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listProducts({
        page: targetPage,
        pageSize: PAGE_SIZE,
        sort: "name:asc",
      });
      setItems(res.items);
      setTotal(res.total ?? 0);
      setPage(targetPage);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const key = typeof e?.key === "string" ? e.key.toLowerCase() : "";
      if (key === "n" && !(e.ctrlKey || e.metaKey || e.altKey))
        setOpenCreate(true);
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
      await createProduct(payload);
      await load(page);
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
    try {
      await deleteProduct(id);
    } catch (e) {
      push({ title: "Delete failed", description: e.message, type: "error" });
      return;
    }

    const targetPage = items.length === 1 && page > 1 ? page - 1 : page;
    await load(targetPage);
    push({
      title: "Product deleted",
      description: "Item has been successfully removed",
      type: "success",
      duration: 3000,
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-white font-general">
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest special-font text-blue-50">
            Pr<b>o</b>ducts Editor
          </h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-general">
            Manage your premium stone and marble inventory list
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            ref={newBtnRef}
            onClick={() => setOpenCreate(true)}
            className="rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-300 px-5 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            New Product
          </button>
          <button
            onClick={async () => {
              const idToast = push({
                title: "Syncing categories…",
                duration: 0,
              });
              try {
                const res = await fetch("/api/admin/sync-categories", {
                  method: "POST",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Sync failed");
                push({
                  title: "Categories synced",
                  description: `${data.upserted ?? 0} added / ${
                    data.total ?? 0
                  } total`,
                  type: "success",
                });
              } catch (e) {
                push({
                  title: "Sync failed",
                  description: e.message,
                  type: "error",
                });
              } finally {
                remove(idToast);
              }
            }}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
            title="Upsert the canonical category list into the database"
          >
            Sync Categories
          </button>
          <button
            disabled={resettingCats}
            onClick={async () => {
              if (
                !confirm(
                  "This will delete ALL categories and clear them from all products. Continue?"
                )
              )
                return;
              setResettingCats(true);
              const toastId = push({
                title: "Resetting categories…",
                duration: 0,
              });
              try {
                const res = await resetAllCategories();
                push({
                  title: "Categories reset",
                  description: `${
                    res.deletedCategories ?? 0
                  } categories removed, ${
                    res.productsUpdated ?? 0
                  } products updated`,
                  type: "success",
                });
                await load();
              } catch (e) {
                push({
                  title: "Reset failed",
                  description: e.message,
                  type: "error",
                });
              } finally {
                remove(toastId);
                setResettingCats(false);
              }
            }}
            className="rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
            title="Delete all categories and clear them from products"
          >
            Reset Categories
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-xs font-robert-regular">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-white/5 text-neutral-400 border-b border-white/10 uppercase font-black tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-4 w-20">Sr. No.</th>
              <th className="px-5 py-4">Photo</th>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Categories</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {items.map((p, index) => (
                <motion.tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors align-middle"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <td className="px-5 py-4 font-mono text-neutral-500">{String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}</td>
                  <td className="px-5 py-4">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-white/10 bg-black">
                      <Image
                        src={(Array.isArray(p.photos) && p.photos.length) ? p.photos[0] : (p.photo || "")}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-white uppercase tracking-wide text-sm">
                    {p.name}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {p.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] uppercase font-bold text-neutral-400 tracking-wider"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => setEditItem(p)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase hover:bg-white/10 text-white cursor-pointer transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-bold uppercase hover:bg-red-500/20 text-red-400 cursor-pointer transition-all"
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
        {loading && <p className="p-5 text-sm text-neutral-400 uppercase tracking-widest text-center animate-pulse">Loading items…</p>}
        {!loading && items.length === 0 && (
          <p className="p-8 text-sm text-neutral-500 uppercase tracking-widest text-center font-robert-regular">No products in inventory.</p>
        )}
      </div>

      {!loading && total > 0 && (
        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap text-xs">
          <p className="text-neutral-500 uppercase tracking-wider font-bold">
            Page {page} of {totalPages} &middot; {total} products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(page - 1)}
              disabled={page <= 1}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase hover:bg-white/10 text-white cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => load(page + 1)}
              disabled={page >= totalPages}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase hover:bg-white/10 text-white cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create New Creation"
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
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirm Deletion"
      >
        {confirmDelete && (
          <div className="text-white space-y-6">
            <p className="text-sm text-neutral-300 leading-relaxed font-robert-regular">
              Are you sure you want to permanently delete <b>{confirmDelete.name}</b> from the database? This action is irreversible.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs text-white uppercase tracking-wider font-bold hover:bg-white/10 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
