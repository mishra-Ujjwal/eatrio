import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useGetUser } from "../../hooks/useGetUser";
import { clearUserData } from "../redux/userSlice";

const CAROUSEL_IMAGES = ["/banner1.png", "/banner2.png", "/banner4.png"];

const UserPage = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  useGetUser()
  const user = useSelector((state)=>state.user.userData)
  const dispatch = useDispatch()

  const handleClick = (id) => {
    navigate(`/${id}`);
  };

  const getAllRestaurant = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant`, {
        withCredentials: true,
      });
      setRestaurants(result.data.data);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRestaurant();
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setCurrent((prev) => (prev + 1) % CAROUSEL_IMAGES.length),
      3500
    );
    return () => clearTimeout(timer);
  }, [current]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true });

      // ✅ Clear user data from localStorage
      localStorage.removeItem("userData");
       dispatch(clearUserData())
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const RestaurantSkeleton = () => (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center animate-pulse">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </div>
  );

  return (
    <div className="w-screen md:px-38 bg-gray-50 min-h-screen pt-16 relative">
      
      {/* ✅ Header with menu */}
      <header className="fixed top-0 md:px-38 left-0 w-full bg-white shadow-sm z-10 flex justify-between items-center px-5 py-3">
        <h1
          className="text-xl font-bold text-green-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Eatrio
        </h1>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
          >
            <FaUserCircle className="text-2xl text-gray-700" />
            <FiMenu className="text-lg text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-800">
                  {user?.name || "Guest User"}
                </h3>
                <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
              </div>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left text-red-600 hover:text-red-700 font-semibold transition"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Carousel */}
      <div className="px-4 mt-8">
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src={CAROUSEL_IMAGES[current]}
            alt={`Banner ${current + 1}`}
            className="w-full h-48 sm:h-64 md:h-80 object-cover transition-transform duration-500"
          />
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {CAROUSEL_IMAGES.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  idx === current ? "bg-green-500 scale-125" : "bg-gray-300"
                }`}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants or dishes..."
          className="w-full p-3 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Restaurant Grid */}
      <div className="px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {loading
          ? [...Array(8)].map((_, idx) => <RestaurantSkeleton key={idx} />)
          : filteredRestaurants.length > 0
          ? filteredRestaurants.map((item) => (
              <div
                key={item._id}
                onClick={() => handleClick(item._id)}
                className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-3"
                />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{item.name}</h2>
              </div>
            ))
          : (
            <p className="col-span-full text-center text-gray-400 mt-10">
              No restaurants found.
            </p>
          )}
      </div>
    </div>
  );
};

export default UserPage;
