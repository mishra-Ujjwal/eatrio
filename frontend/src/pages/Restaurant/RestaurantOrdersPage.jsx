import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClock, FaTruck, FaCheckCircle, FaTimesCircle, FaUser } from "react-icons/fa";

const statusIcons = {
  pending: <FaClock className="text-yellow-500" />,
  preparing: <FaTruck className="text-blue-500" />,
  ready: <FaCheckCircle className="text-green-500" />,
  cancelled: <FaTimesCircle className="text-red-500" />,
};

const RestaurantOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/restaurant-orders`,
        { withCredentials: true }
      );
      if (res.data.success) setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching restaurant orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <section className="p-6 min-h-screen bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Loading Orders...</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-5 rounded-xl shadow-sm"
            >
              <div className="h-6 bg-gray-200 w-1/3 mb-4 rounded"></div>
              <div className="h-4 bg-gray-200 w-2/3 mb-2 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">Restaurant Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-lg">No orders received yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
              {/* 🧾 Order Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order ID: <span className="text-gray-600">{order._id}</span>
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on:{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {statusIcons[order.status]}
                  <span className="capitalize text-gray-700 font-medium">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* 👤 User Info */}
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <FaUser className="text-gray-500" />
                <p>
                  <strong>{order.user?.name}</strong> — {order.user?.email}
                </p>
              </div>

              {/* 🍔 Items List */}
              <div className="space-y-3 divide-y divide-gray-100">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          x{item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-green-600 font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* 💳 Footer Section */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-600">
                  Payment:{" "}
                  <span className="font-medium">
                    {order.payment?.mode || "N/A"}
                  </span>
                </p>
                <p className="text-lg font-semibold text-green-700">
                  ₹{order.totalPrice}
                </p>
              </div>

              {/* ⚙️ Status Dropdown */}
              <div className="mt-4 flex justify-end">
                <select
                  className="border rounded-lg px-4 py-2 text-gray-700 cursor-pointer"
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order._id, e.target.value)
                  }
                  disabled={updating === order._id}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RestaurantOrdersPage;
