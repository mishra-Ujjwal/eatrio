import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddMenuItem = ({ categoryId }) => {
  const { id } = useParams(); // restaurant ID
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: categoryId || "",
    image: null,
    addons: [{ title: "", price: "", image: null }],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddonChange = (index, field, value) => {
    const updated = [...formData.addons];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, addons: updated }));
  };

  const handleAddonImageChange = (index, file) => {
    const updated = [...formData.addons];
    updated[index].image = file;
    setFormData((prev) => ({ ...prev, addons: updated }));
  };

  const addAddon = () => {
    setFormData((prev) => ({
      ...prev,
      addons: [...prev.addons, { title: "", price: "", image: null }],
    }));
  };

  const removeAddon = (index) => {
    const updated = formData.addons.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, addons: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // ✅ Image validation
    if (!formData.image) {
      setError("Please upload a main image before submitting.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("image", formData.image);

      const validAddons = formData.addons.filter(
        (addon) => addon.title.trim() !== "" && addon.price !== ""
      );

      if (validAddons.length > 0) {
        data.append("addons", JSON.stringify(validAddons));

        validAddons.forEach((addon, index) => {
          if (addon.image) data.append(`addonsImages[${index}]`, addon.image);
        });
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/menu/${id}/add-menu-item`,
        data,
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: categoryId || "",
        image: null,
        addons: [{ title: "", price: "", image: null }],
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
        Add Menu Item
      </h2>

      {error && <p className="text-center text-red-500 mb-3">{error}</p>}
      {message && <p className="text-center text-green-600 mb-3">{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-lg"
        />

        <div>
          <label className="font-medium">Main Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Addons */}
        {formData.addons.length > 0 && (
          <div className="space-y-2">
            <p className="font-semibold">Addons</p>
            {formData.addons.map((addon, index) => (
              <div key={index} className="border p-2 rounded-lg bg-gray-50 space-y-2">
                <input
                  type="text"
                  placeholder="Addon title"
                  value={addon.title}
                  onChange={(e) => handleAddonChange(index, "title", e.target.value)}
                  className="w-full border p-2 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Addon price"
                  value={addon.price}
                  onChange={(e) => handleAddonChange(index, "price", e.target.value)}
                  className="w-full border p-2 rounded-lg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAddonImageChange(index, e.target.files[0])}
                />
                {formData.addons.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 text-sm"
                    onClick={() => removeAddon(index)}
                  >
                    Remove Addon
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAddon}
              className="text-green-600 text-sm mt-2"
            >
              + Add Another Addon
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full !bg-green-600 text-white py-2 rounded-lg"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddMenuItem;
