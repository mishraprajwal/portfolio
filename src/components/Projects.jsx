import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const projectsRef = useRef(null);
  const gridRef = useRef(null);

  const projects = [
    {
      name: 'Real-Time Admin Dashboard',
      github: 'https://github.com/mishraprajwal/CRMDashboard',
      techStack: ['TypeScript', 'React', 'GraphQL'],
      desc: 'Fast analytics and real-time updates for business operations.',
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
    {
      name: 'ChatBot',
      github: 'https://github.com/mishraprajwal/ChatBot',
      techStack: ['TypeScript', 'React', 'Node'],
      desc: 'Conversational agent with intent detection and context.',
    },
  ];

  useGSAP(() => {
    if (!projectsRef.current) return;

    // Title reveal
    gsap.fromTo(
      '#projects-title',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Cards entrance stagger
    if (gridRef.current) {
      const cards = Array.from(gridRef.current.children);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 36, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: projectsRef.current,
            start: 'top 80%',
          },
        }
      );

      // Add mouse tilt for each card
      cards.forEach((card) => {
        let rmFn = null;
        const handleMove = (e) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rx = (py - 0.5) * 10; // degrees
          const ry = (px - 0.5) * -10;
          gsap.to(card, { rotationX: rx, rotationY: ry, scale: 1.02, transformPerspective: 800, duration: 0.5, ease: 'power3.out' });
        };
        const handleLeave = () => {
          gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
        };
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
        rmFn = () => {
          card.removeEventListener('mousemove', handleMove);
          card.removeEventListener('mouseleave', handleLeave);
        };
        // store cleanup on dom node
        card.__cleanup = rmFn;
      });
    }
  }, []);

  // cleanup when unmount
  useEffect(() => {
    return () => {
      if (gridRef.current) {
        Array.from(gridRef.current.children).forEach((c) => { if (c.__cleanup) c.__cleanup(); });
      }
      try { ScrollTrigger.getAll().forEach((s) => s.kill()); } catch (e) {}
    };
  }, []);

  return (
    <section
      ref={projectsRef}
      id="projects"
      className="w-full min-h-screen bg-transparent text-white overflow-hidden flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 py-20 relative">
        <h2
          id="projects-title"
          className="text-4xl md:text-5xl font-semibold text-center mb-12"
          style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          Selected Work
        </h2>

        <div ref={gridRef} className="projects-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <article
              key={i}
              className="project-card group perspective-800"
              tabIndex={0}
              role="button"
              onClick={() => window.open(p.github, '_blank')}
            >
              <div className="card-accent" aria-hidden></div>
              <div className="card-sheen" aria-hidden></div>
              <div className="card-hover-overlay" aria-hidden>
                <div className="overlay-inner">Open project • View details</div>
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
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-200 hover:text-white underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Code
                  </a>
                  <button
                    className="visit-btn ml-auto"
                    onClick={(e) => { e.stopPropagation(); window.open(p.github, '_blank'); }}
                  >
                    Open
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Short technologies overview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-6">Technologies & Tools</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['React','Node','TypeScript','Python','Docker','AWS','GraphQL','Web3'].map((t) => (
              <span key={t} className="tech-pill">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;