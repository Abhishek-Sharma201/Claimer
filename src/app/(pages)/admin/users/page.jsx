"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ArrowUpDown,
  Eye,
  Edit,
  Trash,
  Plus,
  Car,
  Home,
  User,
  Check,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiURL } from "@/src/constants";
import Image from "next/image";

// Sample data for demonstration
// const initialUsers = [
//   {
//     id: 1,
//     name: "John Anderson",
//     email: "john.anderson@example.com",
//     policyNumber: "POL-10045",
//     policyType: "Car",
//     vehicle: "Toyota Camry",
//     status: "Active",
//     joinDate: "2023-05-12",
//   },
//   {
//     id: 2,
//     name: "Sarah Mitchell",
//     email: "sarah.mitchell@example.com",
//     policyNumber: "POL-10046",
//     policyType: "Home",
//     address: "123 Main St, Anytown",
//     status: "Active",
//     joinDate: "2023-06-18",
//   },
//   {
//     id: 3,
//     name: "Robert Wilson",
//     email: "robert.wilson@example.com",
//     policyNumber: "POL-10047",
//     policyType: "Car",
//     vehicle: "Honda Civic",
//     status: "Inactive",
//     joinDate: "2023-04-05",
//   },
//   {
//     id: 4,
//     name: "Emily Brown",
//     email: "emily.brown@example.com",
//     policyNumber: "POL-10048",
//     policyType: "Home",
//     address: "456 Oak Ave, Somewhere",
//     status: "Active",
//     joinDate: "2023-07-22",
//   },
//   {
//     id: 5,
//     name: "Michael Davis",
//     email: "michael.davis@example.com",
//     policyNumber: "POL-10049",
//     policyType: "Car",
//     vehicle: "Ford Explorer",
//     status: "Active",
//     joinDate: "2023-08-10",
//   },
//   {
//     id: 6,
//     name: "Jennifer Garcia",
//     email: "jennifer.garcia@example.com",
//     policyNumber: "POL-10050",
//     policyType: "Home",
//     address: "789 Pine St, Elsewhere",
//     status: "Pending",
//     joinDate: "2023-09-05",
//   },
//   {
//     id: 7,
//     name: "David Martinez",
//     email: "david.martinez@example.com",
//     policyNumber: "POL-10051",
//     policyType: "Car",
//     vehicle: "Chevrolet Malibu",
//     status: "Active",
//     joinDate: "2023-10-15",
//   },
//   {
//     id: 8,
//     name: "Lisa Rodriguez",
//     email: "lisa.rodriguez@example.com",
//     policyNumber: "POL-10052",
//     policyType: "Home",
//     address: "101 Cedar Rd, Nowhere",
//     status: "Inactive",
//     joinDate: "2023-11-20",
//   },
// ]

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const r = await fetch(`${apiURL}/api/claims/getUsers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const res = await r.json();

      setUsers(res.users);
      setFilteredUsers(res.users);
    } catch (error) {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  });

  // Filter users based on search query and filter type
  // useEffect(() => {
  //   setLoading(true);
  //   let result = users;

  // Apply search filter
  // if (searchQuery) {
  //   result = result.filter(
  //     (user) =>
  //       user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       user.policyNumber.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // }

  // Apply policy type filter
  // if (filterType !== "All") {
  //   result = result.filter((user) => user.policyType === filterType);
  // }

  //   setFilteredUsers(result);
  //   setLoading(false);
  // }, [searchQuery, filterType, users]);

  // Handle user actions
  // const handleViewUser = (user) => {
  //   setSelectedUser(user);
  //   setShowUserModal(true);
  // };

  // const handleEditUser = (user) => {
  //   setSelectedUser(user);
  //   setShowUserModal(true);
  // };

  // const handleDeleteUser = (user) => {
  //   setSelectedUser(user);
  //   setShowDeleteConfirm(true);
  // };

  // const confirmDeleteUser = async () => {
  // In a real app, you would call your API here
  // await fetch(`/api/users/${selectedUser.id}`, { method: 'DELETE' });

  // Update UI optimistically
  //   setUsers(users.filter((user) => user.id !== selectedUser.id));
  //   setShowDeleteConfirm(false);
  //   setSelectedUser(null);
  // };

  // const handleAddUser = () => {
  //   setSelectedUser(null); // Clear any selected user
  //   setShowUserModal(true);
  // };

  // const closeModal = () => {
  //   setShowUserModal(false);
  //   setShowDeleteConfirm(false);
  //   setSelectedUser(null);
  // };

  // Save user (create or update)
  // const saveUser = async (userData) => {
  // In a real app, you would call your API here
  // const response = await fetch('/api/users', {
  //   method: userData.id ? 'PUT' : 'POST',
  //   body: JSON.stringify(userData)
  // });
  // const savedUser = await response.json();

  // Update UI optimistically
  // if (userData.id) {
  // Update existing user
  //   setUsers(
  //     users.map((user) => (user?._id === userData.id ? userData : user))
  //   );
  // } else {
  // Create new user with a fake ID
  //     const newUser = {
  //       ...userData,
  //       id: Date.now(),
  //       joinDate: new Date().toISOString().split("T")[0],
  //     };
  //     setUsers([...users, newUser]);
  //   }

  //   setShowUserModal(false);
  //   setSelectedUser(null);
  // };

  return (
    <div className="min-h-screen bg-[#121218] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">User Management</h1>

          <button
            // onClick={handleAddUser}
            className="flex items-center bg-[#6B46C1] hover:bg-[#805AD5] text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              className="pl-10 bg-[#1E1E24] border border-[#2A2A33] text-white h-10 rounded-md w-full px-3"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("All")}
              className={`px-3 py-2 rounded-md text-sm ${
                filterType === "All"
                  ? "bg-[#6B46C1] text-white"
                  : "bg-[#1E1E24] text-gray-300 hover:bg-[#2A2A33]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("Car")}
              className={`px-3 py-2 rounded-md text-sm flex items-center ${
                filterType === "Car"
                  ? "bg-[#6B46C1] text-white"
                  : "bg-[#1E1E24] text-gray-300 hover:bg-[#2A2A33]"
              }`}
            >
              <Car className="h-4 w-4 mr-1" />
              Car
            </button>
            <button
              onClick={() => setFilterType("Home")}
              className={`px-3 py-2 rounded-md text-sm flex items-center ${
                filterType === "Home"
                  ? "bg-[#6B46C1] text-white"
                  : "bg-[#1E1E24] text-gray-300 hover:bg-[#2A2A33]"
              }`}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </button>
            <button className="bg-[#1E1E24] hover:bg-[#2A2A33] px-3 py-2 rounded-md text-sm flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1E1E24] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-[#2A2A33]">
                  <th className="py-3 px-4 text-sm font-medium">Name</th>
                  <th className="py-3 px-4 text-sm font-medium">Email</th>
                  <th className="py-3 px-4 text-sm font-medium">
                    Policy Number
                  </th>
                  <th className="py-3 px-4 text-sm font-medium">Policy Type</th>
                  <th className="py-3 px-4 text-sm font-medium">Status</th>
                  <th className="py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-center">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user?._id}
                      className="border-b border-[#2A2A33] hover:bg-[#23232B]"
                    >
                      <td className="py-3 px-4 flex items-center">
                        {user?.picture ? (
                          <Image
                            src={user?.picture || ""}
                            alt="pic"
                            className=" h-8 w-8 rounded-full object-contain "
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-[#6B46C1] flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}

                        {user?.name}
                      </td>
                      <td className="py-3 px-4">{user?.email}</td>
                      <td className="py-3 px-4">{user?.policyNumber}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {user?.policyType === "Car" ? (
                            <Car className="h-4 w-4 mr-1 text-[#6B46C1]" />
                          ) : (
                            <Home className="h-4 w-4 mr-1 text-[#6B46C1]" />
                          )}
                          {user?.policyType}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            user?.claimStatus === "Active"
                              ? "bg-[#0D3320] text-[#34A853]"
                              : user.claimStatus === "Inactive"
                              ? "bg-[#3D1513] text-[#EA4335]"
                              : "bg-[#3D2E05] text-[#F9A825]"
                          }`}
                        >
                          {user.claimStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="h-7 w-7 rounded-full bg-[#1A2151] text-[#6B46C1] hover:bg-[#1A2151]/80 flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="h-7 w-7 rounded-full bg-[#0D3320] text-[#34A853] hover:bg-[#0D3320]/80 flex items-center justify-center"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="h-7 w-7 rounded-full bg-[#3D1513] text-[#EA4335] hover:bg-[#3D1513]/80 flex items-center justify-center"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-[#1E1E24] hover:bg-[#2A2A33] rounded-md text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#6B46C1] hover:bg-[#805AD5] rounded-md text-sm">
              1
            </button>
            <button className="px-3 py-1 bg-[#1E1E24] hover:bg-[#2A2A33] rounded-md text-sm">
              2
            </button>
            <button className="px-3 py-1 bg-[#1E1E24] hover:bg-[#2A2A33] rounded-md text-sm">
              3
            </button>
            <button className="px-3 py-1 bg-[#1E1E24] hover:bg-[#2A2A33] rounded-md text-sm">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1E1E24] rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <UserForm
              user={selectedUser}
              onSave={saveUser}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1E1E24] rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Deletion</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-6">
              Are you sure you want to delete user{" "}
              <span className="font-bold">{selectedUser.name}</span>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-[#2A2A33] hover:bg-[#3A3A43] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-[#3D1513] hover:bg-[#4D2523] text-[#EA4335] rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// User Form Component
function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: user?.id || null,
    name: user?.name || "",
    email: user?.email || "",
    policyNumber:
      user?.policyNumber || "POL-" + Math.floor(10000 + Math.random() * 90000),
    policyType: user?.policyType || "Car",
    vehicle: user?.vehicle || "",
    address: user?.address || "",
    status: user?.status || "Active",
    joinDate: user?.joinDate || new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-[#23232B] border border-[#2A2A33] rounded-md px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-[#23232B] border border-[#2A2A33] rounded-md px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Policy Number
          </label>
          <input
            type="text"
            name="policyNumber"
            value={formData.policyNumber}
            onChange={handleChange}
            required
            className="w-full bg-[#23232B] border border-[#2A2A33] rounded-md px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Policy Type
          </label>
          <select
            name="policyType"
            value={formData.policyType}
            onChange={handleChange}
            className="w-full bg-[#23232B] border border-[#2A2A33] rounded-md px-3 py-2 text-white"
          >
            <option value="Car">Car</option>
            <option value="Home">Home</option>
          </select>
        </div>

        {formData.policyType === "Car" ? (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Vehicle
            </label>
            <input
              type="text"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className="w-full bg-[#23232B] border border-[#2A2A33] rounded-md px-3 py-2 text-white"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-[#23232B] border border-[#2A2A33] rounded-md px-3 py-2 text-white"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#23232B] border border-[#2A2A33] rounded-md px-3 py-2 text-white"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-[#2A2A33] hover:bg-[#3A3A43] rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#6B46C1] hover:bg-[#805AD5] rounded-md flex items-center"
        >
          <Check className="h-4 w-4 mr-2" />
          {user ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
}
