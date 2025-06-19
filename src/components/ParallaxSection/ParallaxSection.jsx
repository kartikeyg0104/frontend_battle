import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ParallaxSection.module.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ParallaxSection = () => {
  const sectionRef = useRef(null);
  const backgroundRef = useRef(null);
  const midgroundRef = useRef(null);
  const foregroundRef = useRef(null);
  const contentRef = useRef(null);
  const particlesRef = useRef(null);
  const videoRef = useRef(null);
  
  // Enhanced particle generation with more variety
  const [particles, setParticles] = useState([]);
  
  // Generate particles with more varied properties
  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 200 - 100,
      size: Math.random() * 6 + 1,
      speed: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.5 + 0.3,
      blur: Math.random() > 0.7,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    }));
    
    setParticles(newParticles);
  }, []);
  
  // Enhanced scroll-based parallax effect with GSAP ScrollTrigger
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Set initial perspective
    gsap.set(sectionRef.current, {
      perspective: 1000
    });
    
    // Background layer with rotation
    gsap.to(backgroundRef.current, {
      y: '30%',
      scale: 1.2,
      rotationX: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      }
    });
    
    // Midground layer with z-translation
    gsap.to(midgroundRef.current, {
      y: '50%',
      z: 150,
      scale: 1.1,
      opacity: 0.7,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.3
      }
    });
    
    // Foreground layer with stronger 3D effect
    gsap.to(foregroundRef.current, {
      y: '70%',
      z: 300,
      scale: 1.05,
      rotationY: 3,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.2
      }
    });
    
    // Content moves in opposite direction with 3D effect
    gsap.to(contentRef.current, {
      y: '-30%',
      z: 200,
      opacity: 0.7,
      rotationX: 5,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: '5% top',
        end: 'bottom top',
        scrub: true
      }
    });
    
    // Fade out video as user scrolls
    gsap.to(videoRef.current, {
      opacity: 0.6,
      filter: 'brightness(0.7) contrast(1.3)',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Animate particles based on scroll position with more complex patterns
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      
      // Only animate when section is in view
      if (scrollY > sectionTop - window.innerHeight && scrollY < sectionTop + sectionHeight) {
        const scrollProgress = (scrollY - (sectionTop - window.innerHeight)) / (sectionHeight + window.innerHeight);
        
        Array.from(particlesRef.current.children).forEach((particle, i) => {
          const speed = particles[i]?.speed || 0.3;
          const rotationSpeed = particles[i]?.rotationSpeed || 0;
          const z = particles[i]?.z || 0;
          
          // Apply 3D transform - z-translation affects scale for perspective
          const zProgress = z * scrollProgress * 0.01;
          const scale = 1 - (zProgress * 0.01);
          
          // 3D movement pattern
          const yMove = scrollProgress * 150 * speed;
          const xMove = Math.sin(scrollProgress * Math.PI * speed) * 50 * (i % 2 === 0 ? 1 : -1);
          const rotate = scrollProgress * 360 * rotationSpeed;
          
          gsap.to(particle, {
            y: `+=${yMove}`,
            x: `+=${xMove}`,
            z: zProgress,
            rotation: rotate,
            scale: scale,
            opacity: 1 - (scrollProgress * 0.5),
            duration: 0.3,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [particles]);
  
  // Animate content on mount with staggered appearance
  useEffect(() => {
    gsap.from(contentRef.current.children, {
      y: 70,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: contentRef.current,
        start: 'top 80%'
      }
    });
  }, []);
  
  // Button hover animation
  const handleButtonHover = (isHovering) => {
    const button = contentRef.current.querySelector(`.${styles.button}`);
    if (isHovering) {
      gsap.to(button, {
        y: -5,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
        duration: 0.3
      });
    } else {
      gsap.to(button, {
        y: 0,
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        duration: 0.3
      });
    }
  };
  
  // Button handler with enhanced interaction
  const handleButtonClick = () => {
    // Scroll to ScrollScene section
    document.querySelector('.scrollScene').scrollIntoView({
      behavior: 'smooth'
    });
    
    // Add button click animation with GSAP
    if (contentRef.current) {
      const button = contentRef.current.querySelector(`.${styles.button}`);
      gsap.timeline()
        .to(button, {
          scale: 0.95,
          duration: 0.1
        })
        .to(button, {
          scale: 1,
          duration: 0.2,
          ease: 'elastic.out(1.2, 0.5)'
        });
    }
  };

  return (
    <section ref={sectionRef} className={styles.parallaxSection}>
      <div ref={backgroundRef} className={styles.backgroundLayer}>
        {/* Enhanced video background with multiple options */}
        <video 
          ref={videoRef} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.backgroundVideo}
          onError={() => {
            // Fallback if primary video fails
            videoRef.current.src = "https://assets.mixkit.co/videos/preview/mixkit-futuristic-data-center-with-digital-screens-3d-animation-48592-large.mp4";
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-floating-city-of-platforms-4060-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-data-center-with-digital-screens-3d-animation-48592-large.mp4" type="video/mp4" />
        </video>
        
        {/* Alternative image background with enhanced visual */}
        <div className={styles.backgroundImage} style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80")'
        }}></div>
      </div>
      
      {/* Enhanced particle overlay with more particles */}
      <div ref={particlesRef} className={styles.particles}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              filter: particle.blur ? `blur(${Math.random() * 3 + 1}px)` : 'none',
              transform: `translateZ(${particle.z}px)`
            }}
          />
        ))}
      </div>
      
      {/* Midground layer with enhanced gradient shape */}
      <div ref={midgroundRef} className={styles.midgroundLayer}>
        <div className={styles.midgroundShape}></div>
      </div>
      
      {/* Foreground layer with enhanced animation properties */}
      <div ref={foregroundRef} className={styles.foregroundLayer}>
        <div className={styles.foregroundShape}></div>
      </div>
      
      {/* Content with staggered animations and hover effects */}
      <div ref={contentRef} className={styles.content}>
        <h2>Immersive Experiences</h2>
        <p>Scroll to discover the parallax effect that adds depth and dimension to your web experience. Our interactive designs create unforgettable user journeys.</p>
        <button 
          className={styles.button}
          onClick={handleButtonClick}
          onMouseEnter={() => handleButtonHover(true)}
          onMouseLeave={() => handleButtonHover(false)}
        >
          Learn More
        </button>
      </div>
    </section>
  );
};

export default ParallaxSection;
