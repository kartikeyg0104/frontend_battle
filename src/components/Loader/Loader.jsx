import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import styles from './Loader.module.css';

// Enhanced 3D scene with distortion effects
const LoaderScene = () => {
  const cylinderRef = useRef();
  const blockRef = useRef();
  const sphereRef = useRef();
  const lightRef = useRef();
  
  // Initial setup for sphere with improved animation
  useEffect(() => {
    if (sphereRef.current) {
      // Initialize with scale 0 and position away from center
      sphereRef.current.scale.set(0, 0, 0);
      sphereRef.current.position.set(-3, 0, 0);
      
      // Animate scale and position with better easing
      gsap.to(sphereRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2.2,
        delay: 0.3,
        ease: "elastic.out(1.1, 0.3)"
      });
      
      gsap.to(sphereRef.current.position, {
        x: -1,
        duration: 2,
        delay: 0.3,
        ease: "power2.out"
      });
    }
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Add wave distortion effect to all objects
    if (cylinderRef.current) {
      cylinderRef.current.rotation.y += 0.02; 
      cylinderRef.current.position.y = Math.sin(time * 0.8) * 0.5;
      cylinderRef.current.rotation.z = Math.sin(time * 0.4) * 0.2;
      cylinderRef.current.material.emissive.r = Math.sin(time) * 0.5 + 0.5;
      cylinderRef.current.material.emissive.b = Math.cos(time * 0.5) * 0.3 + 0.7;
      
      // Add size pulsing
      cylinderRef.current.scale.x = cylinderRef.current.scale.z = 1 + Math.sin(time * 2) * 0.1;
      
      // Add wave distortion effect
      const waveX = Math.sin(time * 0.8) * 0.1;
      const waveY = Math.cos(time * 0.6) * 0.1;
      
      for (let i = 0; i < cylinderRef.current.geometry.attributes.position.count; i++) {
        const x = cylinderRef.current.geometry.attributes.position.getX(i);
        const y = cylinderRef.current.geometry.attributes.position.getY(i);
        const z = cylinderRef.current.geometry.attributes.position.getZ(i);
        
        const wave = Math.sin(x * 5 + time * 2) * 0.05;
        
        cylinderRef.current.geometry.attributes.position.setZ(i, z + wave);
      }
      
      cylinderRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (blockRef.current) {
      blockRef.current.rotation.x += 0.01;
      blockRef.current.rotation.y += 0.008;
      blockRef.current.position.x = Math.cos(time * 0.7) * 1.2;
      blockRef.current.position.z = Math.sin(time * 0.6) * 0.8;
      
      // Add scale pulse and color shift
      blockRef.current.scale.x = blockRef.current.scale.y = blockRef.current.scale.z = 
        1 + Math.sin(time * 3) * 0.1;
      
      // Change material hue based on time
      if (blockRef.current.material) {
        const hue = (time * 0.05) % 1;
        blockRef.current.material.color.setHSL(hue, 0.8, 0.5);
      }
    }
    
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.cos(time * 0.5) * 0.8;
      sphereRef.current.position.x = Math.sin(time * 0.4) * 1;
      
      // More complex rotation
      sphereRef.current.rotation.y += 0.01;
      sphereRef.current.rotation.x += 0.005;
      sphereRef.current.rotation.z += 0.003;
      
      // Distortion effect animation
      if (sphereRef.current.material && sphereRef.current.material.distort !== undefined) {
        sphereRef.current.material.distort = 0.3 + Math.sin(time * 2) * 0.2;
      }
    }
    
    // Animate light intensity and color for more dynamic lighting
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(time * 2) * 0.4;
      
      // Change light color
      const r = 0.8 + Math.sin(time * 0.7) * 0.2;
      const g = 0.8 + Math.sin(time * 0.5 + 2) * 0.2;
      const b = 0.8 + Math.sin(time * 0.3 + 4) * 0.2;
      lightRef.current.color.setRGB(r, g, b);
    }
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 3, 10]} />
      
      {/* Enhanced lighting for better 3D effect */}
      <ambientLight intensity={0.3} />
      <spotLight 
        position={[5, 5, 5]} 
        angle={0.3} 
        penumbra={0.8} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3a86ff" />
      
      {/* White cylinder with more complex geometry */}
      <mesh ref={cylinderRef} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 2, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          emissive="#3a86ff"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Blue block with enhanced reflections */}
      <mesh ref={blockRef} position={[1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshPhysicalMaterial 
          color="#3a86ff" 
          metalness={0.9}
          roughness={0.05}
          clearcoat={0.8}
          transmission={0.2}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Animated sphere with enhanced distortion */}
      <mesh ref={sphereRef} position={[-1, 0, 0]}>
        <Sphere args={[0.6, 64, 64]}>
          <MeshDistortMaterial 
            color="#ff006e" 
            speed={2.5}
            distort={0.6}
            envMapIntensity={1.5}
            clearcoat={1}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      </mesh>
      
      <Environment preset="city" />
    </>
  );
};

