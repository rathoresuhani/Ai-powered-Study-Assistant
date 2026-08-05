import Navbar from "@/components/common/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/common/Footer";
function FlashcardPage(){
  return (
     <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">
          AI Flashcards 🎴
        </h1>
        <p className="text-gray-600 mb-8">
          Revise important concepts with AI-generated flashcards.
        </p>
        <Card className="min-h-[300px] flex items-center justify-center">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-4">
              What is Binary Search?
            </h2>

            <p className="text-gray-500">
              Click flip to reveal the answer.
            </p>

            <Button className="mt-6">
              Flip Card
            </Button>
          </CardContent>
        </Card>
        <div className="flex justify-between mt-6">
          <Button variant="outline">
            Previous
          </Button>

          <Button variant="outline">
            Next
          </Button>
        </div>
      </div>
      <Footer />
     </div>
  );
}
export default FlashcardPage;