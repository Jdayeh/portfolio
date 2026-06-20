'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

const NAV_LINKS = [
  { id: 'home', label: 'Home', num: '00' },
  { id: 'expertise', label: 'Expertise', num: '01' },
  { id: 'experience', label: 'Experience', num: '02' },
  { id: 'projects', label: 'Projects', num: '03' },
  { id: 'stack', label: 'Stack', num: '04' },
  { id: 'contact', label: 'Contact', num: '05' },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  // Entrance animation
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.fromTo(nav,
      { yPercent: -105, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  // Scroll progress indicator
  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section spy
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setActiveSection(e.target.getAttribute('data-section') || 'home');
      }),
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Overlay open/close animation
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (menuOpen) {
      // Make visible, then animate
      overlay.style.visibility = 'visible';
      overlay.style.pointerEvents = 'all';

      gsap.fromTo(overlay,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.32, ease: 'power3.out' }
      );

      gsap.fromTo('.nav-overlay-link',
        { x: 24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.055, ease: 'power2.out', delay: 0.08 }
      );

      gsap.fromTo('.nav-overlay-footer',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.45 }
      );
    } else {
      gsap.to(overlay, {
        opacity: 0, y: -8, duration: 0.22, ease: 'power2.in',
        onComplete: () => {
          overlay.style.visibility = 'hidden';
          overlay.style.pointerEvents = 'none';
        },
      });
    }
  }, [menuOpen]);

  // Body scroll-lock when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Escape key closes menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close menu on window resize past breakpoint
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <nav ref={navRef} style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '0 clamp(20px,4vw,40px)',
        background: '#000',
        borderBottom: '1px solid var(--hairline-strong)',
      }}>
        {/* Scroll progress bar */}
        <div ref={progressRef} className="scroll-progress" style={{ transformOrigin: 'left', width: '100%' }} />

        {/* Logo */}
        <a href="#home" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
          <Image src="/logo-mark.svg" width={34} height={34} alt="ZJ monogram" style={{ display: 'block' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
            letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff',
          }}>Zaid Jdayeh</span>
        </a>

        {/* Desktop links */}
        <div className="nav-links-desktop">
          {NAV_LINKS.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                color: activeSection === link.id ? '#fff' : 'var(--body)',
                padding: '4px 0',
                borderBottom: activeSection === link.id ? '2px solid #fff' : '2px solid transparent',
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
            >{link.label}</a>
          ))}
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="nav-hamburger"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-overlay"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className={`hamburger-inner ${menuOpen ? 'hamburger-open' : ''}`}>
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </span>
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        id="mobile-nav-overlay"
        className="nav-mobile-overlay"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {NAV_LINKS.map(link => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`nav-overlay-link ${activeSection === link.id ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {link.label}
            <span className="nav-overlay-number">{link.num}</span>
          </a>
        ))}

        {/* Footer hint inside overlay */}
        <div className="nav-overlay-footer">
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', margin: 0,
          }}>
            Stuttgart · Working worldwide
          </p>
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            {[
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zaidjdayeh/' },
              { label: 'GitHub', href: 'https://github.com/Jdayeh' },
            ].map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
                letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body)',
                textDecoration: 'none',
              }}>{s.label} →</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
