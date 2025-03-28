"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, CheckCircle, Clock, AlertTriangle, Database, User, Lock, Unlock, RefreshCw, Search, ChevronDown, ChevronUp, Eye, EyeOff, Car, Home, Heart, Umbrella, FileCheck, Calendar } from 'lucide-react';

import { 
  getBlockchain, 
  verifyBlock, 
  validateBlockchain, 
  tamperWithBlockchain,
  initializeBlockchain,
  getDocumentsByType,
  setupBlockchainListener
} from "../../../../lib/blockchain";

export default function AdminPage() {
  const [blockchain, setBlockchain] = useState([]);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [validationResult, setValidationResult] = useState({ valid: true, errors: [] });
  const [adminId, setAdminId] = useState("INSADMIN-" + Math.floor(Math.random() * 1000));
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [showContent, setShowContent] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Initialize blockchain and load data on component mount
  useEffect(() => {
    // Initialize blockchain if needed
    initializeBlockchain();
    
    // Load blockchain data initially
    loadBlockchainData();
    
    // Load admin ID from localStorage if available
    const storedAdminId = localStorage.getItem("adminId");
    if (storedAdminId) {
      setAdminId(storedAdminId);
    } else {
      localStorage.setItem("adminId", adminId);
    }
    
    // Set up blockchain update listener
    const cleanupListener = setupBlockchainListener((detail) => {
      console.log("Blockchain updated in admin panel:", detail);
      loadBlockchainData();
      setLastUpdate(new Date());
    });
    
    // Clean up the listener when component unmounts
    return () => {
      cleanupListener();
    };
  }, []);
  
  // Load blockchain data
  const loadBlockchainData = () => {
    const chain = getBlockchain();
    setBlockchain(chain);
    
    // Filter pending documents (excluding genesis block)
    const pending = chain.filter(block => !block.verified && chain.indexOf(block) > 0);
    setPendingDocuments(pending);
    
    // Validate blockchain
    const validation = validateBlockchain();
    setValidationResult(validation);
  };
  
  // Handle block verification
  const handleVerifyBlock = (blockHash) => {
    const result = verifyBlock(blockHash, adminId);
    if (result.success) {
      loadBlockchainData();
    }
  };
  
  // Handle blockchain tampering (for demo)
  const handleTamperBlockchain = () => {
    const result = tamperWithBlockchain();
    if (result.success) {
      loadBlockchainData();
    }
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = blockchain.filter(block => {
      const doc = block.document;
      return (
        (doc.policyNumber && doc.policyNumber.toLowerCase().includes(query)) ||
        (doc.policyHolderName && doc.policyHolderName.toLowerCase().includes(query)) ||
        (doc.description && doc.description.toLowerCase().includes(query)) ||
        (doc.additionalDetails && doc.additionalDetails.toLowerCase().includes(query)) ||
        (doc.id && doc.id.toLowerCase().includes(query)) ||
        (block.documentHash && block.documentHash.toLowerCase().includes(query))
      );
    });
    
    setSearchResults(results);
  };
  
  // Toggle block expansion
  const toggleBlockExpansion = (blockHash) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockHash]: !prev[blockHash]
    }));
  };
  
  // Toggle content visibility
  const toggleContentVisibility = (blockHash) => {
    setShowContent(prev => ({
      ...prev,
      [blockHash]: !prev[blockHash]
    }));
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get document type icon
  const getDocumentTypeIcon = (docType, policyType) => {
    if (docType === "policy") {
      switch(policyType) {
        case "auto":
          return <Car className="h-4 w-4 text-blue-400" />;
        case "home":
          return <Home className="h-4 w-4 text-green-400" />;
        case "health":
          return <Heart className="h-4 w-4 text-red-400" />;
        default:
          return <Umbrella className="h-4 w-4 text-[#6B46C1]" />;
      }
    } else if (docType === "claim") {
      return <FileCheck className="h-4 w-4 text-yellow-400" />;
    } else {
      return <FileText className="h-4 w-4 text-[#00FFFF]" />;
    }
  };
  
  // Render a single block
  const renderBlock = (block, index) => {
    const isExpanded = expandedBlocks[block.blockHash] || false;
    const isContentVisible = showContent[block.blockHash] || false;
    const doc = block.document;
    
    return (
      <Card key={block.blockHash} className="border-[#333333] bg-[#1a1a1a] overflow-hidden mb-4">
        <div className={`h-1 ${block.verified ? "bg-green-600" : "bg-yellow-600"}`}></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                {index === 0 ? "Genesis Block" : `Block #${index}`}
                <Badge className={block.verified ? "bg-green-600" : "bg-yellow-600"}>
                  {block.verified ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Verified</>
                  ) : (
                    <><Clock className="h-3 w-3 mr-1" /> Pending</>
                  )}
                </Badge>
                {doc.documentType && (
                  <Badge className="bg-[#6B46C1]">
                    {doc.documentType === "policy" 
                      ? `${doc.policyType?.charAt(0).toUpperCase() || ''}${doc.policyType?.slice(1) || ''} Policy` 
                      : doc.documentType === "claim"
                        ? "Insurance Claim"
                        : doc.documentType.charAt(0).toUpperCase() + doc.documentType.slice(1)}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Created: {formatDate(block.timestamp)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {!block.verified && index > 0 && (
                <Button 
                  onClick={() => handleVerifyBlock(block.blockHash)}
                  className="bg-[#6B46C1] hover:bg-[#5B36B1] text-white"
                  size="sm"
                >
                  Verify
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleBlockExpansion(block.blockHash)}
                className="border-[#333333] text-white hover:bg-[#333333]"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Document Hash:</p>
                  <div className="bg-black p-2 rounded overflow-hidden">
                    <p className="text-sm font-mono text-[#00FFFF] truncate">
                      {block.documentHash}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Block Hash:</p>
                  <div className="bg-black p-2 rounded overflow-hidden">
                    <p className="text-sm font-mono text-[#00FFFF] truncate">
                      {block.blockHash}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Previous Block Hash:</p>
                <div className="bg-black p-2 rounded overflow-hidden">
                  <p className="text-sm font-mono text-gray-400 truncate">
                    {block.previousHash}
                  </p>
                </div>
              </div>
              
              {index > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-400">Insurance Document Details:</p>
                    {doc.additionalDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleContentVisibility(block.blockHash)}
                        className="h-6 text-xs text-gray-400 hover:text-white"
                      >
                        {isContentVisible ? (
                          <><EyeOff className="h-3 w-3 mr-1" /> Hide Details</>
                        ) : (
                          <><Eye className="h-3 w-3 mr-1" /> Show Details</>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  <div className="bg-black p-3 rounded">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {doc.policyNumber && (
                        <div>
                          <p className="text-xs text-gray-400">Policy Number:</p>
                          <p className="text-sm text-white">{doc.policyNumber}</p>
                        </div>
                      )}
                      
                      {doc.policyHolderName && (
                        <div>
                          <p className="text-xs text-gray-400">Policyholder:</p>
                          <p className="text-sm text-white">{doc.policyHolderName}</p>
                        </div>
                      )}
                      
                      {doc.policyStartDate && (
                        <div>
                          <p className="text-xs text-gray-400">Start Date:</p>
                          <p className="text-sm text-white">{doc.policyStartDate}</p>
                        </div>
                      )}
                      
                      {doc.policyEndDate && (
                        <div>
                          <p className="text-xs text-gray-400">End Date:</p>
                          <p className="text-sm text-white">{doc.policyEndDate}</p>
                        </div>
                      )}
                      
                      {doc.coverageAmount && (
                        <div>
                          <p className="text-xs text-gray-400">Coverage Amount:</p>
                          <p className="text-sm text-[#00FFFF]">${doc.coverageAmount}</p>
                        </div>
                      )}
                      
                      {doc.premiumAmount && (
                        <div>
                          <p className="text-xs text-gray-400">Premium Amount:</p>
                          <p className="text-sm text-white">${doc.premiumAmount}</p>
                        </div>
                      )}
                      
                      {doc.incidentDate && (
                        <div>
                          <p className="text-xs text-gray-400">Incident Date:</p>
                          <p className="text-sm text-white">{doc.incidentDate}</p>
                        </div>
                      )}
                      
                      {doc.claimAmount && (
                        <div>
                          <p className="text-xs text-gray-400">Claim Amount:</p>
                          <p className="text-sm text-[#00FFFF]">${doc.claimAmount}</p>
                        </div>
                      )}
                      
                      {doc.description && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-400">Description:</p>
                          <p className="text-sm text-white">{doc.description}</p>
                        </div>
                      )}
                    </div>
                    
                    {isContentVisible && doc.additionalDetails && (
                      <div className="mt-2 pt-2 border-t border-[#333333]">
                        <p className="text-xs text-gray-400 mb-1">Additional Details:</p>
                        <div className="max-h-40 overflow-y-auto bg-[#111111] p-2 rounded">
                          <p className="text-sm text-white whitespace-pre-wrap">{doc.additionalDetails}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {block.verified && (
                <div className="bg-green-900/20 p-3 rounded border border-green-900/30">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm text-green-400">Verified by {block.verifiedBy}</p>
                      <p className="text-xs text-gray-400">at {formatDate(block.verifiedAt)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };
  
  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black border-b border-[#333333] py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight text-[#6B46C1]">
              Insurance Blockchain Verification - Admin Panel
            </h1>
            <div className="flex items-center space-x-2">
              <div className="bg-[#6B46C1]/20 p-2 rounded-full">
                <Shield className="h-5 w-5 text-[#6B46C1]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Insurance Admin</p>
                <p className="text-xs text-gray-400">ID: {adminId}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = "/user"}
                className="text-white border-[#333333] hover:bg-[#1a1a1a]"
              >
                <User className="h-4 w-4 mr-1" /> Policyholder Portal
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#1a1a1a] border border-[#333333]">
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white"
            >
              Pending Verifications
            </TabsTrigger>
            <TabsTrigger 
              value="blockchain"
              className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white"
            >
              Blockchain Explorer
            </TabsTrigger>
            <TabsTrigger 
              value="search"
              className="data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white"
            >
              Search
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-[#333333] bg-[#1a1a1a]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-[#6B46C1]" />
                    Insurance Blockchain Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Total Documents:</p>
                      <Badge className="bg-[#6B46C1]">{blockchain.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Verified:</p>
                      <Badge className="bg-green-600">{blockchain.filter(b => b.verified).length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400">Pending:</p>
                      <Badge className="bg-yellow-600">{pendingDocuments.length}</Badge>
                    </div>
                    <div className="pt-2">
                      <div className="w-full bg-[#333333] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#00FFFF] h-full"
                          style={{
                            width: `${(blockchain.filter(b => b.verified).length / blockchain.length) * 100 || 0}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        {Math.round((blockchain.filter(b => b.verified).length / blockchain.length) * 100 || 0)}% Verified
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Last updated: {lastUpdate.toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-[#333333] bg-[#1a1a1a]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    Pending Insurance Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingDocuments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6">
                        <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                        <p className="text-gray-300">All insurance documents verified</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-300">
                          You have <span className="text-yellow-500 font-bold">{pendingDocuments.length}</span> insurance documents waiting
                          for verification
                        </p>
                        <Button
                          onClick={() => setActiveTab("pending")}
                          className="w-full bg-[#6B46C1] hover:bg-[#5B36B1] text-white"
                        >
                          Review Pending Documents
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-[#333333] bg-[#1a1a1a]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    {validationResult.valid ? (
                      <><Lock className="h-5 w-5 text-[#00FFFF]" /> Blockchain Integrity</>
                    ) : (
                      <><Unlock className="h-5 w-5 text-red-500" /> Blockchain Compromised</>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {validationResult.valid ? (
                      <div className="bg-[#00FFFF]/10 p-3 rounded border border-[#00FFFF]/20">
                        <p className="text-[#00FFFF] flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          Insurance blockchain integrity verified
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          All insurance documents in the blockchain are valid and have not been tampered with.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-900/20 p-3 rounded border border-red-900/30">
                        <p className="text-red-400 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Insurance blockchain integrity compromised
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          {validationResult.errors.length} integrity issues detected in the blockchain.
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-2 flex gap-2">
                      <Button
                        onClick={loadBlockchainData}
                        className="flex-1 bg-[#1a1a1a] border border-[#333333] hover:bg-[#333333] text-white"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                      </Button>
                      <Button
                        onClick={handleTamperBlockchain}
                        className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/30"
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" /> Tamper (Demo)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Recent Insurance Documents</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadBlockchainData}
                  className="border-[#333333] text-white hover:bg-[#333333]"
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                </Button>
              </div>
              {blockchain.slice(0, 3).map((block, index) => renderBlock(block, blockchain.indexOf(block)))}
              
              {blockchain.length > 3 && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("blockchain")}
                    className="border-[#333333] text-white hover:bg-[#333333]"
                  >
                    View All Insurance Documents
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Pending Insurance Documents</h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-600">{pendingDocuments.length} Pending</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadBlockchainData}
                    className="border-[#333333] text-white hover:bg-[#333333]"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                  </Button>
                </div>
              </div>
              
              {pendingDocuments.length === 0 ? (
                <Card className="border-[#333333] bg-[#1a1a1a]">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                    <p className="text-center text-gray-300">All insurance documents have been verified</p>
                    <p className="text-center text-gray-400 text-sm mt-1">
                      There are no pending documents requiring verification
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingDocuments.map((block) => renderBlock(block, blockchain.indexOf(block)))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="blockchain" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Insurance Blockchain Explorer</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={documentTypeFilter}
                    onChange={(e) => setDocumentTypeFilter(e.target.value)}
                    className="bg-black border border-[#333333] rounded p-1 text-white text-sm"
                  >
                    <option value="all">All Documents</option>
                    <option value="policy">Insurance Policies</option>
                    <option value="claim">Insurance Claims</option>
                    <option value="endorsement">Policy Endorsements</option>
                    <option value="certificate">Insurance Certificates</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadBlockchainData}
                    className="border-[#333333] text-white hover:bg-[#333333]"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                  </Button>
                </div>
              </div>
              
              {!validationResult.valid && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-900/30 text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Insurance Blockchain Integrity Compromised</AlertTitle>
                  <AlertDescription>
                    The blockchain has been tampered with. {validationResult.errors.length} integrity issues detected.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                {blockchain
                  .filter(block => 
                    documentTypeFilter === "all" || 
                    block.document.documentType === documentTypeFilter ||
                    block.document.type === documentTypeFilter
                  )
                  .map((block, index) => renderBlock(block, blockchain.indexOf(block)))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="mt-6">
            <div className="space-y-6">
              <Card className="border-[#333333] bg-[#1a1a1a]">
                <CardHeader>
                  <CardTitle className="text-white">Search Insurance Documents</CardTitle>
                  <CardDescription className="text-gray-400">
                    Search for insurance documents by policy number, policyholder name, or document hash
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter policy number, policyholder name, or hash..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-black border-[#333333] text-white"
                    />
                    <Button 
                      onClick={handleSearch}
                      className="bg-[#6B46C1] hover:bg-[#5B36B1] text-white"
                    >
                      <Search className="h-4 w-4 mr-1" /> Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                {searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-xl font-medium text-white mb-4">Search Results</h3>
                    {searchResults.map((block) => renderBlock(block, blockchain.indexOf(block)))}
                  </div>
                ) : searchQuery ? (
                  <Card className="border-[#333333] bg-[#1a1a1a]">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-400">No insurance documents found matching your search</p>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
