import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);
const baseData = [
  { company: 'Emerald Ark', role: 'Software Engineer — Full Stack', period: 'Aug 2025 - Present', location: 'Remote', summary: 'Building resilient, developer-first platform features.' },
  { company: 'Tata Consultancy Services', role: 'Software Engineer', period: 'Apr 2021 - Apr 2023', location: 'Mumbai, India', summary: 'Engineered high-throughput microservices.' },
  { company: 'JBA Infosolutions Pvt. Ltd.', role: 'Junior Full Stack Developer', period: 'Jun 2020 - Apr 2021', location: 'Mumbai, India', summary: 'Delivered customer-facing apps and automated pipelines.' }
];

export default function Experience() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const cardsRef = useRef([]);

  cardsRef.current = [];
  const addCard = (el) => { if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el); };

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const cards = cardsRef.current;
    if (!cards || cards.length === 0) return;

    // initial state: slightly small
    gsap.set(cards, { scale: 0.92, autoAlpha: 0.95, y: 0, transformOrigin: 'center center' });

    // build timeline: each card scales up, holds, then scales back as next grows
    const tl = gsap.timeline({ paused: false });
    const per = 1; // seconds per card; visual length will be controlled by ScrollTrigger scrub

    cards.forEach((card, i) => {
      tl.to(card, { scale: 1.06, boxShadow: '0 30px 60px rgba(0,0,0,0.35)', zIndex: 50, duration: per * 0.6, ease: 'power2.out' }, i * per);
      tl.to(card, { scale: 0.96, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', zIndex: 10, duration: per * 0.4, ease: 'power2.in' }, i * per + per * 0.6);
    });

    // compute scroll range based on number of cards and viewport
    const total = Math.max(600, cards.length * window.innerHeight * 0.9);

    // compute snap points (normalized 0..1) so the scroll will snap to each card position
    // we use fraction of timeline time where each card's animation starts
    const snapPoints = cards.map((_, i) => (i * per) / tl.duration());

    const st = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: `+=${total}`,
      pin: true,
      scrub: 0.6,
      // snap to the nearest card position when scrolling settles
      snap: { snapTo: snapPoints, duration: 0.6, ease: 'power3.inOut' },
      onUpdate(self) {
        // map scroll progress to timeline time
        const p = self.progress || 0;
        tl.time(p * tl.duration(), false);
      }
    });

    return () => {
      try { st.kill(); } catch (e) {}
      try { tl.kill(); } catch (e) {}
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={rootRef} id="experience" className="w-full min-h-screen bg-black text-white py-24 px-4 relative overflow-hidden">
      <div ref={pinRef} className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-12">Career & Experience</h2>

        <div className="timeline-advanced relative">
          <div className="timeline-advanced-list space-y-20">
            {baseData.map((exp, idx) => (
              <article key={idx} ref={addCard} className={`timeline-advanced-item relative max-w-6xl mx-auto`}>
                <div className="timeline-dot absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
                <div className={`timeline-card p-14 bg-white/5 rounded-lg`}> 
                  <div className="card-header flex items-center justify-between">
                    <div className="company-info">
                      <h3 className="company-name text-xl font-bold">{exp.company}</h3>
                      <p className="role-title text-sm opacity-80">{exp.role}</p>
                    </div>
                    <div className="duration-badge text-sm opacity-80">{exp.period}</div>
                  </div>
                  <div className="card-body mt-4">
                    <p className="location text-sm opacity-70">{exp.location}</p>
                    <p className="mt-3 text-sm opacity-70">{exp.summary}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}