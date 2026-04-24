import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f8fafc] border-t border-gray-200 pt-16 pb-8 px-6">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

        {/* LOGO + DESC */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            {/* Replace with your logo path */}
            <img src="/logo1.png" alt="Eatrio Logo" className="w-10 h-10 object-contain" />

          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            Revolutionizing food court operations with smart digital ordering
            solutions built for speed and simplicity.
          </p>
        </div>

        {/* PRODUCT */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-green-700 cursor-pointer transition">Features</li>
            <li className="hover:text-green-700 cursor-pointer transition">Pricing</li>
            <li className="hover:text-green-700 cursor-pointer transition">Demo</li>
            <li className="hover:text-green-700 cursor-pointer transition">API</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-green-700 cursor-pointer transition">Help Center</li>
            <li className="hover:text-green-700 cursor-pointer transition">Documentation</li>
            <li className="hover:text-green-700 cursor-pointer transition">Contact Us</li>
            <li className="hover:text-green-700 cursor-pointer transition">System Status</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li className="flex items-center gap-2 hover:text-green-700 transition">
              <Mail size={16} /> support@eatrio.com
            </li>
            <li className="flex items-center gap-2 hover:text-green-700 transition">
              <Phone size={16} /> +91 770188 3014
            </li>
            <li className="flex items-center gap-2 hover:text-green-700 transition">
              <MapPin size={16} /> Delhi, India
            </li>
            <li className="flex items-center gap-2 hover:text-green-700 transition">
              <Globe size={16} /> 24/7 Support
            </li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto mt-12 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-3">

        <span>© 2025 Eatrio. All rights reserved.</span>

        <div className="flex gap-4">
          <span className="hover:text-green-700 cursor-pointer transition">Privacy</span>
          <span className="hover:text-green-700 cursor-pointer transition">Terms</span>
        </div>

      </div>

    </footer>
  );
};

export default Footer;