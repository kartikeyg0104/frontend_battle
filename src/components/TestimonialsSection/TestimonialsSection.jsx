import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
import TestimonialCard from './TestimonialCard';
import PricingCard from './PricingCard';
import styles from './TestimonialsSection.module.css';

const testimonials = [
  {
    id: 1,
    quote: "Working with this team transformed our digital presence completely. The results have exceeded our expectations.",
    author: "Sarah Johnson",
    title: "Marketing Director",
    company: "TechCorp",
    logo: "https://via.placeholder.com/80"
  },
  {
    id: 2,
    quote: "The platform's analytics capabilities have given us insights we never had access to before.",
    author: "Michael Chen",
    title: "CEO",
    company: "Innovate Inc",
    logo: "https://via.placeholder.com/80"
  },
  {
    id: 3,
    quote: "Their approach to user experience design has helped us increase our conversion rates by over 40%.",
    author: "Jessica Miller",
    title: "Product Lead",
    company: "GrowthHub",
    logo: "https://via.placeholder.com/80"
  }
];

const pricingPlans = [
  {
    id: 1,
    name: 'Growth',
    price: 49,
    period: 'per month',
    features: [
      'Up to 5 team members',
      'Basic analytics',
      'Standard support',
      '5GB storage'
    ]
  },
  {
    id: 2,
    name: 'Pro',
    price: 99,
    period: 'per month',
    features: [
      'Up to 15 team members',
      'Advanced analytics',
      'Priority support',
      '25GB storage',
      'API access'
    ],
    popular: true
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 249,
    period: 'per month',
    features: [
      'Unlimited team members',
      'Custom analytics',
      'Dedicated support',
      'Unlimited storage',
      'API access',
      'Custom integrations'
    ]
  }
];

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const carouselRef = useRef(null);
  const titleRef = useRef(null);
  
  // Intersection observers
  const [titleRef2, titleInView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  });
  
  const [pricingRef, pricingInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animate carousel on testimonial change
  useEffect(() => {
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        x: `-${activeTestimonial * 100}%`,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }, [activeTestimonial]);
  
  // Animate title when in view
  useEffect(() => {
    if (titleInView && titleRef2.current) {
      const text = titleRef2.current;
      const chars = text.textContent.split('');
      
      // Clear the text content and set up for animation
      text.textContent = '';
      
      // Create spans for each character
      chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        text.appendChild(span);
      });
      
      // Animate each character
      gsap.to(text.children, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power2.out',
        from: { opacity: 0, y: 20 }
      });
    }
  }, [titleInView]);
  
  // Animate pricing section when in view
  useEffect(() => {
    if (pricingInView) {
      gsap.fromTo(
        `.${styles.pricingSection}`,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );
    }
  }, [pricingInView]);
  
  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <div className={styles.testimonialsHeader}>
          <h2 className={styles.title}>Customer Testimonials</h2>
          <h3 ref={titleRef2} className={styles.subtitle}>Happy Sellers</h3>
        </div>
        
        <div className={styles.testimonialsContainer}>
          <div 
            ref={carouselRef} 
            className={styles.testimonialsCarousel}
            style={{ width: `${testimonials.length * 100}%` }}
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          
          <div className={styles.carouselIndicators}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${activeTestimonial === index ? styles.active : ''}`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
        
        <div ref={pricingRef} className={styles.pricingSection}>
          <div className={styles.pricingHeader}>
            <h2 className={styles.title}>Simple, Transparent Pricing</h2>
            <p className={styles.pricingDescription}>
              Choose the plan that's right for your business
            </p>
            <div className={styles.startingPrice}>
              Starting at <span>${pricingPlans[0].price}</span>/month
            </div>
          </div>
          
          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
