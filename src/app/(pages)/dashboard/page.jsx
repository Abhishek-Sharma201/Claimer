// pages/index.jsx
'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion'; // For animations

// Install framer-motion if not already installed: npm install framer-motion

export default function Home() {
  const [claims] = useState([
    { id: 'CLM-2024-001', type: 'Auto Insurance', status: 'Processing', amount: '₹32,500', date: 'Jan 15, 2024' },
    { id: 'CLM-2024-002', type: 'Health Insurance', status: 'Approved', amount: '₹21,800', date: 'Jan 12, 2024' },
    { id: 'CLM-2024-003', type: 'Home Insurance', status: 'Rejected', amount: '₹55,000', date: 'Jan 10, 2024' },
  ]);

  const [documents] = useState([
    { name: 'Policy Document', size: '2.5 MB' },
    { name: 'Claim Report', size: '1.8 MB' },
    { name: 'Medical Records', size: '3.2 MB' },
    { name: 'Vehicle Report', size: '1.5 MB' },
    { name: 'Insurance Card', size: '0.5 MB' },
    { name: 'Receipts', size: '2.1 MB' },
  ]);

  const [notifications] = useState([
    { message: 'Your claim CLM-2024-001 has been approved', time: '2 hours ago' },
    { message: 'Medical records have been verified', time: '5 hours ago' },
    { message: 'Your next premium payment is due soon', time: '1 day ago' },
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Search claims, documents, or get help..."
            className="w-full p-3 rounded-lg bg-[#181818] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
          <div className="flex items-center space-x-2">
            {/* <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
            <div>
              <p className="text-sm">Ritik Ray</p>
              <p className="text-xs text-gray-400">ritikray@gmail.com</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2">
          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '➕', title: 'New Claim', desc: 'Start a new claim process' },
                { icon: '⏳', title: 'Track Claim', desc: 'Check existing claim status' },
                { icon: '🔧', title: 'Find Repair', desc: 'Locate certified partners' },
                { icon: '🎧', title: 'Contact Support', desc: 'Get help with your claim' },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <h3 className="text-md font-semibold">{action.title}</h3>
                  <p className="text-sm text-gray-400">{action.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Claims */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Recent Claims</h2>
            <div className="space-y-4">
              {claims.map((claim) => (
                <motion.div
                  key={claim.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      {claim.type.includes('Auto') ? '🚗' : claim.type.includes('Health') ? '🏥' : '🏠'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{claim.id}</p>
                      <p className="text-xs text-gray-400">{claim.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{claim.amount}</p>
                    <p className="text-xs text-gray-400">{claim.date}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        claim.status === 'Approved'
                          ? 'bg-green-500'
                          : claim.status === 'Rejected'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Document Vault */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Document Vault</h2>
            <div className="grid grid-cols-3 gap-4">
              {documents.map((doc, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="text-2xl mb-2">📄</div>
                  <p className="text-sm font-semibold">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.size}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div>
          {/* AI Insights */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 p-4 rounded-lg mb-4"
            >
              <div className="flex items-center space-x-2 text-red-500">
                <span>⚠️</span>
                <p className="text-sm font-semibold">Fraud Alert</p>
              </div>
              <p className="text-xs text-gray-400">Unusual pattern detected in recent claim</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex items-center space-x-2 text-blue-500">
                <span>📈</span>
                <p className="text-sm font-semibold">Claim Prediction</p>
              </div>
              <p className="text-xs text-gray-400">Your policy renewal is due in 15 days</p>
            </motion.div>
          </div>

          {/* Recent Notifications */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 p-4 rounded-lg"
                >
                  <p className="text-sm font-semibold">{notif.message}</p>
                  <p className="text-xs text-gray-400">{notif.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}