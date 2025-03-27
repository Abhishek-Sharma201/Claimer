"use client"

import { useState } from "react"
import {
  Search,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  X,
  Eye,
  Check,
  Download,
} from "lucide-react"

// Sample data for demonstration
const initialClaims = [
  {
    id: "CLM-2024-001",
    policyholder: "John Smith",
    insuranceType: "Auto Insurance",
    amount: 12500,
    submissionDate: "2024-01-15",
    status: "Pending",
    aiConfidence: 92,
    documents: [
      { name: "Insurance Policy.pdf", url: "#" },
      { name: "Vehicle Damage Report.pdf", url: "#" },
      { name: "Repair Estimate.pdf", url: "#" },
    ],
  },
  {
    id: "CLM-2024-002",
    policyholder: "Sarah Johnson",
    insuranceType: "Health Insurance",
    amount: 5750,
    submissionDate: "2024-01-14",
    status: "Approved",
    aiConfidence: 95,
    documents: [
      { name: "Insurance Policy.pdf", url: "#" },
      { name: "Medical Report.pdf", url: "#" },
    ],
  },
  {
    id: "CLM-2024-003",
    policyholder: "Michael Brown",
    insuranceType: "Property Insurance",
    amount: 25000,
    submissionDate: "2024-01-13",
    status: "Rejected",
    aiConfidence: 45,
    documents: [
      { name: "Insurance Policy.pdf", url: "#" },
      { name: "Property Damage Report.pdf", url: "#" },
    ],
  },
]

export default function ClaimsManagementAllInOne() {
  const [claims] = useState(initialClaims)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClaims = claims.filter(
    (claim) =>
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.policyholder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.insuranceType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleClaimSelect = (claim) => {
    setSelectedClaim(claim)
  }

  const handleCloseDetails = () => {
    setSelectedClaim(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121218] text-white">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Claims Management</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Claims */}
            <div className="bg-[#1E1E24] rounded-lg p-4 flex items-center">
              <div className="mr-4 text-[#4285F4]">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">2,451</p>
                <p className="text-gray-400">Total Claims</p>
              </div>
            </div>

            {/* Pending Claims */}
            <div className="bg-[#1E1E24] rounded-lg p-4 flex items-center">
              <div className="mr-4 text-[#F9A825]">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">482</p>
                <p className="text-gray-400">Pending Claims</p>
              </div>
            </div>

            {/* Approved Claims */}
            <div className="bg-[#1E1E24] rounded-lg p-4 flex items-center">
              <div className="mr-4 text-[#34A853]">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">1,857</p>
                <p className="text-gray-400">Approved Claims</p>
              </div>
            </div>

            {/* Fraud Suspected */}
            <div className="bg-[#1E1E24] rounded-lg p-4 flex items-center">
              <div className="mr-4 text-[#EA4335]">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">112</p>
                <p className="text-gray-400">Fraud Suspected</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                className="pl-10 bg-[#1E1E24] border border-[#2A2A33] text-white h-10 rounded-md w-full px-3"
                placeholder="Search claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="bg-[#1E1E24] border border-[#2A2A33] text-white h-10 rounded-md px-4 flex items-center">
              <Calendar className="mr-2" size={18} />
              Date Range
            </button>

            <button className="bg-[#1E1E24] border border-[#2A2A33] text-white h-10 rounded-md px-4 flex items-center">
              <Filter className="mr-2" size={18} />
              Status
            </button>

            <button className="bg-[#1E1E24] border border-[#2A2A33] text-white h-10 rounded-md px-4 flex items-center">
              <Filter className="mr-2" size={18} />
              Insurance Type
            </button>
          </div>

          {/* Claims Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="py-3 px-4">Claim ID</th>
                  <th className="py-3 px-4">Policyholder</th>
                  <th className="py-3 px-4">Insurance Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="border-t border-[#2A2A33] hover:bg-[#23232B] cursor-pointer"
                    onClick={() => handleClaimSelect(claim)}
                  >
                    <td className="py-4 px-4 text-white">{claim.id}</td>
                    <td className="py-4 px-4 text-white">{claim.policyholder}</td>
                    <td className="py-4 px-4 text-white">{claim.insuranceType}</td>
                    <td className="py-4 px-4 text-white">${claim.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-white">{claim.submissionDate}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          claim.status === "Approved"
                            ? "bg-[#0D3320] text-[#34A853]"
                            : claim.status === "Pending"
                              ? "bg-[#3D2E05] text-[#F9A825]"
                              : "bg-[#3D1513] text-[#EA4335]"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="h-8 w-8 rounded-full bg-[#0D3320] text-[#34A853] hover:bg-[#0D3320]/80 flex items-center justify-center">
                          <Check size={16} />
                        </button>
                        <button className="h-8 w-8 rounded-full bg-[#3D1513] text-[#EA4335] hover:bg-[#3D1513]/80 flex items-center justify-center">
                          <X size={16} />
                        </button>
                        <button className="h-8 w-8 rounded-full bg-[#3D2E05] text-[#F9A825] hover:bg-[#3D2E05]/80 flex items-center justify-center">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claim Details Sidebar */}
        {selectedClaim && (
          <div className="w-full lg:w-96 border-l border-[#2A2A33] bg-[#1E1E24] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Claim Details</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-white hover:bg-[#23232B] h-8 w-8 rounded-full flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Basic Information */}
              <div className="mb-8 bg-[#23232B] rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-white">Basic Information</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Claim ID</p>
                    <p className="text-white">{selectedClaim.id}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Policyholder</p>
                    <p className="text-white">{selectedClaim.policyholder}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Insurance Type</p>
                    <p className="text-white">{selectedClaim.insuranceType}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Amount</p>
                    <p className="text-white">${selectedClaim.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="mb-8 bg-[#23232B] rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-white">AI Analysis</h3>

                <div className="bg-[#1A2151] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#6B46C1]">Auto-Approval Suggested</span>
                    <span className="text-[#805AD5] font-bold">{selectedClaim.aiConfidence}%</span>
                  </div>

                  <p className="text-sm text-gray-300">
                    Based on historical data and claim patterns, this claim has a high probability of being legitimate.
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-[#23232B] rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-white">Documents</h3>

                <div className="space-y-3">
                  {selectedClaim.documents.map((doc, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-[#1E1E24] rounded-lg">
                      <span className="text-white">{doc.name}</span>
                      <button className="text-[#6B46C1] hover:text-[#805AD5] h-8 w-8 flex items-center justify-center">
                        <Download size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

