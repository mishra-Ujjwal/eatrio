import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AllMenuPage = () => {
  const { id } = useParams();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllMenu = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/restaurant/${id}/menu`
      );
      if (res.data.success) {
        const items = res.data.categories.flatMap((cat) => cat.items || []);
        setAllItems(items);
      }
    } catch (error) {
      console.error("Error fetching full menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMenu();
  }, [id]);

  if (loading)
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 w-48 mb-4 rounded"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="w-full h-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">All Menu Items</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allItems.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-green-600 font-semibold">₹{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllMenuPage;
