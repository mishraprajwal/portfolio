import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#38BDF8';


const TRAITS = [
  {
    label: 'Enterprise-trained, startup-tested',
    desc: 'TCS showed me engineering at scale. Saffron showed me what it feels like when your code is one deploy away from a real user. Both changed how I build.',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" style={{ width: 18, height: 18 }}>
        <circle cx="5"  cy="11" r="3"   stroke={ACCENT} strokeWidth="1.5"/>
        <circle cx="17" cy="11" r="3"   stroke={ACCENT} strokeWidth="1.5"/>
        <line x1="8" y1="11" x2="14" y2="11" stroke={ACCENT} strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M11 8l3 3-3 3" stroke={ACCENT} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'I ship outcomes, not tickets',
    desc: 'A closed ticket means nothing if nobody uses it. At a startup you feel that directly — every feature either reaches people or it doesn’t.',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" style={{ width: 18, height: 18 }}>
        <circle cx="11" cy="11" r="8.5"  stroke={ACCENT} strokeWidth="1.5"/>
        <circle cx="11" cy="11" r="4.5"  stroke={ACCENT} strokeWidth="1.3" opacity="0.45"/>
        <circle cx="11" cy="11" r="1.8"  fill={ACCENT}   opacity="0.85"/>
      </svg>
    ),
  },
  {
    label: 'Generalist who goes deep',
    desc: 'Mobile, cloud, ML — same sprint, different problems. At a startup, silos are a luxury you don’t have. Breadth is what keeps you shipping.',
    icon: (
      <svg viewBox="0 0 22 22" fill="none" style={{ width: 18, height: 18 }}>
        <rect x="2" y="2"    width="18" height="4.5" rx="1.2" stroke={ACCENT} strokeWidth="1.5"/>
        <rect x="2" y="8.75" width="13" height="4.5" rx="1.2" stroke={ACCENT} strokeWidth="1.5"/>
        <rect x="2" y="15.5" width="8"  height="4.5" rx="1.2" stroke={ACCENT} strokeWidth="1.5"/>
      </svg>
    ),
  },
];

export default function StartupBanner() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const headlineRef = useRef(null);
  const bodyRef     = useRef(null);
  const cardsRef    = useRef([]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 72%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
    )
    .fromTo(headlineRef.current,
      { opacity: 0, y: 36, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
      '-=0.15'
    )
    .fromTo(bodyRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo(cardsRef.current,
      { opacity: 0, x: 28 },
      { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out', stagger: 0.12 },
      '-=0.6'
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full min-h-screen bg-black text-white flex items-center relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute pointer-events-none" style={{
        top: '-100px', left: '-60px', width: '640px', height: '540px',
        background: `radial-gradient(ellipse at 28% 38%, ${ACCENT}10 0%, transparent 58%)`,
        filter: 'blur(90px)',
      }}/>
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${ACCENT}05 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}05 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }}/>

      <div className="w-full max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-20 relative">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16 lg:gap-20">

          {/* ── LEFT: text ── */}
          <div className="flex-1 min-w-0">

            {/* Eyebrow */}
            <div ref={eyebrowRef} className="flex items-center gap-3 mb-7">
              <div className="w-5 h-px" style={{ background: ACCENT }}/>
              <span className="text-[11px] font-bold tracking-[0.32em] uppercase" style={{ color: ACCENT }}>
                About Me
              </span>
            </div>

            {/* Headline */}
            <h2
              ref={headlineRef}
              className="text-5xl sm:text-6xl md:text-[4.2rem] xl:text-[5rem] font-bold leading-[1.04] tracking-tight text-white mb-8"
            >
              I Code.<br/>
              <span style={{ color: ACCENT }}>People&nbsp;Use.</span>
            </h2>

            {/* Divider */}
            <div className="w-10 h-px mb-8" style={{ background: `${ACCENT}40` }}/>

            {/* Body */}
            <p
              ref={bodyRef}
              className="text-[0.95rem] md:text-base text-white/45 leading-relaxed max-w-lg"
            >
              MS in CS from NJIT. Started at TCS building backend systems
              used by Starbucks customers at scale. Now at Saffron — a small
              AI startup in Seattle where there's no abstraction layer between
              your code and the person running it on their phone. That
              proximity to the user is what makes the work matter.
            </p>

          </div>

          {/* ── RIGHT: trait cards ── */}
          <div className="flex flex-col gap-3 w-full lg:w-72 xl:w-80 shrink-0">
            {TRAITS.map((t, i) => (
              <div
                key={i}
                ref={el => { cardsRef.current[i] = el; }}
                className="relative rounded-2xl p-5 overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${ACCENT}50, transparent)` }}
                />
                <div className="flex items-start gap-3.5">
                  <div
                    className="shrink-0 mt-0.5 p-2 rounded-lg"
                    style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: ACCENT }}
                    >
                      {t.label}
                    </div>
                    <div className="text-xs text-white/38 leading-relaxed">
                      {t.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

