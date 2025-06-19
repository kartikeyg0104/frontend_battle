import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './HeroSection.module.css';
import BackgroundDataItem from './BackgroundDataItem';

const HeroSection = () => {
  const [activeContent, setActiveContent] = useState('reports');
  const [backgroundItems, setBackgroundItems] = useState([]);
  const heroRef = useRef(null);
  
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

  return (
    <section ref={heroRef} className={styles.heroSection}>
      <div className={styles.backgroundElements}>
        {backgroundItems.map(item => (
          <BackgroundDataItem key={item.id} item={item} />
        ))}
      </div>
      
      <div className={styles.header}>
        {/* This would be a separate Header component */}
        <div className={styles.logo}>Brand</div>
        <nav className={styles.nav}>
          <ul>
            <li>Services</li>
            <li>Work</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
      </div>
      
      <div className={styles.heroContent}>
        <h1>Transform Your Business with Smart Analytics</h1>
        <p>Unlock insights from your data with our powerful platform</p>
        
        <div className={styles.ctas}>
          <button className={styles.primaryBtn}>Get Started</button>
          <a href="#learn-more" className={styles.secondaryBtn}>Learn More</a>
        </div>
        
        <div className={styles.contentHighlight}>
          <div className={`${styles.contentItem} ${styles.reports} ${activeContent === 'reports' ? styles.active : ''}`}>
            <h3>Comprehensive Reports</h3>
            <p>Gain detailed insights into your business performance with our advanced reporting tools.</p>
          </div>
          
          <div className={`${styles.contentItem} ${styles.forecasts} ${activeContent === 'forecasts' ? styles.active : ''}`}>
            <h3>Accurate Forecasts</h3>
            <p>Plan ahead with confidence using our AI-powered predictive analytics.</p>
          </div>
          
          <div className={`${styles.contentItem} ${styles.consolidations} ${activeContent === 'consolidations' ? styles.active : ''}`}>
            <h3>Data Consolidation</h3>
            <p>Bring all your data sources together for a unified view of your business.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
