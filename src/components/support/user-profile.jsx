"use client"

import { useState } from "react"
import Image from "next/image"
import { Bell } from "lucide-react"

export default function UserProfile({ name, email, avatar }) {
  const [showNotification, setShowNotification] = useState(false)

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <button
          className="relative text-gray-400 hover:text-white transition-colors"
          onClick={() => setShowNotification(!showNotification)}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
        </button>

        {showNotification && (
          <div className="absolute right-0 mt-2 w-64 bg-[#222] border border-gray-700 rounded-md shadow-lg p-3 z-10">
            <p className="text-sm text-gray-300">No new notifications</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-gray-400">{email}</p>
        </div>
      </div>
    </div>
  )
}

