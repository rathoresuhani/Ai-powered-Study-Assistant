import { useEffect, useState } from "react";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { generateSummary } from "@/services/pdfService";

function SummaryPage() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const documentId = localStorage.getItem("document_id");

  const handleGenerateSummary = async () => {
    if (!documentId) {
      setError("Please upload a PDF first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await generateSummary(documentId);

      setSummary(data.summary);
    } catch (err) {
      console.error("Summary Error:", err);

      setError(
        err.response?.data?.detail ||
          "Something went wrong while generating the summary."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      handleGenerateSummary();
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              AI Summary 📄
            </h1>

            <p className="text-gray-600">
              Get a concise summary of your uploaded study material.
            </p>
          </div>

          {/* No document */}
          {!documentId && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 mb-5">
                  No PDF has been uploaded yet.
                </p>

                <Button
                  onClick={() => {
                    window.location.href = "/upload";
                  }}
                >
                  Upload Notes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading */}
          {isLoading && (
            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-gray-600">
                  Generating your summary... 🤖
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  This may take a few moments.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Summary */}
          {summary && !isLoading && (
            <Card>
              <CardContent className="p-8">

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Your Summary
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Generated from your uploaded PDF
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleGenerateSummary}
                    disabled={isLoading}
                  >
                    Regenerate
                  </Button>
                </div>

                <div className="border rounded-xl p-6 bg-white">
                  <div className="whitespace-pre-wrap text-gray-700 leading-7">
                    {summary}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SummaryPage;