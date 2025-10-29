import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { MdSpaceDashboard, MdOutlineBorderColor } from "react-icons/md";
import { LuSquareMenu } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { useGetOwner } from "../../hooks/useGetOwner.jsx";
import { setOwnerData } from "../redux/ownerSlice";
import RestaurantHeader from "./Restaurant/RestaurantHeader";

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showProfile, setShowProfile] = useState(false);

  useGetOwner();
  const owner = useSelector((state) => state.owner.ownerData);

  // ✅ Handle safely if owner or restaurant isn't loaded yet
  const restaurant = owner?.restaurant || {};
  const restaurantId = restaurant?._id || restaurant?.id || "";

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/owner/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(setOwnerData(null));
      navigate("/owner-login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <MdSpaceDashboard />,
      path: `/restaurant-dashboard/${restaurantId}`,
    },
    {
      id: "menu",
      label: "Menu",
      icon: <LuSquareMenu />,
      path: `/restaurant-dashboard/${restaurantId}/menu`,
    },
    {
      id: "orders",
      label: "Orders",
      icon: <MdOutlineBorderColor />,
      path: `/restaurant-dashboard/${restaurantId}/orders`,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <CgProfile />,
      path: `/restaurant-dashboard/${restaurantId}/profile`,
    },
  ];

  const activePath = location.pathname;

  return (
    <section className="min-h-screen w-screen flex relative bg-gray-50">
      {/* Sidebar (Desktop) */}
      <aside className="md:w-1/4 sm:w-1/3 bg-red-400 hidden sm:block">
        <RestaurantHeader />
      </aside>

      {/* Mobile Navbar */}
      <nav className="sm:hidden flex items-center justify-between fixed top-0 w-full bg-white shadow-lg py-2 px-3 z-50">
        <div className="flex items-center gap-3">
          <img src="/dominos.png" alt="Logo" className="h-10" />
          <div className="text-lg font-bold">
            {restaurant?.name || "Restaurant"}
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
      <main className="pt-16 sm:pt-0 md:w-3/4 w-full">
        <Outlet />
      </main>

      {/* Mobile Footer */}
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

      {/* ✅ Owner Profile Popup */}
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
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-all"
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
