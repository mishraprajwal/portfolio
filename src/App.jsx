import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Footer from './components/Footer';

// import * as Sentry from '@sentry/react';

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Projects />
      <Experience />
      <Footer />
    </main>
  )
}

export default App;
// export default Sentry.withProfiler(App);