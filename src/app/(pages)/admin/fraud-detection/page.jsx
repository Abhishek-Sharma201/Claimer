"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  FileText,
  MapPin,
  Check,
  X,
  Flag,
  Filter,
  ArrowUpDown,
  Eye,
  BarChartIcon as ChartBar,
  Clock,
  User,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

// Sample data for demonstration
const initialAlerts = [
  {
    id: 1,
    type: "Multiple Claims",
    description: "3 claims submitted in 24 hours",
    icon: <AlertTriangle className="h-5 w-5 text-[#6B46C1]" />,
    time: "2 minutes ago",
    status: "active",
    severity: "high",
  },
  {
    id: 2,
    type: "Fake Documents",
    description: "Suspicious document patterns detected",
    icon: <FileText className="h-5 w-5 text-[#6B46C1]" />,
    time: "15 minutes ago",
    status: "active",
    severity: "medium",
  },
  {
    id: 3,
    type: "Location Mismatch",
    description: "Claim location differs from policy address",
    icon: <MapPin className="h-5 w-5 text-[#6B46C1]" />,
    time: "1 hour ago",
    status: "active",
    severity: "low",
  },
]

const initialFlaggedClaims = [
  {
    id: "CLM-7829",
    policyholder: "John Anderson",
    type: "Auto",
    fraudType: "Multiple Claims",
    status: "Under Review",
    risk: "High",
  },
  {
    id: "CLM-7830",
    policyholder: "Sarah Mitchell",
    type: "Health",
    fraudType: "Document Fraud",
    status: "Pending",
    risk: "Medium",
  },
  {
    id: "CLM-7831",
    policyholder: "Robert Wilson",
    type: "Property",
    fraudType: "Location Mismatch",
    status: "Escalated",
    risk: "High",
  },
  {
    id: "CLM-7832",
    policyholder: "Emily Brown",
    type: "Life",
    fraudType: "Identity Mismatch",
    status: "Pending",
    risk: "Low",
  },
]

const initialActivities = [
  {
    id: 1,
    type: "Claim Approved",
    claimId: "CLM-7825",
    by: "Admin Smith",
    time: "10 minutes ago",
    icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
  },
  {
    id: 2,
    type: "Claim Rejected",
    claimId: "CLM-7824",
    by: "Admin Johnson",
    time: "25 minutes ago",
    icon: <ThumbsDown className="h-5 w-5 text-red-500" />,
  },
  {
    id: 3,
    type: "Flagged for Review",
    claimId: "CLM-7823",
    by: "Admin Davis",
    time: "1 hour ago",
    icon: <Flag className="h-5 w-5 text-yellow-500" />,
  },
]

