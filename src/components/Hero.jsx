import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useEffect, useState } from 'react';

const companies = [
  { name: 'Saffron LLC', color: '#F4A900' },
  { name: 'Tata Consultancy Services', color: '#3B82F6' },
];

const Hero = () => {
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);
  const companyRef = useRef(null);
  const [companyIndex, setCompanyIndex] = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Background fade-in
    tl.fromTo(
      heroRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    // Name animation: smooth fade + blur reveal (Apple-style)
    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 30, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.4,
        ease: 'power3.out',
      },
      '-=0.6'
    );

    // Subtitle animation (start shortly after name finishes)
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      '+=0.12'
    );

    // Parallax on scroll
    gsap.to(nameRef.current, {
      yPercent: -10,
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
        opacity: 0, y: -8, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          setCompanyIndex(prev => (prev + 1) % companies.length);
          gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        },
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={heroRef}
      className="w-full min-h-dvh bg-black text-white flex items-center relative overflow-hidden"
    >
      {/* soft vignette and gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.85)_70%)]"></div>
      </div>

      <div className="z-10 px-6 sm:px-10 md:px-16 lg:px-24 w-full">
        <h1
          ref={nameRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          style={{ fontFamily: 'SF Pro Display, sans-serif', fontWeight: 400 }}
        >
          Prajwal Mishra
        </h1>

        <div
          ref={subtitleRef}
          className="mt-4 sm:mt-6"
          style={{ fontFamily: 'SF Pro Text, sans-serif' }}
        >
          <p className="text-sm sm:text-base md:text-lg font-light text-white">
            Software Developer at{' '}
            <span
              ref={companyRef}
              className="font-normal"
              style={{ color: companies[companyIndex].color, transition: 'color 0.3s ease' }}
            >
              {companies[companyIndex].name}
            </span>
          </p>
          <p className="text-xs sm:text-sm md:text-base font-light text-gray-500 mt-1.5">
            Based in Seattle, WA
          </p>
        </div>
      </div>

      <div className="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>
    </section>
  );
};

export default Hero;