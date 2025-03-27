import { useState } from 'react';
import { FaSearch, FaFilePdf, FaQuestionCircle } from 'react-icons/fa';

const ClaimHistory = () => {
  const claims = [
    { id: 'CLM-2024-001', type: 'Auto Insurance', status: 'Approved', amount: '$2,450.00', submissionDate: 'Jan 15, 2024', lastUpdated: 'Jan 20, 2024' },
    { id: 'CLM-2024-002', type: 'Health', status: 'In Progress', amount: '$1,850.00', submissionDate: 'Jan 18, 2024', lastUpdated: 'Jan 22, 2024' },
    { id: 'CLM-2024-003', type: 'Home', status: 'Rejected', amount: '$5,200.00', submissionDate: 'Jan 20, 2024', lastUpdated: 'Jan 23, 2024' },
    { id: 'CLM-2024-004', type: 'Auto Insurance', status: 'Approved', amount: '$3,100.00', submissionDate: 'Jan 21, 2024', lastUpdated: 'Jan 24, 2024' },
    { id: 'CLM-2024-005', type: 'Health', status: 'In Progress', amount: '$950.00', submissionDate: 'Jan 22, 2024', lastUpdated: 'Jan 25, 2024' },
  ];

  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-yellow-500';
      case 'Rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-800 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Claim History</h2>
          <p className="text-gray-400">View and manage your insurance claims</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search claims, docs, or get help..."
              className="pl-10 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
          </div>
          <div className="flex items-center space-x-2">
            <img src="/profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
            <span>Ritik Ray</span>
            <span className="text-gray-400">ritik.ray@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select className="p-2 rounded-lg bg-gray-700 text-white focus:outline-none">
          <option>All Claim Types</option>
          <option>Auto Insurance</option>
          <option>Health</option>
          <option>Home</option>
        </select>
        <select className="p-2 rounded-lg bg-gray-700 text-white focus:outline-none">
          <option>All Status</option>
          <option>Approved</option>
          <option>In Progress</option>
          <option>Rejected</option>
        </select>
        <select className="p-2 rounded-lg bg-gray-700 text-white focus:outline-none">
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
        <button className="flex items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300">
          <FaFilePdf className="mr-2" />
          Export to PDF
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="p-4">Claim ID</th>
              <th className="p-4">Claim Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Submission Date</th>
              <th className="p-4">Last Updated</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, index) => (
              <tr
                key={index}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-t border-gray-700 transition-all duration-300 ${
                  hoveredRow === index ? 'bg-gray-700 transform scale-101' : ''
                }`}
              >
                <td className="p-4">{claim.id}</td>
                <td className="p-4">{claim.type}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="p-4">{claim.amount}</td>
                <td className="p-4">{claim.submissionDate}</td>
                <td className="p-4">{claim.lastUpdated}</td>
                <td className="p-4">
                  <button className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors duration-300">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-bold flex items-center">
          <FaQuestionCircle className="mr-2 text-purple-400" />
          Need Help?
        </h3>
        <p className="text-gray-400 mt-2">How do I track my claim status?</p>
        <p className="text-gray-400">What documents are required for claims?</p>
        <p className="text-gray-400">Understanding claim processing times</p>
      </div>
    </div>
  );
};

export default ClaimHistory;