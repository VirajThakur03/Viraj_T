import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedText = ({ text, className = "", tag: Tag = "div", delay = 0 }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const chars = textRef.current.querySelectorAll('.char');
    
    gsap.fromTo(chars, 
      { 
        y: 100, 
        opacity: 0,
        rotateX: -90
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        stagger: 0.05,
        delay: delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 85%",
        }
      }
    );
  }, [text, delay]);

  // Split text into characters for letter-by-letter animation
  const chars = text.split('').map((char, index) => {
    if (char === ' ') {
      return <span key={index} className="char" style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>;
    }
    return (
      <span key={index} className="char" style={{ display: 'inline-block', transformOrigin: 'bottom center' }}>
        {char}
      </span>
    );
  });

  return (
    <Tag ref={textRef} className={className} style={{ perspective: "1000px" }}>
      {chars}
    </Tag>
  );
};

export default AnimatedText;
