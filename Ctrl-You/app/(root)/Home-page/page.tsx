import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import Advantages from "@/components/Advantages";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar/>
      <HeroSection />
      <Features />
      <Advantages />
      <Footer />
    </>
  );
}
