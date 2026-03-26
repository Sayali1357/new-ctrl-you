"use client";

import { Menu, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link as ScrollLink } from "react-scroll"; // 👈 for smooth scrolling
import NextLink from "next/link";
import Image from "next/image";


export default function Navbar() {
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
        <div className="hidden md:flex items-center gap-6">
          <ScrollLink
            to="home"
            smooth={true}
            duration={600}
            offset={-70}
            className="text-white hover:text-[#4ED0F9] transition cursor-pointer"
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="advantages"
            smooth={true}
            duration={600}
            offset={-70}
            className="text-white hover:text-[#4ED0F9] transition cursor-pointer"
          >
            About Us
          </ScrollLink>
          <ScrollLink
            to="Features"
            smooth={true}
            duration={600}
            offset={-70}
            className="text-white hover:text-[#4ED0F9] transition cursor-pointer"
          >
            Features
          </ScrollLink>
          <ScrollLink
            to="Footer"
            smooth={true}
            duration={600}
            offset={-70}
            className="text-white hover:text-[#4ED0F9] transition cursor-pointer"
          >
            Footer
          </ScrollLink>

          {/* Only Login/Signup opens a new page */}
          <NextLink
            href="/sign-in"
            className="flex items-center gap-2 px-4 py-2 border-2 rounded-md transition hover:bg-[#A5D7E8] text-white"
            style={{ borderColor: "#4ED0F9" }}
          >
            <User size={20} className="text-[#4ED0F9]" />
            <span className="font-medium">Login / Signup</span>
          </NextLink>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md border-2 border-purple-500 bg-transparent">
                <Menu size={28} className="text-purple-500" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white w-80">
              <SheetHeader>
                <div className="flex items-center gap-3 p-2 mb-6">
                  <Image
                    src="/logo-new.png"
                    alt="Ctrl+You Logo"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <div className="text-xl font-extrabold text-white">
                    Ctrl+You
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                <ScrollLink
                  to="home"
                  smooth={true}
                  duration={600}
                  offset={-70}
                  className="hover:text-[#4ED0F9] transition cursor-pointer"
                >
                  Home
                </ScrollLink>
                <ScrollLink
                  to="Advantages"
                  smooth={true}
                  duration={600}
                  offset={-70}
                  className="hover:text-[#4ED0F9] transition cursor-pointer"
                >
                  About Us
                </ScrollLink>
                <ScrollLink
                  to="Features"
                  smooth={true}
                  duration={600}
                  offset={-70}
                  className="hover:text-[#4ED0F9] transition cursor-pointer"
                >
                  Features
                </ScrollLink>
                <ScrollLink
                  to="Footer"
                  smooth={true}
                  duration={600}
                  offset={-70}
                  className="hover:text-[#4ED0F9] transition cursor-pointer"
                >
                  Footer
                </ScrollLink>
                {/* Login still opens new page */}
                <NextLink
                  href="/auth/sign-in"
                  className="flex items-center gap-2 px-4 py-2 border-2 rounded-md transition hover:bg-purple-900"
                  style={{ borderColor: "#4ED0F9" }}
                >
                  <User size={20} className="text-[#4ED0F9]" />
                  <span className="font-medium">Login / Signup</span>
                </NextLink>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
