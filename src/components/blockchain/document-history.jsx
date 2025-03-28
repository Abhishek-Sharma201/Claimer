"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, ArrowRight, History } from "lucide-react"
import { getDocumentHistory } from "@/lib/blockchain"

export default function DocumentHistory({ documentId, documentType }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (documentId) {
      const docHistory = getDocumentHistory(documentId, documentType)
      setHistory(docHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)))
    }
  }, [documentId, documentType])

  if (!documentId || history.length === 0) {
    return (
      <Card className="border-[#333333] bg-[#1a1a1a]">
        <CardContent className="pt-6">
          <p className="text-center text-gray-400">No document history available</p>
        </CardContent>
      </Card>
    )
  }

  // Function to find differences between versions
  const findDifferences = (oldDoc, newDoc) => {
    const differences = []

    // Skip if either is null
    if (!oldDoc || !newDoc) return differences

    // Compare each property
    Object.keys(newDoc).forEach((key) => {
      // Skip certain keys
      if (["id", "timestamp", "hash"].includes(key)) return

      if (JSON.stringify(oldDoc[key]) !== JSON.stringify(newDoc[key])) {
        differences.push({
          field: key,
          oldValue: oldDoc[key],
          newValue: newDoc[key],
        })
      }
    })

    return differences
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-[#6B46C1]" />
        <h2 className="text-xl font-bold text-white">Document Version History</h2>
      </div>

      <div className="space-y-4">
        {history.map((block, index) => {
          const prevBlock = index > 0 ? history[index - 1] : null
          const differences = findDifferences(prevBlock?.document, block.document)

          return (
            <Card key={block.blockHash} className="border-[#333333] bg-[#1a1a1a] overflow-hidden">
              <div className={`h-1 ${block.verified ? "bg-green-600" : "bg-yellow-600"}`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-base">
                    Version {index + 1} - {new Date(block.timestamp).toLocaleString()}
                  </CardTitle>
                  <Badge className={block.verified ? "bg-green-600" : "bg-yellow-600"}>
                    {block.verified ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[#00FFFF] border-[#333333]">
                      Hash: {block.documentHash.substring(0, 8)}...
                    </Badge>
                    {block.verified && (
                      <Badge variant="outline" className="text-green-400 border-[#333333]">
                        Verified by {block.verifiedBy}
                      </Badge>
                    )}
                  </div>

                  {index === 0 ? (
                    <div className="bg-[#6B46C1]/10 p-2 rounded border border-[#6B46C1]/20">
                      <p className="text-sm text-white">Initial document creation</p>
                    </div>
                  ) : differences.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Changes from previous version:</p>
                      {differences.map((diff, i) => (
                        <div key={i} className="bg-[#6B46C1]/10 p-2 rounded border border-[#6B46C1]/20">
                          <p className="text-sm font-medium text-white">{diff.field}:</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="text-xs text-gray-300 bg-black/50 p-1 rounded flex-1 overflow-hidden">
                              {typeof diff.oldValue === "object"
                                ? JSON.stringify(diff.oldValue)
                                : String(diff.oldValue || "N/A")}
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#00FFFF]" />
                            <div className="text-xs text-[#00FFFF] bg-black/50 p-1 rounded flex-1 overflow-hidden">
                              {typeof diff.newValue === "object"
                                ? JSON.stringify(diff.newValue)
                                : String(diff.newValue || "N/A")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#333333]/30 p-2 rounded">
                      <p className="text-sm text-gray-400">No changes in document data</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

