"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, FileText, Upload, Database, TableIcon, CreditCard, Search, User } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Add this function to the top of the file, outside the component
function formatJsonForConsole(data) {
  console.log("Extracted Insurance Data (Client):", JSON.stringify(data, null, 2))
  return JSON.stringify(data, null, 2)
}

export default function DocumentExtractor() {
  const [file, setFile] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("table")
  const [jsonString, setJsonString] = useState("")

  // Policy verification states
  const [policyNumber, setPolicyNumber] = useState("")
  const [isPolicyVerified, setIsPolicyVerified] = useState(false)
  const [isPolicyVerifying, setIsPolicyVerifying] = useState(false)
  const [policyError, setPolicyError] = useState(null)
  const [userData, setUserData] = useState(null)

  // Check if user data exists in localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("insuranceUserData")
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData)
        setUserData(parsedData)
        setIsPolicyVerified(true)
      } catch (e) {
        console.error("Error parsing stored user data:", e)
      }
    }
  }, [])

  const handlePolicyNumberChange = (e) => {
    setPolicyNumber(e.target.value)
    setPolicyError(null)
  }

  const verifyPolicyNumber = async (e) => {
    e.preventDefault()

    if (!policyNumber.trim()) {
      setPolicyError("Please enter a policy number")
      return
    }

    setIsPolicyVerifying(true)
    setPolicyError(null)

    try {
      const response = await fetch(`https://chm-hackverse-2025.onrender.com/api/policy/get/${policyNumber}`)
      const data = await response.json()

      if (data.success) {
        // Policy found
        setUserData(data.user)
        setIsPolicyVerified(true)

        // Store user data in localStorage
        localStorage.setItem("insuranceUserData", JSON.stringify(data.user))
        console.log("User data saved:", data.user)
      } else {
        // Policy not found
        setPolicyError("No policy found with this number")
      }
    } catch (err) {
      setPolicyError("Error verifying policy. Please try again.")
      console.error("Policy verification error:", err)
    } finally {
      setIsPolicyVerifying(false)
    }
  }

  const resetPolicy = () => {
    setIsPolicyVerified(false)
    setUserData(null)
    setPolicyNumber("")
    localStorage.removeItem("insuranceUserData")

    // Also reset document extraction data
    setFile(null)
    setExtractedData(null)
    setError(null)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create form data to send the file
      const formData = new FormData()
      formData.append("document", file)

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during extraction")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // If policy is not verified, show the policy verification form
  if (!isPolicyVerified) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Insurance Policy Verification</CardTitle>
              <CardDescription>Enter your policy number to proceed with document extraction</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={verifyPolicyNumber} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="policyNumber"
                      placeholder="e.g. POL-8901-2345-2223"
                      value={policyNumber}
                      onChange={handlePolicyNumberChange}
                    />
                    <Button type="submit" disabled={isPolicyVerifying}>
                      {isPolicyVerifying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the policy number provided in your insurance document
                  </p>
                </div>

                {policyError && (
                  <Alert variant="destructive">
                    <AlertDescription>{policyError}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              For testing, use policy number: POL-8901-2345-2223
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // If policy is verified, show the document extraction UI
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Insurance Document Extractor</h1>
              <p className="text-muted-foreground mt-2">
                Upload your insurance document to automatically extract and organize key information
              </p>
            </div>

            {userData && (
              <Card className="p-4 flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-sm text-muted-foreground">Policy: {userData.policyNumber}</p>
                </div>
                <Button variant="outline" size="sm" onClick={resetPolicy}>
                  Change
                </Button>
              </Card>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload Section */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Document
              </CardTitle>
              <CardDescription>Select your insurance document to process</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="document">Document File</Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("document").click()}
                  >
                    <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">{file ? file.name : "Click to select or drop a file"}</p>
                    {file && <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(2)} KB</p>}
                    <Input
                      id="document"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.tiff,.gif,.bmp"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG, TIFF</p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Document...
                    </>
                  ) : (
                    <>Extract Information</>
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Extracted Information
                </CardTitle>
                {extractedData && (
                  <Tabs defaultValue="table" className="w-[200px]" onValueChange={setViewMode}>
                    <TabsList>
                      <TabsTrigger value="table" className="flex items-center">
                        <TableIcon className="h-4 w-4 mr-1" />
                        Table
                      </TabsTrigger>
                      <TabsTrigger value="card" className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Card
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
              <CardDescription>
                {extractedData
                  ? "View the extracted insurance details below"
                  : "Upload a document to see extracted information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!extractedData && !isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mb-4" />
                  <p>No data extracted yet</p>
                  <p className="text-sm mt-2">Upload an insurance document to extract information</p>
                </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Loader2 className="h-16 w-16 mb-4 animate-spin text-primary" />
                  <p className="font-medium">Processing your document</p>
                  <p className="text-sm text-muted-foreground mt-2">This may take a few moments...</p>
                </div>
              )}

              {extractedData && viewMode === "table" && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Field</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Name</TableCell>
                        <TableCell>{extractedData.name || "—"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Email</TableCell>
                        <TableCell>{extractedData.email || "—"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Car Color</TableCell>
                        <TableCell>{extractedData.carColor || "—"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Number Plate</TableCell>
                        <TableCell>{extractedData.numberPlate || "—"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Policy Number</TableCell>
                        <TableCell>{extractedData.policyNumber || "—"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Policy Type</TableCell>
                        <TableCell>{extractedData.policyType || "—"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Coverage Includes</TableCell>
                        <TableCell>
                          {extractedData.coverageIncludes && extractedData.coverageIncludes.length > 0 ? (
                            <ul className="list-disc pl-5">
                              {extractedData.coverageIncludes.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Policy Start Date</TableCell>
                        <TableCell>{extractedData.policyStartDate || "—"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Policy End Date</TableCell>
                        <TableCell>{extractedData.policyEndDate || "—"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Premium Amount</TableCell>
                        <TableCell>{extractedData.premiumAmount || "—"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              {extractedData && viewMode === "card" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      title="Policy Holder"
                      items={[
                        { label: "Name", value: extractedData.name },
                        { label: "Email", value: extractedData.email },
                      ]}
                    />

                    <InfoCard
                      title="Vehicle Details"
                      items={[
                        { label: "Car Color", value: extractedData.carColor },
                        { label: "Number Plate", value: extractedData.numberPlate },
                      ]}
                    />

                    <InfoCard
                      title="Policy Details"
                      items={[
                        { label: "Policy Number", value: extractedData.policyNumber },
                        { label: "Policy Type", value: extractedData.policyType },
                        { label: "Premium Amount", value: extractedData.premiumAmount },
                      ]}
                    />

                    <InfoCard
                      title="Policy Dates"
                      items={[
                        { label: "Start Date", value: extractedData.policyStartDate },
                        { label: "End Date", value: extractedData.policyEndDate },
                      ]}
                    />
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">Coverage Includes</h3>
                    {extractedData.coverageIncludes && extractedData.coverageIncludes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {extractedData.coverageIncludes.map((item, index) => (
                          <Badge key={index} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No coverage details found</p>
                    )}
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">JSON Data</h3>
                    <pre className="text-xs overflow-auto p-2 bg-background rounded border max-h-40">{jsonString}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper component for card view
function InfoCard({ title, items }) {
  return (
    <div className="bg-muted rounded-lg p-4">
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-2">
            <span className="text-sm text-muted-foreground">{item.label}:</span>
            <span className="text-sm font-medium">{item.value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

