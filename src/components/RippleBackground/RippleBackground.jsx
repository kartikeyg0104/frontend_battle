import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import styles from './RippleBackground.module.css';

// Improved shader material with effortel-style wave effects
const RippleMaterial = () => {
  const materialRef = useRef();
  const mouse = useRef([0, 0]);
  const lastMouse = useRef([0, 0]);
  const mouseVelocity = useRef([0, 0]);
  const mouseClicks = useRef([]);
  const [error, setError] = useState(false);
  
  // Create shader uniforms
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: [window.innerWidth, window.innerHeight] },
      u_mouse: { value: [0, 0] },
      u_mouseVelocity: { value: [0, 0] },
      u_clicks: { value: [] },
      u_clickCount: { value: 0 }
    }),
    []
  );
  
  // Update mouse position with smoother tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize coordinates to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Apply easing for smoother transitions
      mouse.current[0] += (x - mouse.current[0]) * 0.1;
      mouse.current[1] += (y - mouse.current[1]) * 0.1;
    };
    
    const handleClick = (e) => {
      // Add click position for ripple effect
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      mouseClicks.current.push({
        position: [x, y],
        time: performance.now() / 1000,
        strength: 1.0
      });
      
      // Limit array size
      if (mouseClicks.current.length > 10) {
        mouseClicks.current.shift();
      }
      
      if (materialRef.current) {
        materialRef.current.uniforms.u_clickCount.value = mouseClicks.current.length;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);
  
  // Update window size
  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.u_resolution.value = [window.innerWidth, window.innerHeight];
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
      
      // Calculate mouse velocity
      mouseVelocity.current[0] = mouse.current[0] - lastMouse.current[0];
      mouseVelocity.current[1] = mouse.current[1] - lastMouse.current[1];
      
      // Update uniforms
      if (materialRef.current) {
        materialRef.current.uniforms.u_mouse.value = mouse.current;
        materialRef.current.uniforms.u_mouseVelocity.value = mouseVelocity.current;
        
        // Update clicks array with fading strength
        const currentTime = performance.now() / 1000;
        const updatedClicks = mouseClicks.current
          .map(click => {
            const age = currentTime - click.time;
            return {
              position: click.position,
              time: click.time,
              strength: Math.max(0, 1.0 - age * 0.3) // Fade over ~3 seconds
            };
          })
          .filter(click => click.strength > 0);
        
        mouseClicks.current = updatedClicks;
        materialRef.current.uniforms.u_clicks.value = updatedClicks;
      }
      
      lastMouse.current[0] = mouse.current[0];
      lastMouse.current[1] = mouse.current[1];
    } catch (err) {
      console.error("Error in animation frame:", err);
      setError(true);
    }
  });
  
  // Enhanced fragment shader for effortel-style ripples and grid effects
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform vec2 u_mouseVelocity;
    uniform float u_clickCount;
    uniform sampler2D u_clicks[10]; // Max 10 click ripples
    
    varying vec2 vUv;
    
    // Improved noise function
    float noise(vec2 p) {
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      
      float res = mix(
        mix(dot(hash(ip), u),
            dot(hash(ip+vec2(1.0,0.0)), u-vec2(1.0,0.0)), u.x),
        mix(dot(hash(ip+vec2(0.0,1.0)), u-vec2(0.0,1.0)),
            dot(hash(ip+vec2(1.0,1.0)), u-vec2(1.0,1.0)), u.x), u.y);
      return res*res;
    }
    
    vec3 hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
      p3 += dot(p3, p3.yxz+33.33);
      return fract((p3.xxy+p3.yzz)*p3.zyx);
    }
    
    // Grid effect like effortel.com
    float grid(vec2 uv, float size) {
      vec2 grid = fract(uv * size);
      float line = max(
        smoothstep(0.95, 1.0, grid.x) + smoothstep(0.0, 0.05, grid.x),
        smoothstep(0.95, 1.0, grid.y) + smoothstep(0.0, 0.05, grid.y)
      );
      return line * 0.5;
    }
    
    void main() {
      // Normalized coordinates centered at 0
      vec2 uv = vUv * 2.0 - 1.0;
      uv.x *= u_resolution.x / u_resolution.y; // Correct aspect ratio
      
      // Base colors - dark blue theme like effortel
      vec3 color1 = vec3(0.05, 0.07, 0.15); // Dark blue
      vec3 color2 = vec3(0.15, 0.25, 0.45); // Medium blue
      vec3 color3 = vec3(0.1, 0.5, 1.0);    // Bright blue highlight
      
      // Create dynamic gradient background
      float noise1 = noise(uv * 2.0 + u_time * 0.1) * 0.2;
      float noise2 = noise(uv * 4.0 - u_time * 0.05) * 0.15;
      float gradientNoise = noise1 + noise2;
      
      // Radial gradient from center
      float radial = length(uv) * 0.5;
      vec3 color = mix(color2, color1, radial + gradientNoise);
      
      // Add subtle grid pattern like effortel
      float gridPattern = grid(uv, 30.0) * (0.03 + 0.02 * sin(u_time * 0.2));
      color += vec3(0.1, 0.3, 0.5) * gridPattern;
      
      // Mouse trail effect
      float mouseDistance = length(uv - vec2(u_mouse.x * u_resolution.x / u_resolution.y, u_mouse.y)) * 2.0;
      float mouseInfluence = 0.3 / (mouseDistance + 0.1);
      
      // Create ripple wave from mouse movement
      float mouseTail = sin(mouseDistance * 10.0 - u_time * 5.0) * mouseInfluence * length(u_mouseVelocity) * 3.0;
      color += color3 * mouseTail * 0.3;
      
      // Add click ripples
      for (int i = 0; i < 10; i++) {
        if (i >= int(u_clickCount)) break;
        
        // Get click data
        vec2 clickPos = u_clicks[i].position;
        float clickTime = u_clicks[i].time;
        float clickStrength = u_clicks[i].strength;
        
        // Calculate elapsed time since click
        float timeSinceClick = u_time - clickTime;
        
        // Expanding ring effect
        float ringRadius = timeSinceClick * 0.7; // Speed of expansion
        float ringWidth = 0.05;
        float ringDistance = abs(length(uv - clickPos) - ringRadius);
        float ringMask = (1.0 - smoothstep(0.0, ringWidth, ringDistance)) * clickStrength;
        
        color += color3 * ringMask * 0.5;
      }
      
      // Add vignette effect
      float vignette = 1.0 - smoothstep(0.5, 1.5, length(vUv - 0.5) * 1.8);
      color *= vignette * 1.1;
      
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
    return null;
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
      <div className={styles.fallbackBackground} style={{
        backgroundImage: `linear-gradient(rgba(18, 18, 24, 0.85), rgba(26, 26, 46, 0.9)), url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className={styles.gradientOverlay}></div>
      </div>
    );
  }
  
  return (
    <div className={styles.rippleBackground}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.setClearColor(0x050a14, 1);
        }}
      >
        <RippleMaterial />
      </Canvas>
    </div>
  );
};

export default RippleBackground;
