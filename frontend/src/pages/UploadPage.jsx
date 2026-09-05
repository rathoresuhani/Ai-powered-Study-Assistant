import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { uploadPDF } from "@/services/pdfService";

function UploadPage() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);

  const [documentId, setDocumentId] = useState(
    localStorage.getItem("document_id") || ""
  );

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // File selection
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setMessage("");
    setError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setSelectedFile(null);
      setError("Please select a valid PDF file.");
      return;
    }

    setSelectedFile(file);
  };

  // Upload PDF
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    setError("");
    setMessage("");
    setIsUploading(true);

    try {
      const data = await uploadPDF(selectedFile);

      console.log("Upload Response:", data);

      const newDocumentId = data.document_id;

      setDocumentId(newDocumentId);

      // Save document information
      localStorage.setItem("document_id", newDocumentId);
      localStorage.setItem("document_name", selectedFile.name);

      setMessage("PDF uploaded successfully! 🎉");
    } catch (err) {
      console.error("Upload Error:", err);

      setError(
        err.response?.data?.detail ||
          "Something went wrong while uploading the PDF."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Upload Notes 📚
            </h1>

            <p className="text-gray-600">
              Upload your study material and let AI help you learn faster.
            </p>
          </div>

          {/* Upload Card */}
          <Card>
            <CardContent className="p-8">
              <div className="border-2 border-dashed rounded-xl p-10 text-center">

                <div className="text-5xl mb-4">
                  📄
                </div>

                <h2 className="text-xl font-semibold mb-3">
                  Upload PDF Notes
                </h2>

                <p className="text-gray-500 mb-6">
                  Select a PDF containing your study material.
                </p>

                {/* File Input */}
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="pdf-upload"
                  className="inline-block cursor-pointer px-5 py-2.5 border rounded-lg hover:bg-slate-100 transition"
                >
                  Choose PDF
                </label>

                {/* Selected File */}
                {selectedFile && (
                  <div className="mt-6 p-4 bg-slate-100 rounded-lg text-left">
                    <div className="flex items-center justify-between gap-4">

                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {selectedFile.name}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={handleRemoveFile}
                        disabled={isUploading}
                      >
                        Remove
                      </Button>

                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="mt-6">
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="min-w-[140px]"
                  >
                    {isUploading ? "Uploading..." : "Upload File"}
                  </Button>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Success */}
                {message && (
                  <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                    {message}
                  </div>
                )}

                {/* Document ID */}
                {documentId && (
                  <div className="mt-4 p-4 rounded-lg bg-blue-50 text-left">
                    <p className="text-sm font-medium text-blue-700">
                      Current Document ID
                    </p>

                    <p className="text-xs text-blue-600 mt-1 break-all">
                      {documentId}
                    </p>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">

            {/* Summary */}
            <Card>
              <CardContent className="p-6">

                <div className="text-2xl mb-3">
                  📄
                </div>

                <h3 className="font-semibold">
                  Generate Summary
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Create concise AI summaries from your uploaded notes.
                </p>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/summary")}
                >
                  View Summary
                </Button>

              </CardContent>
            </Card>

            {/* Quiz */}
            <Card>
              <CardContent className="p-6">

                <div className="text-2xl mb-3">
                  📝
                </div>

                <h3 className="font-semibold">
                  Create Quiz
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Generate practice questions from your study material.
                </p>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/quiz")}
                >
                  Open Quiz
                </Button>

              </CardContent>
            </Card>

            {/* Flashcards */}
            <Card>
              <CardContent className="p-6">

                <div className="text-2xl mb-3">
                  🎴
                </div>

                <h3 className="font-semibold">
                  Generate Flashcards
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Revise important concepts with AI-generated flashcards.
                </p>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/flashcards")}
                >
                  Open Flashcards
                </Button>

              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UploadPage;

