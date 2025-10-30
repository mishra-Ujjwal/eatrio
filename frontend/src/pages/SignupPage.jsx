import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
   

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate()
  const handleSignup = async(e) => {
    e.preventDefault();
    console.log("working")
    try{
        const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/sign-up`,{
            name:form.username,
            email:form.email,
            password:form.password,
        })
        navigate("/user-dashboard")
    }catch(err){
        console.log(err)
    }
   
  };

  return (
    <div className="px-8">
      <div className=" bg-white mt-12">
        {/* Illustration */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo1.png" alt="" className="w-25" />
          <h2 className="text-xl mt-4 font-semibold text-slate-800">Sign Up</h2>
        </div>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label
              className="block text-start text-md font-medium mb-1 text-slate-600"
              htmlFor="username"
            >
              User name
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="User name"
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-start text-md font-medium mb-1 text-slate-600"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-start text-md font-medium mb-1 text-slate-600"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:border-blue-400 pr-12"
              />
              <div
                className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 rounded-lg !bg-green-600 text-white font-medium text-lg hover:bg-blue-700 transition mb-6"
          >
            Sign Up
          </button>
        </form>
        {/* Or continue with */}
        <div className="flex items-center my-4">
          <span className="flex-grow border-t border-gray-200"></span>
          <span className="mx-3 text-gray-400">Or Continue with</span>
          <span className="flex-grow border-t border-gray-200"></span>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          {/* Google Button */}
          <button className="flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200">
            <svg width="24" height="24" className="mr-2" viewBox="0 0 24 24">
              <g>
                <circle cx="12" cy="12" r="10" fill="#fff" />
                <path
                  d="M21.35 11.1H12v2.8h5.35C16.76 16.7 14.71 18.3 12 18.3c-3.47 0-6.3-2.82-6.3-6.3s2.83-6.3 6.3-6.3c1.65 0 3.16.63 4.32 1.67l2.13-2.13C18.15 4.53 15.26 3.3 12 3.3 6.82 3.3 2.7 7.41 2.7 12.6s4.12 9.3 9.3 9.3c5.08 0 9.3-4.12 9.3-9.3 0-.54-.06-1.06-.15-1.55z"
                  fill="#4285F4"
                />
              </g>
            </svg>
            Google
          </button>
          {/* Facebook Button */}
          <button className="flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200">
            <svg width="24" height="24" className="mr-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#1877F3" />
              <text
                x="12"
                y="16"
                fill="#fff"
                fontSize="12"
                textAnchor="middle"
                fontFamily="Arial"
              >
                f
              </text>
            </svg>
            Facebook
          </button>
        </div>
        {/* Footer text */}
        <div className="text-center text-slate-500 text-sm pb-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="!text-green-600 font-semibold hover:underline"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
