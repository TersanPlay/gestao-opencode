import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { Features } from "@/components/landing/Features";
import { BentoModules } from "@/components/landing/BentoModules";
import { Footer } from "@/components/landing/Footer";

export function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC]">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <BentoModules />
      <Footer />
    </div>
  );
}
