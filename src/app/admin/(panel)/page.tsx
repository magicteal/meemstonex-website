"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import SectionHeader from "@/components/ui/section-header";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [newProductImage, setNewProductImage] = useState<File | null>(null);

  const fetchProducts = async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProductImage(e.target.files[0]);
    }
  };

  const uploadImage = async (imageFile: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return result.url;
    }
    return null;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductImage) {
      alert("Please select an image to upload.");
      return;
    }

    const imageUrl = await uploadImage(newProductImage);
    if (!imageUrl) {
      alert("Image upload failed. Please try again.");
      return;
    }

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProduct, image: imageUrl }),
    });

    if (response.ok) {
      fetchProducts();
      setNewProduct({ name: "", category: "", price: "" });
      setNewProductImage(null);
      // Clear file input
      const fileInput = document.getElementById(
        "newProductImage"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let imageUrl = editingProduct.image;
    const editImageFile = (
      document.getElementById("editProductImage") as HTMLInputElement
    ).files?.[0];

    if (editImageFile) {
      const uploadedUrl = await uploadImage(editImageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        alert("Image upload failed during update.");
        return;
      }
    }

    const response = await fetch(`/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editingProduct, image: imageUrl }),
    });

    if (response.ok) {
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  return (
    <>
      <div className="container mx-auto px-8 py-12 text-white">
        <SectionHeader
          title="Admin"
          highlight="Panel"
          subtitle="Manage your products from here."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-neutral-900/50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="w-full bg-neutral-800/60 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="w-full bg-neutral-800/60 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="text"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full bg-neutral-800/60 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <div>
                <label
                  htmlFor="newProductImage"
                  className="text-sm text-neutral-400"
                >
                  Product Image
                </label>
                <input
                  id="newProductImage"
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold p-3 rounded-md transition-colors"
              >
                Add Product
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-neutral-900/50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Existing Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-800"
                    >
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.price}</td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-8 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Edit Product</h3>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                className="w-full bg-neutral-800/60 p-3 rounded-md"
              />
              <input
                type="text"
                name="category"
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                className="w-full bg-neutral-800/60 p-3 rounded-md"
              />
              <input
                type="text"
                name="price"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                className="w-full bg-neutral-800/60 p-3 rounded-md"
              />
              <div>
                <label
                  htmlFor="editProductImage"
                  className="text-sm text-neutral-400"
                >
                  Change Image (optional)
                </label>
                <input
                  id="editProductImage"
                  type="file"
                  name="image"
                  className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;
