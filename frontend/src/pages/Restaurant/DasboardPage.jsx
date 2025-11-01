import React, { useRef } from "react";
import { FaShoppingCart, FaWallet, FaStar, FaQrcode, FaDownload } from "react-icons/fa";
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
import { useGetOwner } from "../../../hooks/useGetOwner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const DashboardPage = () => {
  useGetOwner();
  const owner = useSelector((state) => state.owner.ownerData);
  const navigate = useNavigate();

  // ✅ Handle safely if owner or restaurant isn't loaded yet
  const restaurant = owner?.restaurant || {};
  const restaurantId = restaurant?._id || restaurant?.id || "";
  const restaurantName = restaurant?.name || "My Restaurant";
  const menuUrl = `https://eatrio.onrender.com/${restaurantId}`;
  
  const qrRef = useRef();

  // 📦 QR Download Handler
  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${restaurantName}_menu_qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // 📊 Line Chart Data
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

  // 🍩 Doughnut Chart Data
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
      {/* 🔝 Topbar with QR Generator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

        {/* 🧾 QR Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div ref={qrRef}>
            <QRCodeCanvas value={menuUrl} size={100} includeMargin={true} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-700 text-sm">{capitalizeFirstLetter(restaurantName)}</h2>
            <p className="text-xs text-gray-500">Scan And Order</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 !bg-green-500 hover:!bg-green-600 text-white text-xs px-3 py-1 rounded-md transition"
              >
                <FaDownload /> Download QR
              </button>
             
            </div>
          </div>
        </div>
      </div>

      {/* 📦 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <Card icon={<FaShoppingCart />} title="Total Orders" value="1,247" sub="+12% from last month" />
        <Card icon={<FaWallet />} title="Revenue" value="$24,580" sub="+8% from last month" />
        <Card icon={<MdFastfood />} title="Active Menu Items" value="89" sub="3 items added today" />
        <Card icon={<FaStar />} title="Customer Reviews" value="4.8" sub="(234 reviews)" />
      </div>

      {/* 📈 Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Revenue Trends</h2>
          <Line
            data={revenueData}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Order Distribution</h2>
          <Doughnut
            data={orderData}
            options={{
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </div>
      </div>

      {/* 🧾 Recent Orders & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button className="text-orange-500 text-sm font-medium">View All</button>
          </div>
          <OrderItem name="Margherita Pizza + Coke" id="#1247" customer="John Smith" price="$24.50" status="Completed" />
          <OrderItem name="Caesar Salad + Pasta" id="#1248" customer="Jane Doe" price="$32.00" status="Completed" />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div
            className="flex flex-col gap-3"
            onClick={() => {
              navigate(`/restaurant-dashboard/${restaurantId}/orders`);
            }}
          >
            <ActionButton icon={<FaShoppingCart />} text="View Orders" sub="Check recent orders" />
          </div>
        </div>
      </div>
    </div>
  );
};

// 🧩 Sub Components
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

const OrderItem = ({ id, name, customer, price, status }) => (
  <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 mb-2">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-xs text-gray-500">
        {id} • {customer}
      </p>
    </div>
    <div className="text-right">
      <p className="font-semibold">{price}</p>
      <p className="text-xs text-green-500">{status}</p>
    </div>
  </div>
);

const ActionButton = ({ icon, text, sub }) => (
  <button className="flex items-center gap-3 bg-orange-50 border border-orange-200 p-3 rounded-xl hover:bg-orange-100 transition">
    <div className="text-orange-500 text-xl">{icon}</div>
    <div className="text-left">
      <p className="font-medium text-sm">{text}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  </button>
);

export default DashboardPage;
