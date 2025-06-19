import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle mobile menu animations
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        // Open animation
        gsap.to(mobileMenuRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out'
        });
        
        // Animate menu items
        gsap.fromTo(
          `.${styles.mobileMenuItem}`,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2
          }
        );
      } else {
        // Close animation
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in'
        });
      }
    }
  }, [isMobileMenuOpen]);
  
  // Initial animation
  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
  }, []);
  
  return (
    <nav 
      ref={navbarRef}
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.navbarContainer}>
        <div className={styles.logo}>
          <a href="/">
            <span className={styles.logoText}>Nexus</span>
            <span className={styles.logoAccent}>Tech</span>
          </a>
        </div>
        
        <div className={styles.navLinksDesktop}>
          <a href="#home" className={`${styles.navLink} ${styles.active}`}>Home</a>
          <a href="#services" className={styles.navLink}>Services</a>
          <a href="#projects" className={styles.navLink}>Projects</a>
          <a href="#about" className={styles.navLink}>About</a>
          <a href="#contact" className={styles.navLink}>Contact</a>
        </div>
        
        <button 
          className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div 
        ref={mobileMenuRef}
        className={styles.mobileMenu}
      >
        <div className={styles.mobileMenuContent}>
          <a href="#home" className={styles.mobileMenuItem}>Home</a>
          <a href="#services" className={styles.mobileMenuItem}>Services</a>
          <a href="#projects" className={styles.mobileMenuItem}>Projects</a>
          <a href="#about" className={styles.mobileMenuItem}>About</a>
          <a href="#contact" className={styles.mobileMenuItem}>Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
