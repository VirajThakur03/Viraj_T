import { useEffect, useState } from 'react';

export const useVoiceCommand = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleCommand = () => setIsActive(true);
    window.addEventListener('cmd-voice', handleCommand);
    return () => window.removeEventListener('cmd-voice', handleCommand);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      setIsActive(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Voice protocol active. Waiting for commands."));
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Voice recognized:', transcript);
      
      if (transcript.includes('contact')) {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      } else if (transcript.includes('about')) {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      } else if (transcript.includes('works') || transcript.includes('projects')) {
        document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
      } else if (transcript.includes('stop') || transcript.includes('exit') || transcript.includes('deactivate')) {
         setIsActive(false);
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
      if ('speechSynthesis' in window) {
         window.speechSynthesis.cancel();
         window.speechSynthesis.speak(new SpeechSynthesisUtterance("Voice protocol deactivated."));
      }
    };
  }, [isActive]);

  return { isActive };
};
