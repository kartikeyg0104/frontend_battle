import { useState, useEffect } from 'react';
import './App.css';
import Loader from './components/Loader/Loader';
import HeroSection from './components/HeroSection/HeroSection';
import CustomerSection from './components/CustomerSection/CustomerSection';
import CapabilitiesSection from './components/CapabilitiesSection/CapabilitiesSection';
import ParallaxSection from './components/ParallaxSection/ParallaxSection';
import ScrollScene from "./components/ScrollScene/ScrollScene";
import ProjectShowcase from './components/ProjectShowcase/ProjectShowcase';
import BrandKits from './components/BrandKits/BrandKits';
import StatsSection from './components/StatsSection/StatsSection';
import CarbonGraph from './components/CarbonGraph/CarbonGraph';
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection';
import RippleBackground from './components/RippleBackground/RippleBackground';
import { gsap } from 'gsap';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PageTransition from './components/PageTransition/PageTransition';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading time with a slightly more dramatic reveal
    const timer = setTimeout(() => {
      setIsLoaded(true);
      
      // Add page-wide transition once loader is gone
      setTimeout(() => {
        // Reveal sections with staggered appearance
        gsap.fromTo(
          '.app > section',
          { 
            opacity: 0,
            y: 30,
            filter: 'blur(5px)'
          },
          { 
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out',
          }
        );
      }, 1000); // Start after loader fade completes
    }, 3500); // Give loader more time to showcase animations
    
    return () => clearTimeout(timer);
  }, []);

  // Add global scroll function for navigation
  useEffect(() => {
    // Make global scroll function available to all components
    window.scrollToSection = (sectionSelector) => {
      const section = document.querySelector(sectionSelector);
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth'
        });
      }
    };
    
    return () => {
      delete window.scrollToSection;
    };
  }, []);

  return (
    <PageTransition>
      <div className="app">
        <Loader isLoaded={isLoaded} />
        {isLoaded && (
          <>
            {/* Global interactive background - will show on HeroSection */}
            <RippleBackground />
            
            <Navbar />
            <main>
              <section id="home">
                <HeroSection />
              </section>
              
              <section id="services">
                <CustomerSection />
                <CapabilitiesSection />
              </section>
              
              <section id="projects">
                <ProjectShowcase />
              </section>
              
              <section id="about">
                <ParallaxSection />
                <ScrollScene />
              </section>
              
              <section id="contact">
                <TestimonialsSection />
                <CarbonGraph />
              </section>
            </main>
            <Footer />
          </>
        )}
      </div>
    </PageTransition>
  );
}

export default App;
