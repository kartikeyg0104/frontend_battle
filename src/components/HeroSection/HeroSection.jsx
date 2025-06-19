import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './HeroSection.module.css';
import BackgroundDataItem from './BackgroundDataItem';
import styled from 'styled-components';

const HeroSectionWithBg = styled.section`
  ${(props) => props.className} {
    background-image: linear-gradient(rgba(18, 18, 24, 0.75), rgba(26, 26, 46, 0.80)), 
                    url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }
`;

const HeroSection = () => {
  const [activeContent, setActiveContent] = useState('reports');
  const [backgroundItems, setBackgroundItems] = useState([]);
  const [showVideo, setShowVideo] = useState(true);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const videoRef = useRef(null);
  
  // Function to add background items periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate random position within viewport
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Generate random data type
      const types = ['number', 'chart', 'text'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Add new item with unique ID
      const newItem = {
        id: Date.now(),
        x,
        y,
        type,
        value: type === 'number' ? Math.floor(Math.random() * 100) : null
      };
      
      setBackgroundItems(prev => [...prev, newItem]);
      
      // Remove item after animation completes (5 seconds)
      setTimeout(() => {
        setBackgroundItems(prev => prev.filter(item => item.id !== newItem.id));
      }, 5000);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  // Content highlight rotation
  useEffect(() => {
    const contentTypes = ['reports', 'forecasts', 'consolidations'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % contentTypes.length;
      setActiveContent(contentTypes[currentIndex]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // GSAP animation for content highlight
  useEffect(() => {
    gsap.fromTo(
      `.${styles[activeContent]}`,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, [activeContent]);

  // GSAP animation for hero text
  useEffect(() => {
    // Animate the hero elements with proper timing to avoid overlay
    const tl = gsap.timeline();
    
    tl.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
    .from(subtitleRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.6") // Start slightly before the title animation finishes
    .from(ctaRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");
  }, []);
  
  // Handle video loading or errors
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('error', () => {
        setShowVideo(false);
      });
    }
  }, []);
  
  // Add scroll functionality for buttons
  const handleGetStarted = () => {
    // Scroll to CapabilitiesSection
    document.querySelector('.capabilitiesSection').scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  const handleLearnMore = () => {
    // Scroll to ParallaxSection
    document.querySelector('.parallaxSection').scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  // Add scroll down functionality
  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };
  
  // Add this useEffect to ensure proper contrast with the background
  useEffect(() => {
    if (heroRef.current) {
      // Add a dark overlay to improve text visibility
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8))';
      overlay.style.zIndex = '1';
      
      heroRef.current.prepend(overlay);
      
      return () => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      };
    }
  }, []);
  
  return (
    <HeroSectionWithBg ref={heroRef} className={styles.heroSection}>
      {/* Video Background */}
      {showVideo && (
        <div className={styles.videoBackground}>
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            className={styles.backgroundVideo}
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-futuristic-animation-of-digital-matrix-48592-large.mp4" type="video/mp4" />
          </video>
        </div>
      )}
      
      <div className={styles.backgroundElements}>
        {backgroundItems.map(item => (
          <BackgroundDataItem key={item.id} item={item} />
        ))}
      </div>
      
      <div className={styles.contentWrapper}>
        <h1 ref={titleRef} className={styles.title}>
          Transforming Digital <span className={styles.highlight}>Experiences</span>
        </h1>
        
        <div ref={subtitleRef} className={styles.subtitleContainer}>
          <p className={styles.subtitle}>
            We create innovative solutions that elevate your brand and engage your audience.
          </p>
        </div>
        
        <div ref={ctaRef} className={styles.ctaContainer}>
          <button 
            className={styles.primaryButton}
            onClick={handleGetStarted}
          >
            Get Started
          </button>
          <button 
            className={styles.secondaryButton}
            onClick={handleLearnMore}
          >
            Learn More
          </button>
        </div>
      </div>
      
      {/* Add scroll down indicator */}
      <div className={styles.scrollDown} onClick={handleScrollDown}>
        <div className={styles.scrollDownText}>Scroll Down</div>
        <div className={styles.scrollDownIcon}></div>
      </div>
    </HeroSectionWithBg>
  );
};

export default HeroSection;
