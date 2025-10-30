import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/owner/register`, formData, { withCredentials: true });
      // Save owner ID in localStorage for next step
      localStorage.setItem("ownerId", res.data.owner.id);
      navigate("/restaurant-register"); // go to restaurant page
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Owner Signup</h2>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-lg"/>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg"/>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-lg"/>
        <button type="submit" disabled={loading} className="w-full !bg-green-600 text-white py-3 rounded-lg">
          {loading ? "Signing up..." : "Signup"}
        </button>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <p className="cursor-pointer hover:text-blue-400" onClick={()=>{navigate("/owner-login")}}>Already have an account? <span className="text-blue-600">Login</span></p>
      </form>
    </div>
  );
};

export default OwnerSignup;
