import React, { useEffect } from "react";
import Features from "./Features";
import TestimonialSection from "./TestimonialSection";
import PricingTable from "./PricingTable";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import QrGenerator from "./QrGenerator";
import ContactForm from "./ContactForm";

const orders = [
  {
    table: 12,
    dish: "Chicken Biryani",
    price: 299,
    time: "2 mins ago",
    status: "new",
  },
  {
    table: 8,
    dish: "Masala Dosa",
    price: 149,
    time: "5 mins ago",
    status: "preparing",
  }
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="flex relative bg-[#f8fafc] flex-col md:flex-row gap-10 min-h-[calc(100vh-80px)] sm:px-16 px-6 py-16 mt-10 overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-200/40 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-200/40 blur-[100px] rounded-full animate-pulse" />

      {/* LEFT */}
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="md:text-6xl text-5xl font-extrabold text-gray-900 leading-tight">
          Manage Your Food Court <br />
          <span className="text-green-700">Smartly</span>
        </h1>

        <p className="mt-6 mb-8 text-lg max-w-lg text-gray-600">
          Accept QR-based orders directly from tables — no app required.
          Transform your restaurant operations with a smart system.
        </p>

        <button
          onClick={() => navigate("/owner-login")}
          className="bg-gradient-to-r from-green-700 to-green-900 text-white font-semibold text-lg py-3 px-8 rounded-full shadow-md hover:scale-105 transition"
        >
          Register Your Restaurant →
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col gap-6">

        {/* QR CARD */}
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition">
          <div className="text-lg font-semibold text-gray-700 mb-4">
            Table 12 - Scan to Order
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <QrGenerator />
          </div>
        </div>

        {/* ORDERS */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg text-gray-800">
              Live Orders
            </span>
            <span className="bg-green-100 text-green-700 font-semibold py-1 px-3 rounded-full text-sm">
              3 New
            </span>
          </div>

          {orders.map((order, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl mb-2 transition
              ${
                order.status === "new"
                  ? "bg-orange-50 hover:bg-orange-100"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div>
                <div className="font-semibold text-gray-700">
                  Table {order.table} - {order.dish}
                </div>
                <div className="flex gap-3 text-gray-500 text-sm mt-1">
                  <span>₹{order.price}</span>
                  <span>{order.time}</span>
                </div>
              </div>

              {order.status === "new" ? (
                <div className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full hover:scale-105 transition">
                  Accept
                </div>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 font-semibold px-5 py-2 rounded-full">
                  Preparing
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OwnerLandingPage = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();

  const ownerData = useSelector((state) => state.owner.ownerData);

  useEffect(() => {
    // Redirect to dashboard if logged in
    console.log(ownerData)
    if (ownerData) {
      navigate(`/restaurant-dashboard/${ownerData.restaurant._id}`);
    }
  }, [ownerData, navigate]);

  return(
<div className="min-h-screen w-screen font-sans bg-[#f8fafc]">
 <section id="home">
    <Hero />
  </section>
  <section id="features">
    <Features />
  </section>
  <section id="pricing">
    <PricingTable />
  </section>
  <section id="contact">
    <ContactForm />
  </section>
    

  </div>)
};

export default OwnerLandingPage;
