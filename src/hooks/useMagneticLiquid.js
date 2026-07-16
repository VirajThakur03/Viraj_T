import { useEffect } from 'react';

export const useMagneticLiquid = () => {
  useEffect(() => {
    // Magnetic Buttons Logic
    const initMagnetic = () => {
      const magneticElements = document.querySelectorAll('button, a, .magnetic');
      
      const onMouseMove = (e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      };
      
      const onMouseLeave = (e) => {
        const el = e.currentTarget;
        el.style.transform = 'translate(0px, 0px)';
      };

      magneticElements.forEach(el => {
        el.style.transition = 'transform 0.1s linear';
        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);
      });

      return () => {
        magneticElements.forEach(el => {
          el.removeEventListener('mousemove', onMouseMove);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      };
    };

    const cleanupMagnetic = initMagnetic();

    // Liquid Ripples Logic
    const handleGlobalClick = (e) => {
      // Don't ripple inside the terminal
      if (e.target.closest('.dev-terminal')) return;

      const ripple = document.createElement('div');
      ripple.className = 'liquid-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 1000);
    };

    window.addEventListener('click', handleGlobalClick);

    // Inject CSS for ripples
    const style = document.createElement('style');
    style.innerHTML = `
      .liquid-ripple {
        position: fixed;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: rippleAnim 1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        pointer-events: none;
        z-index: 99999;
        /* Glassmorphism distortion */
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(5px) contrast(1.2) brightness(1.2);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
      }
      
      @keyframes rippleAnim {
        0% {
          width: 0px;
          height: 0px;
          opacity: 1;
        }
        100% {
          width: 500px;
          height: 500px;
          opacity: 0;
          border-width: 0px;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (cleanupMagnetic) cleanupMagnetic();
      window.removeEventListener('click', handleGlobalClick);
      style.remove();
    };
  }, []);
};
