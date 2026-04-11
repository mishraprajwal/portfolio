import React, { useRef, useEffect } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import "./Education.css";

gsap.registerPlugin(ScrollTrigger);

const educationData = [
    {
        level: "Master's Degree",
        field: "Computer and Information Science",
        institution: "New Jersey Institute of Technology",
        institutionColor: "#D32F2F",
        year: "September 2023 - May 2025",
        
        coursework: [
          'Machine Learning',
          'Data Structures',
          'Databases',
          'Opearating Systems',
          'Web Development',
          'Big Data'
        ]
    },
    {
        level: "Bachelor's Degree",
        field: "Information Technology",
        institution: "University of Mumbai",
        institutionColor: "#4338CA",
        year: "August 2016 - May 2020",
        
        coursework: [
          'Data Structures',
          'Databases',
          'Network Security',
          'Embedded Systems',
          'Microcontrollers',
          'Artifiicial Intelligence'
        ]
    },
];

const Education = () => {
    const rootRef = useRef(null);
    const cardsRef = useRef([]);
    cardsRef.current = [];
    const addCard = (el) => { if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el); };

    useEffect(() => {
        const root = rootRef.current;
        const cards = cardsRef.current;
        if (!root || !cards || cards.length === 0) return;

        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // initial states
        gsap.set(root, { autoAlpha: 0 });
        gsap.set(cards, { y: 28, autoAlpha: 0, scale: 0.98, transformOrigin: 'center center' });

        if (prefersReduced) {
            // simple fade in for reduced motion
            gsap.to(root, { autoAlpha: 1, duration: 0.3 });
            gsap.to(cards, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.3 });
            return;
        }

        // title reveal + card stagger timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.to(root, { autoAlpha: 1, duration: 0.5 });

        tl.fromTo(
            root.querySelector('.education-title'),
            { y: 36, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8 },
            '<'
        );

        tl.to(cards, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.12, duration: 0.8 }, '-=0.2');

        // attach scroll trigger so animation runs as section enters
        ScrollTrigger.create({
            trigger: root,
            start: 'top 85%',
            end: 'bottom 20%',
            animation: tl,
            toggleActions: 'play none none reverse',
            scrub: false
        });

        // subtle parallax background movement for depth (if you want subtle motion)
        const bg = root.querySelector('.education-bg');
        if (bg) {
            gsap.to(bg, {
                yPercent: -8,
                ease: 'none',
                scrollTrigger: {
                    trigger: root,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.6
                }
            });
        }

        return () => {
            try { ScrollTrigger.getAll().forEach(s => s.kill()); } catch (e) {}
            try { tl.kill(); } catch (e) {}
        };
    }, []);

    return (
        <section ref={rootRef} className="education-section" id="education">
            <div className="education-bg" aria-hidden />
            <div className="education-inner max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <h2 className="education-title">Education</h2>
                <div className="education-list">
                    {educationData.map((edu, idx) => (
                        <article
                            key={idx}
                            ref={addCard}
                            className="education-card"
                            tabIndex={0}
                            aria-label={`${edu.level} in ${edu.field} from ${edu.institution} (${edu.year})`}
                            style={{ position: 'relative', overflow: 'hidden' }}
                        >
                            {/* Institution-colored top accent line */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                                style={{ background: `linear-gradient(to right, transparent, ${edu.institutionColor}60, transparent)` }}
                            />
                            {/* Institution-colored corner glow */}
                            <div
                                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                                style={{ backgroundColor: `${edu.institutionColor}12` }}
                            />
                            <div className="education-row">
                                <div className="education-left">
                                    <div className="education-level">{edu.level}</div>
                                    <div className="education-field">{edu.field}</div>
                                </div>
                                <div className="education-right">
                                    <div className="education-institution" style={{ color: edu.institutionColor }}>{edu.institution}</div>
                                    <div className="education-year">{edu.year}</div>
                                    {/* CGPA removed per request */}
                                </div>
                            </div>
                                <div className="education-tags" aria-hidden>
                                    {edu.coursework && edu.coursework.map((c, i) => (
                                        <span key={i} className="edu-tag">{c}</span>
                                    ))}
                                </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;