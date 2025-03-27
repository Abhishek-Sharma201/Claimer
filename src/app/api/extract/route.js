import { NextResponse } from "next/server"

// OCR.space API key - you should move this to an environment variable
const OCR_API_KEY = "K81455055988957" // Free API key for testing

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("document")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text using OCR.space API
    const extractedText = await extractTextWithOCR(buffer, file.name)

    // Process the extracted text
    const extractedData = extractDataFromText(extractedText)

    // Log the extracted data to server console
    console.log("Extracted data from document:", JSON.stringify(extractedData, null, 2))

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error("Error processing document:", error)
    return NextResponse.json({ error: "Failed to process document: " + error.message }, { status: 500 })
  }
}

// Function to extract text using OCR.space API
async function extractTextWithOCR(fileBuffer, fileName) {
  try {
    // Create form data for OCR.space API
    const formData = new FormData()

    // Convert buffer to blob
    const blob = new Blob([fileBuffer])
    formData.append("file", blob, fileName)

    // Set OCR.space API parameters
    formData.append("apikey", OCR_API_KEY)
    formData.append("language", "eng")
    formData.append("isOverlayRequired", "false")
    formData.append("iscreatesearchablepdf", "false")
    formData.append("issearchablepdfhidetextlayer", "false")

    // Call OCR.space API
    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`OCR API error: ${response.status}`)
    }

    const result = await response.json()

    if (result.IsErroredOnProcessing) {
      throw new Error(`OCR processing error: ${result.ErrorMessage[0]}`)
    }

    // Extract text from OCR result
    let extractedText = ""
    if (result.ParsedResults && result.ParsedResults.length > 0) {
      extractedText = result.ParsedResults[0].ParsedText
    }

    return extractedText
  } catch (error) {
    console.error("OCR extraction error:", error)
    throw new Error("Failed to extract text from document: " + error.message)
  }
}

// Function to extract data from document text using regex
function extractDataFromText(text) {
  // Extract data using regex patterns
  const extractField = (pattern, defaultValue = "") => {
    const match = text.match(pattern)
    return match ? match[1].trim() : defaultValue
  }

  // Extract name
  const name = extractField(/Name:?\s*([^\n]+)/i)

  // Extract email
  const email = extractField(/Email:?\s*([^\n]+)/i)

  // Extract car color
  const carColor = extractField(/Car\s*Color:?\s*([^\n]+)/i)

  // Extract number plate
  const numberPlate = extractField(/Number\s*Plate:?\s*([^\n]+)/i)

  // Extract policy number
  const policyNumber = extractField(/Policy\s*Number:?\s*([^\n]+)/i)

  // Extract policy type
  const policyType = extractField(/Policy\s*Type:?\s*([^\n]+)/i)

  // Extract coverage includes
  const coverageText = text.match(/Coverage\s*Includes:?\s*([\s\S]*?)(?=VALIDITY|$)/i)
  const coverageIncludes = coverageText
    ? coverageText[1]
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.includes("Coverage Includes:"))
    : []

  // Improved date extraction with validation and correction
  let policyStartDate = extractField(/Policy\s*Start\s*Date:?\s*([^\n]+)/i)
  let policyEndDate = extractField(/Policy\s*(?:End|Expiry)\s*Date:?\s*([^\n]+)/i)

  // Fix common OCR errors in dates
  policyStartDate = fixDateFormat(policyStartDate)
  policyEndDate = fixDateFormat(policyEndDate)

  // Extract premium amount
  const premiumAmount = extractField(/Premium\s*Amount:?\s*([^\n]+)/i)

  // Create the structured JSON data
  const extractedData = {
    name,
    email,
    carColor,
    numberPlate,
    policyNumber,
    policyType,
    coverageIncludes,
    policyStartDate,
    policyEndDate,
    premiumAmount,
  }

  return extractedData
}

// Helper function to fix common OCR errors in dates
function fixDateFormat(dateStr) {
  if (!dateStr) return ""

  // Fix common OCR errors
  let fixed = dateStr
    .replace(/l44/gi, "14") // Fix OCR misreading 14 as l44
    .replace(/l4/gi, "14") // Fix OCR misreading 14 as l4
    .replace(/(\d+)4un/gi, "$1-Jun") // Fix "4un" to "-Jun"
    .replace(/(\d+)un/gi, "$1-Jun") // Fix "un" to "-Jun"
    .replace(/(\d+)[/.](\d+)[/.](\d+)/, "$1-$2-$3") // Standardize date separators
    .replace(/(\d+)\s+([A-Za-z]+)\s*[-,]?\s*(\d+)/, "$1-$2-$3") // Format "15 Jun 2024" to "15-Jun-2024"

  // Try to detect and fix date format
  const datePattern = /(\d{1,2})[-\s]([A-Za-z]{3,})[-\s](\d{2,4})/i
  const match = fixed.match(datePattern)

  if (match) {
    const day = match[1].padStart(2, "0")
    let month = match[2]
    const year = match[3].length === 2 ? `20${match[3]}` : match[3]

    // Standardize month abbreviation
    const months = {
      jan: "Jan",
      feb: "Feb",
      mar: "Mar",
      apr: "Apr",
      may: "May",
      jun: "Jun",
      jul: "Jul",
      aug: "Aug",
      sep: "Sep",
      oct: "Oct",
      nov: "Nov",
      dec: "Dec",
    }

    const monthLower = month.toLowerCase().substring(0, 3)
    if (months[monthLower]) {
      month = months[monthLower]
    }

    fixed = `${day}-${month}-${year}`
  }

  return fixed
}

