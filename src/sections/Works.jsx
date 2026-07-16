import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolio';
import './Works.css';

gsap.registerPlugin(ScrollTrigger);

const Works = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const panels = gsap.utils.toArray('.work-panel');
    
    gsap.to(panels, {
      yPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => "+=" + containerRef.current.offsetHeight * panels.length
      }
    });
  }, []);

  return (
    <section id="works" ref={containerRef} className="works-container">
      {portfolioData.projects.map((project, index) => (
        <div key={project.id} className="work-panel">
          <div className="work-content">
            <h2 className="work-title">{project.title}</h2>
            <p className="work-category">{project.category}</p>
            <div className="work-tags">
              {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
            <p className="work-description">{project.description}</p>
          </div>
          <div className="work-image-container">
            <img src={project.image} alt={project.title} className="work-image" />
          </div>
          <div className="work-counter">
            {String(index + 1).padStart(2, '0')} / {String(portfolioData.projects.length).padStart(2, '0')}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Works;
