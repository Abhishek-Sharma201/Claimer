"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { MESHY_API_KEY } from "@/src/lib/config"

export default function MeshyTaskStatus() {
  const [taskId, setTaskId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const checkTaskStatus = async (e) => {
    e.preventDefault()

    if (!taskId) {
      setError("Task ID is required")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${MESHY_API_KEY}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to retrieve task status")
      }

      setResult(data)
    } catch (err) {
      setError(err.message || "An error occurred while checking task status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Check 3D Conversion Status</CardTitle>
        <CardDescription>Check the status of your Image to 3D conversion task</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={checkTaskStatus} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-id">Task ID</Label>
            <Input
              id="task-id"
              type="text"
              placeholder="Enter the task ID"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Status"
            )}
          </Button>
        </form>

        {error && <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">{error}</div>}

        {result && (
          <div className="mt-6 p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-2">Task Status</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>

            {result.status === "completed" && result.output && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Download Links:</h4>
                {result.output.glb && (
                  <div className="flex items-center space-x-2">
                    <span>GLB:</span>
                    <a
                      href={result.output.glb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Download GLB
                    </a>
                  </div>
                )}
                {result.output.gltf && (
                  <div className="flex items-center space-x-2">
                    <span>GLTF:</span>
                    <a
                      href={result.output.gltf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Download GLTF
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

