import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeLoader({ onLoadComplete, minDuration = 2000 }) {
  const wrapRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!wrapRef.current) return;

    const canvassize = 500;
    const length = 30;
    const radius = 5.6;
    const rotatevalue = 0.035;
    let acceleration = 0;
    let animatestep = 0;
    let toend = false;
    const pi2 = Math.PI * 2;

    const group = new THREE.Group();
    let mesh, ringcover, ring, camera, scene, renderer;

    // Setup camera
    camera = new THREE.PerspectiveCamera(65, 1, 1, 10000);
    camera.position.z = 150;

    // Setup scene
    scene = new THREE.Scene();
    scene.add(group);

    // Create custom curve for the helix
    class HelixCurve extends THREE.Curve {
      getPoint(t) {
        const x = length * Math.sin(pi2 * t);
        const y = radius * Math.cos(pi2 * 3 * t);
        
        let percent = t % 0.25 / 0.25;
        percent = t % 0.25 - (2 * (1 - percent) * percent * -0.0185 + percent * percent * 0.25);
        
        if (Math.floor(t / 0.25) === 0 || Math.floor(t / 0.25) === 2) {
          percent *= -1;
        }
        
        const z = radius * Math.sin(pi2 * 2 * (t - percent));
        return new THREE.Vector3(x, y, z);
      }
    }

    const curve = new HelixCurve();

    // Create tube mesh
    mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 200, 1.1, 8, true),
      new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide
      })
    );
    group.add(mesh);

    // Ring cover
    ringcover = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 15, 1),
      new THREE.MeshBasicMaterial({ 
        color: 0x000000, 
        opacity: 0, 
        transparent: true 
      })
    );
    ringcover.position.x = length + 1;
    ringcover.rotation.y = Math.PI / 2;
    group.add(ringcover);

    // Ring
    ring = new THREE.Mesh(
      new THREE.RingGeometry(4.3, 5.55, 64),
      new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        opacity: 0, 
        transparent: true 
      })
    );
    ring.position.x = length + 1.1;
    ring.rotation.y = Math.PI / 2;
    group.add(ring);

    // Fake shadow planes
    for (let i = 0; i < 10; i++) {
      const plain = new THREE.Mesh(
        new THREE.PlaneGeometry(length * 2 + 1, radius * 3, 1),
        new THREE.MeshBasicMaterial({ 
          color: 0x000000, 
          transparent: true, 
          opacity: 0.13 
        })
      );
      plain.position.z = -2.5 + i * 0.5;
      group.add(plain);
    }

    // Setup renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvassize, canvassize);
    renderer.setClearColor(0x000000, 0);
    wrapRef.current.appendChild(renderer.domElement);

    // Smooth easing function
    const easing = (t, b, c, d) => {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b;
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    };

    // Render function
    const render = () => {
      animatestep = Math.max(0, Math.min(240, toend ? animatestep + 1 : animatestep - 4));
      acceleration = easing(animatestep, 0, 1, 240);

      if (acceleration > 0.35) {
        const progress = (acceleration - 0.35) / 0.65;
        group.rotation.y = (-Math.PI / 2) * progress;
        group.position.z = 50 * progress;
        
        const endProgress = Math.max(0, (acceleration - 0.97) / 0.03);
        mesh.material.opacity = 1 - endProgress;
        ringcover.material.opacity = ring.material.opacity = endProgress;
        ring.scale.x = ring.scale.y = 0.9 + 0.1 * endProgress;
      }

      renderer.render(scene, camera);
    };

    // Animation loop - THIS IS THE KEY FOR SMOOTH ROTATION
    const animate = () => {
      // Continuously rotate the mesh - THIS MAKES IT SPIN
      mesh.rotation.x += rotatevalue + acceleration;
      
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop immediately
    animate();

    // Trigger the end animation after a delay
    setTimeout(() => {
      toend = true;
    }, minDuration);

    // Complete and cleanup
    setTimeout(() => {
      if (onLoadComplete) onLoadComplete();
    }, minDuration + 1500);

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (renderer) {
        renderer.dispose();
        mesh?.geometry?.dispose();
        mesh?.material?.dispose();
        ringcover?.geometry?.dispose();
        ringcover?.material?.dispose();
        ring?.geometry?.dispose();
        ring?.material?.dispose();
      }
      if (wrapRef.current && renderer?.domElement && wrapRef.current.contains(renderer.domElement)) {
        wrapRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onLoadComplete, minDuration]);

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
      <div className="relative w-[500px] h-[500px]">
        <div ref={wrapRef} className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-xl font-light tracking-widest uppercase animate-pulse mt-25">
            Loading
          </div>
        </div>
      </div>
    </div>
  );
}