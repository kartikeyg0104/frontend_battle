import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './UI.module.css';

const CatalogUI = () => {
  const [products, setProducts] = useState(542);
  const [categories, setCategories] = useState(28);
  const componentRef = useRef(null);
  
  // Simulate real-time data updates
  useEffect(() => {
    const productsInterval = setInterval(() => {
      setProducts(prev => prev + Math.floor(Math.random() * 3));
    }, 6000);
    
    // Animate the component on mount
    gsap.fromTo(
      componentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    return () => {
      clearInterval(productsInterval);
    };
  }, []);
  
  return (
    <div ref={componentRef} className={styles.uiContainer}>
      <div className={styles.dashboard}>
        <div className={styles.card}>
          <h3>Total Products</h3>
          <div className={styles.metric}>{products}</div>
          <div className={styles.growth}>+24 from last month</div>
        </div>
        
        <div className={styles.card}>
          <h3>Categories</h3>
          <div className={styles.metric}>{categories}</div>
          <div className={styles.growth}>+3 from last month</div>
        </div>
        
        <div className={styles.productGrid}>
          <h3>Popular Products</h3>
          <div className={styles.grid}>
            <div className={styles.product}></div>
            <div className={styles.product}></div>
            <div className={styles.product}></div>
            <div className={styles.product}></div>
            <div className={styles.product}></div>
            <div className={styles.product}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogUI;
