import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import LogoItem from './LogoItem';
import styles from './CustomerSection.module.css';

// Mock data for company logos
const companies = [
  { id: 1, name: 'Company A', logoUrl: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Company B', logoUrl: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Company C', logoUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Company D', logoUrl: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Company E', logoUrl: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Company F', logoUrl: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Company G', logoUrl: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Company H', logoUrl: 'https://via.placeholder.com/150' },
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
  
  return (
    <section ref={sectionRef} className={styles.customerSection}>
      <div className="container">
        <h2 className={styles.title}>Trusted by industry leaders</h2>
        
        <div className={styles.logoGrid}>
          {companies.map(company => (
            <LogoItem key={company.id} company={company} />
          ))}
        </div>
        
        <button ref={buttonRef} className={styles.viewButton}>
          Meet our customers &gt;
        </button>
      </div>
    </section>
  );
};

export default CustomerSection;
