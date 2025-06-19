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

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <Loader isLoaded={isLoaded} />
      {isLoaded && (
        <>
          {/* Global interactive background - will show on HeroSection */}
          <RippleBackground />
          
          <HeroSection />
          <CustomerSection />
          <CapabilitiesSection />
          <ParallaxSection />
          <ScrollScene />
          <ProjectShowcase />
          <BrandKits />
          <StatsSection />
          <CarbonGraph />
          <TestimonialsSection />
        </>
      )}
    </div>
  );
}

export default App;
