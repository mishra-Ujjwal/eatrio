import React, { useState } from "react";
import DummyOrders from "./DummyOrders";

const OrderPage = () => {
  // Dummy 20 orders
  

  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredOrders =
    selectedStatus === "All"
      ? DummyOrders
      : DummyOrders.filter((order) => order.status === selectedStatus);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", "Accepted", "Processing", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 !rounded-full text-sm font-medium ${
              selectedStatus === status
                ? "!bg-green-600 text-white"
                : "!bg-gray-200 !text-gray-700 hover:!bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-gray-800">
                {order.customerName}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Accepted"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              Order ID: <span className="font-medium">{order.orderId}</span>
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Date: <span className="font-medium">{order.date}</span>
            </p>
            <p className="text-sm text-gray-700 font-semibold mt-2">
              Total: ₹{order.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
