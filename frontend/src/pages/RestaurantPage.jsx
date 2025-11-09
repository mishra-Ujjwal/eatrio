import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
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
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { items } = useSelector((state) => state.cart);

  const getRestaurantMenu = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/${id}/menu`);
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

  if (loading)
    return (
      <section className="p-6 w-screen bg-gray-50 min-h-screen">
        {/* Restaurant Info Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonCategory key={i} />
          ))}
        </div>

        {/* Menu Items Skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border">
              <SkeletonCard />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );

  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <section className="p-6 w-screen bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <img src={restaurant.image} alt={restaurant.name} className="w-20 h-20 rounded-full object-cover" />
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
            <img src={cat.image} alt={cat.name} className="w-32 h-32 object-cover rounded-lg mb-2" />
            <p>{capitalizeFirstLetter(cat.name)}</p>
          </div>
        ))}
      </div>

      {selectedCategory?.items?.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedCategory.items.map((item) => {
            const inCart = items.find((i) => i.name === item.name);
            return (
              <div key={item._id} className="bg-white p-4 rounded-lg border hover:shadow-lg transition">
                <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h3>{item.name}</h3>
                <p className="text-green-600 font-bold mb-3">₹{item.price}</p>
                {inCart ? (
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleRemove(item)} className="px-3 py-1 border rounded-full">−</button>
                    <span>{inCart.quantity}</span>
                    <button onClick={() => handleAdd(item)} className="px-3 py-1 bg-green-600 text-white rounded-full">+</button>
                  </div>
                ) : (
                  <button onClick={() => handleAdd(item)} className="w-full py-2 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition">Add +</button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No items in this category</p>
      )}

      {cartCount > 0 && (
        <div onClick={() => navigate(`/${id}/cart`)} className="fixed bottom-0 left-0 right-0 bg-green-600 text-white text-xl py-3 text-center cursor-pointer">
          View Cart ({cartCount})
        </div>
      )}
    </section>
  );
};

export default RestaurantPage;
