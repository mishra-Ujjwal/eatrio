import React, { useState } from "react";
import axios from "axios";

const EditMenuItem = ({ item, close, refresh }) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description || "");
  const [imageFile, setImageFile] = useState(null);

  // Track addons (title, price, image, and existing _id)
  const [addons, setAddons] = useState(
    item.addons?.map((a) => ({ ...a, newImageFile: null })) || []
  );

  // Handle addon field change
  const handleAddonChange = (index, field, value) => {
    const updated = [...addons];
    updated[index][field] = value;
    setAddons(updated);
  };

  // Handle addon image
  const handleAddonImageChange = (index, file) => {
    const updated = [...addons];
    updated[index].newImageFile = file;
    setAddons(updated);
  };

  // Add new empty addon
  const addAddon = () => {
    setAddons((prev) => [...prev, { title: "", price: "", image: "", newImageFile: null }]);
  };

  // Remove addon
  const removeAddon = (index) => {
    setAddons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);

      // Prepare addons for backend
      const addonsToSend = addons.map((a) => ({
        _id: a._id || null,
        title: a.title,
        price: a.price,
        image: a.image || "",
      }));
      formData.append("addons", JSON.stringify(addonsToSend));

      // Append addon images
      addons.forEach((a, i) => {
        if (a.newImageFile) {
          formData.append(`addonsImages[${i}]`, a.newImageFile);
        }
      });

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/menu/updatemenuitem/${item._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Menu item updated!");
      close();
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update menu item");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-screen mt-10 mb-10 flex-col gap-4">
      <h2 className="text-xl font-bold">Edit Menu Item</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border rounded"
      />
      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Addons</h3>
        {addons.map((addon, index) => (
          <div key={index} className="border p-2 rounded mb-2 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Addon Title"
              value={addon.title}
              onChange={(e) => handleAddonChange(index, "title", e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={addon.price}
              onChange={(e) => handleAddonChange(index, "price", e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleAddonImageChange(index, e.target.files[0])}
            />
            {addon.image && !addon.newImageFile && (
              <img src={addon.image} alt="addon" className="w-20 h-20 object-cover rounded" />
            )}
            <button type="button" onClick={() => removeAddon(index)} className="text-red-500">
              Remove Addon
            </button>
          </div>
        ))}
        <button type="button" onClick={addAddon} className="text-green-600 mt-2">
          + Add New Addon
        </button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
        Save Changes
      </button>
    </form>
  );
};

export default EditMenuItem;
