"use client";
// components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // For animations
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaCheck,
  FaTimes,
} from "react-icons/fa"; // Icons
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import { apiURL } from "@/src/constants";
import Image from "next/image";

const AdminDashboard = () => {
  // const [claims, setClaims] = useState([
  //   { id: 'CLM-001', customer: 'John Doe', type: 'Health', amount: '$1,200', status: 'PENDING' },
  //   { id: 'CLM-002', customer: 'Jane Smith', type: 'Auto', amount: '$3,500', status: 'REVIEW' },
  //   { id: 'CLM-003', customer: 'Mike Johnson', type: 'Property', amount: '$5,800', status: 'PENDING' },
  // ]);

  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const fetchClaimHistory = async () => {
    try {
      const response = await fetch(`${apiURL}/api/claims/get/${user._id}`, {
        method: "GET",
      });
      const data = await response.json();
      setClaims(data.claims);
      setRecentUsers(data.claims);
      console.log("Data:", data);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchClaimHistory();
    }
  }, [user]);

  // const recentUsers = [
  //   { name: "Sarah Wilson", email: "sarah.w@example.com" },
  //   { name: "Alex Thompson", email: "alex.t@example.com" },
  //   { name: "Rachel Brown", email: "rachel.b@example.com" },
  // ];

  const fraudAlerts = [
    {
      title: "Multiple Claims",
      desc: "User submitted 3 claims in 24 hours",
      time: "2 hours ago",
    },
    {
      title: "Suspicious Activity",
      desc: "Unusual claim pattern detected",
      time: "5 hours ago",
    },
    {
      title: "Document Verification",
      desc: "Potential forged documents",
      time: "1 day ago",
    },
  ];

  const policyUpdates = [
    {
      title: "Health Insurance Update",
      status: "APPROVED",
      date: "Jan 15, 2024",
    },
    { title: "Auto Coverage Changes", status: "PENDING", date: "Jan 14, 2024" },
    {
      title: "Property Policy Revision",
      status: "In Review",
      date: "Jan 13, 2024",
    },
  ];

  const notifications = [
    {
      title: "System Update",
      desc: "New features available",
      time: "1 hour ago",
    },
    {
      title: "Team Meeting",
      desc: "Review weekly progress",
      time: "3 hours ago",
    },
    {
      title: "Performance Report",
      desc: "Monthly stats ready",
      time: "1 day ago",
    },
  ];

  const handleAction = (id, action) => {
    console.log(`Action ${action} on claim ${id}`);
    // Add logic for approving/rejecting claims here
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold"> <span className='text-blue-400'> Admin</span> Dashboard</h1>
          <p className="text-gray-400">Welcome back, Admin</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#181818] text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          {/* <div className="relative">
            <FaBell className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">
              2
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-2xl" />
            <span>Admin User</span>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims Overview */}
        <div className="col-span-2 bg-[#181818] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Claims Overview</h2>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300">
              View All Claims
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400">
                  <th className="py-2">Claim ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <motion.tr
                    key={claim?._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="border-t border-gray-700 hover:bg-gray-700 transition duration-200"
                  >
                    <td className="py-3">{claim?._id}</td>
                    <td>{claim?.userId?.name}</td>
                    <td>{claim?.vehicleType}</td>
                    <td>{claim?.coverageAmount}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          claim?.claimStatus === "Pending"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {claim?.claimStatus}
                      </span>
                    </td>
                    <td className="flex space-x-2">
                      <button
                        onClick={() => handleAction(claim?._id, "approve")}
                        className="text-green-500 hover:text-green-400 transition duration-200"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleAction(claim?._id, "reject")}
                        className="text-red-500 hover:text-red-400 transition duration-200"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fraud Alerts */}
        <div className="bg-[#181818] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Fraud Alerts</h2>
            <span className="bg-red-500 text-xs rounded-full px-2 py-1">
              4 New
            </span>
          </div>
          <div className="space-y-4">
            {fraudAlerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <h3 className="font-semibold">{alert.title}</h3>
                </div>
                <p className="text-gray-400">{alert.desc}</p>
                <p className="text-gray-500 text-sm">{alert.time}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-[#181818] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Users</h2>
            <button className="text-purple-500 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded transition duration-200"
              >
                <Image
                  src={user?.imageUrls[0] || ""}
                  className="w-10 h-10 rounded-full"
                  alt="pic"
                />
                <div>
                  <p className="font-semibold">{user?.userId?.name}</p>
                  <p className="text-gray-400 text-sm">{user?.userId?.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Policy Updates */}
        <div className="bg-[#181818] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Policy Updates</h2>
            <button className="text-purple-500 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {policyUpdates.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                <h3 className="font-semibold">{policy.title}</h3>
                <p
                  className={`text-sm ${
                    policy.status === "APPROVED"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {policy.status}
                </p>
                <p className="text-gray-400 text-sm">{policy.date}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#181818] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <span className="bg-red-500 text-xs rounded-full px-2 py-1">
              5 New
            </span>
          </div>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                <div className="flex items-center space-x-2">
                  <FaBell className="text-gray-400" />
                  <h3 className="font-semibold">{notification.title}</h3>
                </div>
                <p className="text-gray-400">{notification.desc}</p>
                <p className="text-gray-500 text-sm">{notification.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
