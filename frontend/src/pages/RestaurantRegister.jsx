import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantRegister = () => {
  const navigate = useNavigate();
  const ownerId = localStorage.getItem("ownerId"); // get ownerId from signup
  const [formData, setFormData] = useState({
    restaurantName: "", description: "", image: "", latitude: "", longitude: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // save restaurant temporarily for payment step
      localStorage.setItem("restaurantData", JSON.stringify(formData));
      navigate("/payment"); // go to payment page
    } catch (err) {
      setMessage("Failed to save restaurant info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Restaurant Info</h2>
        <input type="text" name="restaurantName" placeholder="Restaurant Name" value={formData.restaurantName} onChange={handleChange} required className="w-full p-3 border rounded-lg"/>
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg"/>
        <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="w-full p-3 border rounded-lg"/>
        <input type="text" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className="w-full p-3 border rounded-lg"/>
        <input type="text" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className="w-full p-3 border rounded-lg"/>
        <button type="submit" disabled={loading} className="w-full bg-[#FF4B3E] text-white py-3 rounded-lg">
          {loading ? "Saving..." : "Proceed to Payment"}
        </button>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default RestaurantRegister;
