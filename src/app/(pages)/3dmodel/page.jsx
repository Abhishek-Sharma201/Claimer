"use client"
import MeshyImageTo3D from "@/src/components/3dmodel/meshy-image-to-3d"
import MeshyTaskStatus from "@/src/components/3dmodel/meshy-task-status"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Meshy Image to 3D Converter</h1>
        <div className="space-y-8">
          <MeshyImageTo3D />
          <MeshyTaskStatus />
        </div>
      </div>
    </main>
  )
}

