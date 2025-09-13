import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function WaveVisualizer() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Initial aspect ratio
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    currentMount.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00bcd4, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // --- ИСПРАВЛЕНИЕ: ResizeObserver ---
    const resizeObserver = new ResizeObserver(() => {
      if (currentMount) {
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(currentMount);

    return () => {
      resizeObserver.disconnect();
      currentMount.removeChild(renderer.domElement);
    };
  }, []); // Пустой массив зависимостей, чтобы запустить эффект один раз

  return (
    <div className="wave-visualizer">
      <h2>Визуализатор Концепций</h2>
      <div ref={mountRef} className="visualizer-canvas-container"></div>
    </div>
  );
}

export default WaveVisualizer;