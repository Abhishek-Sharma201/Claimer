'use client'

import React, { useState } from 'react';
import Card from '@/src/components/insurance/card';
import Filter from '@/src/components/insurance/filter';
// import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const plansPerPage = 6;

  const insurancePlans = [
    {
      title: 'Auto Premium',
      rating: 5,
      features: ['24/7 Roadside Assistance', 'Zero Depreciation Cover', 'Personal Accident Cover'],
      price: 2990,
    },
    {
      title: 'Home Shield Plus',
      rating: 4,
      features: ['Natural Disaster Coverage', 'Theft Protection', 'Property Damage'],
      price: 1990,
    },
    {
      title: 'Health Elite',
      rating: 4,
      features: ['Comprehensive Coverage', 'Global Treatment', 'Family Floater'],
      price: 3390,
    },
    {
      title: 'Travel Secure',
      rating: 5,
      features: ['Global Coverage', 'Emergency Medical', 'Trip Cancellation'],
      price: 1490,
    },
    {
      title: 'Life Assure',
      rating: 5,
      features: ['Term Life Coverage', 'Critical Illness', 'Investment Benefits'],
      price: 4990,
    },
    {
      title: 'Family Health Plus',
      rating: 4,
      features: ['Family Coverage', 'Maternity Benefits', 'Annual Check-ups'],
      price: 5990,
    },
  ];

  // Pagination logic
  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = insurancePlans.slice(indexOfFirstPlan, indexOfLastPlan);

  const totalPages = Math.ceil(insurancePlans.length / plansPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2 animate-fadeIn">
        Find the Best Insurance Plan for You
      </h1>
      <p className="text-gray-400 mb-6 animate-fadeIn">
        Compare policies, customize your plan, and get insured instantly
      </p>

      {/* Filter Component */}
      <Filter />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {currentPlans.map((plan, index) => (
          <Card key={index} plan={plan} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center mt-8 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-400 hover:text-purple-500 transition-colors duration-300"
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 rounded-full ${
              currentPage === i + 1 ? 'bg-purple-600' : 'bg-gray-800'
            } hover:bg-purple-500 transition-colors duration-300`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-400 hover:text-purple-500 transition-colors duration-300"
        >
          &gt;
        </button>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between w-full max-w-4xl mt-12">
        <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-500 transition-colors duration-300">
          <span className="text-2xl">🤖</span>
          <span>Need Help? Our AI Assistant Can Guide You!</span>
        </button>
        <button className="bg-purple-600 px-6 py-3 rounded-full hover:bg-purple-700 transition-colors duration-300">
          Secure Your Future Today
        </button>
      </div>
    </div>
  );
};

export default App;