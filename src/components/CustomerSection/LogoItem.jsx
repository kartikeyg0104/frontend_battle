import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './LogoItem.module.css';

const LogoItem = ({ company }) => {
  const logoRef = useRef(null);
  
  useEffect(() => {
    // Random values for animation
    const delay = Math.random() * 2;
    const duration = 1.5 + Math.random();
    
    // Create a timeline for this logo's animation
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(logoRef.current, {
      scale: 1.05,
      opacity: 1,
      duration: duration,
      delay: delay,
      ease: 'sine.inOut'
    }).to(logoRef.current, {
      scale: 1,
      opacity: 0.8,
      duration: duration,
      ease: 'sine.inOut'
    });
    
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <div ref={logoRef} className={styles.logoItem}>
      <img src={company.logoUrl} alt={company.name} />
    </div>
  );
};

export default LogoItem;
