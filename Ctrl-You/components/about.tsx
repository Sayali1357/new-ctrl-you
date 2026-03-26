import { Brain, Shield, Clock, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
      <div className="max-w-5xl bg-white shadow-lg rounded-2xl p-10">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          About Us
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-700 leading-relaxed text-center mb-10">
          Welcome to <span className="font-semibold">MindCare AI</span> –  
          an intelligent, AI-powered counseling platform designed to support your 
          mental and emotional well-being.  
          We combine the latest in **artificial intelligence** with trusted 
          counseling practices to make mental health care more **accessible, 
          private, and available 24/7**.
        </p>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <Brain className="text-purple-500 mb-3" size={32} />
            <h2 className="text-xl font-semibold mb-2">AI-Powered Insights</h2>
            <p className="text-gray-600">
              Our advanced AI listens, understands, and provides supportive 
              guidance tailored to your emotions, challenges, and growth journey.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <Shield className="text-green-500 mb-3" size={32} />
            <h2 className="text-xl font-semibold mb-2">Safe & Confidential</h2>
            <p className="text-gray-600">
              Your conversations are secure and private.  
              We follow strict data protection to ensure your trust is never compromised.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <Clock className="text-blue-500 mb-3" size={32} />
            <h2 className="text-xl font-semibold mb-2">24/7 Availability</h2>
            <p className="text-gray-600">
              Unlike traditional counseling, our AI counselor is here for you 
              anytime – whether it’s late at night or during a busy day.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <Globe className="text-orange-500 mb-3" size={32} />
            <h2 className="text-xl font-semibold mb-2">Accessible Anywhere</h2>
            <p className="text-gray-600">
              Whether you’re at home, work, or on the go, 
              connect with our AI counselor from any device and any location.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Mission</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We aim to remove barriers to mental health support by leveraging AI.  
            Our goal is to provide **affordable, stigma-free, and always-available** 
            counseling that helps individuals overcome stress, anxiety, and everyday struggles.
          </p>
        </div>

        {/* Closing Note */}
        <div className="text-center border-t pt-6">
          <p className="text-gray-700 text-lg">
            💙 At <span className="font-semibold">MindCare AI</span>,  
            you are not alone. Together, with the help of AI, 
            we can build a healthier, happier, and stronger you.
          </p>
        </div>
      </div>
    </div>
  );
}
