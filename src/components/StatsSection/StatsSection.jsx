import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import StatColumn from './StatColumn';
import styles from './StatsSection.module.css';

const statsData = [
  {
    id: 1,
    title: 'Revenue',
    unit: '$',
    currentValue: 1256789,
    change: 12.5,
    yearlyData: [
      { year: 2020, value: 856420 },
      { year: 2021, value: 945630 },
      { year: 2022, value: 1129840 },
      { year: 2023, value: 1256789 }
    ]
  },
  {
    id: 2,
    title: 'Active Users',
    unit: '',
    currentValue: 156420,
    change: 8.2,
    yearlyData: [
      { year: 2020, value: 98560 },
      { year: 2021, value: 125430 },
      { year: 2022, value: 142780 },
      { year: 2023, value: 156420 }
    ]
  },
  {
    id: 3,
    title: 'Conversion Rate',
    unit: '%',
    currentValue: 5.6,
    change: -1.2,
    yearlyData: [
      { year: 2020, value: 4.2 },
      { year: 2021, value: 4.8 },
      { year: 2022, value: 5.9 },
      { year: 2023, value: 5.6 }
    ]
  }
];

const StatsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  return (
    <section ref={ref} className={styles.statsSection}>
      <div className="container">
        <div className={styles.statsContainer}>
          {statsData.map((stat) => (
            <StatColumn 
              key={stat.id} 
              stat={stat} 
              animate={inView} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
