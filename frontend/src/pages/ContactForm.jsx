import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    restaurant: "",
    location: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Your message has been submitted successfully!");
  };

  return (
    <section className="min-h-screen bg-white flex flex-col items-center justify-center px-6 sm:px-12 lg:px-24 py-12">
      <div className="max-w-4xl w-full">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
          Love to hear from you,
        </h2>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-10">
          Get in touch 👋
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 font-[Inter] text-gray-800"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Your name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Your email</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Phone number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Restaurant Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Restaurant name</label>
              <input
                type="text"
                name="restaurant"
                placeholder="EatRio Kitchen"
                value={formData.restaurant}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Restaurant location</label>
            <input
              type="text"
              name="location"
              placeholder="Mumbai, India"
              value={formData.location}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">How can we help you?</label>
            <textarea
              name="message"
              placeholder="Tell us about your restaurant or what support you need..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="!bg-green-900 !text-white font-medium px-8 py-4 rounded-md hover:bg-gray-900 transition-all"
            >
              Just Send →
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
