"use client"

import { useState } from "react"
import { FaMapMarkerAlt } from "react-icons/fa"
import { motion } from "framer-motion"

const HeroSection = ({ onSearch }) => {
  const [location, setLocation] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(location)
  }

  return (
    <section className="hero-section">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="hero-title"> <span className="text-blue-400"> Find </span> Trusted <span className="text-green-400"> Repair </span> Partners with <span className="text-purple-400"> Ease </span></h1>
        <p className="hero-subtitle">Locate the best certified repair centers for your vehicle</p>

        <form onSubmit={handleSubmit} className="location-search">
          <div className="input-container">
            <FaMapMarkerAlt className="location-icon" />
            <input
              type="text"
              placeholder="Enter your location or pin code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-input"
            />
          </div>
          <motion.button
            type="submit"
            className="search-button"
            whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </form>
      </motion.div>
    </section>
  )
}

export default HeroSection

