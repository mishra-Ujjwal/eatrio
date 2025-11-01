import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdSpaceDashboard, MdOutlineBorderColor,MdLogout } from "react-icons/md";
import { LuSquareMenu } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { clearOwnerData } from "../../redux/ownerSlice";
import { useDispatch } from "react-redux";

const RestaurantHeader = ({ restaurant, restaurantId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <MdSpaceDashboard />, path: `/restaurant-dashboard/${restaurantId}` },
    { id: "menu", label: "Menu", icon: <LuSquareMenu />, path: `/restaurant-dashboard/${restaurantId}/menu` },
    { id: "orders", label: "Orders", icon: <MdOutlineBorderColor />, path: `/restaurant-dashboard/${restaurantId}/orders` },
    { id: "profile", label: "Profile", icon: <CgProfile />, path: `/restaurant-dashboard/${restaurantId}/profile` },
  ];

  const activePath = location.pathname;
  const dispatch = useDispatch()
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
  return (
    <nav className="h-screen overflow-y-auto bg-white px-5 py-4 border-r border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-300 py-3 flex items-center gap-3">
        <img
          src={restaurant?.image || "/default-restaurant.png"}
          alt="logo"
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="font-bold text-xl">
          {restaurant?.name || "Restaurant"}
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col space-y-3 pt-5 text-lg font-medium">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                isActive
                  ? "bg-green-100 text-green-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
      {/* Logout Option */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-100 mt-6 font-medium transition-all duration-300"
        >
          <MdLogout className="text-xl" />
          <span>Logout</span>
        </div>
    </nav>
  );
};

export default RestaurantHeader;
