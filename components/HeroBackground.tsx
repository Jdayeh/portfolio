'use client';

import { useEffect, useRef } from 'react';

const COUNT = 1600;

const VERT = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (320.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;
    float alpha = pow(1.0 - d, 2.2) * 0.85;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

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
      const h = canvas.clientHeight || window.innerHeight;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h, false);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
      camera.position.z = 5;

      // Build particle arrays
      const positions  = new Float32Array(COUNT * 3);
      const colors     = new Float32Array(COUNT * 3);
      const sizes      = new Float32Array(COUNT);
      const velocities = new Float32Array(COUNT * 3);

      for (let i = 0; i < COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 24;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

        velocities[i * 3]     = (Math.random() - 0.5) * 0.0006;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0005;

        // Tiers: mostly dim grey, some mid-white, few bright, a scatter of accent blue
        const roll = Math.random();
        if (roll < 0.12) {
          // accent blue
          colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.42; colors[i * 3 + 2] = 0.76;
          sizes[i] = Math.random() * 1.5 + 1.0;
        } else if (roll < 0.22) {
          // bright white star
          const b = Math.random() * 0.35 + 0.55;
          colors[i * 3] = b; colors[i * 3 + 1] = b; colors[i * 3 + 2] = b + 0.04;
          sizes[i] = Math.random() * 1.2 + 1.4;
        } else if (roll < 0.5) {
          // mid grey
          const b = Math.random() * 0.15 + 0.18;
          colors[i * 3] = b; colors[i * 3 + 1] = b; colors[i * 3 + 2] = b + 0.02;
          sizes[i] = Math.random() * 1.0 + 0.7;
        } else {
          // dim ghost
          const b = Math.random() * 0.08 + 0.04;
          colors[i * 3] = b; colors[i * 3 + 1] = b; colors[i * 3 + 2] = b + 0.01;
          sizes[i] = Math.random() * 0.8 + 0.5;
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));

      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {},
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // Fade canvas in
      requestAnimationFrame(() => {
        canvas.style.opacity = '1';
      });

      // Mouse parallax
      let mx = 0, my = 0, tx = 0, ty = 0;
      const onMouse = (e: MouseEvent) => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;
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

      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

      const tick = () => {
        animId = requestAnimationFrame(tick);

        // Drift
        for (let i = 0; i < COUNT; i++) {
          (posAttr.array as Float32Array)[i * 3]     += velocities[i * 3];
          (posAttr.array as Float32Array)[i * 3 + 1] += velocities[i * 3 + 1];
          if ((posAttr.array as Float32Array)[i * 3]     >  12) (posAttr.array as Float32Array)[i * 3]     = -12;
          if ((posAttr.array as Float32Array)[i * 3]     < -12) (posAttr.array as Float32Array)[i * 3]     =  12;
          if ((posAttr.array as Float32Array)[i * 3 + 1] >   7) (posAttr.array as Float32Array)[i * 3 + 1] =  -7;
          if ((posAttr.array as Float32Array)[i * 3 + 1] <  -7) (posAttr.array as Float32Array)[i * 3 + 1] =   7;
        }
        posAttr.needsUpdate = true;

        // Smooth camera parallax
        tx += (mx - tx) * 0.025;
        ty += (my - ty) * 0.025;
        camera.position.x = tx * 0.35;
        camera.position.y = ty * 0.2;
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
        transition: 'opacity 2.5s ease',
        zIndex: 0,
      }}
    />
  );
}
