import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import IndustrySection from "./components/IndustrySection";
import TopSuppliers from "./components/TopSuppliers";
import TrendingProducts from "./components/TrendingProducts";
import HowItWorks from "./components/HowItWorks";
import WhyChoose from "./components/WhyChoose";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

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