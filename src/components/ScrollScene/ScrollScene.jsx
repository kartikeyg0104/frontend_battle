import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, CameraShake } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import styles from './ScrollScene.module.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Track point class for creating a smooth camera path
class TrackPoint {
  constructor(position, lookAt, fov = 50) {
    this.position = position;
    this.lookAt = lookAt;
    this.fov = fov;
  }
}

// 3D Scene component with camera track
const Scene = ({ scrollProgress }) => {
  const cameraRef = useRef();
  const trackRef = useRef();
  const particlesRef = useRef();
  
  // Create camera track points - similar to effortel's journey
  const trackPoints = [
    new TrackPoint(new THREE.Vector3(0, 1, 5), new THREE.Vector3(0, 0, 0), 50),
    new TrackPoint(new THREE.Vector3(3, 1, 2), new THREE.Vector3(0, 0, 0), 45),
    new TrackPoint(new THREE.Vector3(0, 1, -1), new THREE.Vector3(2, 0, -3), 40),
    new TrackPoint(new THREE.Vector3(-3, 2, -3), new THREE.Vector3(0, 0, -8), 35),
    new TrackPoint(new THREE.Vector3(0, 3, -8), new THREE.Vector3(0, 0, -15), 30),
  ];
  
  // Create a smooth curve from track points
  useEffect(() => {
    if (trackRef.current) {
      const points = trackPoints.map(point => point.position);
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
      
      // Visualize the track (optional, can be removed in production)
      trackRef.current.geometry = geometry;
    }
    
    // Create floating particles
    if (particlesRef.current) {
      const particleCount = 500;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        // Random position in a sphere
        const radius = 15 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Blue color palette
        colors[i * 3] = 0.2 + Math.random() * 0.2;      // r
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;  // g
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;  // b
        
        // Random sizes
        sizes[i] = Math.random() * 1.5;
      }
      
      particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particlesRef.current.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    }
  }, []);
  
  // Update camera position based on scroll
  useFrame(() => {
    if (cameraRef.current && scrollProgress !== undefined) {
      // Calculate which segment of the track we're on
      const segments = trackPoints.length - 1;
      const segmentProgress = Math.min(scrollProgress * segments, segments);
      const segment = Math.floor(segmentProgress);
      const segmentFraction = segmentProgress - segment;
      
      // Interpolate between track points
      const start = trackPoints[segment];
      const end = trackPoints[Math.min(segment + 1, trackPoints.length - 1)];
      
      // Set camera position
      cameraRef.current.position.lerpVectors(start.position, end.position, segmentFraction);
      
      // Set look at target
      const lookAtVec = new THREE.Vector3();
      lookAtVec.lerpVectors(start.lookAt, end.lookAt, segmentFraction);
      cameraRef.current.lookAt(lookAtVec);
      
      // Animate FOV
      cameraRef.current.fov = THREE.MathUtils.lerp(start.fov, end.fov, segmentFraction);
      cameraRef.current.updateProjectionMatrix();
      
      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005;
        particlesRef.current.rotation.x += 0.0002;
      }
    }
  });
  
  return (
    <>
      <PerspectiveCamera 
        ref={cameraRef} 
        makeDefault 
        position={[0, 1, 5]} 
        fov={50}
        near={0.1}
        far={100}
      />
      
      <CameraShake 
        maxYaw={0.01} 
        maxPitch={0.01} 
        maxRoll={0.01} 
        yawFrequency={0.5} 
        pitchFrequency={0.4} 
        rollFrequency={0.3} 
      />
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.2} color="#3a86ff" />
      
      {/* Glowing track similar to effortel */}
      <line ref={trackRef}>
        <lineBasicMaterial attach="material" color="#3a86ff" linewidth={1} />
      </line>
      
      {/* Grid to add depth */}
      <gridHelper 
        args={[40, 40, '#1a1a2e', '#1a1a2e']} 
        position={[0, -2, 0]} 
        rotation={[0, 0, 0]} 
      />
      
      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry />
        <pointsMaterial 
          attach="material" 
          vertexColors 
          size={0.1} 
          sizeAttenuation={true} 
          transparent={true} 
          alphaTest={0.01}
          opacity={0.8}
        />
      </points>
      
      {/* 3D objects along the path */}
      <group position={[2, 0, -3]}>
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial 
            color="#3a86ff" 
            metalness={0.8} 
            roughness={0.2} 
            emissive="#3a86ff"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
      
      <group position={[-2, 1, -6]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color="#ff006e" 
            metalness={0.8} 
            roughness={0.2} 
            emissive="#ff006e"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
      
      <group position={[0, 0, -12]}>
        <mesh rotation={[Math.PI/4, Math.PI/4, 0]}>
          <torusGeometry args={[1.5, 0.5, 16, 32]} />
          <meshStandardMaterial 
            color="#ffbe0b" 
            metalness={0.8} 
            roughness={0.2} 
            emissive="#ffbe0b"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </>
  );
};

