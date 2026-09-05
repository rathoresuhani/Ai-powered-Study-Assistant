import { useNavigate } from "react-router-dom";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">

        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">

            <p className="text-sm font-medium text-gray-500 mb-4">
              AI Study Assistant
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Make your study material easier to learn.
            </h1>

            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mt-5 leading-relaxed">
              Upload your notes and use AI to summarize them, create quizzes
              and flashcards, or ask questions about your study material.
            </p>

            <div className="flex justify-center gap-3 mt-7">
              <Button onClick={() => navigate("/upload")}>
                Upload Notes
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            </div>

          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">

            <div className="mb-8">
              <h2 className="text-2xl font-semibold">
                What you can do
              </h2>

              <p className="text-gray-500 mt-1">
                A few simple tools to help you study from your notes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <Card className="bg-white hover:shadow-sm transition">
                <CardContent className="p-6">
                  <div className="text-2xl mb-4">
                    📄
                  </div>

                  <h3 className="font-semibold mb-2">
                    Summaries
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Get a shorter version of your study material with the
                    important points highlighted.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white hover:shadow-sm transition">
                <CardContent className="p-6">
                  <div className="text-2xl mb-4">
                    📝
                  </div>

                  <h3 className="font-semibold mb-2">
                    Quizzes
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Practice what you have learned with questions generated
                    from your notes.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white hover:shadow-sm transition">
                <CardContent className="p-6">
                  <div className="text-2xl mb-4">
                    🎴
                  </div>

                  <h3 className="font-semibold mb-2">
                    Flashcards
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Quickly revise definitions and important concepts using
                    flashcards.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white hover:shadow-sm transition">
                <CardContent className="p-6">
                  <div className="text-2xl mb-4">
                    💬
                  </div>

                  <h3 className="font-semibold mb-2">
                    Ask Questions
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Ask questions about your uploaded material and get
                    relevant answers.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Simple How It Works */}
        <section className="px-6 py-16 bg-white border-y">
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold">
                How it works
              </h2>

              <p className="text-gray-500 mt-2">
                Start studying in three simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="text-center">

                <div className="w-12 h-12 mx-auto rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                  1
                </div>

                <h3 className="font-semibold text-lg mt-4">
                  Upload Your Notes
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  Upload your PDF study material to the platform.
                </p>

              </div>

              {/* Step 2 */}
              <div className="text-center">

                <div className="w-12 h-12 mx-auto rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                  2
                </div>

                <h3 className="font-semibold text-lg mt-4">
                  Let AI Process It
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  AI understands your study material and prepares useful
                  learning resources.
                </p>

              </div>

              {/* Step 3 */}
              <div className="text-center">

                <div className="w-12 h-12 mx-auto rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                  3
                </div>

                <h3 className="font-semibold text-lg mt-4">
                  Start Learning
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  Chat, revise with flashcards, generate summaries and test
                  yourself with quizzes.
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">

            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Study Smarter? 🚀
            </h2>

            <p className="text-gray-600 mt-4">
              Upload your notes and let AI transform the way you study.
            </p>

            <Button
              size="lg"
              className="mt-7"
              onClick={() => navigate("/upload")}
            >
              Start Learning
            </Button>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;