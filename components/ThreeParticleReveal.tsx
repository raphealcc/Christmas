import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeParticleRevealProps {
  onAnimationComplete: () => void;
}

const ThreeParticleReveal: React.FC<ThreeParticleRevealProps> = ({ onAnimationComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Configuration ---
    const PARTICLE_COUNT = 30000;
    const DURATION_PER_SHAPE = 1200; // ms
    const TOTAL_CYCLES = 4; // How many shapes to show before finishing

    // --- Setup Scene ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // --- Texture Generation (Soft Glow) ---
    const getTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 215, 0, 0.8)'); // Gold tint
        gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
      }
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // --- Geometry Helper Functions ---
    // Helper to get random point in sphere
    const getRandomSpherePoint = (radius: number) => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.cbrt(Math.random()) * radius; // Uniform distribution inside
      const sinPhi = Math.sin(phi);
      return new THREE.Vector3(
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * Math.cos(phi)
      );
    };

    // 1. Christmas Tree
    const getTreePoints = (count: number) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        const y = Math.random() * 10 - 5; // Height -5 to 5
        const radius = (5 - y) * 0.4; // Radius wider at bottom
        const angle = Math.random() * Math.PI * 2 * 10; // Spiral
        const r = Math.random() * radius;
        // Spiral concentration + some randomness
        const x = r * Math.cos(angle + y * 2);
        const z = r * Math.sin(angle + y * 2);
        points.push(x, y, z);
      }
      return new Float32Array(points);
    };

    // 2. Candy Cane
    const getCandyCanePoints = (count: number) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        const t = Math.random(); 
        // Hook curve logic
        let x, y, z;
        const thickness = Math.random() * 0.8;
        const angle = Math.random() * Math.PI * 2;
        
        if (t < 0.7) {
          // Straight part
          y = (t / 0.7) * 10 - 5;
          x = thickness * Math.cos(angle);
          z = thickness * Math.sin(angle);
        } else {
          // Curve part
          const curveT = (t - 0.7) / 0.3; // 0 to 1
          const curveAngle = curveT * Math.PI;
          const R = 2.5; // Radius of hook
          
          y = 5 + R * Math.sin(curveAngle);
          // Shift x to side
          x = -R + R * Math.cos(curveAngle) + thickness * Math.cos(angle);
          z = thickness * Math.sin(angle);
        }
        points.push(x, y, z);
      }
      return new Float32Array(points);
    };

    // 3. Christmas Ball (Sphere)
    const getBallPoints = (count: number) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        const p = getRandomSpherePoint(4.5);
        points.push(p.x, p.y, p.z);
      }
      return new Float32Array(points);
    };

    // 4. Star / Snowflake (Radial)
    const getStarPoints = (count: number) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        const arms = 6;
        const armIndex = Math.floor(Math.random() * arms);
        const r = Math.random() * 6;
        const angle = (armIndex / arms) * Math.PI * 2;
        const spread = Math.random() * 0.5; // Thickness of arm
        
        // Add fractal branching visual
        const branch = Math.random() > 0.8 ? 1 : 0;
        const branchAngle = angle + (Math.random() - 0.5) * 1.5 * branch;
        
        const x = r * Math.cos(branch ? branchAngle : angle) + (Math.random()-0.5) * spread;
        const y = r * Math.sin(branch ? branchAngle : angle) + (Math.random()-0.5) * spread;
        const z = (Math.random() - 0.5) * 0.5; // Flatish
        points.push(x, y, z);
      }
      return new Float32Array(points);
    };
    
    // 5. Gingerbread Man (Simple Approximation)
    const getGingerbreadPoints = (count: number) => {
        const points = [];
        for (let i = 0; i < count; i++) {
            const rand = Math.random();
            let x = 0, y = 0, z = (Math.random() - 0.5) * 1;
            
            // Head (15%)
            if (rand < 0.15) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * 1.5;
                x = r * Math.cos(angle);
                y = 2.5 + r * Math.sin(angle);
            } 
            // Body (35%)
            else if (rand < 0.5) {
                 const w = 1.5 + (Math.random() - 0.5);
                 const h = 3;
                 x = (Math.random() - 0.5) * w * 2;
                 y = (Math.random() - 0.5) * h;
            }
            // Arms (25%)
            else if (rand < 0.75) {
                const side = Math.random() > 0.5 ? 1 : -1;
                const r = Math.random() * 2;
                x = side * (1.5 + r);
                y = 0.5 + (Math.random() - 0.5);
            }
            // Legs (25%)
            else {
                const side = Math.random() > 0.5 ? 1 : -1;
                const r = Math.random() * 2;
                x = side * (1 + (Math.random() * 0.5));
                y = -1.5 - r;
            }
            points.push(x, y, z);
        }
        return new Float32Array(points);
    }

    // --- Particle System Init ---
    const geometry = new THREE.BufferGeometry();
    const positions = getTreePoints(PARTICLE_COUNT); // Start with Tree
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Store targets for interpolation
    const targets = {
      tree: positions, // Reuse
      ball: getBallPoints(PARTICLE_COUNT),
      candy: getCandyCanePoints(PARTICLE_COUNT),
      star: getStarPoints(PARTICLE_COUNT),
      ginger: getGingerbreadPoints(PARTICLE_COUNT)
    };

    const shapeKeys = Object.keys(targets) as Array<keyof typeof targets>;
    
    const material = new THREE.PointsMaterial({
      size: 0.15,
      map: getTexture(),
      vertexColors: false,
      color: 0xd4af37, // Christmas Gold
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- Animation Logic ---
    let startTime = Date.now();
    let currentShapeIndex = 0;
    
    // Arrays for morphing
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    // Initialize current positions
    currentPositions.set(targets[shapeKeys[0]]);

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const now = Date.now();
      const elapsed = now - startTime;
      
      // Determine cycle
      const cycleIndex = Math.floor(elapsed / DURATION_PER_SHAPE);
      const progress = (elapsed % DURATION_PER_SHAPE) / DURATION_PER_SHAPE; // 0 to 1

      // Completion Check
      if (cycleIndex >= TOTAL_CYCLES) {
        cancelAnimationFrame(animationId);
        onAnimationComplete();
        return;
      }

      // Determine Target Shapes
      const fromShapeName = shapeKeys[cycleIndex % shapeKeys.length];
      const toShapeName = shapeKeys[(cycleIndex + 1) % shapeKeys.length];
      
      const fromPos = targets[fromShapeName];
      const toPos = targets[toShapeName];

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      // Easing function for smoother morph
      const ease = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const mix = ease(progress);

      // Add camera rotation
      const time = now * 0.0005;
      particles.rotation.y = time * 0.5;
      particles.rotation.x = Math.sin(time * 0.5) * 0.1;

      // Morphing Loop
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        // Interpolate
        arr[i3] = fromPos[i3] * (1 - mix) + toPos[i3] * mix;
        arr[i3 + 1] = fromPos[i3 + 1] * (1 - mix) + toPos[i3 + 1] * mix;
        arr[i3 + 2] = fromPos[i3 + 2] * (1 - mix) + toPos[i3 + 2] * mix;
        
        // Add some noise/twinkle
        if (Math.random() > 0.95) {
             arr[i3] += (Math.random() - 0.5) * 0.1;
             arr[i3+1] += (Math.random() - 0.5) * 0.1;
             arr[i3+2] += (Math.random() - 0.5) * 0.1;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [onAnimationComplete]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-50 bg-black/90 cursor-none"
      style={{ touchAction: 'none' }}
    />
  );
};

export default ThreeParticleReveal;