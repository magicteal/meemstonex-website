"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../../../components/products/Modal";
import BlogForm from "../../../components/blog/BlogForm";
import {
  listBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../../services/api";
import { useToast } from "../../../components/products/ToastProvider";
import Image from "next/image";

export default function BlogsEditorPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { push, remove } = useToast();

  const PAGE_SIZE = 100;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const load = async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listBlogs({ page: targetPage, pageSize: PAGE_SIZE });
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

  const onCreate = async (payload) => {
    const toastId = push({ title: "Creating…", description: "Please wait", duration: 0 });
    try {
      await createBlog(payload);
      await load(1);
      push({ title: "Blog post created", type: "success" });
      setOpenCreate(false);
    } catch (e) {
      push({ title: "Failed to create", description: e.message, type: "error" });
    } finally {
      remove(toastId);
    }
  };

  const onUpdate = async (id, patch) => {
    const toastId = push({ title: "Saving…", duration: 0 });
    try {
      const updated = await updateBlog(id, patch);
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
      await deleteBlog(id);
    } catch (e) {
      push({ title: "Delete failed", description: e.message, type: "error" });
      return;
    }
    const targetPage = items.length === 1 && page > 1 ? page - 1 : page;
    await load(targetPage);
    push({
      title: "Blog post deleted",
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
            Bl<b>o</b>g Editor
          </h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-general">
            Manage blog posts shown on the public blog page
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setOpenCreate(true)}
            className="rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-300 px-5 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            New Blog Post
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
              <th className="px-5 py-4">Image</th>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {items.map((b, index) => (
                <motion.tr
                  key={b.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors align-middle"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <td className="px-5 py-4 font-mono text-neutral-500">
                    {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-white/10 bg-black">
                      <Image
                        src={b.image || ""}
                        alt={b.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-white uppercase tracking-wide text-sm">
                    {b.title}
                  </td>
                  <td className="px-5 py-4 text-neutral-400 font-mono">{b.slug}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => setEditItem(b)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase hover:bg-white/10 text-white cursor-pointer transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(b)}
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
          <p className="p-8 text-sm text-neutral-500 uppercase tracking-widest text-center font-robert-regular">No blog posts yet.</p>
        )}
      </div>

      {!loading && total > 0 && (
        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap text-xs">
          <p className="text-neutral-500 uppercase tracking-wider font-bold">
            Page {page} of {totalPages} &middot; {total} posts
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

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="New Blog Post">
        <BlogForm onSubmit={onCreate} onCancel={() => setOpenCreate(false)} submitLabel="Publish" />
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={`Edit: ${editItem?.title ?? ""}`}>
        {editItem && (
          <BlogForm
            initial={editItem}
            onSubmit={(payload) => onUpdate(editItem.id, payload)}
            onCancel={() => setEditItem(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirm Deletion">
        {confirmDelete && (
          <div className="text-white space-y-6">
            <p className="text-sm text-neutral-300 leading-relaxed font-robert-regular">
              Are you sure you want to permanently delete <b>{confirmDelete.title}</b>? This action is irreversible.
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
