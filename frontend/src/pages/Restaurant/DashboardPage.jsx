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
  <div className="p-8 w-full bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Overview
      </h1>

      <p className="text-gray-500">
        Welcome back! Here's what's happening with your store.
      </p>
    </div>


    {/* Top Cards */}
    <div className="grid md:grid-cols-2 gap-6 mb-6">

      {/* QR CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-center mb-3">

          <div>
            <h2 className="font-semibold text-lg">
              Your Store QR Code
            </h2>

            <p className="text-gray-500 text-sm">
              Customers can scan to view your menu
            </p>
          </div>

          <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
            Active
          </span>

        </div>


        <div className="flex items-center gap-6 mt-4">

          <div
            ref={qrRef}
            className="p-3 border rounded-xl"
          >
            <QRCodeCanvas
              value={menuUrl}
              size={110}
            />
          </div>


          <div>

            <h3 className="font-semibold text-gray-700">

              {capitalizeFirstLetter(restaurantName)}

            </h3>

            <p className="text-gray-500 text-sm">

              Scan and Order

            </p>


            <button
              onClick={downloadQR}
              className="mt-4 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            >

              <FaDownload />

              Download QR Code

            </button>

          </div>

        </div>

      </div>



      {/* WALLET CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-center mb-4">

          <h2 className="font-semibold">

            Available Balance

          </h2>

          <FaWallet className="text-xl text-green-600"/>

        </div>


        <h1 className="text-3xl font-bold">

          ₹{wallet.availableBalance}

        </h1>


        <div className="mt-4 text-sm text-gray-600">

          <div className="flex justify-between">

            <span>Commission Deducted</span>

            <span>

              ₹{wallet.totalCommission}

            </span>

          </div>


          <div className="flex justify-between mt-2">

            <span>Total Withdrawn</span>

            <span>

              ₹{wallet.withdrawnTotal}

            </span>

          </div>

        </div>



        <p
          onClick={() =>
            navigate(`/restaurant-dashboard/${restaurantId}/withdraw-history`)
          }
          className="mt-4 text-green-600 cursor-pointer text-sm"
        >
          Show Transaction History →
        </p>


        <button
          onClick={() =>
            navigate(`/restaurant-dashboard/${restaurantId}/kyc`)
          }
          className="mt-4 w-full bg-gray-100 py-3 rounded-lg text-gray-600"
        >

          {wallet.kyc?.verified
            ? "Withdraw Money"
            : "Complete KYC to Withdraw"}

        </button>


      </div>

    </div>



    {/* QUICK ACTIONS */}
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <h2 className="font-semibold text-lg mb-4">

        Quick Actions

      </h2>


      <div className="grid md:grid-cols-4 gap-5">


        <ActionCard
          icon={<FaShoppingCart />}
          title="View Orders"
          sub="Check recent orders"
          onClick={() =>
            navigate(`/restaurant-dashboard/${restaurantId}/orders`)
          }
        />


        <ActionCard
          icon={<MdFastfood />}
          title="Manage Menu"
          sub="Add or edit items"
          onClick={() =>
            navigate(`/restaurant-dashboard/${restaurantId}/menu`)
          }
        />


        <ActionCard
          icon={<FaStar />}
          title="Analytics"
          sub="View store insights"
        />


        <ActionCard
          icon={<FaWallet />}
          title="Get Support"
          sub="Contact help desk"
        />


      </div>

    </div>


  </div>
);
};

const ActionCard = ({icon,title,sub,onClick}) => {

return(

<div
onClick={onClick}
className="bg-gray-50 p-5 rounded-xl cursor-pointer hover:shadow-md transition"
>

<div className="text-2xl text-orange-500 mb-3">
{icon}
</div>

<h3 className="font-semibold">
{title}
</h3>

<p className="text-sm text-gray-500">
{sub}
</p>

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
