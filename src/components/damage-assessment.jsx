"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  Loader2,
  Car,
  FileText,
  AlertCircle,
  Wrench,
  ShieldCheck,
  ShieldX,
  Info,
  X,
  Plus,
  ImageIcon,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "../hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../hooks/useAuth";
import { apiURL } from "../constants";
import { toast as t } from "react-toastify";

export default function DamageAssessment({
  userData,
  extractedData,
  verificationResult,
  onAssessmentComplete,
}) {
  const [damageImages, setDamageImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [processingStage, setProcessingStage] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [carImageUrl, setCarImageUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    uploading: false,
    progress: 0,
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [assessmentRequired, setAssessmentRequired] = useState(true);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const { user } = useAuth();

  // Load car image from localStorage
  useEffect(() => {
    const storedCarImage = localStorage.getItem("carImageData");
    if (storedCarImage) {
      setCarImageUrl(storedCarImage);
    }

    // Check for existing assessment result
    const storedAssessment = localStorage.getItem("damageAssessmentResult");
    if (storedAssessment) {
      try {
        const parsedAssessment = JSON.parse(storedAssessment);
        setAssessmentResult(parsedAssessment);
        setAssessmentRequired(false);

        // Handle both old and new format for image URLs
        if (parsedAssessment.damageImageUrl) {
          setPreviewUrls([parsedAssessment.damageImageUrl]);
        } else if (
          parsedAssessment.imageUrls &&
          parsedAssessment.imageUrls.length > 0
        ) {
          setPreviewUrls(parsedAssessment.imageUrls);
        }
      } catch (e) {
        console.error("Error parsing stored assessment:", e);
      }
    }
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Check file sizes - 4MB limit for quick uploads
      const oversizedFiles = newFiles.filter(
        (file) => file.size > 4 * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        setError(
          "For faster processing, please upload images smaller than 4MB each. You can resize the images or take new photos."
        );
        toast({
          title: "Files too large",
          description:
            "Please upload images smaller than 4MB each for faster processing.",
          variant: "destructive",
        });
        return;
      }

      // Check file types
      const invalidFiles = newFiles.filter(
        (file) => !file.type.startsWith("image/")
      );
      if (invalidFiles.length > 0) {
        setError("Please upload only image files (JPEG, PNG, etc.)");
        toast({
          title: "Invalid file type(s)",
          description: "Please upload only image files (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Add new files to the existing ones
      const updatedImages = [...damageImages, ...newFiles];
      setDamageImages(updatedImages);
      setError(null);

      // Create preview URLs for new files
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);

      // Reset assessment result when new images are added
      setAssessmentResult(null);
      setAssessmentRequired(true);

      toast({
        title: `${newFiles.length} image${
          newFiles.length > 1 ? "s" : ""
        } selected`,
        description:
          "Your damage photos have been selected. Click 'Analyze Damage' to proceed.",
      });

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index) => {
    // Create new arrays without the removed image
    const newImages = [...damageImages];
    newImages.splice(index, 1);
    setDamageImages(newImages);

    const newUrls = [...previewUrls];
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);

    // Update active index if needed
    if (activeImageIndex >= newUrls.length) {
      setActiveImageIndex(Math.max(0, newUrls.length - 1));
    }

    // Reset assessment result when images change
    setAssessmentResult(null);
    setAssessmentRequired(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (damageImages.length === 0) {
      setError("Please select at least one damage image to upload");
      toast({
        title: "No images selected",
        description: "Please select at least one damage image to upload",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProcessingStage(1);
    setProcessingProgress(10);
    setUploadProgress({ uploading: true, progress: 0 });

    toast({
      title: "Processing started",
      description: `Uploading and analyzing ${
        damageImages.length
      } damage photo${damageImages.length > 1 ? "s" : ""}...`,
    });

    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev.progress >= 95) {
            clearInterval(uploadInterval);
            return { ...prev, progress: 95 };
          }
          return { ...prev, progress: prev.progress + 5 };
        });
      }, 300);

      // Create form data to send the files
      const formData = new FormData();
      damageImages.forEach((file) => {
        formData.append("damageImages", file);
      });

      // Add policy information for context
      if (extractedData) {
        formData.append("policyType", extractedData.policyType || "Car");
        formData.append("coverageAmount", extractedData.coverageAmount || "");
        formData.append("numberPlate", extractedData.numberPlate || "");
        formData.append("policyEndDate", extractedData.policyEndDate || "");
      }

      // Send the files to the API for processing
      const response = await fetch("/api/assess-damage", {
        method: "POST",
        body: formData,
      });

      clearInterval(uploadInterval);
      setUploadProgress({ uploading: false, progress: 100 });
      setProcessingStage(2);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      // Start AI processing progress
      let progress = 20;
      const progressInterval = setInterval(() => {
        progress += 5;
        setProcessingProgress(progress);

        if (progress < 40) setProcessingStage(2);
        else if (progress < 60) setProcessingStage(3);
        else if (progress < 80) setProcessingStage(4);
        else setProcessingStage(5);

        if (progress >= 95) {
          clearInterval(progressInterval);
        }
      }, 800);

      const data = await response.json();

      clearInterval(progressInterval);
      setProcessingProgress(100);

      // Store damage images in localStorage (just the first one to save space)
      if (damageImages.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(damageImages[0]);
        reader.onloadend = () => {
          const base64data = reader.result;
          // Store in localStorage
          localStorage.setItem("damageImageData", base64data);
          console.log("Primary damage image saved to localStorage");
        };
      }

      // Parse coverage amount to compare with repair cost
      const coverageAmount = extractCoverageAmount(
        extractedData?.coverageAmount || "0"
      );
      const repairCost = data.estimatedCost || 0;
      const isWithinCoverage = repairCost <= coverageAmount;

      // Set assessment result
      const result = {
        ...data,
        userId: user?._id,
        previewUrls: previewUrls,
        coverageAmount,
        timestamp: new Date().toISOString(),
      };

      try {
        const r = await fetch(`${apiURL}/api/claims/add`, {
          method: "POST",
          body: result,
        });
        const res = await r.json();

        if (res.success) t.success(res.success);
      } catch (error) {
        t.error(error.message);
      }

      // Log the full assessment data to help with debugging
      console.log(
        "Assessment result:",
        JSON.stringify(
          {
            confidenceScore: data.confidenceScore,
            estimatedCost: data.estimatedCost,
            coverageAmount: coverageAmount,
            isWithinCoverage: data.isWithinCoverage,
            claimStatus: data.claimStatus,
            rejectionReason: data.rejectionReason,
            isFakeImage: data.isFakeImage,
            fakeImageReason: data.fakeImageReason,
            numberPlateMatches: data.numberPlateMatches,
            detectedNumberPlate: data.detectedNumberPlate,
          },
          null,
          2
        )
      );

      setAssessmentResult(result);
      setAssessmentRequired(false);

      // Store in localStorage
      localStorage.setItem("damageAssessmentResult", JSON.stringify(result));
      console.log(`From damage-assessment : ${result}`);

      // Show toast notification based on claim status
      if (data.isFakeImage) {
        toast({
          title: "Fake Image Detected",
          description:
            data.fakeImageReason ||
            "The uploaded image appears to be fake or invalid.",
          variant: "destructive",
        });
      } else if (data.numberPlateVisible && !data.numberPlateMatches) {
        toast({
          title: "Number Plate Mismatch",
          description: `Number plate in image (${data.detectedNumberPlate}) doesn't match policy (${extractedData.numberPlate})`,
          variant: "destructive",
        });
      } else if (data.isPolicyExpired) {
        toast({
          title: "Policy Expired",
          description: `Your policy expired on ${extractedData.policyEndDate}`,
          variant: "destructive",
        });
      } else if (data.claimStatus === "Approved") {
        toast({
          title: "Claim Approved",
          description:
            "Your claim has been automatically approved based on the assessment.",
          variant: "default",
        });
      } else if (data.claimStatus === "Pending Admin Review") {
        toast({
          title: "Pending Review",
          description:
            data.rejectionReason ||
            "Your claim requires additional review by our team.",
          variant: "default",
        });
      } else {
        toast({
          title: "Claim Rejected",
          description:
            data.rejectionReason ||
            "Your claim could not be automatically approved.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during damage assessment"
      );
      console.error(err);

      toast({
        title: "Assessment Failed",
        description:
          err instanceof Error
            ? err.message
            : "An error occurred during damage assessment",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProcessingStage(0);
    }
  };

  // Function to extract numeric coverage amount
  const extractCoverageAmount = (coverageString) => {
    if (!coverageString) return 0;

    // Extract numbers from the string
    const matches = coverageString.match(/[\d,]+/g);
    if (!matches || matches.length === 0) return 0;

    // Remove commas and convert to number
    return Number.parseFloat(matches[0].replace(/,/g, ""));
  };

  // Get the processing stage message
  const getProcessingStageMessage = () => {
    switch (processingStage) {
      case 1:
        return "Uploading images...";
      case 2:
        return "Analyzing damage patterns...";
      case 3:
        return "Identifying affected parts...";
      case 4:
        return "Calculating repair costs...";
      case 5:
        return "Generating assessment report...";
      default:
        return "Processing...";
    }
  };

  // Format currency in Indian format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status color based on claim status
  const getStatusColor = (status) => {
    if (!status) return "text-white";

    if (status.includes("Approved")) return "text-green-400";
    if (status.includes("Rejected")) return "text-red-400";
    return "text-[#00FFFF]";
  };

  // Get confidence color based on score
  const getConfidenceColor = (score) => {
    if (score >= 85) return "bg-green-600";
    if (score >= 70) return "bg-green-500"; // Changed from 75 to 70
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-[#333333] bg-black">
          <CardHeader className="bg-[#1a1a1a] border-b border-[#333333]">
            <CardTitle className="flex items-center text-white">
              <Wrench className="mr-2 h-5 w-5 text-[#6B46C1]" />
              Vehicle Damage Assessment with AI
            </CardTitle>
            <CardDescription className="text-gray-400">
              Upload photos of the damage to your vehicle for AI assessment and
              repair cost estimation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Policy information */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333333]">
              <h3 className="text-sm font-medium mb-3 text-white">
                Policy Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Policy Number</span>
                  <span className="text-sm font-medium text-white">
                    {extractedData?.policyNumber || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Vehicle</span>
                  <span className="text-sm font-medium text-white">
                    {extractedData?.numberPlate
                      ? `Plate: ${extractedData.numberPlate}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Coverage Amount</span>
                  <span className="text-sm font-medium text-[#00FFFF]">
                    {extractedData?.coverageAmount || "N/A"}
                  </span>
                </div>
              </div>

              {/* Policy expiry warning */}
              {extractedData?.policyEndDate && (
                <div className="flex items-center mt-3 text-xs">
                  <Calendar className="h-3 w-3 mr-1 text-[#00FFFF]" />
                  <span className="text-[#00FFFF]">
                    Policy valid until: {extractedData.policyEndDate}
                  </span>
                </div>
              )}
            </div>

            {/* Assessment required warning */}
            {assessmentRequired && (
              <Alert
                variant="default"
                className="bg-amber-900/30 border-amber-500 text-amber-200"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                <AlertDescription>
                  You must complete the damage assessment before proceeding.
                  Upload damage photos and click "Analyze Damage".
                </AlertDescription>
              </Alert>
            )}

            {/* Vehicle images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original car image */}
              <div className="space-y-2">
                <Label className="text-base text-white">
                  Verified Vehicle Image
                </Label>
                <div className="border border-[#333333] rounded-lg overflow-hidden bg-[#1a1a1a] flex items-center justify-center h-[200px]">
                  {carImageUrl ? (
                    <img
                      src={carImageUrl || "/placeholder.svg"}
                      alt="Verified vehicle"
                      className="max-w-full max-h-[200px] object-contain"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Car className="h-16 w-16 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        No verified vehicle image available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Damage image upload */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="damageImages"
                    className="text-base text-white"
                  >
                    Damage Photos
                  </Label>
                  <span className="text-xs text-gray-400">
                    {previewUrls.length > 0
                      ? `${previewUrls.length} image${
                          previewUrls.length > 1 ? "s" : ""
                        } selected`
                      : "Upload multiple images for better assessment"}
                  </span>
                </div>

                {previewUrls.length > 0 ? (
                  <div className="space-y-3">
                    {/* Image preview carousel */}
                    <div className="border border-[#333333] rounded-lg overflow-hidden bg-[#1a1a1a] flex items-center justify-center h-[200px] relative">
                      <img
                        src={
                          previewUrls[activeImageIndex] || "/placeholder.svg"
                        }
                        alt={`Damage preview ${activeImageIndex + 1}`}
                        className="max-w-full max-h-[200px] object-contain"
                      />

                      {/* Image navigation if multiple images */}
                      {previewUrls.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                          {previewUrls.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImageIndex(index)}
                              className={`w-2 h-2 rounded-full ${
                                index === activeImageIndex
                                  ? "bg-[#6B46C1]"
                                  : "bg-gray-500"
                              }`}
                              aria-label={`View image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={() => removeImage(activeImageIndex)}
                        className="absolute top-2 right-2 bg-black/60 p-1 rounded-full hover:bg-black/80"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>

                    {/* Thumbnails */}
                    {previewUrls.length > 1 && (
                      <div className="flex overflow-x-auto space-x-2 pb-2">
                        {previewUrls.map((url, index) => (
                          <div
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded border-2 cursor-pointer ${
                              index === activeImageIndex
                                ? "border-[#6B46C1]"
                                : "border-[#333333]"
                            }`}
                          >
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        ))}

                        {/* Add more button */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-shrink-0 w-16 h-16 rounded border-2 border-dashed border-[#333333] flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a]"
                        >
                          <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-[#333333] rounded-lg p-6 text-center hover:bg-[#1a1a1a] transition-colors cursor-pointer h-[200px] flex flex-col items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="h-12 w-12 text-[#6B46C1] mb-3" />
                    <p className="text-sm font-medium text-white">
                      Click to upload damage photos
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload clear photos of the damaged areas from multiple
                      angles (max 4MB each)
                    </p>
                    <div className="flex items-center mt-3 text-xs text-[#00FFFF]">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      <span>
                        Multiple images recommended for better assessment
                      </span>
                    </div>
                  </div>
                )}

                <Input
                  id="damageImages"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  multiple
                />

                {/* Add more button if images exist but not showing thumbnails */}
                {previewUrls.length > 0 && previewUrls.length <= 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 border-[#333333] text-white hover:bg-[#1a1a1a]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Photos
                  </Button>
                )}
              </div>
            </div>

            {/* Submit button */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-[#6B46C1] hover:bg-[#5a3ba3] text-white"
                disabled={isAnalyzing || previewUrls.length === 0}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {getProcessingStageMessage()}
                  </>
                ) : (
                  <>Analyze Damage with AI</>
                )}
              </Button>

              {uploadProgress.uploading && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 mb-1">Uploading Images</p>
                  <Progress
                    value={uploadProgress.progress}
                    className="h-2 bg-[#333333]"
                  >
                    <div
                      className="h-full bg-[#6B46C1] rounded-full"
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </Progress>
                </div>
              )}

              {isAnalyzing && !uploadProgress.uploading && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 mb-1">
                    Processing Images
                  </p>
                  <Progress
                    value={processingProgress}
                    className="h-2 bg-[#333333]"
                  >
                    <div
                      className="h-full bg-[#6B46C1] rounded-full"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </Progress>
                  <p className="text-xs text-center text-gray-400">
                    {getProcessingStageMessage()}
                  </p>
                </div>
              )}

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-900 border-red-700 text-white"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>

            {/* Assessment result */}
            {assessmentResult && (
              <div className="space-y-6 mt-4">
                <div
                  className={`p-6 rounded-lg border ${
                    assessmentResult.isFakeImage ||
                    assessmentResult.isPolicyExpired ||
                    (assessmentResult.numberPlateVisible &&
                      !assessmentResult.numberPlateMatches)
                      ? "border-red-500 bg-red-900/20"
                      : assessmentResult.claimStatus === "Approved"
                      ? "border-green-500 bg-green-900/20"
                      : assessmentResult.claimStatus === "Rejected"
                      ? "border-red-500 bg-red-900/20"
                      : "border-[#00FFFF] bg-[#00FFFF]/10"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    {assessmentResult.isFakeImage ? (
                      <>
                        <div className="bg-red-900/30 p-2 rounded-full mr-3">
                          <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-red-400 text-lg">
                            Fake Image Detected
                          </h3>
                          <p className="text-red-300 text-sm">
                            {assessmentResult.fakeImageReason ||
                              "The uploaded image appears to be fake or invalid"}
                          </p>
                        </div>
                      </>
                    ) : assessmentResult.isPolicyExpired ? (
                      <>
                        <div className="bg-red-900/30 p-2 rounded-full mr-3">
                          <Calendar className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-red-400 text-lg">
                            Policy Expired
                          </h3>
                          <p className="text-red-300 text-sm">
                            Your policy expired on{" "}
                            {extractedData?.policyEndDate}
                          </p>
                        </div>
                      </>
                    ) : assessmentResult.numberPlateVisible &&
                      !assessmentResult.numberPlateMatches ? (
                      <>
                        <div className="bg-red-900/30 p-2 rounded-full mr-3">
                          <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-red-400 text-lg">
                            Number Plate Mismatch
                          </h3>
                          <p className="text-red-300 text-sm">
                            Number plate in image (
                            {assessmentResult.detectedNumberPlate}) doesn't
                            match policy ({extractedData?.numberPlate})
                          </p>
                        </div>
                      </>
                    ) : assessmentResult.claimStatus === "Approved" ? (
                      <>
                        <div className="bg-green-900/30 p-2 rounded-full mr-3">
                          <ShieldCheck className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-green-400 text-lg">
                            Claim Approved
                          </h3>
                          <p className="text-green-300 text-sm">
                            Your claim has been automatically approved
                          </p>
                        </div>
                      </>
                    ) : assessmentResult.claimStatus === "Rejected" ? (
                      <>
                        <div className="bg-red-900/30 p-2 rounded-full mr-3">
                          <ShieldX className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-red-400 text-lg">
                            Claim Rejected
                          </h3>
                          <p className="text-red-300 text-sm">
                            Your claim could not be automatically approved
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-[#00FFFF]/10 p-2 rounded-full mr-3">
                          <AlertCircle className="h-6 w-6 text-[#00FFFF]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#00FFFF] text-lg">
                            Pending Review
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Your claim requires additional review by our team
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {assessmentResult.rejectionReason && (
                    <div className="mb-4 p-3 bg-black/40 rounded-md border border-[#333333] flex items-start">
                      <Info className="h-5 w-5 text-[#00FFFF] mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        {assessmentResult.rejectionReason}
                      </p>
                    </div>
                  )}

                  <Tabs defaultValue="assessment" className="mt-4">
                    <TabsList className="bg-[#333333] text-white mb-4">
                      <TabsTrigger
                        value="assessment"
                        className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white"
                      >
                        Assessment
                      </TabsTrigger>
                      <TabsTrigger
                        value="images"
                        className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white"
                      >
                        Images ({previewUrls.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="assessment">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black/40 p-4 rounded-md border border-[#333333]">
                          <h4 className="text-sm font-medium mb-3 text-white">
                            Damage Assessment
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">
                                Damage Severity:
                              </span>
                              <Badge
                                className={`${
                                  assessmentResult.damageSeverity === "High"
                                    ? "bg-red-900 text-red-100"
                                    : assessmentResult.damageSeverity ===
                                      "Medium"
                                    ? "bg-amber-900 text-amber-100"
                                    : assessmentResult.damageSeverity === "Low"
                                    ? "bg-green-900 text-green-100"
                                    : "bg-gray-700 text-gray-100"
                                }`}
                              >
                                {assessmentResult.damageSeverity || "Unknown"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">
                                Affected Areas:
                              </span>
                              <span className="text-sm text-white text-right">
                                {Array.isArray(assessmentResult.affectedAreas)
                                  ? assessmentResult.affectedAreas.join(", ")
                                  : assessmentResult.affectedAreas || "Unknown"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">
                                Repair Time:
                              </span>
                              <span className="text-sm text-white">
                                {assessmentResult.estimatedRepairTime ||
                                  "Unknown"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">
                                Confidence:
                              </span>
                              <div className="flex items-center">
                                <Progress
                                  value={assessmentResult.confidenceScore}
                                  className="h-2 w-20 mr-2 bg-[#333333]"
                                >
                                  <div
                                    className={`h-full ${getConfidenceColor(
                                      assessmentResult.confidenceScore
                                    )} rounded-full`}
                                    style={{
                                      width: `${assessmentResult.confidenceScore}%`,
                                    }}
                                  />
                                </Progress>
                                <span className="text-sm font-medium text-white">
                                  {assessmentResult.confidenceScore}%
                                </span>
                              </div>
                            </div>
                            {assessmentResult.vehicleType && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">
                                  Vehicle Type:
                                </span>
                                <span className="text-sm text-white">
                                  {assessmentResult.vehicleType}
                                </span>
                              </div>
                            )}
                            {assessmentResult.numberPlateVisible && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">
                                  Detected Plate:
                                </span>
                                <span
                                  className={`text-sm ${
                                    assessmentResult.numberPlateMatches
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {assessmentResult.detectedNumberPlate ||
                                    "Not visible"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-black/40 p-4 rounded-md border border-[#333333]">
                          <h4 className="text-sm font-medium mb-3 text-white">
                            Cost Breakdown
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">
                                Parts:
                              </span>
                              <span className="text-sm text-white">
                                {formatCurrency(
                                  assessmentResult.partsCost || 0
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">
                                Labor:
                              </span>
                              <span className="text-sm text-white">
                                {formatCurrency(
                                  assessmentResult.laborCost || 0
                                )}
                              </span>
                            </div>
                            <Separator className="my-2 bg-[#333333]" />
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-400">
                                Total Estimate:
                              </span>
                              <span className="text-sm font-medium text-[#00FFFF]">
                                {formatCurrency(
                                  assessmentResult.estimatedCost || 0
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-400">
                                Coverage Limit:
                              </span>
                              <span className="text-sm font-medium text-white">
                                {formatCurrency(
                                  assessmentResult.coverageAmount || 0
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-400">
                                Status:
                              </span>
                              <span
                                className={`text-sm font-medium ${getStatusColor(
                                  assessmentResult.claimStatus
                                )}`}
                              >
                                {assessmentResult.claimStatus || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 bg-black/40 p-4 rounded-md border border-[#333333]">
                        <h4 className="text-sm font-medium mb-2 text-white">
                          Assessment Notes
                        </h4>
                        <p className="text-sm text-gray-300">
                          {assessmentResult.assessmentNotes ||
                            "No additional notes available."}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="images">
                      <div className="bg-black/40 p-4 rounded-md border border-[#333333]">
                        <h4 className="text-sm font-medium mb-3 text-white">
                          Uploaded Images
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {previewUrls.map((url, index) => (
                            <div
                              key={index}
                              className="border border-[#333333] rounded-lg overflow-hidden bg-[#1a1a1a] aspect-square relative"
                            >
                              <img
                                src={url || "/placeholder.svg"}
                                alt={`Damage image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                          Multiple images help the AI provide a more accurate
                          assessment of the damage
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === "development" && (
                  <div className="mt-4 bg-black/40 p-4 rounded-md border border-red-500">
                    <h4 className="text-sm font-medium mb-2 text-white">
                      Debug Information
                    </h4>
                    <div className="space-y-1 text-xs font-mono">
                      <p>Confidence: {assessmentResult.confidenceScore}%</p>
                      <p>
                        Cost:{" "}
                        {formatCurrency(assessmentResult.estimatedCost || 0)}
                      </p>
                      <p>
                        Coverage:{" "}
                        {formatCurrency(assessmentResult.coverageAmount || 0)}
                      </p>
                      <p>
                        Within Coverage:{" "}
                        {assessmentResult.isWithinCoverage ? "Yes" : "No"}
                      </p>
                      <p>Status: {assessmentResult.claimStatus}</p>
                      <p>Reason: {assessmentResult.rejectionReason || "N/A"}</p>
                      <p>
                        Fake Image:{" "}
                        {assessmentResult.isFakeImage ? "Yes" : "No"}
                      </p>
                      <p>
                        Fake Reason: {assessmentResult.fakeImageReason || "N/A"}
                      </p>
                      <p>
                        Number Plate Match:{" "}
                        {assessmentResult.numberPlateMatches
                          ? "Yes"
                          : assessmentResult.numberPlateVisible
                          ? "No"
                          : "N/A"}
                      </p>
                      <p>
                        Policy Expired:{" "}
                        {assessmentResult.isPolicyExpired ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t border-[#333333] bg-[#1a1a1a] py-4">
            <Button
              onClick={() =>
                onAssessmentComplete(assessmentResult || { skipped: true })
              }
              className="bg-[#00FFFF] hover:bg-[#00CCCC] text-black font-medium"
              disabled={assessmentRequired}
            >
              {assessmentRequired
                ? "Complete Assessment First"
                : "Complete Assessment"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
