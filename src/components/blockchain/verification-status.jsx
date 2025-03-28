"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Shield, AlertTriangle, Search } from "lucide-react"
import { getDocumentHistory } from "@/lib/blockchain"

export default function VerificationStatus({ documentId, documentType, showDetails = true }) {
  const [status, setStatus] = useState({
    verified: false,
    pending: false,
    rejected: false,
    history: [],
    latestBlock: null,
  })

  useEffect(() => {
    if (documentId) {
      const history = getDocumentHistory(documentId, documentType)

      if (history.length > 0) {
        // Sort by timestamp (newest first)
        const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        const latestBlock = sortedHistory[0]

        setStatus({
          verified: latestBlock.verified,
          pending: !latestBlock.verified,
          rejected: false, // We don't have rejection in our model yet
          history: sortedHistory,
          latestBlock,
        })
      }
    }
  }, [documentId, documentType])

  const getStatusBadge = () => {
    if (status.verified) {
      return (
        <Badge className="bg-green-600 text-white">
          <CheckCircle className="h-4 w-4 mr-1" /> Verified on Blockchain
        </Badge>
      )
    } else if (status.rejected) {
      return (
        <Badge className="bg-red-600 text-white">
          <XCircle className="h-4 w-4 mr-1" /> Verification Failed
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-600 text-white">
          <Clock className="h-4 w-4 mr-1" /> Pending Verification
        </Badge>
      )
    }
  }

  if (!documentId || status.history.length === 0) {
    return (
      <Card className="border-[#333333] bg-[#1a1a1a]">
        <CardContent className="pt-6 flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <p className="text-center text-gray-300">This document has not been added to the blockchain</p>
          <p className="text-center text-gray-400 text-sm mt-2">
            Documents must be processed through the verification system first
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#333333] bg-[#1a1a1a] overflow-hidden">
      <div
        className={`h-1 ${status.verified ? "bg-green-600" : status.rejected ? "bg-red-600" : "bg-yellow-600"}`}
      ></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Blockchain Verification Status</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Document ID:</p>
              <p className="text-sm font-medium text-white">{documentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Updated:</p>
              <p className="text-sm font-medium text-white">
                {new Date(status.latestBlock.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400">Document Hash:</p>
            <p className="text-sm font-mono bg-black p-1 rounded text-[#00FFFF]">{status.latestBlock.documentHash}</p>
          </div>

          {status.verified && (
            <div>
              <p className="text-sm text-gray-400">Verified By:</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium text-white">{status.latestBlock.verifiedBy}</p>
                <p className="text-xs text-gray-400">at {new Date(status.latestBlock.verifiedAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          {showDetails && (
            <div className="mt-2 pt-4 border-t border-[#333333]">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-white">Version History</p>
                <Badge className="bg-[#6B46C1]">{status.history.length} Versions</Badge>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {status.history.map((block, index) => (
                  <div
                    key={block.blockHash}
                    className="flex justify-between items-center p-2 bg-black/30 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {block.verified ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-yellow-500" />
                      )}
                      <span className="text-gray-300">
                        Version {status.history.length - index} - {new Date(block.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#00FFFF]">{block.blockHash.substring(0, 6)}...</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-[#333333] text-[#00FFFF] hover:bg-[#1a1a1a]"
                onClick={() => (window.location.href = `/user/document-history?id=${documentId}&type=${documentType}`)}
              >
                <Search className="h-4 w-4 mr-2" /> View Complete History
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

