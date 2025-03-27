import { Inter } from "next/font/google"
import "@/src/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-[#0a0a0a]">{children}</div>
      </body>
    </html>
  )
}

