"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Loader2, Upload } from "lucide-react"
import { MESHY_API_KEY } from "@/src/lib/config"

export default function MeshyImageTo3D() {
  const [imageUrl, setImageUrl] = useState("")
  const [file, setFile] = useState(null)
  const [enablePbr, setEnablePbr] = useState(true)
  const [shouldRemesh, setShouldRemesh] = useState(true)
  const [shouldTexture, setShouldTexture] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setImageUrl("")
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(",")[1]
        resolve(base64String)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!imageUrl && !file) {
      setError("Please provide an image URL or upload a file")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const requestBody = {
        enable_pbr: enablePbr,
        should_remesh: shouldRemesh,
        should_texture: shouldTexture,
      }

      // Handle file upload or URL
      if (file) {
        const base64Data = await convertToBase64(file)
        requestBody.image_url = `data:image/${file.type.split("/")[1]};base64,${base64Data}`
      } else {
        requestBody.image_url = imageUrl
      }

      const response = await fetch("https://api.meshy.ai/openapi/v1/image-to-3d", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MESHY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to convert image to 3D")
      }

      setResult(data)
    } catch (err) {
      setError(err.message || "An error occurred while processing your request")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImageUrl("")
    setFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Convert Image to 3D Model</CardTitle>
        <CardDescription>Use Meshy.ai API to convert your 2D images into 3D models</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Image URL</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Provide a publicly accessible URL to your image (.jpg, .jpeg, or .png)
              </p>
            </TabsContent>
            <TabsContent value="upload" className="space-y-2">
              <Label htmlFor="image-file">Upload Image</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">JPG, JPEG or PNG</p>
                  </div>
                  <input
                    id="image-file"
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && <p className="text-sm font-medium">Selected: {file.name}</p>}
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="enable-pbr" checked={enablePbr} onCheckedChange={setEnablePbr} />
                <Label htmlFor="enable-pbr">Enable PBR (Physically Based Rendering)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="should-remesh" checked={shouldRemesh} onCheckedChange={setShouldRemesh} />
                <Label htmlFor="should-remesh">Should Remesh</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="should-texture" checked={shouldTexture} onCheckedChange={setShouldTexture} />
                <Label htmlFor="should-texture">Should Texture</Label>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert to 3D"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>

        {error && <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">{error}</div>}

        {result && (
          <div className="mt-6 p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-2">Conversion Result</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
            {result.task_id && (
              <div className="mt-4">
                <p className="font-medium">Task ID: {result.task_id}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You can use this task ID to check the status of your conversion below.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

