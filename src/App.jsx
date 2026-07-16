import React, { useState, useEffect } from 'react';
import Preloader from './sections/Preloader';
import Hero from './sections/Hero';
import Works from './sections/Works';
import About from './sections/About';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import ParticleBackground from './webgl/ParticleBackground';

import DevTerminal from './components/DevTerminal';
import ContextMenu from './components/ContextMenu';
import { useAnnihilation } from './hooks/useAnnihilation';
import { useVoiceCommand } from './hooks/useVoiceCommand';
import { useSpatialComputing } from './hooks/useSpatialComputing';
import { useHackerText } from './hooks/useHackerText';
import { useMagneticLiquid } from './hooks/useMagneticLiquid';

function App() {
  const [loading, setLoading] = useState(true);

  // Initialize Easter Egg Engine Hooks
  useAnnihilation();
  useVoiceCommand();
  useSpatialComputing();
  useHackerText();
  useMagneticLiquid();

  useEffect(() => {
    // Disable scrolling while preloader is active
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Small delay to ensure DOM is ready for GSAP ScrollTriggers
      window.dispatchEvent(new Event('resize'));
    }
  }, [loading]);

  return (
    <div className="app-container">
      <ParticleBackground />
      <DevTerminal />
      <ContextMenu />
      
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <main style={{ visibility: loading ? 'hidden' : 'visible', opacity: loading ? 0 : 1, transition: 'opacity 1s ease' }}>
        <Hero />
        <Works />
        <About />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}

export default App;
