import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
import TestimonialCard from './TestimonialCard';
import PricingCard from './PricingCard';
import styles from './TestimonialsSection.module.css';

// Enhanced testimonial data with higher quality images
const testimonials = [
  {
    id: 1,
    quote: "Working with this team transformed our digital presence completely. The results have exceeded our expectations.",
    author: "Sarah Johnson",
    title: "Marketing Director",
    company: "TechCorp",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-in-a-creative-office-environment-18293-small.mp4"
  },
  {
    id: 2,
    quote: "The platform's analytics capabilities have given us insights we never had access to before.",
    author: "Michael Chen",
    title: "CEO",
    company: "Innovate Inc",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-at-a-desk-4790-small.mp4"
  },
  {
    id: 3,
    quote: "Their approach to user experience design has helped us increase our conversion rates by over 40%.",
    author: "Jessica Miller",
    title: "Product Lead",
    company: "GrowthHub",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-at-her-desk-with-a-laptop-4830-small.mp4"
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
  const [isPaused, setIsPaused] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const carouselRef = useRef(null);
  const titleRef = useRef(null);
  const avatarsRef = useRef(null);
  
  // Intersection observers with improved thresholds
  const [titleRef2, titleInView] = useInView({
    threshold: 0.7, // Higher threshold for more precise triggering
    triggerOnce: true
  });
  
  const [pricingRef, pricingInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });
  
  // Auto-advance testimonials with pause capability
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  // Animate title when in view with text splitting
  useEffect(() => {
    if (titleInView && titleRef2.current) {
      const text = titleRef2.current;
      const content = text.textContent;
      
      // Clear the text content
      text.textContent = '';
      text.style.opacity = 1;
      
      // Create spans for each character with more dramatic styling
      for (let i = 0; i < content.length; i++) {
        const span = document.createElement('span');
        span.textContent = content[i];
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.transform = 'translateY(35px) rotateY(45deg)';
        span.style.transformOrigin = 'center';
        span.style.filter = 'blur(5px)';
        text.appendChild(span);
      }
      
      // Animate each character with staggered timing and 3D effects
      gsap.to(text.children, {
        opacity: 1,
        y: 0,
        rotateY: 0,
        filter: 'blur(0px)',
        stagger: 0.05, 
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.2
      });
    }
  }, [titleInView]);
  
  // Animate carousel on testimonial change with improved easing
  useEffect(() => {
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        x: `-${activeTestimonial * 100}%`,
        duration: 0.9,
        ease: 'power3.out' // More dramatic easing
      });
      
      // Animate current avatar with more dramatic effect
      if (avatarsRef.current) {
        // Reset all avatars
        gsap.set(avatarsRef.current.children, {
          scale: 0.8,
          opacity: 0.5,
          x: 0,
          filter: 'grayscale(100%)'
        });
        
        // Animate active avatar with glow effect
        gsap.to(avatarsRef.current.children[activeTestimonial], {
          scale: 1,
          opacity: 1,
          x: 0,
          filter: 'grayscale(0%) drop-shadow(0 0 8px rgba(58, 134, 255, 0.6))',
          duration: 0.8,
          ease: 'back.out(1.7)'
        });
      }
    }
  }, [activeTestimonial]);
  
  // Animate pricing section when in view with staggered animation
  useEffect(() => {
    if (pricingInView) {
      const tl = gsap.timeline();
      
      // Animate header elements first
      tl.fromTo(
        `.${styles.pricingHeader} > *`,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15,
          ease: 'power3.out' 
        }
      );
      
      // Then animate pricing cards with stagger
      tl.fromTo(
        `.${styles.pricingGrid} > *`,
        { opacity: 0, y: 50, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.7, 
          stagger: 0.15,
          ease: 'back.out(1.4)'
        },
        "-=0.4" // Overlap with previous animation
      );
    }
  }, [pricingInView]);
  
  // Handle carousel hover state
  const handleCarouselHover = (isHovering) => {
    setIsPaused(isHovering);
  };
  
  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <div className={styles.testimonialsHeader}>
          <h2 className={styles.title}>Customer Testimonials</h2>
          <h3 ref={titleRef2} className={styles.subtitle}>Happy Sellers</h3>
        </div>
        
        <div 
          className={styles.testimonialsContainer}
          onMouseEnter={() => handleCarouselHover(true)}
          onMouseLeave={() => handleCarouselHover(false)}
        >
          <div 
            ref={carouselRef} 
            className={styles.testimonialsCarousel}
            style={{ width: `${testimonials.length * 100}%` }}
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          
          {/* Avatar row with enhanced functionality */}
          <div ref={avatarsRef} className={styles.avatarRow}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`${styles.avatar} ${activeTestimonial === index ? styles.active : ''}`}
                onClick={() => {
                  setActiveTestimonial(index);
                  if (activeTestimonial === index) {
                    setActiveVideo(testimonial.id);
                  }
                }}
              >
                <div className={styles.avatarInner}>
                  <img src={testimonial.avatar} alt={testimonial.author} />
                  {activeTestimonial === index && (
                    <div className={styles.watchVideo} onClick={() => setActiveVideo(testimonial.id)}>
                      <span className={styles.watchIcon}>▶</span>
                    </div>
                  )}
                </div>
              </div>
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
      
      {/* Testimonial video modal */}
      {activeVideo && (
        <div 
          className={styles.videoModal} 
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className={styles.videoContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.closeVideo}
              onClick={() => setActiveVideo(null)}
            >
              ×
            </button>
            <div className={styles.videoHeader}>
              <h3>{testimonials.find(t => t.id === activeVideo)?.author}</h3>
              <p>{testimonials.find(t => t.id === activeVideo)?.title} at {testimonials.find(t => t.id === activeVideo)?.company}</p>
            </div>
            <video 
              autoPlay 
              controls 
              className={styles.testimonialVideo}
            >
              <source 
                src={testimonials.find(t => t.id === activeVideo)?.video} 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
