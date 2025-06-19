import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import styles from './RippleBackground.module.css';

// Simplified shader material that doesn't rely as heavily on Three.js imports
const RippleMaterial = () => {
  const materialRef = useRef();
  const mouse = useRef([0, 0]);
  const lastMouse = useRef([0, 0]);
  const lastTime = useRef(0);
  const ripples = useRef([]);
  const [error, setError] = useState(false);
  
  // Create shader uniforms
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: [window.innerWidth, window.innerHeight] },
      u_mouse: { value: [0, 0] },
      u_ripples: { value: [] }
    }),
    []
  );
  
  // Update mouse position on canvas
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize coordinates to -1 to 1
      mouse.current[0] = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current[1] = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Update window size
  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.u_resolution.value[0] = window.innerWidth;
        materialRef.current.uniforms.u_resolution.value[1] = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animation frame updates
  useFrame((state) => {
    try {
      const time = state.clock.getElapsedTime();
      
      // Update time uniform
      if (materialRef.current) {
        materialRef.current.uniforms.u_time.value = time;
      }
      
      // Calculate mouse velocity for new ripples
      const mouseVelocity = Math.sqrt(
        Math.pow(mouse.current[0] - lastMouse.current[0], 2) +
        Math.pow(mouse.current[1] - lastMouse.current[1], 2)
      );
      
      // Add new ripple when mouse moves fast enough
      if (mouseVelocity > 0.01 && time - lastTime.current > 0.1) {
        ripples.current.push({
          position: [mouse.current[0], mouse.current[1]],
          strength: Math.min(mouseVelocity * 5, 1.0),
          time
        });
        
        lastTime.current = time;
      }
      
      // Filter out old ripples and update uniforms
      ripples.current = ripples.current.filter(ripple => time - ripple.time < 2.0);
      
      if (materialRef.current) {
        materialRef.current.uniforms.u_ripples.value = ripples.current;
        materialRef.current.uniforms.u_mouse.value = mouse.current;
      }
      
      lastMouse.current[0] = mouse.current[0];
      lastMouse.current[1] = mouse.current[1];
    } catch (err) {
      console.error("Error in animation frame:", err);
      setError(true);
    }
  });
  
  // Fragment shader for ripple effect
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      vec3 color1 = vec3(0.1, 0.1, 0.2); // Dark blue background
      vec3 color2 = vec3(0.23, 0.52, 1.0); // Light blue (primary color)
      vec3 color3 = vec3(1.0, 0.0, 0.43); // Pink (secondary color)
      
      // Base gradient
      vec3 color = mix(color1, color2, uv.y);
      
      // Simple ripple effect from mouse position
      float dist = distance(uv, vec2(u_mouse.x * 0.5 + 0.5, u_mouse.y * 0.5 + 0.5));
      float ripple = sin(dist * 30.0 - u_time * 10.0) * 0.5 + 0.5;
      ripple *= smoothstep(0.5, 0.0, dist);
      
      // Apply ripple to color
      color = mix(color, color3, ripple * 0.3);
      
      // Add some subtle noise
      float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      color += noise * 0.02;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  
  // Vertex shader
  const vertexShader = `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  if (error) {
    return null; // Don't render anything if there was an error
  }
  
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const RippleBackground = () => {
  const [hasError, setHasError] = useState(false);
  
  // Error boundary for the canvas
  const handleError = (error) => {
    console.error("Error in RippleBackground:", error);
    setHasError(true);
  };
  
  if (hasError) {
    return (
      <div className={styles.fallbackBackground}>
        <div className={styles.gradientOverlay}></div>
      </div>
    );
  }
  
  return (
    <div className={styles.rippleBackground}>
      <Canvas onCreated={({ gl }) => {
        gl.setClearColor(0x121218, 1);
      }}>
        <ErrorBoundary onError={handleError}>
          <RippleMaterial />
        </ErrorBoundary>
      </Canvas>
    </div>
  );
};

// Simple error boundary component
const ErrorBoundary = ({ children, onError }) => {
  useEffect(() => {
    return () => {
      // Cleanup if component unmounts due to error
      console.log("ErrorBoundary cleanup");
    };
  }, []);
  
  try {
    return children;
  } catch (error) {
    onError(error);
    return null;
  }
};

export default RippleBackground;
