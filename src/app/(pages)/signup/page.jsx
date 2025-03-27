"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";

const Page = () => {
  const { signup } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    policynumber: "",
    dob: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.policynumber)
      newErrors.policynumber = "Policy number is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (validateForm()) {
      console.log(formData);
      const response = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.policynumber,
        formData.dob
      );
      if (response.success) {
        toast.success("Signup successful!");
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-zinc-800">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Bot className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold">BimaMarg</h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
        <p className="text-zinc-400 text-center mb-8">
          Fill out the form to get started on your journey.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800/50 border ${
                errors.name ? "border-red-500" : "border-zinc-700"
              } 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300
                placeholder:text-zinc-500`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800/50 border ${
                errors.email ? "border-red-500" : "border-zinc-700"
              } 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300
                placeholder:text-zinc-500`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800/50 border ${
                errors.dob ? "border-red-500" : "border-zinc-700"
              } 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300
                text-zinc-300`}
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Policy Number</label>
            <input
              type="text"
              name="policynumber"
              value={formData.policynumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800/50 border ${
                errors.policynumber ? "border-red-500" : "border-zinc-700"
              } 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300
                text-zinc-300`}
              placeholder="Enter your policy number"
            />
            {errors.policynumber && (
              <p className="text-red-500 text-xs mt-1">{errors.policynumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800/50 border ${
                errors.password ? "border-red-500" : "border-zinc-700"
              } 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300
                placeholder:text-zinc-500`}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg
              transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            Create Account
          </button>

          <div className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-500 hover:text-purple-400 font-medium transition-colors duration-300"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
