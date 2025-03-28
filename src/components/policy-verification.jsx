"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, ShieldCheck, Home, Car } from "lucide-react";
import { apiURL } from "../constants";

export default function PolicyVerification({ onPolicyVerified }) {
  const [policyNumber, setPolicyNumber] = useState("");
  const [isPolicyVerifying, setIsPolicyVerifying] = useState(false);
  const [policyError, setPolicyError] = useState(null);

  const handlePolicyNumberChange = (e) => {
    setPolicyNumber(e.target.value);
    setPolicyError(null);
  };

  const verifyPolicyNumber = async (e) => {
    e.preventDefault();

    if (!policyNumber.trim()) {
      setPolicyError("Please enter a policy number");
      return;
    }

    setIsPolicyVerifying(true);
    setPolicyError(null);

    try {
      // Bypass options for testing
      if (policyNumber === "123") {
        // Create mock user data for car insurance testing
        const mockUserData = {
          _id: "test123",
          name: "Test User",
          email: "test@example.com",
          policyNumber: "123",
          policyType: "Car",
          phone: "9876543210",
          dob: "01-01-2000",
        };

        // Store mock user data in localStorage
        localStorage.setItem("insuranceUserData", JSON.stringify(mockUserData));
        console.log("Test user data saved (Car):", mockUserData);

        // Notify parent component
        onPolicyVerified(mockUserData);

        setIsPolicyVerifying(false);
        return;
      }

      if (policyNumber === "456") {
        // Create mock user data for home insurance testing
        const mockUserData = {
          _id: "test456",
          name: "Home Owner",
          email: "home@example.com",
          policyNumber: "456",
          policyType: "Home",
          phone: "9876543210",
          dob: "01-01-2000",
        };

        // Store mock user data in localStorage
        localStorage.setItem("insuranceUserData", JSON.stringify(mockUserData));
        console.log("Test user data saved (Home):", mockUserData);

        // Notify parent component
        onPolicyVerified(mockUserData);

        setIsPolicyVerifying(false);
        return;
      }

      // Normal API verification for other policy numbers
      const response = await fetch(`${apiURL}/api/policy/get/${policyNumber}`);
      const data = await response.json();

      if (data.success) {
        // Policy found
        // Store user data in localStorage
        localStorage.setItem("insuranceUserData", JSON.stringify(data.user));
        console.log("User data saved:", data.user);

        // Notify parent component
        onPolicyVerified(data.user);
      } else {
        // Policy not found
        setPolicyError("No policy found with this number");
      }
    } catch (err) {
      setPolicyError("Error verifying policy. Please try again.");
      console.error("Policy verification error:", err);
    } finally {
      setIsPolicyVerifying(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="text-center bg-primary/10 border-b">
            <div className="mx-auto bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-white">
              Insurance Policy Verification
            </CardTitle>
            <CardDescription className="text-base text-gray-300">
              Enter your policy number to proceed with document extraction
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={verifyPolicyNumber} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="policyNumber" className="text-base">
                  Policy Number
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="policyNumber"
                    placeholder="e.g. POL-8901-2345-2223"
                    value={policyNumber}
                    onChange={handlePolicyNumberChange}
                    className="text-base py-6 bg-muted border-gray-700 text-white bg-black"
                  />
                  <Button
                    type="submit"
                    disabled={isPolicyVerifying}
                    size="icon"
                    className="h-auto bg-primary hover:bg-primary/80 text-white"
                  >
                    {isPolicyVerifying ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the policy number provided in your insurance document
                </p>
              </div>

              {policyError && (
                <Alert variant="destructive">
                  <AlertDescription>{policyError}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
         
        </Card>
      </div>
    </div>
  );
}
