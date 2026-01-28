import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../components/About.css';

gsap.registerPlugin(ScrollTrigger);

export default function FitnessSection() {
  const ref = useRef(null);
  const [dailyKm, setDailyKm] = useState(0);
  const [highestKm, setHighestKm] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apple-inspired smooth reveals: layered, physics-based easing
    gsap.fromTo(el.querySelector('.fitness-card'), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });

    gsap.fromTo(el.querySelectorAll('.about-section-title, .about-section-sub'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' }, delay: 0.2 });

    const bars = el.querySelectorAll('.bar-fill');
    gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, stagger: 0.2, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 80%' }, delay: 0.4 });

    gsap.fromTo(el.querySelectorAll('.bar-label, .bar-value'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 75%' }, delay: 0.6 });

    // Count-up animation with smooth easing
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: 6.5,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            setDailyKm(Math.round(this.targets()[0].val * 10) / 10);
          }
        });
        gsap.to({ val: 0 }, {
          val: 15,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            setHighestKm(Math.round(this.targets()[0].val));
          }
        });
      }
    });

    gsap.fromTo(el.querySelector('.about-section-note'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 70%' }, delay: 0.8 });
  }, []);

  return (
    <section ref={ref} id="about-fitness" className="about-section about-fitness">
      <div className="section-inner max-w-4xl mx-auto px-6 py-20">
        <div className="fitness-card">
          <h3 className="about-section-title">Running Journey</h3>
          <p className="about-section-sub">Endurance through miles — my daily ritual</p>

          <div className="bars">
            <div className="bar-row">
              <div className="bar-label">Daily Run</div>
              <div className="bar"><div className="bar-fill" style={{transformOrigin: 'left center', transform: `scaleX(${dailyKm / 10})`}} /></div>
              <div className="bar-value">{dailyKm} km</div>
            </div>
            <div className="bar-row">
              <div className="bar-label">Highest Run</div>
              <div className="bar"><div className="bar-fill" style={{transformOrigin: 'left center', transform: `scaleX(${highestKm / 20})`}} /></div>
              <div className="bar-value">{highestKm} km</div>
            </div>
          </div>

          <p className="about-section-note">Every step builds resilience — consistency over intensity.</p>
        </div>
      </div>
    </section>
  );
}
