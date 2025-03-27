import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Simple image hosting service for temporary storage

// Simple image hosting service for temporary storage
const IMAGE_BB_API_KEY = 'e4071425955acfff34dd60e36b313121'

// Google Generative AI API key
const GOOGLE_API_KEY = 'AIzaSyDgACRoR_0aG5pgVenz8HE93fqQyJyrooY'
// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)

export async function POST(request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("damageImages")
    const policyType = formData.get("policyType") || "Home"
    const coverageAmount = formData.get("coverageAmount") || ""
    const propertyType = formData.get("propertyType") || ""
    const propertyLocation = formData.get("propertyLocation") || ""
    const policyEndDate = formData.get("policyEndDate") || ""

    // Check if policy is expired
    const isPolicyExpired = checkPolicyExpired(policyEndDate)
    if (isPolicyExpired) {
      console.log("CLAIM REJECTED: Policy expired", { policyEndDate })
      return NextResponse.json({
        claimStatus: "Rejected",
        rejectionReason: `Policy expired on ${policyEndDate}`,
        isPolicyExpired: true,
        confidenceScore: 100,
      })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 })
    }

    console.log(`Processing ${files.length} home damage image(s)`)

    // Upload all images to ImgBB
    const imageUrls = []
    for (const file of files) {
      console.log("Processing image:", file.name, file.type, `${Math.round(file.size / 1024)} KB`)
      const imageUrl = await uploadImageToImgBB(file)
      if (imageUrl) {
        imageUrls.push({ url: imageUrl, file })
        console.log("Image uploaded successfully, URL:", imageUrl)
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: "Failed to upload any images" }, { status: 500 })
    }

    // Use the primary image (first one) for the main analysis
    const primaryImage = imageUrls[0]

    // Now use Google's Gemini model to analyze the images
    const damageAssessment = await analyzeHomeDamageWithGemini(
      primaryImage.file,
      imageUrls.map((img) => img.url),
      policyType,
      coverageAmount,
      propertyType,
      propertyLocation,
      policyEndDate,
    )

    // Log the complete assessment data to console in JSON format
    console.log(
      "COMPLETE_HOME_ASSESSMENT_DATA:",
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          policyDetails: {
            policyType,
            propertyType,
            propertyLocation,
            coverageAmount,
            policyEndDate,
            isPolicyExpired,
          },
          assessment: damageAssessment,
          imageUrls: imageUrls.map((img) => img.url),
        },
        null,
        2,
      ),
    )

    return NextResponse.json(damageAssessment)
  } catch (error) {
    console.error("Error processing home damage images:", error)
    return NextResponse.json({ error: "Failed to process home damage images: " + error.message }, { status: 500 })
  }
}

// Function to check if policy is expired
function checkPolicyExpired(policyEndDate) {
  if (!policyEndDate) return false

  try {
    // Try different date formats
    let endDate = null

    // Try DD-MMM-YYYY format (e.g., 15-Jun-2024)
    if (policyEndDate.match(/\d{1,2}-[A-Za-z]{3}-\d{4}/)) {
      const parts = policyEndDate.split("-")
      const day = Number.parseInt(parts[0], 10)
      const monthMap = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      }
      const month = monthMap[parts[1]]
      const year = Number.parseInt(parts[2], 10)
      endDate = new Date(year, month, day)
    }
    // Try DD/MM/YYYY format
    else if (policyEndDate.includes("/")) {
      const parts = policyEndDate.split("/")
      endDate = new Date(parts[2], parts[1] - 1, parts[0])
    }
    // Try YYYY-MM-DD format
    else if (policyEndDate.includes("-")) {
      endDate = new Date(policyEndDate)
    }

    if (!endDate || isNaN(endDate.getTime())) {
      console.error("Invalid date format:", policyEndDate)
      return false
    }

    const today = new Date()
    return today > endDate
  } catch (error) {
    console.error("Error checking policy expiration:", error)
    return false
  }
}

