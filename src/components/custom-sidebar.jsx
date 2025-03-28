"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

// Updated navigation items for DigiClaim.ai
const navigationItems = [
  {
    name: "Dashboard",
    icon: "mdi:view-dashboard",
    color: "#6B46C1",
    link: "/dashboard",
  },
  {
    name: "Claim Submission",
    icon: "mdi:file-document-plus",
    color: "#6B46C1",
    link: "/dashboard/claim-submission",
  },
  {
    name: "Claim Status",
    icon: "mdi:clock-outline",
    color: "#6B46C1",
    link: "/dashboard/claim-status",
  },
  {
    name: "Claim History",
    icon: "mdi:history",
    color: "#6B46C1",
    link: "/dashboard/claim-history",
  },
  {
    name: "Blockchain Document",
    icon: "mdi:history",
    color: "#6B46C1",
    link: "/dashboard/blockchain-ai",
  },
  {
    name: "AI Assistant",
    icon: "mdi:robot-outline",
    color: "#6B46C1",
    link: "/dashboard/ai-assistant",
  },
  {
    name: "Repair Partners",
    icon: "mdi:tools",
    color: "#6B46C1",
    link: "/dashboard/repair-partners",
  },
  {
    name: "Support & FAQs",
    icon: "mdi:help-circle-outline",
    color: "#6B46C1",
    link: "/dashboard/support",
  },
];

export function EnhancedSidebar({ user, onExpandChange, setToggleFunction }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  // Function to check if a path is active
  const isPathActive = (path) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Initialize active items based on current path
  useEffect(() => {
    if (!pathname) return;

    // Find which navigation item matches the current path
    for (const item of navigationItems) {
      if (item.link && isPathActive(item.link)) {
        setActiveItem(item.name);
        return;
      }
    }
  }, [pathname]);

  const handleLogout = async () => {
    const response = await logout();
    if (response?.success) {
      toast.success("Logout successful!");
      router.push("/login");
    } else {
      toast.error(response?.message || "Logout failed");
    }
  };

  // Handle clicking on a menu item
  const handleItemClick = (item, event) => {
    if (!isExpanded) {
      setIsExpanded(true);
    }

    if (item.link) {
      router.push(item.link);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    onExpandChange(!isExpanded);
  };

  useEffect(() => {
    if (setToggleFunction) {
      setToggleFunction(toggleSidebar);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
        onExpandChange(false);
      } else {
        setIsExpanded(true);
        onExpandChange(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onExpandChange]);

  // Filter navigation items based on search query
  const filteredItems = searchQuery
    ? navigationItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : navigationItems;

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#111111] text-white transition-all duration-300 ease-in-out z-50 border-r border-[#2a2a2a]",
        isExpanded ? "w-64" : "w-16"
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
                {user?.name?.charAt(0) || "D"}
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
                <p className="text-sm font-medium text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-[#9ca3af]">
                  {user?.email || "user@example.com"}
                </p>
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
                            : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-white"
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
                            activeItem === item.name
                              ? "bg-gradient-to-br from-[#6B46C1] to-[#6B46C1]/70"
                              : ""
                          )}
                        >
                          <Icon
                            icon={item.icon}
                            className={cn(
                              "w-5 h-5 transition-transform",
                              activeItem === item.name ? "scale-110" : ""
                            )}
                            style={{
                              color:
                                activeItem === item.name
                                  ? "#00FFFF"
                                  : "#FFFFFF",
                            }}
                          />
                        </div>
                        {isExpanded && (
                          <span className="text-sm flex-1 font-medium">
                            {item.name}
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent
                      side="right"
                      className="bg-[#1a1a1a] text-white border border-[#2a2a2a]"
                    >
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
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
              {isExpanded && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
