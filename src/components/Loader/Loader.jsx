import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import styles from './Loader.module.css';

// Enhanced 3D scene for loader
const LoaderScene = () => {
  const cylinderRef = useRef();
  const blockRef = useRef();
  const sphereRef = useRef();
  
  // Initial setup for sphere
  useEffect(() => {
    if (sphereRef.current) {
      // Start with scale 0
      sphereRef.current.scale.set(0, 0, 0);
      
      // Animate scale with GSAP instead of react-spring
      gsap.to(sphereRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        delay: 0.5,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }, []);
  
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // More complex animations for existing objects
    if (cylinderRef.current) {
      cylinderRef.current.rotation.y += 0.01;
      cylinderRef.current.position.y = Math.sin(time) * 0.5;
      cylinderRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;
      cylinderRef.current.material.emissive.r = Math.sin(time) * 0.5 + 0.5;
    }
    
    if (blockRef.current) {
      blockRef.current.rotation.x += 0.005;
      blockRef.current.rotation.y += 0.003;
      blockRef.current.position.x = Math.cos(time) * 0.8;
      blockRef.current.position.z = Math.sin(time * 0.8) * 0.5;
    }
    
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.cos(time * 0.7) * 0.6;
      sphereRef.current.position.x = Math.sin(time * 0.5) * 0.7;
    }
  });

  return (
    <>
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 4, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3a86ff" />
      
      {/* White cylinder with glow */}
      <mesh ref={cylinderRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#3a86ff"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      
      {/* Blue block with reflections */}
      <mesh ref={blockRef} position={[1, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color="#3a86ff" 
          metalness={0.8}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Animated sphere with distortion - no longer using animated.mesh */}
      <mesh 
        ref={sphereRef} 
        position={[-1, 0, 0]}
      >
        <Sphere args={[0.6, 32, 32]}>
          <MeshDistortMaterial 
            color="#ff006e" 
            speed={2} 
            distort={0.3} 
            envMapIntensity={0.8}
          />
        </Sphere>
      </mesh>
      
      {/* Adding environment for reflections */}
      <Environment preset="city" />
    </>
  );
};

const Loader = ({ isLoaded }) => {
  const [animationStage, setAnimationStage] = useState('initial');
  const loaderRef = useRef(null);
  const rectangleRef = useRef(null);

  useEffect(() => {
    // Initial animation - rectangle to L-shape
    if (animationStage === 'initial') {
      const tl = gsap.timeline({
        onComplete: () => setAnimationStage('l-shape')
      });
      
      tl.to(rectangleRef.current, {
        duration: 0.8,
        width: '30%',
        height: '40px',
        ease: 'power2.inOut'
      })
      .to(rectangleRef.current, {
        duration: 0.6,
        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%)', 
        ease: 'power2.inOut'
      });
    }
    
    // L-shape to 3D animation
    if (animationStage === 'l-shape') {
      gsap.to(rectangleRef.current, {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.inOut',
        onComplete: () => setAnimationStage('3d-anim')
      });
    }
    
    // Fade out when content is loaded
    if (isLoaded && animationStage === '3d-anim') {
      gsap.to(loaderRef.current, {
        duration: 0.8,
        opacity: 0,
        ease: 'power2.inOut',
        onComplete: () => setAnimationStage('hidden')
      });
    }
  }, [animationStage, isLoaded]);

  if (animationStage === 'hidden') return null;

  return (
    <div ref={loaderRef} className={styles.loaderContainer}>
      {animationStage === 'initial' || animationStage === 'l-shape' ? (
        <div ref={rectangleRef} className={styles.rectangle}>
          <div className={styles.segment}></div>
        </div>
      ) : (
        <Canvas className={styles.canvas}>
          <LoaderScene />
        </Canvas>
      )}
    </div>
  );
};

export default Loader;
