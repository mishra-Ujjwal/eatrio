import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const statusIcons = {
  pending: <FaClock className="text-yellow-500" />,
  preparing: <FaTruck className="text-blue-500" />,
  ready: <FaCheckCircle className="text-green-600" />,
  cancelled: <FaTimesCircle className="text-red-500" />,
};

const UserOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        { withCredentials: true }
      );
      if (res.data.success) setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🦴 Skeleton loader
  const SkeletonCard = () => (
    <div className="bg-white shadow-sm rounded-xl p-5 animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-4 bg-gray-200 w-24 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 w-12 rounded"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 w-10 rounded"></div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-3">
        <div className="h-3 bg-gray-200 w-20 rounded"></div>
        <div className="h-3 bg-gray-200 w-16 rounded"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="p-6 min-h-screen bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">My Orders</h2>
        <div className="space-y-5">
          {[1, 2, 3].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const date = new Date(order.createdAt);
            const formattedDate = date.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const formattedTime = date.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                key={order._id}
                className="bg-white shadow-sm rounded-xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {order.restaurant?.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    {statusIcons[order.status]}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="space-y-3 divide-y divide-gray-100">
                  {order.items.map((it, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{it.name}</p>
                          <p className="text-sm text-gray-500">
                            x{it.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-green-600 font-semibold">
                        ₹{it.price * it.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-600 mt-3">
                  <p>
                    Payment:{" "}
                    <span className="font-medium">{order.payment.mode}</span>
                  </p>

                  <p>
                    Total:{" "}
                    <span className="text-green-700 font-semibold">
                      ₹{order.totalPrice}
                    </span>
                  </p>
                </div>

                <p className="text-sm text-gray-400 mt-2">
                  Ordered on {formattedDate} at {formattedTime}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default UserOrderPage;
