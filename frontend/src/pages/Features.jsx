import React from "react";
import {
  Utensils,
  LayoutDashboard,
  CreditCard,
  QrCode,
  Bell,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Utensils,
    title: "Easy Menu Setup",
    desc: "Upload your menu in minutes with a clean and intuitive interface.",
  },
  {
    icon: LayoutDashboard,
    title: "Live Orders Dashboard",
    desc: "Track and manage all orders in real-time with zero confusion.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "Accept digital payments with fast and reliable settlement.",
  },
  {
    icon: QrCode,
    title: "Table QR Codes",
    desc: "Customers scan and order directly — no app required.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Instant alerts for orders, payments, and updates.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    desc: "Understand your business with clean data insights.",
  },
];

const Features = () => {
  return (
    <section className="bg-[#f9fafb] py-20 px-6">

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-gray-900">
          Everything You Need to Run Smarter
        </h2>
        <p className="text-gray-600 mt-3">
          Built like a control system — fast, reliable, and easy to manage.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => {
          const Icon = f.icon;

          return (
            <div
              key={i}
              className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 text-green-700 mb-4 group-hover:scale-110 transition">
                <Icon size={22} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {f.title}
              </h3>

              {/* Desc */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;