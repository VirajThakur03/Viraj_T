import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MagneticLink = ({ children, href, className = "" }) => {
  const linkRef = useRef(null);

  useEffect(() => {
    const link = linkRef.current;
    
    const moveEvent = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = link.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.5;
      const y = (clientY - (top + height / 2)) * 0.5;
      
      gsap.to(link, { x, y, duration: 1, ease: "power4.out" });
    };

    const leaveEvent = () => {
      gsap.to(link, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    };

    link.addEventListener('mousemove', moveEvent);
    link.addEventListener('mouseleave', leaveEvent);

    return () => {
      link.removeEventListener('mousemove', moveEvent);
      link.removeEventListener('mouseleave', leaveEvent);
    };
  }, []);

  return (
    <a ref={linkRef} href={href} className={className} style={{ display: 'inline-block' }}>
      {children}
    </a>
  );
};

export default MagneticLink;
