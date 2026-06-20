'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const NAV_LINKS = [
  { href: '#expertise', label: 'Expertise' },
  { href: '#projects', label: 'Projects' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const stripeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trigger = { trigger: footerRef.current, start: 'top 90%' };

      // Stripe expands full width
      if (stripeRef.current) {
        gsap.fromTo(stripeRef.current,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 0.9, ease: 'power3.out',
            transformOrigin: 'left',
            scrollTrigger: trigger,
          }
        );
      }

      // Content fades up
      gsap.fromTo('[data-footer-content]',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out', scrollTrigger: trigger, delay: 0.2 }
      );

      // Footer links stagger
      gsap.fromTo('[data-footer-link]',
        { y: 10, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: trigger, delay: 0.35,
        }
      );

      // Bottom bar
      gsap.fromTo('[data-footer-bottom]',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out', scrollTrigger: trigger, delay: 0.55 }
      );

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} style={{ background: '#000', borderTop: '1px solid var(--hairline-strong)' }}>
      <div style={{
        maxWidth: 'var(--container-max)', margin: '0 auto',
        padding: 'clamp(48px,7vw,64px) clamp(20px,4vw,40px)',
      }}>
        {/* Full-width M-stripe */}
        <div ref={stripeRef} style={{
          height: 4, width: '100%',
          background: 'linear-gradient(90deg,#0066b1 0%,#0066b1 33.33%,#003d78 33.33%,#003d78 66.66%,#e22718 66.66%,#e22718 100%)',
          transformOrigin: 'left',
          marginBottom: 40,
        }} />

        <div data-footer-content style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Image src="/logo-mark.svg" width={40} height={40} alt="ZJ monogram" />
            <div>
              <p style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
              }}>Zaid Jdayeh</p>
              <p style={{
                fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 14,
                color: 'var(--muted)', margin: '4px 0 0',
              }}>Frontend Developer · Amman, working worldwide</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                data-footer-link
                href={link.href}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                  letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body)',
                  textDecoration: 'none', transition: 'color 0.18s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--body)')}
              >{link.label}</a>
            ))}
          </div>
        </div>

        <div data-footer-bottom style={{
          marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--hairline-strong)',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.5px', color: 'var(--muted)',
          }}>© 2026 Zaid Jdayeh. Designed & Built with Precision.</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.5px', color: 'var(--muted)',
          }}>EN · Amman</span>
        </div>
      </div>

    </footer>
  );
}
