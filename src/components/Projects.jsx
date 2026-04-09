import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const wrapperRef = useRef(null);
  const stickyRef = useRef(null);
  const gridRef = useRef(null);

  const projects = [
    {
      name: 'Hierarchical Root Cause Analysis',
      github: 'https://github.com/mishraprajwal/rca',
      techStack: ['Python', 'Machine Learning', 'Data Analysis'],
      desc: 'Automated root cause analysis tool for system failures.',
    },
    {
      name: 'AI Code Review Assistant',
      github: 'https://github.com/mishraprajwal/ai-code-review-assistant',
      techStack: ['Python', 'Java Spring Boot', 'Flask', 'React'],
      desc: 'AI-powered code review assistant for better code quality.',
    },
    {
      name: 'Lecture Summarizer',
      github: 'https://github.com/mishraprajwal/lecture-summarizer',
      techStack: ['Python', 'Flask', 'Open AI', 'NLP'],
      desc: 'Automatic lecture summarization using natural language processing.',
    },
    {
      name: 'Web3 CrowdFunding Platform',
      github: 'https://github.com/mishraprajwal/CrowdfundingPlatform',
      techStack: ['TypeScript', 'React', 'Web3'],
      desc: 'Decentralized crowdfunding with token-based incentives.',
    },
    {
      name: 'Heart Failure Prediction',
      github: 'https://github.com/mishraprajwal/HeartFailurePrediction',
      techStack: ['Machine Learning', 'Python', 'Pandas'],
      desc: 'ML model to assist clinicians in early detection.',
    },
    {
      name: 'Sushi',
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
          const totalScroll = Math.max(0, track.scrollWidth - visibleWidth);

          if (totalScroll > 0) {
            // Set wrapper height to create scroll room
            const scrollRoom = totalScroll * 1.4;
            wrapper.style.height = `${window.innerHeight + scrollRoom}px`;

            gsap.to(track, {
              x: -totalScroll,
              ease: 'none',
              scrollTrigger: {
                trigger: wrapper,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
              },
            });
          }

          // Mouse tilt
          cards.forEach((card) => {
            const handleMove = (e) => {
              const rect = card.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width;
              const py = (e.clientY - rect.top) / rect.height;
              gsap.to(card, { rotationX: (py - 0.5) * 10, rotationY: (px - 0.5) * -10, scale: 1.02, transformPerspective: 800, duration: 0.5, ease: 'power3.out' });
            };
            const handleLeave = () => {
              gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
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
        // Reset wrapper height before re-measuring
        wrapper.style.height = '';
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
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={wrapperRef} id="projects" className="w-full bg-black text-white relative">
      <div ref={stickyRef} className="md:sticky md:top-0 md:h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 relative w-full">
          <h2
            id="projects-title"
            className="text-3xl md:text-5xl font-semibold text-center mb-8 md:mb-12"
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
              >
                <div className="card-accent" aria-hidden></div>
                <div className="card-sheen" aria-hidden></div>
                <div className="card-hover-overlay" aria-hidden>
                  <div className="overlay-inner">View details</div>
                </div>
                <div className="card-content">
                  <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
                  <p className="text-sm text-gray-300 mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.techStack.map((t, id) => (
                      <span key={id} className="tech-badge">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <span className="text-sm text-gray-400">&nbsp;</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-6">Technologies & Tools</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['React','Node','TypeScript','Python','Docker','AWS','GraphQL','Web3'].map((t) => (
                <span key={t} className="tech-pill">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;