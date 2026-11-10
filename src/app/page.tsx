
import Navbar from "@/components/layout/Navbar";

import IndustrySection from "@/components/home/IndustrySection";
import Hero from "@/components/home/Hero";
import TrendingProducts from "@/components/home/TrendingProducts";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChoose from "@/components/home/WhyChoose";

import ScrollAnimation from "@/components/home/ScrollAnimation";
import PostProductCTA from "@/components/home/PostProductCTA";
import FeaturedSuppliers from "@/components/home/FeaturedSuppliers";
import ContactAdvixio from "@/components/home/ContactAdvixio";
import FindSuppliersByCity from "@/components/home/FindSuppliersByCity";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="page-scroll">

        <ScrollAnimation />

        {/* HERO */}
        <Hero />

        {/* CATEGORIES */}
        <section
          id="categories"
          className="scroll-section"
        >
          <IndustrySection />
        </section>

        {/* TRENDING PRODUCTS */}
        <section
          id="trending-products"
          className="scroll-section"
        >
          <TrendingProducts />
        </section>

        {/* POST PRODUCT CTA */}
        <section className="scroll-section">
          <PostProductCTA />
        </section>

        {/* FEATURED SUPPLIERS */}
        <section
          id="featured-suppliers"
          className="scroll-section"
        >
          <FeaturedSuppliers />
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="scroll-section"
        >
          <ContactAdvixio />
        </section>

        {/* HOW IT WORKS */}
       <section id="how" className="scroll-section">
  <HowItWorks />
</section>

        {/* WHY CHOOSE */}
        <section className="scroll-section">
          <WhyChoose />
        </section>

        {/* FIND SUPPLIERS BY CITY */}
        <section className="scroll-section">
          <FindSuppliersByCity />
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="scroll-section"
        >
          <FAQ />
        </section>

      </main>

      <Footer />
    </>
  );
}
