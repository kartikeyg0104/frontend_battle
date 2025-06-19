import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './UI.module.css';

const BillingUI = () => {
  const [revenue, setRevenue] = useState(12457);
  const [transactions, setTransactions] = useState(187);
  const componentRef = useRef(null);
  
  // Simulate real-time data updates
  useEffect(() => {
    const revenueInterval = setInterval(() => {
      setRevenue(prev => prev + Math.floor(Math.random() * 100));
    }, 3000);
    
    const transactionInterval = setInterval(() => {
      setTransactions(prev => prev + Math.floor(Math.random() * 5));
    }, 5000);
    
    // Animate the component on mount
    gsap.fromTo(
      componentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    // Animate number changes
    const animateNumber = (el, value) => {
      gsap.to(el, {
        innerText: value,
        duration: 1,
        ease: 'power1.inOut',
        snap: { innerText: 1 }
      });
    };
    
    return () => {
      clearInterval(revenueInterval);
      clearInterval(transactionInterval);
    };
  }, []);
  
  return (
    <div ref={componentRef} className={styles.uiContainer}>
      <div className={styles.dashboard}>
        <div className={styles.card}>
          <h3>Total Revenue</h3>
          <div className={styles.metric}>${revenue.toLocaleString()}</div>
          <div className={styles.growth}>+12.5% from last month</div>
        </div>
        
        <div className={styles.card}>
          <h3>Transactions</h3>
          <div className={styles.metric}>{transactions}</div>
          <div className={styles.growth}>+8.3% from last month</div>
        </div>
        
        <div className={styles.chart}>
          <h3>Revenue Breakdown</h3>
          <div className={styles.chartBars}>
            <div className={styles.bar} style={{ height: '60%' }}></div>
            <div className={styles.bar} style={{ height: '80%' }}></div>
            <div className={styles.bar} style={{ height: '40%' }}></div>
            <div className={styles.bar} style={{ height: '70%' }}></div>
            <div className={styles.bar} style={{ height: '90%' }}></div>
          </div>
          <div className={styles.labels}>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingUI;
