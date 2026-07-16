import React from 'react';
import MagneticLink from '../components/MagneticLink';
import { portfolioData } from '../data/portfolio';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-compass">
        <MagneticLink href={portfolioData.contact.linkedin} className="contact-item top-left">
          LinkedIn
        </MagneticLink>
        <MagneticLink href={portfolioData.contact.github} className="contact-item top-right">
          GitHub
        </MagneticLink>
        
        <div className="contact-center">
          <MagneticLink href={`mailto:${portfolioData.contact.email}`} className="email-link">
            {portfolioData.contact.email}
          </MagneticLink>
          <p className="contact-tagline">Let's build something extraordinary.</p>
        </div>

        <MagneticLink href={portfolioData.contact.leetcode} className="contact-item bottom-left" target="_blank">
          LeetCode
        </MagneticLink>
        <MagneticLink href={portfolioData.contact.resume} className="contact-item bottom-right">
          Resume
        </MagneticLink>
      </div>
    </section>
  );
};

export default Contact;
