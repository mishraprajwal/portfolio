import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from '../Navbar';
import './PortfolioHome.css';

const OrbitalCanvas = lazy(() => import('./OrbitalCanvas'));

const projects = [
  {
    id: 'ads',
    accent: '#557ce8',
    name: 'Ads Decision Engine',
    shortName: 'Ads decision engine',
    type: 'Causal ML · Decision systems',
    description: 'A decision engine for coupon targeting, pricing, and ad bidding, combining causal machine learning, bandits, reinforcement learning, and constrained optimization.',
    stack: ['Python', 'Causal ML', 'Bandits', 'PySpark'],
    github: 'https://github.com/mishraprajwal/ads',
  },
  {
    id: 'code-review',
    accent: '#8069d5',
    name: 'AI Code Reviewer',
    shortName: 'AI code reviewer',
    type: 'Developer tools · AI',
    description: 'A GitHub pull-request reviewer that queues webhook events, retrieves relevant review rules, and coordinates focused agents to leave inline feedback.',
    stack: ['Python', 'FastAPI', 'Redis', 'Ollama'],
    github: 'https://github.com/mishraprajwal/AI-Code-Reviewer',
  },
  {
    id: 'root-cause',
    accent: '#d6815c',
    name: 'Root Cause Analysis',
    shortName: 'Root cause analysis',
    type: 'Incident intelligence · AI',
    description: 'An incident post-mortem system that reconstructs timelines, builds structured 5-Whys analyses, and detects recurring causes across past incidents.',
    stack: ['Python', 'FastAPI', 'React', 'SQLite'],
    github: 'https://github.com/mishraprajwal/RootCauseAnalysis',
  },
  {
    id: 'meeting-tracker',
    accent: '#369a9b',
    name: 'Meeting Tracker',
    shortName: 'Meeting tracker',
    type: 'Local AI · Productivity',
    description: 'A local-first meeting intelligence tool that transcribes recordings, extracts decisions and action items, detects follow-up drift, and can post updates to Slack.',
    stack: ['Python', 'Whisper', 'Ollama', 'SQLite'],
    github: 'https://github.com/mishraprajwal/MeetingTracker',
  },
  {
    id: 'lecture',
    accent: '#b389d5',
    name: 'Lecture Summarizer',
    shortName: 'Lecture summarizer',
    type: 'NLP · Productivity',
    description: 'Turns YouTube lectures into transcripts, concise summaries, key points, keywords, and review questions with speech recognition and NLP.',
    stack: ['Python', 'Whisper', 'Flask', 'React'],
    github: 'https://github.com/mishraprajwal/lecture-summarizer',
  },
  {
    id: 'heart-failure',
    accent: '#d86779',
    name: 'Heart Failure Prediction',
    shortName: 'Heart failure prediction',
    type: 'Machine learning · Health',
    description: 'A notebook exploring clinical measurements, preparing patient data, and training and evaluating models to estimate heart-failure risk.',
    stack: ['Python', 'Jupyter', 'scikit-learn', 'XGBoost'],
    github: 'https://github.com/mishraprajwal/HeartFailurePrediction',
  },
  {
    id: 'sushi',
    accent: '#df9a49',
    name: 'Sushi',
    shortName: 'Sushi',
    type: 'Frontend · Interface',
    description: 'A responsive sushi restaurant website with a bold editorial layout, menu highlights, and subtle motion throughout the experience.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Vite'],
    github: 'https://github.com/mishraprajwal/sushi',
  },
];

const disciplines = [
  { title: 'Product engineering', quote: 'Build products that make everyday work easier.', detail: 'React · React Native · TypeScript', tone: 'blue' },
  { title: 'Cloud & systems', quote: 'Make reliable systems feel simple to operate.', detail: 'AWS · Serverless · APIs · CI/CD', tone: 'violet' },
  { title: 'Applied intelligence', quote: 'Turn data into decisions people can act on.', detail: 'Python · Machine learning · NLP', tone: 'green' },
];

