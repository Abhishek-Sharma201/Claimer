"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Car, FileText, Check, X, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function CarVerification({ userData, extractedData, onVerificationComplete }) {
  const [carImage, setCarImage] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [processingStage, setProcessingStage] = useState(0)
  const [processingProgress, setProcessingProgress] = useState(0)

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCarImage(file)
      setError(null)
      setVerificationResult(null)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!carImage) {
      setError("Please select a car image to upload")
      return
    }

    setIsVerifying(true)
    setError(null)
    setProcessingStage(1)
    setProcessingProgress(10)

    try {
      // Simulate processing stages with progress
      await simulateProcessingStages()

      // Create form data to send the file
      const formData = new FormData()
      formData.append("carImage", carImage)

      // Send the file to the API for processing
      const response = await fetch("/api/verify-plate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      const data = await response.json()

      // Get the extracted plate number from the API response
      // The Plate Recognizer API returns results in a different format
      const extractedPlate = data.results && data.results.length > 0 ? data.results[0].plate : null
      const confidence = data.results && data.results.length > 0 ? data.results[0].score : 0

      // Get the expected plate number from the document extraction
      const expectedPlate = extractedData?.numberPlate || ""

      // Compare the plates
      const isMatch = comparePlates(extractedPlate, expectedPlate)

      // Set verification result
      const result = {
        extractedPlate,
        expectedPlate,
        isMatch,
        confidence,
      }

      setVerificationResult(result)

      // Store in localStorage
      localStorage.setItem("carVerificationResult", JSON.stringify(result))

      // Don't automatically continue - wait for button click
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during verification")
      console.error(err)
    } finally {
      setIsVerifying(false)
      setProcessingStage(0)
      setProcessingProgress(100)
    }
  }

  // Function to simulate processing stages
  const simulateProcessingStages = async () => {
    const stages = [
      { stage: 1, message: "Uploading image...", progress: 20 },
      { stage: 2, message: "Detecting vehicle...", progress: 40 },
      { stage: 3, message: "Locating number plate...", progress: 60 },
      { stage: 4, message: "Reading characters...", progress: 80 },
      { stage: 5, message: "Verifying plate...", progress: 90 },
    ]

    for (const stage of stages) {
      setProcessingStage(stage.stage)
      setProcessingProgress(stage.progress)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  // Function to compare plates
  const comparePlates = (extracted, expected) => {
    if (!extracted || !expected) return false

    // Clean up both plates for comparison
    const cleanExtracted = extracted.replace(/[^A-Z0-9]/gi, "").toUpperCase()
    const cleanExpected = expected.replace(/[^A-Z0-9]/gi, "").toUpperCase()

    // If we have the expected plate from the document, use it for comparison
    if (cleanExpected) {
      // Check if plates match exactly
      if (cleanExtracted === cleanExpected) return true

      // Check if plates match with some tolerance (e.g., last 4 characters)
      if (cleanExtracted.length >= 4 && cleanExpected.length >= 4) {
        const extractedLast4 = cleanExtracted.slice(-4)
        const expectedLast4 = cleanExpected.slice(-4)
        return extractedLast4 === expectedLast4
      }
    }

    // If no expected plate or no match, return false
    return false
  }

  // Get the processing stage message
  const getProcessingStageMessage = () => {
    switch (processingStage) {
      case 1:
        return "Uploading image..."
      case 2:
        return "Detecting vehicle..."
      case 3:
        return "Locating number plate..."
      case 4:
        return "Reading characters..."
      case 5:
        return "Verifying plate..."
      default:
        return "Processing..."
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-[#333333] bg-black">
          <CardHeader className="bg-[#1a1a1a] border-b border-[#333333]">
            <CardTitle className="flex items-center text-white">
              <Car className="mr-2 h-5 w-5 text-[#6B46C1]" />
              Car Number Plate Verification
            </CardTitle>
            <CardDescription className="text-gray-400">
              Upload a photo of your car to verify the number plate matches your insurance document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Expected number plate from document */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333333]">
              <h3 className="text-sm font-medium mb-2 text-white">Number Plate from Document</h3>
              <div className="flex items-center">
                <Badge variant="outline" className="text-lg px-4 py-2 font-mono bg-black text-white border-[#333333]">
                  {extractedData?.numberPlate || "Not found in document"}
                </Badge>
                {extractedData?.numberPlate ? (
                  <Check className="ml-2 h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="ml-2 h-5 w-5 text-[#00FFFF]" />
                )}
              </div>
              {!extractedData?.numberPlate && (
                <p className="text-xs text-[#00FFFF] mt-2">
                  Warning: No number plate was found in your document. Verification may not be accurate.
                </p>
              )}
            </div>

            {/* Car image upload */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="carImage" className="text-base text-white">
                  Car Photo
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="border-2 border-dashed border-[#333333] rounded-lg p-6 text-center hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                    onClick={() => document.getElementById("carImage").click()}
                  >
                    <Car className="h-12 w-12 mx-auto mb-3 text-[#6B46C1]" />
                    <p className="text-sm font-medium text-white">
                      {carImage ? carImage.name : "Click to select or drop a car photo"}
                    </p>
                    {carImage && <p className="text-xs text-gray-400 mt-1">{(carImage.size / 1024).toFixed(2)} KB</p>}
                    <Input
                      id="carImage"
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageChange}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Upload a clear photo of your car with the number plate visible
                    </p>
                  </div>

                  {/* Image preview */}
                  <div className="border border-[#333333] rounded-lg overflow-hidden bg-[#1a1a1a] flex items-center justify-center h-[200px]">
                    {previewUrl ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Car preview"
                        className="max-w-full max-h-[200px] object-contain"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FileText className="h-16 w-16 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Image preview will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6B46C1] hover:bg-[#5a3ba3] text-white"
                disabled={isVerifying || !carImage}
                size="lg"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {getProcessingStageMessage()}
                  </>
                ) : (
                  <>Verify Number Plate</>
                )}
              </Button>

              {isVerifying && (
                <div className="space-y-2">
                  <Progress value={processingProgress} className="h-2 bg-[#333333]">
                    <div className="h-full bg-[#6B46C1] rounded-full" style={{ width: `${processingProgress}%` }} />
                  </Progress>
                  <p className="text-xs text-center text-gray-400">{getProcessingStageMessage()}</p>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="bg-red-900 border-red-700 text-white">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>

            {/* Verification result */}
            {verificationResult && (
              <div
                className={`p-6 rounded-lg border ${verificationResult.isMatch ? "border-green-500 bg-green-900/20" : "border-red-500 bg-red-900/20"}`}
              >
                <div className="flex items-center mb-4">
                  {verificationResult.isMatch ? (
                    <>
                      <div className="bg-green-900/30 p-2 rounded-full mr-3">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-400 text-lg">Verification Successful</h3>
                        <p className="text-green-300 text-sm">The number plate matches your insurance document</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-900/30 p-2 rounded-full mr-3">
                        <X className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-red-400 text-lg">Verification Failed</h3>
                        <p className="text-red-300 text-sm">The number plate doesn't match your insurance document</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="bg-black/40 p-3 rounded-md border border-[#333333]">
                    <p className="text-sm text-gray-400 mb-1">Expected Plate</p>
                    <p className="font-mono font-medium text-lg text-white">
                      {verificationResult.expectedPlate || "Unknown"}
                    </p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-md border border-[#333333]">
                    <p className="text-sm text-gray-400 mb-1">Detected Plate</p>
                    <p className="font-mono font-medium text-lg text-white">
                      {verificationResult.extractedPlate || "Not detected"}
                    </p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-md border border-[#333333]">
                    <p className="text-sm text-gray-400 mb-1">Confidence</p>
                    <div className="flex items-center">
                      <Progress value={verificationResult.confidence * 100} className="h-2 flex-1 mr-2 bg-[#333333]">
                        <div
                          className="h-full bg-[#6B46C1] rounded-full"
                          style={{ width: `${verificationResult.confidence * 100}%` }}
                        />
                      </Progress>
                      <span className="font-medium text-white">
                        {(verificationResult.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-black/40 p-3 rounded-md border border-[#333333]">
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <Badge
                      className={`text-sm ${verificationResult.isMatch ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"}`}
                    >
                      {verificationResult.isMatch ? "Match" : "No Match"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t border-[#333333] bg-[#1a1a1a] py-4">
            <Button
              variant={verificationResult?.isMatch ? "default" : "outline"}
              onClick={() => onVerificationComplete(verificationResult)}
              className={
                verificationResult?.isMatch
                  ? "bg-[#00FFFF] hover:bg-[#00CCCC] text-black font-medium"
                  : "text-blue-600 border-[#333333] hover:bg-[#1a1a1a]"
              }
            >
              {verificationResult?.isMatch ? "Continue" : " Verification"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

