import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateFlashcards } from "@/services/pdfService";

function FlashcardPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const documentId = localStorage.getItem("document_id");

  const requestStarted = useRef(false);

  // --------------------------------------------------
  // Generate new flashcards
  // --------------------------------------------------

  const generateNewFlashcards = async () => {
    if (!documentId) {
      setError("Please upload a PDF first.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      console.log(
        "🚀 GENERATING FLASHCARDS FOR:",
        documentId
      );

      const data = await generateFlashcards(
        documentId
      );

      console.log(
        "🔥 FLASHCARDS RESPONSE RECEIVED:",
        data
      );

      const generatedFlashcards =
        data?.flashcards?.flashcards || [];

      console.log(
        "🔥 NUMBER OF FLASHCARDS:",
        generatedFlashcards.length
      );

      if (generatedFlashcards.length === 0) {
        setError(
          "No flashcards were generated."
        );
        setIsLoading(false);
        return;
      }

      // Save generated flashcards
      sessionStorage.setItem(
        `flashcards_${documentId}`,
        JSON.stringify(generatedFlashcards)
      );

      console.log(
        "💾 FLASHCARDS SAVED TO SESSION STORAGE"
      );

      setFlashcards(generatedFlashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsLoading(false);
    } catch (err) {
      console.error(
        "Flashcards Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Something went wrong while generating flashcards."
      );

      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // Load existing flashcards
  // --------------------------------------------------

  useEffect(() => {
    const loadFlashcards = async () => {
      if (!documentId) {
        setError("Please upload a PDF first.");
        setIsLoading(false);
        return;
      }

      // -----------------------------------------------
      // Check sessionStorage first
      // -----------------------------------------------

      const cachedFlashcards =
        sessionStorage.getItem(
          `flashcards_${documentId}`
        );

      if (cachedFlashcards) {
        try {
          const parsedFlashcards =
            JSON.parse(cachedFlashcards);

          if (
            Array.isArray(parsedFlashcards) &&
            parsedFlashcards.length > 0
          ) {
            console.log(
              "♻️ FLASHCARDS RESTORED FROM SESSION STORAGE"
            );

            setFlashcards(parsedFlashcards);
            setCurrentIndex(0);
            setIsFlipped(false);
            setIsLoading(false);

            return;
          }
        } catch (err) {
          console.error(
            "Error reading cached flashcards:",
            err
          );

          sessionStorage.removeItem(
            `flashcards_${documentId}`
          );
        }
      }

      // -----------------------------------------------
      // Prevent duplicate API request
      // -----------------------------------------------

      if (requestStarted.current) {
        console.log(
          "⛔ Flashcard request already started."
        );

        return;
      }

      requestStarted.current = true;

      await generateNewFlashcards();
    };

    loadFlashcards();
  }, []);

  // --------------------------------------------------
  // Generate Again
  // --------------------------------------------------

  const handleGenerateAgain = async () => {
    console.log(
      "🔄 GENERATE AGAIN CLICKED"
    );

    if (!documentId) {
      setError("Document ID not found.");
      return;
    }

    // Remove old flashcards
    sessionStorage.removeItem(
      `flashcards_${documentId}`
    );

    // Allow another API request
    requestStarted.current = false;

    // Reset UI
    setFlashcards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setError("");

    // Generate completely new flashcards
    await generateNewFlashcards();
  };

  // --------------------------------------------------
  // Flip
  // --------------------------------------------------

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  // --------------------------------------------------
  // Previous
  // --------------------------------------------------

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  // --------------------------------------------------
  // Next
  // --------------------------------------------------

  const handleNext = () => {
    if (
      currentIndex <
      flashcards.length - 1
    ) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                AI Flashcards 🎴
              </h1>

              <p className="text-gray-600">
                Generate flashcards from your uploaded study material.
              </p>
            </div>

            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-gray-600">
                  Generating your flashcards... 🤖
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  This may take a few moments.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto p-8">
            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-red-600 mb-5">
                  {error}
                </p>

                <Button
                  onClick={() => {
                    window.location.href =
                      "/upload";
                  }}
                >
                  Upload Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // --------------------------------------------------
  // NO FLASHCARDS
  // --------------------------------------------------

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto p-8">
            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-gray-600">
                  No flashcards were generated.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const currentCard =
    flashcards[currentIndex];

  // --------------------------------------------------
  // FLASHCARD UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto p-8">

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              AI Flashcards 🎴
            </h1>

            <p className="text-gray-600">
              Revise important concepts with AI-generated flashcards.
            </p>
          </div>

          <div className="text-center mb-5">
            <p className="text-sm font-medium text-gray-500">
              Card {currentIndex + 1} of{" "}
              {flashcards.length}
            </p>
          </div>

          <div className="flex justify-center">
            <div
              className="
                w-full
                max-w-2xl
                min-h-[360px]
                bg-white
                border
                border-gray-300
                rounded-2xl
                shadow-sm
                flex
                items-center
                justify-center
                transition-all
                duration-200
                hover:shadow-md
              "
            >
              <div className="p-10 text-center w-full">

                <p className="text-xs font-semibold tracking-widest text-gray-400 mb-6">
                  {isFlipped
                    ? "ANSWER"
                    : "QUESTION"}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                  {isFlipped
                    ? currentCard.answer
                    : currentCard.question}
                </h2>

                <Button
                  className="mt-10 px-6"
                  onClick={handleFlip}
                >
                  {isFlipped
                    ? "Show Question"
                    : "Flip Card"}
                </Button>

              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 max-w-2xl mx-auto">

            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← Previous
            </Button>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={
                currentIndex ===
                flashcards.length - 1
              }
            >
              Next →
            </Button>

          </div>

          {/* Generate Again */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleGenerateAgain}
              disabled={isLoading}
            >
              {isLoading
                ? "Generating..."
                : "Generate Again"}
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FlashcardPage;


