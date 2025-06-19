import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import LogoItem from './LogoItem';
import styles from './CustomerSection.module.css';

// Real company logos
const companies = [
  { id: 1, name: 'IBM', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
  { id: 2, name: 'Microsoft', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { id: 3, name: 'Google', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { id: 4, name: 'Amazon', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { id: 5, name: 'Apple', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { id: 6, name: 'Meta', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
  { id: 7, name: 'Samsung', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { id: 8, name: 'Intel', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg' },
];

const CustomerSection = () => {
  const sectionRef = useRef(null);
  const buttonRef = useRef(null);
  
  useEffect(() => {
    // Animate section on mount
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      }}
    );
    
    // Button hover animation
    const button = buttonRef.current;
    
    const onEnter = () => {
      gsap.to(button, {
        backgroundColor: 'rgba(58, 134, 255, 0.1)',
        duration: 0.3
      });
    };
    
    const onLeave = () => {
      gsap.to(button, {
        backgroundColor: 'transparent',
        duration: 0.3
      });
    };
    
    button.addEventListener('mouseenter', onEnter);
    button.addEventListener('mouseleave', onLeave);
    
    return () => {
      button.removeEventListener('mouseenter', onEnter);
      button.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  
  // Add button functionality
  const handleMeetCustomers = () => {
    // In a real app, this would navigate to a customer stories page
    // For now, we'll scroll to the testimonials section
    const testimonialsSection = document.querySelector('.testimonialsSection');
    
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      // Fallback if section not found
      alert("View more customer stories and testimonials");
    }
  };
  
  return (
    <section ref={sectionRef} className={styles.customerSection}>
      <div className="container">
        <h2 className={styles.title}>Trusted by industry leaders</h2>
        
        <div className={styles.logoGrid}>
          {companies.map(company => (
            <LogoItem key={company.id} company={company} />
          ))}
        </div>
        
        <button 
          ref={buttonRef} 
          className={styles.viewButton}
          onClick={handleMeetCustomers}
        >
          Meet our customers &gt;
        </button>
      </div>
    </section>
  );
};

export default CustomerSection;
