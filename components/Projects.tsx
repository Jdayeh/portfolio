'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PROJECTS = [
  {
    label: 'Live · React',
    imageLabel: 'Crypto · Live',
    title: 'Pulse',
    desc: 'Real-time crypto dashboard pulling live prices from the CoinGecko API — animated charts, skeleton loading states, fully responsive.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
    url: 'https://pulse-three-delta.vercel.app/',
    image: '/pulse-preview.png',
  },
  {
    label: '3D · Configurator',
    imageLabel: 'Product · Motion',
    title: 'ZJ-04 Configurator',
    desc: 'Real-time 3D product configurator with cinematic camera transitions.',
    tags: ['Three.js', 'GSAP', 'WebGL'],
  },
  {
    label: 'Mobile · Offline',
    imageLabel: 'Mobile · PWA',
    title: 'Pit-Wall Companion App',
    desc: 'An iOS-grade PWA for trackside engineers — fully offline-capable.',
    tags: ['PWA', 'TypeScript', 'Service Worker'],
  },
  {
    label: 'Experiment',
    imageLabel: 'Type · WebGL',
    title: 'Carbon Type Specimen',
    desc: 'A shader-driven type specimen exploring kinetic, weight-shifting headlines.',
    tags: ['WebGL', 'Shaders', 'Canvas'],
  },
  {
    label: 'Microsite',
    imageLabel: 'Brand · Web',
    title: 'Estoril Livery System',
    desc: 'A content-driven brand microsite with a configurable livery showcase.',
    tags: ['Next.js', 'CMS', 'Edge'],
  },
  {
    label: 'Editorial',
    imageLabel: 'Editorial · Photo',
    title: 'Nürburgring Field Notes',
    desc: 'A fast, image-led editorial platform built on the islands architecture.',
    tags: ['Astro', 'MDX', 'Islands'],
  },
];

const STRIPE = 'linear-gradient(90deg,#0066b1 0,#0066b1 33.33%,#003d78 33.33%,#003d78 66.66%,#e22718 66.66%,#e22718 100%)';

function ProjectCard({ proj }: { proj: typeof PROJECTS[number] }) {
  return (
    <>
      <div className="photo-frame" style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
        {'image' in proj && proj.image
          ? <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <span className="photo-frame-label">{proj.imageLabel}</span>
        }
      </div>
      <div style={{ padding: '24px 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 3, height: 12, background: STRIPE, display: 'inline-block', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body)',
          }}>{proj.label}</span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21,
          lineHeight: 1.3, color: '#fff', margin: '0 0 10px',
        }}>{proj.title}</h3>
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 15,
          lineHeight: 1.6, color: 'var(--body)', margin: '0 0 18px',
        }}>{proj.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {proj.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
                letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)',
                border: '1px solid var(--hairline)', padding: '5px 10px',
              }}>{tag}</span>
            ))}
          </div>
          {'url' in proj && proj.url && (
            <a
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
                letterSpacing: '1px', textTransform: 'uppercase', color: '#fff',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5,
                flexShrink: 0,
              }}
            >
              View live
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
                <path d="M2 9L9 2M4 2h5v5" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWordRefs = useRef<HTMLSpanElement[]>([]);
  const cardRefs = useRef<HTMLElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // IntersectionObserver to track active slide on mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMobile) return;

    const cards = container.querySelectorAll<HTMLElement>('.project-card');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            const idx = Array.from(cards).indexOf(e.target as HTMLElement);
            if (idx !== -1) setCurrentSlide(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, [isMobile]);

  // Desktop GSAP scroll animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 82%' };

      gsap.from('[data-proj-label]', {
        y: 14, opacity: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: trigger,
      });

      const words = headingWordRefs.current.filter(Boolean);
      if (words.length) {
        gsap.fromTo(words,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out', scrollTrigger: trigger }
        );
      }

      // Animate only desktop cards (not on mobile where they're in the slider)
      if (!isMobile) {
        const cards = cardRefs.current.filter(Boolean);
        if (cards.length) {
          gsap.fromTo(cards,
            { y: 50, opacity: 0, scale: 0.96 },
            {
              y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.09, ease: 'power2.out',
              scrollTrigger: { trigger: containerRef.current, start: 'top 84%' },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Slider navigation
  const goToSlide = useCallback((idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>('.project-card');
    const card = cards[idx];
    if (!card) return;
    container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    setCurrentSlide(idx);
  }, []);

  const prevSlide = useCallback(() => goToSlide(Math.max(0, currentSlide - 1)), [currentSlide, goToSlide]);
  const nextSlide = useCallback(() => goToSlide(Math.min(PROJECTS.length - 1, currentSlide + 1)), [currentSlide, goToSlide]);

  return (
    <section ref={sectionRef} id="projects" data-section="projects" style={{
      scrollMarginTop: 'var(--nav-height)',
      maxWidth: 'var(--container-max)', margin: '0 auto',
      padding: 'clamp(72px,10vw,96px) clamp(20px,4vw,40px)',
    }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20, marginBottom: 48,
      }}>
        <div>
          <p data-proj-label style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body)', margin: '0 0 16px',
          }}>
            <span style={{ color: '#BBBBBB' }}>03</span> — Projects
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.05,
            letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
          }}>
            {['Selected', 'work.'].map((w, i) => (
              <span key={i} className="word-clip" style={{ marginRight: i === 0 ? '0.3em' : 0 }}>
                <span className="word-inner" ref={el => { if (el) headingWordRefs.current[i] = el; }}>{w}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* Slide counter visible on mobile */}
        {isMobile && (
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
            letterSpacing: '1px', color: 'var(--muted)', margin: 0,
          }}>
            <span style={{ color: '#fff' }}>{String(currentSlide + 1).padStart(2, '0')}</span>
            {' / '}
            {String(PROJECTS.length).padStart(2, '0')}
          </p>
        )}
      </div>

      {/* Cards — dual-mode: CSS grid on desktop, scroll-snap on mobile */}
      <div
        ref={containerRef}
        className="projects-container"
        data-proj-grid
      >
        {PROJECTS.map((proj, i) => (
          <article
            key={i}
            ref={el => { if (el) cardRefs.current[i] = el; }}
            className="project-card"
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-soft)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--canvas)')}
          >
            <ProjectCard proj={proj} />
          </article>
        ))}
      </div>

      {/* Slider navigation — only shows on mobile via CSS */}
      <div className="slider-nav">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="slider-arrow"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            aria-label="Previous project"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          <button
            className="slider-arrow"
            onClick={nextSlide}
            disabled={currentSlide === PROJECTS.length - 1}
            aria-label="Next project"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>

        <div className="slider-dots" role="tablist" aria-label="Project slides">
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              className={`slider-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
              role="tab"
              aria-selected={i === currentSlide}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
