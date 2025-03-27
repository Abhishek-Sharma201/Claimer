import React from 'react';

const Cards = () => {
  const features = [
    {
      icon: "⚙️",
      title: "AI-Powered Claims Processing",
      description: "Get your claims approved faster with smart AI automation.",
      color: "bg-indigo-500",
      delay: "animate-fade-in-delay-1"
    },
    {
      icon: "🛡️",
      title: "Advanced Fraud Detection",
      description: "AI scans for suspicious claims, keeping your policies secure.",
      color: "bg-purple-500",
      delay: "animate-fade-in-delay-2"
    },
    {
      icon: "📊",
      title: "Smart User Dashboard",
      description: "Track claims, manage policies, and access all documents in one place.",
      color: "bg-blue-500",
      delay: "animate-fade-in-delay-3"
    },
    {
      icon: "💬",
      title: "24/7 AI Assistant & Support",
      description: "Get instant help anytime with our AI-powered chatbot.",
      color: "bg-pink-500",
      delay: "animate-fade-in-delay-4"
    },
    {
      icon: "👥",
      title: "Admin Control & User Management",
      description: "Manage users, approve claims, and oversee policies easily.",
      color: "bg-cyan-500",
      delay: "animate-fade-in-delay-5"
    },
    {
      icon: "🔗",
      title: "Secure Repair & Partner Network",
      description: "Find trusted repair partners and manage claims efficiently.",
      color: "bg-orange-500",
      delay: "animate-fade-in-delay-6"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 min-h-screen bg-black text-white">
      <h1 className="text-center text-5xl mb-4 font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent animate-fade-in">
        Why Choose Us
      </h1>
      <p className="text-center text-slate-400 text-lg mb-16 animate-fade-in-delay-1">
        Experience the future of insurance with our AI-powered platform
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`bg-white/[0.03] rounded-3xl p-8 transition-all duration-300 border border-white/10 relative overflow-hidden hover:-translate-y-2 hover:border-opacity-50 group ${feature.delay}`}
          >
            <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 text-2xl`}>
              <span>{feature.icon}</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">
              {feature.title}
            </h3>
            <p className="text-slate-400 leading-relaxed">
              {feature.description}
            </p>
            <div className={`absolute inset-0 ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
          </div>
        ))}
      </div>

      <footer className="mt-24 pt-8 border-t border-white/10 text-center animate-fade-in-delay-6">
        <p className="text-slate-400">© 2025 DigiClaim.ai All rights reserved.</p>
        <div className="my-6 space-x-8">
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">GitHub</a>
        </div>
        <div className="space-x-8">
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Cards;