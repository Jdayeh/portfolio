'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HeroBackground = dynamic(() => import('./HeroBackground'), { ssr: false });

const STATS = [
  { value: 2, unit: 'yr', label: 'Building for the web', accent: '#0066b1' },
  { value: 80, unit: '+', label: 'Interfaces shipped', accent: '#0066b1' },
  { value: 98, unit: '', label: 'Avg. Lighthouse score', accent: '#003d78' },
  { value: 60, unit: 'fps', label: 'Motion, no jank', accent: '#e22718' },
];

function MStripe({ width = '120px', style = {} }: { width?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      width,
      height: 4,
      background: 'linear-gradient(90deg, #0066b1 0%, #0066b1 33.33%, #003d78 33.33%, #003d78 66.66%, #e22718 66.66%, #e22718 100%)',
      ...style,
    }} />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripeRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRefs = useRef<HTMLElement[]>([]);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const statRefs = useRef<HTMLDivElement[]>([]);
  const counterRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // M-stripe expands from 0
      if (stripeRef.current) {
        tl.fromTo(stripeRef.current,
          { width: 0, opacity: 0 },
          { width: '120px', opacity: 1, duration: 0.55, ease: 'power2.out' },
          0.25
        );
      }

      // Label slides up
      if (labelRef.current) {
        tl.fromTo(labelRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0.45
        );
      }

      // H1 words reveal bottom-to-top
      if (wordRefs.current.length) {
        tl.fromTo(wordRefs.current,
          { yPercent: 115 },
          { yPercent: 0, duration: 0.72, stagger: 0.075 },
          0.55
        );
      }

      // Body text fades up
      if (bodyRef.current) {
        tl.fromTo(bodyRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          '-=0.3'
        );
      }

      // CTA buttons slide up with stagger
      const validCtaRefs = ctaRefs.current.filter(Boolean);
      if (validCtaRefs.length) {
        tl.fromTo(validCtaRefs,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          '-=0.3'
        );
      }

      // Available badge scales in
      if (badgeRef.current) {
        tl.fromTo(badgeRef.current,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' },
          '-=0.2'
        );
      }

      // Stat cells stagger in
      const validStatRefs = statRefs.current.filter(Boolean);
      if (validStatRefs.length) {
        tl.fromTo(validStatRefs,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.07 },
          '-=0.2'
        );
      }

      // Counter animations
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = STATS[i]?.value ?? 0;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          delay: 1.2 + i * 0.1,
          onUpdate: () => { el.textContent = Math.round(obj.v).toString(); },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addWordRef = (el: HTMLSpanElement | null) => {
    if (el && !wordRefs.current.includes(el)) wordRefs.current.push(el);
  };

  const addCtaRef = (el: HTMLAnchorElement | null) => {
    if (el && !ctaRefs.current.includes(el)) ctaRefs.current.push(el);
  };

  const addStatRef = (el: HTMLDivElement | null) => {
    if (el && !statRefs.current.includes(el)) statRefs.current.push(el);
  };

  const heroWords = [
    { text: 'BUILT', line: 0 },
    { text: 'TO', line: 1 },
    { text: 'PERFORM.', line: 1 },
  ];

  return (
    <section ref={sectionRef} id="home" data-section="home" style={{ scrollMarginTop: 'var(--nav-height)', position: 'relative' }}>
      {/* Full-bleed background */}
      <div className="hero-inner-container" style={{ position: 'relative', backgroundColor: 'var(--surface-card)' }}>
        <HeroBackground />
        {/* diagonal texture sits on top of canvas, no solid bg so particles show through */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: 'repeating-linear-gradient(135deg,transparent 0 13px,rgba(255,255,255,0.018) 13px 14px)',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0) 28%,rgba(0,0,0,0) 45%,rgba(0,0,0,0.94) 100%)',
        }} />

        {/* Hero content */}
        <div style={{
          position: 'relative', zIndex: 2, width: '100%', maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 clamp(20px,4vw,40px) clamp(48px,7vw,80px)',
        }}>
          <div ref={stripeRef} style={{ marginBottom: 24, width: 0, opacity: 0 }}>
            <MStripe width="120px" />
          </div>

          <p ref={labelRef} className="hero-label" style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body)',
            margin: '0 0 18px',
          }}>
            FRONTEND DEVELOPER — REACT · TYPESCRIPT · NEXT.JS
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(46px,8vw,92px)', lineHeight: 0.98,
            letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#fff',
            margin: 0, maxWidth: '16ch',
          }}>
            {/* Line 0 */}
            <div style={{ display: 'block' }}>
              <span className="word-clip">
                <span ref={addWordRef} className="word-inner">BUILT</span>
              </span>
            </div>
            {/* Line 1 */}
            <div style={{ display: 'block' }}>
              <span className="word-clip" style={{ marginRight: '0.3em' }}>
                <span ref={addWordRef} className="word-inner">TO</span>
              </span>
              <span className="word-clip">
                <span ref={addWordRef} className="word-inner">PERFORM.</span>
              </span>
            </div>
          </h1>

          <p ref={bodyRef} style={{
            fontFamily: 'var(--font-body)', fontWeight: 300,
            fontSize: 'clamp(16px,1.5vw,19px)', lineHeight: 1.6, color: 'var(--body-strong)',
            margin: '24px 0 0', maxWidth: '52ch',
          }}>
            I create responsive, accessible, and high-performance web applications with a focus on clean code and exceptional user experience.
          </p>

          <div className="hero-cta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 36 }}>
            <a ref={addCtaRef} href="#projects" className="hero-cta-btn" style={solidBtnStyle}>View projects</a>
            <a ref={addCtaRef} href="#contact" className="hero-cta-btn hero-cta-outline" style={outlineBtnStyle}>Get in touch</a>
            <span ref={badgeRef} style={badgeStyle}>
              <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
              Available for work — Q3 2026
            </span>
          </div>
        </div>
      </div>

      {/* Stat band */}
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 clamp(20px,4vw,40px)' }}>
        <div className="stats-grid">
          {STATS.map((stat, i) => (
            <div key={i} ref={addStatRef} style={{
              background: 'var(--canvas)',
              padding: '28px 24px',
            }}>
              <div style={{ borderTop: `2px solid ${stat.accent}`, paddingTop: 16 }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'clamp(36px,4vw,52px)', lineHeight: 1, color: '#fff',
                  margin: '0 0 6px',
                }}>
                  <span ref={el => { counterRefs.current[i] = el!; }}>0</span>
                  <span style={{ fontSize: '0.45em', marginLeft: 4, color: stat.accent }}>{stat.unit}</span>
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
                  letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--muted)',
                  margin: 0,
                }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const solidBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  height: 56, padding: '0 32px',
  background: '#fff', color: '#000',
  fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
  letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
  transition: 'background 0.18s ease, color 0.18s ease, transform 0.1s ease',
};

const outlineBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  height: 56, padding: '0 32px',
  background: 'transparent', color: '#fff',
  border: '1px solid var(--hairline)',
  fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
  letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
  transition: 'border-color 0.18s ease, background 0.18s ease, color 0.18s ease, transform 0.1s ease',
};


const badgeStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 10,
  height: 56, padding: '0 20px',
  border: '1px solid var(--hairline)',
  fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
  letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body-strong)',
};
