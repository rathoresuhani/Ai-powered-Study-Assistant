import Navbar from "@/components/common/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/common/Footer";
function QuizPage(){
  return(
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">
          AI Quiz 📝
        </h1>

        <p className="text-gray-600 mb-8">
          Test your understanding with AI-generated quizzes.
        </p>
         <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-xl mb-4">
              Question 1
            </h2>

            <p className="mb-6">
              What is the time complexity of Binary Search?
            </p>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                O(n)
              </Button>

              <Button variant="outline" className="w-full justify-start">
                O(log n)
              </Button>

              <Button variant="outline" className="w-full justify-start">
                O(n²)
              </Button>

              <Button variant="outline" className="w-full justify-start">
                O(1)
              </Button>
            </div>
            <Button className="mt-6">
              Next Question
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
export default QuizPage;