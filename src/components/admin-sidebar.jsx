"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, ChevronLeft, ChevronDown, Search } from "lucide-react"
import { toast } from "react-hot-toast"

// Admin navigation items for DigiClaim.ai
const navigationItems = [
  {
    name: "Dashboard",
    icon: "mdi:home",
    color: "#6B46C1",
    link: "/admin/dashboard",
  },
  {
    name: "Claims Management",
    icon: "mdi:file-document-multiple",
    color: "#6B46C1",
    link: "/admin/claims",
  },
  {
    name: "Fraud Detection",
    icon: "mdi:shield-alert",
    color: "#6B46C1",
    link: "/admin/fraud-detection",
  },
  {
    name: "User Management",
    icon: "mdi:account-group",
    color: "#6B46C1",
    link: "/admin/users",
  },
  {
    name: "Policy Maker",
    icon: "mdi:file-document-edit",
    color: "#6B46C1",
    link: "/admin/policy-maker",
  },
  {
    name: "Settings",
    icon: "mdi:cog",
    color: "#6B46C1",
    link: "/admin/settings",
  },
]

export function AdminSidebar({ user, onExpandChange, setToggleFunction }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeItem, setActiveItem] = useState(null)
  const [activeSubItem, setActiveSubItem] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useState(null)

  // Function to check if a path is active
  const isPathActive = (path) => {
    if (!pathname) return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Initialize active items based on current path
  useEffect(() => {
    if (!pathname) return

    // Find which navigation item matches the current path
    for (const item of navigationItems) {
      if (item.link && isPathActive(item.link)) {
        setActiveItem(item.name)

        if (item.children) {
          for (const child of item.children) {
            if (child.link && isPathActive(child.link)) {
              setActiveSubItem(child.name)
              return
            }
          }
        }
        return
      }
    }
  }, [pathname])

  const handleLogout = async () => {
    const response = await logout()
    if (response?.success) {
      toast.success("Logout successful!")
      router.push("/login")
    } else {
      toast.error(response?.message || "Logout failed")
    }
  }

  // Handle clicking on a parent item
  const handleItemClick = (item, event) => {
    if (!isExpanded) {
      setIsExpanded(true)
    }

    // If the item has children, toggle the dropdown
    if (item.children) {
      // If the dropdown arrow is clicked, only toggle the dropdown
      if (event.target.closest(".dropdown-arrow")) {
        event.preventDefault()
        setActiveItem(activeItem === item.name ? null : item.name)
        return
      }

      // If the item itself is clicked (not the arrow), navigate to its link
      if (item.link) {
        router.push(item.link)
      }

      // Always open the dropdown when clicking on the item
      setActiveItem(item.name)
    } else if (item.link) {
      // If the item has no children, just navigate to its link
      router.push(item.link)
    }
  }

  // Handle clicking on a child item
  const handleSubItemClick = (subItem, event) => {
    event.stopPropagation()

    if (subItem.link) {
      router.push(subItem.link)
    }
  }

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev)
    onExpandChange(!isExpanded)
  }

  useEffect(() => {
    if (setToggleFunction) {
      setToggleFunction(toggleSidebar)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false)
        onExpandChange(false)
      } else {
        setIsExpanded(true)
        onExpandChange(true)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [onExpandChange])

  // Filter navigation items based on search query
  const filteredItems = searchQuery
    ? navigationItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.children &&
            item.children.some((child) => child.name.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
    : navigationItems

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#111111] text-white transition-all duration-300 ease-in-out z-50 border-r border-[#2a2a2a]",
        isExpanded ? "w-64" : "w-16",
      )}
      animate={{
        width: isExpanded ? 256 : 64,
        boxShadow: "0 0 20px rgba(107, 70, 193, 0.15)",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar
              onClick={toggleSidebar}
              className="w-10 h-10 border-2 border-[#6B46C1] cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#6B46C1] to-[#00FFFF] text-white">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="ml-3"
              >
                <p className="text-sm font-medium text-white">{user?.name || "Admin"}</p>
                <p className="text-xs text-[#9ca3af]">Administrator</p>
              </motion.div>
            )}
          </div>
          {isExpanded && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white hover:bg-[#2a2a2a] rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={18} />
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-4 rounded-lg bg-[#1a1a1a] text-white border border-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-[#6B46C1] focus:border-[#6B46C1] transition-all"
              />
            </div>
          </div>
        )}

        <Separator className="bg-[#2a2a2a] my-2" />

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="mt-2 space-y-1 p-2">
            {filteredItems.map((item) => (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <motion.div
                        className={cn(
                          "flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200",
                          activeItem === item.name
                            ? "bg-[#1a1a1a] text-white border-l-2 border-l-[#6B46C1]"
                            : hoveredItem === item.name
                              ? "bg-[#1a1a1a] text-white"
                              : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-white",
                        )}
                        onClick={(e) => handleItemClick(item, e)}
                        onHoverStart={() => setHoveredItem(item.name)}
                        onHoverEnd={() => setHoveredItem(null)}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg mr-3",
                            activeItem === item.name ? "bg-gradient-to-br from-[#6B46C1] to-[#6B46C1]/70" : "",
                          )}
                        >
                          <Icon
                            icon={item.icon}
                            className={cn("w-5 h-5 transition-transform", activeItem === item.name ? "scale-110" : "")}
                            style={{
                              color: activeItem === item.name ? "#00FFFF" : "#FFFFFF",
                            }}
                          />
                        </div>
                        {isExpanded && <span className="text-sm flex-1 font-medium">{item.name}</span>}
                        {isExpanded && item.children && (
                          <div
                            className="dropdown-arrow p-1 rounded-full hover:bg-[#2a2a2a] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveItem(activeItem === item.name ? null : item.name)
                            }}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                activeItem === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent side="right" className="bg-[#1a1a1a] text-white border border-[#2a2a2a]">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>

                {isExpanded && activeItem === item.name && item.children && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 mt-1 space-y-1 pl-4 border-l border-[#2a2a2a]"
                    >
                      {item.children.map((child) => (
                        <div key={child.name}>
                          <Link href={child.link}>
                            <motion.div
                              className={cn(
                                "flex items-center p-2 rounded-lg transition-all duration-200",
                                isPathActive(child.link)
                                  ? "bg-[#1a1a1a] text-white"
                                  : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-white",
                              )}
                              whileHover={{ scale: 1.02, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => handleSubItemClick(child, e)}
                            >
                              <div className="flex items-center justify-center w-6 h-6 rounded-md mr-3">
                                <Icon
                                  icon={child.icon}
                                  className="w-4 h-4"
                                  style={{
                                    color: isPathActive(child.link) ? "#00FFFF" : "#FFFFFF",
                                  }}
                                />
                              </div>
                              <span className="text-sm">{child.name}</span>
                            </motion.div>
                          </Link>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </TooltipProvider>
            ))}
          </div>
        </div>
        <Separator className="my-2 bg-[#2a2a2a]" />
        <div className="p-4 mb-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="overflow-hidden rounded-lg bg-gradient-to-r from-[#1a1a1a] to-[#111111] hover:from-[#111111] hover:to-[#1a1a1a]"
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-[#ff4e4e] hover:text-[#ff6b6b] hover:bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isExpanded && <span className="text-sm font-medium">Logout</span>}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

