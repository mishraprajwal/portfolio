import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    company: 'Saffron', companyColor: '#F4A900',
    role: 'Full Stack Engineer · Feb 2026 – Present',
    location: 'Seattle, WA · Onsite',
    category: 'Mobile Engineering',
    title: 'FWA Signal Mapping App',
    description: 'Shipped a cross-platform iOS and Android app with visual signal mapping — helping 200K+ users identify optimal Fixed Wireless Access placement in real time.',
    detail: 'React Native · TypeScript · iOS · Android',
    icon: 'mobile',
  },
  {
    company: 'Saffron', companyColor: '#F4A900',
    role: 'Full Stack Engineer · Feb 2026 – Present',
    location: 'Seattle, WA · Onsite',
    category: 'Machine Learning',
    title: 'MLOps on SageMaker',
    description: 'Engineered an end-to-end MLOps pipeline on AWS SageMaker — ingesting production data, automating model training and evaluation, and deploying the best-performing model via CI/CD.',
    detail: 'AWS SageMaker · GitHub Actions · CI/CD · Python',
    icon: 'mlops',
  },
  {
    company: 'Saffron', companyColor: '#F4A900',
    role: 'Full Stack Engineer · Feb 2026 – Present',
    location: 'Seattle, WA · Onsite',
    category: 'Cloud Infrastructure',
    title: 'Infrastructure as Code',
    description: 'Built reusable CDK constructs and deployment pipelines to provision and manage AWS infrastructure — enabling idempotent, version-controlled deployments across dev, staging, and production.',
    detail: 'AWS CDK · CloudFormation · IaC · Multi-Env',
    icon: 'cloud',
  },
  {
    company: 'Saffron', companyColor: '#F4A900',
    role: 'Full Stack Engineer · Feb 2026 – Present',
    location: 'Seattle, WA · Onsite',
    category: 'Analytics & BI',
    title: 'Embedded Analytics Dashboard',
    description: 'Developed and deployed a Power BI embedded analytics and support ticket dashboard in React.js — delivering live KPIs and ticket insights behind Cognito-based RBAC authentication.',
    detail: 'React.js · Power BI · AWS Cognito · RBAC',
    icon: 'dashboard',
  },
  {
    company: 'Saffron', companyColor: '#F4A900',
    role: 'Full Stack Engineer · Feb 2026 – Present',
    location: 'Seattle, WA · Onsite',
    category: 'API Design',
    title: 'Serverless Microservices APIs',
    description: 'Designed and integrated REST APIs using API Gateway, Lambda, and DynamoDB — enabling seamless data communication between internal microservices.',
    detail: 'AWS API Gateway · Lambda · DynamoDB · REST',
    icon: 'api',
  },
  {
    company: 'Tata Consultancy Services', companyColor: '#3B82F6',
    role: 'Software Engineer · Apr 2021 – Apr 2023',
    location: 'Mumbai, Maharashtra · Onsite',
    category: 'Engineering Visibility',
    title: 'Serverless Alerting Pipeline',
    description: 'Owned end-to-end design and delivery of a serverless reporting and critical-error alerting pipeline for Starbucks — saving 1 man-hour of manual work daily.',
    detail: 'AWS Lambda · EventBridge · SES · Serverless',
    icon: 'observe',
  },
  {
    company: 'Tata Consultancy Services', companyColor: '#3B82F6',
    role: 'Software Engineer · Apr 2021 – Apr 2023',
    location: 'Mumbai, Maharashtra · Onsite',
    category: 'Quality Engineering',
    title: 'Zero-Touch Regression',
    description: 'Cut regression testing from 8 hours to 2 hours by architecting a CI/CD pipeline for mobile test automation across iOS and Android — integrated with AWS Device Farm.',
    detail: 'GitHub Actions · AWS Device Farm · iOS · Android',
    icon: 'pipeline',
  },
];

function MobileIcon({ color }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect x="22" y="8" width="36" height="64" rx="6" stroke={color} strokeWidth="1.8"/>
      <circle cx="40" cy="65" r="3" stroke={color} strokeWidth="1.6"/>
      <line x1="33" y1="16" x2="47" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="30" y1="34" x2="30" y2="44" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.6"/>
      <line x1="36" y1="29" x2="36" y2="44" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.6"/>
      <line x1="42" y1="24" x2="42" y2="44" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.6"/>
      <line x1="48" y1="20" x2="48" y2="44" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}
