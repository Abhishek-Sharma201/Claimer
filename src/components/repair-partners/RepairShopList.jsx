"use client"
import ShopCard from "./ShopCard"
import { motion } from "framer-motion"

const RepairShopList = ({ shops }) => {
  return (
    <div className="shop-list">
      {shops.map((shop, index) => (
        <motion.div
          key={shop.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <ShopCard shop={shop} />
        </motion.div>
      ))}
    </div>
  )
}

export default RepairShopList

