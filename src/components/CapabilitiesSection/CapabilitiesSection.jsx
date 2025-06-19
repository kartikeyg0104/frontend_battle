import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CapabilitiesSection.module.css';
import BillingUI from './BillingUI';
import ChargingUI from './ChargingUI';
import CatalogUI from './CatalogUI';

const CapabilitiesSection = () => {
  const [activeTab, setActiveTab] = useState('billing');
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    // Animate content change when tab changes
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeTab]);
  
  return (
    <section ref={sectionRef} className={styles.capabilitiesSection}>
      <div className="container">
        <h2 className={styles.title}>Our Capabilities</h2>
        
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'billing' ? styles.active : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              Billing
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'charging' ? styles.active : ''}`}
              onClick={() => setActiveTab('charging')}
            >
              Charging
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'catalog' ? styles.active : ''}`}
              onClick={() => setActiveTab('catalog')}
            >
              Catalog
            </button>
          </div>
          
          <div ref={contentRef} className={styles.tabContent}>
            {activeTab === 'billing' && <BillingUI />}
            {activeTab === 'charging' && <ChargingUI />}
            {activeTab === 'catalog' && <CatalogUI />}
          </div>
        </div>
      </div>
      
      <div className={styles.bottomNav}>
        <div className="container">
          <div className={styles.bottomNavContent}>
            <span>Ready to get started?</span>
            <button className={styles.cta}>Contact Us</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
