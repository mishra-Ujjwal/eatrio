import React from "react";

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

const PricingCard = ({ plan }) => (
  <div className={
      `relative flex flex-col rounded-2xl shadow-lg p-8 mx-2 mb-4 lg:mb-0 w-full max-w-sm
      ${plan.highlighted ? 'bg-orange-600 text-white z-10 scale-105' : 'bg-white text-gray-900 border border-gray-200'}
      transition-all duration-300`
    }
  >
    {plan.badge &&
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white w-2/3 text-center text-orange-600 font-bold py-1 px-6 rounded-full shadow-lg text-base">
        {plan.badge}
      </div>
    }
    <div className="h-6" />
    <div className="font-bold text-2xl mb-3 text-center">{plan.title}</div>
    <div className="text-4xl font-bold text-center leading-tight">{plan.price}</div>
    <div className={`mb-4 text-lg text-center ${plan.highlighted ? 'text-white' : 'text-gray-500'}`}>{plan.subtitle}</div>
    <ul className="mb-8 space-y-3">
      {plan.features.map((feature, idx) => (
        <li key={idx} className="flex items-center text-base">
          <span className={`mr-2 text-xl font-semibold ${plan.highlighted ? 'text-white' : 'text-green-500'}`}>✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <button className={
      `font-bold text-lg py-3 w-full rounded-full transition 
       ${plan.highlighted ? 'bg-white text-orange-600 border-2 border-white hover:bg-orange-100 hover:text-orange-700' 
                          : 'border-2 border-orange-600 text-orange-600 bg-white hover:bg-orange-600 hover:text-white'}`
    }>
      {plan.button}
    </button>
  </div>
);

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
