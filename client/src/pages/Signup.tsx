import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaApple } from "react-icons/fa";
import { HiOutlineArrowRight, HiSparkles } from "react-icons/hi";
import { api } from "../lib/api";

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/api/users/", {
        username: name,
        email,
        password,
      });

      // Then log them in directly
      const res = await api.post("/api/token/", {
        username: name,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      nav("/onboarding");
    } catch (err: any) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-left mb-6">
          <div className="flex items-center space-x-2">
            <HiSparkles className="text-indigo-600 text-xl" />
            <h1 className="text-2xl font-bold">Sign Up</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Free forever. No credit card needed.
          </p>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 transition">
            <FaGoogle className="text-lg" />
            Sign up with Google
          </button>
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 transition">
            <FaApple className="text-lg" />
            Sign up with Apple
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-2 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2 text-sm">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="terms" className="text-gray-700">
              I agree to all the{" "}
              <a href="#" className="text-indigo-600 underline">
                Term
              </a>
              ,{" "}
              <a href="#" className="text-indigo-600 underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 underline">
                Fees
              </a>
              .
            </label>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Continue <HiOutlineArrowRight className="text-base" />
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-700 mt-6">
          Have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
