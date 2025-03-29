import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const experienceRef = useRef(null);
  const titleRef = useRef(null);
  const cardRefs = useRef([]);

  // Reset cardRefs on every render
  cardRefs.current = [];

  // Helper to add card elements to the cardRefs array
  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (!experienceRef.current) return;

    // Animate the section title when it comes into view
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: experienceRef.current,
          start: 'top 80%',
        },
      }
    );

    // Animate the experience cards with a slight stagger as they scroll into view
    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: experienceRef.current,
          start: 'top 80%',
        },
      }
    );

    // Add GSAP-based hover animations for each card
    cardRefs.current.forEach((card) => {
      // On mouseenter, scale up to 1.05 over 0.3 seconds
      const onEnter = () => {
        gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power3.out' });
      };
      // On mouseleave, scale back to 1 over 0.3 seconds
      const onLeave = () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: 'power3.out' });
      };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);

      // Cleanup event listeners on unmount
      card.addEventListener('cleanup', () => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    });
  }, []);

  // Updated work experience data
  const experienceData = [
    {
      company: 'Tata Consultancy Services',
      role: 'Software Engineer',
      period: 'April 2021 - April 2023',
      location: 'Mumbai, India',
      bulletPoints: [
        'Led a team of 5 software engineers, participated in code reviews, and containerized microservices with Docker.',
        'Resolved live production issues, engaged in troubleshooting and debugging backend services using Java 8 and Spring.',
        'Optimized backend systems processing 100K+ daily transactions with real-time updates and inventory management.',
        'Automated database backups with shell scripts across 400 servers, reducing downtime by 40% and saving 3 hours daily.',
        'Built PL/SQL triggers, stored procedures, and views, reducing data inconsistencies and query execution time by 35%.',
        'Collaborated with cross-disciplinary agile teams to deliver high quality software in a product-driven environment.'
      ]
    },
    {
      company: 'JBA Infosolutions Private Limited',
      role: 'Junior Full Stack Developer',
      period: 'Jan 2020 - April 2021',
      location: 'Mumbai, India',
      bulletPoints: [
        'Designed fault-tolerant RESTful APIs for real-time notifications and data services, serving over 10,000 users daily.',
        'Developed and maintained DevOps pipelines for integration of software components in diverse environments.',
        'Built monitoring queries and alerts for Data Lake to track production systems, reducing weekly incidents by 62%.',
        'Created and deployed end-to-end AWS based solutions using services such as EC2, RDS, SQS, and S3.',
        'Automated workflows using AWS Lambda and integrated real-time data synchronization, reducing latency by 40%.',
        'Provided continuous improvements and automated task scheduling with Cron Jobs, eliminating 90% of manual work.'
      ]
    },
  ];

  return (
    <section
      ref={experienceRef}
      id="experience"
      className="w-full min-h-screen bg-black text-white py-20 px-4 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative">
        <h2
          ref={titleRef}
          id="experience-title"
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          style={{
            fontFamily:
              'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
          }}
        >
          Experience
        </h2>
        <div className="space-y-8">
          {experienceData.map((exp, index) => (
            <div
              key={index}
              ref={addToRefs}
              className="experience-card bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg transition-all duration-300 ease-out"
            >
              {/* Top row: Company Name (left) | Period (right) */}
              <div className="flex justify-between items-center">
                <h3
                  className="text-2xl font-semibold"
                  style={{
                    fontFamily:
                      'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 700,
                  }}
                >
                  {exp.company}
                </h3>
                <p className="text-sm text-gray-400">{exp.period}</p>
              </div>

              {/* Second row: Role (left) | Location (right) */}
              <div className="flex justify-between items-center mt-1">
                <p
                  className="text-lg"
                  style={{
                    fontFamily:
                      'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {exp.role}
                </p>
                <p className="text-sm text-gray-400">{exp.location}</p>
              </div>

              {/* Bullet Points */}
              <ul className="mt-3 list-disc list-inside space-y-2 text-sm text-gray-200">
                {exp.bulletPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;