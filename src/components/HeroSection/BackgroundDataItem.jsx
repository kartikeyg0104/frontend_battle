import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './BackgroundDataItem.module.css';

const BackgroundDataItem = ({ item }) => {
  const itemRef = useRef(null);
  
  useEffect(() => {
    // Initial animation - fade in and move
    gsap.fromTo(
      itemRef.current,
      { 
        opacity: 0,
        x: item.x,
        y: item.y,
        scale: 0.8
      },
      { 
        opacity: 0.7,
        y: item.y - 100, // Move up
        scale: 1,
        duration: 2,
        ease: 'power1.out'
      }
    );
    
    // Final animation - fade out
    gsap.to(
      itemRef.current,
      {
        opacity: 0,
        y: item.y - 200,
        delay: 3,
        duration: 2,
        ease: 'power1.in'
      }
    );
  }, [item.x, item.y]);

  const renderContent = () => {
    switch(item.type) {
      case 'number':
        return <div className={styles.number}>{item.value}</div>;
      case 'chart':
        return (
          <div className={styles.miniChart}>
            <div className={styles.bar} style={{ height: `${Math.random() * 30 + 10}px` }}></div>
            <div className={styles.bar} style={{ height: `${Math.random() * 30 + 10}px` }}></div>
            <div className={styles.bar} style={{ height: `${Math.random() * 30 + 10}px` }}></div>
          </div>
        );
      case 'text':
        const texts = ['Revenue', 'Users', 'Growth', 'Conversion', 'ROI'];
        return <div className={styles.text}>{texts[Math.floor(Math.random() * texts.length)]}</div>;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={itemRef}
      className={styles.item}
      style={{ left: item.x, top: item.y }}
    >
      {renderContent()}
    </div>
  );
};

export default BackgroundDataItem;
