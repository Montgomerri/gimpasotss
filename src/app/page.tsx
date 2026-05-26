import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import CoursesGrid from "@/components/CoursesGrid";
import HeadMessage from "@/components/Categories";
import PromoSection from "@/components/PromoSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <CoursesGrid />
      <HeadMessage />
      <PromoSection />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </>
  );
}
