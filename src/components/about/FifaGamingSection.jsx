import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../About.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Inline SVG controller matching the user's image ── */
const Controller = ({ className }) => (
  <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Controller body */}
    <path
      d="M40 55 C40 35, 70 20, 120 20 C170 20, 200 35, 200 55 L210 110 C215 130, 200 145, 180 140 L160 132 C150 128, 140 130, 130 130 L110 130 C100 130, 90 128, 80 132 L60 140 C40 145, 25 130, 30 110 Z"
      stroke="white" strokeWidth="4" fill="rgba(255,255,255,0.03)"
      strokeLinejoin="round"
    />
    {/* D-pad */}
    <rect x="62" y="58" width="10" height="30" rx="2" fill="white" />
    <rect x="52" y="68" width="30" height="10" rx="2" fill="white" />
    {/* Action buttons */}
    <circle cx="170" cy="60" r="5" fill="white" />
    <circle cx="182" cy="72" r="5" fill="white" />
    <circle cx="158" cy="72" r="5" fill="white" />
    <circle cx="170" cy="84" r="5" fill="white" />
    {/* Center buttons */}
    <rect x="105" y="65" width="12" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
    <rect x="123" y="65" width="12" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
    {/* Analog sticks */}
    <circle cx="90" cy="95" r="10" stroke="white" strokeWidth="2.5" fill="rgba(255,255,255,0.05)" />
    <circle cx="150" cy="95" r="10" stroke="white" strokeWidth="2.5" fill="rgba(255,255,255,0.05)" />
  </svg>
);

export default function FifaGamingSection() {
  const sectionRef = useRef(null);
  const [goals, setGoals] = useState(145035);
  const [wins, setWins] = useState(777);
  const [draws, setDraws] = useState(28);
  const [losses, setLosses] = useState(33);
  const counterRef = useRef(null);
  const intervalsRef = useRef({});

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Left content reveal
      gsap.fromTo(
        el.querySelectorAll('.fifa-reveal'),
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' } }
      );

      // Controller entrance — slide from right with rotation
      gsap.fromTo(
        el.querySelector('.controller-visual'),
        { x: -80, autoAlpha: 0, rotation: -12 },
        { x: 0, autoAlpha: 1, rotation: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' } }
      );

      // Stats cards pop-in
      gsap.fromTo(
        el.querySelectorAll('.stat-card'),
        { y: 30, autoAlpha: 0, scale: 0.95 },
        { y: 0, autoAlpha: 1, scale: 1, stagger: 0.08, duration: 0.7, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: el, start: 'top 70%' } }
      );

      // Counters — increase while in view
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: startCounters,
        onEnterBack: startCounters,
        onLeave: stopCounters,
        onLeaveBack: stopCounters,
      });
    }, el);

    function startCounters() {
      if (intervalsRef.current.goals) return;
      intervalsRef.current.goals = setInterval(() => {
        setGoals(g => {
          const next = g + Math.floor(Math.random() * 5) + 1;
          if (counterRef.current) {
            gsap.fromTo(counterRef.current, { scale: 0.97 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.6)' });
          }
          return next;
        });
      }, 250);
      intervalsRef.current.wins = setInterval(() => {
        const r = Math.random();
        if (r < 0.6) setWins(w => w + 1);
        else if (r < 0.8) setDraws(d => d + 1);
        else setLosses(l => l + 1);
      }, 1800);
    }

    function stopCounters() {
      Object.values(intervalsRef.current).forEach(clearInterval);
      intervalsRef.current = {};
    }

    return () => { stopCounters(); ctx.revert(); };
  }, []);

  return (
    <section ref={sectionRef} className="about-section relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-0 w-full">

        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-8 lg:gap-16">

          {/* Left: Floating controller */}
          <div className="controller-visual flex-shrink-0 flex items-center justify-center relative">
            <div className="controller-glow absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/[0.02] blur-3xl" />
            <div className="controller-float relative">
              <Controller className="w-40 h-28 md:w-56 md:h-40 lg:w-72 lg:h-52" />
            </div>
          </div>

          {/* Right: Text + Stats */}
          <div className="flex-1 text-center lg:text-left">
            <p className="fifa-reveal text-xs md:text-sm font-medium tracking-widest uppercase text-white/40 mb-2">
              Off-duty mode
            </p>
            <h3 className="fifa-reveal text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              FIFA — Controller & Conqueror
            </h3>
            <p className="fifa-reveal mt-2 md:mt-3 text-sm md:text-base text-white/60 leading-relaxed max-w-lg">
              When I'm not shipping code, I'm shipping goals. 
              My debugging skills carry over — reading opponents like stack traces, 
              finding gaps in defense like finding bugs in production.
            </p>

            {/* Live counter */}
            <div className="fifa-reveal mt-5 md:mt-6">
              <div ref={counterRef} className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter tabular-nums inline-block">
                {goals.toLocaleString()}
              </div>
              <p className="text-xs text-white/40 mt-0.5">career goals — and counting</p>
            </div>

            {/* Stats grid */}
            <div className="fifa-reveal mt-4 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3 max-w-sm mx-auto lg:mx-0 w-full">
              <div className="stat-card rounded-xl border border-green-500/20 bg-green-500/[0.05] p-3 text-center">
                <div className="text-xl md:text-2xl font-bold text-green-400 tabular-nums">{wins.toLocaleString()}</div>
                <p className="text-[10px] md:text-xs text-green-400/60 mt-0.5">Wins</p>
              </div>
              <div className="stat-card rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
                <div className="text-xl md:text-2xl font-bold text-white tabular-nums">{draws.toLocaleString()}</div>
                <p className="text-[10px] md:text-xs text-white/50 mt-0.5">Draws</p>
              </div>
              <div className="stat-card rounded-xl border border-red-500/20 bg-red-500/[0.05] p-3 text-center">
                <div className="text-xl md:text-2xl font-bold text-red-400 tabular-nums">{losses.toLocaleString()}</div>
                <p className="text-[10px] md:text-xs text-red-400/60 mt-0.5">Losses</p>
              </div>
            </div>

            <p className="fifa-reveal mt-4 text-white/30 text-xs italic max-w-md mx-auto lg:mx-0">
              "I don't rage quit — I call it an aggressive deployment rollback."
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
