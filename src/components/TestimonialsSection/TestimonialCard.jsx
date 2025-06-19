import styles from './TestimonialCard.module.css';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.quoteContainer}>
        <svg className={styles.quoteIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H8C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7V15C10 16.0609 9.57857 17.0783 8.82843 17.8284C8.07828 18.5786 7.06087 19 6 19H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 11H15C14.4696 11 13.9609 10.7893 13.5858 10.4142C13.2107 10.0391 13 9.53043 13 9V7C13 6.46957 13.2107 5.96086 13.5858 5.58579C13.9609 5.21071 14.4696 5 15 5H17C17.5304 5 18.0391 5.21071 18.4142 5.58579C18.7893 5.96086 19 6.46957 19 7V15C19 16.0609 18.5786 17.0783 17.8284 17.8284C17.0783 18.5786 16.0609 19 15 19H14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <p className={styles.quote}>{testimonial.quote}</p>
      </div>
      
      <div className={styles.authorContainer}>
        <div className={styles.authorInfo}>
          <div className={styles.author}>{testimonial.author}</div>
          <div className={styles.title}>{testimonial.title}</div>
          <div className={styles.company}>{testimonial.company}</div>
        </div>
        
        <div className={styles.logoContainer}>
          <img src={testimonial.logo} alt={testimonial.company} className={styles.logo} />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
