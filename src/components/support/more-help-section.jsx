"use client"

import { useState } from "react"
import { MessageSquare, Mail, Phone } from "lucide-react"

export default function MoreHelpSection() {
  const options = [
    {
      icon: <MessageSquare className="w-10 h-10 text-[#00e5ff]" />,
      title: "Live Chat",
      description: "Chat with our support team",
    },
    {
      icon: <Mail className="w-10 h-10 text-[#00e5ff]" />,
      title: "Email Support",
      description: "Get help via email",
    },
    {
      icon: <Phone className="w-10 h-10 text-[#00e5ff]" />,
      title: "Request Callback",
      description: "We'll call you back",
    },
  ]

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Need More Help?</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <HelpCard key={index} option={option} />
        ))}
      </div>
    </div>
  )
}

function HelpCard({ option }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`border border-[#333] rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 ${
        isHovered ? "border-[#00e5ff]/50 bg-[#00e5ff]/5" : "bg-transparent"
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

