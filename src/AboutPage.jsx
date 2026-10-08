import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';

const AboutPage = () => {
  return (
    <main className="about-page">
      <Navbar />
      <About />
      <Footer />
    </main>
  );
};

export default AboutPage;