function CloudIcon({ color }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M18 52a14 14 0 010-28h1A18 18 0 0162 38a12 12 0 010 24H18z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="40" y1="42" x2="40" y2="60" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M30 52l10 10 10-10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ApiIcon({ color }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <circle cx="14" cy="40" r="7" stroke={color} strokeWidth="1.8"/>
      <circle cx="66" cy="20" r="7" stroke={color} strokeWidth="1.8"/>
      <circle cx="66" cy="60" r="7" stroke={color} strokeWidth="1.8"/>
      <line x1="21" y1="37" x2="53" y2="24" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
      <line x1="21" y1="43" x2="53" y2="56" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
      <path d="M58 24l-5 5M58 56l-5-5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function ObserveIcon({ color }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M6 40C6 40 18 18 40 18s34 22 34 22-12 22-34 22S6 40 6 40z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="40" cy="40" r="9" stroke={color} strokeWidth="1.8"/>
      <circle cx="40" cy="40" r="3" fill={color} opacity="0.75"/>
      <line x1="40" y1="8" x2="40" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="40" y1="66" x2="40" y2="72" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="8" y1="40" x2="14" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="66" y1="40" x2="72" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}
function MlopsIcon({ color }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <circle cx="14" cy="28" r="5" stroke={color} strokeWidth="1.8"/>
      <circle cx="14" cy="52" r="5" stroke={color} strokeWidth="1.8"/>
      <circle cx="40" cy="18" r="5" stroke={color} strokeWidth="1.8"/>
      <circle cx="40" cy="40" r="5.5" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.12"/>
      <circle cx="40" cy="62" r="5" stroke={color} strokeWidth="1.8"/>
      <circle cx="66" cy="34" r="5" stroke={color} strokeWidth="1.8"/>
      <circle cx="66" cy="46" r="5" stroke={color} strokeWidth="1.8"/>
      <line x1="19" y1="27" x2="35" y2="20" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <line x1="19" y1="29" x2="35" y2="39" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <line x1="19" y1="31" x2="35" y2="61" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
      <line x1="19" y1="51" x2="35" y2="19" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
      <line x1="19" y1="51" x2="35" y2="41" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <line x1="19" y1="53" x2="35" y2="62" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <line x1="45" y1="19" x2="61" y2="33" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <line x1="45" y1="40" x2="61" y2="35" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <line x1="45" y1="40" x2="61" y2="45" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <line x1="45" y1="62" x2="61" y2="47" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}
function DashboardIcon({ color }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect x="8" y="8" width="28" height="28" rx="3" stroke={color} strokeWidth="1.8"/>
      <rect x="44" y="8" width="28" height="18" rx="3" stroke={color} strokeWidth="1.8"/>
      <rect x="44" y="34" width="28" height="38" rx="3" stroke={color} strokeWidth="1.8"/>
      <rect x="8" y="44" width="28" height="28" rx="3" stroke={color} strokeWidth="1.8"/>
      <path d="M14 28l5-6 6 4 7-8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  );
}
function PipelineIcon({ color }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <circle cx="14" cy="14" r="6" stroke={color} strokeWidth="1.8"/>
      <circle cx="40" cy="14" r="6" stroke={color} strokeWidth="1.8"/>
      <circle cx="66" cy="14" r="6" stroke={color} strokeWidth="1.8"/>
      <circle cx="14" cy="66" r="6" stroke={color} strokeWidth="1.8"/>
      <circle cx="40" cy="66" r="6" stroke={color} strokeWidth="1.8"/>
      <circle cx="66" cy="66" r="6" stroke={color} strokeWidth="1.8"/>
      <circle cx="27" cy="40" r="5" stroke={color} strokeWidth="1.6"/>
      <circle cx="53" cy="40" r="5" stroke={color} strokeWidth="1.6"/>
      <line x1="14" y1="20" x2="14" y2="34" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <line x1="14" y1="46" x2="14" y2="60" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <line x1="66" y1="20" x2="66" y2="34" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <line x1="66" y1="46" x2="66" y2="60" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <line x1="19" y1="40" x2="22" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="40" x2="48" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="58" y1="40" x2="61" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const ICON_MAP = { mobile: MobileIcon, cloud: CloudIcon, api: ApiIcon, observe: ObserveIcon, mlops: MlopsIcon, dashboard: DashboardIcon, pipeline: PipelineIcon };

export default function Experience() {
  const wrapperRef = useRef(null);
  const iconRefs = useRef([]);
  const textRefs = useRef([]);
  const glowRefs = useRef([]);
  const dotRefs = useRef([]);
  const counterRef = useRef(null);
  const companyLabelRef = useRef(null);
  const companyRoleRef = useRef(null);
  const companyLocationRef = useRef(null);
  const progressLineRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const isMobile = window.innerWidth < 768;
    const n = FEATURES.length;

    const ctx = gsap.context(() => {
      if (isMobile) {
        wrapper.querySelectorAll('.feat-mobile-card').forEach((card, i) => {
          gsap.fromTo(card, { opacity: 0, y: 28 }, {
            opacity: 1, y: 0, duration: 0.6, delay: i * 0.06, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' },
          });
        });
        return;
      }

      const iconEls = iconRefs.current;
      const textEls = textRefs.current;
      const glowEls = glowRefs.current;
      const dotEls = dotRefs.current;

      // Set initial states — everything hidden except feature 0
      gsap.set(iconEls, { opacity: 0, scale: 1.1 });
      gsap.set(textEls, { opacity: 0, y: 28 });
      gsap.set(glowEls, { opacity: 0, scale: 0.85 });

      // Build scrubbed timeline
      const tl = gsap.timeline();

      // Feature 0 entrance
      tl.to(glowEls[0], { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0);
      tl.to(iconEls[0], { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, 0.08);
      tl.to(textEls[0], { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.14);

      for (let i = 0; i < n; i++) {
        tl.to({}, { duration: 1.5 }); // hold
        if (i < n - 1) {
          // Exit i
          tl.to(glowEls[i], { opacity: 0, scale: 0.9, duration: 0.32, ease: 'power2.in' });
          tl.to(iconEls[i], { opacity: 0, scale: 0.84, duration: 0.3, ease: 'power2.in' }, '<');
          tl.to(textEls[i], { opacity: 0, y: -24, duration: 0.26, ease: 'power2.in' }, '<');
          // Enter i+1
          tl.to(glowEls[i + 1], { opacity: 1, scale: 1, duration: 0.48, ease: 'power2.out' }, '>-0.08');
          tl.to(iconEls[i + 1], { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, '<0.06');
          tl.to(textEls[i + 1], { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out' }, '<0.08');
        }
      }
      tl.to({}, { duration: 0.5 }); // exit buffer

      // UI updates driven by scroll progress (counter, dots, company label)
      let uiIdx = -1;
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: `+=${n * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        animation: tl,
        onUpdate: (self) => {
          const idx = Math.min(Math.floor(self.progress * n + 0.001), n - 1);
          if (idx === uiIdx) return;
          uiIdx = idx;
          const f = FEATURES[idx];
          if (counterRef.current) counterRef.current.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
          if (companyLabelRef.current) { companyLabelRef.current.textContent = f.company; companyLabelRef.current.style.color = f.companyColor; }
          if (companyRoleRef.current) companyRoleRef.current.textContent = f.role;
          if (companyLocationRef.current) companyLocationRef.current.textContent = f.location;
          if (progressLineRef.current) gsap.to(progressLineRef.current, { width: `${(idx / (n - 1)) * 100}%`, backgroundColor: f.companyColor, duration: 0.4, ease: 'power2.out' });
          dotEls.forEach((dot, di) => {
            if (!dot) return;
            dot.style.opacity = di === idx ? '1' : '0.25';
            dot.style.transform = di === idx ? 'scale(1.5)' : 'scale(1)';
          });
        },
      });
    }, wrapper);

    return () => { ctx.revert(); };
  }, []);

  const firstF = FEATURES[0];

  return (
    <section ref={wrapperRef} id="experience" className="w-full bg-black text-white overflow-hidden">

      {/* ── DESKTOP: Apple feature showcase ── */}
      <div className="hidden md:flex flex-col" style={{ minHeight: '100vh' }}>

        {/* Top bar */}
        <div className="flex items-start justify-between px-12 lg:px-20 pt-8 shrink-0">
          <div>
            <span ref={companyLabelRef} className="block text-xl font-bold tracking-tight" style={{ color: firstF.companyColor }}>{firstF.company}</span>
            <span ref={companyRoleRef} className="block text-sm text-white/70 mt-1 font-medium">{firstF.role}</span>
            <span ref={companyLocationRef} className="block text-xs text-white/38 mt-0.5 tracking-wide">{firstF.location}</span>
          </div>
          <div className="flex items-center gap-6">
            <h2 className="text-xs font-medium text-white/30 tracking-[0.2em] uppercase">Career & Experience</h2>
            <span ref={counterRef} className="text-xs font-mono font-bold tracking-[0.22em] text-white/28">01 / {String(FEATURES.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Main feature area */}
        <div className="flex-1 flex items-center px-12 lg:px-20 gap-8 py-4">

          {/* Left: icon + ambient glow */}
          <div className="w-[44%] flex items-center justify-center relative" style={{ minHeight: '320px' }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                ref={el => { glowRefs.current[i] = el; }}
                className="absolute pointer-events-none"
                style={{ inset: '-80px', background: `radial-gradient(ellipse at 50% 50%, ${f.companyColor}24 0%, transparent 60%)`, filter: 'blur(50px)' }}
              />
            ))}
            <div className="relative" style={{ width: '180px', height: '180px' }}>
              {FEATURES.map((f, i) => {
                const IconComp = ICON_MAP[f.icon];
                return (
                  <div key={i} ref={el => { iconRefs.current[i] = el; }} className="absolute inset-0 flex items-center justify-center">
                    <div style={{ width: '160px', height: '160px' }}>
                      <IconComp color={f.companyColor} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vertical divider */}
          <div className="self-stretch w-px shrink-0 my-12" style={{ background: 'rgba(255,255,255,0.05)' }} />

          {/* Right: feature text */}
          <div className="flex-1 relative" style={{ minHeight: '280px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} ref={el => { textRefs.current[i] = el; }} className="absolute inset-0 flex flex-col justify-center">
                <span className="block text-[11px] font-bold tracking-[0.28em] uppercase mb-5" style={{ color: f.companyColor }}>{f.category}</span>
                <h3 className="text-[2.4rem] lg:text-[3rem] xl:text-[3.6rem] font-bold leading-[1.06] tracking-tight text-white mb-5">{f.title}</h3>
                <p className="text-base lg:text-[1.05rem] text-white/50 leading-relaxed max-w-sm mb-6">{f.description}</p>
                <span className="text-xs text-white/28 tracking-wider font-medium">{f.detail}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Progress bar + dots */}
        <div className="shrink-0 flex flex-col items-center gap-3 pb-7 px-12">
          <div className="w-60 h-px bg-white/10 rounded-full overflow-hidden">
            <div ref={progressLineRef} className="h-full rounded-full" style={{ width: '0%', backgroundColor: firstF.companyColor }} />
          </div>
          <div className="flex items-center gap-2">
            {FEATURES.map((f, i) => (
              <div key={i} ref={el => { dotRefs.current[i] = el; }} className="w-1.5 h-1.5 rounded-full transition-all duration-300" style={{ backgroundColor: f.companyColor, opacity: i === 0 ? 1 : 0.25 }} />
            ))}
          </div>
        </div>

      </div>

      {/* ── MOBILE: grouped feature cards ── */}
      <div className="flex flex-col md:hidden px-4 pt-14 pb-14 gap-10">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-center text-white mb-2"
          style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          Career & Experience
        </h2>
        {[...new Set(FEATURES.map(f => f.company))].map((co) => {
          const coFeatures = FEATURES.filter(f => f.company === co);
          const coColor = coFeatures[0].companyColor;
          return (
            <div key={co}>
              <div className="mb-5">
                <span className="block text-lg font-bold tracking-tight" style={{ color: coColor }}>{co}</span>
                <p className="text-sm text-white/65 mt-0.5 font-medium">{coFeatures[0].role}</p>
                <p className="text-xs text-white/38 mt-0.5 tracking-wide">{coFeatures[0].location}</p>
              </div>
              <div className="flex flex-col gap-3">
                {coFeatures.map((f, i) => {
                  const IconComp = ICON_MAP[f.icon];
                  return (
                    <div key={i} className="feat-mobile-card relative overflow-hidden rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${coColor}22` }}>
                      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${coColor}55, transparent)` }} />
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 mt-0.5" style={{ width: '36px', height: '36px' }}>
                          <IconComp color={coColor} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold tracking-widest uppercase block mb-1" style={{ color: coColor }}>{f.category}</span>
                          <h3 className="text-base font-bold text-white mb-1.5 leading-snug">{f.title}</h3>
                          <p className="text-xs text-white/45 leading-relaxed">{f.description}</p>
                          <span className="block mt-2 text-[10px] text-white/25 tracking-wide">{f.detail}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
