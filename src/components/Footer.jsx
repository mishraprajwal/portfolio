import { motion } from 'framer-motion';
import { footerLists } from '../constants';

const footerLinks = {
  Facebook: "https://www.facebook.com/mishraaprajwal", // Replace with your profile
  Instagram: "https://www.instagram.com/mishraprajwal7", // Replace with your profile
  X: "https://twitter.com/mishraaprajwal",             // Replace with your profile (formerly Twitter)
  Home: "/"                                         // Home navigates to the home page
};

const Footer = () => {
  return (
    <footer className="relative bg-transparent text-white/60 pt-20 pb-10 overflow-hidden">
      {/* ambient glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-24 w-[520px] h-[260px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-8 py-12 mb-10"
        >
          <span className="text-[11px] font-bold tracking-[0.32em] uppercase text-sky-400">
            Let&rsquo;s build something
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Say hello
          </h2>
          <a
            href="mailto:prajwalm882@gmail.com"
            className="mt-2 text-sm sm:text-base text-white/50 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
          >
            prajwalm882@gmail.com
          </a>
        </motion.div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/35">&copy; {new Date().getFullYear()} Prajwal Mishra. All rights reserved.</p>
          <div className="flex gap-2">
            {footerLists.map((item) => (
              <motion.a
                key={item}
                href={footerLinks[item]}
                target={item === "Home" ? "_self" : "_blank"}
                rel={item === "Home" ? undefined : "noopener noreferrer"}
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:border-white/25 hover:text-white transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;