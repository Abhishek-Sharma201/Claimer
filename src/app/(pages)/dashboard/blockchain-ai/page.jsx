"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  User,
  Database,
  Car,
  Home,
  Umbrella,
  Heart,
  FileCheck,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { addDocumentToBlockchain, initializeBlockchain, getBlockchain, setupBlockchainListener } from "../../../../lib/blockchain"

export default function UserPage() {
    const [documents, setDocuments] = useState([]);
    const [newDocument, setNewDocument] = useState({
      documentType: "policy",
      policyType: "auto",
      policyNumber: "",
      policyHolderName: "",
      policyStartDate: "",
      policyEndDate: "",
      coverageAmount: "",
      premiumAmount: "",
      description: "",
      additionalDetails: ""
    });
    const [userName, setUserName] = useState("John Doe");
    const [userId, setUserId] = useState("POLICYHOLDER-" + Math.floor(Math.random() * 1000));
    const [successMessage, setSuccessMessage] = useState("");
    
    // Initialize blockchain and load documents on component mount
    useEffect(() => {
      // Initialize blockchain if needed
      initializeBlockchain();
      
      // Load user documents initially
      loadUserDocuments();
      
      // Load user info from localStorage if available
      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      } else {
        localStorage.setItem("userName", userName);
      }
      
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        localStorage.setItem("userId", userId);
      }
      
      // Set up blockchain update listener
      const cleanupListener = setupBlockchainListener(() => {
        console.log("Blockchain updated, reloading documents...");
        loadUserDocuments();
      });
      
      // Clean up the listener when component unmounts
      return () => {
        cleanupListener();
      };
    }, []);
    
    // Load user documents from blockchain
    const loadUserDocuments = () => {
      const blockchain = getBlockchain();
      // Filter blocks that belong to this user (excluding genesis block)
      const userDocs = blockchain
        .filter(block => 
          block.document.userId === userId || 
          (block.document.uploadedBy === userId) ||
          (block.document.policyHolderName === userName) ||
          (block.document.type !== "system" && blockchain.indexOf(block) > 0 && !block.document.userId && !block.document.uploadedBy)
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setDocuments(userDocs);
    };
    
    // Handle input change
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewDocument(prev => ({
        ...prev,
        [name]: value
      }));
    };
    
    // Handle document submission
    const handleSubmitDocument = () => {
      // Generate document ID based on type
      let documentId;
      if (newDocument.documentType === "policy") {
        documentId = `POL-${Date.now().toString(36).toUpperCase()}`;
      } else if (newDocument.documentType === "claim") {
        documentId = `CLM-${Date.now().toString(36).toUpperCase()}`;
      } else {
        documentId = `DOC-${Date.now().toString(36).toUpperCase()}`;
      }
      
      // Add user info to document
      const documentToAdd = {
        ...newDocument,
        id: documentId,
        userId: userId,
        uploadedBy: userId,
        uploadedByName: userName,
        uploadedAt: new Date().toISOString()
      };
      
      // Add document to blockchain
      addDocumentToBlockchain(documentToAdd);
      
      // Show success message
      setSuccessMessage("Insurance document successfully added to blockchain!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Reset form
      setNewDocument({
        documentType: "policy",
        policyType: "auto",
        policyNumber: "",
        policyHolderName: "",
        policyStartDate: "",
        policyEndDate: "",
        coverageAmount: "",
        premiumAmount: "",
        description: "",
        additionalDetails: ""
      });
      
      // Reload documents
      loadUserDocuments();
    };
    
    // Format date
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };
  
    // Get document type icon
    const getDocumentTypeIcon = (docType) => {
      switch(docType) {
        case "policy":
          return <Umbrella className="h-5 w-5 text-[#6B46C1]" />;
        case "claim":
          return <FileCheck className="h-5 w-5 text-[#6B46C1]" />;
        case "health":
          return <Heart className="h-5 w-5 text-[#6B46C1]" />;
        case "auto":
          return <Car className="h-5 w-5 text-[#6B46C1]" />;
        case "home":
          return <Home className="h-5 w-5 text-[#6B46C1]" />;
        default:
          return <FileText className="h-5 w-5 text-[#6B46C1]" />;
      }
    };
    
    return (
      <div className="min-h-screen bg-black">
        <header className="bg-black border-b border-[#333333] py-4 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold tracking-tight text-[#6B46C1]">
                Insurance Blockchain Verification - Policyholder Portal
              </h1>
              <div className="flex items-center space-x-2">
                <div className="bg-[#6B46C1]/20 p-2 rounded-full">
                  <User className="h-5 w-5 text-[#6B46C1]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-gray-400">ID: {userId}</p>
                </div>

              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Upload form */}
            <div className="md:col-span-2">
              <Card className="border-[#333333] bg-[#1a1a1a]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5 text-[#6B46C1]" />
                    Submit Insurance Document
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Add a new insurance document to the blockchain for verification and secure storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {successMessage && (
                    <Alert className="mb-4 bg-green-900/20 border-green-900/30 text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Document Type</label>
                        <select
                          name="documentType"
                          value={newDocument.documentType}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-[#333333] rounded p-2 text-white"
                        >
                          <option value="policy">Insurance Policy</option>
                          <option value="claim">Insurance Claim</option>
                          <option value="endorsement">Policy Endorsement</option>
                          <option value="certificate">Insurance Certificate</option>
                          <option value="receipt">Premium Receipt</option>
                        </select>
                      </div>
                      
                      {newDocument.documentType === "policy" && (
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Policy Type</label>
                          <select
                            name="policyType"
                            value={newDocument.policyType}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-[#333333] rounded p-2 text-white"
                          >
                            <option value="auto">Auto Insurance</option>
                            <option value="home">Home Insurance</option>
                            <option value="health">Health Insurance</option>
                            <option value="life">Life Insurance</option>
                            <option value="travel">Travel Insurance</option>
                            <option value="business">Business Insurance</option>
                          </select>
                        </div>
                      )}
                      
                      {newDocument.documentType === "claim" && (
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Claim Type</label>
                          <select
                            name="claimType"
                            value={newDocument.claimType}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-[#333333] rounded p-2 text-white"
                          >
                            <option value="auto">Auto Claim</option>
                            <option value="home">Home Claim</option>
                            <option value="health">Health Claim</option>
                            <option value="life">Life Claim</option>
                            <option value="travel">Travel Claim</option>
                            <option value="business">Business Claim</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Policy Number</label>
                        <Input
                          name="policyNumber"
                          placeholder="Enter policy number"
                          value={newDocument.policyNumber}
                          onChange={handleInputChange}
                          className="bg-black border-[#333333] text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Policyholder Name</label>
                        <Input
                          name="policyHolderName"
                          placeholder="Enter policyholder name"
                          value={newDocument.policyHolderName}
                          onChange={handleInputChange}
                          className="bg-black border-[#333333] text-white"
                        />
                      </div>
                    </div>
                    
                    {newDocument.documentType === "policy" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Policy Start Date</label>
                            <Input
                              type="date"
                              name="policyStartDate"
                              value={newDocument.policyStartDate}
                              onChange={handleInputChange}
                              className="bg-black border-[#333333] text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Policy End Date</label>
                            <Input
                              type="date"
                              name="policyEndDate"
                              value={newDocument.policyEndDate}
                              onChange={handleInputChange}
                              className="bg-black border-[#333333] text-white"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Coverage Amount</label>
                            <Input
                              name="coverageAmount"
                              placeholder="Enter coverage amount"
                              value={newDocument.coverageAmount}
                              onChange={handleInputChange}
                              className="bg-black border-[#333333] text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Premium Amount</label>
                            <Input
                              name="premiumAmount"
                              placeholder="Enter premium amount"
                              value={newDocument.premiumAmount}
                              onChange={handleInputChange}
                              className="bg-black border-[#333333] text-white"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    {newDocument.documentType === "claim" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Incident Date</label>
                            <Input
                              type="date"
                              name="incidentDate"
                              value={newDocument.incidentDate}
                              onChange={handleInputChange}
                              className="bg-black border-[#333333] text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Claim Amount</label>
                            <Input
                              name="claimAmount"
                              placeholder="Enter claim amount"
                              value={newDocument.claimAmount}
                              onChange={handleInputChange}
                              className="bg-black border-[#333333] text-white"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Description</label>
                      <Textarea
                        name="description"
                        placeholder="Enter a brief description"
                        value={newDocument.description}
                        onChange={handleInputChange}
                        rows={2}
                        className="bg-black border-[#333333] text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Additional Details</label>
                      <Textarea
                        name="additionalDetails"
                        placeholder="Enter any additional details or notes"
                        value={newDocument.additionalDetails}
                        onChange={handleInputChange}
                        rows={4}
                        className="bg-black border-[#333333] text-white"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#333333] pt-4">
                  <Button
                    onClick={handleSubmitDocument}
                    className="w-full bg-[#6B46C1] hover:bg-[#5B36B1] text-white"
                    disabled={!newDocument.policyNumber || !newDocument.policyHolderName}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Submit to Insurance Blockchain
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-6 bg-[#6B46C1]/10 p-4 rounded border border-[#6B46C1]/20">
                <div className="flex items-start">
                  <Database className="h-5 w-5 text-[#6B46C1] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Insurance Blockchain Verification</h4>
                    <p className="text-sm text-gray-300 mt-2">
                      When you submit an insurance document, it is securely added to our blockchain as a new block. Each block contains a unique hash 
                      based on the document content and previous block, creating an immutable chain. An insurance administrator must verify 
                      each document to complete the verification process.
                    </p>
                    <p className="text-sm text-gray-300 mt-2">
                      Once verified, your insurance document is permanently recorded and cannot be altered without breaking the blockchain's 
                      integrity, providing a secure and transparent verification system for all your insurance needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Document list */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#6B46C1]" />
                  Your Insurance Documents
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadUserDocuments}
                  className="text-blue-700 border-[#333333] hover:bg-[#1a1a1a]"
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                </Button>
              </div>
              
              {documents.length === 0 ? (
                <Card className="border-[#333333] bg-[#1a1a1a]">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-500 mb-2" />
                    <p className="text-center text-gray-400">No insurance documents uploaded yet</p>
                    <p className="text-center text-gray-500 text-sm mt-1">
                      Submit your first document to get started
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {documents.map((block) => (
                    <Card key={block.blockHash} className="border-[#333333] bg-[#1a1a1a] overflow-hidden">
                      <div className={`h-1 ${block.verified ? "bg-green-600" : "bg-yellow-600"}`}></div>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            {getDocumentTypeIcon(block.document.documentType || block.document.policyType)}
                            <h3 className="font-medium text-white ml-2 truncate pr-2">
                              {block.document.documentType === "policy" 
                                ? `${block.document.policyType?.charAt(0).toUpperCase() || ''}${block.document.policyType?.slice(1) || ''} Policy` 
                                : block.document.documentType === "claim"
                                  ? `Insurance Claim`
                                  : "Insurance Document"}
                            </h3>
                          </div>
                          <Badge className={block.verified ? "bg-green-600" : "bg-yellow-600"}>
                            {block.verified ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Verified</>
                            ) : (
                              <><Clock className="h-3 w-3 mr-1" /> Pending</>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-400 mb-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Uploaded: {formatDate(block.timestamp)}</span>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          {block.document.policyNumber && (
                            <p className="text-sm">
                              <span className="text-gray-400">Policy #:</span>{" "}
                              <span className="text-white">{block.document.policyNumber}</span>
                            </p>
                          )}
                          
                          {block.document.policyHolderName && (
                            <p className="text-sm">
                              <span className="text-gray-400">Policyholder:</span>{" "}
                              <span className="text-white">{block.document.policyHolderName}</span>
                            </p>
                          )}
                          
                          {block.document.coverageAmount && (
                            <p className="text-sm">
                              <span className="text-gray-400">Coverage:</span>{" "}
                              <span className="text-[#00FFFF]">${block.document.coverageAmount}</span>
                            </p>
                          )}
                          
                          {block.document.claimAmount && (
                            <p className="text-sm">
                              <span className="text-gray-400">Claim Amount:</span>{" "}
                              <span className="text-[#00FFFF]">${block.document.claimAmount}</span>
                            </p>
                          )}
                        </div>
                        
                        <div className="bg-black p-2 rounded text-xs font-mono text-[#00FFFF] truncate mb-3">
                          Hash: {block.documentHash}
                        </div>
                        
                        {block.verified && (
                          <div className="bg-green-900/20 p-2 rounded border border-green-900/30 text-xs">
                            <p className="text-green-400">
                              Verified by {block.verifiedBy} at {formatDate(block.verifiedAt)}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        
        <footer className="bg-black border-t border-[#333333] py-4 mt-10">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-gray-400">
              Insurance Blockchain Verification System &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    );
  }