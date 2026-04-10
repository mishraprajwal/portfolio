import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../About.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Inline SVG coffee cup matching the user's image ── */
const CoffeeCup = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Steam lines */}
    <path className="steam steam-1" d="M80 72 C80 58, 72 52, 80 38" stroke="#C4A882" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path className="steam steam-2" d="M100 68 C100 54, 92 48, 100 34" stroke="#C4A882" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path className="steam steam-3" d="M120 72 C120 58, 112 52, 120 38" stroke="#C4A882" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {/* Cup body */}
    <path d="M52 88 L52 148 C52 162 66 174 100 174 C134 174 148 162 148 148 L148 88 Z" stroke="#C4A882" strokeWidth="4" fill="rgba(196,168,130,0.06)" />
    {/* Cup rim */}
    <ellipse cx="100" cy="88" rx="48" ry="8" stroke="#C4A882" strokeWidth="4" fill="rgba(196,168,130,0.08)" />
    {/* Handle */}
    <path d="M148 100 C170 100, 174 120, 174 130 C174 140, 168 150, 148 148" stroke="#C4A882" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* Coffee liquid line */}
    <ellipse cx="100" cy="100" rx="40" ry="6" fill="rgba(196,168,130,0.12)" />
  </svg>
);

/* ── Coffee counter ── */
const CUPS_PER_DAY = 4;
const START_DATE = new Date('2019-01-01');

function getCupCount() {
  const now = new Date();
  const days = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));
  return days * CUPS_PER_DAY;
}

export default function CoffeeSection() {
  const sectionRef = useRef(null);
  const [cups, setCups] = useState(getCupCount);
  const counterRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Left side: coffee cup reveal with float-up
      gsap.fromTo(
        el.querySelector('.coffee-visual'),
        { y: 60, autoAlpha: 0, scale: 0.9 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' } }
      );

      // Right side: staggered text reveals
      gsap.fromTo(
        el.querySelectorAll('.coffee-reveal'),
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' } }
      );

      // Contact card entrance
      gsap.fromTo(
        el.querySelector('.coffee-contact'),
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 60%' } }
      );

      // Counter pulse while in view
      let interval;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          interval = setInterval(() => {
            setCups(c => c + 1);
            if (counterRef.current) {
              gsap.fromTo(counterRef.current, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.6)' });
            }
          }, 800);
        },
        onEnterBack: () => {
          interval = setInterval(() => {
            setCups(c => c + 1);
            if (counterRef.current) {
              gsap.fromTo(counterRef.current, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.6)' });
            }
          }, 800);
        },
        onLeave: () => clearInterval(interval),
        onLeaveBack: () => clearInterval(interval),
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | sent | error
  const [showSchedule, setShowSchedule] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setFormStatus('sending');

    try {
      const res = await fetch('https://formspree.io/f/mreowpkb', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      if (res.ok) {
        setFormStatus('sent');
        form.reset();
        setShowSchedule(false);
        setTimeout(() => setFormStatus('idle'), 4000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 3000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  return (
    <section ref={sectionRef} className="about-section relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-0 w-full">

        {/* ── Main split layout ── */}
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-16">

          {/* Left: Animated coffee cup */}
          <div className="coffee-visual flex-shrink-0 flex items-center justify-center">
            <div className="coffee-float">
              <CoffeeCup className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56" />
            </div>
          </div>

          {/* Right: Witty text + counter + contact */}
          <div className="flex-1 text-center lg:text-left w-full">
            <h3 className="coffee-reveal text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              Fueled by <span style={{ color: '#C4A882' }}>Caffeine</span>
            </h3>
            <p className="coffee-reveal mt-2 md:mt-3 text-sm md:text-base text-white/70 leading-relaxed max-w-xl">
              Behind every clean commit and elegant solution is an unreasonable amount of coffee.
              I don't debug — I caffeinate until the code fixes itself.
            </p>

            <div className="coffee-reveal mt-4 md:mt-6 flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <div className="text-center">
                <div ref={counterRef} className="text-3xl md:text-5xl font-extrabold tracking-tighter tabular-nums" style={{ color: '#C4A882' }}>
                  {cups.toLocaleString()}
                </div>
                <p className="text-xs mt-0.5 text-white/40">cups & counting</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/10" />
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-xs">
                  Espresso before standup. Pour-over before deep work.
                  Cold brew before production deploys. It's not addiction — it's a <span className="text-white/90 font-medium">development dependency</span>.
                </p>
              </div>
            </div>

            <p className="coffee-reveal mt-3 text-white/40 text-xs italic">
              "First, solve the problem. Then, pour the coffee." — somebody, probably
            </p>

            {/* ── Inline contact ── */}
            <div className="coffee-contact mt-6 md:mt-8">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 mb-1">
                  <h4 className="text-sm md:text-base font-semibold text-white">
                    Let's grab a virtual coffee
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowSchedule(s => !s)}
                    className="text-[10px] md:text-xs text-white/50 hover:text-white/80 transition border border-white/[0.08] rounded-full px-2.5 py-0.5"
                  >
                    {showSchedule ? '✉ Message' : 'Schedule a call'}
                  </button>
                </div>
                <p className="text-white/50 text-xs mb-3">
                  {showSchedule ? 'Pick a date & time — I\'ll confirm over email.' : 'Drop your message — I read every one over my morning espresso.'}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:gap-3">
                  <input type="hidden" name="_subject" value={showSchedule ? 'Call request from portfolio' : 'Message from portfolio'} />

                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs md:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition"
                    />
                    {!showSchedule && (
                      <>
                        <input
                          name="message"
                          required
                          placeholder="What's brewing on your mind?"
                          className="flex-[2] bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs md:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition"
                        />
                        <button
                          type="submit"
                          disabled={formStatus === 'sending'}
                          className="px-5 py-2 rounded-full bg-white text-black font-medium text-xs md:text-sm hover:bg-white/90 active:scale-[0.97] transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                        >
                          {formStatus === 'sending' ? 'Sending...' : formStatus === 'sent' ? 'Sent ✓' : formStatus === 'error' ? 'Failed' : 'Send'}
                        </button>
                      </>
                    )}
                  </div>

                  {showSchedule && (
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                      <input
                        name="date"
                        type="date"
                        required
                        min={(() => { const d = new Date(); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-white/20 transition [color-scheme:dark]"
                      />
                      <select
                        name="time"
                        required
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-white/20 transition appearance-none"
                      >
                        <option value="" disabled selected className="text-white/30">Select time (PST)</option>
                        {timeSlots.map(t => (
                          <option key={t} value={t} className="bg-black text-white">{t}</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={formStatus === 'sending'}
                        className="px-5 py-2 rounded-full bg-white text-black font-medium text-xs md:text-sm hover:bg-white/90 active:scale-[0.97] transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                      >
                        {formStatus === 'sending' ? 'Sending...' : formStatus === 'sent' ? 'Booked ✓' : formStatus === 'error' ? 'Failed' : 'Book'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
