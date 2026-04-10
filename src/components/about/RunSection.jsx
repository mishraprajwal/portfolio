import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../About.css';

gsap.registerPlugin(ScrollTrigger);

const DAILY_RUN = 3.28;
const HIGHEST_RUN = 8.5;

/* ── Strava-style card with animated route path ── */
const StravaCard = ({ className }) => (
  <div className={`${className} bg-black rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_20px_80px_rgba(0,0,0,0.6)] aspect-[9/16] flex flex-col items-center justify-between py-10 px-6 relative`}>
    {/* Stats */}
    <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4">
      <div className="text-center">
        <p className="text-white/50 text-xs sm:text-sm font-medium tracking-wide">Distance</p>
        <p className="text-white text-3xl sm:text-4xl font-bold tracking-tight mt-0.5">3.28 <span className="text-xl sm:text-2xl font-medium">mi</span></p>
      </div>
      <div className="text-center">
        <p className="text-white/50 text-xs sm:text-sm font-medium tracking-wide">Pace</p>
        <p className="text-white text-3xl sm:text-4xl font-bold tracking-tight mt-0.5">7:05 <span className="text-xl sm:text-2xl font-medium">/mi</span></p>
      </div>
      <div className="text-center">
        <p className="text-white/50 text-xs sm:text-sm font-medium tracking-wide">Time</p>
        <p className="text-white text-3xl sm:text-4xl font-bold tracking-tight mt-0.5">23m 15s</p>
      </div>
    </div>

    {/* Route SVG with animated path */}
    <div className="w-full px-2 mt-4">
      <svg viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <path
          className="route-path"
          d="M60 30 L45 50 L30 65 L40 80 L55 85 L70 75 L65 55 L60 30 L80 35 L120 50 L160 55 L200 52 L240 58 L270 65"
          stroke="#FF5722"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Start dot */}
        <circle className="route-dot-start" cx="60" cy="30" r="4" fill="#FF5722" opacity="0" />
        {/* End dot */}
        <circle className="route-dot-end" cx="270" cy="65" r="4" fill="#FF5722" opacity="0" />
      </svg>
    </div>


  </div>
);

export default function RunSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.run-reveal'),
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' } }
      );

      gsap.fromTo(
        el.querySelector('.run-card-wrap'),
        { x: 60, autoAlpha: 0, scale: 0.95 },
        { x: 0, autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' } }
      );

      gsap.fromTo(
        el.querySelectorAll('.run-stat'),
        { y: 30, autoAlpha: 0, scale: 0.9 },
        { y: 0, autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.7, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: el, start: 'top 70%' } }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="about-section relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-0 w-full">

        <div className="flex flex-col-reverse lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16">

          {/* Left: Text + Stats */}
          <div className="flex-1 text-center lg:text-left">
            <p className="run-reveal text-xs md:text-sm font-medium tracking-widest uppercase text-orange-400/60 mb-2">
              On the road
            </p>
            <h3 className="run-reveal text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Miles Before Meetings
            </h3>
            <p className="run-reveal mt-2 md:mt-3 text-sm md:text-base text-white/50 leading-relaxed max-w-lg">
              Every morning starts with a run — no playlist, no excuses.
              It's where the best ideas come from and the worst bugs get debugged mentally.
              Consistency over intensity.
            </p>

            {/* Stats */}
            <div className="run-reveal mt-6 md:mt-8 grid grid-cols-2 gap-3 sm:gap-4 max-w-sm mx-auto lg:mx-0">
              <div className="run-stat rounded-xl border border-orange-500/15 bg-orange-500/[0.04] p-4 sm:p-5 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter tabular-nums">
                  {DAILY_RUN}
                </div>
                <p className="text-[10px] sm:text-xs text-orange-400/60 mt-1 font-medium">miles / day</p>
              </div>
              <div className="run-stat rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter tabular-nums">
                  {HIGHEST_RUN}
                </div>
                <p className="text-[10px] sm:text-xs text-white/40 mt-1 font-medium">miles — longest</p>
              </div>
            </div>

            {/* Minimal progress bar for daily goal */}
            <div className="run-reveal mt-5 max-w-sm mx-auto lg:mx-0">
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/40 mb-1.5">
                <span>Today's goal</span>
                <span className="text-white/60 font-medium">3.28 mi</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500/60 to-orange-400/80 run-progress"
                  style={{ width: '100%' }}
                />
              </div>
              <p className="text-[9px] text-orange-400/40 mt-1 text-right">✓ completed</p>
            </div>

            <p className="run-reveal mt-5 text-white/25 text-xs italic max-w-md mx-auto lg:mx-0">
              "Clear mind, clean code — one mile at a time."
            </p>
          </div>

          {/* Right: Animated Strava card */}
          <div className="run-card-wrap flex-shrink-0 w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px]">
            <StravaCard className="w-full" />
          </div>
        </div>

      </div>
    </section>
  );
}
