import Navbar from "@/components/layout/Navbar";
import IndustrySection from "@/components/home/IndustrySection";
import Hero from "@/components/home/Hero";
import TopSuppliers from "@/components/home/TopSuppliers";
import TrendingProducts from "@/components/home/TrendingProducts";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChoose from "@/components/home/WhyChoose";
import CTASection from "@/components/home/CTASection";

import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <IndustrySection />

        <TopSuppliers />

        <TrendingProducts />

        <HowItWorks />

        <WhyChoose />

        <CTASection />
      </main>

      <Footer />
    </>
  );
}