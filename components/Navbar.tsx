"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-[#0f0f10] border-b border-[#222] flex items-center justify-between px-6">
      {/* Logo */}
      <h1 className="text-xl font-semibold text-white select-none tracking-tight">
        <span className="text-[#6c47ff]">Rubber</span> Molding
      </h1>

      {/* Auth */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm border border-[#6c47ff] text-[#6c47ff] rounded-full px-4 py-1.5 hover:bg-[#6c47ff] hover:text-white transition">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="text-sm bg-[#6c47ff] text-white rounded-full px-4 py-1.5 hover:bg-[#5634d1] transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" appearance={{
            elements: { avatarBox: "w-9 h-9" }
          }} />
        </SignedIn>
      </div>
    </nav>
  );
}
