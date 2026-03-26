// components/Footer.tsx
"use client";

import React from "react";
import { Mail, Phone, Instagram, Linkedin, Youtube, Twitter, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-10">
        
        {/* We Help With */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">We Help With</h3>
          <ul className="space-y-2 text-sm">
            <li>Gaming Addiction</li>
            <li>Focus & Productivity</li>
            <li>Stress, Anxiety & Depression</li>
            <li>Academic Pressure</li>
            <li>Sleep Issues</li>
            <li>Social Isolation</li>
            <li>Career Confusion</li>
            <li>Self-Confidence</li>
          </ul>
        </div>

        {/* Self Help */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Self Help</h3>
          <ul className="space-y-2 text-sm">
            <li>Articles & Blogs</li>
            <li>Daily Tips</li>
            <li>Productivity Tools</li>
            <li>7 Days Screen Detox Plan</li>
          </ul>
        </div>

        {/* For Students */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">For Students</h3>
          <ul className="space-y-2 text-sm">
            <li>School/College Programs</li>
            <li>Peer Mentorship</li>
            <li>Campus Ambassador Program</li>
            <li>Partner With Us</li>
          </ul>
        </div>

        {/* Quick Assessments */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Assessments</h3>
          <ul className="space-y-2 text-sm">
            <li>Am I Addicted to Gaming?</li>
            <li>Am I Managing My Screen Time Well?</li>
            <li>Am I Stressed?</li>
            <li>Am I Sleeping Enough?</li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact & Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone size={16}/> Call Support</li>
            <li className="flex items-center gap-2"><MessageSquare size={16}/> Chat Support</li>
            <li className="flex items-center gap-2"><Mail size={16}/> Email Us</li>
            <li>🕒 Mon–Sat: 9:00 AM – 11:00 PM</li>
            <li>🕒 Sun: 10:00 AM – 7:00 PM</li>
          </ul>
        </div>

        {/* Stay Connected */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
          <div className="flex gap-4">
            <Instagram size={20} className="cursor-pointer hover:text-pink-500"/>
            <Linkedin size={20} className="cursor-pointer hover:text-blue-400"/>
            <Youtube size={20} className="cursor-pointer hover:text-red-500"/>
            <Twitter size={20} className="cursor-pointer hover:text-sky-400"/>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="max-w-7xl mx-auto border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Ctrl+You. All rights reserved.</p>
        <p className="mt-2">
          Ctrl+You is not a replacement for professional therapy. If you are in crisis, please reach out to a licensed professional or helpline immediately.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
