import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const ownerId = localStorage.getItem("ownerId");
  const restaurantData = JSON.parse(localStorage.getItem("restaurantData"));
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    if (!plan) return setMessage("Select a plan first");
    setLoading(true);
    const amount = plan === "monthly" ? 499 : 4999;

    try {
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/owner/payment/create-order`,
        { amount }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Eatrio",
        description: "Subscription Payment",
        order_id: order.id,
        handler: async function (response) {
          // Send payment + owner + restaurant info to backend
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/owner/payment/verify-payment`,
            {
              ...response,
              ownerData: { ...restaurantData, subscriptionPlan: plan, ownerId },
            }
          );
          console.log(verifyRes.data)
          setMessage(verifyRes.data.message);
          localStorage.removeItem("restaurantData");
          localStorage.removeItem("ownerId");
          navigate(`/restaurant-dashboard/${verifyRes.data?.restaurant?._id}`); // redirect to dashboard
        },
        prefill: {
          name: restaurantData.restaurantName,
        },
        theme: { color: "#FF4B3E" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setMessage("Payment failed!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Complete Payment</h2>
        <select className="w-full p-3 border rounded-lg" value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="">Select Plan</option>
          <option value="monthly">Monthly - ₹499</option>
          <option value="yearly">Yearly - ₹4999</option>
        </select>
        <button onClick={handlePayment} disabled={loading} className="w-full bg-[#FF4B3E] text-white py-3 rounded-lg">
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {message && <p className="text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Payment;
