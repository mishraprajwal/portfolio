import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const experienceRef = useRef(null);
  const pinRef = useRef(null);
  const indicatorRef = useRef(null);
  const itemsRef = useRef([]);
  itemsRef.current = [];

  const addToRefs = (el) => {
    if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el);
  };

  const experienceData = [
    {
      company: 'Emerald Ark',
      role: 'Software Engineer — Full Stack',
      period: 'Aug 2025 - Present',
      location: 'Remote',
      summary: 'Building resilient, developer-first platform features that accelerate delivery and keep systems humming in production.',
      tags: ['Full-Stack', 'Product', 'Cloud'],
      details: [
        'Led feature work end-to-end across web and cloud, improving developer velocity.',
        'Owned reliability improvements and ran post-mortem processes.',
        'Built reusable infrastructure to accelerate product launches.',
      ],
    },
    {
      company: 'Tata Consultancy Services',
      role: 'Software Engineer',
      period: 'Apr 2021 - Apr 2023',
      location: 'Mumbai, India',
      summary: 'Engineered high-throughput microservices and database optimizations that slashed latency and improved reliability at scale.',
      tags: ['Backend', 'Microservices', 'Databases'],
      details: [
        'Designed and implemented microservices for high-throughput systems.',
        'Optimized database queries and migrations that reduced latency.',
        'Collaborated with cross-functional teams on integrations and deployments.',
      ],
    },
    {
      company: 'JBA Infosolutions Pvt. Ltd.',
      role: 'Junior Full Stack Developer',
      period: 'Jun 2020 - Apr 2021',
      location: 'Mumbai, India',
      summary: 'Delivered polished customer-facing apps and automated delivery pipelines to ship faster and safer.',
      tags: ['Frontend', 'APIs', 'DevOps'],
      details: [
        'Delivered customer-facing features and maintained CI pipelines.',
        'Improved API reliability and introduced monitoring dashboards.',
      ],
    },
  ];

  // modal/case-study removed: timeline shows concise summary + tags only

  useEffect(() => {
    if (!experienceRef.current) return;
    // Compute pin end based on list height so the pinned duration fits the content
    const listEl = experienceRef.current.querySelector('.timeline-advanced-list');
    const computePinEnd = () => {
      if (!listEl) return experienceData.length * 200;
      const listHeight = listEl.scrollHeight;
      const viewport = window.innerHeight;
      return Math.max(listHeight - viewport + 220, listHeight);
    };

    const pinEnd = computePinEnd();
    const pinTrigger = ScrollTrigger.create({
      trigger: experienceRef.current,
      start: 'top top',
      end: `+=${pinEnd}`,
      pin: pinRef.current,
      pinSpacing: true,
    });

    // Fade in title
    gsap.fromTo(
      experienceRef.current.querySelector('#experience-title'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: experienceRef.current, start: 'top 90%' } }
    );

    // For each item create an observer that moves the indicator to the item's vertical center and animates the card
    const stHandles = [];
    itemsRef.current.forEach((el, i) => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => moveIndicatorTo(el, i),
        onEnterBack: () => moveIndicatorTo(el, i),
      });
      stHandles.push(st);

      // card entrance
      gsap.fromTo(
        el.querySelector('.timeline-card'),
        { opacity: 0, y: 40, rotateX: 6, filter: 'blur(6px)' },
        { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
      );

      // hover scale for card
      const onEnter = () => gsap.to(el, { scale: 1.03, duration: 0.25, ease: 'power3.out' });
      const onLeave = () => gsap.to(el, { scale: 1, duration: 0.35, ease: 'power3.out' });
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);

      // note: we compute indicator position from item rect (no DOM moving required)

      // shimmer effect on duration badge when active
      const durationEl = el.querySelector('.duration-badge');
      el.__cleanup = () => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); };

      // make the duration badge pulse when this item becomes active
      const _st = ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          if (durationEl) gsap.fromTo(durationEl, { scale: 0.98, boxShadow: '0 6px 18px rgba(2,6,23,0.2)' }, { scale: 1, boxShadow: '0 14px 40px rgba(2,6,23,0.45)', duration: 0.45, ease: 'power3.out' });
        },
        onEnterBack: () => {
          if (durationEl) gsap.fromTo(durationEl, { scale: 0.98 }, { scale: 1, duration: 0.4, ease: 'power3.out' });
        }
      });
      stHandles.push(_st);
    });

    // Staggered entrance for all items (more advanced animation)
    try {
      if (itemsRef.current.length) {
        gsap.fromTo(itemsRef.current, { opacity: 0, y: 20, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.12 });
      }
    } catch (e) {}

    // Position each item's dot into the central list using getBoundingClientRect for stability
    const positionDots = () => {
      try {
        if (!listEl) return;
        const listRect = listEl.getBoundingClientRect();
        itemsRef.current.forEach((itemEl) => {
          const dot = itemEl.querySelector('.timeline-dot');
          if (!dot) return;
          const itemRect = itemEl.getBoundingClientRect();
          const top = Math.round(itemRect.top - listRect.top + itemRect.height / 2 - dot.offsetHeight / 2);
          dot.style.position = 'absolute';
          dot.style.left = '50%';
          dot.style.transform = 'translateX(-50%)';
          dot.style.top = `${top}px`;
          dot.style.zIndex = 24;
          dot.style.pointerEvents = 'none';
          if (dot.parentNode !== listEl) listEl.appendChild(dot);
        });
      } catch (e) { /* ignore */ }
    };

    // update active indicator based on which item's center is closest to viewport center
    let ticking = false;
    const updateActiveIndicator = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          const viewportCenter = window.innerHeight / 2;
          let closest = { idx: -1, dist: Infinity };
          itemsRef.current.forEach((itemEl, idx) => {
            const r = itemEl.getBoundingClientRect();
            const itemCenter = r.top + r.height / 2;
            const dist = Math.abs(itemCenter - viewportCenter);
            if (dist < closest.dist) closest = { idx, dist };
          });
          if (closest.idx >= 0) {
            const itemEl = itemsRef.current[closest.idx];
            moveIndicatorTo(itemEl, closest.idx);
          }
        } catch (e) {}
        ticking = false;
      });
    };

    // initial placement and listeners
    setTimeout(() => { positionDots(); updateActiveIndicator(); }, 60);
    const onScroll = () => updateActiveIndicator();
    const onResize = () => { positionDots(); updateActiveIndicator(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    if (ScrollTrigger.addEventListener) ScrollTrigger.addEventListener('refresh', () => { positionDots(); updateActiveIndicator(); });

    // Micro-parallax / tilt on pointer move (desktop only)
    const supportsPointerFine = window.matchMedia && !window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let onPointerMove = null;
    if (supportsPointerFine && !reduceMotion) {
      onPointerMove = (ev) => {
        const rect = experienceRef.current.getBoundingClientRect();
        const px = (ev.clientX - rect.left) / rect.width; // 0 -> 1
        const py = (ev.clientY - rect.top) / rect.height;
        // subtle indicator follow for a parallax effect
        if (indicatorRef.current) {
          gsap.to(indicatorRef.current, { x: (px - 0.5) * 8, y: (py - 0.5) * 6, duration: 0.8, ease: 'power3.out' });
        }
        // per-card micro-tilt
        itemsRef.current.forEach((el) => {
          const card = el.querySelector('.timeline-card');
          if (!card) return;
          const r = el.getBoundingClientRect();
          const cx = ev.clientX - (r.left + r.width / 2);
          const cy = ev.clientY - (r.top + r.height / 2);
          gsap.to(card, { rotationY: cx / 40, rotationX: -cy / 60, x: cx / 80, y: cy / 180, duration: 0.6, ease: 'power3.out' });
        });
      };
      experienceRef.current.addEventListener('pointermove', onPointerMove);
      experienceRef.current.addEventListener('pointerleave', () => {
        // reset card transforms
        itemsRef.current.forEach((el) => {
          const card = el.querySelector('.timeline-card');
          if (!card) return;
          gsap.to(card, { rotationX: 0, rotationY: 0, x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
        });
        if (indicatorRef.current) gsap.to(indicatorRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
      });
    }

    // We'll compute indicator position from each item's dot rect; no DOM moving required

    function moveIndicatorTo(itemEl, idx) {
      if (!indicatorRef.current || !itemEl) return;
      const parentRect = experienceRef.current.getBoundingClientRect();
      // try to align to the per-item dot if available
      const dot = itemEl.querySelector('.timeline-dot');
      let y;
      if (dot) {
        const dRect = dot.getBoundingClientRect();
        y = dRect.top - parentRect.top + dRect.height / 2;
      } else {
        const dRect = itemEl.getBoundingClientRect();
        y = dRect.top - parentRect.top + dRect.height / 2;
      }
      gsap.to(indicatorRef.current, { y: y, duration: 0.45, ease: 'power3.out' });
      // set active class
      itemsRef.current.forEach((el, j) => el.classList.toggle('active', j === idx));
      // subtle active card elevation
      itemsRef.current.forEach((el, j) => {
        const card = el.querySelector('.timeline-card');
        if (!card) return;
        if (j === idx) gsap.to(card, { y: -6, boxShadow: '0 24px 60px rgba(0,0,0,0.6)', duration: 0.35, ease: 'power3.out' });
        else gsap.to(card, { y: 0, boxShadow: '0 12px 40px rgba(0,0,0,0.45)', duration: 0.35, ease: 'power3.out' });
      });
    }

    // Keyboard navigation: arrows to move
    const onKey = (e) => {
      const activeIndex = itemsRef.current.findIndex((el) => el.classList.contains('active'));
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const next = Math.min(itemsRef.current.length - 1, Math.max(0, activeIndex + 1));
        const el = itemsRef.current[next];
  if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); moveIndicatorTo(el, next); }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const prev = Math.max(0, activeIndex - 1);
        const el = itemsRef.current[prev];
  if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); moveIndicatorTo(el, prev); }
      }
    
    };
    window.addEventListener('keydown', onKey);

    return () => {
      try { stHandles.forEach((s) => s.kill()); } catch (e) {}
      try { ScrollTrigger.getAll().forEach((s) => s.kill()); } catch (e) {}
      try { pinTrigger && pinTrigger.kill(); } catch (e) {}
      window.removeEventListener('keydown', onKey);
      // call per-element cleanup
      itemsRef.current.forEach((el) => { if (el && el.__cleanup) el.__cleanup(); });
      // remove pointer handlers
      if (experienceRef.current && onPointerMove) {
        experienceRef.current.removeEventListener('pointermove', onPointerMove);
      }
      try { window.removeEventListener('scroll', onScroll); } catch (e) {}
      try { window.removeEventListener('resize', onResize); } catch (e) {}
      try { ScrollTrigger.removeEventListener && ScrollTrigger.removeEventListener('refresh', positionDots); } catch (e) {}
      // restore dots back to item nodes where possible
      try {
        itemsRef.current.forEach((itemEl) => {
          const selector = `.timeline-dot`;
          const movedDot = listEl && listEl.querySelector(selector);
          if (!movedDot) return;
          if (itemEl && !itemEl.contains(movedDot)) itemEl.appendChild(movedDot);
        });
      } catch (e) {}
    };
  }, []);

  // expand/collapse removed: cards are static and present summary + tags only

  return (
    <section ref={experienceRef} id="experience" className="w-full min-h-screen bg-black text-white py-24 px-4 relative overflow-visible">
      <div ref={pinRef} className="max-w-6xl mx-auto px-4 relative">
        <h2 id="experience-title" className="text-4xl md:text-5xl font-semibold text-center mb-12" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          Career & Experience
        </h2>

        <div className="timeline-advanced relative">
          <div className="timeline-vertical" aria-hidden></div>
          <div ref={indicatorRef} className="timeline-indicator" aria-hidden></div>

          <div className="timeline-advanced-list">
            {experienceData.map((exp, idx) => {
              const side = idx % 2 === 0 ? 'left' : 'right';
              return (
                <div key={idx} ref={addToRefs} className={`timeline-advanced-item ${side}`}>
                  <div className="timeline-dot" />
                  <div className="timeline-card">
                    <div className="card-header">
                      <div className="company-meta">
                        <div className={`company-info text-left`}>
                          <h3 className="company-name">{exp.company}</h3>
                          <p className="role-title">{exp.role}</p>
                        </div>
                      </div>
                      <div className="duration-badge">{exp.period}</div>
                    </div>

                    <div className="card-body">
                      <p className="location small muted">{exp.location}</p>
                      <p className="card-summary">{exp.summary}</p>
                      <div className="card-tags">
                        {exp.tags.map((t, ti) => (<span key={ti} className="tag-chip">{t}</span>))}
                      </div>
                      {/* case-study removed; keep layout compact */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* no modal included */}
        </div>
      </div>
    </section>
  );
};

export default Experience;