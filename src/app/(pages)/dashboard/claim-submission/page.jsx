"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Home, Car, CheckCircle, FileText, Wrench } from "lucide-react"
import PolicyVerification from "@/src/components/policy-verification"
import DocumentExtractor from "@/src/components/document-extractor"
import CarVerification from "@/src/components/car-verification"
import HomeVerification from "@/src/components/home-verification"
import DamageAssessment from "@/src/components/damage-assessment"

export default function InsuranceApp() {
  // Application state
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [assessmentResult, setAssessmentResult] = useState(null)

  // Check if user data exists in localStorage on component mount
  useEffect(() => {
    // Load user data
    const storedUserData = localStorage.getItem("insuranceUserData")
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData)
        setUserData(parsedData)
        setStep(2) // Move to document extraction step

        // Check if document data exists
        const storedDocumentData = localStorage.getItem("extractedInsuranceData")
        if (storedDocumentData) {
          try {
            const parsedDocData = JSON.parse(storedDocumentData)
            setExtractedData(parsedDocData)
            setStep(3) // Move to verification step

            // Check if verification result exists
            const verificationKey =
              parsedDocData.documentType?.toLowerCase() === "home" ? "homeVerificationResult" : "carVerificationResult"

            const storedVerificationResult = localStorage.getItem(verificationKey)
            if (storedVerificationResult) {
              try {
                const parsedVerificationResult = JSON.parse(storedVerificationResult)
                setVerificationResult(parsedVerificationResult)

                // Check if damage assessment exists (for car insurance only)
                if (parsedDocData.documentType?.toLowerCase() !== "home") {
                  const storedAssessmentResult = localStorage.getItem("damageAssessmentResult")
                  if (storedAssessmentResult) {
                    try {
                      const parsedAssessmentResult = JSON.parse(storedAssessmentResult)
                      setAssessmentResult(parsedAssessmentResult)
                      setStep(5) // Move to completion step
                    } catch (e) {
                      console.error("Error parsing stored assessment result:", e)
                      setStep(4) // Move to damage assessment step
                    }
                  } else {
                    setStep(4) // Move to damage assessment step
                  }
                } else {
                  setStep(5) // Move to completion step for home insurance
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
  }, [])

  // Handle policy verification completion
  const handlePolicyVerified = (data) => {
    setUserData(data)
    setStep(2)
  }

  // Handle document extraction completion
  const handleDocumentProcessed = (data) => {
    setExtractedData(data)
    setStep(3)
  }

  // Handle verification completion
  const handleVerificationComplete = (result) => {
    setVerificationResult(result)

    // For car insurance, proceed to damage assessment
    // For home insurance, skip to completion
    if (userData?.policyType?.toLowerCase() === "home") {
      setStep(5) // Skip to completion for home insurance
    } else {
      setStep(4) // Go to damage assessment for car insurance
    }
  }

  // Handle damage assessment completion
  const handleAssessmentComplete = (result) => {
    setAssessmentResult(result)
    setStep(5) // Move to completion step
  }

  // Reset the application
  const resetApplication = () => {
    // Clear localStorage
    localStorage.removeItem("insuranceUserData")
    localStorage.removeItem("extractedInsuranceData")
    localStorage.removeItem("carVerificationResult")
    localStorage.removeItem("homeVerificationResult")
    localStorage.removeItem("carImageData")
    localStorage.removeItem("damageImageData")
    localStorage.removeItem("damageAssessmentResult")

    // Reset state
    setUserData(null)
    setExtractedData(null)
    setVerificationResult(null)
    setAssessmentResult(null)
    setStep(1)
  }

  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 1:
        return <PolicyVerification onPolicyVerified={handlePolicyVerified} />
      case 2:
        return <DocumentExtractor userData={userData} onDocumentProcessed={handleDocumentProcessed} />
      case 3:
        // Render different verification component based on policy type
        if (userData?.policyType?.toLowerCase() === "home") {
          return (
            <HomeVerification
              userData={userData}
              extractedData={extractedData}
              onVerificationComplete={handleVerificationComplete}
            />
          )
        } else {
          return (
            <CarVerification
              userData={userData}
              extractedData={extractedData}
              onVerificationComplete={handleVerificationComplete}
            />
          )
        }
      case 4:
        // Damage assessment (car insurance only)
        return (
          <DamageAssessment
            userData={userData}
            extractedData={extractedData}
            verificationResult={verificationResult}
            onAssessmentComplete={handleAssessmentComplete}
          />
        )
      case 5:
        return renderCompletionStep()
      default:
        return <PolicyVerification onPolicyVerified={handlePolicyVerified} />
    }
  }

  // Render the completion step
  const renderCompletionStep = () => {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-[#333333] bg-[#1a1a1a] shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-[#6B46C1]/20 p-4 rounded-full">
                  <CheckCircle className="h-16 w-16 text-[#00FFFF]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Verification Complete</h2>
                <p className="text-gray-300 text-lg">
                  Your insurance document has been successfully processed and verified
                </p>

                <div className="flex items-center space-x-2 mt-4">
                  <Badge variant="outline" className="bg-black px-3 py-1 text-base text-white border-[#333333]">
                    {userData?.policyType || "Insurance"}
                  </Badge>
                  <Badge variant="outline" className="bg-black px-3 py-1 text-base text-white border-[#333333]">
                    {userData?.policyNumber || "Unknown Policy"}
                  </Badge>
                  {verificationResult?.isMatch && (
                    <Badge variant="outline" className="bg-black text-[#00FFFF] px-3 py-1 text-base border-[#333333]">
                      Verified
                    </Badge>
                  )}
                  {assessmentResult && !assessmentResult.skipped && (
                    <Badge
                      variant="outline"
                      className={`bg-black px-3 py-1 text-base border-[#333333] ${
                        assessmentResult.claimStatus === "Approved"
                          ? "text-green-400"
                          : assessmentResult.claimStatus === "Rejected"
                            ? "text-red-400"
                            : "text-[#00FFFF]"
                      }`}
                    >
                      {assessmentResult.claimStatus ||
                        (assessmentResult.isWithinCoverage ? "Claim Eligible" : "Coverage Exceeded")}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={resetApplication}
                  className="mt-6 bg-[#00FFFF] hover:bg-[#00CCCC] text-black font-medium"
                  size="lg"
                >
                  Start New Verification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary of all data */}
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-medium text-white">Verification Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-md border-[#333333] bg-black/40">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-[#6B46C1]/20 p-2 rounded-full">
                      <User className="h-5 w-5 text-[#6B46C1]" />
                    </div>
                    <h4 className="font-medium text-white">Policy Holder</h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-400">Name:</span> <span className="text-white">{userData?.name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Policy:</span>{" "}
                      <span className="text-white">{userData?.policyNumber}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Type:</span>{" "}
                      <span className="text-white">{userData?.policyType}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-[#333333] bg-black/40">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-[#6B46C1]/20 p-2 rounded-full">
                      {userData?.policyType?.toLowerCase() === "home" ? (
                        <Home className="h-5 w-5 text-[#6B46C1]" />
                      ) : (
                        <Car className="h-5 w-5 text-[#6B46C1]" />
                      )}
                    </div>
                    <h4 className="font-medium text-white">Document Details</h4>
                  </div>
                  <div className="space-y-2">
                    {userData?.policyType?.toLowerCase() === "home" ? (
                      <>
                        <p className="text-sm">
                          <span className="text-gray-400">Property:</span>{" "}
                          <span className="text-white">{extractedData?.propertyType}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Coverage:</span>{" "}
                          <span className="text-[#00FFFF]">{extractedData?.coverageAmount}</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm">
                          <span className="text-gray-400">Car Color:</span>{" "}
                          <span className="text-white">{extractedData?.carColor}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Number Plate:</span>{" "}
                          <span className="text-white">{extractedData?.numberPlate}</span>
                        </p>
                      </>
                    )}
                    <p className="text-sm">
                      <span className="text-gray-400">Valid Until:</span>{" "}
                      <span className="text-white">{extractedData?.policyEndDate}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-[#333333] bg-black/40">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-[#6B46C1]/20 p-2 rounded-full">
                      {assessmentResult && !assessmentResult.skipped ? (
                        <Wrench className="h-5 w-5 text-[#6B46C1]" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-[#6B46C1]" />
                      )}
                    </div>
                    <h4 className="font-medium text-white">
                      {assessmentResult && !assessmentResult.skipped ? "Damage Assessment" : "Verification Status"}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {userData?.policyType?.toLowerCase() === "home" ? (
                      <p className="text-sm">
                        <span className="text-gray-400">Status:</span> <span className="text-[#00FFFF]">Verified</span>
                      </p>
                    ) : assessmentResult && !assessmentResult.skipped ? (
                      <>
                        <p className="text-sm">
                          <span className="text-gray-400">Damage Severity:</span>{" "}
                          <span className="text-white">{assessmentResult.damageSeverity || "Unknown"}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Repair Cost:</span>{" "}
                          <span className="text-[#00FFFF]">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            }).format(assessmentResult.estimatedCost || 0)}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Status:</span>{" "}
                          <span
                            className={
                              assessmentResult.claimStatus === "Approved"
                                ? "text-green-400"
                                : assessmentResult.claimStatus === "Rejected"
                                  ? "text-red-400"
                                  : "text-[#00FFFF]"
                            }
                          >
                            {assessmentResult.claimStatus ||
                              (assessmentResult.isWithinCoverage ? "Claim Eligible" : "Coverage Exceeded")}
                          </span>
                        </p>
                        {assessmentResult.confidenceScore && (
                          <p className="text-sm">
                            <span className="text-gray-400">AI Confidence:</span>{" "}
                            <span className="text-white">{assessmentResult.confidenceScore}%</span>
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-sm">
                          <span className="text-gray-400">Plate Match:</span>{" "}
                          <span className="text-white">{verificationResult?.isMatch ? "Yes" : "No"}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Detected Plate:</span>{" "}
                          <span className="text-white">{verificationResult?.extractedPlate || "N/A"}</span>
                        </p>
                      </>
                    )}
                    <p className="text-sm">
                      <span className="text-gray-400">Completed:</span>{" "}
                      <span className="text-white">{new Date().toLocaleDateString()}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render progress steps
  const renderProgressSteps = () => {
    const steps = [
      { number: 1, label: "Policy Verification", icon: <User className="h-4 w-4" /> },
      { number: 2, label: "Document Extraction", icon: <FileText className="h-4 w-4" /> },
      {
        number: 3,
        label: "Verification",
        icon:
          userData?.policyType?.toLowerCase() === "home" ? <Home className="h-4 w-4" /> : <Car className="h-4 w-4" />,
      },
      // Add damage assessment step for car insurance
      ...(userData?.policyType?.toLowerCase() !== "home"
        ? [{ number: 4, label: "Damage Assessment", icon: <Wrench className="h-4 w-4" /> }]
        : []),
      {
        number: userData?.policyType?.toLowerCase() === "home" ? 4 : 5,
        label: "Complete",
        icon: <CheckCircle className="h-4 w-4" />,
      },
    ]

    return (
      <div className="container mx-auto py-4 px-4 mb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.number} className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s.number ? "bg-[#6B46C1] text-white" : "bg-[#1a1a1a] text-gray-400"}`}
                >
                  {s.icon}
                </div>
                <p className={`text-xs mt-2 ${step >= s.number ? "text-[#6B46C1] font-medium" : "text-gray-400"}`}>
                  {s.label}
                </p>
                {i < steps.length - 1 && (
                  <div
                    className={`absolute h-[2px] w-[calc(100%-2.5rem)] top-5 left-10 -z-10 ${step > s.number ? "bg-[#6B46C1]" : "bg-[#333333]"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black border-b border-[#333333] py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight text-[#6B46C1]">Insurance Document Verifier</h1>
            {userData && (
              <div className="flex items-center space-x-2">
                <div className="bg-[#6B46C1]/20 p-2 rounded-full">
                  {userData.policyType?.toLowerCase() === "home" ? (
                    <Home className="h-5 w-5 text-[#6B46C1]" />
                  ) : (
                    <Car className="h-5 w-5 text-[#6B46C1]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{userData.name}</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-gray-400">Policy: {userData.policyNumber}</p>
                    <Badge variant="outline" className="text-xs text-white border-[#333333]">
                      {userData.policyType || "Insurance"}
                    </Badge>
                  </div>
                </div>
                {step > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetApplication}
                    className="text-white border-[#333333] hover:bg-[#1a1a1a]"
                  >
                    Reset
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress steps */}
      {renderProgressSteps()}

      {/* Main content */}
      <main className="container mx-auto py-6 px-4">{renderStep()}</main>

      <footer className="bg-black border-t border-[#333333] py-4 mt-10">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-400">
            Insurance Document Verification System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

