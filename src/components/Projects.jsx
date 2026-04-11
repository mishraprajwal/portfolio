import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const wrapperRef = useRef(null);
  const stickyRef = useRef(null);
  const gridRef = useRef(null);
  const dotsRef = useRef(null);

  const projects = [
    {
      name: 'Hierarchical Root Cause Analysis',
      titleColor: '#F97316',
      github: 'https://github.com/mishraprajwal/rca',
      techStack: ['Python', 'Machine Learning', 'Data Analysis'],
      desc: 'Automated root cause analysis tool for system failures.',
    },
    {
      name: 'AI Code Review Assistant',
      titleColor: '#8B5CF6',
      github: 'https://github.com/mishraprajwal/ai-code-review-assistant',
      techStack: ['Python', 'Java Spring Boot', 'Flask', 'React'],
      desc: 'AI-powered code review assistant for better code quality.',
    },
    {
      name: 'Lecture Summarizer',
      titleColor: '#06B6D4',
      github: 'https://github.com/mishraprajwal/lecture-summarizer',
      techStack: ['Python', 'Flask', 'Open AI', 'NLP'],
      desc: 'Automatic lecture summarization using natural language processing.',
    },
    {
      name: 'Web3 CrowdFunding Platform',
      titleColor: '#10B981',
      github: 'https://github.com/mishraprajwal/CrowdfundingPlatform',
      techStack: ['TypeScript', 'React', 'Web3'],
      desc: 'Decentralized crowdfunding with token-based incentives.',
    },
    {
      name: 'Heart Failure Prediction',
      titleColor: '#EF4444',
      github: 'https://github.com/mishraprajwal/HeartFailurePrediction',
      techStack: ['Machine Learning', 'Python', 'Pandas'],
      desc: 'ML model to assist clinicians in early detection.',
    },
    {
      name: 'Sushi',
      titleColor: '#FBBF24',
      github: 'https://github.com/mishraprajwal/sushi',
      techStack: ['JavaScript', 'HTML', 'CSS'],
      desc: 'A polished frontend demo with delightful micro-interactions.',
    },
  ];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = gridRef.current;
    if (!wrapper || !track) return;

    const cards = Array.from(track.children);
    if (!cards.length) return;

    let ctx;

    const setup = () => {
      if (ctx) ctx.revert();

      const mobile = window.innerWidth < 768;

      ctx = gsap.context(() => {
        // Title reveal
        gsap.fromTo(
          '#projects-title',
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: wrapper, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );

        if (mobile) {
          cards.forEach((card) => {
            gsap.fromTo(card, { opacity: 0, y: 40 }, {
              opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
            });
          });
        } else {
          // Entrance stagger
          gsap.fromTo(cards, { opacity: 0, y: 36, scale: 0.98 }, {
            opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.08, ease: 'expo.out',
            scrollTrigger: { trigger: wrapper, start: 'top 80%' },
          });

          // Horizontal scroll via sticky — no pin needed
          const visibleWidth = track.parentElement.clientWidth;
          // Add right padding so the last card can actually scroll to center
          const lastCard = cards[cards.length - 1];
          const extraPad = Math.max(0, (visibleWidth - lastCard.offsetWidth) / 2);
          track.style.paddingRight = `${extraPad}px`;

          const totalScroll = Math.max(0, track.scrollWidth - visibleWidth);

          const updateActiveCard = (progress) => {
            // Use progress directly to determine active card — exact and works for all cards including last
            const newActive = Math.min(Math.round(progress * (cards.length - 1)), cards.length - 1);
            const currentX = -progress * totalScroll;
            const visibleCenter = visibleWidth / 2;
            cards.forEach((card, i) => {
              const cardCenter = card.offsetLeft + card.offsetWidth / 2 + currentX;
              const dist = Math.abs(cardCenter - visibleCenter);
              // Scale: closer to center = larger
              const normalized = Math.min(dist / (visibleWidth * 0.6), 1);
              const targetScale = 1 - normalized * 0.045;
              gsap.to(card, { scale: targetScale, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
            });
            // Update progress dots — white only, no project color
            dotsRef.current?.querySelectorAll('.prog-dot').forEach((dot, i) => {
              dot.style.opacity = i === newActive ? '1' : '0.25';
              dot.style.transform = i === newActive ? 'scale(1.5)' : 'scale(1)';
              dot.style.backgroundColor = 'rgba(255,255,255,0.9)';
            });
          };

          if (totalScroll > 0) {
            const scrollRoom = totalScroll * 1.4;
            wrapper.style.height = `${window.innerHeight + scrollRoom}px`;

            const trackAnim = gsap.to(track, { x: -totalScroll, ease: 'none' });

            ScrollTrigger.create({
              trigger: wrapper,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
              animation: trackAnim,
              onUpdate: (self) => updateActiveCard(self.progress),
            });

            // Set initial state
            updateActiveCard(0);
          }

          // Mouse tilt + spotlight
          cards.forEach((card, i) => {
            const spotlight = card.querySelector('.card-spotlight');

            const handleMove = (e) => {
              const rect = card.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width;
              const py = (e.clientY - rect.top) / rect.height;
              gsap.to(card, { rotationX: (py - 0.5) * 10, rotationY: (px - 0.5) * -10, scale: 1.03, transformPerspective: 800, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
              if (spotlight) {
                spotlight.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, ${projects[i].titleColor}28 0%, transparent 65%)`;
              }
            };
            const handleLeave = () => {
              gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
              if (spotlight) spotlight.style.background = 'none';
            };
            card.addEventListener('mousemove', handleMove);
            card.addEventListener('mouseleave', handleLeave);
            card.__cleanup = () => {
              card.removeEventListener('mousemove', handleMove);
              card.removeEventListener('mouseleave', handleLeave);
            };
          });
        }
      }, wrapper);
    };

    const raf = requestAnimationFrame(setup);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cards.forEach((c) => { if (c.__cleanup) { c.__cleanup(); delete c.__cleanup; } });
        // Reset wrapper height and track padding before re-measuring
        wrapper.style.height = '';
        track.style.paddingRight = '';
        setup();
      }, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      cards.forEach((c) => { if (c.__cleanup) { c.__cleanup(); delete c.__cleanup; } });
      wrapper.style.height = '';
      track.style.paddingRight = '';
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={wrapperRef} id="projects" className="w-full bg-black text-white relative">
      <div ref={stickyRef} className="md:sticky md:top-0 md:h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 relative w-full">
          <h2
            id="projects-title"
            className="text-2xl sm:text-3xl md:text-5xl font-semibold text-center mb-6 md:mb-12"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            Selected Work
          </h2>

          <div ref={gridRef} className="grid grid-cols-1 gap-5 md:flex md:flex-row md:gap-8 md:items-stretch">
            {projects.map((p, i) => (
              <article
                key={i}
                className="project-card group perspective-800 w-full md:flex-none md:w-[480px] lg:w-[560px]"
                tabIndex={0}
                role="button"
                onClick={() => window.open(p.github, '_blank')}
                style={{
                  '--project-color': p.titleColor,
                  '--project-border-hover': `${p.titleColor}40`,
                  '--card-accent-bg': `radial-gradient(circle at 30% 30%, ${p.titleColor}18, transparent 30%)`,
                }}
              >
                {/* Top accent line in project color */}
                <div className="absolute top-0 left-0 right-0 h-[1px] z-10" style={{ background: `linear-gradient(to right, transparent, ${p.titleColor}50, transparent)` }} />
                <div className="card-accent" aria-hidden></div>
                <div className="card-spotlight" aria-hidden></div>
                <div className="card-sheen" aria-hidden></div>
                <div className="card-hover-overlay" aria-hidden>
                  <div className="overlay-inner flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    View on GitHub
                  </div>
                </div>
                <div className="card-content">
                  <span className="text-[11px] font-medium text-white/30 uppercase tracking-widest mb-2 block">Project {String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-white transition-colors duration-300" style={{ color: p.titleColor }}>{p.name}</h3>
                  <p className="text-sm text-white/50 mb-4 leading-relaxed">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {p.techStack.map((t, id) => (
                      <span key={id} className="tech-badge">{t}</span>
                    ))}
                  </div>
                  {/* Mobile-only GitHub link — overlay is desktop only */}
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md:hidden mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    View on GitHub
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Scroll progress dots — desktop only */}
          <div ref={dotsRef} className="hidden md:flex items-center justify-center gap-2.5 mt-8">
            {projects.map((p, i) => (
              <div
                key={i}
                className="prog-dot w-2 h-2 rounded-full transition-all duration-300"
                style={{ backgroundColor: 'rgba(255,255,255,0.9)', opacity: i === 0 ? 1 : 0.25 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;