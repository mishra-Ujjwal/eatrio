import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCartDB,
  addToCartDB,
  removeFromCartDB,
  clearCartDB,
  addToCartLocal,
  removeFromCartLocal,
  clearCartLocal,
} from "../redux/cartSlice";
import axios from "axios";


const CartPage = () => {
    const userData = useSelector((state)=>state.user.userData)

  const [tableNumber, setTableNumber] = useState("");
  const { id: restaurantId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCartDB(restaurantId));
  }, [dispatch, restaurantId]);

  const handleAdd = (item) => {
    const payload = { ...item, restaurantId };
    dispatch(addToCartLocal(payload));
    dispatch(addToCartDB(payload));
  };

  const handleRemove = (item) => {
    dispatch(removeFromCartLocal(item.name));
    dispatch(removeFromCartDB({ restaurantId, name: item.name }));
  };

  const handleClear = () => {
    dispatch(clearCartLocal());
    dispatch(clearCartDB(restaurantId));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const handleCheckout = async () => {
  const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order-customer`, {
    amount: total,
  });

  const options = {
    key: data.key,
    amount: data.amount,
    currency: data.currency,
    name: "Food Order Scan",
    description: "Order Payment",
    order_id: data.orderId,
    handler: async function (response) {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-customer-payment`, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        userId:userData._id,
        restaurantId: restaurantId,
        items: items,
        totalPrice:total,
        pickupTable:tableNumber
      });
      alert("Order placed successfully!");
    },
    theme: { color: "#F37254" },
  };

  const razor = new window.Razorpay(options);
  razor.open();
};


  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="loader mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your cart...</p>
        <style>{`
          .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #22c55e;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );

  if (!items.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty Cart"
          className="w-40 h-40 mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Add some delicious items to get started!</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Go to Home
        </button>
      </div>
    );

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between border-b py-3">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
              <div>
                <p>{item.name}</p>
                <p className="text-green-600 font-medium">₹{item.price}</p>
              </div>
            </div>
           
           
            <div className="flex items-center gap-3">
                    <div onClick={() => handleRemove(item)} className="px-3 py-1 rounded-lg bg-gray-300">−</div>
                    <span>{item.quantity}</span>
                    <div onClick={() => handleAdd(item)} className="px-3 py-1  bg-green-600 text-white rounded-lg">+</div>
                  </div>
          </div>
        ))}
      </div>

      <div className="p-6 mt-5 bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Enter Your Table Number</h2>
        <input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="px-4 py-2 border rounded-lg mb-4 w-48 text-center"
        />
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
        <p className="text-xl font-bold">Total: ₹{total}</p>
        <div
          onClick={handleCheckout}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
        >
          Proceed To Pay
        </div>
      </div>
    </section>
  );
};

export default CartPage;
