import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Upload PDF
export const uploadPDF = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/pdf/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Ask a question from uploaded PDF
export const askPDFQuestion = async (documentId, question) => {
  const response = await axios.post(
    `${API_URL}/pdf/ask`,
    {
      document_id: documentId,
      question: question,
    }
  );

  return response.data;
};

// Generate summary
export const generateSummary = async (documentId) => {
  const response = await axios.post(
    `${API_URL}/pdf/summary`,
    {
      document_id: documentId,
    }
  );

  return response.data;
};

// Generate flashcards
export const generateFlashcards = async (documentId) => {
  const response = await axios.post(
    `${API_URL}/pdf/flashcards`,
    {
      document_id: documentId,
    }
  );

  return response.data;
};

// Generate practice test
export const generatePracticeTest = async (documentId) => {
  const response = await axios.post(
    `${API_URL}/pdf/practice-test`,
    {
      document_id: documentId,
    }
  );

  return response.data;
};

// Submit practice test
export const submitPracticeTest = async (documentId, answers) => {
  const response = await axios.post(
    `${API_URL}/pdf/practice-test/submit`,
    {
      document_id: documentId,
      answers: answers,
    }
  );

  return response.data;
};