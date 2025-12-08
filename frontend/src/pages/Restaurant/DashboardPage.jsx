import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaShoppingCart, FaWallet, FaStar, FaDownload } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import { useGetOwner } from "../../../hooks/useGetOwner";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const DashboardPage = () => {
  useGetOwner();
  const navigate = useNavigate();
  const owner = useSelector((state) => state.owner.ownerData);

  const restaurant = owner?.restaurant || {};
  const restaurantId = restaurant?._id || restaurant?.id || "";
  const restaurantName = restaurant?.name || "My Restaurant";

  const qrRef = useRef();

  // -----------------------
  // WALLET STATE
  // -----------------------
  const [wallet, setWallet] = useState({
    availableBalance: 0,
    totalCommission: 0,
    totalWithdrawn: 0,
    withdrawnTotal: 0,
    kyc: { verified: false },
  });

  // -----------------------
  // FETCH WALLET DATA
  // -----------------------
  useEffect(() => {
    if (!restaurantId) return;

    const fetchWallet = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/wallet/${restaurantId}`,
          { withCredentials: true }
        );
        console.log(res.data.wallet);

        if (res.data.success) {
          console.log("hello");
          setWallet(res.data.wallet);
        }
      } catch (err) {
        console.error("Wallet Fetch Error:", err);
      }
    };

    fetchWallet();
  }, [restaurantId]);

  // -----------------------
  // DOWNLOAD QR CODE
  // -----------------------
  const menuUrl = `https://eatrio.onrender.com/${restaurantId}`;

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${restaurantName}_qr.png`;
    link.click();
  };

  // Dummy Chart Data
  const revenueData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [2500, 2800, 2600, 3100, 3500, 3300, 4200],
        borderColor: "#ff7b00",
        backgroundColor: "rgba(255, 123, 0, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const orderData = {
    labels: ["Completed", "Ongoing", "Cancelled"],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      {/* Header & QR Code */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div ref={qrRef}>
            <QRCodeCanvas value={menuUrl} size={100} includeMargin={true} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-700 text-sm">
              {capitalizeFirstLetter(restaurantName)}
            </h2>
            <p className="text-xs text-gray-500">Scan And Order</p>

            <button
              onClick={downloadQR}
              className="flex items-center gap-2 mt-2 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-md transition"
            >
              <FaDownload /> Download QR
            </button>
          </div>
        </div>
      </div>


      {/* Wallet Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Aailable Balance</p>
            <FaWallet className="text-orange-500 text-xl" />
          </div>

          <h3 className="text-2xl font-semibold">₹{wallet.availableBalance}</h3>

          <p className="text-xs text-gray-500">
            Commission Deducted: ₹{wallet.totalCommission}
          </p>
          <p className="text-xs text-gray-500">
            Total Withdrawn: ₹{wallet.withdrawnTotal}
          </p>
          <p className="text-xs cursor-pointer  text-blue-700" onClick={()=>navigate(`/restaurant-dashboard/${restaurantId}/withdraw-history`)}>
            Show Transaction History
          </p>
          <button
            onClick={() => {
              navigate(`/restaurant-dashboard/${restaurantId}/kyc`);
            }}
            className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            {wallet.kyc?.verified ? "Withdraw Money" : "Complete KYC"}
          </button>
        </div>
      </div>

      

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>

          <ActionButton
            icon={<FaShoppingCart />}
            text="View Orders"
            sub="Check recent orders"
            onClick={() =>
              navigate(`/restaurant-dashboard/${restaurantId}/orders`)
            }
          />
        </div>
      </div>
    </div>
  );
};

// ----------------------------
// Reusable UI Components
// ----------------------------
const Card = ({ icon, title, value, sub }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-600">{title}</p>
      <div className="text-orange-500 text-xl">{icon}</div>
    </div>
    <h3 className="text-2xl font-semibold">{value}</h3>
    <p className="text-xs text-gray-500">{sub}</p>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

const ActionButton = ({ icon, text, sub, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 bg-orange-50 border border-orange-200 p-3 rounded-xl hover:bg-orange-100 transition w-full text-left"
  >
    <div className="text-orange-500 text-xl">{icon}</div>
    <div>
      <p className="font-medium text-sm">{text}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  </button>
);

export default DashboardPage;
