"use client"

import { useEffect, useRef } from "react"

const Map = ({ shops }) => {
  const mapRef = useRef(null)

  useEffect(() => {
    // In a real application, you would use a mapping library like Google Maps or Mapbox
    // This is a placeholder for demonstration purposes
    const canvas = mapRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    // Draw a simple map background
    ctx.fillStyle = "#e5e7eb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw some map features
    ctx.fillStyle = "#d1d5db"
    ctx.fillRect(50, 30, 200, 10)
    ctx.fillRect(100, 70, 150, 15)
    ctx.fillRect(30, 120, 100, 12)
    ctx.fillRect(180, 150, 120, 10)

    // Draw shop markers
    shops.forEach((shop, index) => {
      const x = 50 + index * 70
      const y = 80 + index * 50

      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.fillStyle = "#7c3aed"
      ctx.fill()

      ctx.font = "12px Arial"
      ctx.fillStyle = "#1f2937"
      ctx.fillText(shop.name, x - 30, y + 20)
    })
  }, [shops])

  return (
    <div className="map-container">
      <canvas ref={mapRef} width="400" height="600" className="map-canvas"></canvas>
    </div>
  )
}

export default Map

