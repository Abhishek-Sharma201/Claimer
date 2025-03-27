"use client"
import { FaStar, FaMapMarkerAlt, FaPhone, FaDirections } from "react-icons/fa"
import { motion } from "framer-motion"

const ShopCard = ({ shop }) => {
  return (
    <motion.div
      className="shop-card"
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="shop-image">
        <img src={shop.image || `/placeholder.svg?height=80&width=80`} alt={shop.name} />
      </div>

      <div className="shop-info">
        <h3 className="shop-name">{shop.name}</h3>

        <div className="shop-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= Math.floor(shop.rating) ? "filled" : star <= shop.rating ? "half-filled" : ""}`}
            >
              <FaStar />
            </span>
          ))}
          <span className="rating-value">{shop.rating}</span>
        </div>

        <div className="shop-distance">
          <FaMapMarkerAlt />
          <span>{shop.distance} km</span>
        </div>

        <div className="shop-services">
          {shop.services.map((service) => (
            <span key={service} className="service-tag">
              {service}
            </span>
          ))}
        </div>

        <div className="shop-actions">
          <motion.button
            className="call-button"
            whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPhone />
            Call Now
          </motion.button>

          <motion.button
            className="directions-button"
            whileHover={{ scale: 1.05, backgroundColor: "#0d9488" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDirections />
            Directions
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ShopCard

