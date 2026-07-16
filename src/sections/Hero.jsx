import React from 'react';
import AnimatedText from '../components/AnimatedText';
import MagneticLink from '../components/MagneticLink';
import { portfolioData } from '../data/portfolio';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <AnimatedText 
          text={portfolioData.hero.name} 
          tag="h1" 
          className="hero-title"
          delay={0.5} 
        />
        <AnimatedText 
          text={portfolioData.hero.tagline} 
          tag="p" 
          className="hero-subtitle"
          delay={1.5} 
        />
      </div>

      <div className="compass-nav">
        <MagneticLink href="#works" className="nav-item top-left">Works</MagneticLink>
        <MagneticLink href="#about" className="nav-item top-right">About</MagneticLink>
        <MagneticLink href="#contact" className="nav-item bottom-center">Contact</MagneticLink>
      </div>
    </section>
  );
};

export default Hero;
