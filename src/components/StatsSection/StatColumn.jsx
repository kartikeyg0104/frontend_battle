import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './StatColumn.module.css';

const StatColumn = ({ stat, animate }) => {
  const valueRef = useRef(null);
  const barsRef = useRef([]);
  
  // Find the highest value for scaling
  const maxValue = Math.max(...stat.yearlyData.map(item => item.value));
  
  // Animation when component becomes visible
  useEffect(() => {
    if (animate && valueRef.current) {
      // Animate the main value counting up with improved effect
      gsap.fromTo(
        valueRef.current,
        { 
          textContent: 0,
          opacity: 0,
          y: 15,
          filter: 'blur(5px)'
        },
        {
          textContent: stat.currentValue,
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 2.5,
          ease: 'power3.out',
          snap: { textContent: stat.title === 'Conversion Rate' ? 0.1 : 1 },
          onUpdate: function() {
            if (stat.title === 'Conversion Rate') {
              valueRef.current.textContent = parseFloat(valueRef.current.textContent).toFixed(1);
            } else {
              valueRef.current.textContent = parseInt(valueRef.current.textContent).toLocaleString();
            }
          }
        }
      );
      
      // Animate change indicator with bounce effect
      gsap.fromTo(
        `.${styles.change}`,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          delay: 1,
          ease: 'back.out(2.5)'
        }
      );
      
      // Animate bars with staggered timeline
      const tl = gsap.timeline({ delay: 0.8 });
      
      barsRef.current.forEach((bar, index) => {
        tl.fromTo(
          bar,
          { 
            width: 0,
            opacity: 0.5
          },
          { 
            width: `${(stat.yearlyData[index].value / maxValue) * 100}%`,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
          },
          index * 0.2 // Stagger start times
        );
      });
    }
  }, [animate, stat, maxValue]);
  
  return (
    <div className={styles.statColumn}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{stat.title}</h3>
          <span className={styles.unit}>{stat.unit}</span>
        </div>
        
        <div className={styles.valueContainer}>
          <span ref={valueRef} className={styles.value}>
            {stat.title === 'Conversion Rate' ? 
              stat.currentValue.toFixed(1) : 
              stat.currentValue.toLocaleString()}
          </span>
          
          <div className={`${styles.change} ${stat.change >= 0 ? styles.positive : styles.negative}`}>
            <span className={styles.arrow}>
              {stat.change >= 0 ? '↑' : '↓'}
            </span>
            <span className={styles.changeValue}>
              {Math.abs(stat.change)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.yearlyData}>
        {stat.yearlyData.map((item, index) => (
          <div key={item.year} className={styles.yearItem}>
            <div className={styles.yearLabel}>{item.year}</div>
            
            <div className={styles.barContainer}>
              <div 
                ref={el => barsRef.current[index] = el}
                className={styles.bar}
                style={{ width: animate ? `${(item.value / maxValue) * 100}%` : 0 }}
              ></div>
              
              <span className={styles.barValue}>
                {stat.title === 'Conversion Rate' ? 
                  item.value.toFixed(1) : 
                  item.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.actions}>
        <a href="#" className={styles.actionLink}>View Report</a>
        <a href="#" className={styles.actionLink}>Export Data</a>
      </div>
    </div>
  );
};

export default StatColumn;
