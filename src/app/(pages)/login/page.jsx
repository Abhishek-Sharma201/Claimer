"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { Bot, Eye, EyeOff } from 'lucide-react';

const Page = () => {
  const { login, googleLogin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    const response = await login(email, password);
    if (response.success) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error(response.message);
    }
  };

  const handleGoogleLogin = async (creds) => {
    const response = await googleLogin(creds.credential);
    if (response.success) {
      toast.success("Google Login successful!");
      router.push("/");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-zinc-800 animate-fadeIn">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Bot className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold">BimaMarg</h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back!</h2>
        <p className="text-zinc-400 text-center mb-8">Log in to access your insurance dashboard.</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Email or Phone Number</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700 
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300
                placeholder:text-zinc-500"
              placeholder="Enter your email or phone"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700 
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300
                  placeholder:text-zinc-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800/50 text-purple-500 
                  focus:ring-purple-500/20 focus:ring-offset-0"
              />
              <span className="text-sm text-zinc-400">Remember me</span>
            </label>
            <button className="text-sm text-purple-500 hover:text-purple-400 transition-colors">
              Forgot Password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg
              transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            Log In
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-zinc-400 bg-black">or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              ux_mode="popup"
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google auth Error")}
            />
          </div>

          <div className="text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link 
              href="/signup"
              className="text-purple-500 hover:text-purple-400 font-medium transition-colors duration-300"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;