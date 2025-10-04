import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useEffect } from 'react';
import HeroCanvas from './HeroCanvas'

const Hero = () => {
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Background fade-in
    tl.fromTo(
      heroRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    // Name animation: Letters fade in with scale and blur
    const letters = nameRef.current.querySelectorAll('.letter');
    tl.fromTo(
      letters,
      { opacity: 0, y: 100, scale: 0.9, filter: 'blur(5px)' },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
      },
      '-=0.8'
    );

    // Subtitle animation (start shortly after name finishes)
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      '+=0.12'
    );

    // CTA animation: reveal button first, then small hint text to avoid overlap
    const ctaChildren = ctaRef.current ? Array.from(ctaRef.current.children) : [];
    const ctaAnchor = ctaChildren[0];
    const ctaHint = ctaChildren[1];

    if (ctaAnchor) {
      tl.fromTo(
        ctaAnchor,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'back.out(1.2)' },
        '+=0.08'
      );
    }

    if (ctaHint) {
      tl.fromTo(
        ctaHint,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '+=0.12'
      );
    }

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

  return (
    <section
      ref={heroRef}
      className="w-full h-screen bg-black text-white flex items-center justify-center relative overflow-hidden"
    >
      {/* 3D background canvas */}
      <HeroCanvas />

      {/* soft vignette and gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.85)_70%)]"></div>
      </div>
      <div className="text-center z-10">
        {/* Full name with space */}
        <h1
          ref={nameRef}
          className="text-6xl md:text-5xl font-bold tracking-tight"
          style={{ fontFamily: 'SF Pro Display, sans-serif', fontWeight: 400 }}
        >
          {/* Prajwal */}
          <span className="letter inline-block">P</span>
          <span className="letter inline-block">r</span>
          <span className="letter inline-block">a</span>
          <span className="letter inline-block">j</span>
          <span className="letter inline-block">w</span>
          <span className="letter inline-block">a</span>
          <span className="letter inline-block">l</span>
          <span className="letter inline-block">&nbsp;</span>
          <span className="letter inline-block">M</span>
          <span className="letter inline-block">i</span>
          <span className="letter inline-block">s</span>
          <span className="letter inline-block">h</span>
          <span className="letter inline-block">r</span>
          <span className="letter inline-block">a</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 text-xl md:text-2xl font-light text-gray-500 max-w-xl mx-auto"
          style={{ fontFamily: 'SF Pro Text, sans-serif', fontWeight: 300 }}
        >
          I'm a software developer based in New York.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="mt-10 flex flex-col items-center gap-4">
          <a
            href="#projects"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-200 transition duration-300"
            style={{ fontFamily: 'SF Pro Text, sans-serif', fontWeight: 500 }}
          >
            Explore My Work
          </a>
          <p
            className="text-sm text-gray-400"
            style={{ fontFamily: 'SF Pro Text, sans-serif', fontWeight: 400 }}
          >
            Scroll to discover
          </p>
        </div>
      </div>

      <div className="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>
    </section>
  );
};

export default Hero;