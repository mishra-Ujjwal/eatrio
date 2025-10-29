import React from "react";
import { RiMenu3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
const Header = () => {
  
  return (
    <header className="bg-white fixed z-50 shadow-md w-screen py-1  lg:px-20 px-6 md:px-8 flex items-center justify-between">
      {/* Logo */}
      <a href="/"><div className="">
        <img src="/logo1.png" alt="EatRio Logo" className="h-16 "  />
      </div></a>
      {/* Navigation */}
      <nav>
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li>
            <a href="/" className="hover:text-green-600 transition">
              Home
            </a>
          </li>
          <li>
            <a href="/menu" className="hover:text-green-600 transition">
              Menu
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-green-600 transition">
              About
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:text-green-600 transition">
              Contact
            </a>
          </li>
        </ul>
        <div className="md:hidden cursor-pointer">
        <RiMenu3Line size={23} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
