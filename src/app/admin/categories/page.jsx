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
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900">Categories Editor</h1>
        <button
          onClick={() => {
            setNewCatName("");
            setOpenCreate(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          New Category
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
              <th className="px-3 py-2 w-20">Sr. No.</th>
              <th className="px-3 py-2">Category Name</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, index) => (
              <tr key={c} className="border-t">
                <td className="px-3 py-2 text-gray-700">{index + 1}</td>
                <td className="px-3 py-2 font-medium text-gray-900">{c}</td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => {
                        setEditItem(c);
                        setEditName(c);
                      }}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(c)}
                      className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-3 text-sm text-gray-600">Loading…</p>}
        {!loading && categories.length === 0 && (
          <p className="p-3 text-sm text-gray-600">No categories found.</p>
        )}
      </div>

      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create Category"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenCreate(false)}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
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
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Category Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditItem(null)}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirm Delete"
      >
        {confirmDelete && (
          <div>
            <p className="text-sm text-gray-700">
              Are you sure you want to delete <b>{confirmDelete}</b>? This will also remove the category tag from all products.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
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
