import React, { useState } from "react";
import axios from "axios";

const EditCategoryForm = ({ category, close, refresh }) => {
  const [name, setName] = useState(category.name || "");
  const [description, setDescription] = useState(category.description || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(category.image || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Please enter category name");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/menu/updatecategory/${category._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("✅ Category updated successfully!");
      refresh(); // refresh category list
      close(); // close modal
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Category</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Image Preview */}
        <div className="flex flex-col items-center">
          <img
            src={preview || "/placeholder.png"}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border mb-2"
          />
          <label className="cursor-pointer bg-gray-100 px-3 py-1 rounded-md border hover:bg-gray-200">
            Change Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategoryForm;
