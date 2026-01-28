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

    // Simple and classy reveal animations: subtle vertical fades
    gsap.fromTo(el.querySelector('.realmadrid-card'), { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });

    gsap.fromTo(el.querySelector('.about-section-title'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true }, delay: 0.2 });

    gsap.fromTo(el.querySelector('.about-section-sub'), { y: 25, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true }, delay: 0.3 });

    gsap.fromTo(el.querySelector('.realmadrid-content p'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 75%', once: true }, delay: 0.5 });

    gsap.fromTo(el.querySelectorAll('.principles-list li'), { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 70%', once: true }, delay: 0.7 });

    gsap.fromTo(el.querySelector('.realmadrid-image'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 65%', once: true }, delay: 0.9 });

    gsap.fromTo(el.querySelector('.about-section-note'), { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 60%', once: true }, delay: 1.1 });

  }, []);

  return (
    <section ref={ref} id="about-sports" className="about-section about-sports">
      <div className="section-inner max-w-4xl mx-auto px-6 py-20">
        <div className="realmadrid-card">
          <h3 className="about-section-title">Real Madrid & Cristiano Ronaldo</h3>
          <p className="about-section-sub">Hala Madrid — CR7 Forever</p>

          <div className="realmadrid-content">
            <p>In the pitch of software engineering, I play by rules as legendary as Real Madrid's dominance:</p>
            <ul className="principles-list">
              <li><strong>KISS (Keep It Simple, Stupid)</strong>: Like CR7's signature SIU celebration—simple, iconic, and unforgettable. I keep code clean and straightforward, no unnecessary complexity.</li>
              <li><strong>YAGNI (You Ain't Gonna Need It)</strong>: Real Madrid doesn't sign players for hypothetical scenarios. I build only what's needed, avoiding over-engineering and future debt.</li>
              <li><strong>Separation of Concerns</strong>: Just as Los Blancos have distinct roles for strikers, midfielders, and defenders, I separate UI, logic, and data layers for maintainable code.</li>
              <li><strong>Composition over Inheritance</strong>: Building a winning team through flexible compositions, not rigid hierarchies. My code favors composable modules for adaptability.</li>
              <li><strong>Fail Fast</strong>: Real Madrid's lightning counter-attacks expose weaknesses early. I implement quick validations and error handling to catch issues before they escalate.</li>
              <li><strong>Law of Demeter (Least Knowledge)</strong>: Players interact only with immediate teammates, not the entire squad. My objects talk to close collaborators, reducing tight coupling.</li>
              <li><strong>Boy Scout Rule</strong>: Leave the codebase better than you found it, just like maintaining the pristine Santiago Bernabéu pitch. Continuous refactoring for long-term excellence.</li>
            </ul>
            <p>Just like Real Madrid's flair and precision, I build software that's scalable, maintainable, and championship-worthy.</p>
          </div>

          <div className="realmadrid-image">
            <div className="badge">CR7 & Los Blancos</div>
          </div>

          <p className="about-section-note">Hala Madrid: Where soccer tactics meet code architecture. CR7's SIU? My stack overflow solutions.</p>
        </div>
      </div>
    </section>
  );
}
