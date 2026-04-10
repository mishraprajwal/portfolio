import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../About.css';

gsap.registerPlugin(ScrollTrigger);

const LEETCODE_USERNAME = 'mishraprajwal28';

/* ── Fallback calendar + stats (fetched from LeetCode GraphQL API) ── */
const FALLBACK_CALENDAR = {"1744502400":1,"1745107200":1,"1745280000":1,"1745366400":1,"1745452800":6,"1745539200":1,"1745712000":1,"1745884800":5,"1745971200":2,"1746057600":2,"1746662400":1,"1746748800":12,"1746835200":3,"1746921600":5,"1747180800":5,"1747267200":13,"1747353600":12,"1747440000":2,"1747526400":2,"1747699200":2,"1747785600":8,"1747872000":11,"1747958400":9,"1748044800":17,"1748131200":9,"1748217600":17,"1748649600":11,"1748736000":14,"1748822400":1,"1748908800":7,"1748995200":2,"1749081600":21,"1749168000":14,"1749254400":23,"1749340800":1,"1749427200":6,"1749513600":5,"1749600000":12,"1749686400":13,"1749772800":5,"1750032000":1,"1750118400":3,"1750204800":3,"1750377600":5,"1750464000":10,"1750550400":3,"1750636800":4,"1750723200":6,"1750809600":6,"1750896000":4,"1750982400":1,"1751155200":2,"1751328000":6,"1751414400":5,"1751500800":2,"1751587200":5,"1751932800":3,"1752019200":1,"1752192000":2,"1752624000":2,"1752710400":1,"1752796800":3,"1753056000":2,"1753142400":1,"1753401600":1,"1753488000":1,"1757376000":1,"1760572800":1,"1760659200":1,"1761264000":1,"1763424000":1,"1765065600":2,"1765152000":2,"1765238400":1,"1765584000":1,"1765843200":3,"1765929600":2,"1766966400":1,"1768262400":2,"1768348800":2,"1769040000":2,"1769126400":2,"1773964800":2,"1774051200":4,"1774137600":8,"1774224000":1,"1774310400":1,"1774396800":3,"1774483200":2,"1774569600":2,"1774656000":2,"1774742400":6,"1775260800":8,"1775347200":1};
const FALLBACK_STATS = { total: 183, easy: 53, medium: 112, hard: 18 };

/* ── Fetch live data via CORS-friendly community API ── */
async function fetchLeetCodeData() {
  try {
    const [solvedRes, calendarRes] = await Promise.all([
      fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`),
      fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/calendar`),
    ]);

    if (!solvedRes.ok || !calendarRes.ok) throw new Error('API error');

    const solved = await solvedRes.json();
    const calendar = await calendarRes.json();

    const cal = calendar.submissionCalendar
      ? (typeof calendar.submissionCalendar === 'string'
          ? JSON.parse(calendar.submissionCalendar)
          : calendar.submissionCalendar)
      : null;

    return {
      stats: {
        total: solved.solvedProblem ?? FALLBACK_STATS.total,
        easy: solved.easySolved ?? FALLBACK_STATS.easy,
        medium: solved.mediumSolved ?? FALLBACK_STATS.medium,
        hard: solved.hardSolved ?? FALLBACK_STATS.hard,
      },
      calendar: cal || FALLBACK_CALENDAR,
    };
  } catch {
    return { stats: FALLBACK_STATS, calendar: FALLBACK_CALENDAR };
  }
}

