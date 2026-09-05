import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [documentId, setDocumentId] = useState("");
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    const savedDocumentId = localStorage.getItem("document_id");
    const savedDocumentName = localStorage.getItem("document_name");

    if (savedDocumentId) {
      setDocumentId(savedDocumentId);
    }

    if (savedDocumentName) {
      setDocumentName(savedDocumentName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-8">

          {/* Welcome Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold">
              Welcome Back, {user?.firstName || "Student"} 👋
            </h1>

            <p className="text-gray-600 mt-2">
              Continue your learning journey with AI-powered study tools.
            </p>
          </div>

          {/* Quick Actions */}
          <h2 className="text-2xl font-semibold mb-5">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            {/* Upload */}
            <Card className="hover:shadow-md transition">
              <CardContent className="p-6">

                <div className="text-3xl mb-4">
                  📚
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  Upload Notes
                </h3>

                <p className="text-sm text-gray-500 mb-5">
                  Upload your PDF study material.
                </p>

                <Button
                  className="w-full"
                  onClick={() => navigate("/upload")}
                >
                  Upload
                </Button>

              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="hover:shadow-md transition">
              <CardContent className="p-6">

                <div className="text-3xl mb-4">
                  📄
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  Generate Summary
                </h3>

                <p className="text-sm text-gray-500 mb-5">
                  Get a concise summary of your notes.
                </p>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate("/upload")}
                >
                  Generate
                </Button>

              </CardContent>
            </Card>

            {/* Quiz */}
            <Card className="hover:shadow-md transition">
              <CardContent className="p-6">

                <div className="text-3xl mb-4">
                  📝
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  Create Quiz
                </h3>

                <p className="text-sm text-gray-500 mb-5">
                  Test your knowledge with AI-generated questions.
                </p>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate("/quiz")}
                >
                  Start Quiz
                </Button>

              </CardContent>
            </Card>

            {/* Flashcards */}
            <Card className="hover:shadow-md transition">
              <CardContent className="p-6">

                <div className="text-3xl mb-4">
                  🎴
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  Flashcards
                </h3>

                <p className="text-sm text-gray-500 mb-5">
                  Revise important concepts quickly.
                </p>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate("/flashcards")}
                >
                  Open
                </Button>

              </CardContent>
            </Card>

          </div>

          {/* Recent Notes */}
          <Card>
            <CardContent className="p-6">

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-semibold">
                    Recent Notes
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Your recently uploaded study material.
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate("/upload")}
                >
                  + Upload
                </Button>
              </div>

              {documentId ? (
                <div className="border rounded-xl p-5 bg-white">

                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-4 min-w-0">

                      <div className="text-3xl">
                        📄
                      </div>

                      <div className="min-w-0">

                        <h3 className="font-semibold truncate">
                          {documentName || "Uploaded PDF"}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1 break-all">
                          Document ID: {documentId}
                        </p>

                      </div>

                    </div>

                    <Button
                      variant="outline"
                      onClick={() => navigate("/chat")}
                    >
                      Study
                    </Button>

                  </div>

                </div>
              ) : (
                <div className="border border-dashed rounded-xl p-10 text-center">

                  <div className="text-4xl mb-3">
                    📚
                  </div>

                  <h3 className="font-semibold mb-2">
                    No notes uploaded yet
                  </h3>

                  <p className="text-sm text-gray-500 mb-5">
                    Upload your first PDF to start studying with AI.
                  </p>

                  <Button
                    onClick={() => navigate("/upload")}
                  >
                    Upload Notes
                  </Button>

                </div>
              )}

            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;