"use client";

import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { FloatingPaper } from "@/src/components/home/floating-paper";
import { RoboAnimation } from "@/src/components/home/robo-animation";
import { Badge } from "@/src/components/ui/badge";
import { Bot, Menu } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center">
      {/* Floating papers background */}
      <div className="absolute inset-0 overflow-hidden">
      <FloatingPaper 
  count={5} 
  images={[
    "/images/1111.jpg",
    "/images/2222.jpg",
    "/images/3333.jpg",
    "/images/4444.jpg",
    "/images/5555.jpg",
  ]}
/>

      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="purple" className="mb-6 p-3 text-white">
            <Bot className="w-8 h-8 text-purple-500" />Cipher Squad Present
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Simplifying Insurance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r font-pacifico from-purple-400 via-white to-purple-400">
                Claims with AI
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
            "Insurance should be simple, fast, and trustworthy. We make it
            happen."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-6xl"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Animated robot */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <RoboAnimation />
      </div>
    </div>
  );
}
