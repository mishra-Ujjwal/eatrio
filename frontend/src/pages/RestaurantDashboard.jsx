import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useGetOwner } from "../../hooks/useGetOwner.jsx";
import { clearOwnerData } from "../redux/ownerSlice.js";
import RestaurantHeader from "./Restaurant/RestaurantHeader.jsx";
import { capitalizeFirstLetter } from "../utils/CapitalizeFirstLetter.js";

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showProfile, setShowProfile] = useState(false);

  useGetOwner();
  const owner = useSelector((state) => state.owner.ownerData);
  const restaurant = owner?.restaurant || {};
  const restaurantId = restaurant?._id || restaurant?.id || "";

  if (!restaurantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/owner/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(clearOwnerData());
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "🏠",
      path: `/restaurant-dashboard/${restaurantId}`,
    },
    {
      id: "menu",
      label: "Menu",
      icon: "📋",
      path: `/restaurant-dashboard/${restaurantId}/menu`,
    },
    {
      id: "orders",
      label: "Orders",
      icon: "🛍️",
      path: `/restaurant-dashboard/${restaurantId}/orders`,
    },
    {
      id: "profile",
      label: "Profile",
      icon: "👤",
      path: `/restaurant-dashboard/${restaurantId}/profile`,
    },
  ];

  const activePath = location.pathname;

  return (
    <section className="min-h-screen w-screen  flex relative bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="md:w-1/4 sm:w-1/3 bg-white hidden sm:block">
        <RestaurantHeader restaurant={restaurant} restaurantId={restaurantId} />
      </aside>

      {/* Mobile Navbar */}
      <nav className="sm:hidden flex items-center justify-between fixed top-0 w-full bg-white shadow-lg py-2 px-3 z-50">
        <div className="flex items-center gap-3">
          <img
            src={restaurant?.image || "/default-restaurant.png"}
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="text-lg font-bold">
            {capitalizeFirstLetter(restaurant?.name) || "Restaurant"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FaRegBell className="text-xl" />
          {owner?.name ? (
            <div
              className="px-3 py-1 rounded-full font-semibold bg-green-400 cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              {owner.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-gray-300 animate-pulse"></div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 sm:pt-0 sm:2/3 md:w-4/5 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Footer Tabs */}
      <footer className="fixed sm:hidden bottom-0 shadow-lg bg-white w-screen px-4 text-sm font-medium py-2 flex items-center justify-between z-50">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
              activePath === tab.path
                ? "text-orange-500 scale-110"
                : "text-gray-500 hover:text-orange-400"
            }`}
          >
            <div className="text-lg">{tab.icon}</div>
            <span className="text-[12px]">{tab.label}</span>
          </div>
        ))}
      </footer>

      {/* ✅ Profile Popup */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
              onClick={() => setShowProfile(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Owner Profile</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Name:</span> {owner?.name || "N/A"}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Email:</span> {owner?.email || "N/A"}
            </p>
            <button
              onClick={handleLogout}
              className="w-full !bg-red-500 hover:!bg-red-600 text-white py-2 rounded-lg font-semibold transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default RestaurantDashboard;
