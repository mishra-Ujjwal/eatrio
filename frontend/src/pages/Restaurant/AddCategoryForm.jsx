import React, { useState } from "react";
import axios from "axios";

const AddCategoryForm = ({ restaurantId,close }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !restaurantId || !image) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("restaurantId", restaurantId);
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/menu/addcategory`, formData, {
        withCredentials:true
      });

      if (res.status === 201) {
        alert("✅ Category added successfully!");
        setName("");
        setDescription("");
        setImage(null);
        setImagePreview(null);
        close();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          rows={3}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files[0]);
            if (e.target.files && e.target.files[0]) {
              setImagePreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
          className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded border"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "!bg-green-500 hover:!bg-green-600"
          } text-white px-4 py-2 rounded transition`}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryForm;
