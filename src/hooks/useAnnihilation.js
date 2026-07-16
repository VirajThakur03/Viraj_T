import { useEffect, useState } from 'react';

export const useAnnihilation = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleCommand = () => setIsActive(true);
    window.addEventListener('cmd-destroy', handleCommand);
    return () => window.removeEventListener('cmd-destroy', handleCommand);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    document.body.style.cursor = 'crosshair';
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Annihilation mode activated. Click elements to destroy them."));
    }

    const handleClick = (e) => {
      if (e.target.closest('.dev-terminal')) return;
      
      const el = e.target;
      el.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      el.style.transform = `scale(0) rotate(${Math.random() > 0.5 ? 180 : -180}deg)`;
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      
      setTimeout(() => {
        el.style.display = 'none';
      }, 400);
    };

    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('click', handleClick, true);
      document.body.style.cursor = 'auto';
    };
  }, [isActive]);

  return { isActive };
};
