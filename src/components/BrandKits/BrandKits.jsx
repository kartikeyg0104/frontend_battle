import { useState } from 'react';
import BrandKitCard from './BrandKitCard';
import styles from './BrandKits.module.css';

const brandKits = [
  {
    id: 1,
    name: 'Acme Corp',
    logo: 'https://via.placeholder.com/40',
  },
  {
    id: 2,
    name: 'TechSolutions',
    logo: 'https://via.placeholder.com/40',
  },
  {
    id: 3,
    name: 'Innovative Inc',
    logo: 'https://via.placeholder.com/40',
  }
];

const BrandKits = () => {
  const [selectedKit, setSelectedKit] = useState(brandKits[0].id);
  
  const handleSelect = (id) => {
    setSelectedKit(id);
  };
  
  return (
    <section className={styles.brandKitsSection}>
      <div className="container">
        <div className={styles.brandKitsContainer}>
          <h2 className={styles.title}>Brand Kits</h2>
          
          <div className={styles.cardsContainer}>
            {brandKits.map((kit) => (
              <BrandKitCard
                key={kit.id}
                brand={kit}
                isSelected={selectedKit === kit.id}
                onSelect={() => handleSelect(kit.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandKits;
