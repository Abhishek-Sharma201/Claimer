"use client"

import { useEffect, useRef } from "react"

const Map = ({ shops }) => {
  const mapRef = useRef(null)

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!window.google) {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAY6uMSweEcpvuAWafg6FfKQzmcKW0B5lc&libraries=places`
        script.async = true
        script.defer = true
        document.head.appendChild(script)

        script.onload = () => {
          initMap()
        }
      } else {
        initMap()
      }
    }

    const initMap = () => {
      if (!mapRef.current) return

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: shops[0]?.lat || 19.076, lng: shops[0]?.lng || 72.877 },
        zoom: 12,
      })

      shops.forEach((shop) => {
        new google.maps.Marker({
          position: { lat: shop.lat, lng: shop.lng },
          map,
          title: shop.name,
        })
      })
    }

    loadGoogleMaps()
  }, [shops])

  return <div ref={mapRef} className="w-[400px] h-[600px]" />
}

export default Map
