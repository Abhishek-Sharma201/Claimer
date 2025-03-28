"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, FileText, Shield, AlertTriangle } from "lucide-react"
import { validateBlockchain, getAllDocuments } from "../../lib/blockchain"

export default function BlockExplorer({ documentType = "all", isAdmin = false, onVerify }) {
  const [blockchainData, setBlockchainData] = useState([])
  const [validationResults, setValidationResults] = useState({})
  const [activeTab, setActiveTab] = useState(documentType === "all" ? "policy" : documentType)

  const documentTypes = ["policy", "car", "home", "damage", "claim"]

  useEffect(() => {
    loadBlockchainData()
  }, [activeTab])

  const loadBlockchainData = () => {
    if (activeTab === "all") {
      const allData = {}
      let combinedData = []

      documentTypes.forEach((type) => {
        const typeData = getAllDocuments(type)
        allData[type] = typeData
        combinedData = [...combinedData, ...typeData]
      })

      setBlockchainData(combinedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    } else {
      const data = getAllDocuments(activeTab)
      setBlockchainData(data)
    }

    // Validate each blockchain
    const validations = {}
    documentTypes.forEach((type) => {
      validations[type] = validateBlockchain(type)
    })
    setValidationResults(validations)
  }

  const handleVerify = (block) => {
    if (onVerify && isAdmin) {
      onVerify(block.blockHash)
    }
  }

  const getStatusBadge = (block) => {
    if (block.verified) {
      return (
        <Badge className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-3 w-3 mr-1" /> Verified
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-600 hover:bg-yellow-700">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>
      )
    }
  }

  const getDocumentTypeBadge = (block) => {
    const type = block.document.documentType?.toLowerCase() || (block.document.claimId ? "claim" : "policy")

    let color = "bg-[#6B46C1]"
    const icon = <FileText className="h-3 w-3 mr-1" />

    switch (type) {
      case "car":
        color = "bg-blue-600"
        break
      case "home":
        color = "bg-green-600"
        break
      case "damage":
        color = "bg-red-600"
        break
      case "claim":
        color = "bg-[#00FFFF] text-black"
        break
    }

    return (
      <Badge className={`${color} hover:${color}`}>
        {icon} {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Blockchain Explorer</h2>

        {Object.keys(validationResults).some((key) => validationResults[key] && !validationResults[key].valid) ? (
          <Badge className="bg-red-600 hover:bg-red-700">
            <AlertTriangle className="h-4 w-4 mr-1" /> Chain Integrity Issues
          </Badge>
        ) : (
          <Badge className="bg-[#00FFFF] text-black hover:bg-[#00DDDD]">
            <Shield className="h-4 w-4 mr-1" /> Chain Verified
          </Badge>
        )}
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#1a1a1a] border border-[#333333]">
          {documentType === "all" &&
            documentTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </TabsTrigger>
            ))}
        </TabsList>

        <div className="mt-4 space-y-4">
          {blockchainData.length === 0 ? (
            <Card className="border-[#333333] bg-[#1a1a1a]">
              <CardContent className="pt-6">
                <p className="text-center text-gray-400">No blockchain data found for this type</p>
              </CardContent>
            </Card>
          ) : (
            blockchainData.map((block, index) => (
              <Card key={block.blockHash} className="border-[#333333] bg-[#1a1a1a] overflow-hidden">
                <div className={`h-1 ${block.verified ? "bg-green-600" : "bg-yellow-600"}`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        Block #{index + 1}
                        {getStatusBadge(block)}
                        {getDocumentTypeBadge(block)}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Created: {new Date(block.timestamp).toLocaleString()}
                      </CardDescription>
                    </div>
                    {isAdmin && !block.verified && (
                      <Button
                        onClick={() => handleVerify(block)}
                        className="bg-[#6B46C1] hover:bg-[#5B36B1] text-white"
                      >
                        Verify Block
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Document Hash:</p>
                        <p className="text-sm font-mono bg-black p-1 rounded text-[#00FFFF]">{block.documentHash}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Block Hash:</p>
                        <p className="text-sm font-mono bg-black p-1 rounded text-[#00FFFF]">{block.blockHash}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Previous Block Hash:</p>
                      <p className="text-sm font-mono bg-black p-1 rounded text-gray-300">{block.previousHash}</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-1">Document Data:</p>
                      <div className="bg-black p-2 rounded max-h-32 overflow-auto">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                          {JSON.stringify(block.document, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#333333] bg-black/30">
                  <div className="w-full flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      {block.verified ? (
                        <span>
                          Verified by {block.verifiedBy} at {new Date(block.verifiedAt).toLocaleString()}
                        </span>
                      ) : (
                        <span>Pending verification</span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-[#00FFFF] border-[#333333]">
                      {block.document.id || block.document.policyNumber || block.document.claimId || "Unknown ID"}
                    </Badge>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </Tabs>
    </div>
  )
}

