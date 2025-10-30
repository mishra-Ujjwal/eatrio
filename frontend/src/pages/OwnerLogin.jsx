import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOwnerData } from "../redux/ownerSlice";

const OwnerLogin = () => {
  const [formData, setFormData] = useState({ email: "demo@eatrio.com", password: "demo123" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/owner/login`,
        formData,
        { withCredentials: true } // Important for cookie
      );

      // Store owner data in Redux
      dispatch(setOwnerData(res.data.owner));
      // Redirect to dashboard
      navigate(`/restaurant-dashboard/${res.data.owner.id}`);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Owner Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full !bg-green-600 hover:bg-[#e13c32] text-white py-3 rounded-lg font-semibold transition-all"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="text-center text-red-600 mt-3 font-medium">{message}</p>
        )}

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <span
            className="text-green-500 cursor-pointer"
            onClick={() => navigate("/owner-signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default OwnerLogin;
