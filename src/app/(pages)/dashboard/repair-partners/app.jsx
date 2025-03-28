"use client"

import { useState } from "react"
// import Header from "@/src/components/repair-partners/Header"
import HeroSection from "@/src/components/repair-partners/HeroSection"
import FilterSidebar from "@/src/components/repair-partners/FilterSidebar"
import RepairShopList from "@/src/components/repair-partners/RepairShopList"
import Map from "@/src/components/repair-partners/Map"
import "./styles.css"

const App = () => {
  const [location, setLocation] = useState("")
  const [filters, setFilters] = useState({
    services: {
      repairs: false,
      maintenance: false,
      denting: false,
      painting: false,
      electronics: false,
    },
    minRating: 0,
    certifiedOnly: false,
  })

  const [shops, setShops] = useState([
    
    {
      id: 1,
      name: "AutoTech Solutions",
      image: "/images/FRAME.png",
      rating: 4.8,
      distance: 2.5,
      services: ["Repairs", "Maintenance", "Painting"],
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    {
      id: 2,
      name: "Elite Car Care",
      image: "/images/FRAME(1).png",
      rating: 4.6,
      distance: 3.2,
      services: ["Denting", "Painting", "Service"],
      coordinates: { lat: 30.2729, lng: -97.7444 },
    },
    {
      id: 3,
      name: "Pro Mechanics",
      image: "/images/FRAME(2).png",
      rating: 4.9,
      distance: 1.8,
      services: ["Repairs", "Electronics", "Towing"],
      coordinates: { lat: 30.2621, lng: -97.7565 },
    },
    {
      id: 4,
      name: "Master Auto Works",
      image: "/images/FRAME(3).png",
      rating: 4.7,
      distance: 4.1,
      services: ["Full Service", "Diagnostics", "Repairs"],
      coordinates: { lat: 30.2669, lng: -97.7428 },
    },
  ])

  const handleSearch = (searchLocation) => {
    setLocation(searchLocation)
    // In a real app, you would fetch shops based on the location
    console.log(`Searching for shops near ${searchLocation}`)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    // In a real app, you would filter shops based on the criteria
  }

  const resetFilters = () => {
    setFilters({
      services: {
        repairs: false,
        maintenance: false,
        denting: false,
        painting: false,
        electronics: false,
      },
      minRating: 0,
      certifiedOnly: false,
    })
  }

  return (
    <div className="app">
     
      <main className="main-content">
        <HeroSection onSearch={handleSearch} />
        <div className="content-container">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />
          <RepairShopList shops={shops} />
          <Map shops={shops} />
        </div>
      </main>
    </div>
  )
}

export default App

