"use client";
import ClaimHistory from "@/src/components/claimhistory"; // Ensure correct casing

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-800">
      <ClaimHistory />
    </div>
  );
}
