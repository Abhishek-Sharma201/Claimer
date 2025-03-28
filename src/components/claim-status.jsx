"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  Car,
  CheckCircle,
  FileText,
  Wrench,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  AlertCircle,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  ClipboardList,
  ArrowRight,
  Download,
  Printer,
} from "lucide-react"

export default function ClaimStatus() {
  // State to store data from localStorage
  const [userData, setUserData] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [assessmentResult, setAssessmentResult] = useState(null)
  const [claimId, setClaimId] = useState("")
  const [claimDate, setClaimDate] = useState("")

  // Determine if policy type is home
  const isHomePolicy =
    userData?.policyType?.toLowerCase() === "home" || extractedData?.documentType?.toLowerCase() === "home"

  // Load data from localStorage on component mount
  useEffect(() => {
    // Generate a random claim ID if not already set
    if (!claimId) {
      const randomId =
        "CLM" +
        Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0")
      setClaimId(randomId)

      // Set claim date to current date if not already set
      const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      setClaimDate(currentDate)
    }

    // Load user data
    const storedUserData = localStorage.getItem("insuranceUserData")
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData)
        setUserData(parsedData)

        // Load document data
        const storedDocumentData = localStorage.getItem("extractedInsuranceData")
        if (storedDocumentData) {
          try {
            const parsedDocData = JSON.parse(storedDocumentData)
            setExtractedData(parsedDocData)

            // Load verification result
            const verificationKey =
              parsedDocData.documentType?.toLowerCase() === "home" ? "homeVerificationResult" : "carVerificationResult"

            const storedVerificationResult = localStorage.getItem(verificationKey)
            if (storedVerificationResult) {
              try {
                const parsedVerificationResult = JSON.parse(storedVerificationResult)
                setVerificationResult(parsedVerificationResult)

                // Load assessment result
                const assessmentKey =
                  parsedDocData.documentType?.toLowerCase() === "home"
                    ? "homeDamageAssessmentResult"
                    : "damageAssessmentResult"

                const storedAssessmentResult = localStorage.getItem(assessmentKey)
                if (storedAssessmentResult) {
                  try {
                    const parsedAssessmentResult = JSON.parse(storedAssessmentResult)
                    setAssessmentResult(parsedAssessmentResult)
                  } catch (e) {
                    console.error(`Error parsing stored ${assessmentKey}:`, e)
                  }
                }
              } catch (e) {
                console.error("Error parsing stored verification result:", e)
              }
            }
          } catch (e) {
            console.error("Error parsing stored document data:", e)
          }
        }
      } catch (e) {
        console.error("Error parsing stored user data:", e)
      }
    }
  }, [claimId])

  // Format currency in Indian format
  const formatCurrency = (amount) => {
    if (!amount) return "₹0"

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Extract numeric value from coverage amount string
  const extractCoverageAmount = (coverageString) => {
    if (!coverageString) return 0

    // Extract numbers from the string
    const matches = coverageString.match(/[\d,]+/g)
    if (!matches || matches.length === 0) return 0

    // Remove commas and convert to number
    return Number.parseFloat(matches[0].replace(/,/g, ""))
  }

  // Get status color based on claim status
  const getStatusColor = (status) => {
    if (!status) return "text-white"

    if (status.includes("Approved")) return "text-green-400"
    if (status.includes("Rejected")) return "text-red-400"
    return "text-[#00FFFF]"
  }

  // Get status badge color based on claim status
  const getStatusBadgeColor = (status) => {
    if (!status) return "bg-gray-700 text-white"

    if (status.includes("Approved")) return "bg-green-900 text-green-100"
    if (status.includes("Rejected")) return "bg-red-900 text-red-100"
    return "bg-[#00FFFF]/20 text-[#00FFFF]"
  }

  // Get confidence color based on score
  const getConfidenceColor = (score) => {
    if (!score) return "bg-gray-700"

    if (score >= 85) return "bg-green-600"
    if (score >= 70) return "bg-green-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  // Get severity color
  const getSeverityColor = (severity) => {
    if (!severity) return "bg-gray-700 text-white"

    if (severity.toLowerCase() === "high") return "bg-red-900 text-red-100"
    if (severity.toLowerCase() === "medium") return "bg-amber-900 text-amber-100"
    if (severity.toLowerCase() === "low") return "bg-green-900 text-green-100"
    return "bg-gray-700 text-white"
  }

  // Get claim status icon
  const getStatusIcon = (status) => {
    if (!status) return <AlertCircle className="h-6 w-6 text-[#00FFFF]" />

    if (status.includes("Approved")) return <ShieldCheck className="h-6 w-6 text-green-500" />
    if (status.includes("Rejected")) return <ShieldX className="h-6 w-6 text-red-500" />
    return <AlertCircle className="h-6 w-6 text-[#00FFFF]" />
  }

  // Calculate expected payout
  const calculatePayout = () => {
    if (!assessmentResult || !assessmentResult.estimatedCost) return 0

    const coverageAmount = extractCoverageAmount(extractedData?.coverageAmount || "0")
    const estimatedCost = assessmentResult.estimatedCost

    // If claim is rejected, return 0
    if (assessmentResult.claimStatus === "Rejected") return 0

    // If claim is approved, return the lower of estimated cost or coverage amount
    if (assessmentResult.claimStatus === "Approved") {
      return Math.min(estimatedCost, coverageAmount)
    }

    // If claim is pending, return estimated cost with a note that it's subject to approval
    return estimatedCost
  }

  // Get claim timeline steps
  const getClaimTimeline = () => {
    const timeline = [
      {
        title: "Claim Initiated",
        description: `Claim #${claimId} submitted on ${claimDate}`,
        status: "completed",
        icon: <FileCheck className="h-5 w-5" />,
      },
      {
        title: "Document Verification",
        description: "Insurance document processed and verified",
        status: "completed",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: isHomePolicy ? "Property Verification" : "Vehicle Verification",
        description: isHomePolicy
          ? "Property details verified"
          : verificationResult?.isMatch
            ? "Vehicle number plate verified"
            : "Vehicle verification completed",
        status: "completed",
        icon: isHomePolicy ? <Home className="h-5 w-5" /> : <Car className="h-5 w-5" />,
      },
      {
        title: "Damage Assessment",
        description: assessmentResult
          ? `${assessmentResult.damageSeverity || "Unknown"} damage assessed`
          : "Damage assessment pending",
        status: assessmentResult ? "completed" : "pending",
        icon: <Wrench className="h-5 w-5" />,
      },
      {
        title: "Claim Decision",
        description: assessmentResult?.claimStatus
          ? assessmentResult.claimStatus === "Approved"
            ? "Claim approved for payment"
            : assessmentResult.claimStatus === "Rejected"
              ? "Claim rejected"
              : "Claim pending review"
          : "Awaiting decision",
        status: assessmentResult?.claimStatus
          ? assessmentResult.claimStatus === "Pending Admin Review"
            ? "in-progress"
            : "completed"
          : "pending",
        icon: <ClipboardList className="h-5 w-5" />,
      },
    ]

    // Add payment step if claim is approved
    if (assessmentResult?.claimStatus === "Approved") {
      timeline.push({
        title: "Payment Processing",
        description: "Payment will be processed within 7 days",
        status: "in-progress",
        icon: <DollarSign className="h-5 w-5" />,
      })
    }

    return timeline
  }

  // Handle print claim details
  const handlePrintClaim = () => {
    window.print()
  }

  // If no data is loaded yet, show loading state
  if (!userData || !extractedData) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-[#333333] bg-black shadow-lg">
            <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center min-h-[300px]">
              <div className="animate-pulse flex flex-col items-center space-y-4">
                <div className="rounded-full bg-[#1a1a1a] h-16 w-16"></div>
                <div className="h-4 bg-[#1a1a1a] rounded w-48"></div>
                <div className="h-3 bg-[#1a1a1a] rounded w-64"></div>
                <div className="h-3 bg-[#1a1a1a] rounded w-32"></div>
              </div>
              <p className="text-gray-400 mt-6">Loading claim data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Claim Header */}
        <Card className="border-[#333333] bg-black shadow-lg mb-6 overflow-hidden">
          <div className="bg-[#6B46C1] px-6 py-2">
            <p className="text-white text-sm">Insurance Claim Portal</p>
          </div>
          <CardHeader className="bg-[#1a1a1a] border-b border-[#333333] pb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl text-white flex items-center">
                  Claim Status
                  <Badge className={`ml-3 ${getStatusBadgeColor(assessmentResult?.claimStatus)}`}>
                    {assessmentResult?.claimStatus || "Processing"}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Claim #{claimId} • Submitted on {claimDate}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-700 border-[#333333] hover:bg-[#1a1a1a]"
                  onClick={handlePrintClaim}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="text-blue-700 border-[#333333] hover:bg-[#1a1a1a]">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            {/* Claim Status Summary */}
            <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#333333] mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    assessmentResult?.claimStatus === "Approved"
                      ? "bg-green-900/30"
                      : assessmentResult?.claimStatus === "Rejected"
                        ? "bg-red-900/30"
                        : "bg-[#00FFFF]/10"
                  }`}
                >
                  {getStatusIcon(assessmentResult?.claimStatus)}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-medium ${getStatusColor(assessmentResult?.claimStatus)}`}>
                    {assessmentResult?.claimStatus === "Approved"
                      ? "Your claim has been approved"
                      : assessmentResult?.claimStatus === "Rejected"
                        ? "Your claim has been rejected"
                        : "Your claim is being processed"}
                  </h3>
                  <p className="text-gray-300 mt-1">
                    {assessmentResult?.claimStatus === "Approved"
                      ? `A payment of ${formatCurrency(calculatePayout())} will be processed within 7 business days.`
                      : assessmentResult?.claimStatus === "Rejected"
                        ? assessmentResult.rejectionReason ||
                          "Your claim does not meet the required criteria for approval."
                        : "Our team is reviewing your claim and will provide a decision soon."}
                  </p>

                  {/* Show additional info based on status */}
                  {assessmentResult?.claimStatus === "Pending Admin Review" && assessmentResult.rejectionReason && (
                    <div className="mt-3 p-3 bg-[#00FFFF]/5 border border-[#00FFFF]/20 rounded-md">
                      <p className="text-sm text-[#00FFFF] flex items-start">
                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        {assessmentResult.rejectionReason}
                      </p>
                    </div>
                  )}

                  {assessmentResult?.claimStatus === "Rejected" && (
                    <div className="mt-3 p-3 bg-red-900/10 border border-red-900/20 rounded-md">
                      <p className="text-sm text-red-300 flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        If you believe this decision is incorrect, please contact our claims department at
                        <a href="tel:+918001234567" className="text-[#00FFFF] mx-1">
                          800-123-4567
                        </a>
                        for assistance.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Claim Timeline */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#6B46C1]" />
                Claim Timeline
              </h3>
              <div className="space-y-4">
                {getClaimTimeline().map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        step.status === "completed"
                          ? "bg-[#6B46C1]/20 text-[#6B46C1]"
                          : step.status === "in-progress"
                            ? "bg-[#00FFFF]/20 text-[#00FFFF]"
                            : "bg-[#333333] text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <h4
                          className={`font-medium ${
                            step.status === "completed"
                              ? "text-white"
                              : step.status === "in-progress"
                                ? "text-[#00FFFF]"
                                : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`mt-1 md:mt-0 ${
                            step.status === "completed"
                              ? "border-[#6B46C1] text-[#6B46C1]"
                              : step.status === "in-progress"
                                ? "border-[#00FFFF] text-[#00FFFF]"
                                : "border-gray-600 text-gray-400"
                          }`}
                        >
                          {step.status === "completed"
                            ? "Completed"
                            : step.status === "in-progress"
                              ? "In Progress"
                              : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{step.description}</p>

                      {/* Add connecting line if not the last item */}
                      {index < getClaimTimeline().length - 1 && (
                        <div className="ml-4 mt-1 mb-1 w-0.5 h-6 bg-[#333333]"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Claim Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Policy Information */}
              <Card className="border-[#333333] bg-[#1a1a1a] shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-[#6B46C1]" />
                    Policy Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Policy Number:</span>
                      <span className="text-sm font-medium text-white">
                        {extractedData?.policyNumber || userData?.policyNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Policy Type:</span>
                      <span className="text-sm font-medium text-white">
                        {extractedData?.policyType || userData?.policyType || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Coverage Amount:</span>
                      <span className="text-sm font-medium text-[#00FFFF]">
                        {extractedData?.coverageAmount || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Valid Until:</span>
                      <span className="text-sm font-medium text-white">{extractedData?.policyEndDate || "N/A"}</span>
                    </div>
                    <Separator className="bg-[#333333]" />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Policyholder:</span>
                      <span className="text-sm font-medium text-white">
                        {userData?.name || extractedData?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Email:</span>
                      <span className="text-sm font-medium text-white">
                        {userData?.email || extractedData?.email || "N/A"}
                      </span>
                    </div>
                    {isHomePolicy ? (
                      <>
                        <Separator className="bg-[#333333]" />
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Property Type:</span>
                          <span className="text-sm font-medium text-white">{extractedData?.propertyType || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Location:</span>
                          <span className="text-sm font-medium text-white">
                            {extractedData?.propertyLocation || "N/A"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Separator className="bg-[#333333]" />
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Vehicle Plate:</span>
                          <span className="text-sm font-medium text-white">{extractedData?.numberPlate || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Car Color:</span>
                          <span className="text-sm font-medium text-white">{extractedData?.carColor || "N/A"}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Damage Assessment */}
              <Card className="border-[#333333] bg-[#1a1a1a] shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Wrench className="h-5 w-5 mr-2 text-[#6B46C1]" />
                    Damage Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {assessmentResult ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Severity:</span>
                        <Badge className={getSeverityColor(assessmentResult.damageSeverity)}>
                          {assessmentResult.damageSeverity || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Affected Areas:</span>
                        <span className="text-sm font-medium text-white text-right">
                          {Array.isArray(assessmentResult.affectedAreas)
                            ? assessmentResult.affectedAreas.join(", ")
                            : assessmentResult.affectedAreas || "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Repair Time:</span>
                        <span className="text-sm font-medium text-white">
                          {assessmentResult.estimatedRepairTime || "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">AI Confidence:</span>
                        <div className="flex items-center">
                          <Progress value={assessmentResult.confidenceScore} className="h-2 w-20 mr-2 bg-[#333333]">
                            <div
                              className={`h-full ${getConfidenceColor(assessmentResult.confidenceScore)} rounded-full`}
                              style={{ width: `${assessmentResult.confidenceScore}%` }}
                            />
                          </Progress>
                          <span className="text-sm font-medium text-white">{assessmentResult.confidenceScore}%</span>
                        </div>
                      </div>
                      <Separator className="bg-[#333333]" />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">{isHomePolicy ? "Materials" : "Parts"} Cost:</span>
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(isHomePolicy ? assessmentResult.materialsCost : assessmentResult.partsCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Labor Cost:</span>
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(assessmentResult.laborCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-400">Total Estimate:</span>
                        <span className="text-sm font-medium text-[#00FFFF]">
                          {formatCurrency(assessmentResult.estimatedCost)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <AlertCircle className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-400 text-center">No damage assessment data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Claim Decision & Payment */}
            {assessmentResult && (
              <Card className="border-[#333333] bg-[#1a1a1a] shadow-md mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-[#6B46C1]" />
                    Claim Decision & Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-black/40 p-4 rounded-lg border border-[#333333]">
                        <p className="text-sm text-gray-400 mb-1">Claim Status</p>
                        <div className="flex items-center">
                          {getStatusIcon(assessmentResult.claimStatus)}
                          <p className={`ml-2 font-medium ${getStatusColor(assessmentResult.claimStatus)}`}>
                            {assessmentResult.claimStatus || "Processing"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/40 p-4 rounded-lg border border-[#333333]">
                        <p className="text-sm text-gray-400 mb-1">Estimated Damage</p>
                        <p className="text-xl font-medium text-white">
                          {formatCurrency(assessmentResult.estimatedCost)}
                        </p>
                      </div>

                      <div className="bg-black/40 p-4 rounded-lg border border-[#333333]">
                        <p className="text-sm text-gray-400 mb-1">Expected Payout</p>
                        <p
                          className={`text-xl font-medium ${
                            assessmentResult.claimStatus === "Approved"
                              ? "text-[#00FFFF]"
                              : assessmentResult.claimStatus === "Rejected"
                                ? "text-red-400"
                                : "text-white"
                          }`}
                        >
                          {formatCurrency(calculatePayout())}
                        </p>
                      </div>
                    </div>

                    {assessmentResult.claimStatus === "Approved" && (
                      <div className="bg-green-900/10 border border-green-900/20 rounded-lg p-4">
                        <h4 className="text-green-400 font-medium flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Payment Processing
                        </h4>
                        <p className="text-gray-300 mt-1">
                          Your claim has been approved for payment. The amount of {formatCurrency(calculatePayout())}{" "}
                          will be processed within 7 business days and transferred to your registered bank account.
                        </p>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Payment Method</p>
                            <p className="text-sm text-white">Direct Bank Transfer</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Expected Date</p>
                            <p className="text-sm text-white">
                              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {assessmentResult.claimStatus === "Rejected" && (
                      <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-4">
                        <h4 className="text-red-400 font-medium flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Claim Rejected
                        </h4>
                        <p className="text-gray-300 mt-1">
                          {assessmentResult.rejectionReason || "Your claim has been rejected based on our assessment."}
                        </p>
                        <div className="mt-3">
                          <p className="text-sm text-gray-400">Appeal Options</p>
                          <p className="text-sm text-white">
                            If you believe this decision is incorrect, you can appeal within 30 days by contacting our
                            claims department.
                          </p>
                        </div>
                      </div>
                    )}

                    {assessmentResult.claimStatus === "Pending Admin Review" && (
                      <div className="bg-[#00FFFF]/5 border border-[#00FFFF]/20 rounded-lg p-4">
                        <h4 className="text-[#00FFFF] font-medium flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Additional Review Required
                        </h4>
                        <p className="text-gray-300 mt-1">
                          {assessmentResult.rejectionReason || "Your claim requires additional review by our team."}
                        </p>
                        <div className="mt-3">
                          <p className="text-sm text-gray-400">Next Steps</p>
                          <p className="text-sm text-white">
                            Our claims adjuster will contact you within 2-3 business days to discuss your claim and may
                            request additional information.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="border-[#333333] bg-[#1a1a1a] shadow-md mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-[#6B46C1]" />
                  Need Assistance?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-[#00FFFF] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">Claims Helpline</p>
                      <p className="text-sm text-gray-400">800-123-4567</p>
                      <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-[#00FFFF] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">Email Support</p>
                      <p className="text-sm text-gray-400">claims@insurance.com</p>
                      <p className="text-xs text-gray-500">24/7 Response</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-[#00FFFF] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">Nearest Office</p>
                      <p className="text-sm text-gray-400">Find a branch near you</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        <span className="text-[#00FFFF]">Locate Branch</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="bg-[#1a1a1a] border-t border-[#333333] py-4 flex justify-between">
            <p className="text-xs text-gray-400">
              Claim #{claimId} • Last Updated: {new Date().toLocaleString("en-IN")}
            </p>
            <Button variant="link" className="text-[#00FFFF] p-0 h-auto text-xs">
              View Full Claim History
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

