import React, { useEffect, useState } from 'react';

const ContextMenu = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleClick = () => setIsVisible(false);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: pos.y,
      left: pos.x,
      background: 'rgba(10, 10, 15, 0.95)',
      border: '1px solid #0ff',
      boxShadow: '0 0 15px rgba(0,255,255,0.3)',
      borderRadius: '8px',
      padding: '10px 0',
      zIndex: 9999999,
      backdropFilter: 'blur(10px)',
      fontFamily: 'monospace',
      minWidth: '150px'
    }}>
      <div 
        style={{ padding: '8px 20px', color: '#0ff', cursor: 'pointer', transition: '0.2s' }}
        onMouseEnter={e => e.target.style.background = 'rgba(0,255,255,0.1)'}
        onMouseLeave={e => e.target.style.background = 'transparent'}
        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '`' }))}
      >
        Open Terminal (`)
      </div>
      <div 
        style={{ padding: '8px 20px', color: '#0ff', cursor: 'pointer', transition: '0.2s' }}
        onMouseEnter={e => e.target.style.background = 'rgba(0,255,255,0.1)'}
        onMouseLeave={e => e.target.style.background = 'transparent'}
        onClick={() => window.location.reload()}
      >
        Reboot System
      </div>
    </div>
  );
};

export default ContextMenu;
