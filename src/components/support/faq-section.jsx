"use client"

import { useState } from "react"
import { ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react"

export default function FaqSection() {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Cryptocurrency payments are also available in selected regions.",
    },
    {
      question: "How long does it take to process a refund?",
      answer:
        "Refunds are typically processed within 3-5 business days. However, it may take 5-10 business days for the amount to reflect in your account, depending on your bank.",
    },
  ]

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FaqItem key={index} faq={faq} />
        ))}
      </div>
    </div>
  )
}

function FaqItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState(null)

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
      <button className="w-full p-4 flex justify-between items-center text-left" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-medium text-white">{faq.question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-800">
          <p className="text-gray-300 mb-4">{faq.answer}</p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Was this helpful?</span>
            <button
              className={`p-1 rounded-full ${feedback === "yes" ? "bg-green-900/30 text-green-400" : "text-gray-500 hover:text-gray-300"}`}
              onClick={() => setFeedback("yes")}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded-full ${feedback === "no" ? "bg-red-900/30 text-red-400" : "text-gray-500 hover:text-gray-300"}`}
              onClick={() => setFeedback("no")}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

