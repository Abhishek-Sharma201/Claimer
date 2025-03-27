"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Home, Check, MapPin, Building, DollarSign } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function HomeVerification({ userData, extractedData, onVerificationComplete }) {
  // This is a placeholder component for home insurance verification
  // In a real application, you would implement specific verification steps for home insurance
  
  const handleContinue = () => {
    // Store verification result in localStorage
    const result = { 
      verified: true, 
      timestamp: new Date().toISOString() 
    };
    
    localStorage.setItem("homeVerificationResult", JSON.stringify(result));
    
    // Notify parent component
    onVerificationComplete(result);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/10 border-b">
            <CardTitle className="flex items-center text-white">
              <Home className="mr-2 h-5 w-5" />
              Home Insurance Verification
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your home insurance document has been successfully processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-primary/20 border border-primary/30 rounded-lg p-4 flex items-center">
              <div className="bg-primary/30 p-2 rounded-full mr-3">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Document Verification Complete</h3>
                <p className="text-sm text-gray-300">
                  Your home insurance document has been successfully verified
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Building className="h-5 w-5 mr-2 text-primary/70" />
                  <h3 className="text-sm font-medium">Property Details</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Property Type:</span>
                    <Badge variant="outline" className="font-normal text-white border-gray-600">
                      {extractedData?.propertyType || "Not specified"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Construction:</span>
                    <Badge variant="outline" className="font-normal text-white border-gray-600">
                      {extractedData?.constructionType || "Not specified"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Year Built:</span>
                    <Badge variant="outline" className="font-normal text-white border-gray-600">
                      {extractedData?.yearBuilt || "Not specified"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Square Footage:</span>
                    <Badge variant="outline" className="font-normal text-white border-gray-600">
                      {extractedData?.squareFootage || "Not specified"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <MapPin className="h-5 w-5 mr-2 text-primary/70" />
                  <h3 className="text-sm font-medium">Location & Coverage</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="text-sm font-medium truncate max-w-[180px] text-white">
                      {extractedData?.propertyLocation || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Property Value:</span>
                    <span className="text-sm font-medium text-white">
                      {extractedData?.propertyValue || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Coverage Amount:</span>
                    <div className="flex items-center">
                      <DollarSign className="h-3.5 w-3.5 mr-0.5 text-tertiary" />
                      <span className="text-sm font-medium text-tertiary">
                        {extractedData?.coverageAmount || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">Coverage Includes</h3>
              <div className="flex flex-wrap gap-2">
                {extractedData?.coverageIncludes && extractedData.coverageIncludes.length > 0 ? (
                  extractedData.coverageIncludes.map((item, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-white">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No coverage details found</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-gray-700 bg-muted/20 py-4">
            <Button 
              onClick={handleContinue}
              className="bg-tertiary hover:bg-tertiary/80 text-tertiary-foreground"
            >
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
