'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const COLUMNS = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript (ES2023)', 'HTML5', 'CSS / Sass'],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Next.js', 'Astro', 'Vue 3'],
  },
  {
    label: 'Styling & Motion',
    items: ['Tailwind CSS', 'CSS Modules', 'GSAP', 'Framer Motion'],
  },
  {
    label: 'Tooling',
    items: ['Vite', 'Git / GitHub', 'Figma', 'Storybook', 'Vitest / Playwright'],
  },
];

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWordRefs = useRef<HTMLSpanElement[]>([]);
  const colRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 82%' };

      gsap.from('[data-stack-label]', { y: 14, opacity: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: trigger });

      const words = headingWordRefs.current.filter(Boolean);
      if (words.length) {
        gsap.fromTo(words,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out', scrollTrigger: trigger }
        );
      }

      const cols = colRefs.current.filter(Boolean);
      if (cols.length) {
        gsap.fromTo(cols,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '[data-stack-grid]', start: 'top 84%' },
          }
        );
      }

      // Individual stack items reveal
      gsap.fromTo('[data-stack-item]',
        { x: -12, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out',
          scrollTrigger: { trigger: '[data-stack-grid]', start: 'top 80%' },
          delay: 0.25,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="stack" data-section="stack" style={{
      scrollMarginTop: 'var(--nav-height)',
      background: 'var(--surface-soft)',
      borderTop: '1px solid var(--hairline-strong)',
      borderBottom: '1px solid var(--hairline-strong)',
    }}>
      <div style={{
        maxWidth: 'var(--container-max)', margin: '0 auto',
        padding: 'clamp(72px,10vw,96px) clamp(20px,4vw,40px)',
      }}>
        <div style={{ marginBottom: 48 }}>
          <p data-stack-label style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body)', margin: '0 0 16px',
          }}>
            <span style={{ color: '#BBBBBB' }}>04</span> — Stack
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.05,
            letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
          }}>
            {['Tools', 'of', 'the', 'trade.'].map((w, i) => (
              <span key={i} className="word-clip" style={{ marginRight: i < 3 ? '0.3em' : 0 }}>
                <span className="word-inner" ref={el => { if (el) headingWordRefs.current[i] = el; }}>{w}</span>
              </span>
            ))}
          </h2>
        </div>

        <div data-stack-grid style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 48,
        }}>
          {COLUMNS.map((col, ci) => (
            <div key={ci} ref={el => { if (el) colRefs.current[ci] = el; }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff',
                margin: '0 0 6px', paddingBottom: 14, borderBottom: '1px solid var(--hairline)',
              }}>{col.label}</p>
              {col.items.map((item, ii) => (
                <p
                  key={ii}
                  data-stack-item
                  style={{
                    fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 16,
                    color: 'var(--body-strong)', margin: 0,
                    padding: '14px 0',
                    borderBottom: ii < col.items.length - 1 ? '1px solid var(--hairline-strong)' : 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--body-strong)')}
                >{item}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
