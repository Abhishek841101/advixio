import Navbar from "@/components/layout/Navbar";
import IndustrySection from "@/components/home/IndustrySection";
import Hero from "@/components/home/Hero";
import TopSuppliers from "@/components/home/TopSuppliers";
import TrendingProducts from "@/components/home/TrendingProducts";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChoose from "@/components/home/WhyChoose";
import CTASection from "@/components/home/CTASection";
import ScrollAnimation from "@/components/home/ScrollAnimation";


import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="page-scroll">

        <ScrollAnimation />

        <Hero />

        <section className="scroll-section">
          <IndustrySection />
        </section>

        <section className="scroll-section">
          <TopSuppliers />
        </section>

        <section className="scroll-section">
          <TrendingProducts />
        </section>

        <section className="scroll-section">
          <HowItWorks />
        </section>

        <section className="scroll-section">
          <WhyChoose />
        </section>

        <section className="scroll-section">
          <CTASection />
        </section>

      </main>

      <Footer />
    </>
  );
}