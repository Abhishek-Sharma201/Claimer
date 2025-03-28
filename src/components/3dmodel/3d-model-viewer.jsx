"use client"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"

function Model({ url }) {
  const { scene } = useGLTF(url)

  return <primitive object={scene} scale={1} />
}

export default function ModelViewer({ modelUrl }) {
  if (!modelUrl) return null

  return (
    <div className="w-full h-[400px] border rounded-md overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Model url={modelUrl} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

