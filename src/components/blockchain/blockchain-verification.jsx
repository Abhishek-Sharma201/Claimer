"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  Clock,
  Shield,
  AlertTriangle,
  FileText,
  Database,
  Search,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Hash,
  Calendar,
  User,
} from "lucide-react"

import {
  getBlockchain,
  validateBlockchain,
  verifyBlock,
  getDocumentById,
  tamperWithBlockchain,
  initializeBlockchain,
} from "../../lib/blockchain"

export default function BlockchainVerification() {
  const [blockchain, setBlockchain] = useState([])
  const [validationResult, setValidationResult] = useState({ valid: true, errors: [] })
  const [activeTab, setActiveTab] = useState("explorer")
  const [adminMode, setAdminMode] = useState(false)
  const [adminId, setAdminId] = useState("ADMIN-1")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [expandedBlocks, setExpandedBlocks] = useState({})
  const [showRawData, setShowRawData] = useState({})

  // Load blockchain data on component mount
  useEffect(() => {
    initializeBlockchain()
    loadBlockchainData()
  }, [])

  // Load blockchain data
  const loadBlockchainData = () => {
    const chain = getBlockchain()
    setBlockchain(chain)

    // Validate blockchain
    const validation = validateBlockchain()
    setValidationResult(validation)
  }

  // Handle block verification
  const handleVerifyBlock = (blockHash) => {
    if (!adminMode) return

    const result = verifyBlock(blockHash, adminId)
    if (result.success) {
      loadBlockchainData()
    }
  }

  // Handle blockchain tampering (for demo)
  const handleTamperBlockchain = () => {
    const result = tamperWithBlockchain()
    if (result.success) {
      loadBlockchainData()
    }
  }

  // Handle document search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const results = getDocumentById(searchQuery)
    setSearchResults(results)
  }

  // Toggle block expansion
  const toggleBlockExpansion = (blockHash) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [blockHash]: !prev[blockHash],
    }))
  }

  // Toggle raw data view
  const toggleRawData = (blockHash) => {
    setShowRawData((prev) => ({
      ...prev,
      [blockHash]: !prev[blockHash],
    }))
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  // Render block status badge
  const renderStatusBadge = (block) => {
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

  // Render document type badge
  const renderDocumentTypeBadge = (document) => {
    const type = document.type || document.documentType || "unknown"

    let color = "bg-[#6B46C1]"
    const icon = <FileText className="h-3 w-3 mr-1" />

    switch (type.toLowerCase()) {
      case "policy":
        color = "bg-[#6B46C1]"
        break
      case "document":
        color = "bg-blue-600"
        break
      case "assessment":
        color = "bg-red-600"
        break
      case "claim":
        color = "bg-[#00FFFF] text-black"
        break
      case "system":
        color = "bg-gray-600"
        break
    }

    return (
      <Badge className={`${color}`}>
        {icon} {document.documentType || type}
      </Badge>
    )
  }

  // Render a single block
  const renderBlock = (block, index, isSearchResult = false) => {
    const isExpanded = expandedBlocks[block.blockHash] || false
    const showRaw = showRawData[block.blockHash] || false

    return (
      <Card key={block.blockHash} className="border-[#333333] bg-[#1a1a1a] overflow-hidden mb-4">
        <div className={`h-1 ${block.verified ? "bg-green-600" : "bg-yellow-600"}`}></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                Block #{index + 1}
                {renderStatusBadge(block)}
                {renderDocumentTypeBadge(block.document)}
              </CardTitle>
              <CardDescription className="text-gray-400">Created: {formatDate(block.timestamp)}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {adminMode && !block.verified && (
                <Button
                  onClick={() => handleVerifyBlock(block.blockHash)}
                  className="bg-[#6B46C1] hover:bg-[#5B36B1] text-white"
                  size="sm"
                >
                  Verify Block
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleBlockExpansion(block.blockHash)}
                className="border-[#333333] text-white hover:bg-[#333333]"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Document Hash:</p>
                  <div className="flex items-center bg-black p-2 rounded overflow-hidden">
                    <Hash className="h-4 w-4 text-[#00FFFF] mr-2 flex-shrink-0" />
                    <p className="text-sm font-mono text-[#00FFFF] truncate">{block.documentHash}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Block Hash:</p>
                  <div className="flex items-center bg-black p-2 rounded overflow-hidden">
                    <Hash className="h-4 w-4 text-[#00FFFF] mr-2 flex-shrink-0" />
                    <p className="text-sm font-mono text-[#00FFFF] truncate">{block.blockHash}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Previous Block Hash:</p>
                <div className="flex items-center bg-black p-2 rounded overflow-hidden">
                  <Hash className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <p className="text-sm font-mono text-gray-400 truncate">{block.previousHash}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-400">Document Data:</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRawData(block.blockHash)}
                    className="h-6 text-xs text-gray-400 hover:text-white"
                  >
                    {showRaw ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" /> Formatted
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" /> Raw JSON
                      </>
                    )}
                  </Button>
                </div>

                {showRaw ? (
                  <div className="bg-black p-2 rounded max-h-60 overflow-auto">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(block.document, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-black p-3 rounded max-h-60 overflow-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(block.document).map(([key, value]) => {
                        // Skip certain fields
                        if (["type", "documentType"].includes(key)) return null

                        // Format the value
                        let displayValue = value
                        if (typeof value === "object" && value !== null) {
                          displayValue = JSON.stringify(value)
                        }

                        return (
                          <div key={key} className="overflow-hidden">
                            <p className="text-xs text-gray-400 truncate">{key}:</p>
                            <p className="text-xs text-white truncate">{displayValue}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {block.verified && (
                <div className="bg-green-900/20 p-3 rounded border border-green-900/30">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm text-green-400">Verified by {block.verifiedBy}</p>
                      <p className="text-xs text-gray-400">at {formatDate(block.verifiedAt)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}

        <CardFooter className="border-t border-[#333333] bg-black/30 py-2">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 text-gray-400 mr-1" />
              <p className="text-xs text-gray-400">{formatDate(block.timestamp)}</p>
            </div>
            <div>
              {block.document.id && (
                <Badge variant="outline" className="text-[#00FFFF] border-[#333333]">
                  ID: {block.document.id}
                </Badge>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-[#6B46C1]" />
          <h2 className="text-2xl font-bold text-white">Blockchain Document Verification</h2>
        </div>

        <div className="flex items-center gap-2">
          {validationResult.valid ? (
            <Badge className="bg-[#00FFFF] text-black hover:bg-[#00DDDD]">
              <Lock className="h-4 w-4 mr-1" /> Chain Verified
            </Badge>
          ) : (
            <Badge className="bg-red-600 hover:bg-red-700">
              <Unlock className="h-4 w-4 mr-1" /> Chain Integrity Issues
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdminMode(!adminMode)}
            className={`border-[#333333] ${adminMode ? "text-[#00FFFF]" : "text-white"} hover:bg-[#333333]`}
          >
            {adminMode ? (
              <>
                <Shield className="h-4 w-4 mr-1" /> Admin Mode
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-1" /> User Mode
              </>
            )}
          </Button>
        </div>
      </div>

      {!validationResult.valid && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900/30 text-red-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Blockchain Integrity Compromised</AlertTitle>
          <AlertDescription>
            The blockchain has been tampered with. {validationResult.errors.length} integrity issues detected.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#1a1a1a] border border-[#333333]">
          <TabsTrigger value="explorer" className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white">
            Blockchain Explorer
          </TabsTrigger>
          <TabsTrigger value="search" className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white">
            Document Search
          </TabsTrigger>
          {adminMode && (
            <TabsTrigger value="admin" className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white">
              Admin Tools
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="explorer" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-white">Blockchain Blocks</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={loadBlockchainData}
                className="border-[#333333] text-white hover:bg-[#333333]"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {blockchain.length === 0 ? (
                <Card className="border-[#333333] bg-[#1a1a1a]">
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-400">No blockchain data found</p>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  <div className="bg-[#6B46C1]/10 p-4 rounded border border-[#6B46C1]/20 mb-6">
                    <div className="flex items-start">
                      <Database className="h-5 w-5 text-[#6B46C1] mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-white font-medium">Blockchain Statistics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-sm text-gray-400">Total Blocks</p>
                            <p className="text-xl font-medium text-white">{blockchain.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Verified Blocks</p>
                            <p className="text-xl font-medium text-green-400">
                              {blockchain.filter((b) => b.verified).length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Pending Blocks</p>
                            <p className="text-xl font-medium text-yellow-400">
                              {blockchain.filter((b) => !b.verified).length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Chain Status</p>
                            <p
                              className={`text-xl font-medium ${validationResult.valid ? "text-[#00FFFF]" : "text-red-400"}`}
                            >
                              {validationResult.valid ? "Valid" : "Compromised"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {blockchain.map((block, index) => renderBlock(block, index))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <div className="space-y-6">
            <Card className="border-[#333333] bg-[#1a1a1a]">
              <CardHeader>
                <CardTitle className="text-white">Search Documents</CardTitle>
                <CardDescription className="text-gray-400">
                  Search for documents by ID, policy number, or claim ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter document ID, policy number, or claim ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black border-[#333333] text-white"
                  />
                  <Button onClick={handleSearch} className="bg-[#6B46C1] hover:bg-[#5B36B1] text-white">
                    <Search className="h-4 w-4 mr-1" /> Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {searchResults.length > 0 ? (
                <div>
                  <h3 className="text-xl font-medium text-white mb-4">Search Results</h3>
                  {searchResults.map((block, index) => renderBlock(block, index, true))}
                </div>
              ) : searchQuery ? (
                <Card className="border-[#333333] bg-[#1a1a1a]">
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-400">No documents found matching your search</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </TabsContent>

        {adminMode && (
          <TabsContent value="admin" className="mt-6">
            <div className="space-y-6">
              <Card className="border-[#333333] bg-[#1a1a1a]">
                <CardHeader>
                  <CardTitle className="text-white">Admin Tools</CardTitle>
                  <CardDescription className="text-gray-400">Advanced tools for blockchain management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Admin ID:</p>
                      <Input
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        className="bg-black border-[#333333] text-white"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#333333]">
                      <h4 className="text-white font-medium mb-3">Blockchain Operations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={loadBlockchainData} className="bg-[#6B46C1] hover:bg-[#5B36B1] text-white">
                          <RefreshCw className="h-4 w-4 mr-1" /> Refresh Blockchain
                        </Button>

                        <Button
                          onClick={handleTamperBlockchain}
                          variant="destructive"
                          className="bg-red-700 hover:bg-red-800"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" /> Tamper With Blockchain (Demo)
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#333333]">
                      <h4 className="text-white font-medium mb-3">Pending Verifications</h4>
                      <div className="space-y-3">
                        {blockchain.filter((b) => !b.verified).length === 0 ? (
                          <p className="text-gray-400">No pending verifications</p>
                        ) : (
                          blockchain
                            .filter((b) => !b.verified)
                            .map((block, index) => (
                              <div
                                key={block.blockHash}
                                className="flex justify-between items-center p-3 bg-black/30 rounded border border-[#333333]"
                              >
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-yellow-500" />
                                  <div>
                                    <p className="text-sm text-white">Block #{blockchain.indexOf(block) + 1}</p>
                                    <p className="text-xs text-gray-400">Created: {formatDate(block.timestamp)}</p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleVerifyBlock(block.blockHash)}
                                  size="sm"
                                  className="bg-[#6B46C1] hover:bg-[#5B36B1] text-white"
                                >
                                  Verify Block
                                </Button>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

