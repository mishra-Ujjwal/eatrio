import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantRegister = () => {
  const navigate = useNavigate();
  const ownerId = localStorage.getItem("ownerId");

  const [formData, setFormData] = useState({
    restaurantName: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Upload image to Cloudinary via backend
      const imgForm = new FormData();
      imgForm.append("image", formData.image);

      const imgRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload/`,
        imgForm,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = imgRes.data.imageUrl;

      // Step 2: Save restaurant info temporarily for payment
      const restaurantData = {
        restaurantName: formData.restaurantName,
        description: formData.description,
        image: imageUrl,
        ownerId,
      };

      localStorage.setItem("restaurantData", JSON.stringify(restaurantData));

      navigate("/payment");
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload image or save data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center">Restaurant Info</h2>
        <input
          type="text"
          name="restaurantName"
          placeholder="Restaurant Name"
          value={formData.restaurantName}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full !bg-green-800 text-white py-3 rounded-lg"
        >
          {loading ? "Saving..." : "Proceed to Payment"}
        </button>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default RestaurantRegister;
