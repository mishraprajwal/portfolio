import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../components/About.css';

gsap.registerPlugin(ScrollTrigger);

export default function FitnessSection() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const bars = el.querySelectorAll('.bar-fill');
    gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, stagger: 0.12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  }, []);

  return (
    <section ref={ref} id="about-fitness" className="about-section about-fitness">
      <div className="section-inner max-w-4xl mx-auto px-6 py-20">
        <h3 className="about-section-title">Run. Lift. Repeat.</h3>
        <p className="about-section-sub">A balance of endurance and power — my weekly habits</p>

        <div className="bars">
          <div className="bar-row">
            <div className="bar-label">Running</div>
            <div className="bar"><div className="bar-fill" style={{transformOrigin: 'left center'}} /></div>
            <div className="bar-value">10km / session</div>
          </div>
          <div className="bar-row">
            <div className="bar-label">Strength</div>
            <div className="bar"><div className="bar-fill" style={{transformOrigin: 'left center'}} /></div>
            <div className="bar-value">Squat / Deadlift</div>
          </div>
        </div>

        <p className="about-section-note">I track progress more than perfection — small, steady gains over time.</p>
      </div>
    </section>
  );
}
