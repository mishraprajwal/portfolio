import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import PortfolioHome from './components/home/PortfolioHome';

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const scrollToTop = () => lenis.scrollTo(0, { immediate: true, force: true });
    window.addEventListener('portfolio:scroll-top', scrollToTop);
    scrollToTop();

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('portfolio:scroll-top', scrollToTop);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <PortfolioHome />;
};

export default App;