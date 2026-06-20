'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function MStripe({ width = '120px' }: { width?: string }) {
  return (
    <div style={{
      width, height: 4,
      background: 'linear-gradient(90deg,#0066b1 0%,#0066b1 33.33%,#003d78 33.33%,#003d78 66.66%,#e22718 66.66%,#e22718 100%)',
    }} />
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<HTMLDivElement>(null);
  const headingWordRefs = useRef<HTMLSpanElement[]>([]);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('zaidjdayed@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 80%' };

      // Stripe expands
      if (stripeRef.current) {
        gsap.fromTo(stripeRef.current,
          { width: 0 },
          { width: '120px', duration: 0.6, ease: 'power2.out', scrollTrigger: trigger }
        );
      }

      // Label
      gsap.from('[data-contact-label]', { y: 14, opacity: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: trigger });

      // Heading words
      const words = headingWordRefs.current.filter(Boolean);
      if (words.length) {
        gsap.fromTo(words,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out', scrollTrigger: trigger }
        );
      }

      // Left panel slides in from left
      if (leftRef.current) {
        gsap.fromTo(leftRef.current,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', scrollTrigger: trigger, delay: 0.1 }
        );
      }

      // Right panel slides in from right
      if (rightRef.current) {
        gsap.fromTo(rightRef.current,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', scrollTrigger: trigger, delay: 0.2 }
        );
      }

      // Social links stagger
      gsap.fromTo('[data-contact-link]',
        { y: 12, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: trigger, delay: 0.4,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%',
    padding: '12px 16px',
    background: 'var(--surface-card)', color: '#fff',
    fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 300, lineHeight: 1.5,
    border: '1px solid var(--hairline)', outline: 'none', borderRadius: 0,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: 8,
    fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
    letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff',
  };

  return (
    <section ref={sectionRef} id="contact" data-section="contact" style={{
      scrollMarginTop: 'var(--nav-height)',
      maxWidth: 'var(--container-max)', margin: '0 auto',
      padding: 'clamp(72px,10vw,96px) clamp(20px,4vw,40px)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
        gap: 'clamp(40px,6vw,80px)', alignItems: 'start',
      }}>
        {/* Left */}
        <div ref={leftRef}>
          <div ref={stripeRef} style={{ marginBottom: 24, width: 0 }}>
            <MStripe />
          </div>
          <p data-contact-label style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--body)', margin: '0 0 16px',
          }}>
            <span style={{ color: '#BBBBBB' }}>05</span> — Contact
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.02,
            letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
          }}>
            {[["Let's"], ["build"], ["something", "fast."]].map((line, li) => (
              <div key={li} style={{ display: 'block' }}>
                {line.map((w, wi) => (
                  <span key={wi} className="word-clip" style={{ marginRight: wi < line.length - 1 ? '0.3em' : 0 }}>
                    <span className="word-inner" ref={el => { if (el) headingWordRefs.current[li * 5 + wi] = el; }}>{w}</span>
                  </span>
                ))}
              </div>
            ))}
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 16,
            lineHeight: 1.6, color: 'var(--body)', margin: '24px 0 0', maxWidth: '40ch',
          }}>
            Have a product that needs to feel inevitable? Send a brief — I reply within two days.
          </p>
          <button
            onClick={copyEmail}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(18px,2.5vw,28px)', letterSpacing: '-0.5px', color: '#fff',
              background: 'none', border: 'none', padding: 0, marginTop: 36,
              borderBottom: '1px solid var(--hairline)', paddingBottom: 4,
              cursor: 'none', transition: 'border-color 0.2s ease, opacity 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderBottomColor = '#fff';
              e.currentTarget.style.opacity = '0.75';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderBottomColor = 'var(--hairline)';
              e.currentTarget.style.opacity = '1';
            }}
          >
            {copied ? 'Copied!' : 'zaidjdayed@gmail.com'}
          </button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, marginTop: 36 }}>
            {[
              { label: 'LinkedIn →', href: 'https://www.linkedin.com/in/zaidjdayeh/' },
              { label: 'GitHub →', href: 'https://github.com/Jdayeh' },
            ].map(link => (
              <a
                key={link.href}
                data-contact-link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
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

        {/* Right — form */}
        <div
          ref={rightRef}
          style={{
            background: 'var(--surface-soft)',
            border: '1px solid var(--hairline-strong)',
            padding: 'clamp(28px,4vw,40px)',
          }}
        >
          {!sent ? (
            <form
              onSubmit={async e => {
                e.preventDefault();
                setSubmitting(true);
                const res = await fetch('https://formspree.io/f/mzdlperb', {
                  method: 'POST',
                  body: new FormData(e.currentTarget),
                  headers: { Accept: 'application/json' },
                });
                setSubmitting(false);
                if (res.ok) setSent(true);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <label>
                <span style={labelStyle}>Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--m-blue-light)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--hairline)')}
                />
              </label>
              <label>
                <span style={labelStyle}>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@studio.com"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--m-blue-light)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--hairline)')}
                />
              </label>
              <label>
                <span style={labelStyle}>Message</span>
                <textarea
                  rows={4}
                  name="message"
                  placeholder="What are you building?"
                  required
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--m-blue-light)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--hairline)')}
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', height: 56,
                  background: '#fff', color: '#000',
                  fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                  letterSpacing: '1.5px', textTransform: 'uppercase',
                  border: 'none', cursor: submitting ? 'default' : 'none',
                  opacity: submitting ? 0.6 : 1,
                  transition: 'background 0.18s ease, color 0.18s ease, opacity 0.18s ease',
                }}
                onMouseEnter={e => {
                  if (!submitting) e.currentTarget.style.background = 'var(--m-blue-light)';
                  if (!submitting) e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#000';
                }}
              >
                {submitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, padding: '24px 0' }}>
              <MStripe width="80px" />
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24,
                letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
              }}>Brief received.</h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 16,
                lineHeight: 1.6, color: 'var(--body)', margin: 0,
              }}>Thanks — I&apos;ll be back to you within two days.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
