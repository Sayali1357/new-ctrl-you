"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import Advantages from "@/components/Advantages";
import Footer from "@/components/Footer";
import Link from "next/link"; // ✅ fixed import
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Home() {
  const [open, setOpen] = useState(false);

  // function to open popup
  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      {/* Hero Section - popup trigger */}
      <section id="home" className="scroll-mt-4" onClick={handleClick}>
        <HeroSection />
      </section>

      {/* Features - popup trigger */}
      <section id="Features" className="py-12 bg-black-50 scroll-mt-4" onClick={handleClick}>
        <Features />
      </section>

      {/* Advantages (About Us) - popup trigger */}
      <section id="advantages" className="py-12 bg-black scroll-mt-4" onClick={handleClick}>
        <Advantages />
      </section>

      {/* Footer - no popup */}
      <section id="Footer" className="py-8 bg-black text-white scroll-mt-4">
        <Footer />
      </section>

      {/* Dialog Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#4ED0F9]">
              Please Sign Up
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            You need to sign up to access this section.
          </p>
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-[#4ED0F9] text-white rounded-md font-medium hover:bg-[#38bde8]"
          >
            Go to Sign Up
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
