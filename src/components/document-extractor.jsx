"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, FileText, Upload, Database, TableIcon, CreditCard, Check, ArrowRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Helper component for card view
function InfoCard({ title, items, icon }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333]">
      <div className="flex items-center mb-3">
        {icon && <div className="mr-2 text-[#6B46C1]">{icon}</div>}
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-2">
            <span className="text-sm text-gray-400">{item.label}:</span>
            <span className="text-sm font-medium text-white">{item.value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DocumentExtractor({ userData, onDocumentProcessed }) {
  const [file, setFile] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("table")
  const [jsonString, setJsonString] = useState("")
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingComplete, setProcessingComplete] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const formatJsonForConsole = (data) => {
    console.log("Extracted Insurance Data (Client):", JSON.stringify(data, null, 2))
    return JSON.stringify(data, null, 2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsLoading(true)
    setError(null)
    setProcessingProgress(0)
    setProcessingComplete(false)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      // Create form data to send the file
      const formData = new FormData()
      formData.append("document", file)

      // Add policy type to the form data
      if (userData && userData.policyType) {
        formData.append("policyType", userData.policyType)
      }

      // Send the file to the API for processing
      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      const data = await response.json()

      // Set the extracted data
      setExtractedData(data)

      // Create formatted JSON string for display and console
      const formattedJson = formatJsonForConsole(data)
      setJsonString(formattedJson)

      // Store in localStorage
      localStorage.setItem("extractedInsuranceData", JSON.stringify(data))

      // Complete progress
      setProcessingProgress(100)
      setProcessingComplete(true)

      // Don't automatically proceed to next step - wait for button click
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during extraction")
      console.error(err)
      setProcessingProgress(0)
    } finally {
      clearInterval(progressInterval)
      setIsLoading(false)
    }
  }

  // Handle continue button click
  const handleContinue = () => {
    if (extractedData) {
      onDocumentProcessed(extractedData)
    }
  }

  // Render appropriate fields based on document type
  const renderExtractedDataTable = () => {
    if (!extractedData) return null

    const documentType = extractedData.documentType || userData?.policyType || "Car"

    if (documentType.toLowerCase() === "home") {
      return (
        <Table>
          <TableHeader className="bg-[#1a1a1a]">
            <TableRow>
              <TableHead className="w-[200px] text-white">Field</TableHead>
              <TableHead className="text-white">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Name</TableCell>
              <TableCell className="text-white">{extractedData.name || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Email</TableCell>
              <TableCell className="text-white">{extractedData.email || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Policy Number</TableCell>
              <TableCell className="text-white">{extractedData.policyNumber || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Policy Type</TableCell>
              <TableCell className="text-white">{extractedData.policyType || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Property Type</TableCell>
              <TableCell className="text-white">{extractedData.propertyType || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Construction Type</TableCell>
              <TableCell className="text-white">{extractedData.constructionType || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Property Location</TableCell>
              <TableCell className="text-white">{extractedData.propertyLocation || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Year Built</TableCell>
              <TableCell className="text-white">{extractedData.yearBuilt || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Square Footage</TableCell>
              <TableCell className="text-white">{extractedData.squareFootage || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Property Value</TableCell>
              <TableCell className="text-white">{extractedData.propertyValue || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Coverage Includes</TableCell>
              <TableCell>
                {extractedData.coverageIncludes && extractedData.coverageIncludes.length > 0 ? (
                  <ul className="list-disc pl-5 text-white">
                    {extractedData.coverageIncludes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-white">—</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Policy Start Date</TableCell>
              <TableCell className="text-white">{extractedData.policyStartDate || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Policy End Date</TableCell>
              <TableCell className="text-white">{extractedData.policyEndDate || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Coverage Amount</TableCell>
              <TableCell className="text-[#00FFFF] font-medium">{extractedData.coverageAmount || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Premium Amount</TableCell>
              <TableCell className="text-[#00FFFF] font-medium">{extractedData.premiumAmount || "—"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    } else {
      // Car insurance document
      return (
        <Table>
          <TableHeader className="bg-[#1a1a1a]">
            <TableRow>
              <TableHead className="w-[200px] text-white">Field</TableHead>
              <TableHead className="text-white">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Name</TableCell>
              <TableCell className="text-white">{extractedData.name || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Email</TableCell>
              <TableCell className="text-white">{extractedData.email || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Car Color</TableCell>
              <TableCell className="text-white">{extractedData.carColor || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Number Plate</TableCell>
              <TableCell className="text-white">{extractedData.numberPlate || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Policy Number</TableCell>
              <TableCell className="text-white">{extractedData.policyNumber || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Policy Type</TableCell>
              <TableCell className="text-white">{extractedData.policyType || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Coverage Includes</TableCell>
              <TableCell>
                {extractedData.coverageIncludes && extractedData.coverageIncludes.length > 0 ? (
                  <ul className="list-disc pl-5 text-white">
                    {extractedData.coverageIncludes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-white">—</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Policy Start Date</TableCell>
              <TableCell className="text-white">{extractedData.policyStartDate || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Policy End Date</TableCell>
              <TableCell className="text-white">{extractedData.policyEndDate || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Coverage Amount</TableCell>
              <TableCell className="text-[#00FFFF] font-medium">{extractedData.coverageAmount || "—"}</TableCell>
            </TableRow>
            <TableRow className="border-b border-[#333333]">
              <TableCell className="font-medium text-white">Premium Amount</TableCell>
              <TableCell className="text-[#00FFFF] font-medium">{extractedData.premiumAmount || "—"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    }
  }

  // Render appropriate card view based on document type
  const renderCardView = () => {
    if (!extractedData) return null

    const documentType = extractedData.documentType || userData?.policyType || "Car"

    if (documentType.toLowerCase() === "home") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              title="Policy Holder"
              icon={<FileText className="h-4 w-4" />}
              items={[
                { label: "Name", value: extractedData.name },
                { label: "Email", value: extractedData.email },
              ]}
            />

            <InfoCard
              title="Property Details"
              icon={<FileText className="h-4 w-4" />}
              items={[
                { label: "Property Type", value: extractedData.propertyType },
                { label: "Construction Type", value: extractedData.constructionType },
                { label: "Year Built", value: extractedData.yearBuilt },
                { label: "Square Footage", value: extractedData.squareFootage },
              ]}
            />

            <InfoCard
              title="Policy Details"
              icon={<FileText className="h-4 w-4" />}
              items={[
                { label: "Policy Number", value: extractedData.policyNumber },
                { label: "Policy Type", value: extractedData.policyType },
                { label: "Property Value", value: extractedData.propertyValue },
                { label: "Coverage Amount", value: extractedData.coverageAmount },
              ]}
            />

            <InfoCard
              title="Policy Dates"
              icon={<FileText className="h-4 w-4" />}
              items={[
                { label: "Start Date", value: extractedData.policyStartDate },
                { label: "End Date", value: extractedData.policyEndDate },
                { label: "Property Location", value: extractedData.propertyLocation },
              ]}
            />
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333]">
            <h3 className="font-medium mb-2 text-white">Coverage Includes</h3>
            {extractedData.coverageIncludes && extractedData.coverageIncludes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {extractedData.coverageIncludes.map((item, index) => (
                  <Badge key={index} className="bg-[#6B46C1] text-white hover:bg-[#5a3ba3]">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No coverage details found</p>
            )}
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333]">
            <h3 className="font-medium mb-2 text-white">JSON Data</h3>
            <pre className="text-xs overflow-auto p-2 bg-black rounded border border-[#333333] max-h-40 text-white">
              {jsonString}
            </pre>
          </div>
        </div>
      )
    } else {
      // Car insurance document
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              title="Policy Holder"
              icon={<FileText className="h-4 w-4" />}
              items={[
                { label: "Name", value: extractedData.name },
                { label: "Email", value: extractedData.email },
              ]}
            />

            <InfoCard
              title="Vehicle Details"
              icon={<FileText className="h-4 w-4" />}
              items={[
                { label: "Car Color", value: extractedData.carColor },
                { label: "Number Plate", value: extractedData.numberPlate },
              ]}
            />

            <InfoCard
              title="Policy Details"
              icon={<FileText className="h-4 w-4" />}
              items={[
                { label: "Policy Number", value: extractedData.policyNumber },
                { label: "Policy Type", value: extractedData.policyType },
                { label: "Premium Amount", value: extractedData.premiumAmount },
              ]}
            />

            <InfoCard
              title="Policy Dates"
              icon={<FileText className="h-4 w-4" />}
              items={[
                { label: "Start Date", value: extractedData.policyStartDate },
                { label: "End Date", value: extractedData.policyEndDate },
              ]}
            />
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333]">
            <h3 className="font-medium mb-2 text-white">Coverage Includes</h3>
            {extractedData.coverageIncludes && extractedData.coverageIncludes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {extractedData.coverageIncludes.map((item, index) => (
                  <Badge key={index} className="bg-[#6B46C1] text-white hover:bg-[#5a3ba3]">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No coverage details found</p>
            )}
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333]">
            <h3 className="font-medium mb-2 text-white">JSON Data</h3>
            <pre className="text-xs overflow-auto p-2 bg-black rounded border border-[#333333] max-h-40 text-white">
              {jsonString}
            </pre>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Upload Section */}
      <Card className="md:col-span-1 shadow-lg border-[#333333] bg-black">
        <CardHeader className="bg-[#1a1a1a] border-b border-[#333333]">
          <CardTitle className="flex items-center text-white">
            <Upload className="mr-2 h-5 w-5 text-[#6B46C1]" />
            Upload Document
          </CardTitle>
          <CardDescription className="text-gray-400">
            Select your {userData?.policyType || "insurance"} document to process
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="document" className="text-base text-white">
                Document File
              </Label>
              <div
                className="border-2 border-dashed border-[#333333] rounded-lg p-6 text-center hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                onClick={() => document.getElementById("document").click()}
              >
                <FileText className="h-12 w-12 mx-auto mb-3 text-[#6B46C1]" />
                <p className="text-sm font-medium text-white">{file ? file.name : "Click to select or drop a file"}</p>
                {file && <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(2)} KB</p>}
                <Input
                  id="document"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff,.gif,.bmp"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-400 mt-2">Supported formats: PDF, JPG, PNG, TIFF</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#6B46C1] hover:bg-[#5a3ba3] text-white"
              disabled={isLoading || !file}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Document...
                </>
              ) : (
                <>Extract Information</>
              )}
            </Button>

            {isLoading && (
              <div className="space-y-2">
                <Progress value={processingProgress} className="h-2 bg-[#333333]">
                  <div className="h-full bg-[#6B46C1] rounded-full" style={{ width: `${processingProgress}%` }} />
                </Progress>
                <p className="text-xs text-center text-gray-400">
                  {processingProgress < 100 ? "Processing document..." : "Extraction complete!"}
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-700 text-white">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="md:col-span-2 shadow-lg border-[#333333] bg-black">
        <CardHeader className="bg-[#1a1a1a] border-b border-[#333333]">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-white">
              <Database className="mr-2 h-5 w-5 text-[#6B46C1]" />
              Extracted Information
            </CardTitle>
            {extractedData && (
              <Tabs defaultValue="table" className="w-[200px]" onValueChange={setViewMode}>
                <TabsList className="bg-[#333333] text-white">
                  <TabsTrigger
                    value="table"
                    className="flex items-center data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white text-white"
                  >
                    <TableIcon className="h-4 w-4 mr-1" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger
                    value="card"
                    className="flex items-center data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white text-white"
                  >
                    <CreditCard className="h-4 w-4 mr-1" />
                    Card
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
          <CardDescription className="text-gray-400">
            {extractedData
              ? "View the extracted insurance details below"
              : "Upload a document to see extracted information"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!extractedData && !isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
              <FileText className="h-16 w-16 mb-4" />
              <p>No data extracted yet</p>
              <p className="text-sm mt-2">Upload an insurance document to extract information</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Loader2 className="h-16 w-16 mb-4 animate-spin text-[#6B46C1]" />
              <p className="font-medium text-white">Processing your document</p>
              <p className="text-sm text-gray-400 mt-2">This may take a few moments...</p>
            </div>
          )}

          {extractedData && processingComplete && (
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 flex items-center mb-4">
              <div className="bg-[#6B46C1]/30 p-2 rounded-full mr-3">
                <Check className="h-5 w-5 text-[#00FFFF]" />
              </div>
              <div>
                <h3 className="font-medium text-white text-lg">Document Processed Successfully</h3>
                <p className="text-sm text-gray-300">
                  Your {userData?.policyType || "insurance"} document has been successfully processed
                </p>
              </div>
            </div>
          )}

          {extractedData && viewMode === "table" && (
            <div className="rounded-md border border-[#333333]">{renderExtractedDataTable()}</div>
          )}

          {extractedData && viewMode === "card" && renderCardView()}

          {/* Continue button - only show when processing is complete */}
          {extractedData && processingComplete && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleContinue}
                className="bg-[#00FFFF] hover:bg-[#00CCCC] text-black font-medium"
                size="lg"
              >
                Continue to Verification
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

