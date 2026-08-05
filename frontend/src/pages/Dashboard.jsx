import Navbar from "@/components/common/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import Footer from "@/components/common/Footer";
function Dashboard(){
  const { user } = useUser();
  return(
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Welcome Back, {user?.firstName || "Student"} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Continue your learning journey with AI-powered study tools.
          </p>
      </div>
      <h2 className="text-2xl font-semibold mb-4">
          Quick Actions
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">
                Upload Notes
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Upload PDFs and study material.
              </p>

              <Button className="w-full">
                Upload
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">
                Generate Summary
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Get concise AI summaries.
              </p>

              <Button className="w-full">
                Summarize
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">
                Create Quiz
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Smart practice quizzes
              </p>

              <Button className="w-full">
                Start Quiz
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">
                Flashcards
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Revise quickly using flashcards.
              </p>

              <Button className="w-full">
                Open
              </Button>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Notes
            </h2>
            <p className="text-gray-500">
              No notes uploaded yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default Dashboard;