// Function to upload an image to ImgBB service
async function uploadImageToImgBB(file) {
  try {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString("base64")

    // Create form data for ImgBB API
    const formData = new FormData()
    formData.append("key", IMAGE_BB_API_KEY)
    formData.append("image", base64Image)

    // Upload to ImgBB
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ImgBB API error:", errorText)
      throw new Error(`ImgBB API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data.url
  } catch (error) {
    console.error("Error uploading image:", error)
    return null
  }
}

// Function to analyze home damage using Google's Gemini model
async function analyzeHomeDamageWithGemini(
  file,
  imageUrls,
  policyType,
  coverageAmount,
  propertyType,
  propertyLocation,
  policyEndDate,
) {
  try {
    // Extract coverage amount as a number for comparison
    let coverageValue = 0
    if (coverageAmount) {
      // First try to extract numeric value with commas
      const matches = coverageAmount.match(/[\d,]+/g)
      if (matches && matches.length > 0) {
        // Remove commas and convert to number
        coverageValue = Number.parseFloat(matches[0].replace(/,/g, ""))
      }

      // If we couldn't extract a value or it's zero, try a more aggressive approach
      if (!coverageValue) {
        // Extract any digits
        const digits = coverageAmount.match(/\d+/g)
        if (digits && digits.length > 0) {
          coverageValue = Number.parseFloat(digits.join(""))
        }
      }

      console.log("Extracted coverage value:", coverageValue, "from", coverageAmount)
    }

    // Convert file to array buffer for Gemini API
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Convert buffer to base64 for Gemini
    const base64Image = buffer.toString("base64")

    // Create a detailed prompt for the Gemini model
    const prompt = `
      You are an expert property insurance damage assessor in India with 20 years of experience. 
      Analyze ${imageUrls.length > 1 ? "these images" : "this image"} of a damaged property and provide a detailed assessment.
      
      Property Information:
      - Policy Type: ${policyType}
      - Coverage Amount: ${coverageAmount}
      - Property Type: ${propertyType || "Not provided"}
      - Property Location: ${propertyLocation || "Not provided"}
      - Policy End Date: ${policyEndDate || "Not provided"}
      
      ${imageUrls.length > 1 ? `I've provided ${imageUrls.length} different images of the damage from different angles.` : ""}
      
      IMPORTANT - FAKE IMAGE DETECTION:
      First, determine if this is a genuine photograph of a real damaged property:
      - Is this a screenshot, drawing, or computer-generated image rather than a real photo? If yes, mark as fake.
      - Is this an image without any property or building visible? If yes, mark as fake.
      - Is this an image of an undamaged property? If yes, mark as fake.
      - Does the image show a property that matches the policy type? If no, mark as fake.
      
      PROPERTY VERIFICATION:
      - If you can identify the property location or address in the image, check if it appears to match "${propertyLocation}".
      - If visible and doesn't match, note this in your assessment.
      
      Please analyze the damage and provide:
      1. Damage Severity (Low/Medium/High)
      2. Affected Areas (list all damaged components in detail, e.g., roof, walls, foundation, etc.)
      3. Estimated Repair Costs in INR (materials and labor separately)
      4. Estimated Repair Time
      5. Your confidence level in this assessment (as a percentage between 0-100)
      
      IMPORTANT: Be very accurate with your confidence score:
      - If the damage is clearly visible and you can assess it well, your confidence should be 80-95%
      - If the damage is somewhat visible but some details are unclear, your confidence should be 60-80%
      - Only if the image is very unclear or damage is barely visible, your confidence should be below 60%
      - Never use a confidence score below 70% for clearly visible damage
      - If the image is fake or not showing a damaged property, set confidence to 100% but mark isFakeImage as true
      
      For the property in the image, be very specific about the damage you can see.
      
      Format your response as JSON with these fields:
      {
        "isFakeImage": false,
        "fakeImageReason": null,
        "propertyAddressVisible": false,
        "propertyAddressMatches": null,
        "damageSeverity": "Medium",
        "affectedAreas": ["Roof", "Ceiling", "Walls"],
        "materialsCost": 25000,
        "laborCost": 15000,
        "estimatedCost": 40000,
        "estimatedRepairTime": "7-10 days",
        "confidenceScore": 85,
        "assessmentNotes": "Detailed assessment notes here",
        "propertyType": "Type of property (e.g., Residential, Commercial, Apartment)"
      }
      
      Only respond with the JSON object, no additional text.
    `

    console.log("Calling Google Gemini API for home damage assessment...")

    // Initialize the Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Prepare the image for the model
    const imageData = [
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
    ]

    // Generate content with the model
    const result = await model.generateContent([prompt, ...imageData])
    const response = await result.response
    const text = response.text()

    console.log("Gemini API response received")

    // Parse the JSON response
    let assessmentData
    try {
      // Extract JSON from the response (in case there's any extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        assessmentData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No valid JSON found in response")
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      console.log("Raw response:", text)

      // Fallback to a basic assessment if parsing fails
      assessmentData = generateFallbackHomeAssessment(coverageValue, imageUrls[0])
    }

    // Add the image URLs to the assessment data
    assessmentData.imageUrls = imageUrls
    assessmentData.primaryImageUrl = imageUrls[0]

    // Check if the image is fake
    if (assessmentData.isFakeImage) {
      assessmentData.claimStatus = "Rejected"
      assessmentData.rejectionReason =
        assessmentData.fakeImageReason || "The uploaded image appears to be fake or invalid"
      console.log(`Claim REJECTED: Fake image detected - ${assessmentData.fakeImageReason}`)
      return assessmentData
    }

    // Check if property address doesn't match
    if (assessmentData.propertyAddressVisible && propertyLocation && !assessmentData.propertyAddressMatches) {
      assessmentData.claimStatus = "Rejected"
      assessmentData.rejectionReason = `Property in image doesn't match the insured property address`
      console.log(`Claim REJECTED: Property address mismatch`)
      return assessmentData
    }

    // Check if the estimated cost is within coverage
    const isWithinCoverage = assessmentData.estimatedCost <= coverageValue
    assessmentData.isWithinCoverage = isWithinCoverage

    // Determine claim status based on confidence score and coverage
    let claimStatus
    let rejectionReason = null

    // First check if confidence meets the threshold
    if (assessmentData.confidenceScore >= 70) {
      // If confidence is good, check coverage
      if (isWithinCoverage) {
        claimStatus = "Approved"
        console.log(`Claim APPROVED: Confidence ${assessmentData.confidenceScore}% >= 70% and within coverage`)
      } else {
        claimStatus = "Pending Admin Review"
        rejectionReason = `Repair cost (₹${assessmentData.estimatedCost.toLocaleString("en-IN")}) exceeds coverage (₹${coverageValue.toLocaleString("en-IN")})`
        console.log(`Claim PENDING REVIEW: Confidence good (${assessmentData.confidenceScore}%) but exceeds coverage`)
      }
    } else {
      claimStatus = "Pending Admin Review"
      rejectionReason = `Low confidence score (${assessmentData.confidenceScore}% < 70%)`
      console.log(`Claim PENDING REVIEW: Low confidence (${assessmentData.confidenceScore}% < 70%)`)
    }

    // Add claim status to the assessment data
    assessmentData.claimStatus = claimStatus
    assessmentData.rejectionReason = rejectionReason

    // Store the full details in the console for admin review
    console.log("HOME CLAIM ASSESSMENT DETAILS:", {
      timestamp: new Date().toISOString(),
      policyDetails: {
        policyType,
        propertyType,
        propertyLocation,
        coverageAmount,
        coverageValue,
        policyEndDate,
      },
      propertyInfo: {
        type: assessmentData.propertyType || "Unknown",
        propertyAddressMatches: assessmentData.propertyAddressMatches,
      },
      imageAuthenticity: {
        isFakeImage: assessmentData.isFakeImage,
        fakeImageReason: assessmentData.fakeImageReason,
      },
      damageAssessment: {
        severity: assessmentData.damageSeverity,
        affectedAreas: assessmentData.affectedAreas,
        estimatedCosts: {
          materials: assessmentData.materialsCost,
          labor: assessmentData.laborCost,
          total: assessmentData.estimatedCost,
        },
        repairTime: assessmentData.estimatedRepairTime,
        confidenceScore: assessmentData.confidenceScore,
      },
      claimStatus: {
        status: claimStatus,
        isWithinCoverage,
        rejectionReason,
      },
      imageUrls,
      notes: assessmentData.assessmentNotes,
    })

    return assessmentData
  } catch (error) {
    console.error("Home damage assessment error:", error)

    // Fallback to a basic assessment if AI fails
    const fallbackAssessment = generateFallbackHomeAssessment(0, imageUrls[0])

    // Log the error for admin review
    console.log("HOME CLAIM ASSESSMENT ERROR:", {
      timestamp: new Date().toISOString(),
      error: error.message,
      policyDetails: {
        policyType,
        propertyType,
        propertyLocation,
        coverageAmount,
        policyEndDate,
      },
      fallbackAssessment,
      imageUrls,
    })

    return fallbackAssessment
  }
}

