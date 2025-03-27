
// src/lib/documentExtractor.ts
import axios from 'axios';
import { DocumentData, ExtractionResult } from '../types/DocumentTypes';

export const extractDocumentData = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Use a free document extraction API
    const response = await axios.post('/api/extract-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return {
      success: true,
      data: {
        ...response.data,
        extractionDate: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Document extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown extraction error'
    };
  }
};

export const saveDocumentToLocalStorage = (data) => {
  try {
    const existingDocuments = JSON.parse(
      localStorage.getItem('extractedDocuments') || '[]'
    );
    
    const updatedDocuments = [
      ...existingDocuments, 
      { ...data, id: Date.now() }
    ];

    localStorage.setItem(
      'extractedDocuments', 
      JSON.stringify(updatedDocuments)
    );
  } catch (error) {
    console.error('Local storage save error:', error);
  }
};

export const getDocumentsFromLocalStorage = ()=> {
  try {
    return JSON.parse(
      localStorage.getItem('extractedDocuments') || '[]'
    );
  } catch (error) {
    console.error('Local storage read error:', error);
    return [];
  }
};
