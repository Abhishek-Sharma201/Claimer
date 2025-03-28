// pages/settings.jsx
'use client'

import { useState } from 'react';

export default function Settings() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [theme, setTheme] = useState('dark');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-gray-400 mb-8">Manage your account settings and preferences</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-[#181818] p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-600 rounded-full mr-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className="text-gray-400">Full Name</p>
              <p className="text-white">John Doe</p>
            </div>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-white">john.doe@example.com</p>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-[#181818] p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white">Two-Factor Authentication</p>
                <p className="text-gray-400">Add an extra layer of security</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={() => setTwoFactor(!twoFactor)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-800 rounded-full peer peer-checked:bg-purple-600 transition-all duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
          <div>
            <p className="text-white">Active Sessions</p>
            <div className="mt-2 p-4 bg-gray-800 rounded-lg">
              <p className="text-white">MacBook Pro</p>
              <p className="text-gray-400">San Francisco, US • Current session</p>
            </div>
            <div className="mt-2 p-4 bg-gray-800 rounded-lg">
              <p className="text-white">iPhone 12</p>
              <p className="text-gray-400">San Francisco, US • 2 hours ago</p>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-[#181818] p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <div>
                  <p className="text-white">Email Notifications</p>
                  <p className="text-gray-400">Receive updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-purple-600 transition-all duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">🔔</span>
                <div>
                  <p className="text-white">Push Notifications</p>
                  <p className="text-gray-400">Get notified in your browser</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-purple-600 transition-all duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">🌐</span>
                <div>
                  <p className="text-white">SMS Notifications</p>
                  <p className="text-gray-400">Get updates on your phone</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={() => setSmsNotifications(!smsNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-purple-600 transition-all duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-[#181818] p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <div className="mb-4">
            <p className="text-white mb-2">Theme</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                  theme === 'dark' ? 'border-purple-600 bg-gray-700' : 'border-gray-600'
                } hover:bg-gray-600`}
              >
                <span className="mr-2">🌙</span> Dark Mode
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                  theme === 'light' ? 'border-purple-600 bg-gray-700' : 'border-gray-600'
                } hover:bg-gray-600`}
              >
                <span className="mr-2">☀️</span> Light Mode
              </button>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-white mb-2">Language</p>
            <select className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <p className="text-white mb-2">Timezone</p>
            <select className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300">
              <option>Pacific Time (PT)</option>
              <option>Eastern Time (ET)</option>
              <option>Central Time (CT)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}