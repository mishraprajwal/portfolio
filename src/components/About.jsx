import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';
import FifaSection from './about/FifaSection';
import SportsSection from './about/SportsSection';
import FitnessSection from './about/FitnessSection';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const rootRef = useRef(null);
  const fifaSectionRef = useRef(null);
  const [goals, setGoals] = useState(145035);
  const intervalRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Title and badges reveal
    gsap.fromTo(
      root.querySelector('.about-title'),
      { y: 36, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 90%' } }
    );

    gsap.fromTo(
      root.querySelectorAll('.about-badge'),
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 85%' } }
    );

    // Progress bars for running / lifting
    const runFill = root.querySelector('.bar-run .bar-fill');
    const liftFill = root.querySelector('.bar-lift .bar-fill');
    if (runFill && liftFill) {
      gsap.fromTo(
        [runFill, liftFill],
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: root, start: 'top 85%' } }
      );
    }

    // FIFA counter: while FIFA section is in view, keep increasing the number.
    const startCounter = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        // increase by 1-5 goals randomly to make it feel lively
        setGoals((g) => g + Math.floor(Math.random() * 5) + 1);
      }, 220);
    };
    const stopCounter = () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };

    const st = ScrollTrigger.create({
      trigger: fifaSectionRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: startCounter,
      onEnterBack: startCounter,
      onLeave: stopCounter,
      onLeaveBack: stopCounter
    });

    return () => {
      stopCounter();
      try { st.kill(); } catch (e) {}
      try { ScrollTrigger.getAll().forEach(s => s.kill()); } catch (e) {}
    };
  }, []);

  return (
    <>
      <FifaSection />
      <SportsSection />
      <FitnessSection />
    </>
  );
};

export default About;
