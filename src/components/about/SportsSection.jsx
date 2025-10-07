import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../components/About.css';

gsap.registerPlugin(ScrollTrigger);

export default function SportsSection() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(el.querySelectorAll('.badge'), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });

  }, []);

  return (
    <section ref={ref} id="about-sports" className="about-section about-sports">
      <div className="section-inner max-w-4xl mx-auto px-6 py-20">
        <h3 className="about-section-title">Matchday Rituals</h3>
        <p className="about-section-sub">Soccer & Cricket — my two windows to the world of sport</p>

        <div className="badges-row">
          <div className="badge">Soccer — Tactics & Flair</div>
          <div className="badge">Cricket — Patience & Explosions</div>
        </div>

        <p className="about-section-note">I enjoy the narratives: a 25-pass build-up or a 6-over blitz. Both teach patience and the joy of momentum.</p>
      </div>
    </section>
  );
}