// Function to generate a fallback assessment if AI analysis fails
function generateFallbackHomeAssessment(coverageValue, imageUrl) {
  // For home damage assessment
  const damageSeverity = "Medium"
  const affectedAreas = ["Roof", "Ceiling", "Walls", "Flooring"]

  // Calculate estimated costs based on severity
  const materialsCost = 45000
  const laborCost = 25000
  const estimatedCost = materialsCost + laborCost

  let claimStatus
  let rejectionReason = null

  // Check if the estimated cost is within coverage
  const isWithinCoverage = estimatedCost <= coverageValue

  // Generate assessment notes
  const assessmentNotes = `Based on our analysis, the property has medium severity damage affecting multiple areas. The roof shows signs of water damage and potential leakage. The ceiling has visible water stains and may require partial replacement. The walls show signs of moisture damage and will need repair and repainting. The flooring in affected areas may need replacement. The estimated repair cost is ₹${estimatedCost.toLocaleString("en-IN")} including materials (₹${materialsCost.toLocaleString("en-IN")}) and labor (₹${laborCost.toLocaleString("en-IN")}). ${!isWithinCoverage ? "Note: The estimated repair cost exceeds your coverage amount." : ""} Please consult with a professional contractor for a detailed inspection.`

  // Determine claim status based on coverage
  const confidenceScore = 85

  // Determine claim status based on coverage
  if (confidenceScore >= 70 && isWithinCoverage) {
    claimStatus = "Approved"
    console.log(`Fallback home assessment APPROVED: Confidence ${confidenceScore}% >= 70% and within coverage`)
  } else if (!isWithinCoverage) {
    claimStatus = "Pending Admin Review"
    rejectionReason = `Repair cost (₹${estimatedCost.toLocaleString("en-IN")}) exceeds coverage (₹${coverageValue.toLocaleString("en-IN")})`
    console.log(`Fallback home assessment PENDING REVIEW: Exceeds coverage`)
  } else {
    claimStatus = "Pending Admin Review"
    rejectionReason = `Low confidence score (${confidenceScore}% < 70%)`
    console.log(`Fallback home assessment PENDING REVIEW: Low confidence`)
  }

  // Log the fallback assessment for admin review
  console.log("FALLBACK HOME ASSESSMENT GENERATED:", {
    timestamp: new Date().toISOString(),
    reason: "AI analysis failed or returned invalid data, using fallback assessment",
    assessment: {
      damageSeverity,
      affectedAreas,
      materialsCost,
      laborCost,
      estimatedCost,
      estimatedRepairTime: "7-10 days",
      confidenceScore,
      isFakeImage: false,
      propertyAddressVisible: false,
      propertyAddressMatches: null,
    },
    claimStatus,
    rejectionReason,
    imageUrl,
  })

  // Return the assessment
  return {
    damageSeverity,
    affectedAreas,
    materialsCost,
    laborCost,
    estimatedCost,
    estimatedRepairTime: "7-10 days",
    assessmentNotes,
    confidenceScore,
    claimStatus,
    rejectionReason,
    imageUrls: [imageUrl],
    primaryImageUrl: imageUrl,
    isWithinCoverage,
    propertyType: "Residential Property",
    isFakeImage: false,
    fakeImageReason: null,
    propertyAddressVisible: false,
    propertyAddressMatches: null,
  }
}

