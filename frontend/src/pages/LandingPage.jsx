import Navbar from "@/components/common/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/common/Footer";
function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-5xl font-bold mb-6">AI Study Assistant 🚀</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Upload notes, generate summaries, create quizzes, flashcards, and chat
          with your study material using AI.
        </p>
      </section>
      <section className="grid md:grid-cols-3 gap-6 px-8 pb-16">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-xl mb-2">AI Summaries</h2>

            <p>Generate concise summaries from lengthy notes.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-xl mb-2">Quiz Generation</h2>

            <p>Create practice quizzes instantly.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-xl mb-2">Flashcard Generation</h2>

            <p>Convert notes into smart flashcards for quick revision.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-xl mb-2">
              Chat With Notes
            </h2>

            <p>
              Ask questions directly from your uploaded notes.
            </p>
          </CardContent>
        </Card>
      </section>
      <Footer />
    </div>
  );
}
export default LandingPage;
