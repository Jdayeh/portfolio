'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TIMELINE = [
  {
    period: '2026 — Now',
    role: 'Frontend Developer · iHorizons',
    body: 'Build and maintain responsive frontend features for production web applications. Improved UI performance, fixed cross-browser issues, and integrated dynamic components with backend systems.',
    accent: '#0066b1',
  },
  {
    period: '2025 — 2026',
    role: 'Frontend Content Editor · Azerion',
    body: 'Managed and updated web content using HTML, CSS, and WordPress. Fixed layout issues, improved responsive design across devices, and implemented small JavaScript enhancements for interactivity.',
    accent: '#003d78',
  },
  {
    period: '2023 — 2024',
    role: 'Frontend Intern · Careerist',
    body: 'Built responsive web interfaces using HTML, CSS, and JavaScript. Practiced component-based layouts, Bootstrap systems, and WordPress customization with real-world UI projects.',
    accent: '#e22718',
  },
];

function MStripe({ width = '100px' }: { width?: string }) {
  return (
    <div style={{
      width, height: 4,
      background: 'linear-gradient(90deg,#0066b1 0%,#0066b1 33.33%,#003d78 33.33%,#003d78 66.66%,#e22718 66.66%,#e22718 100%)',
    }} />
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headingWordRefs = useRef<HTMLSpanElement[]>([]);
  const stripeRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 75%' };

      // Label fade in
      gsap.from('[data-exp-label]', { y: 14, opacity: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: trigger });

      // Heading words
      const words = headingWordRefs.current.filter(Boolean);
      if (words.length) {
        gsap.fromTo(words,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out', scrollTrigger: trigger }
        );
      }

      // Sub copy
      gsap.from('[data-exp-body]', {
        y: 14, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.2, scrollTrigger: trigger,
      });

      // Stripe expands
      if (stripeRef.current) {
        gsap.fromTo(stripeRef.current,
          { width: 0 },
          { width: '100px', duration: 0.6, ease: 'power2.out', delay: 0.35, scrollTrigger: trigger }
        );
      }

      // Timeline vertical line draws in
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1, duration: 1.2, ease: 'power2.inOut',
            transformOrigin: 'top center',
            scrollTrigger: { trigger: lineRef.current, start: 'top 78%' },
          }
        );
      }

      // Timeline items slide in from left with stagger
      const items = itemRefs.current.filter(Boolean);
      if (items.length) {
        gsap.fromTo(items,
          { x: -32, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.65, stagger: 0.18, ease: 'power2.out',
            scrollTrigger: { trigger: lineRef.current, start: 'top 75%' },
            delay: 0.15,
          }
        );
      }

      // Timeline dots scale in
      gsap.fromTo('[data-exp-dot]',
        { scale: 0 },
        {
          scale: 1, duration: 0.4, stagger: 0.18, ease: 'back.out(1.8)',
          scrollTrigger: { trigger: lineRef.current, start: 'top 75%' },
          delay: 0.1,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" data-section="experience" style={{
      scrollMarginTop: 'var(--nav-height)',
      background: 'var(--surface-soft)',
      borderTop: '1px solid var(--hairline-strong)',
      borderBottom: '1px solid var(--hairline-strong)',
    }}>
      <div style={{
        maxWidth: 'var(--container-max)', margin: '0 auto',
        padding: 'clamp(72px,10vw,96px) clamp(20px,4vw,40px)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
        gap: 'clamp(40px,6vw,80px)',
      }}>
        {/* Left column */}
        <div>
          <p data-exp-label style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body)', margin: '0 0 16px',
          }}>
            <span style={{ color: '#BBBBBB' }}>02</span> — Experience
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.05,
            letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
          }}>
            {[['The'], ['track'], ['record.']].map((line, li) => (
              <div key={li} style={{ display: 'block' }}>
                {line.map((w, wi) => (
                  <span key={wi} className="word-clip" style={{ marginRight: '0.3em' }}>
                    <span className="word-inner" ref={el => { if (el) headingWordRefs.current[li * 10 + wi] = el; }}>{w}</span>
                  </span>
                ))}
              </div>
            ))}
          </h2>
          <p data-exp-body style={{
            fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 16,
            lineHeight: 1.6, color: 'var(--body)', margin: '24px 0 0', maxWidth: '34ch',
          }}>
            Two years shipping frontend interfaces used in real products and client projects.
          </p>
          <div ref={stripeRef} style={{ marginTop: 32, width: 0 }}>
            <MStripe />
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          <div ref={lineRef} style={{
            position: 'absolute', left: 0, top: 5, bottom: 0,
            width: 1, background: 'var(--hairline)',
            transformOrigin: 'top',
          }} />
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {TIMELINE.map((item, i) => (
              <li
                key={i}
                ref={el => { if (el) itemRefs.current[i] = el; }}
                style={{ position: 'relative', padding: `0 0 ${i < TIMELINE.length - 1 ? 44 : 0}px 32px` }}
              >
                <span
                  data-exp-dot
                  style={{
                    position: 'absolute', left: -5, top: 5,
                    width: 11, height: 11, background: item.accent,
                    display: 'block',
                  }}
                />
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                  letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)',
                  margin: '0 0 8px',
                }}>{item.period}</p>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
                  lineHeight: 1.3, color: '#fff', margin: 0,
                }}>{item.role}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 15,
                  lineHeight: 1.6, color: 'var(--body)', margin: '10px 0 0', maxWidth: '48ch',
                }}>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
