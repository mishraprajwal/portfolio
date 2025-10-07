import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Education from './components/Education';

// import * as Sentry from '@sentry/react';

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
  <Hero />
  <Projects />
      <Experience />
  <Education />
      <Footer />
    </main>
  )
}

export default App;
// export default Sentry.withProfiler(App);