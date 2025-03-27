"use client"
import { FaFilter, FaStar } from "react-icons/fa"
import { motion } from "framer-motion"

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const handleServiceChange = (service) => {
    const updatedServices = {
      ...filters.services,
      [service]: !filters.services[service],
    }

    onFilterChange({
      ...filters,
      services: updatedServices,
    })
  }

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      minRating: rating,
    })
  }

  const handleCertifiedChange = () => {
    onFilterChange({
      ...filters,
      certifiedOnly: !filters.certifiedOnly,
    })
  }

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <FaFilter />
        <h2>Filters</h2>
      </div>

      <div className="filter-section">
        <h3>Location</h3>
        <input type="text" placeholder="City or Pin Code" className="filter-input" />
      </div>

      <div className="filter-section">
        <h3>Services</h3>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={filters.services.repairs} onChange={() => handleServiceChange("repairs")} />
            <span className="custom-checkbox"></span>
            Repairs
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.services.maintenance}
              onChange={() => handleServiceChange("maintenance")}
            />
            <span className="custom-checkbox"></span>
            Maintenance
          </label>

          <label className="checkbox-label">
            <input type="checkbox" checked={filters.services.denting} onChange={() => handleServiceChange("denting")} />
            <span className="custom-checkbox"></span>
            Denting
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.services.painting}
              onChange={() => handleServiceChange("painting")}
            />
            <span className="custom-checkbox"></span>
            Painting
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.services.electronics}
              onChange={() => handleServiceChange("electronics")}
            />
            <span className="custom-checkbox"></span>
            Electronics
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3>Minimum Rating</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span
              key={star}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRatingChange(star)}
              className={`star ${star <= filters.minRating ? "active" : ""}`}
            >
              <FaStar />
            </motion.span>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="checkbox-label certified-label">
          <input type="checkbox" checked={filters.certifiedOnly} onChange={handleCertifiedChange} />
          <span className="custom-checkbox"></span>
          Certified Partners Only
        </label>
      </div>

      <motion.button className="reset-button" onClick={onReset} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Reset Filters
      </motion.button>
    </aside>
  )
}

export default FilterSidebar

