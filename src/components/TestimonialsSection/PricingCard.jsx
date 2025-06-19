import styles from './PricingCard.module.css';

const PricingCard = ({ plan }) => {
  // Add pricing selection functionality
  const handleSelectPlan = () => {
    // Display a confirmation dialog
    if (window.confirm(`You've selected the ${plan.name} plan at $${plan.price}/${plan.period}. Would you like to proceed?`)) {
      // In a real app, this would navigate to a signup or checkout page
      console.log(`Selected plan: ${plan.name}`);
      
      // Simulate a form submission or redirect
      alert(`Thank you for selecting the ${plan.name} plan. You'll be redirected to complete your purchase.`);
    }
  };
  
  return (
    <div className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}>
      {plan.popular && (
        <div className={styles.popularBadge}>Most Popular</div>
      )}
      
      <h3 className={styles.planName}>{plan.name}</h3>
      
      <div className={styles.priceContainer}>
        <span className={styles.currency}>$</span>
        <span className={styles.price}>{plan.price}</span>
        <span className={styles.period}>{plan.period}</span>
      </div>
      
      <ul className={styles.featuresList}>
        {plan.features.map((feature, index) => (
          <li key={index} className={styles.feature}>
            <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <button 
        className={styles.selectButton}
        onClick={handleSelectPlan}
      >
        Get Started
      </button>
    </div>
  );
};

export default PricingCard;
