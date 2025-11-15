import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const WithdrawPage = () => {
  const { id:restaurantId } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wallet/${restaurantId}`,
        { withCredentials: true }
      );
      if (res.data.success) setWallet(res.data.wallet);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async () => {
    if (amount <= 0) return alert("Enter valid amount");

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/withdraw/`,
        { amount },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Withdrawal request submitted");
        fetchWallet();
        setAmount("");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error withdrawing");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Withdraw Money</h2>

      <p className="text-sm text-gray-600 mb-2">
        Available Balance: <span className="font-semibold">₹{wallet.availableBalance}</span>
      </p>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border p-2 w-full rounded-md"
      />

      <button
        onClick={handleWithdraw}
        className="bg-orange-500 text-white py-2 rounded-md mt-4 w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Withdraw"}
      </button>

      <button
        onClick={() => navigate(`/restaurant-dashboard/${restaurantId}/withdraw-history`)}
        className="mt-4 text-orange-600 underline text-sm"
      >
        View Withdrawal History
      </button>
    </div>
  );
};

export default WithdrawPage;
