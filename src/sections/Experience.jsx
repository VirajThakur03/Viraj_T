import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolio';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    
    gsap.to(track, {
      xPercent: -100,
      x: () => window.innerWidth,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        end: () => "+=" + track.offsetWidth
      }
    });
  }, []);

  return (
    <section id="experience" ref={containerRef} className="experience-section">
      <h2 className="experience-heading">EXPERIENCE</h2>
      <div className="experience-track-container">
        <div ref={trackRef} className="experience-track">
          {portfolioData.experience.map((item, index) => (
            <div key={item.id} className="experience-card">
              <div className="experience-number">{String(index + 1).padStart(2, '0')}</div>
              <h3 className="experience-title">{item.title}</h3>
              <h4 className="experience-company">{item.company}</h4>
              <p className="experience-date">{item.date}</p>
              <p className="experience-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
