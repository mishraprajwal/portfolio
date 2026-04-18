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
        period: 'September 2023 – May 2025',
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
        period: 'August 2016 – May 2020',
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
    const timelineRef = useRef(null);
    const lineFillRef = useRef(null);
    const cardRefs = useRef([]);
    const dotRefs = useRef([]);
    const yearStartRefs = useRef([]);
    const yearEndRefs = useRef([]);

    const ordered = [...educationData].sort((a, b) => b.endYear - a.endYear);

    useEffect(() => {
        const root = rootRef.current;
        const timeline = timelineRef.current;
        if (!root || !timeline) return;

        const prefersReduced =
            window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            if (prefersReduced) {
                gsap.set(lineFillRef.current, { height: '100%' });
                cardRefs.current.forEach((card) => {
                    gsap.set(card.querySelector('.edu-content'), { autoAlpha: 1, x: 0 });
                    gsap.set(card.querySelectorAll('.edu-tag'), { autoAlpha: 1, y: 0 });
                });
                dotRefs.current.forEach((d) => gsap.set(d, { scale: 1, autoAlpha: 1 }));
                yearStartRefs.current.forEach((y) => gsap.set(y, { autoAlpha: 1 }));
                yearEndRefs.current.forEach((y) => gsap.set(y, { autoAlpha: 1 }));
                return;
            }

            // Initial hidden states
            gsap.set(lineFillRef.current, { height: 0 });
            cardRefs.current.forEach((card) => {
                gsap.set(card.querySelector('.edu-content'), { autoAlpha: 0, x: 40 });
                gsap.set(card.querySelectorAll('.edu-tag'), { autoAlpha: 0, y: 12 });
            });
            dotRefs.current.forEach((d) => gsap.set(d, { scale: 0, autoAlpha: 0 }));
            yearStartRefs.current.forEach((y) => gsap.set(y, { autoAlpha: 0, y: 8 }));
            yearEndRefs.current.forEach((y) => gsap.set(y, { autoAlpha: 0, y: -8 }));

            // Line grows top→down as user scrolls through the timeline
            gsap.to(lineFillRef.current, {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: timeline,
                    start: 'top 75%',
                    end: 'bottom 50%',
                    scrub: 0.6,
                },
            });

            // Each card reveals as the filling line reaches its dot
            cardRefs.current.forEach((card, i) => {
                const content = card.querySelector('.edu-content');
                const tags = card.querySelectorAll('.edu-tag');
                const dot = dotRefs.current[i];
                const yearEnd = yearEndRefs.current[i];
                const yearStart = yearStartRefs.current[i];

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'top 25%',
                        scrub: 0.8,
                    },
                });

                tl.to(yearEnd, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0)
                    .to(dot, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(1.6)' }, 0.05)
                    .to(content, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
                    .to(
                        tags,
                        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
                        0.25
                    )
                    .to(yearStart, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.6);
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="education"
            ref={rootRef}
            className="w-full bg-black text-white pt-20 md:pt-28 pb-32 md:pb-48 overflow-hidden"
        >
            <div className="max-w-5xl mx-auto px-4 md:px-6">
                <h2
                    className="text-2xl sm:text-3xl md:text-5xl font-semibold text-center mb-3 md:mb-4 text-white"
                    style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                    Education
                </h2>
                <p className="text-center text-white/40 text-sm md:text-base mb-16 md:mb-24 max-w-lg mx-auto">
                    A timeline of where I studied — newest first
                </p>

                <div ref={timelineRef} className="relative max-w-3xl mx-auto pb-12 md:pb-16">
                    {/* Vertical line backdrop */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-white/8"
                        style={{ left: '3.25rem' }}
                        aria-hidden
                    />
                    {/* Progressive fill */}
                    <div
                        ref={lineFillRef}
                        className="absolute top-0 w-[2px]"
                        style={{
                            left: '3.25rem',
                            height: 0,
                            background:
                                'linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.4) 70%, rgba(255,255,255,0.15))',
                            boxShadow: '0 0 12px rgba(255,255,255,0.25)',
                        }}
                        aria-hidden
                    />

                    <div className="flex flex-col gap-28 md:gap-40">
                        {ordered.map((edu, i) => (
                            <article
                                key={i}
                                ref={(el) => {
                                    cardRefs.current[i] = el;
                                }}
                                className="relative"
                            >
                                {/* End year label (top of card, near line) */}
                                <div
                                    ref={(el) => {
                                        yearEndRefs.current[i] = el;
                                    }}
                                    className="edu-year-label absolute text-[11px] md:text-xs font-mono tracking-widest text-white/55"
                                    style={{ left: 0, top: '-1.25rem', width: '2.5rem' }}
                                >
                                    {edu.endYear}
                                </div>

                                {/* Dot on the line */}
                                <div
                                    ref={(el) => {
                                        dotRefs.current[i] = el;
                                    }}
                                    className="edu-dot absolute flex items-center justify-center rounded-full bg-black"
                                    style={{
                                        left: 'calc(3.25rem - 9px)',
                                        top: '0.5rem',
                                        width: '18px',
                                        height: '18px',
                                        border: `2px solid ${edu.institutionColor}`,
                                        boxShadow: `0 0 16px ${edu.institutionColor}66`,
                                    }}
                                    aria-hidden
                                >
                                    <div
                                        className="rounded-full"
                                        style={{ width: '6px', height: '6px', background: edu.institutionColor }}
                                    />
                                </div>

                                {/* Card content */}
                                <div
                                    className="edu-content"
                                    style={{ paddingLeft: '5.5rem' }}
                                >
                                    <div className="flex items-baseline gap-x-3 gap-y-1 mb-2 flex-wrap">
                                        <span
                                            className="text-base md:text-lg font-semibold"
                                            style={{ color: edu.institutionColor }}
                                        >
                                            {edu.institution}
                                        </span>
                                        <span className="text-xs md:text-sm text-white/40">
                                            {edu.period}
                                        </span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold leading-tight">
                                        {edu.level}
                                    </h3>
                                    <p className="text-sm md:text-base text-white/60 mt-1 mb-5">
                                        {edu.field}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {edu.coursework.map((c, ci) => (
                                            <span
                                                key={ci}
                                                className="edu-tag text-xs md:text-sm text-white/70 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04]"
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Start year label (bottom of card) */}
                                <div
                                    ref={(el) => {
                                        yearStartRefs.current[i] = el;
                                    }}
                                    className="edu-year-label absolute text-[11px] md:text-xs font-mono tracking-widest text-white/55"
                                    style={{ left: 0, bottom: '-1.75rem', width: '2.5rem' }}
                                >
                                    {edu.startYear}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
