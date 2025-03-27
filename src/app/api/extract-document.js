
// src/pages/api/extract-document.ts
import  { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(
  req, 
  res
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    try {
      const file = files.file;
      const fileBuffer = fs.readFileSync(file.filepath);

      // Parse PDF content
      const pdfData = await pdf(fileBuffer);
      const textContent = pdfData.text;

      // Basic text parsing (you'd replace this with more sophisticated extraction)
      const extractedData = {
        name: extractField(textContent, 'Name:'),
        email: extractField(textContent, 'Email:'),
        carColor: extractField(textContent, 'Car Color:'),
        numberPlate: extractField(textContent, 'Number Plate:'),
        policyNumber: extractField(textContent, 'Policy Number:'),
        policyType: extractField(textContent, 'Policy Type:'),
        coverageIncludes: extractListField(textContent, 'Coverage Includes:'),
        policyStartDate: extractField(textContent, 'Policy Start Date:'),
        policyEndDate: extractField(textContent, 'Policy End Date:'),
        premiumAmount: extractField(textContent, 'Premium Amount:')
      };

      res.status(200).json(extractedData);
    } catch (error) {
      console.error('Document extraction error:', error);
      res.status(500).json({ 
        error: 'Document extraction failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}


// Utility functions for basic text extraction
function extractField(text, label) {
  const regex = new RegExp(`${label}\\s*(.+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function extractListField(text, label) {
  const regex = new RegExp(`${label}\\s*(.+)`, 'i');
  const match = text.match(regex);
  return match 
    ? match[1].split(',').map(item => item.trim()) 
    : [];
}
