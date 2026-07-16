import React from 'react';
import { portfolioData } from '../data/portfolio';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-vertical-text">
          {portfolioData.about.verticalWords.map((word, index) => (
            <span key={index} className="vertical-word">{word}</span>
          ))}
        </div>
        
        <div className="about-content">
          <h2 className="about-heading">ABOUT</h2>
          <p className="about-bio">{portfolioData.about.bio}</p>
        </div>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {[...portfolioData.about.skills, ...portfolioData.about.skills].map((skill, index) => (
            <span key={index} className="marquee-item">
              {skill} <span className="marquee-separator">+</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
