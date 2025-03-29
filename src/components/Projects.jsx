import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const projectsRef = useRef(null);
  const cardsRef = useRef(null);
  const techGroup1Ref = useRef(null);
  const techGroup2Ref = useRef(null);
  const techGroup3Ref = useRef(null);
  const skillsHeadingRef = useRef(null);

  // Projects data with tech stacks per project.
  const projects = [
    { 
      name: 'Real-Time Admin Dashboard', 
      github: 'https://github.com/mishraprajwal/CRMDashboard',
      techStack: ['TypeScript', 'React', 'GraphQL']
    },
    { 
      name: 'Web3 CrowdFunding Platform', 
      github: 'https://github.com/mishraprajwal/CrowdfundingPlatform',
      techStack: ['TypeScript', 'React', 'Web3']
    },
    { 
      name: 'Heart Failure Prediction', 
      github: 'https://github.com/mishraprajwal/HeartFailurePrediction',
      techStack: ['Machine Learning', 'Python', 'Pandas']
    },
    { 
      name: 'Sushi', 
      github: 'https://github.com/mishraprajwal/sushi',
      techStack: ['JavaScript', 'HTML', 'CSS']
    },
    { 
      name: 'ChatBot', 
      github: 'https://github.com/mishraprajwal/ChatBot',
      techStack: ['TypeScript', 'React', 'Node']
    },
  ];

  // List of technologies and languages you know.
  const knownTech = [
    'Java',
    'Python',
    'JavaScript',
    'TypeScript',
    'PL/SQL',
    'HTML/CSS',
    'React',
    'Node',
    'Web3',
    'Spring',
    'Fast API',
    'Pandas',
    'AWS',
    'Docker',
    'Git',
    'Postman',
    'MySQL',
    'MongoDB'
  ];

  // Split the knownTech array into three groups.
  const groupSize = Math.ceil(knownTech.length / 3);
  const firstGroup = knownTech.slice(0, groupSize);
  const secondGroup = knownTech.slice(groupSize, groupSize * 2);
  const thirdGroup = knownTech.slice(groupSize * 2);

  useGSAP(() => {
    // ---------------- Projects Cards Animation ----------------
    if (cardsRef.current && projectsRef.current) {
      const cards = cardsRef.current.children;
      const totalWidth = cards[0].offsetWidth * projects.length;
      // Duplicate cards for a seamless loop
      const clonedCards = Array.from(cards).map(card => card.cloneNode(true));
      cardsRef.current.append(...clonedCards);

      gsap.to(cardsRef.current, {
        x: -totalWidth,
        duration: 50,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x) => `${parseFloat(x) % totalWidth}px`,
        },
      });

      // Pause animation on hover for project cards
      cardsRef.current.addEventListener('mouseenter', () =>
        gsap.to(cardsRef.current, { timeScale: 0, overwrite: 'auto' })
      );
      cardsRef.current.addEventListener('mouseleave', () =>
        gsap.to(cardsRef.current, { timeScale: 1, overwrite: 'auto' })
      );

      // Fade in section title on scroll
      gsap.fromTo(
        '#projects-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: projectsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // ---------------- Advanced Known Tech Animation (Three Groups) ----------------
    if (
      techGroup1Ref.current && 
      techGroup2Ref.current && 
      techGroup3Ref.current && 
      skillsHeadingRef.current
    ) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.call(() => {
          skillsHeadingRef.current.innerText = "Languages";
        })
        .fromTo(
          techGroup1Ref.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 }
        )
        .to(
          techGroup1Ref.current.children,
          { opacity: 0, y: -50, stagger: 0.2, duration: 0.8 },
          "+=2"
        )
        .call(() => {
          skillsHeadingRef.current.innerText = "Frameworks";
        })
        .fromTo(
          techGroup2Ref.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 }
        )
        .to(
          techGroup2Ref.current.children,
          { opacity: 0, y: -50, stagger: 0.2, duration: 0.8 },
          "+=2"
        )
        .call(() => {
          skillsHeadingRef.current.innerText = "Tools";
        })
        .fromTo(
          techGroup3Ref.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 }
        )
        .to(
          techGroup3Ref.current.children,
          { opacity: 0, y: -50, stagger: 0.2, duration: 0.8 },
          "+=2"
        );
    }
  }, []);

  return (
    <section
      ref={projectsRef}
      id="projects"
      className="w-full min-h-screen bg-transparent text-white overflow-hidden flex items-center"
    >
      <div className="max-w-6xl mx-auto px-4 relative flex flex-col items-center">
        {/* Section Title */}
        <h2
          id="projects-title"
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          style={{
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
          }}
        >
          Projects
        </h2>

        {/* Horizontal Scrolling Cards */}
        <div ref={cardsRef} className="flex space-x-6 mb-16">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-80 h-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center"
            >
              <h3
                className="text-xl font-semibold text-center"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 700,
                }}
              >
                {project.name}
              </h3>
              {/* Tech Stack for each project */}
              <div className="flex flex-wrap gap-2 mt-4">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/20 text-white/80 px-2 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* Known Tech & Languages Section with Advanced Animation (Three Groups) */}
        <div className="text-center">
          {/* Dynamic Subheading */}
          <h3
            ref={skillsHeadingRef}
            className="text-3xl font-bold mb-4"
            style={{
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 400,
            }}
          >
            Languages
          </h3>
          <div className="overflow-hidden">
            {/* First group container */}
            <div ref={techGroup1Ref} className="flex justify-center space-x-4 mb-4">
              {firstGroup.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-sm text-white/80 whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
            </div>
            {/* Second group container */}
            <div ref={techGroup2Ref} className="flex justify-center space-x-4 mb-4">
              {secondGroup.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-sm text-white/80 whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
            </div>
            {/* Third group container */}
            <div ref={techGroup3Ref} className="flex justify-center space-x-4">
              {thirdGroup.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-sm text-white/80 whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;