const career = [
  { company: 'Saffron', role: 'Full Stack Engineer', location: 'Seattle, WA', period: 'February 2026 — September 2026', current: false },
  { company: 'Tata Consultancy Services', role: 'Software Engineer', location: 'Mumbai, India', period: 'April 2021 — April 2023', current: false },
];

function ProjectShowcase() {
  const [openedProjectId, setOpenedProjectId] = useState(null);
  const activeProject = projects.find((project) => project.id === openedProjectId);

  useEffect(() => {
    if (!activeProject) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpenedProjectId(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [activeProject]);

  return (
    <div className="project-showcase">
      <div className="mac-desktop">
        <div className="mac-menu-bar"><span className="mac-window-controls" aria-hidden="true"><i /><i /><i /></span><span className="mac-menu-brand">Projects</span><span className="mac-menu-items">File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Window</span><span className="mac-menu-count">{projects.length} folders</span></div>
        <div className="desktop-project-grid">
          {projects.map((project, index) => (
            <button type="button" key={project.id} className="desktop-project-folder" onClick={() => setOpenedProjectId(project.id)} aria-label={`Open ${project.name} folder`} aria-haspopup="dialog">
              <span className="desktop-folder-icon" style={{ '--folder-accent': project.accent }} aria-hidden="true"><i /><b>{String(index + 1).padStart(2, '0')}</b></span>
              <span className="desktop-folder-name">{project.name}</span>
            </button>
          ))}
        </div>
        <div className="desktop-hint"><span>Click any folder to take a look</span><span>⌘ &nbsp; {projects.length} ITEMS</span></div>
        {activeProject && (
          <div className="desktop-window-overlay" onClick={() => setOpenedProjectId(null)}>
            <section className="desktop-folder-window" role="dialog" aria-modal="true" aria-labelledby="opened-project-name" onClick={(event) => event.stopPropagation()}>
              <div className="desktop-window-titlebar"><div className="window-controls" aria-hidden="true"><i /><i /><i /></div><span>{activeProject.name}</span><button type="button" onClick={() => setOpenedProjectId(null)} aria-label="Close project preview">×</button></div>
              <div className="desktop-window-content">
                <div className="preview-folder-art" style={{ '--folder-accent': activeProject.accent }} aria-hidden="true"><i /><b>{String(projects.indexOf(activeProject) + 1).padStart(2, '0')}</b></div>
                <span className="preview-project-type">{activeProject.type}</span>
                <h3 id="opened-project-name">{activeProject.name}</h3>
                <p>{activeProject.description}</p>
                <div className="preview-project-stack">{activeProject.stack.map((item) => <span key={item}>{item}</span>)}</div>
                <a className="preview-project-link" href={activeProject.github} target="_blank" rel="noreferrer">View project on GitHub <span>↗</span></a>
              </div>
              <div className="desktop-window-status">Folder&nbsp; · &nbsp;{String(projects.indexOf(activeProject) + 1).padStart(2, '0')} of {String(projects.length).padStart(2, '0')}</div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.25 10h11.5M10 4.25 15.75 10 10 15.75" /></svg>;
}

export default function PortfolioHome() {
  return (
    <main className="portfolio-home">
      <Navbar />

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="hero-location"><span className="availability-dot" /> SEATTLE, WASHINGTON</p>
          <h1>Prajwal<br /><span>Mishra</span></h1>
          <p className="hero-role">Software Engineer</p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-halo" />
          <Suspense fallback={<div className="product-canvas" aria-hidden="true" />}>
            <OrbitalCanvas />
          </Suspense>
        </div>
        <a className="hero-scroll" href="#experience" aria-label="Scroll to experience"><span /></a>
      </section>

      <section className="experience-section" id="experience">
        <div className="experience-heading">
          <div><div className="section-kicker"><span>01</span> CAREER TIMELINE</div><h2>Experience<span>.</span></h2></div>
          <p>A few chapters in a continuing story.<br />Focused on the work, not the noise.</p>
        </div>
        <div className="experience-list">
          {career.map((position, index) => (
            <article className="experience-item" key={position.company}>
              <div className="experience-entry-meta">
                <span className="experience-card-index">{`0${index + 1}`}</span>
                <span className="experience-period">{position.period}</span>
              </div>
              <div className="experience-entry-content">
                <div className="experience-role"><h3>{position.role}</h3><p>{position.company}</p></div>
                <span className="experience-location">{position.location}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading-row">
          <div><div className="section-kicker"><span>02</span> A FEW THINGS I’VE BEEN MAKING</div><h2>Selected Work<span>.</span></h2></div>
          <p>Ideas, experiments, and things made<br />to work beautifully.</p>
        </div>
        <ProjectShowcase />
      </section>

      <section className="about-section" id="about">
        <div className="about-heading">
          <div className="section-kicker"><span>03</span> A LITTLE ABOUT ME</div>
          <h2>Curious by nature.</h2>
        </div>
        <div className="about-grid">
          <div className="about-statement"><span className="about-quote-mark">“</span><p>I build thoughtful software that makes complex things feel simple.</p><span className="about-signature">PRAJWAL MISHRA&nbsp;</span></div>
          <aside className="about-location" aria-label="Based in Seattle, Washington; open to relocation">
            <div className="location-visual" aria-hidden="true">
              <img
                className="seattle-photo"
                src="https://images.pexels.com/photos/28495686/pexels-photo-28495686.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="Seattle's skyline and Space Needle with Mount Rainier at sunset"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="location-card-copy">
              <div><span className="location-eyebrow">CURRENTLY BASED IN</span><h3>Seattle, <span>WA</span></h3></div>
              <div className="relocation-note"><i aria-hidden="true" /><span>Open to relocation</span><b>↗</b></div>
            </div>
          </aside>
        </div>
        <article className="education-feature" aria-labelledby="education-title">
          <div className="education-feature-label"><span>EDUCATION</span><span>01&nbsp; / &nbsp;ACADEMIC BACKGROUND</span></div>
          <div className="education-feature-content">
            <div>
              <span className="education-degree-label">MASTER OF SCIENCE</span>
              <h3 id="education-title">Computer Science</h3>
              <p>New Jersey Institute of Technology</p>
            </div>
            <div className="education-feature-period"><span>September 2023</span><i /><span>May 2025</span></div>
          </div>
        </article>
      </section>

      <section className="approach-section" id="approach">
        <div className="approach-header"><div className="section-kicker"><span>04</span> THE WAY I WORK</div><p>Tools change. Thoughtfulness doesn’t.</p></div>
        <h2>Thoughtful by design.</h2>
        <div className="discipline-grid">
          {disciplines.map((discipline) => (
            <article className={`discipline-card discipline-${discipline.tone}`} key={discipline.title}>
              <blockquote className="discipline-quote">{discipline.quote}</blockquote>
              <h3>{discipline.title}</h3>
              <p className="discipline-tools">{discipline.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="contact-section" id="contact">
        <div className="contact-topline"><div className="section-kicker"><span>05</span> SOMETHING GOOD STARTS HERE</div><span>© {new Date().getFullYear()} PRAJWAL MISHRA</span></div>
        <div className="contact-main"><div><p>HAVE AN INTERESTING IDEA?</p><h2>Let’s build<br /><em>what’s next.</em></h2></div><a href="mailto:prajwalm882@gmail.com" className="contact-button" aria-label="Email Prajwal Mishra"><ArrowIcon /></a></div>
        <div className="contact-bottom"><a href="mailto:prajwalm882@gmail.com">prajwalm882@gmail.com</a><div><a href="https://www.linkedin.com/in/prajwalkaruneshmishra/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/mishraprajwal" target="_blank" rel="noreferrer">GitHub ↗</a></div><a href="#top" className="back-top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
