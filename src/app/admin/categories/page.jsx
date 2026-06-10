"use client";
import { useEffect, useState } from "react";
import {
  listCategories,
  addCategory,
  renameCategory,
  deleteCategory,
} from "../../../services/api";
import { useToast } from "../../../components/products/ToastProvider";
import Modal from "../../../components/products/Modal";

export default function CategoriesEditorPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [openCreate, setOpenCreate] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { push, remove } = useToast();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await listCategories();
      setCategories(cats || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const toastId = push({ title: "Creating…", duration: 0 });
    try {
      await addCategory(newCatName.trim());
      await load();
      setOpenCreate(false);
      setNewCatName("");
      push({ title: "Category created", type: "success" });
    } catch (err) {
      push({ title: "Failed to create", description: err.message, type: "error" });
    } finally {
      remove(toastId);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    if (editName.trim() === editItem) {
      setEditItem(null);
      return;
    }
    const toastId = push({ title: "Updating…", duration: 0 });
    try {
      await renameCategory(editItem, editName.trim());
      await load();
      setEditItem(null);
      push({ title: "Category renamed", type: "success" });
    } catch (err) {
      push({ title: "Failed to rename", description: err.message, type: "error" });
    } finally {
      remove(toastId);
    }
  };

  const handleDelete = async (name) => {
    const toastId = push({ title: "Deleting…", duration: 0 });
    try {
      await deleteCategory(name);
      await load();
      setConfirmDelete(null);
      push({ title: "Category deleted", type: "success" });
    } catch (err) {
      push({ title: "Failed to delete", description: err.message, type: "error" });
    } finally {
      remove(toastId);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-white font-general">
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest special-font text-blue-50">
            Cat<b>e</b>gories Editor
          </h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-general">
            Add, edit, or remove categories dynamically
          </p>
        </div>
        <button
          onClick={() => {
            setNewCatName("");
            setOpenCreate(true);
          }}
          className="rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-300 px-5 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer"
        >
          New Category
        </button>
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
              <th className="px-5 py-4">Category Name</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, index) => (
              <tr key={c} className="border-b border-white/5 hover:bg-white/5 transition-colors align-middle">
                <td className="px-5 py-4 font-mono text-neutral-500">{String(index + 1).padStart(2, "0")}</td>
                <td className="px-5 py-4 font-bold text-white uppercase tracking-wide text-sm">{c}</td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => {
                        setEditItem(c);
                        setEditName(c);
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase hover:bg-white/10 text-white cursor-pointer transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(c)}
                      className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-bold uppercase hover:bg-red-500/20 text-red-400 cursor-pointer transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-5 text-sm text-neutral-400 uppercase tracking-widest text-center animate-pulse">Loading categories…</p>}
        {!loading && categories.length === 0 && (
          <p className="p-8 text-sm text-neutral-500 uppercase tracking-widest text-center font-robert-regular">No categories found.</p>
        )}
      </div>

      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create Category"
      >
        <form onSubmit={handleCreate} className="space-y-6 text-white">
          <div>
            <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">Category Name</label>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setOpenCreate(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs text-white uppercase tracking-wider font-bold hover:bg-white/10 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all px-5 py-3 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        title="Rename Category"
      >
        <form onSubmit={handleEdit} className="space-y-6 text-white">
          <div>
            <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">New Category Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditItem(null)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs text-white uppercase tracking-wider font-bold hover:bg-white/10 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all px-5 py-3 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirm Deletion"
      >
        {confirmDelete && (
          <div className="text-white space-y-6">
            <p className="text-sm text-neutral-300 leading-relaxed font-robert-regular">
              Are you sure you want to permanently delete category <b>{confirmDelete}</b>? This will also clear the category classification from all products referencing it.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs text-white uppercase tracking-wider font-bold hover:bg-white/10 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
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
