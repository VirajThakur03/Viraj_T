import { useEffect, useState } from 'react';

const CHARS = '!<>-_\\\\/[]{}—=+*^?#_';

export const useHackerText = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleCommand = () => setIsActive(true);
    window.addEventListener('cmd-hack', handleCommand);
    return () => window.removeEventListener('cmd-hack', handleCommand);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Matrix encryption initialized. Hover to decrypt data."));
    }

    const textElements = document.querySelectorAll('h1, h2, h3, p, a, span:not(.term-prompt)');
    const originalTexts = new Map();

    // Encrypt everything initially
    textElements.forEach(el => {
      if (!el.innerText || el.closest('.dev-terminal')) return;
      originalTexts.set(el, el.innerText);
      el.dataset.encrypted = "true";
      el.innerText = el.innerText.split('').map(char => 
        char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('');
      el.style.color = '#0f0';
      el.style.fontFamily = 'monospace';
      el.style.transition = 'color 0.3s';
    });

    // Decrypt on hover
    const handleMouseEnter = (e) => {
      const el = e.target;
      if (el.dataset.encrypted !== "true") return;
      
      const original = originalTexts.get(el);
      if (!original) return;

      let iteration = 0;
      el.dataset.encrypted = "false";
      
      const interval = setInterval(() => {
        el.innerText = original.split('').map((char, index) => {
          if (index < iteration) return original[index];
          return char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        
        if (iteration >= original.length) {
          clearInterval(interval);
          el.style.color = ''; // Restore original color
        }
        iteration += 1 / 3;
      }, 30);
    };

    textElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
    });

    return () => {
      textElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        const orig = originalTexts.get(el);
        if (orig) {
          el.innerText = orig;
          el.style.color = '';
        }
      });
    };
  }, [isActive]);

  return { isActive };
};
