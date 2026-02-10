
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Stats from './components/Stats';
import Assistant from './components/Assistant';
import Charity from './components/Charity';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Section } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.HERO);

  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.values(Section);
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveSection(section as Section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (section: Section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Header activeSection={activeSection} onNavClick={scrollToSection} />
      
      <main className="flex-grow">
        <Hero onCtaClick={() => scrollToSection(Section.GALLERY)} />
        <Gallery />
        <About />
        <Stats />
        <Assistant />
        <Charity />
        <Contact />
      </main>

      <Footer onNavClick={scrollToSection} />

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-900/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
