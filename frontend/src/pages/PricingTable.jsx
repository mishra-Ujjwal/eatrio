import React from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Free Trial",
    price: "₹0",
    subtitle: "14 days free",
    features: [
      "Up to 50 orders",
      "Basic dashboard",
      "QR code generation",
      "Email support"
    ],
    button: "Start Free Trial",
    highlighted: false,
  },
  {
    title: "Basic",
    price: "₹999",
    subtitle: "per month",
    features: [
      "Unlimited orders",
      "Advanced dashboard",
      "Payment processing",
      "Basic analytics",
      "Phone support"
    ],
    button: "Get Started",
    highlighted: true,
    badge: "Most Popular"
  },
  {
    title: "Premium",
    price: "₹2,499",
    subtitle: "per month",
    features: [
      "Everything in Basic",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "API access"
    ],
    button: "Upgrade to Premium",
    highlighted: false,
  }
];

const PricingCard = ({ plan }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-8 mx-2 w-full max-w-sm
      bg-white border border-gray-100
      shadow-sm hover:shadow-2xl hover:-translate-y-2
      transition duration-300
      ${plan.highlighted ? "ring-2 ring-green-700 scale-105" : ""}`}
    >
      {plan.badge && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 font-semibold py-1 px-5 rounded-full text-sm">
          {plan.badge}
        </div>
      )}

      <div className="h-6" />

      <div className="font-bold text-2xl mb-2 text-center text-gray-900">
        {plan.title}
      </div>

      <div className="text-4xl font-bold text-center text-green-700">
        {plan.price}
      </div>

      <div className="mb-4 text-center text-gray-500">
        {plan.subtitle}
      </div>

      <ul className="mb-8 space-y-3">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center text-gray-600">
            <span className="text-green-600 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/owner-signup")}
        className="!bg-green-800 text-white py-3 rounded-full font-semibold hover:!bg-green-700 hover:scale-105 transition"
      >
        {plan.button}
      </button>
    </div>
  );
};

const PricingTable = () => (
  <section className=" w-full py-16 px-4 bg-white flex justify-center items-center min-h-screen">
    <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-6 px-2 lg:px-0 max-w-4xl">
      {plans.map((plan, idx) => (
        <PricingCard key={idx} plan={plan} />
      ))}
    </div>
  </section>
);

export default PricingTable;
