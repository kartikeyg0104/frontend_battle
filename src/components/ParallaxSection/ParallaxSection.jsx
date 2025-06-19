import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import styles from './ParallaxSection.module.css';

const ParallaxSection = () => {
  const sectionRef = useRef(null);
  const backgroundRef = useRef(null);
  const midgroundRef = useRef(null);
  const foregroundRef = useRef(null);
  const contentRef = useRef(null);
  const particlesRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [particles, setParticles] = useState([]);
  
  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2
    }));
    
    setParticles(newParticles);
  }, []);
  
  // Track scroll position within this section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const { top, height } = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled into the section (0 to 1)
      const scrollProgress = 1 - (top / (windowHeight - height));
      
      // Only update if section is in view
      if (scrollProgress >= 0 && scrollProgress <= 1) {
        setScrollPosition(scrollProgress);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Apply parallax effect based on scroll position
  useEffect(() => {
    if (backgroundRef.current) {
      // Slower movement for background
      backgroundRef.current.style.transform = `translateY(${scrollPosition * 30}px)`;
    }
    
    if (midgroundRef.current) {
      // Medium movement for midground
      midgroundRef.current.style.transform = `translateY(${scrollPosition * 50}px) scale(${1 + scrollPosition * 0.1})`;
      midgroundRef.current.style.opacity = 1 - scrollPosition * 0.3;
    }
    
    if (foregroundRef.current) {
      // Faster movement for foreground
      foregroundRef.current.style.transform = `translateY(${scrollPosition * 80}px) scale(${1 + scrollPosition * 0.2})`;
    }
    
    if (contentRef.current) {
      // Content moves in opposite direction
      contentRef.current.style.transform = `translateY(${scrollPosition * -70}px)`;
      contentRef.current.style.opacity = 1 - (scrollPosition * 0.5);
    }
    
    // Animate particles
    if (particlesRef.current) {
      const particlesArray = Array.from(particlesRef.current.children);
      particlesArray.forEach((particle, i) => {
        const speed = particles[i]?.speed || 0.3;
        gsap.to(particle, {
          y: `+=${scrollPosition * 100 * speed}`,
          duration: 0.5,
          ease: 'power1.out'
        });
      });
    }
  }, [scrollPosition, particles]);
  
  // Animate content on mount
  useEffect(() => {
    gsap.from(contentRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }, []);

  return (
    <section ref={sectionRef} className={styles.parallaxSection}>
      <div ref={backgroundRef} className={styles.backgroundLayer}>
        {/* Video background option */}
        <video autoPlay loop muted className={styles.backgroundVideo}>
          <source src="/videos/parallax-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Alternative image background if video isn't available */}
        <div className={styles.backgroundImage}></div>
      </div>
      
      {/* Particle overlay */}
      <div ref={particlesRef} className={styles.particles}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          />
        ))}
      </div>
      
      {/* Midground layer */}
      <div ref={midgroundRef} className={styles.midgroundLayer}>
        <div className={styles.midgroundShape}></div>
      </div>
      
      {/* Foreground layer */}
      <div ref={foregroundRef} className={styles.foregroundLayer}>
        <div className={styles.foregroundShape}></div>
      </div>
      
      <div ref={contentRef} className={styles.content}>
        <h2>Immersive Experiences</h2>
        <p>Scroll to discover the parallax effect that adds depth and dimension to your web experience.</p>
        <button className={styles.button}>Learn More</button>
      </div>
    </section>
  );
};

export default ParallaxSection;
