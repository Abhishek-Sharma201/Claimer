"use client";
import ClaimHistory from "@/src/components/claimhistory"; // Ensure correct casing
import { apiURL } from "@/src/constants";
import { useAuth } from "@/src/hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);

  const fetchClaimHistory = async () => {
    try {
      const response = await fetch(`${apiURL}/api/claims/get/${user._id}`, {
        method: "GET",
      });
      const data = await response.json();
      setClaims(data.claims);
      console.log("Data:", data);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchClaimHistory();
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-800">
      <ClaimHistory claims={claims} />
    </div>
  );
}
