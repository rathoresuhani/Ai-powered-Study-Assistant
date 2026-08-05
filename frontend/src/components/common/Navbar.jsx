import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b">
      <h1 className="font-bold text-2xl">
        AI Study Assistant 🚀
      </h1>

      {/* Center */}
      <div className="flex gap-6 font-medium">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/flashcards">Flashcards</Link>
        <Link to="/quiz">Quiz</Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 border rounded-lg hover:bg-slate-100">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
export default Navbar;
