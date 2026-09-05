import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  generatePracticeTest,
  submitPracticeTest,
} from "@/services/pdfService";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [quizFinished, setQuizFinished] = useState(false);
  const [result, setResult] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const documentId = localStorage.getItem("document_id");

  const requestStarted = useRef(false);

  // --------------------------------------------------
  // Generate quiz
  // --------------------------------------------------

  const generateNewQuiz = async () => {
    if (!documentId) {
      setError("Please upload a PDF first.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      console.log("🚀 GENERATING QUIZ FOR:", documentId);

      const data = await generatePracticeTest(documentId);

      console.log("🔥 QUIZ RESPONSE RECEIVED:", data);

      const generatedQuestions =
        data?.practice_test?.questions || [];

      console.log(
        "🔥 NUMBER OF QUESTIONS:",
        generatedQuestions.length
      );

      if (generatedQuestions.length === 0) {
        setError("No quiz questions were generated.");
        setIsLoading(false);
        return;
      }

      // Save the new quiz
      sessionStorage.setItem(
        `quiz_${documentId}`,
        JSON.stringify(generatedQuestions)
      );

      // Remove any previous result
      sessionStorage.removeItem(`quiz_result_${documentId}`);

      console.log("💾 NEW QUIZ SAVED TO SESSION STORAGE");

      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setAnswers({});
      setQuizFinished(false);
      setResult(null);
      setIsLoading(false);
    } catch (err) {
      console.error("Quiz Error:", err);

      setError(
        err.response?.data?.detail ||
          "Something went wrong while generating the quiz."
      );

      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // Load existing quiz/result
  // --------------------------------------------------

  useEffect(() => {
    const loadQuiz = async () => {
      if (!documentId) {
        setError("Please upload a PDF first.");
        setIsLoading(false);
        return;
      }

      // -----------------------------------------------
      // 1. Check for saved quiz
      // -----------------------------------------------

      const cachedQuiz = sessionStorage.getItem(
        `quiz_${documentId}`
      );

      // -----------------------------------------------
      // 2. Check for saved result
      // -----------------------------------------------

      const cachedResult = sessionStorage.getItem(
        `quiz_result_${documentId}`
      );

      // -----------------------------------------------
      // If result exists, restore completed quiz
      // -----------------------------------------------

      if (cachedQuiz && cachedResult) {
        try {
          const parsedQuiz = JSON.parse(cachedQuiz);
          const parsedResult = JSON.parse(cachedResult);

          if (
            Array.isArray(parsedQuiz) &&
            parsedQuiz.length > 0 &&
            parsedResult
          ) {
            console.log(
              "♻️ COMPLETED QUIZ RESTORED FROM SESSION STORAGE"
            );

            setQuestions(parsedQuiz);
            setResult(parsedResult);
            setQuizFinished(true);
            setIsLoading(false);

            return;
          }
        } catch (err) {
          console.error(
            "Error restoring completed quiz:",
            err
          );

          sessionStorage.removeItem(
            `quiz_${documentId}`
          );

          sessionStorage.removeItem(
            `quiz_result_${documentId}`
          );
        }
      }

      // -----------------------------------------------
      // If quiz exists but is not finished
      // -----------------------------------------------

      if (cachedQuiz) {
        try {
          const parsedQuiz = JSON.parse(cachedQuiz);

          if (
            Array.isArray(parsedQuiz) &&
            parsedQuiz.length > 0
          ) {
            console.log(
              "♻️ QUIZ RESTORED FROM SESSION STORAGE"
            );

            setQuestions(parsedQuiz);
            setIsLoading(false);

            return;
          }
        } catch (err) {
          console.error(
            "Error reading cached quiz:",
            err
          );

          sessionStorage.removeItem(
            `quiz_${documentId}`
          );
        }
      }

      // -----------------------------------------------
      // Prevent duplicate generation
      // -----------------------------------------------

      if (requestStarted.current) {
        console.log(
          "⛔ Quiz request already started."
        );
        return;
      }

      requestStarted.current = true;

      await generateNewQuiz();
    };

    loadQuiz();
  }, []);

  // --------------------------------------------------
  // Select answer
  // --------------------------------------------------

  const handleSelectAnswer = (optionIndex) => {
    const optionLetter = String.fromCharCode(
      65 + optionIndex
    );

    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: optionLetter,
    }));
  };

  // --------------------------------------------------
  // Submit quiz
  // --------------------------------------------------

  const handleSubmit = async () => {
    if (!documentId) {
      setError("Document ID not found.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await submitPracticeTest(
        documentId,
        answers
      );

      console.log("🎉 QUIZ RESULT:", response);

      // Save result so it survives navigation
      sessionStorage.setItem(
        `quiz_result_${documentId}`,
        JSON.stringify(response)
      );

      setResult(response);
      setQuizFinished(true);
    } catch (err) {
      console.error(
        "Quiz Submission Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Something went wrong while submitting the quiz."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Next question
  // --------------------------------------------------

  const handleNext = () => {
    const currentQuestionId =
      questions[currentQuestion].id;

    if (!answers[currentQuestionId]) {
      return;
    }

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );
    } else {
      handleSubmit();
    }
  };

  // --------------------------------------------------
  // TRY AGAIN
  // --------------------------------------------------

  const handleTryAgain = async () => {
    console.log("🔄 TRY AGAIN CLICKED");

    if (!documentId) {
      setError("Document ID not found.");
      return;
    }

    // Remove old quiz and old result
    sessionStorage.removeItem(
      `quiz_${documentId}`
    );

    sessionStorage.removeItem(
      `quiz_result_${documentId}`
    );

    // Reset request guard
    requestStarted.current = false;

    // Reset UI
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizFinished(false);
    setResult(null);
    setError("");

    // Generate a completely new quiz
    await generateNewQuiz();
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                AI Practice Quiz 📝
              </h1>

              <p className="text-gray-600">
                Test your understanding of your study material.
              </p>
            </div>

            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-gray-600">
                  Generating your quiz... 🤖
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
  // Error
  // --------------------------------------------------

  if (error && !quizFinished) {
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
  // No questions
  // --------------------------------------------------

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto p-8">
            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-gray-600">
                  No quiz questions were generated.
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
  // Quiz Result
  // --------------------------------------------------

  if (quizFinished && result) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Quiz Result 🎉
              </h1>

              <p className="text-gray-600">
                Here is how you performed.
              </p>
            </div>

            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-5xl font-bold text-gray-800 mb-3">
                  {result.score}/{result.total}
                </p>

                <p className="text-gray-500 mb-8">
                  You scored{" "}
                  {Math.round(
                    (result.score /
                      result.total) *
                      100
                  )}
                  %
                </p>

                <div className="flex justify-center">
                  <Button
                    onClick={handleTryAgain}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Generating..."
                      : "Try Again"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {result.results && (
              <div className="mt-8 space-y-5">
                <h2 className="text-2xl font-semibold">
                  Answer Review
                </h2>

                {result.results.map(
                  (item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <p className="font-semibold text-gray-800 mb-4">
                          {item.id}.{" "}
                          {item.question}
                        </p>

                        <p
                          className={
                            item.is_correct
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          Your answer:{" "}
                          {item.user_answer ||
                            "Not answered"}
                        </p>

                        <p className="text-gray-700 mt-2">
                          Correct answer:{" "}
                          {item.correct_answer}
                        </p>

                        {item.explanation && (
                          <p className="text-gray-500 text-sm mt-3">
                            {item.explanation}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // --------------------------------------------------
  // Quiz
  // --------------------------------------------------

  const question =
    questions[currentQuestion];

  const selectedAnswer =
    answers[question.id] || null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              AI Practice Quiz 📝
            </h1>

            <p className="text-gray-600">
              Test your understanding of your study material.
            </p>
          </div>

          <div className="text-center mb-5">
            <p className="text-sm font-medium text-gray-500">
              Question{" "}
              {currentQuestion + 1} of{" "}
              {questions.length}
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 leading-relaxed mb-8">
                {question.question}
              </h2>

              <div className="space-y-4">
                {question.options.map(
                  (option, index) => {
                    const optionLetter =
                      String.fromCharCode(
                        65 + index
                      );

                    const isSelected =
                      selectedAnswer ===
                      optionLetter;

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          handleSelectAnswer(
                            index
                          )
                        }
                        className={`
                          w-full
                          text-left
                          p-4
                          rounded-xl
                          border
                          transition
                          duration-200
                          ${
                            isSelected
                              ? "border-gray-800 bg-gray-100"
                              : "border-gray-300 bg-white hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-semibold text-gray-600">
                            {optionLetter}.
                          </span>

                          <span className="text-gray-800">
                            {option}
                          </span>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={handleNext}
                  disabled={
                    !selectedAnswer ||
                    isSubmitting
                  }
                >
                  {currentQuestion ===
                  questions.length - 1
                    ? isSubmitting
                      ? "Submitting..."
                      : "Submit Quiz"
                    : "Next →"}
                </Button>
              </div>

              {error && (
                <p className="text-red-600 text-sm mt-4 text-center">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default QuizPage;

