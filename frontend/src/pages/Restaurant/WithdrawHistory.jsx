import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const WithdrawHistory = () => {
  const { id:restaurantId } = useParams();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/withdraw/history`,
        { withCredentials: true }
      );
console.log(res.data)
      if (res.data.success) setHistory(res.data.history);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 w-screen mx-auto mt-4">
      <h2 className="text-xl font-semibold mb-4">Withdrawal History</h2>

      {history.length === 0 && (
        <p className="text-gray-500 text-sm">No transactions found.</p>
      )}

      <div className="flex flex-col gap-3">
        {history.map((tx) => (
          <div
            key={tx._id}
            className="border p-3 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-medium">₹{tx.amount}</p>
              <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs ${
                tx.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : tx.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {tx.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithdrawHistory;
