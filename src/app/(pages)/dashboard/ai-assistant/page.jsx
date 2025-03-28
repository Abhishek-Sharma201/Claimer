"use client"

import { Loader } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import "./style.css"
import { UI } from "@/src/components/Disha/UI"
import { Experience } from "@/src/components/Disha/Experience"
import { ChatProvider } from "@/src/hooks/useChat"
function App() {
  return (
    <ChatProvider>
      <Loader />
      <Leva hidden />
      <UI />
      <Canvas
        className="three-canvas bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat"
        shadows
        camera={{ position: [0, 0, 1], fov: 30 }}
        style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
      >
        <Experience />
      </Canvas>
    </ChatProvider>
  )
}

export default App

