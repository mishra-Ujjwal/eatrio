import React, { useState, useEffect } from "react";
import { RiMenu3Line } from "react-icons/ri";

const Header = () => {
  const [activeSection, setActiveSection] = useState("");

  // Smooth scroll to section
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <header className="bg-white fixed top-0 left-0 z-50 shadow-sm w-full py-2 lg:px-20 px-6 md:px-8 flex items-center justify-between">
      {/* Logo */}
      <div>
        <img src="/logo1.png" alt="EatRio Logo" className="h-16" />
      </div>

      {/* Navigation */}
      <nav>
        <ul className="hidden md:flex space-x-8 text-gray-800 font-medium">
          <li>
            <div
              onClick={() => handleScroll("home")}
              className={`transition cursor-pointer ${
                activeSection === "home"
                  ? "text-green-600 font-semibold"
                  : "text-black hover:text-green-600"
              }`}
            >
              Home
            </div>
          </li>
          <li>
            <div
              onClick={() => handleScroll("features")}
              className={`transition cursor-pointer ${
                activeSection === "features"
                  ? "text-green-600 font-semibold"
                  : "text-black hover:text-green-600"
              }`}
            >
              Features
            </div>
          </li>
          <li>
            <div
              onClick={() => handleScroll("pricing")}
              className={`transition cursor-pointer ${
                activeSection === "pricing"
                  ? "text-green-600 font-semibold"
                  : "text-black hover:text-green-600"
              }`}
            >
              Pricing
            </div>
          </li>
          <li>
            <div
              onClick={() => handleScroll("contact")}
              className={`transition cursor-pointer ${
                activeSection === "contact"
                  ? "text-green-600 font-semibold"
                  : "text-black hover:text-green-600"
              }`}
            >
              Contact
            </div>
          </li>
        </ul>

        {/* Mobile Menu Icon */}
        <div className="md:hidden cursor-pointer">
          <RiMenu3Line size={23} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
