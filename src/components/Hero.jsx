import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useEffect, useState } from 'react';

const companies = [
  { name: 'Saffron LLC', color: '#F4A900' },
  { name: 'Tata Consultancy Services', color: '#3B82F6' },
];

const Hero = () => {
  const heroRef = useRef(null);
  const eyebrowRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);
  const companyRef = useRef(null);
  const ruleRef = useRef(null);
  const numeralRef = useRef(null);
  const [companyIndex, setCompanyIndex] = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.4'
    );

    // editorial reveal: line rises through a soft blur, like ink resolving into focus
    tl.fromTo(
      '.hero-line',
      { opacity: 0, y: 46, filter: 'blur(14px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out', stagger: 0.12 },
      '-=0.35'
    );

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9 },
      '-=0.5'
    );

    tl.fromTo(
      ruleRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.1, ease: 'power3.inOut', transformOrigin: 'left center' },
      '-=0.6'
    );

    tl.fromTo(
      numeralRef.current,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 1 },
      '-=0.9'
    );

    // gentle parallax on scroll
    gsap.to(nameRef.current, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to(numeralRef.current, {
      yPercent: 20,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  // Cycle company name every 3 seconds with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      const el = companyRef.current;
      if (!el) return;
      gsap.to(el, {
        opacity: 0, y: -6, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          setCompanyIndex(prev => (prev + 1) % companies.length);
          gsap.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        },
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={heroRef}
      className="w-full min-h-dvh relative overflow-hidden flex items-center"
      style={{ color: 'var(--ink)' }}
    >
      {/* oversized ghost numeral, editorial page-index style */}
      <div
        ref={numeralRef}
        className="font-serif-display absolute right-[4%] top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none"
        style={{ fontSize: 'min(42vw, 520px)', color: 'rgba(255,255,255,0.05)', fontStyle: 'italic' }}
      >
        01
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20 pt-24 lg:pt-0">
        <p
          ref={eyebrowRef}
          className="text-xs sm:text-sm font-medium tracking-[0.28em] uppercase mb-6"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          Software Engineer — Seattle, WA
        </p>

        <h1
          ref={nameRef}
          className="font-serif-display font-medium tracking-tight leading-[0.98]"
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
        >
          <span className="hero-line block overflow-hidden">Prajwal</span>
          <span className="hero-line block overflow-hidden italic" style={{ marginLeft: 'clamp(0px, 8vw, 5rem)' }}>
            Mishra
          </span>
        </h1>

        <div ref={subtitleRef} className="mt-8 sm:mt-10 max-w-xl">
          <p className="font-serif-display text-lg sm:text-xl md:text-2xl italic leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Currently building at{' '}
            <span
              ref={companyRef}
              style={{ color: companies[companyIndex].color, transition: 'color 0.3s ease' }}
            >
              {companies[companyIndex].name}
            </span>
            .
          </p>
        </div>

        <div ref={ruleRef} className="mt-14 sm:mt-16 h-px w-full" style={{ background: 'rgba(255,255,255,0.2)' }} />

        <div className="mt-4 flex items-center justify-between text-[11px] sm:text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>Portfolio — 2026</span>
          <span>Scroll to explore</span>
        </div>
      </div>

      {/* continuously scrolling marquee: constant, obvious motion */}
      <div className="marquee-track absolute bottom-0 left-0 right-0 z-10 py-3 border-t border-white/10 overflow-hidden" style={{ background: 'rgba(7,7,10,0.6)', backdropFilter: 'blur(6px)' }}>
        <div className="marquee-content flex whitespace-nowrap text-xs sm:text-sm tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 pr-8">
              <span>React</span><span>·</span><span>AWS</span><span>·</span><span>Python</span><span>·</span>
              <span>TypeScript</span><span>·</span><span>Machine Learning</span><span>·</span>
              <span>React Native</span><span>·</span><span>Java</span><span>·</span>
              <span>Serverless</span><span>·</span><span>CI/CD</span><span>·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
