"use client"
import { FaBell, FaSearch } from "react-icons/fa"
import { motion } from "framer-motion"

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <motion.div className="logo" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <span className="logo-icon">🚗</span>
          <h1>BimaMarg</h1>
        </motion.div>
      </div>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search claims, documents, or get help..." className="search-input" />
      </div>

      <div className="user-container">
        <motion.div className="notification-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FaBell />
          <span className="notification-badge">1</span>
        </motion.div>

        <motion.div className="user-profile" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <img src="/placeholder.svg?height=40&width=40" alt="User profile" className="user-avatar" />
          <div className="user-info">
            <p className="user-name">Ritik Ray</p>
            <p className="user-email">ritikray@gmail.com</p>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

export default Header

