import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = ["home", "features", "pricing", "contact"];

const Header = () => {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let current = "home";
      NAV_LINKS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <header className={`fixed w-full z-50 transition ${scrolled ? "bg-white/80 backdrop-blur" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

    <img src="/logo1.png" alt="" className="h-15 w-15" />

          <nav className="hidden md:flex gap-6">
            {NAV_LINKS.map((id) => (
              <div
                key={id}
                onClick={() => goTo(id)}
                className={`capitalize font-medium transition border-none cursor-pointer ${
                  active === id ? "!text-white !bg-green-600 border px-3 py-2 rounded-xl" : "border px-3 py-2 rounded-xl text-gray-600 hover:text-green-700"
                }`}
              >
                {id}
              </div>
            ))}
          </nav>

          <button className="hidden md:block !bg-green-800 text-white px-5 py-2 rounded-full hover:scale-105 transition">
            Get Started
          </button>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed top-16 left-4 right-4 bg-white shadow-xl rounded-xl p-4 z-40">
          {NAV_LINKS.map((id) => (
            <div key={id} onClick={() => goTo(id)} className="py-2 capitalize text-gray-700">
              {id}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Header;