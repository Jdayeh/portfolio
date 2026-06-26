'use client';

import { useEffect, useRef } from 'react';

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let disposed = false;
    const cleanupFns: (() => void)[] = [];

    import('three').then((THREE) => {
      if (disposed) return;

      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || 600;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 100);
      camera.position.set(0, 2.0, 5.8);
      camera.lookAt(0, 0, 0);

      // Torus wireframe — major radius R, tube radius r
      const R = 2.0;
      const r = 0.88;
      const MERIDIANS = 90;  // circles through the hole
      const LATITUDES  = 60; // circles around the tube
      const SEG = 128;

      const verts: number[] = [];
      const idx: number[] = [];
      let vi = 0;

      for (let i = 0; i < MERIDIANS; i++) {
        const phi = (i / MERIDIANS) * Math.PI * 2;
        for (let j = 0; j <= SEG; j++) {
          const theta = (j / SEG) * Math.PI * 2;
          verts.push(
            (R + r * Math.cos(theta)) * Math.cos(phi),
            r * Math.sin(theta),
            (R + r * Math.cos(theta)) * Math.sin(phi),
          );
          vi++;
          if (j > 0) idx.push(vi - 2, vi - 1);
        }
      }

      for (let i = 0; i < LATITUDES; i++) {
        const theta = (i / LATITUDES) * Math.PI * 2;
        const rad = R + r * Math.cos(theta);
        const y   = r * Math.sin(theta);
        for (let j = 0; j <= SEG; j++) {
          const phi = (j / SEG) * Math.PI * 2;
          verts.push(rad * Math.cos(phi), y, rad * Math.sin(phi));
          vi++;
          if (j > 0) idx.push(vi - 2, vi - 1);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.setIndex(idx);

      const mat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.22,
      });

      const mesh = new THREE.LineSegments(geo, mat);
      mesh.rotation.x = Math.PI * 0.14; // tilt to show the hole
      scene.add(mesh);

      // Fade canvas in after first frame
      requestAnimationFrame(() => { canvas.style.opacity = '1'; });

      // Mouse parallax
      let mx = 0, my = 0, camX = 0, camY = 2.0;
      const onMouse = (e: MouseEvent) => {
        mx =  (e.clientX / window.innerWidth  - 0.5) * 2;
        my = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouse, { passive: true });

      const onResize = () => {
        const nw = canvas.clientWidth;
        const nh = canvas.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh, false);
      };
      window.addEventListener('resize', onResize, { passive: true });

      const tick = () => {
        animId = requestAnimationFrame(tick);

        mesh.rotation.y += 0.0035;

        camX += (mx * 0.35 - camX) * 0.025;
        camY += (2.0 + my * 0.18 - camY) * 0.025;
        camera.position.set(camX, camY, 5.8);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      tick();

      cleanupFns.push(() => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('resize', onResize);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
      });
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 2s ease',
        zIndex: 0,
      }}
    />
  );
}
