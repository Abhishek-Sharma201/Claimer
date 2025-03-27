import React from 'react';

const Filter = () => {
  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 animate-fadeIn">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search for policies..."
          className="w-full bg-black text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        />
        <span className="absolute right-3 top-3 text-gray-400">🔍</span>
      </div>
      <select className="bg-black text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300">
        <option>Insurance Type</option>
        <option>Auto</option>
        <option>Home</option>
        <option>Health</option>
      </select>
      <select className="bg-black text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300">
        <option>Price Range</option>
        <option>₹100 - ₹300</option>
        <option>₹300 - ₹500</option>
        <option>₹500+</option>
      </select>
      <select className="bg-black text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300">
        <option>Coverage Amount</option>
        <option>₹10,000</option>
        <option>₹50,000</option>
        <option>₹100,000</option>
      </select>
      <select className="bg-black text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300">
        <option>Sort By</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Rating</option>
      </select>
    </div>
  );
};

export default Filter;