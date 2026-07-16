import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, { opacity: 0, duration: 1, onComplete });
      }
    });

    tl.to(".preloader-text", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    })
    .to(".preloader-text", {
      opacity: 0,
      y: -20,
      duration: 0.8,
      delay: 0.5,
      ease: "power3.in"
    });
  }, [onComplete]);

  return (
    <div ref={containerRef} className="preloader-container">
      <h1 className="preloader-text" style={{ opacity: 0, transform: 'translateY(20px)' }}>
        VIRAJ THAKUR
      </h1>
    </div>
  );
};

export default Preloader;
