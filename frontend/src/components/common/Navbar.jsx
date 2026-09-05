import { Link, useLocation } from "react-router-dom";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Upload", path: "/upload" },
    { name: "Chat", path: "/chat" },
    { name: "Flashcards", path: "/flashcards" },
    { name: "Quiz", path: "/quiz" },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="font-semibold text-xl whitespace-nowrap"
          >
            AI Study Assistant
          </Link>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm transition ${
                    isActive
                      ? "bg-slate-100 text-black font-medium"
                      : "text-gray-600 hover:text-black hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Authentication */}
          <div className="flex items-center gap-2">

            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-3 py-2 text-sm border rounded-md hover:bg-slate-50 transition">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="px-3 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
