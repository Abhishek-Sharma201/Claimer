// Insurance blockchain implementation for document verification

// Storage key for blockchain data
const BLOCKCHAIN_STORAGE_KEY = 'insurance_blockchain';

// Generate a hash for a document
export function generateHash(data) {
  const stringData = typeof data === "string" ? data : JSON.stringify(data)
  let hash = 0

  // Simple hash algorithm
  for (let i = 0; i < stringData.length; i++) {
    const char = stringData.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  // Convert to hex string
  return Math.abs(hash).toString(16).padStart(8, "0")
}

// Create a new block
export function createBlock(document, previousHash = null) {
  const timestamp = new Date().toISOString()
  const documentHash = generateHash(document)
  const prevHash = previousHash || "0000000000000000"
  const blockHash = generateHash(documentHash + prevHash + timestamp)

  return {
    timestamp,
    document,
    documentHash,
    previousHash: prevHash,
    blockHash,
    verified: false,
    verifiedBy: null,
    verifiedAt: null,
    nonce: Math.floor(Math.random() * 1000000), // Simulate mining nonce
  }
}

// Get the blockchain from localStorage
export function getBlockchain() {
  try {
    const data = localStorage.getItem(BLOCKCHAIN_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting blockchain from localStorage:', error);
    return [];
  }
}

// Save the blockchain to localStorage and dispatch an event
export function saveBlockchain(blockchain) {
  try {
    localStorage.setItem(BLOCKCHAIN_STORAGE_KEY, JSON.stringify(blockchain));
    
    // Dispatch a custom event to notify other components of the update
    const event = new CustomEvent('blockchainUpdated', { 
      detail: { timestamp: new Date().toISOString() } 
    });
    window.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error('Error saving blockchain to localStorage:', error);
    return false;
  }
}

// Add a document to the blockchain
export function addDocumentToBlockchain(document) {
  const blockchain = getBlockchain()
  const previousHash = blockchain.length > 0 ? blockchain[blockchain.length - 1].blockHash : null
  const newBlock = createBlock(document, previousHash)

  blockchain.push(newBlock)
  saveBlockchain(blockchain)

  return newBlock
}

// Verify a document in the blockchain
export function verifyBlock(blockHash, adminId) {
  const blockchain = getBlockchain()
  const blockIndex = blockchain.findIndex((block) => block.blockHash === blockHash)

  if (blockIndex === -1) {
    return { success: false, message: "Block not found" }
  }

  blockchain[blockIndex].verified = true
  blockchain[blockIndex].verifiedBy = adminId
  blockchain[blockIndex].verifiedAt = new Date().toISOString()

  saveBlockchain(blockchain)

  return {
    success: true,
    message: "Block verified successfully",
    block: blockchain[blockIndex],
  }
}

// Validate the blockchain integrity
export function validateBlockchain() {
  const blockchain = getBlockchain()

  if (blockchain.length === 0) {
    return { valid: true, errors: [] }
  }

  const errors = []

  // Check each block's hash and previous hash
  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i]
    const previousBlock = blockchain[i - 1]

    // Check if previous hash matches
    if (currentBlock.previousHash !== previousBlock.blockHash) {
      errors.push({
        block: i,
        error: "Previous hash mismatch",
        expected: previousBlock.blockHash,
        actual: currentBlock.previousHash,
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Get document by ID from blockchain
export function getDocumentById(documentId) {
  const blockchain = getBlockchain()

  // Find all blocks containing this document ID
  const blocks = blockchain.filter((block) => {
    const doc = block.document
    return doc.id === documentId || doc.policyNumber === documentId || doc.claimId === documentId
  })

  // Sort by timestamp (newest first)
  return blocks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

// Get documents by type
export function getDocumentsByType(type) {
  const blockchain = getBlockchain()

  // Filter blocks by document type
  const blocks = blockchain.filter((block) => block.document.documentType === type || block.document.type === type)

  // Sort by timestamp (newest first)
  return blocks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

// Initialize blockchain with genesis block if empty
export function initializeBlockchain() {
  const blockchain = getBlockchain()

  if (blockchain.length === 0) {
    // Create genesis block
    const genesisBlock = createBlock({
      id: "GENESIS",
      type: "system",
      documentType: "Genesis Block",
      message: "Genesis Block - Insurance Document Verification System",
      createdAt: new Date().toISOString(),
    })

    // Mark genesis block as verified
    genesisBlock.verified = true
    genesisBlock.verifiedBy = "SYSTEM"
    genesisBlock.verifiedAt = new Date().toISOString()

    blockchain.push(genesisBlock)
    saveBlockchain(blockchain)
  }
}

// Tamper with blockchain (for demo purposes)
export function tamperWithBlockchain() {
  const blockchain = getBlockchain()

  if (blockchain.length < 3) {
    return { success: false, message: "Not enough blocks to tamper with" }
  }

  // Tamper with a random block (not genesis)
  const randomIndex = Math.floor(Math.random() * (blockchain.length - 2)) + 1
  const block = blockchain[randomIndex]

  // Modify the document data
  if (block.document.policyHolderName) {
    block.document.policyHolderName = block.document.policyHolderName + " (TAMPERED)"
  } else if (block.document.policyNumber) {
    block.document.policyNumber = block.document.policyNumber + "-TAMPERED"
  } else if (block.document.claimAmount) {
    block.document.claimAmount = block.document.claimAmount * 2
  } else {
    block.document.tampered = true
  }

  // Save the tampered blockchain
  saveBlockchain(blockchain)

  return {
    success: true,
    message: "Blockchain tampered with for demonstration",
    tamperedBlock: randomIndex,
  }
}

// Set up a listener for blockchain updates
export function setupBlockchainListener(callback) {
  const handleBlockchainUpdate = (event) => {
    if (callback && typeof callback === 'function') {
      callback(event.detail);
    }
  };
  
  // Remove any existing listener to prevent duplicates
  window.removeEventListener('blockchainUpdated', handleBlockchainUpdate);
  
  // Add the listener
  window.addEventListener('blockchainUpdated', handleBlockchainUpdate);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('blockchainUpdated', handleBlockchainUpdate);
  };
}
