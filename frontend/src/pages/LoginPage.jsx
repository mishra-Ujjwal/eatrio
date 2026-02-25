import axios from "axios";
import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "user@eatrio.com",
    password: "user123",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
 if (loading) return; // prevent double click

  setLoading(true);
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/sign-in`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      // ✅ Extract user info (depends on your API response)
      const userData = result.data.user || result.data.data || null;

      // ✅ Save user info in Redux + localStorage
      dispatch(setUserData(userData));

      // ✅ Navigate to dashboard
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials or server error!");
    }
    setLoading(false);
  };

  return (
    <div className="w-screen">
      <div className="px-8 mt-12 bg-white">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo1.png" alt="" className="w-25" />
          <h2 className="text-xl mt-4 font-semibold text-slate-800">
            Sign In
          </h2>
        </div>
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-start text-xl font-medium mb-1 text-slate-600"
              htmlFor="username"
            >
              Email
            </label>
            <input
              id="username"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
              required
              className="w-full px-4 py-3 border rounded-lg bg-gray-100 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label
              className="block text-start text-xl font-medium mb-1 text-slate-600"
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
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 focus:outline-none focus:border-blue-400 pr-12"
              />
              <div
                className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>

          {/* Forget Password */}
          <div className="text-right mb-6">
            <div
              className="text-blue-600 pt-2 text-sm hover:underline focus:outline-none"
              type="button"
            >
              Forget password
            </div>
          </div>

          {/* Submit */}
          <button
  type="submit"
  disabled={loading}
  className="w-full py-3 rounded-lg !bg-green-600 text-white font-medium text-lg hover:bg-green-700 transition mb-6 disabled:bg-gray-400"
>
  {loading ? "Logging in..." : "Login"}
</button>
        </form>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm pb-4">
          Haven’t any account?{" "}
          <a
            href="/signup"
            className="!text-green-600 font-semibold hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
