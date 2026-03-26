"use client";

import { useState, useEffect } from "react";
import { Menu ,User} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/firebase/firebase";


export default function Navbar() {
  const [age, setAge] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // ✅ Always true

  // Example: you can still fetch profile if needed
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(`/api/profile-setup?uid=${user.uid}`);
          const data = await res.json();
          if (data.success && data.profile) {
          setAge(data.profile.age || null);
        }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-[var(--page-max)] mx-auto px-6 md:px-8 lg:px-0 flex items-center justify-between h-16">
        
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo-new.png"
            alt="Ctrl+You Logo"
            width={36}
            height={36}
            className="rounded"
          />
          <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#8A3FFC] via-[#00CFFF] to-[#FFFFFF]">
            Ctrl+You
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-right gap-6">
          <Link href="/" className="text-white hover:text-[#4ED0F9] transition">
            Home
          </Link>
          <Link
            href="/profile"
            className="text-white hover:text-[#4ED0F9] transition"
          >
            Profile
          </Link>
          <Link
            href="/counselling"
            className="text-white hover:text-[#4ED0F9] transition"
          >
            Counselling
          </Link>
          <Link
            href="/engagement-page"
            className="text-white hover:text-[#4ED0F9] transition"
          >
            Daily goals
          </Link>
          <Link
            href="/progress"
            className="text-white hover:text-[#4ED0F9] transition"
          >
            Progress
          </Link>
          <Link
            href="/gaming-addiction"
            className="text-white hover:text-[#4ED0F9] transition"
          >
            Quiz
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-[#4ED0F9] transition"
          >
            Contact
          </Link>
          <Link
            href="/chatbot"
            className="text-white hover:text-[#4ED0F9] transition"
          >
            Chatbot
          </Link>

          {/* Conditional Parental Control */}
          {age !== null && age < 18 && (
            <Link
              href="/parental-control"
              className="text-red-400 hover:text-red-500 transition"
            >
              Parental Control
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md border-2 border-purple-20 bg-transparent">
                <Menu size={28} className="text-purple-500" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white w-80">
              <SheetHeader>
                {/* Logo + Title Box in Menu */}
                <div className="flex items-center gap-3 p-2  mb-6">
                  <div className="w-8 h-10  flex items-center justify-center text-white font-bold">
                  
                  </div>
                  <div className="text-xl font-extrabold bg-transparent text-blue">
                    Ctrl+You
                  </div>
                </div>

                
        
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                {/* Assessment Box */}
                <Link href="/gaming-addiction" className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-purple-900 transition">
                  <User size={20} className="text-white" />
                  <span className="text-blue font-medium">Quiz</span>
                </Link>
                 
                <Link href="/Footer" className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-purple-900 transition">
                  <User size={20} className="text-white" />
                  <span className="text-blue font-medium">Contact</span>
                
                </Link>
                <Link href="/healthyalternative" className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-purple-900 transition">
                  <User size={20} className="text-white" />
                  <span className="text-blue font-medium">Healthy Alternative</span>
                
                </Link>
                <Link href="/engagement-page" className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-purple-900 transition">
                  <User size={20} className="text-white" />
                  <span className="text-blue font-medium">Daily Goals</span>
                
                </Link>
                <Link href="/wellness-dashboard" className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-purple-900 transition">
                  <User size={20} className="text-white" />
                  <span className="text-blue font-medium">Wellness-dashboard</span>
                
                </Link>
                <Link href="/progress" className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-purple-900 transition">
                  <User size={20} className="text-white" />
                  <span className="text-blue font-medium">progress</span>
                
                </Link>
                <Link href="/support" className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-purple-900 transition">
                  <User size={20} className="text-white" />
                  <span className="text-blue font-medium">support</span>
                
                </Link>
                <Link href="/councelling" className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-purple-900 transition">
                  <User size={20} className="text-white" />
                  <span className="text-blue font-medium">Audio councelling</span>
                
                </Link>
                <Link href="/chatbot" className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-purple-900 transition mb-4">
                  <User size={20} className="text-white" />
                  <span className="text-blue font-medium">Chatbot</span>
                </Link>

                

              
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