/* ── Build heatmap grid (52 weeks × 7 days) ── */
function buildHeatmapData(calendar) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - 363);
  startDay.setDate(startDay.getDate() - startDay.getDay());

  const weeks = [];
  const d = new Date(startDay);

  while (d <= today) {
    const week = [];
    for (let dow = 0; dow < 7; dow++) {
      const dayStart = Math.floor(d.getTime() / 1000);
      const aligned = dayStart - (dayStart % 86400);
      const count = calendar[aligned] || calendar[String(aligned)] || 0;
      week.push({ date: new Date(d), count });
      d.setDate(d.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function getColor(count) {
  if (count === 0) return 'rgba(255,255,255,0.04)';
  if (count <= 2) return 'rgba(74,222,128,0.35)';
  if (count <= 5) return 'rgba(74,222,128,0.5)';
  if (count <= 10) return 'rgba(74,222,128,0.7)';
  return 'rgba(74,222,128,0.9)';
}

function getMonthLabels(weeks) {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const m = week[0].date.getMonth();
    if (m !== lastMonth) {
      lastMonth = m;
      labels.push({ index: i, label: week[0].date.toLocaleString('en-US', { month: 'short' }) });
    }
  });
  return labels;
}

function computeSummary(calendar) {
  const vals = Object.values(calendar);
  const totalSub = vals.reduce((a, b) => a + b, 0);
  const active = vals.filter(v => v > 0).length;

  const sortedDays = Object.keys(calendar).map(Number).sort((a, b) => a - b);
  let streak = 0, best = 0;
  for (let i = 0; i < sortedDays.length; i++) {
    if (i > 0 && sortedDays[i] - sortedDays[i - 1] === 86400) {
      streak++;
    } else {
      streak = 1;
    }
    if (streak > best) best = streak;
  }

  return { totalSub, active, maxStreak: best };
}

export default function DSASection() {
  const sectionRef = useRef(null);
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [weeks, setWeeks] = useState(() => buildHeatmapData(FALLBACK_CALENDAR));
  const [summary, setSummary] = useState(() => computeSummary(FALLBACK_CALENDAR));

  useEffect(() => {
    fetchLeetCodeData().then(({ stats: s, calendar }) => {
      setStats(s);
      setWeeks(buildHeatmapData(calendar));
      setSummary(computeSummary(calendar));
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.dsa-reveal'),
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' } }
      );

      gsap.fromTo(
        el.querySelectorAll('.heatmap-cell'),
        { autoAlpha: 0, scale: 0 },
        { autoAlpha: 1, scale: 1, stagger: 0.002, duration: 0.25, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: el.querySelector('.heatmap-grid'), start: 'top 90%' } }
      );

      gsap.fromTo(
        el.querySelectorAll('.diff-pill'),
        { y: 20, autoAlpha: 0, scale: 0.9 },
        { y: 0, autoAlpha: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: el, start: 'top 70%' } }
      );
    }, el);

    return () => ctx.revert();
  }, [weeks]);

  const monthLabels = getMonthLabels(weeks);

  return (
    <section ref={sectionRef} className="about-section relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-0 w-full">

        {/* Header + Stats */}
        <div className="text-center mb-8 md:mb-10">
          <p className="dsa-reveal text-xs md:text-sm font-medium tracking-widest uppercase text-green-400/60 mb-2">
            Problem Solver
          </p>
          <h3 className="dsa-reveal text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Data Structures &amp; Algorithms
          </h3>
          <p className="dsa-reveal mt-2 md:mt-3 text-sm md:text-base text-white/50 leading-relaxed max-w-xl mx-auto">
            I don&apos;t just solve problems — I optimize them until the time complexity
            begs for mercy. Trees, graphs, dynamic programming —
            the kind of puzzles that make 3 AM feel productive.
          </p>

          {/* Big number */}
          <div className="dsa-reveal mt-5">
            <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter tabular-nums">
              {stats.total}
            </span>
            <p className="text-xs text-white/40 mt-1">problems solved on LeetCode</p>
          </div>

          {/* Difficulty pills */}
          <div className="dsa-reveal mt-4 flex flex-wrap gap-2 justify-center">
            <span className="diff-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/10 border border-green-500/20 text-green-400">
              Easy {stats.easy}
            </span>
            <span className="diff-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              Medium {stats.medium}
            </span>
            <span className="diff-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400">
              Hard {stats.hard}
            </span>
          </div>
        </div>

        {/* ── GitHub-style Heatmap ── */}
        <div className="dsa-reveal rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4 md:p-5 overflow-x-auto w-fit mx-auto max-w-full">

          {/* Summary row */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-1 sm:gap-2 mb-3 sm:mb-4">
            <p className="text-[11px] sm:text-xs md:text-sm text-white/70 font-medium">
              <span className="text-white font-bold">{summary.totalSub}</span> submissions in the past year
            </p>
            <div className="flex gap-3 sm:gap-4 text-[10px] md:text-xs text-white/40">
              <span>Active days: <span className="text-white/60 font-medium">{summary.active}</span></span>
              <span>Max streak: <span className="text-white/60 font-medium">{summary.maxStreak}</span></span>
            </div>
          </div>

          {/* Month labels + Grid — wrapped together so they share the same intrinsic width */}
          <div style={{ minWidth: 'max-content' }}>
            {/* Month labels row — uses a flex grid mirroring the columns below */}
            <div className="flex gap-[2px] sm:gap-[3px] mb-1 h-4">
              {weeks.map((week, wi) => {
                const ml = monthLabels.find(m => m.index === wi);
                return (
                  <div key={wi} className="w-[7px] sm:w-[11px] shrink-0 relative">
                    {ml && (
                      <span className="text-[9px] md:text-[10px] text-white/30 absolute left-0 whitespace-nowrap">
                        {ml.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Grid */}
            <div className="heatmap-grid flex gap-[2px] sm:gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px] sm:gap-[3px]">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className="heatmap-cell rounded-[2px] w-[7px] h-[7px] sm:w-[11px] sm:h-[11px]"
                      style={{
                        backgroundColor: getColor(day.count),
                      }}
                      title={`${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-3 justify-end">
            <span className="text-[9px] text-white/30 mr-1">Less</span>
            {[0, 2, 5, 10, 15].map((v, i) => (
              <div
                key={i}
                className="rounded-[2px] w-[7px] h-[7px] sm:w-[11px] sm:h-[11px]"
                style={{ backgroundColor: getColor(v) }}
              />
            ))}
            <span className="text-[9px] text-white/30 ml-1">More</span>
          </div>
        </div>

        <p className="dsa-reveal mt-5 text-center text-white/25 text-xs italic">
          &ldquo;It compiles and passes all test cases on the first try&rdquo; — said no one ever.
        </p>

      </div>
    </section>
  );
}
