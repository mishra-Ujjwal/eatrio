import React from "react";

const features = [
  {
    icon: "🍔",
    title: "Easy Menu Setup",
    desc: "Upload your menu in minutes. Add photos, descriptions, and prices with our intuitive interface.",
  },
  {
    icon: "📦",
    title: "Live Orders Dashboard",
    desc: "Track all incoming orders in real-time. Manage preparation times and customer notifications effortlessly.",
  },
  {
    icon: "💳",
    title: "Secure Payments",
    desc: "Accept digital payments securely. Automatic settlement to your bank account within 24 hours.",
  },
  {
    icon: "🧾",
    title: "Table QR Codes",
    desc: "Generate unique QR codes for each table. Customers scan and order directly without downloading apps.",
  },
  {
    icon: "🔔",
    title: "Real-time Notifications",
    desc: "Get instant alerts for new orders, payment confirmations, and customer feedback.",
  },
  {
    icon: "📊",
    title: "Analytics & Reports",
    desc: "Track sales, popular items, and customer behavior with detailed analytics and reporting.",
  },
];

const Features = () => (
  <div className="bg-gray-50 py-12 px-6">
    <div>
        <h2>Everything You Need to Succeed</h2>
        <p>Streamline your food court operations with our comprehensive digital ordering platform</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="bg-white p-8 rounded-2xl shadow-md flex flex-col gap-4"
        >
          <div className="text-5xl mb-2">{feature.icon}</div>
          <h3 className="font-bold text-2xl text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-lg text-gray-600">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Features;
