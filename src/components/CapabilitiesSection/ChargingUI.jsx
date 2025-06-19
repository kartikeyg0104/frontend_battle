import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './UI.module.css';

const ChargingUI = () => {
  const [usage, setUsage] = useState(245);
  const [stations, setStations] = useState(12);
  const componentRef = useRef(null);
  
  // Simulate real-time data updates
  useEffect(() => {
    const usageInterval = setInterval(() => {
      setUsage(prev => prev + Math.floor(Math.random() * 10));
    }, 4000);
    
    // Animate the component on mount
    gsap.fromTo(
      componentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    return () => {
      clearInterval(usageInterval);
    };
  }, []);
  
  return (
    <div ref={componentRef} className={styles.uiContainer}>
      <div className={styles.dashboard}>
        <div className={styles.card}>
          <h3>Energy Usage</h3>
          <div className={styles.metric}>{usage} kWh</div>
          <div className={styles.growth}>+5.2% from last month</div>
        </div>
        
        <div className={styles.card}>
          <h3>Active Stations</h3>
          <div className={styles.metric}>{stations}</div>
          <div className={styles.growth}>+2 from last month</div>
        </div>
        
        <div className={styles.map}>
          <h3>Station Locations</h3>
          <div className={styles.mapGraphic}>
            <div className={styles.mapPoint} style={{ top: '30%', left: '20%' }}></div>
            <div className={styles.mapPoint} style={{ top: '50%', left: '40%' }}></div>
            <div className={styles.mapPoint} style={{ top: '70%', left: '30%' }}></div>
            <div className={styles.mapPoint} style={{ top: '20%', left: '60%' }}></div>
            <div className={styles.mapPoint} style={{ top: '60%', left: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargingUI;
