import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const wrapperRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const projects = [
    {
      name: 'Hierarchical Root Cause Analysis',
      type: 'AI & Observability',
      titleColor: '#F97316',
      github: 'https://github.com/mishraprajwal/rca',
      techStack: ['Python', 'Machine Learning', 'Data Analysis'],
      desc: 'Automated root cause analysis that traces failures across distributed service layers. Pinpoints cascading issues faster than manual inspection.',
    },
    {
      name: 'AI Code Review Assistant',
      type: 'DevTools & AI',
      titleColor: '#8B5CF6',
      github: 'https://github.com/mishraprajwal/ai-code-review-assistant',
      techStack: ['Python', 'Java Spring Boot', 'Flask', 'React'],
      desc: 'AI-powered code review integrated into developer workflows. Flags bugs, suggests refactors, and enforces standards before merge.',
    },
    {
      name: 'Lecture Summarizer',
      type: 'NLP & Productivity',
      titleColor: '#06B6D4',
      github: 'https://github.com/mishraprajwal/lecture-summarizer',
      techStack: ['Python', 'Flask', 'Open AI', 'NLP'],
      desc: 'Turns hours of lecture audio into structured summaries using NLP. Extracts key concepts, topics, and action items automatically.',
    },
    {
      name: 'Web3 CrowdFunding Platform',
      type: 'Web3 & DeFi',
      titleColor: '#10B981',
      github: 'https://github.com/mishraprajwal/CrowdfundingPlatform',
      techStack: ['TypeScript', 'React', 'Web3'],
      desc: 'Decentralized crowdfunding with transparent on-chain fund tracking. Smart contract–based milestone releases eliminate fraud risk.',
    },
    {
      name: 'Heart Failure Prediction',
      type: 'Healthcare AI',
      titleColor: '#EF4444',
      github: 'https://github.com/mishraprajwal/HeartFailurePrediction',
      techStack: ['Machine Learning', 'Python', 'Pandas'],
      desc: 'ML model trained on clinical data to flag at-risk patients early. Assists clinicians with probability scores and feature attribution.',
    },
    {
      name: 'Sushi',
      type: 'Frontend',
      titleColor: '#FBBF24',
      github: 'https://github.com/mishraprajwal/sushi',
      techStack: ['JavaScript', 'HTML', 'CSS'],
      desc: 'Polished frontend demo with smooth scroll and pixel-perfect responsive design. Built with vanilla JS and delightful micro-interactions.',
    },
  ];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        '#projects-title',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: wrapper, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      if (isMobile) {
        // Mobile: simple stagger reveal of mini cards
        const mobileCards = wrapper.querySelectorAll('.proj-mobile-card');
        mobileCards.forEach((card, i) => {
          gsap.fromTo(card, { opacity: 0, y: 32 }, {
            opacity: 1, y: 0, duration: 0.6, delay: i * 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' },
          });
        });
        return;
      }

      // ── MORPHING SINGLE CARD (Option D) ─────────────────────────────────
      // One large card stays fixed center. For each project step:
      //   1. Old content clips out upward
      //   2. Background color and glow morph
      //   3. New content clips in from below
      // The card never moves — only its soul changes.

      const morphCard = wrapper.querySelector('.morph-card');
      const progressBar = wrapper.querySelector('.morph-progress-bar');
      let currentIdx = 0;
      let isAnimating = false;

      // Layers we'll animate
      const bgGlow = morphCard.querySelector('.morph-glow');
      const accentLine = morphCard.querySelector('.morph-accent');
      const watermark = morphCard.querySelector('.morph-watermark');
      const typeEl = morphCard.querySelector('.morph-type');
      const titleEl = morphCard.querySelector('.morph-title');
      const descEl = morphCard.querySelector('.morph-desc');
      const tagsEl = morphCard.querySelector('.morph-tags');
      const counterEl = morphCard.querySelector('.morph-counter');

      const setContent = (idx, animate) => {
        const p = projects[idx];
        if (!animate) {
          typeEl.textContent = p.type;
          typeEl.style.color = p.titleColor;
          typeEl.style.borderColor = `${p.titleColor}35`;
          typeEl.style.backgroundColor = `${p.titleColor}12`;
          titleEl.textContent = p.name;
          titleEl.style.color = p.titleColor;
          descEl.textContent = p.desc;
          watermark.textContent = String(idx + 1).padStart(2, '0');
          watermark.style.color = `${p.titleColor}10`;
          counterEl.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
          tagsEl.innerHTML = p.techStack.map(t => `<span class="tech-badge">${t}</span>`).join('');
          accentLine.style.background = `linear-gradient(to right, transparent, ${p.titleColor}60, transparent)`;
          bgGlow.style.background = `radial-gradient(ellipse at 70% 20%, ${p.titleColor}18 0%, transparent 60%)`;
          morphCard.style.boxShadow = `0 32px 80px rgba(0,0,0,0.75), 0 0 80px -30px ${p.titleColor}35`;
          morphCard.style.borderColor = `${p.titleColor}30`;
          return;
        }

        if (isAnimating) return;
        isAnimating = true;

        const contentEls = [typeEl, titleEl, descEl, tagsEl];
        const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });

        // Step 1: clip old content upward
        tl.to(contentEls, {
          y: -20, opacity: 0, duration: 0.28, ease: 'power2.in', stagger: 0.04,
        });

        // Step 2: swap content + morph colors (instant, mid-transition)
        tl.call(() => {
          typeEl.textContent = p.type;
          typeEl.style.color = p.titleColor;
          typeEl.style.borderColor = `${p.titleColor}35`;
          typeEl.style.backgroundColor = `${p.titleColor}12`;
          titleEl.textContent = p.name;
          titleEl.style.color = p.titleColor;
          descEl.textContent = p.desc;
          watermark.textContent = String(idx + 1).padStart(2, '0');
          counterEl.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
          tagsEl.innerHTML = p.techStack.map(t => `<span class="tech-badge">${t}</span>`).join('');
          gsap.set(contentEls, { y: 22 });

          // Morph ambient colors
          gsap.to(accentLine, { duration: 0.4, ease: 'none',
            background: `linear-gradient(to right, transparent, ${p.titleColor}60, transparent)` });
          gsap.to(bgGlow, { duration: 0.5, ease: 'power1.out',
            background: `radial-gradient(ellipse at 70% 20%, ${p.titleColor}18 0%, transparent 60%)` });
          gsap.to(morphCard, { duration: 0.5, ease: 'power2.out',
            boxShadow: `0 32px 80px rgba(0,0,0,0.75), 0 0 80px -30px ${p.titleColor}35`,
            borderColor: `${p.titleColor}30` });
          gsap.to(watermark, { duration: 0.4, color: `${p.titleColor}10`, ease: 'none' });
        });

        // Step 3: reveal new content from below
        tl.to(contentEls, {
          y: 0, opacity: 1, duration: 0.32, ease: 'power3.out', stagger: 0.05,
        });
      };

      // Initialize with first project
      setContent(0, false);

      // Update dots
      const updateDots = (idx) => {
        wrapper.querySelectorAll('.proj-dot').forEach((dot, i) => {
          dot.style.opacity = i === idx ? '1' : '0.3';
          dot.style.transform = i === idx ? 'scale(1.5)' : 'scale(1)';
          dot.style.backgroundColor = projects[idx].titleColor;
        });
      };
      updateDots(0);

      // Build timeline: hold on each project
      const tl = gsap.timeline();
      projects.forEach((_, i) => {
        tl.to({}, { duration: 1 }); // hold
        if (i < projects.length - 1) {
          tl.call(() => {
            currentIdx = i + 1;
            setActiveIdx(i + 1);
            setContent(i + 1, true);
            updateDots(i + 1);
            // Update progress bar
            if (progressBar) {
              gsap.to(progressBar, { width: `${((i + 1) / (projects.length - 1)) * 100}%`, duration: 0.5, ease: 'power2.out' });
            }
          });
        }
      });

      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: `+=${projects.length * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: false,
        animation: tl,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * projects.length),
            projects.length - 1
          );
          if (idx !== currentIdx && !isAnimating) {
            currentIdx = idx;
            setActiveIdx(idx);
            setContent(idx, true);
            updateDots(idx);
            if (progressBar) {
              gsap.to(progressBar, { width: `${(idx / (projects.length - 1)) * 100}%`, duration: 0.3, ease: 'power2.out' });
            }
          }
        },
      });

    }, wrapper);

    return () => { ctx.revert(); };
  }, []);

  const p = projects[activeIdx];

  return (
    <section ref={wrapperRef} id="projects" className="w-full bg-black text-white relative">
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 md:py-0">
        <div className="w-full max-w-7xl mx-auto">
          <h2
            id="projects-title"
            className="text-2xl sm:text-3xl md:text-5xl font-semibold text-center mb-8 md:mb-12"
          >
            Selected Work
          </h2>

          {/* ── DESKTOP: morphing center card ── */}
          <div className="hidden md:flex flex-col items-center gap-8">
            <div
              className="morph-card group relative overflow-hidden rounded-2xl border backdrop-blur-md w-full max-w-2xl cursor-pointer"
              style={{
                height: '380px',
                background: 'rgba(255,255,255,0.04)',
                borderColor: `${p.titleColor}30`,
                boxShadow: `0 32px 80px rgba(0,0,0,0.75), 0 0 80px -30px ${p.titleColor}35`,
                transition: 'border-color 500ms ease',
              }}
              onClick={() => window.open(p.github, '_blank')}
              role="button"
              tabIndex={0}
            >
              {/* Ambient glow layer */}
              <div className="morph-glow absolute inset-0 pointer-events-none" />
              {/* Top accent line */}
              <div className="morph-accent absolute top-0 left-0 right-0 h-[1px]" />
              {/* Watermark */}
              <div className="morph-watermark absolute bottom-[-1rem] right-6 text-[9rem] font-black leading-none pointer-events-none select-none z-[1]" style={{ letterSpacing: '-0.05em' }} />

              {/* Counter */}
              <div className="morph-counter absolute top-5 right-6 text-[10px] font-bold tracking-[0.2em] uppercase opacity-20 z-10" />

              {/* GitHub hint */}
              <div className="absolute bottom-5 right-6 flex items-center gap-1.5 text-xs text-white/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                View on GitHub
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full p-8 md:p-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="morph-type card-type-badge" />
                </div>
                <h3 className="morph-title text-2xl md:text-3xl font-bold leading-snug mb-4" />
                <p className="morph-desc text-sm md:text-base text-white/50 leading-relaxed flex-1" />
                <div className="morph-tags flex flex-wrap gap-2 mt-5" />
              </div>
            </div>

            {/* Progress bar + dots */}
            <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div className="morph-progress-bar h-full rounded-full" style={{ width: '0%', backgroundColor: p.titleColor, transition: 'background-color 400ms ease' }} />
              </div>
              <div className="flex items-center gap-3">
                {projects.map((proj, i) => (
                  <div
                    key={i}
                    className="proj-dot w-2 h-2 rounded-full transition-all duration-300"
                    style={{ backgroundColor: proj.titleColor, opacity: i === 0 ? 1 : 0.3 }}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-white/25 tracking-widest uppercase">Scroll to explore</p>
          </div>

          {/* ── MOBILE: stacked list ── */}
          <div className="flex flex-col gap-5 md:hidden">
            {projects.map((proj, i) => (
              <article
                key={i}
                className="proj-mobile-card relative overflow-hidden rounded-2xl border p-5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: `${proj.titleColor}25`,
                }}
                onClick={() => window.open(proj.github, '_blank')}
              >
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${proj.titleColor}60, transparent)` }} />
                <div className="flex items-center justify-between mb-2">
                  <span className="card-type-badge" style={{ color: proj.titleColor, borderColor: `${proj.titleColor}35`, backgroundColor: `${proj.titleColor}12` }}>{proj.type}</span>
                  <span className="text-[10px] text-white/25 font-bold tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: proj.titleColor }}>{proj.name}</h3>
                <p className="text-xs text-white/45 leading-relaxed mb-3">{proj.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((t, id) => <span key={id} className="tech-badge">{t}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;