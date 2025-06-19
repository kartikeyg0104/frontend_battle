import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './ProjectShowcase.module.css';

const projects = [
  {
    id: 1,
    number: '01',
    title: 'Digital Transformation',
    tags: ['UX Design', 'Development', 'Strategy'],
    image: 'https://via.placeholder.com/600x400',
    description: 'Complete digital overhaul for a leading financial institution.'
  },
  {
    id: 2,
    number: '02',
    title: 'E-commerce Platform',
    tags: ['Web Design', 'Mobile App', 'Analytics'],
    image: 'https://via.placeholder.com/600x400',
    description: 'Custom shopping experience with advanced recommendation engine.'
  },
  {
    id: 3,
    number: '03',
    title: 'Healthcare Dashboard',
    tags: ['Data Visualization', 'UX Research', 'Development'],
    image: 'https://via.placeholder.com/600x400',
    description: 'Interactive analytics platform for healthcare providers.'
  }
];

const ProjectShowcase = () => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const carouselRef = useRef(null);
  const numberRef = useRef(null);
  
  const nextProject = () => {
    setActiveProjectIndex((prev) => (prev + 1) % projects.length);
  };
  
  const prevProject = () => {
    setActiveProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };
  
  useEffect(() => {
    // Animate carousel slide
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        x: `-${activeProjectIndex * 100}%`,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
    
    // Animate number
    if (numberRef.current) {
      gsap.fromTo(
        numberRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeProjectIndex]);
  
  return (
    <section className={styles.projectShowcase}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div ref={numberRef} className={styles.number}>
            {projects[activeProjectIndex].number}
          </div>
          
          <div className={styles.navigation}>
            <button 
              className={styles.navButton} 
              onClick={prevProject}
              disabled={activeProjectIndex === 0}
            >
              ←
            </button>
            <button 
              className={styles.navButton} 
              onClick={nextProject}
              disabled={activeProjectIndex === projects.length - 1}
            >
              →
            </button>
          </div>
        </div>
        
        <div className={styles.carouselWrapper}>
          <div 
            ref={carouselRef} 
            className={styles.carousel}
            style={{ width: `${projects.length * 100}%` }}
          >
            {projects.map((project) => (
              <div key={project.id} className={styles.project}>
                <div className={styles.projectContent}>
                  <h2 className={styles.projectTitle}>{project.title}</h2>
                  <div className={styles.tags}>
                    {project.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  <p className={styles.projectDescription}>{project.description}</p>
                  <button className={styles.readMoreButton}>READ MORE</button>
                </div>
                <div className={styles.projectImage}>
                  <img src={project.image} alt={project.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.viewAllContainer}>
          <button className={styles.viewAllButton}>VIEW ALL CASES</button>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