const ScrollScene = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const { top, height } = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress (0 to 1)
        const progress = Math.min(Math.max((-top) / (height - windowHeight), 0), 1);
        setScrollProgress(progress);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Animate content cards on scroll
  useEffect(() => {
    const contentContainer = document.querySelector(`.${styles.contentContainer}`);
    if (!contentContainer) return;
    
    // Animate play button
    const playButton = document.querySelector(`.${styles.playButton}`);
    gsap.fromTo(
      playButton,
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: playButton,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Animate content cards with staggered effect
    const cards = document.querySelectorAll(`.${styles.card}`);
    gsap.fromTo(
      cards,
      { 
        y: 100, 
        opacity: 0,
        rotationX: 20,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentContainer,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);
  
  // Enhanced modal with keyboard and focus controls
  useEffect(() => {
    if (showModal) {
      // Disable background scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus on the close button for accessibility
      const closeButton = document.querySelector(`.${styles.closeButton}`);
      if (closeButton) setTimeout(() => closeButton.focus(), 100);
      
      // Add keyboard navigation
      const handleKeydown = (e) => {
        if (e.key === 'Escape') setShowModal(false);
      };
      
      window.addEventListener('keydown', handleKeydown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeydown);
      };
    }
  }, [showModal]);
  
  // Enhanced play button interaction
  const handlePlayClick = () => {
    // Add button press animation
    gsap.timeline()
      .to(`.${styles.playButton}`, {
        scale: 0.95,
        duration: 0.1
      })
      .to(`.${styles.playButton}`, {
        scale: 1,
        duration: 0.3,
        ease: 'elastic.out(1.2, 0.5)'
      });
    
    // Show the video modal
    setShowModal(true);
  };
  
  return (
    <section ref={sectionRef} className={styles.scrollScene}>
      <div className={styles.canvasContainer}>
        <Canvas 
          className={styles.canvas}
          linear
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance" 
          }}
        >
          <Scene scrollProgress={scrollProgress} />
        </Canvas>
      </div>
      
      <div className={styles.contentContainer}>
        <div className={styles.videoSection}>
          <button 
            className={styles.playButton}
            onClick={handlePlayClick}
            aria-label="Play video reel"
          >
            <span className={styles.playIcon}>▶</span>
            <span className={styles.playText}>PLAY REEL</span>
          </button>
        </div>
        
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <h3>Interactive Experiences</h3>
            <p>Our 3D visualization technologies create immersive digital experiences that engage and inspire your audience.</p>
          </div>
          
          <div className={styles.card}>
            <h3>Creative Solutions</h3>
            <p>Combining cutting-edge technology with creative design to deliver unique solutions that stand out in the digital landscape.</p>
          </div>
        </div>
      </div>
      
      {showModal && (
        <div className={styles.videoModal} onClick={() => setShowModal(false)}>
          <div className={styles.videoWrapper} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>
              ×
            </button>
            <div className={styles.video}>
              {/* Enhanced video player with multiple sources for better compatibility */}
              <video
                autoPlay
                controls
                className={styles.fullVideo}
                onError={(e) => {
                  // If HTML5 video fails, fallback to iframe
                  e.target.style.display = 'none';
                  document.getElementById('videoIframe').style.display = 'block';
                }}
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-futuristic-3d-structure-48592-large.mp4" type="video/mp4" />
                <source src="https://assets.mixkit.co/videos/preview/mixkit-touring-a-city-in-3d-from-above-48592-large.mp4" type="video/mp4" />
              </video>
              
              {/* Fallback to YouTube embed if HTML5 video fails */}
              <iframe
                id="videoIframe"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/nS3M0t8Z9WQ?autoplay=1"
                title="Demo Reel"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, display: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ScrollScene;