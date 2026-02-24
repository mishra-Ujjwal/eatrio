import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import {
  fetchCartDB,
  addToCartDB,
  removeFromCartDB,
  addToCartLocal,
  removeFromCartLocal,
} from "../redux/cartSlice";
import { capitalizeFirstLetter } from "../utils/CapitalizeFirstLetter";

const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse rounded-lg w-full h-52 mb-3"></div>
);

const SkeletonCategory = () => (
  <div className="bg-gray-200 animate-pulse rounded-lg w-32 h-32 mr-4"></div>
);

const RestaurantPage = () => {
  const userData = useSelector((state)=>state.user.userData)
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { items } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth?.user); // add this if you store user in redux

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true });
      localStorage.removeItem("userData");
      dispatch(clearUserData());
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurantMenu();
    dispatch(fetchCartDB(id));
  }, [id, dispatch]);

  const handleAdd = (item) => {
    const newItem = { ...item, restaurantId: id, quantity: 1 };
    dispatch(addToCartLocal(newItem));
    dispatch(addToCartDB(newItem));
  };

  const handleRemove = (item) => {
    dispatch(removeFromCartLocal(item.name));
    dispatch(removeFromCartDB({ restaurantId: id, name: item.name }));
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <section className="p-6 w-screen bg-gray-50 min-h-screen relative">
      {/* ✅ Always-visible Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 flex justify-between items-center px-5 py-1">
        <h2
          className="text-3xl font-bold text-green-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/logo1.png" alt="" className="h-16" />
        </h2>
         
        <div className="relative">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="cursor-pointer flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
          >
            <FaUserCircle className="text-2xl text-gray-700" />
            <FiMenu className="text-lg text-gray-600" />
          </div>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3">
                <h3 className="font-semibold text-gray-800">
                  {userData?.name || "Guest User"}
                </h3>
                <p className="text-sm text-gray-500">
                  {userData?.email || "No email"}
                </p>
              </div>
              <hr className="my-2" />
              <h2 className="my-2 font-semibold text-base cursor-pointer" onClick={()=>{navigate("/user-orders")}}>My Orders</h2>

              <div
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left text-red-600 hover:text-red-700 font-semibold transition"
              >
                <FiLogOut />
                Logout
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="pt-20">
        {/* Skeleton Loader */}
        {loading ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <SkeletonCategory key={i} />
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-2 rounded-lg ">
                  <SkeletonCard />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </>
        ) : !restaurant ? (
          <div>Restaurant not found</div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-3xl font-bold">{restaurant.name}</h2>
                <p>{restaurant.description}</p>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    selectedCategory?._id === cat._id
                      ? "bg-green-100 border-green-500"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                  <p>{capitalizeFirstLetter(cat.name)}</p>
                </div>
              ))}
            </div>

            {selectedCategory?.items?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {selectedCategory.items.map((item) => {
                  const inCart = items.find((i) => i.name === item.name);
                  return (
                    <div
                      key={item._id}
                      className="bg-white p-2 rounded-lg hover:shadow-lg transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <h3>{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-green-600 font-bold mb-3">
                          ₹{item.price}
                        </p>
                        {inCart ? (
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => handleRemove(item)}
                              className="px-1.5 rounded-lg bg-gray-300"
                            >
                              −
                            </div>
                            <span>{inCart.quantity}</span>
                            <div
                              onClick={() => handleAdd(item)}
                              className="px-1.5 bg-green-600 text-white rounded-lg"
                            >
                              +
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleAdd(item)}
                            className="px-3 py-1 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition"
                          >
                            Add +
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No items in this category</p>
            )}
          </>
        )}
      </div>

      {cartCount > 0 && (
        <div
          onClick={() => navigate(`/${id}/cart`)}
          className="fixed bottom-0 left-0 right-0 bg-green-600 text-white text-xl py-3 text-center cursor-pointer"
        >
          View Cart ({cartCount})
        </div>
      )}
    </section>
  );
};

export default RestaurantPage;
