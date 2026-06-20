'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CARDS = [
  {
    accent: '#0066b1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
        <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" /><path d="M3 12l9 4.5L21 12" /><path d="M3 16.5 12 21l9-4.5" />
      </svg>
    ),
    title: 'Frontend Architecture',
    body: 'Component systems and state that scale without friction — typed, tested, predictable.',
  },
  {
    accent: '#0066b1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    ),
    title: 'Motion & Interaction',
    body: 'Purposeful animation tuned for 60fps and zero jank. Every transition earns its frame.',
  },
  {
    accent: '#003d78',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    title: 'Design Systems',
    body: 'Token-driven UI kits and primitives that keep designers and engineers in lockstep.',
  },
  {
    accent: '#e22718',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
        <path d="M12 14 17 9" /><path d="M3.5 18a9 9 0 1 1 17 0" />
        <circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Performance Engineering',
    body: 'Sub-second loads, lean bundles, Core Web Vitals measured on every commit.',
  },
];

export default function Expertise() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWordRefs = useRef<HTMLSpanElement[]>([]);
  const cardRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Section label
      gsap.from('[data-expertise-label]', {
        y: 16, opacity: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
      });

      // Heading words
      const words = headingWordRefs.current.filter(Boolean);
      if (words.length) {
        gsap.fromTo(words,
          { yPercent: 110 },
          {
            yPercent: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          }
        );
      }

      // Sub-copy
      gsap.from('[data-expertise-sub]', {
        y: 14, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.2,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });

      // Cards stagger in
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length) {
        gsap.fromTo(cards,
          { y: 55, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '[data-expertise-grid]', start: 'top 82%' },
          }
        );

        // Icon reveal with slight scale
        gsap.fromTo('[data-expertise-icon]',
          { scale: 0.7, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: '[data-expertise-grid]', start: 'top 80%' },
            delay: 0.2,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="expertise" data-section="expertise" style={{
      scrollMarginTop: 'var(--nav-height)',
      maxWidth: 'var(--container-max)', margin: '0 auto',
      padding: 'clamp(72px,10vw,96px) clamp(20px,4vw,40px)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20, marginBottom: 48,
      }}>
        <div>
          <p data-expertise-label style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body)',
            margin: '0 0 16px',
          }}>
            <span style={{ color: '#BBBBBB' }}>01</span> — Expertise
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.05,
            letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#fff',
            margin: 0,
          }}>
            {['What', 'I', 'engineer.'].map((word, i) => (
              <span key={i} className="word-clip" style={{ marginRight: i < 2 ? '0.3em' : 0 }}>
                <span
                  className="word-inner"
                  ref={el => { if (el) headingWordRefs.current[i] = el; }}
                >{word}</span>
              </span>
            ))}
          </h2>
        </div>
        <p data-expertise-sub style={{
          fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 16,
          lineHeight: 1.6, color: 'var(--body)', margin: 0, maxWidth: '38ch',
        }}>
          Four disciplines, one operating principle: remove what isn't load-bearing, tighten what is.
        </p>
      </div>

      <div data-expertise-grid style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
        gap: '1px', background: 'var(--hairline-strong)', border: '1px solid var(--hairline-strong)',
      }}>
        {CARDS.map((card, i) => (
          <article
            key={i}
            ref={el => { if (el) cardRefs.current[i] = el; }}
            className="expertise-card"
            style={{
              background: 'var(--canvas)', padding: '32px 28px 36px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-card)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--canvas)')}
          >
            <div
              data-expertise-icon
              style={{
                width: 46, height: 46, border: `1px solid ${card.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 28, color: card.accent,
              }}
            >
              {card.icon}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21,
              lineHeight: 1.25, color: '#fff', margin: '0 0 12px',
            }}>{card.title}</h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 15,
              lineHeight: 1.6, color: 'var(--body)', margin: 0,
            }}>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
