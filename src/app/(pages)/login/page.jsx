"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { Bot, Eye, EyeOff } from "lucide-react";

const Page = () => {
  const { login, googleLogin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const response = await login(email, password);
    if (response.success) {
      toast.success("Login successful!");
      router.push("/dashboard");
    } else {
      toast.error(response.message);
    }
  };

  const handleGoogleLogin = async (creds) => {
    const response = await googleLogin(creds.credential);
    if (response.success) {
      toast.success("Google Login successful!");
      router.push("/dashboard");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111111]/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-center mt-[-20px] gap-2 mb-2">
          <Bot className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl text-white font-bold">DigiClaim.ai</h1>
        </div>
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Welcome Back!
        </h1>

        <div className="space-y-6 mt-[-10px]">
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-gray-800 text-white
                  focus:border-[#5b43ff] focus:ring-1 focus:ring-[#5b43ff] transition-all duration-300
                  placeholder:text-gray-600"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-gray-800 text-white
                  focus:border-[#5b43ff] focus:ring-1 focus:ring-[#5b43ff] transition-all duration-300
                  placeholder:text-gray-600"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
              Forgot your password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#5b43ff] hover:bg-[#4935cc] text-white font-medium py-3 rounded-xl
              transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Login
          </button>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-[#111111]">
                  or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <GoogleLogin
                ux_mode="popup"
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google auth Error")}
              />
            </div>
            <div className="text-center text-sm mt-3 mb-[-20px] text-zinc-400">
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

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-1 mt-[-30px]">
          No Account? No Worries! Secure Your Future Today.
        </h2>
        <p className="text-gray-400 mb-6">
          Browse, compare, and buy the best insurance policies hassle-free.
        </p>
        <Link href="/insurance">
      <button
        className="bg-gradient-to-r from-[#5b43ff] to-[#3b82f6] text-white font-medium 
          py-3 px-8 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        Explore Plans
      </button>
    </Link>
      </div>
    </div>
  );
};

export default Page;

