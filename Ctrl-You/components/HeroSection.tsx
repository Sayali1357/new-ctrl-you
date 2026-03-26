import Image from "next/image";
import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-8 gap-10 text-white overflow-hidden">
      {/* Background Image with zoom */}
      <Image
        src="/hero-illustration.png"
        alt="Hero Illustration"
        fill
        className="absolute inset-0 object-cover object-center opacity-30 -z-10 animate-slowZoom"
        priority
      />

      {/* Left: text */}
      <div className="md:w-3/4 flex flex-col items-start">
        {/* Heading */}
        <h3 className="text-8xl md:text-7.5xl font-bold max-w-screen bg-clip-text text-transparent bg-gradient-to-r from-[#8A3FFC] via-[#00CFFF] to-[#FFFFFF] opacity-0 animate-fadeUp">
          Your Digital Life <br />
          Your Rules
        </h3>

        {/* Paragraph */}
        <p className="mt-5 text-lg text-[#4B6FFB]-400 max-w-md opacity-0 animate-fadeUp animation-delay-500">
          Discover if you’re playing the game or if the game is playing you – test your gaming habits in 10 mins!
        </p>

        {/* Button */}
        <div className="mt-8 opacity-0 animate-fadeUp animation-delay-1000">
          <a href="#">
            <Button className="inline-block bg-gradient-to-r from-[#00CFFF] to-[#4B6FFB] hover:from-[#00CFFF] hover:to-[#8A3FFC] text-white font-medium px-6 py-3 rounded-full shadow-lg animate-bounce">
              Quick Scan
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
