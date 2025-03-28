"use client";

import { Button } from "@/src/components/ui/button";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Bot className="w-8 h-8 text-purple-500" />
        <span className="text-white font-medium text-xl"> DigiClaim.ai </span>
      </Link>

      <div className="hidden md:flex rounded-full items-center space-x-4">
        <Link href="/login">
          <Button variant="ghost" className="text-white rounded-full hover:text-purple-400">
            LogIn
          </Button>
        </Link>
        {/* <Link href="/signup">
          <Button className="bg-purple-600 rounded-8xl hover:bg-purple-700 text-white">
            Sign Up
          </Button>
        </Link> */}
      </div>

      <div className="md:hidden flex space-x-2">
        <Link href="/login">
          <Button variant="ghost" size="icon" className="rounded-8xl text-white">
          LogIn
          </Button>
        </Link>
        {/* <Link href="/signup">
          <Button variant="ghost" size="icon" className="bg-purple-600 hover:bg-purple-700 text-white">
            Sign Up
          </Button>
        </Link> */}
      </div>
    </motion.nav>
  );
}
