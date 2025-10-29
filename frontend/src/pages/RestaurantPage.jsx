import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter.jsx";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({}); // key: itemId, value: quantity

  const getRestaurantMenu = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/restaurant/${id}/menu`
      );
      if (res.data.success) {
        setRestaurant(res.data.restaurant);
        setCategories(res.data.categories);
        setSelectedCategory(res.data.categories[0]);
      }
    } catch (error) {
      console.error("Error loading restaurant menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurantMenu();
  }, [id]);

  const handleAddToCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId]--;
      else delete updated[itemId];
      return updated;
    });
  };

  if (loading) {
    return (
      <section className="p-4 bg-gray-50 w-screen min-h-screen animate-pulse">
        <div className="h-10 bg-gray-200 w-48 rounded mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="w-full h-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!restaurant)
    return (
      <div className="text-center mt-20 text-red-500">Restaurant not found</div>
    );

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800">
          {capitalizeFirstLetter(restaurant.name)}
        </h1>
        <p className="text-gray-600 max-w-md">{restaurant.description}</p>
      </div>

      {/* See all menu */}
      <div className="text-center mb-6">
        <button
          onClick={() => navigate(`/${id}/menu`)}
          className="px-6 py-2 bg-green-600 text-white rounded-full font-medium shadow-md hover:bg-green-700 transition"
        >
          See All Menu 🍴
        </button>
      </div>

      {/* Category Scroll */}
      <div className="-mx-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-5 w-screen overflow-x-auto px-4 pb-4 mb-10">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => setSelectedCategory(cat)}
              className={`min-w-[200px] flex-shrink-0 text-center border rounded-xl p-4 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedCategory?._id === cat._id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
              />
              <p className="text-lg font-semibold text-gray-800">
                {capitalizeFirstLetter(cat.name)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      {selectedCategory && selectedCategory.items?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCategory.items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition relative"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-green-600 font-semibold mb-2">₹{item.price}</p>

              {/* Cart controls */}
              {cart[item._id] ? (
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-xl font-bold text-gray-700"
                  >
                    −
                  </button>
                  <span className="text-lg font-medium text-gray-800">
                    {cart[item._id]}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(item._id)}
                  className="px-6 py-2 border border-green-600 text-green-600 font-semibold rounded-full hover:bg-green-600 hover:text-white transition"
                >
                  Add +
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No items in this category.
        </p>
      )}
    </section>
  );
};

export default RestaurantPage;
