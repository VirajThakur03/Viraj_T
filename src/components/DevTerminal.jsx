import React, { useState, useEffect, useRef } from 'react';
import './DevTerminal.css';

const DevTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    { type: 'output', text: 'V-OS Terminal v2.0 (React Engine)' },
    { type: 'output', text: 'Type "help" for a list of commands.' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  // Toggle terminal with backtick
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', text: `> ${input}` }];
    
    // Command Logic
    if (cmd === 'help') {
      newHistory.push({ type: 'output', text: 'Available commands:' });
      newHistory.push({ type: 'output', text: '- vision: Start spatial computing neural hand tracking' });
      newHistory.push({ type: 'output', text: '- destroy: Activate annihilation physics mode' });
      newHistory.push({ type: 'output', text: '- voice: Activate AI voice recognition protocol' });
      newHistory.push({ type: 'output', text: '- party: Start audio reactive visualizer via microphone' });
      newHistory.push({ type: 'output', text: '- hack: Encrypt the UI with Matrix symbols' });
      newHistory.push({ type: 'output', text: '- clear: Clear terminal' });
    } else if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (cmd === 'vision') {
      newHistory.push({ type: 'output', text: 'Initializing Spatial Computing...' });
      window.dispatchEvent(new CustomEvent('cmd-vision'));
    } else if (cmd === 'destroy') {
      newHistory.push({ type: 'output', text: 'Annihilation Mode active. Click elements to destroy.' });
      window.dispatchEvent(new CustomEvent('cmd-destroy'));
    } else if (cmd === 'voice') {
      newHistory.push({ type: 'output', text: 'Voice Protocol active. Waiting for audio...' });
      window.dispatchEvent(new CustomEvent('cmd-voice'));
    } else if (cmd === 'party') {
      newHistory.push({ type: 'output', text: 'Party Mode: Requesting microphone access...' });
      window.dispatchEvent(new CustomEvent('cmd-party'));
    } else if (cmd === 'hack') {
      newHistory.push({ type: 'output', text: 'Encryption Protocol Initiated.' });
      window.dispatchEvent(new CustomEvent('cmd-hack'));
    } else {
      newHistory.push({ type: 'output', text: `Command not found: ${cmd}` });
    }

    setHistory(newHistory);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="dev-terminal">
      <div className="term-header">
        <div className="term-title">V-OS Terminal // admin@viraj</div>
        <button className="term-close" onClick={() => setIsOpen(false)}>_&gt;</button>
      </div>
      <div className="term-body">
        {history.map((line, i) => (
          <div key={i} className={`term-line ${line.type}`}>
            {line.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="term-input-line" onSubmit={handleSubmit}>
        <span className="term-prompt">C:\&gt;</span>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus 
          spellCheck="false" 
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default DevTerminal;
