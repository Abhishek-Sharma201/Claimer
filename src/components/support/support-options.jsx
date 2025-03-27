"use client"

import { useState } from "react"
import { Bot, Mail, Phone } from "lucide-react"

export default function SupportOptions() {
  const options = [
    {
      icon: <Bot className="w-10 h-10 text-[#00e5ff]" />,
      title: "Chat with AI Assistant",
      description: "Get instant responses to queries",
    },
    {
      icon: <Mail className="w-10 h-10 text-[#00e5ff]" />,
      title: "Contact Support",
      description: "Submit a support ticket",
    },
    {
      icon: <Phone className="w-10 h-10 text-[#00e5ff]" />,
      title: "Call Us",
      description: "View contact numbers for immediate assistance",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
      {options.map((option, index) => (
        <SupportCard key={index} option={option} />
      ))}
    </div>
  )
}

function SupportCard({ option }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 ${
        isHovered ? "transform scale-105 shadow-lg shadow-purple-900/20" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`mb-4 transform transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>
        {option.icon}
      </div>
      <h3 className="text-white font-medium text-lg mb-2">{option.title}</h3>
      <p className="text-gray-400 text-sm">{option.description}</p>
    </div>
  )
}