export default function FraudDetectionDashboard() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [flaggedClaims, setFlaggedClaims] = useState(initialFlaggedClaims)
  const [activities, setActivities] = useState(initialActivities)
  const [loading, setLoading] = useState(false)

  // Simulate fetching data from backend
  useEffect(() => {
    // In a real application, you would fetch data from your API here
    const fetchData = async () => {
      setLoading(true)
      try {
        // Example API calls:
        // const alertsResponse = await fetch('/api/alerts');
        // const alertsData = await alertsResponse.json();
        // setAlerts(alertsData);

        // const claimsResponse = await fetch('/api/flagged-claims');
        // const claimsData = await claimsResponse.json();
        // setFlaggedClaims(claimsData);

        // const activitiesResponse = await fetch('/api/activities');
        // const activitiesData = await activitiesResponse.json();
        // setActivities(activitiesData);

        // Using sample data for now
        setAlerts(initialAlerts)
        setFlaggedClaims(initialFlaggedClaims)
        setActivities(initialActivities)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle alert actions
  const handleAlertApprove = async (alertId) => {
    // In a real app, you would call your API here
    // await fetch(`/api/alerts/${alertId}/approve`, { method: 'POST' });

    // Update UI optimistically
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "approved" } : alert)))
  }

  const handleAlertReject = async (alertId) => {
    // In a real app, you would call your API here
    // await fetch(`/api/alerts/${alertId}/reject`, { method: 'POST' });

    // Update UI optimistically
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "rejected" } : alert)))
  }

  const handleAlertFlag = async (alertId) => {
    // In a real app, you would call your API here
    // await fetch(`/api/alerts/${alertId}/flag`, { method: 'POST' });

    // Update UI optimistically
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "flagged" } : alert)))
  }

  // Handle claim actions
  const handleClaimApprove = async (claimId) => {
    // In a real app, you would call your API here
    // await fetch(`/api/claims/${claimId}/approve`, { method: 'POST' });

    // Update UI optimistically
    setFlaggedClaims(flaggedClaims.map((claim) => (claim.id === claimId ? { ...claim, status: "Approved" } : claim)))

    // Add to activities
    const newActivity = {
      id: Date.now(),
      type: "Claim Approved",
      claimId: claimId,
      by: "Current User", // In a real app, get from auth context
      time: "Just now",
      icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
    }
    setActivities([newActivity, ...activities])
  }

  const handleClaimReject = async (claimId) => {
    // In a real app, you would call your API here
    // await fetch(`/api/claims/${claimId}/reject`, { method: 'POST' });

    // Update UI optimistically
    setFlaggedClaims(flaggedClaims.map((claim) => (claim.id === claimId ? { ...claim, status: "Rejected" } : claim)))

    // Add to activities
    const newActivity = {
      id: Date.now(),
      type: "Claim Rejected",
      claimId: claimId,
      by: "Current User", // In a real app, get from auth context
      time: "Just now",
      icon: <ThumbsDown className="h-5 w-5 text-red-500" />,
    }
    setActivities([newActivity, ...activities])
  }

  return (
    <div className="min-h-screen bg-[#121218] text-white p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Alerts Section */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Real-time Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-[#1E1E24] rounded-lg p-4 relative">
                {alert.severity === "high" && (
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500"></div>
                )}
                {alert.severity === "medium" && (
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-yellow-500"></div>
                )}
                {alert.severity === "low" && (
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-green-500"></div>
                )}
                <div className="flex items-start mb-2">
                  {alert.icon}
                  <div className="ml-2">
                    <h3 className="font-medium">{alert.type}</h3>
                    <p className="text-sm text-gray-400">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.time}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAlertApprove(alert.id)}
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        alert.status === "approved"
                          ? "bg-green-900 text-green-300"
                          : "bg-[#0D3320] text-[#34A853] hover:bg-[#0D3320]/80"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAlertReject(alert.id)}
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        alert.status === "rejected"
                          ? "bg-red-900 text-red-300"
                          : "bg-[#3D1513] text-[#EA4335] hover:bg-[#3D1513]/80"
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAlertFlag(alert.id)}
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        alert.status === "flagged"
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-[#3D2E05] text-[#F9A825] hover:bg-[#3D2E05]/80"
                      }`}
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Claims Section */}
        <div className="lg:col-span-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Flagged Claims</h2>
            <div className="flex space-x-2">
              <button className="bg-[#1E1E24] hover:bg-[#2A2A33] px-3 py-1.5 rounded-md text-sm flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
              <button className="bg-[#1E1E24] hover:bg-[#2A2A33] px-3 py-1.5 rounded-md text-sm flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                Sort
              </button>
            </div>
          </div>
          <div className="bg-[#1E1E24] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-[#2A2A33]">
                    <th className="py-3 px-4 text-sm font-medium">Claim ID</th>
                    <th className="py-3 px-4 text-sm font-medium">Policyholder</th>
                    <th className="py-3 px-4 text-sm font-medium">Type</th>
                    <th className="py-3 px-4 text-sm font-medium">Fraud Type</th>
                    <th className="py-3 px-4 text-sm font-medium">Status</th>
                    <th className="py-3 px-4 text-sm font-medium">Risk</th>
                    <th className="py-3 px-4 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flaggedClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-[#2A2A33] hover:bg-[#23232B]">
                      <td className="py-3 px-4">{claim.id}</td>
                      <td className="py-3 px-4">{claim.policyholder}</td>
                      <td className="py-3 px-4">{claim.type}</td>
                      <td className="py-3 px-4">{claim.fraudType}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            claim.status === "Under Review"
                              ? "bg-[#3D2E05] text-[#F9A825]"
                              : claim.status === "Pending"
                                ? "bg-[#0D3320] text-[#34A853]"
                                : claim.status === "Escalated"
                                  ? "bg-[#3D1513] text-[#EA4335]"
                                  : claim.status === "Approved"
                                    ? "bg-[#0D3320] text-[#34A853]"
                                    : "bg-[#3D1513] text-[#EA4335]"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            claim.risk === "High"
                              ? "bg-[#3D1513] text-[#EA4335]"
                              : claim.risk === "Medium"
                                ? "bg-[#3D2E05] text-[#F9A825]"
                                : "bg-[#0D3320] text-[#34A853]"
                          }`}
                        >
                          {claim.risk}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleClaimApprove(claim.id)}
                            className="h-7 w-7 rounded-full bg-[#0D3320] text-[#34A853] hover:bg-[#0D3320]/80 flex items-center justify-center"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleClaimReject(claim.id)}
                            className="h-7 w-7 rounded-full bg-[#3D1513] text-[#EA4335] hover:bg-[#3D1513]/80 flex items-center justify-center"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button className="h-7 w-7 rounded-full bg-[#1A2151] text-[#6B46C1] hover:bg-[#1A2151]/80 flex items-center justify-center">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          <div className="space-y-4">
            {/* Pattern Detection */}
            <div className="bg-[#1E1E24] rounded-lg p-4">
              <div className="flex items-start mb-2">
                <ChartBar className="h-5 w-5 text-[#6B46C1]" />
                <h3 className="ml-2 font-medium">Pattern Detection</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Similar claim patterns detected across multiple policies in the last 24 hours.
              </p>
              <button className="w-full py-2 bg-[#1A2151] hover:bg-[#1A2151]/80 text-[#6B46C1] rounded-md text-sm">
                View Analysis
              </button>
            </div>

            {/* User History */}
            <div className="bg-[#1E1E24] rounded-lg p-4">
              <div className="flex items-start mb-2">
                <User className="h-5 w-5 text-[#6B46C1]" />
                <h3 className="ml-2 font-medium">User History</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                3 previous claims flagged for suspicious activity in the past month.
              </p>
              <button className="w-full py-2 bg-[#1A2151] hover:bg-[#1A2151]/80 text-[#6B46C1] rounded-md text-sm">
                View History
              </button>
            </div>

            {/* Location Analysis */}
            <div className="bg-[#1E1E24] rounded-lg p-4">
              <div className="flex items-start mb-2">
                <MapPin className="h-5 w-5 text-[#6B46C1]" />
                <h3 className="ml-2 font-medium">Location Analysis</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Unusual claim locations detected outside normal coverage area.
              </p>
              <button className="w-full py-2 bg-[#3D1513] hover:bg-[#3D1513]/80 text-[#EA4335] rounded-md text-sm">
                View Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="bg-[#1E1E24] rounded-lg p-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-[#2A2A33] pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-[#23232B] flex items-center justify-center mr-3">
                    {activity.icon}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{activity.type}</span>
                      <span className="text-[#6B46C1] ml-1">#{activity.claimId}</span>
                    </div>
                    <p className="text-sm text-gray-400">by {activity.by}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

