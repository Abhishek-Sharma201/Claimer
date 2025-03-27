import React from "react";

export function Button({ children, onClick, className }) {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 rounded-3xl text-white hover:bg-blue-700 transition ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
