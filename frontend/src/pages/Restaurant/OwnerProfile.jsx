import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearOwnerData } from "../redux/ownerSlice";

const OwnerProfile = () => {
  const owner = useSelector((state) => state.owner.ownerData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/owner/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(clearOwnerData());
      localStorage.removeItem("ownerData");
      navigate("/owner-login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!owner) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading owner data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Owner Profile
        </h2>

        <div className="space-y-4 text-left">
          <div>
            <h3 className="text-gray-600 text-sm">Name</h3>
            <p className="text-lg font-semibold text-gray-900">
              {owner?.name || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-gray-600 text-sm">Email</h3>
            <p className="text-lg font-semibold text-gray-900">
              {owner?.email || "N/A"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-[#FF4B3E] hover:bg-[#e13c32] text-white py-3 rounded-lg font-semibold transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default OwnerProfile;
