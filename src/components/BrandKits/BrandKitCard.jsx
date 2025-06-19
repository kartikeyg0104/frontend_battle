import styles from './BrandKitCard.module.css';

const BrandKitCard = ({ brand, isSelected, onSelect }) => {
  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.cardHeader}>
        <label className={styles.checkboxContainer}>
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => onSelect(brand.id)}
          />
          <span className={styles.customCheckbox}></span>
        </label>
        
        <div className={styles.logoContainer}>
          <img src={brand.logo} alt={brand.name} className={styles.logo} />
        </div>
        
        <button className={styles.settingsButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.brandName}>{brand.name}</h3>
      </div>
    </div>
  );
};

export default BrandKitCard;
