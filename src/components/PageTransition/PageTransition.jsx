import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './PageTransition.module.css';

const PageTransition = ({ children }) => {
  const pageRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    // Page enter animation
    const tl = gsap.timeline();
    
    tl.fromTo(
      overlayRef.current,
      { 
        y: 0,
        autoAlpha: 1
      },
      {
        y: '-100%',
        duration: 1.2,
        ease: 'power4.out',
      }
    );
    
    tl.fromTo(
      pageRef.current,
      { 
        y: 50,
        autoAlpha: 0
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.5'
    );
    
    // Add navigation animation
    const handleLinkClick = (e) => {
      const target = e.target.closest('a');
      
      if (target && !target.target && target.href && target.href.indexOf(window.location.origin) === 0) {
        e.preventDefault();
        
        const href = target.href;
        
        // Exit animation
        gsap.to(overlayRef.current, {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            window.location.href = href;
          }
        });
      }
    };
    
    document.addEventListener('click', handleLinkClick);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  return (
    <div className={styles.pageTransitionWrapper}>
      <div ref={overlayRef} className={styles.overlay}>
        <div className={styles.overlayInner}>
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
          </div>
        </div>
      </div>
      <div ref={pageRef} className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
