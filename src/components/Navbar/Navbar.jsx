import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navbarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  // Navigation sections mapping
  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];
  
  // Handle scroll effect and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar appearance based on scroll position
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Track active section based on scroll position
      const scrollPosition = window.scrollY + 300; // Offset for better UX
      
      // Get all main sections and determine which one is currently visible
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id) || document.querySelector(`.${section.id}Section`)
      })).filter(section => section.element);
      
      // Find the current active section
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, element } = sectionElements[i];
        const offsetTop = element.offsetTop;
        
        if (scrollPosition >= offsetTop) {
          setActiveSection(id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);
  
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
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = 'hidden';
      } else {
        // Close animation
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            // Restore body scrolling when menu is closed
            document.body.style.overflow = '';
          }
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
  
  // Handle navigation click
  const handleNavClick = (sectionId, isMobile = false) => {
    const section = document.getElementById(sectionId) || document.querySelector(`.${sectionId}Section`);
    
    if (section) {
      // Scroll to the section
      section.scrollIntoView({ behavior: 'smooth' });
      
      // Update active section
      setActiveSection(sectionId);
      
      // Close mobile menu if open
      if (isMobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };
  
  return (
    <nav 
      ref={navbarRef}
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.navbarContainer}>
        <div className={styles.logo}>
          <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
            <span className={styles.logoText}>Nexus</span>
            <span className={styles.logoAccent}>Tech</span>
          </a>
        </div>
        
        <div className={styles.navLinksDesktop}>
          {sections.map(section => (
            <a 
              key={section.id}
              href={`#${section.id}`}
              className={`${styles.navLink} ${activeSection === section.id ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(section.id); }}
            >
              {section.label}
            </a>
          ))}
        </div>
        
        <button 
          className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div 
        ref={mobileMenuRef}
        className={styles.mobileMenu}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.mobileMenuContent}>
          {sections.map(section => (
            <a 
              key={section.id}
              href={`#${section.id}`}
              className={`${styles.mobileMenuItem} ${activeSection === section.id ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(section.id, true); }}
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
