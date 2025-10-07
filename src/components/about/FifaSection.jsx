import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../components/About.css';

gsap.registerPlugin(ScrollTrigger);

export default function FifaSection() {
  const ref = useRef(null);
  const [goals, setGoals] = useState(145035);
  const [wins, setWins] = useState(777);
  const [draws, setDraws] = useState(28);
  const [losses, setLosses] = useState(33);
  const intervalsRef = useRef({});
  const intervalRef = useRef(null);
  const [displayWinPercent, setDisplayWinPercent] = useState(() => {
    const total = 777 + 28 + 33;
    return total ? Math.round((777 / total) * 100) : 0;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // helper to safely call gsap.fromTo without passing undefined targets
    const safeGsapFromTo = (target, fromVars, toVars) => {
      try {
        if (!target) return null;
        // If it's a NodeList/array, convert and filter
        if (typeof target.length === 'number') {
          const arr = Array.from(target).filter(Boolean);
          if (!arr.length) return null;
          return gsap.fromTo(arr, fromVars, toVars);
        }
        return gsap.fromTo(target, fromVars, toVars);
      } catch (err) {
        // swallow to avoid crashing the whole page but log to help debug
        // eslint-disable-next-line no-console
        console.warn('safeGsapFromTo swallowed an error (target may be invalid)', err);
        return null;
      }
    };

    const inner = el.querySelector('.section-inner');
    const counter = el.querySelector('.fifa-large-counter');

    // staggered reveal for text and stats, subtle lift + fade like Apple's product sections
    if (inner) {
      safeGsapFromTo(inner, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    }

  // pulse the counter slightly when it changes
  const pulse = (node) => {
    if (!node) return;
    try {
      gsap.fromTo(node, { scale: 0.98 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.6)' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('pulse animation failed', err);
    }
  };

    const startCounter = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        setGoals((g) => {
          const inc = Math.floor(Math.random() * 5) + 1;
          const next = g + inc;
          pulse(counter);
          return next;
        });
      }, 220);
    };
    const stopCounter = () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };

    // set up separate intervals for wins/draws/losses while in view
    const startRecordCounters = () => {
      if (intervalsRef.current.wins) return;
      // wins interval
      intervalsRef.current.wins = setInterval(() => {
        setWins((w) => {
          const next = w + Math.floor(Math.random() * 2) + 1; // faster increments
          const node = el.querySelector('.record-number.wins');
          if (node) safeGsapFromTo(node, { scale: 0.98 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.6)' });
          return next;
        });
      }, 700);

      // single interval to update draws OR losses randomly (so they don't both increase together)
      intervalsRef.current.records = setInterval(() => {
        const r = Math.random();
        if (r < 0.55) {
          setDraws((d) => {
            const next = d + 1;
            const node = el.querySelector('.record-number.draws');
            if (node) safeGsapFromTo(node, { scale: 0.98 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.6)' });
            return next;
          });
        } else if (r < 0.95) {
          setLosses((l) => {
            const next = l + 1;
            const node = el.querySelector('.record-number.losses');
            if (node) safeGsapFromTo(node, { scale: 0.98 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.6)' });
            return next;
          });
        } else {
          // no change occasionally
        }
      }, 1200);
    };

    const stopRecordCounters = () => {
      ['wins', 'records'].forEach((k) => { if (intervalsRef.current[k]) { clearInterval(intervalsRef.current[k]); intervalsRef.current[k] = null; } });
    };

    // reveal the stats row with a left-to-right slide
    try {
      const items = el.querySelectorAll('.stat-item');
      if (items && items.length) {
        safeGsapFromTo(items, { x: -26, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } });
      }
    } catch (err) {
      // swallow - don't break the page
    }

    // win percent is animated from React state when wins/draws/losses change

    let st = null;
    try {
      st = ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          try { startCounter(); startRecordCounters(); } catch (err) { console.error('FifaSection onEnter failed', err); }
        },
        onEnterBack: () => {
          try { startCounter(); startRecordCounters(); } catch (err) { console.error('FifaSection onEnterBack failed', err); }
        },
        onLeave: () => {
          try { stopCounter(); stopRecordCounters(); } catch (err) { console.error('FifaSection onLeave failed', err); }
        },
        onLeaveBack: () => {
          try { stopCounter(); stopRecordCounters(); } catch (err) { console.error('FifaSection onLeaveBack failed', err); }
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create main ScrollTrigger in FifaSection', err);
    }

    return () => { stopCounter(); stopRecordCounters(); try { if (st && typeof st.kill === 'function') st.kill(); } catch(e){} };
  }, []);

  // animate displayed win percent whenever wins/draws/losses change
  useEffect(() => {
    const total = wins + draws + losses;
    const pct = total ? Math.round((wins / total) * 100) : 0;
    const obj = { v: displayWinPercent };
    try {
      gsap.to(obj, { v: pct, duration: 0.9, ease: 'power2.out', onUpdate: () => setDisplayWinPercent(Math.round(obj.v)) });
    } catch (err) {
      setDisplayWinPercent(pct);
    }
  }, [wins, draws, losses]);

  return (
    <section ref={ref} id="about-fifa" className="about-section about-fifa">
      <div className="section-inner max-w-4xl mx-auto px-6 py-20">
        <h3 className="about-section-title centered">FIFA — Controller & Conqueror</h3>
        <p className="about-section-sub centered">Official career goals (because practice makes perfect)</p>

        <div className="centered">
          <div className="fifa-large-counter" aria-live="polite">{goals.toLocaleString()}</div>
          <p className="about-section-note">This counter keeps climbing while you admire it — a small tribute to many comebacks and last-minute winners. Sometimes I win, sometimes I blame the stick.</p>
        </div>

        {/* Stats row: Championships + Records (compact: wins/draws/losses + win rate) */}
        <div className="about-grid" style={{ marginTop: '2.25rem' }}>
          <div className="about-card stat-item">
            <div className="about-section-title">Championships</div>
            <div className="about-section-sub">Championships won</div>
            <div className="record-number" data-value={2} aria-hidden="true">2</div>
            <p className="about-section-note">Two glorious seasons of victory — one tactical, one purely inspirational (and slightly lucky).</p>
          </div>

          <div className="about-card stat-item">
            <div className="about-section-title">Records vs Friends</div>
            <div className="about-section-sub">Friendly rivalries, brutally settled</div>

            <div className="record-row" style={{ marginTop: '0.6rem', width: '100%' }}>
              <div className="record-pill wins">Wins</div>
              <div className="record-pill draws">Draws</div>
              <div className="record-pill losses">Losses</div>
              <div style={{ width: '120px' }}></div>
            </div>

            <div className="record-values" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 120px', gap: '1rem', marginTop: '0.6rem', alignItems: 'center' }}>
              <div className="record-number wins" aria-hidden="true">{wins.toLocaleString()}</div>
              <div className="record-number draws" aria-hidden="true">{draws.toLocaleString()}</div>
              <div className="record-number losses" aria-hidden="true">{losses.toLocaleString()}</div>
              <div style={{ textAlign: 'right' }}>
                <div className="winrate-label">Win Rate</div>
                <div className="winrate-percent" data-value={displayWinPercent} aria-hidden="true">{displayWinPercent}%</div>
              </div>
            </div>

            <p className="about-section-note" style={{ marginTop: '0.8rem' }}>I prefer to think of these numbers as friendly nudges rather than cruel truths — snacks and late subs helped.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
