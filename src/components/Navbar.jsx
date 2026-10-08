import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { navLists } from '../constants';

const MotionLink = motion.a;
const MotionHeader = motion.header;

const navLinks = {
  Email: "mailto:prajwalm882@gmail.com",           // Replace with your email
  LinkedIn: "https://www.linkedin.com/in/prajwalkaruneshmishra/", // Replace with your LinkedIn URL
  Home: "#/",                                          // Refreshes the home page (hash-based for GH Pages)
  GitHub: "https://github.com/mishraprajwal",          // Replace with your GitHub URL
  About: "#/about"                                          // About page route (hash-based)
};

// Magnetic link: pulls itself toward the cursor when hovered, spring-eased back on leave
const MagneticLink = ({ nav, ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.4);
    y.set(relY * 0.6);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionLink
      ref={ref}
      {...props}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.94 }}
      className="relative cursor-pointer whitespace-nowrap px-2 py-2 text-xs text-[#626267] transition-colors hover:text-[#1d1d1f] sm:px-3 sm:text-sm md:px-4 md:text-[15px]"
    >
      {nav}
    </MotionLink>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <MotionHeader
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-2 pt-4 sm:px-4 sm:pt-5"
    >
      <nav
        aria-label="Main navigation"
        className={`flex items-center gap-0.5 rounded-full border px-1.5 py-1 transition-all duration-500 sm:gap-1 sm:px-2 sm:py-1.5 ${
          scrolled
            ? 'border-black/[0.09] bg-white/95 shadow-[0_8px_32px_rgba(29,29,31,0.12)] backdrop-blur-xl'
            : 'border-black/[0.07] bg-white/85 shadow-[0_8px_32px_rgba(29,29,31,0.08)] backdrop-blur-md'
        }`}
      >
        {navLists.map((nav) => (
          <MagneticLink
            key={nav}
            nav={nav}
            href={navLinks[nav]}
            onClick={(e) => {
              if (nav === 'Home' || nav === 'About') {
                e.preventDefault();
                const desired = navLinks[nav] || '#/';
                const current = window.location.hash.startsWith('#/')
                  ? window.location.hash.slice(1)
                  : '/';
                const want = desired.slice(1);
                if (current === want) {
                  if (nav === 'Home') {
                    window.dispatchEvent(new Event('portfolio:scroll-top'));
                  } else {
                    window.scrollTo(0, 0);
                  }
                } else {
                  window.location.hash = desired;
                }
              }
              // external links will follow default behavior
            }}
            target={nav === "Home" || nav === "About" ? "_self" : "_blank"}
            rel={nav === "Home" || nav === "About" ? undefined : "noopener noreferrer"}
          />
        ))}
      </nav>
    </MotionHeader>
  );
};

export default Navbar;