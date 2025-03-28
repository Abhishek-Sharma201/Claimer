"use client";

import { Star } from 'lucide-react';

const insurancePlans = [
  {
    id: 1,
    logo: "/images/image 6.jpg",
    name: "HDFC Life Sanchay Plus",
    features: [
      "Comprehensive coverage",
      "Tax benefits",
      "Flexible payment options",
      "24/7 support"
    ],
    price: "1299",
    rating: 4
  },
  {
    id: 2,
    logo: "/images/image 8.jpg",
    name: "Bajaj Allianz Life Goal Assure",
    features: [
      "No claim bonus",
      "Cashless treatment",
      "Wide hospital network",
      "Quick settlement"
    ],
    price: "999",
    rating: 4
  },
  {
    id: 3,
    logo: "/images/image 9.jpg",
    name: "Axis Smart Wealth Plan",
    features: [
      "High sum assured",
      "Critical illness cover",
      "Low premium",
      "Global coverage"
    ],
    price: "1499",
    rating: 4
  },
  {
    id: 4,
    logo: "/images/image 10.jpg",
    name: "SBI Life Smart Elite",
    features: [
      "Guaranteed benefits",
      "Flexible premium payment",
      "Loyalty additions",
      "Tax-free maturity"
    ],
    price: "1399",
    rating: 5
  },
  {
    id: 5,
    logo: "/images/image 11.jpg",
    name: "ICICI Pru iProtect Smart",
    features: [
      "Terminal illness cover",
      "Accidental death benefit",
      "Affordable premium",
      "Multiple payout options"
    ],
    price: "1099",
    rating: 4
  },
  {
    id: 6,
    logo: "/images/260-2601857_step-lic-hand-logo-png.webp",
    name: "LIC Jeevan Amar",
    features: [
      "Whole life coverage",
      "Flexible policy term",
      "Premium waiver",
      "Death benefit options"
    ],
    price: "1599",
    rating: 5
  }
];

const InsuranceCard = ({ plan }) => (
  <div className="bg-zinc-900 rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
    <div className="h-12 mb-4">
      <img src={plan.logo} alt={plan.name} className="h-full object-contain invert" />
    </div>
    <h2 className="text-xl font-bold text-white mb-4">{plan.name}</h2>
    <ul className="space-y-2 mb-6">
      {plan.features.map((feature, index) => (
        <li key={index} className="text-gray-400 flex items-center">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
          {feature}
        </li>
      ))}
    </ul>
    <div className="flex items-baseline mb-4">
      <span className="text-3xl font-bold text-white">₹{plan.price}</span>
      <span className="text-gray-400 ml-2">/month</span>
    </div>
    <div className="flex items-center mb-6">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < plan.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'
          }`}
        />
      ))}
    </div>
    <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95">
      View Details
    </button>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Insurance Plan
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Compare our insurance plans and find the perfect coverage for your needs.
            All plans come with 24/7 support and flexible payment options.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insurancePlans.map(plan => (
            <InsuranceCard key={plan.id} plan={plan} />
          ))}
        </div>

        <footer className="mt-20 text-center text-gray-400">
          <p>© 2025 BimaMarg. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}