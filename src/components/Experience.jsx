import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);
const baseData = [
  { company: 'Saffron LLC', role: 'Full Stack Engineer', period: 'Feb 2026 - Present', location: 'Seattle, Washington, United States · Hybrid', summary: 'Building data-driven solutions for home connectivity.', stack: ['TypeScript', 'React Native', 'Swift', 'Kotlin', 'AWS', 'CI/CD', 'Redux', 'REST APIs'] },
  { company: 'Tata Consultancy Services', role: 'Software Engineer', period: 'Apr 2021 - Apr 2023', location: 'Mumbai, Maharashtra, India · Hybrid', summary: 'Delivered scalable and low latency backend system services for Starbucks.', stack: ['Java', 'Spring Boot', 'CI/CD', 'MySQL', 'Linux', 'REST APIs'] },
];

export default function Experience() {
  const wrapperRef = useRef(null);
  const cardsRef = useRef([]);

  cardsRef.current = [];
  const addCard = (el) => { if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el); };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const cards = cardsRef.current;
    if (!cards || cards.length === 0) return;

    // Set wrapper height: viewport + extra scroll room for the sticky effect
    const scrollRoom = window.innerHeight * 1.8;
    wrapper.style.height = `${window.innerHeight + scrollRoom}px`;

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        wrapper.querySelector('h2'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: wrapper, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      // Cards entrance
      cards.forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: wrapper, start: 'top 75%', toggleActions: 'play none none none' },
        });
      });

      // Build timeline: focus card 1, hold, unfocus, focus card 2, hold, unfocus
      const tl = gsap.timeline();
      const inners = cards.map(c => c.querySelector('.timeline-card'));

      gsap.set(inners, { scale: 1, boxShadow: '0 10px 28px rgba(0,0,0,0.6)', borderColor: 'rgba(255,255,255,0.04)' });

      inners.forEach((inner) => {
        tl.to(inner, {
          scale: 1.03,
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.04)',
          borderColor: 'rgba(255,255,255,0.12)',
          duration: 0.4, ease: 'power2.out',
        });
        tl.to(inner, { duration: 0.5 }); // hold
        tl.to(inner, {
          scale: 1,
          boxShadow: '0 10px 28px rgba(0,0,0,0.6)',
          borderColor: 'rgba(255,255,255,0.04)',
          duration: 0.3, ease: 'power2.in',
        });
      });

      // Scrub through the timeline as the wrapper scrolls (sticky handles the "pinning")
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        animation: tl,
      });

      // Mouse hover: 3D tilt + scale + glow
      cards.forEach((card) => {
        const inner = card.querySelector('.timeline-card');
        if (!inner) return;

        const handleMove = (e) => {
          const rect = inner.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          gsap.to(inner, {
            rotationX: (py - 0.5) * 8, rotationY: (px - 0.5) * -8,
            scale: 1.04, boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.05)',
            transformPerspective: 800, duration: 0.4, ease: 'power3.out',
          });
        };
        const handleLeave = () => {
          gsap.to(inner, {
            rotationX: 0, rotationY: 0, scale: 1,
            boxShadow: '0 10px 28px rgba(0,0,0,0.6)', duration: 0.5, ease: 'power3.out',
          });
        };
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
      });
    }, wrapper);

    return () => {
      wrapper.style.height = '';
      ctx.revert();
    };
  }, []);

  return (
    <section ref={wrapperRef} id="experience" className="w-full bg-black text-white relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-center mb-10">Career & Experience</h2>

        <div className="space-y-6 w-full">
          {baseData.map((exp, idx) => (
            <article key={idx} ref={addCard} className="timeline-advanced-item">
              <div className="timeline-card p-6 md:p-8 bg-white/[0.03] rounded-xl border border-white/[0.04] flex flex-col justify-between shadow-[0_10px_28px_rgba(0,0,0,0.6)]" style={{ transformStyle: 'preserve-3d', willChange: 'transform', transformOrigin: 'center center' }}>
                <div>
                  <div className="card-header flex items-center justify-between mb-1">
                    <div className="company-info">
                      <h3 className="company-name text-lg md:text-xl font-bold">{exp.company}</h3>
                      <p className="role-title text-sm opacity-85 mt-1">{exp.role}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm text-white/60">{exp.period}</span>
                      <p className="text-sm text-white/50 mt-1">{exp.location}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm md:text-base opacity-70 leading-relaxed">{exp.summary}</p>
                </div>
                {exp.stack && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {exp.stack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-white/[0.04] text-white/80 border border-white/[0.08]">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}