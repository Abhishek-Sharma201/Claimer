import React from "react";
import Image from "next/image";

const Card = ({ plan }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fadeIn">
      <div className="flex items-center space-x-2">
        <span className="text-purple-500 text-2xl">
          <Image
            src="/abc.webp"
            alt="Car Image"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </span>
        <h2 className="text-xl font-semibold">{plan.title}</h2>
      </div>
      <div className="flex items-center mt-2">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${
              i < plan.rating ? "text-yellow-400" : "text-gray-600"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <ul className="mt-4 space-y-2 text-gray-300">
        {plan.features.map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
      <div className="mt-6 flex justify-between items-center">
        <span className="text-2xl pr-3 font-bold">${plan.price}/month</span>
        <button className="bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-700 transition-colors duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;
