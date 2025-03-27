"use client";

import { Button } from "@/src/components/ui/button";
import { Bot, Menu } from "lucide-react";
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
        <span className="text-white font-medium text-xl"> Bima.ai </span>
      </Link>

      {/* <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/features">Features</NavLink>
        <NavLink href="/how-it-works">How it Works</NavLink>
        <NavLink href="/examples">Examples</NavLink>
        <NavLink href="/pricing">Pricing</NavLink>
      </div> */}

      <div className="hidden md:flex rounded-full items-center space-x-4">
        <Button variant="ghost" className="text-white rounded-full hover:text-purple-400">
          Sign In
        </Button>
        <Button className="bg-purple-600 rounded-8xl hover:bg-purple-700 text-white">
          Sign Up
        </Button>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden ml-80 rounded-8xl text-white">
        Sign In
      </Button>
      <Button variant="ghost" size="icon" className="md:hidden rounded-8xl bg-purple-600 hover:bg-purple-700 text-white">
        Sign Up
      </Button>
    </motion.nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </Link>
  );
}
