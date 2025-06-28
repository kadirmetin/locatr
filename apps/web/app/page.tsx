import AboutMe from '@/components/landing/AboutMe';
import FAQSection from '@/components/landing/Faq';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import { Marquee } from '@/components/landing/Marquee';
import Navbar from '@/components/landing/Navbar';
import WhyLocatr from '@/components/landing/WhyLocatr';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Marquee />
      <WhyLocatr />
      <FAQSection />
      <AboutMe />
      <Footer />
    </>
  );
};

export default HomePage;
