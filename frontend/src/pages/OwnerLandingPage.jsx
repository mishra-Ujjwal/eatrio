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
  <section className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-80px)] sm:px-16 px-6 py-12 bg-[#F8F9FA] mt-15 text-[#212529]">
    {/* Left Side */}
    <div className="flex-1 flex  flex-col justify-center text-green-800">
      <h2 className="text-5xl font-bold leading-tight mb-2">
        Manage Your Food<br />
        Court Orders Smartly

      </h2>
      <p className="mt-4 mb-8 text-xl max-w-lg font-medium text-[#212529]">
        Accept QR-based orders directly from food court tables — no app required.<br />
        Transform your restaurant operations with our smart digital ordering system.
      </p>
      <div className="flex items-center gap-6">
        <button className="!bg-green-800   text-white font-bold text-xl py-3 px-8 outline-none rounded-full shadow-md hover:!bg-green-700 transition" onClick={()=>navigate("/owner-login")}>
          Register Your Restaurant
        </button>
       
      </div>
    </div>
    {/* Right Side - Dashboard Card */}
    <div className="flex-1 flex flex-col gap-6">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-lg mb-3">
        <div className="text-xl font-semibold text-gray-700 mb-6">Table 12 - Scan to Order</div>
        {/* Placeholder for QR or Icon */}
        Scan This Qr code to login as User
        <div className="bg-gray-900 rounded-md flex items-center justify-center ">
           
          <QrGenerator/>
        </div>
      </div>
      {/* Orders Dashboard */}
      <div className="bg-white rounded-xl p-6 shadow-lg mt-2">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg text-gray-800">Live Orders Dashboard</span>
          <span className="bg-green-100 text-green-700 font-semibold py-1 px-3 rounded-full text-sm">3 New Orders</span>
        </div>
        {orders.map((order, i) => (
          <div key={i} className={`flex items-center justify-between p-4 rounded-lg mb-2 ${order.status === "new" ? "bg-orange-50" : "bg-gray-50"}`}>
            <div>
              <div className="font-semibold text-gray-700">{`Table ${order.table} - ${order.dish}`}</div>
              <div className="flex gap-3 text-gray-500 text-sm mt-1">
                <span>₹{order.price}</span>
                <span>{order.time}</span>
              </div>
            </div>
            {order.status === "new" ? (
              <button className="bg-orange-500 text-white font-bold px-6 py-2 rounded-full shadow hover:bg-orange-600 transition">
                Accept
              </button>
            ) : (
              <span className="bg-yellow-100 text-yellow-700 font-semibold px-5 py-2 rounded-full">Preparing</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
  )}
;

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
  <div className="min-h-screen w-screen font-sans bg-gray-100">
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
