import Navbar from "@/components/common/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/common/Footer";
function UploadPage(){
  return(
    <div className="min-h-screen bg-slate-50">
      <Navbar />
       <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">
          Upload Notes 📚
        </h1>
         <p className="text-gray-600 mb-8">
          Upload your study material and let AI help you learn faster.
        </p>
         <Card>
          <CardContent className="p-8">
            <div className="border-2 border-dashed rounded-xl p-12 text-center">
              <h2 className="text-xl font-semibold mb-3">
                Upload PDF Notes
              </h2>

              <p className="text-gray-500 mb-6">
                Drag & drop your file or choose from your computer
              </p>

              <input
                type="file"
                accept=".pdf"
                className="mb-4"
              />
              <div>
                <Button>
                  Upload File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">
                Generate Summary
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Create concise AI summaries.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">
                Create Quiz
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Generate practice questions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">
                Generate Flashcards
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Revise quickly with flashcards.
              </p>
            </CardContent>
          </Card>
          </div>
       </div>
      <Footer />
    </div>
  )
}
export default UploadPage;