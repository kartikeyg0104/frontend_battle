import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Footer.module.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  
  useEffect(() => {
    // Animate footer entrance
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // Animate footer content
    gsap.fromTo(
      `.${styles.footerColumn}`,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom-=50',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);
  
  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerTop}>
            <div className={styles.footerColumn}>
              <div className={styles.footerLogo}>
                <span className={styles.logoText}>Nexus</span>
                <span className={styles.logoAccent}>Tech</span>
              </div>
              <p className={styles.footerDescription}>
                Transforming ideas into exceptional digital experiences through innovative design and development.
              </p>
            </div>
            
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>Services</h3>
              <ul className={styles.footerLinks}>
                <li><a href="#" className={styles.footerLink}>Web Development</a></li>
                <li><a href="#" className={styles.footerLink}>UI/UX Design</a></li>
                <li><a href="#" className={styles.footerLink}>Mobile Apps</a></li>
                <li><a href="#" className={styles.footerLink}>Digital Marketing</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>Company</h3>
              <ul className={styles.footerLinks}>
                <li><a href="#" className={styles.footerLink}>About Us</a></li>
                <li><a href="#" className={styles.footerLink}>Careers</a></li>
                <li><a href="#" className={styles.footerLink}>Blog</a></li>
                <li><a href="#" className={styles.footerLink}>Contact</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>Stay Connected</h3>
              <div className={styles.newsletterForm}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={styles.newsletterInput}
                />
                <button className={styles.subscribeButton}>Subscribe</button>
              </div>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} NexusTech. All rights reserved.
            </p>
            <div className={styles.footerBottomLinks}>
              <a href="#" className={styles.footerBottomLink}>Privacy Policy</a>
              <a href="#" className={styles.footerBottomLink}>Terms of Service</a>
              <a href="#" className={styles.footerBottomLink}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
