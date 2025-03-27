"use client"

import { useState } from "react"
import { Search } from "lucide-react"

export default function SearchBar({ placeholder }) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div
      className={`relative flex items-center rounded-md transition-all duration-300 ${
        isFocused ? "bg-[#222] border-[#444] shadow-lg" : "bg-[#1a1a1a] border-[#333]"
      } border px-3 py-2`}
    >
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-white w-full px-2"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}