const Loader = ({ isLoaded }) => {
  const [animationStage, setAnimationStage] = useState('initial');
  const loaderRef = useRef(null);
  const rectangleRef = useRef(null);
  const segmentRef = useRef(null);

  useEffect(() => {
    // Initial animation with more dramatic reveal
    if (animationStage === 'initial') {
      // Create a diagonal wipe effect first
      gsap.set(rectangleRef.current, {
        clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)'
      });
      
      gsap.to(rectangleRef.current, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.2,
        ease: 'power3.inOut'
      });
      
      // Then animate the segment
      gsap.to(segmentRef.current, {
        width: '100%',
        duration: 1.2,
        delay: 0.3,
        ease: 'power2.inOut'
      });
      
      // Transform to L-shape with more visual interest
      const tl = gsap.timeline({
        delay: 1.6,
        onComplete: () => setAnimationStage('l-shape')
      });
      
      tl.to(rectangleRef.current, {
        duration: 0.7,
        width: '30%',
        height: '40px',
        borderRadius: '5px',
        ease: 'power3.inOut'
      })
      .to(rectangleRef.current, {
        duration: 0.6,
        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%)',
        boxShadow: '0 0 30px rgba(58, 134, 255, 0.6)',
        ease: 'power2.inOut'
      });
    }
    
    // L-shape to 3D transition with more flair
    if (animationStage === 'l-shape') {
      gsap.to(rectangleRef.current, {
        boxShadow: '0 0 50px rgba(58, 134, 255, 0.8), 0 0 100px rgba(255, 0, 110, 0.4)',
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(rectangleRef.current, {
            duration: 0.8,
            opacity: 0,
            scale: 1.5,
            rotate: 45,
            filter: 'blur(10px)',
            ease: 'power3.inOut',
            onComplete: () => setAnimationStage('3d-anim')
          });
        }
      });
    }
    
    // Exit animation with page transition effect
    if (isLoaded && animationStage === '3d-anim') {
      const delay = 1.8;
      
      // Zoom and flash effect before fading
      gsap.to(loaderRef.current, {
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        duration: 0.3,
        delay: delay - 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Flash to white then fade out
          gsap.to(loaderRef.current, {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            duration: 0.1,
            ease: 'power4.in',
            onComplete: () => {
              gsap.to(loaderRef.current, {
                duration: 0.8,
                opacity: 0,
                ease: 'power3.out',
                onComplete: () => setAnimationStage('hidden')
              });
            }
          });
        }
      });
    }
  }, [animationStage, isLoaded]);

  if (animationStage === 'hidden') return null;

  return (
    <div ref={loaderRef} className={styles.loaderContainer} style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.9)), url('https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {animationStage === 'initial' || animationStage === 'l-shape' ? (
        <div ref={rectangleRef} className={styles.rectangle}>
          <div ref={segmentRef} className={styles.segment}></div>
        </div>
      ) : (
        <Canvas className={styles.canvas} dpr={[1, 2]}>
          <LoaderScene />
        </Canvas>
      )}
    </div>
  );
};

export default Loader;
