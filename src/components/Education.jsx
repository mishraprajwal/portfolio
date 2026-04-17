import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Education.css';

gsap.registerPlugin(ScrollTrigger);

const educationData = [
    {
        level: "Master's Degree",
        field: 'Computer and Information Sciences',
        institution: 'New Jersey Institute of Technology',
        institutionColor: '#D32F2F',
        period: 'September 2023 - May 2025',
        startYear: 2023,
        endYear: 2025,
        coursework: [
            'Machine Learning',
            'Data Structures',
            'Databases',
            'Operating Systems',
            'Web Development',
            'Big Data',
        ],
    },
    {
        level: "Bachelor's Degree",
        field: 'Information Technology',
        institution: 'University of Mumbai',
        institutionColor: '#4338CA',
        period: 'August 2016 - May 2020',
        startYear: 2016,
        endYear: 2020,
        coursework: [
            'Data Structures',
            'Databases',
            'Network Security',
            'Embedded Systems',
            'Microcontrollers',
            'Artificial Intelligence',
        ],
    },
];

export default function Education() {
    const rootRef = useRef(null);
    const itemRefs = useRef([]);
    itemRefs.current = [];
    const addItem = (el) => { if (el && !itemRefs.current.includes(el)) itemRefs.current.push(el); };
    const lineRef = useRef(null);
    const fillRefs = useRef([]);
    fillRefs.current = [];
    const yearTopRefs = useRef([]);
    yearTopRefs.current = [];
    const yearBottomRefs = useRef([]);
    yearBottomRefs.current = [];

    // We want the latest (highest endYear) on top — sort descending
    const ordered = [...educationData].sort((a, b) => b.endYear - a.endYear);

    useEffect(() => {
        const root = rootRef.current;
        const items = itemRefs.current;
        if (!root || !items) return;

        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) {
            gsap.set(lineRef.current, { scaleY: 1 });
            items.forEach((el) => gsap.set(el.querySelector('.edu-content'), { autoAlpha: 1, x: 0 }));
            return;
        }

        // Prepare initial states
        gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'bottom center' });
        items.forEach((el) => {
            const content = el.querySelector('.edu-content');
            const bullet = el.querySelector('.edu-bullet');
            const tags = el.querySelectorAll('.edu-tag');
            gsap.set(content, { autoAlpha: 0, x: -36 });
            gsap.set(bullet, { autoAlpha: 0, scale: 0.6 });
            gsap.set(tags, { autoAlpha: 0, x: -12 });
        });

        // Build a scrubbed, pinned timeline that reveals each education entry in sequence
        const n = items.length;
        let tl = null;
        let st = null;

        const buildTimeline = () => {
            // cleanup previous
            try { if (st) { st.kill(); st = null; } } catch (e) {}
            try { if (tl) { tl.kill(); tl = null; } } catch (e) {}

            // wait a frame so layout stabilizes (important for accurate bounding rects)
            requestAnimationFrame(() => {
                // recompute positions relative to the line container
                const lineContainer = lineRef.current && lineRef.current.parentElement;
                let positions = [];
                if (lineContainer) {
                    const contRect = lineContainer.getBoundingClientRect();
                    positions = items.map((el) => {
                        const content = el.querySelector('.edu-content');
                        const cr = content.getBoundingClientRect();
                        const top = Math.round(cr.top - contRect.top);
                        const bottom = Math.round(cr.bottom - contRect.top);
                        return { top: Math.max(8, top), bottom: Math.max(top + 16, bottom) };
                    });
                }

                const gapBuffer = 24; // space left above/below each segment

                tl = gsap.timeline();
                items.forEach((el, i) => {
                    const pos = positions[i] || { top: Math.round(i * (lineRef.current.clientHeight / n)), bottom: Math.round((i + 1) * (lineRef.current.clientHeight / n)) };
                    const fillTop = pos.top + Math.round(gapBuffer / 2);
                    const fillHeight = Math.max(4, pos.bottom - pos.top - gapBuffer);

                    const fillEl = fillRefs.current[i];
                    if (fillEl) {
                        fillEl.style.top = `${fillTop}px`;
                        fillEl.style.height = '0px';
                        tl.to(fillEl, { height: fillHeight, duration: 1, ease: 'none' });
                    }

                    // position year labels (top / bottom) relative to line container
                    const yTop = yearTopRefs.current[i];
                    const yBot = yearBottomRefs.current[i];
                    if (yTop) {
                        const h = yTop.getBoundingClientRect().height || 12;
                        yTop.style.top = `${pos.top - Math.round(h / 2)}px`;
                        yTop.style.opacity = '0';
                    }
                    if (yBot) {
                        const h2 = yBot.getBoundingClientRect().height || 12;
                        yBot.style.top = `${pos.bottom - Math.round(h2 / 2)}px`;
                        yBot.style.opacity = '0';
                    }

                    tl.to(el.querySelector('.edu-bullet'), { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }, '<');
                    tl.to(el.querySelector('.edu-content'), { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, '<0.08');
                    tl.to(el.querySelectorAll('.edu-tag'), { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }, '<0.12');

                    // reveal year labels in sync
                    if (yTop) tl.to(yTop, { opacity: 1, duration: 0.35, ease: 'power2.out' }, '<');
                    if (yBot) tl.to(yBot, { opacity: 1, duration: 0.35, ease: 'power2.out' }, '<');

                    tl.to({}, { duration: 0.35 }); // small hold before next
                });

                st = ScrollTrigger.create({
                    trigger: root,
                    start: 'top top',
                    end: `+=${n * 100}%`,
                    pin: true,
                    scrub: 1,
                    animation: tl,
                });
            });
        };

        // initial build and rebuild on refresh to keep positions accurate on resize/pin changes
        buildTimeline();
        ScrollTrigger.addEventListener('refresh', buildTimeline);
        const resizeHandler = () => ScrollTrigger.refresh();
        window.addEventListener('resize', resizeHandler);

        return () => {
            try { ScrollTrigger.removeEventListener('refresh', buildTimeline); } catch (e) {}
            try { window.removeEventListener('resize', resizeHandler); } catch (e) {}
            try { if (st) st.kill(); } catch (e) {}
            try { if (tl) tl.kill(); } catch (e) {}
            try { ScrollTrigger.getAll().forEach(s => s.kill()); } catch (e) {}
        };
    }, []);

    return (
        <section id="education" ref={rootRef} className="w-full bg-black text-white py-20 overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 lg:px-0 flex flex-col lg:flex-row gap-8">
                <header className="w-full lg:w-48 mb-6 lg:mb-0">
                    <h2 className="text-sm uppercase text-white/40 tracking-widest">Education</h2>
                    <p className="mt-3 text-xs text-white/50">Timeline — newest first</p>
                </header>

                <div className="flex-1 relative">
                    <div className="absolute left-6 lg:left-12 top-0 bottom-0 w-0 flex items-center" aria-hidden>
                        <div className="relative h-full w-0 flex items-center">
                            <div ref={lineRef} className="w-[2px] bg-white/6 origin-bottom" style={{ height: '100%', transformOrigin: 'bottom center' }} />
                            {ordered.map((edu, i) => (
                                <React.Fragment key={`seg-${i}`}>
                                    <div ref={el => { fillRefs.current[i] = el; }} className="absolute left-0 top-0 w-[2px] bg-white/20 timeline-fill" style={{ height: 0 }} />
                                    <div ref={el => { yearTopRefs.current[i] = el; }} className="year-label year-top absolute -left-12 text-xs text-white/40" style={{ top: 0 }}>{edu.endYear}</div>
                                    <div ref={el => { yearBottomRefs.current[i] = el; }} className="year-label year-bottom absolute -left-12 text-xs text-white/30" style={{ top: 0 }}>{edu.startYear}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-16 pl-16 md:pl-20">
                        {ordered.map((edu, idx) => (
                            <article key={idx} ref={addItem} className="relative flex items-start gap-6 lg:gap-10">
                                <div className="w-24 flex flex-col items-center shrink-0">
                                    <div className="edu-year text-xs text-white/40">{edu.endYear}</div>
                                    <div className="mt-4 edu-bullet w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center" style={{ opacity: 0 }}>
                                        <div className="w-2 h-2 rounded-full" style={{ background: edu.institutionColor }} />
                                    </div>
                                </div>

                                <div className="edu-content max-w-3xl" style={{ opacity: 0 }}>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-sm font-semibold" style={{ color: edu.institutionColor }}>{edu.institution}</span>
                                        <span className="text-xs text-white/40">• {edu.period}</span>
                                    </div>
                                    <div className="mb-2">
                                        <div className="text-base font-bold">{edu.level}</div>
                                        <div className="text-sm text-white/60">{edu.field}</div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-3" aria-hidden>
                                        {edu.coursework.map((c, i) => (
                                            <span key={i} className="edu-tag text-xs text-white/40 px-3 py-1 rounded-full border border-white/6">{c}</span>
                                        ))}
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