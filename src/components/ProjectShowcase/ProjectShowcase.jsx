import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './ProjectShowcase.module.css';

const projects = [
	{
		id: 1,
		number: '01',
		title: 'Digital Transformation',
		tags: ['UX Design', 'Development', 'Strategy'],
		image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
		description: 'Complete digital overhaul for a leading financial institution.',
		video: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-and-touching-the-screen-691-small.mp4'
	},
	{
		id: 2,
		number: '02',
		title: 'E-commerce Platform',
		tags: ['Web Design', 'Mobile App', 'Analytics'],
		image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
		description: 'Custom shopping experience with advanced recommendation engine.',
		video: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-shopping-online-on-her-smartphone-9496-small.mp4'
	},
	{
		id: 3,
		number: '03',
		title: 'Healthcare Dashboard',
		tags: ['Data Visualization', 'UX Research', 'Development'],
		image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
		description: 'Interactive analytics platform for healthcare providers.',
		video: 'https://assets.mixkit.co/videos/preview/mixkit-medical-elements-against-a-blue-background-34304-small.mp4'
	},
];

const ProjectShowcase = () => {
	const [activeProjectIndex, setActiveProjectIndex] = useState(0);
	const [showVideo, setShowVideo] = useState(null);
	const carouselRef = useRef(null);
	const numberRef = useRef(null);

	const nextProject = () => {
		setActiveProjectIndex((prev) => (prev + 1) % projects.length);
	};

	const prevProject = () => {
		setActiveProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
	};

	useEffect(() => {
		// Animate carousel slide with enhanced easing and flash effect
		if (carouselRef.current) {
			// First slightly blur content
			gsap.to(carouselRef.current, {
				filter: 'blur(5px)',
				duration: 0.2,
				ease: 'power1.in',
				onComplete: () => {
					// Then slide with improved easing
					gsap.to(carouselRef.current, {
						x: `-${activeProjectIndex * 100}%`,
						filter: 'blur(0px)',
						duration: 1,
						ease: 'power3.out',
					});
				},
			});
		}

		// Animate number with more dramatic effect
		if (numberRef.current) {
			// First clear current number
			gsap.to(numberRef.current, {
				opacity: 0,
				y: -30,
				scale: 0.8,
				duration: 0.3,
				ease: 'power2.in',
				onComplete: () => {
					// Update number content
					numberRef.current.textContent = projects[activeProjectIndex].number;

					// Then animate number back in with dramatic effect
					gsap.to(numberRef.current, {
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.7,
						ease: 'elastic.out(1, 0.5)',
					});
				},
			});
		}

		// Animate project content elements with staggered appearance
		const projectContent = document.querySelector(`.${styles.project}:nth-child(${activeProjectIndex + 1}) .${styles.projectContent}`);
		if (projectContent) {
			const elements = [
				projectContent.querySelector(`.${styles.projectTitle}`),
				projectContent.querySelector(`.${styles.tags}`),
				projectContent.querySelector(`.${styles.projectDescription}`),
				projectContent.querySelector(`.${styles.readMoreButton}`),
			];

			gsap.fromTo(
				elements,
				{
					opacity: 0,
					y: 30,
					filter: 'blur(10px)',
				},
				{
					opacity: 1,
					y: 0,
					filter: 'blur(0px)',
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
					delay: 0.3,
				},
			);
		}

		// Animate project image with zoom effect
		const projectImage = document.querySelector(`.${styles.project}:nth-child(${activeProjectIndex + 1}) .${styles.projectImage} img`);
		if (projectImage) {
			gsap.fromTo(
				projectImage,
				{ scale: 1.1, opacity: 0.7 },
				{ scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
			);
		}
	}, [activeProjectIndex, projects]);

	// Add view all functionality
	const handleViewAll = () => {
		// Create a simple "All Cases" view - could redirect to a dedicated page in a real app
		alert("View all projects functionality would navigate to a comprehensive project gallery.");
		
		// For a more sophisticated approach, you could use React Router:
		// history.push('/projects');
	};
	
	// Enhance video modal with keyboard navigation
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape' && showVideo) {
				setShowVideo(null);
			}
		};
		
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [showVideo]);

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
											<span key={index} className={styles.tag}>
												{tag}
											</span>
										))}
									</div>
									<p className={styles.projectDescription}>{project.description}</p>
									<button
										className={styles.readMoreButton}
										onClick={() => setShowVideo(project.id)}
									>
										WATCH DEMO
									</button>
								</div>
								<div
									className={styles.projectImage}
									onClick={() => setShowVideo(project.id)}
								>
									<div className={styles.playOverlay}>
										<div className={styles.playIcon}>▶</div>
									</div>
									<img src={project.image} alt={project.title} />
								</div>
							</div>
						))}
					</div>
				</div>

				<div className={styles.viewAllContainer}>
					<button 
						className={styles.viewAllButton}
						onClick={handleViewAll}
					>
						VIEW ALL CASES
					</button>
				</div>
			</div>

			{/* Project video modal */}
			{showVideo && (
				<div
					className={styles.videoModal}
					onClick={() => setShowVideo(null)}
				>
					<div
						className={styles.videoContainer}
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className={styles.closeVideo}
							onClick={() => setShowVideo(null)}
						>
							×
						</button>
						<video
							autoPlay
							controls
							className={styles.projectVideo}
						>
							<source
								src={projects.find((p) => p.id === showVideo)?.video}
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

export default ProjectShowcase;
