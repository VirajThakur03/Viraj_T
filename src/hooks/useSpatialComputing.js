import { useEffect, useState } from 'react';

const loadScript = (src) => new Promise((resolve) => {
  if (document.querySelector(`script[src="${src}"]`)) return resolve();
  const s = document.createElement('script');
  s.src = src;
  s.onload = resolve;
  document.head.appendChild(s);
});

export const useSpatialComputing = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleCommand = () => setIsActive(true);
    window.addEventListener('cmd-vision', handleCommand);
    return () => window.removeEventListener('cmd-vision', handleCommand);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    let cvCamera = null;
    let cvHands = null;
    let animFrame = null;
    
    const setupVision = async () => {
      await Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
      ]);

      const camWrapper = document.createElement('div');
      camWrapper.id = 'visionCamWrapper';
      camWrapper.style.cssText = "position:fixed; bottom:20px; left:20px; width:250px; height:200px; border:2px solid #0ff; border-radius:10px; z-index:999999; resize:both; overflow:hidden; box-shadow:0 0 15px rgba(0,255,255,0.3); background:#000;";

      const videoElement = document.createElement('video');
      videoElement.style.cssText = "width:100%; height:100%; object-fit:cover; transform:scaleX(-1);";
      camWrapper.appendChild(videoElement);

      const drawCanvas = document.createElement('canvas');
      drawCanvas.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; z-index:2; pointer-events:none; transform:scaleX(-1);";
      drawCanvas.width = 640; drawCanvas.height = 480;
      camWrapper.appendChild(drawCanvas);
      const dCtx = drawCanvas.getContext('2d');

      document.body.appendChild(camWrapper);

      const cursor = document.createElement('div');
      cursor.id = 'visionCursor';
      cursor.style.cssText = "position:fixed; width:20px; height:20px; background:rgba(0,255,255,0.5); border:2px solid #0ff; border-radius:50%; z-index:9999999; pointer-events:none; transform:translate(-50%, -50%); transition: width 0.1s, height 0.1s; left:-50px; top:-50px;";
      document.body.appendChild(cursor);

      let tgX = window.innerWidth / 2;
      let tgY = window.innerHeight / 2;
      let curX = window.innerWidth / 2;
      let curY = window.innerHeight / 2;

      const animCursor = () => {
        if (!window.visionActive) return;
        curX += (tgX - curX) * 0.4;
        curY += (tgY - curY) * 0.4;
        cursor.style.left = curX + 'px';
        cursor.style.top = curY + 'px';
        animFrame = requestAnimationFrame(animCursor);
      };
      
      window.visionActive = true;
      animFrame = requestAnimationFrame(animCursor);

      const indicator = document.createElement('div');
      indicator.id = 'visionIndicator';
      indicator.innerHTML = '<div style="width:10px;height:10px;background:#00ffff;border-radius:50%;animation:pulse 1s infinite;"></div> <span style="font-size:0.8rem;color:#00ffff;margin-left:8px;font-weight:bold;">VISION ACTIVE (Click to stop)</span>';
      indicator.style = 'position:fixed;top:3rem;left:1rem;z-index:9999999;display:flex;align-items:center;font-family:monospace;cursor:pointer;';
      indicator.onclick = () => {
         setIsActive(false);
      };
      document.body.appendChild(indicator);

      const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
      cvHands = hands;
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });

      let isPinching = false;
      let isFist = false;
      let fistCooldown = false;
      
      hands.onResults((results) => {
         if(!window.visionActive) return;
         dCtx.save();
         dCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
         
         if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const hand = results.multiHandLandmarks[0];
            
            if(window.drawConnectors && window.HAND_CONNECTIONS) {
               window.drawConnectors(dCtx, hand, window.HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 2});
               window.drawLandmarks(dCtx, hand, {color: '#FF0000', lineWidth: 1, radius: 2});
            }
            
            const indexTip = hand[8];
            const thumbTip = hand[4];
            
            tgX = (1 - indexTip.x) * window.innerWidth;
            tgY = indexTip.y * window.innerHeight;
            
            isFist = (hand[8].y > hand[5].y) && (hand[12].y > hand[9].y) && (hand[16].y > hand[13].y) && (hand[20].y > hand[17].y);
            
            if (isFist && !fistCooldown) {
               // In React, closing overlays could be done via custom event
               window.dispatchEvent(new CustomEvent('vision-close-modal'));
               fistCooldown = true;
               setTimeout(() => fistCooldown = false, 2000);
            }
            
            const dx = indexTip.x - thumbTip.x;
            const dy = indexTip.y - thumbTip.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 0.06 && !isPinching && !isFist) {
                isPinching = true;
                cursor.style.width = '10px'; cursor.style.height = '10px'; cursor.style.background = '#f00';
                
                cursor.style.display = 'none'; 
                const el = document.elementFromPoint(curX, curY);
                cursor.style.display = 'block';
                
                if (el) {
                    const evOpts = { view: window, bubbles: true, cancelable: true, clientX: curX, clientY: curY };
                    el.dispatchEvent(new MouseEvent('mousedown', evOpts));
                    el.dispatchEvent(new MouseEvent('mouseup', evOpts));
                    el.dispatchEvent(new MouseEvent('click', evOpts));
                    if (typeof el.click === 'function') el.click(); 
                }
                
            } else if (dist > 0.09 && isPinching) {
                isPinching = false;
                cursor.style.width = '20px'; cursor.style.height = '20px'; cursor.style.background = 'rgba(0,255,255,0.5)';
            }
            
            if (!isPinching && !isFist) {
               const yPos = indexTip.y;
               if (yPos < 0.25) {
                   const speed = (0.25 - yPos) * 500; 
                   window.scrollBy({ top: -speed, behavior: 'auto' });
               } else if (yPos > 0.75) {
                   const speed = (yPos - 0.75) * 500; 
                   window.scrollBy({ top: speed, behavior: 'auto' });
               }
            }
         } else {
            tgX = -100;
         }
         dCtx.restore();
      });

      cvCamera = new window.Camera(videoElement, {
        onFrame: async () => { if(window.visionActive) await hands.send({image: videoElement}); },
        width: 640, height: 480
      });
      cvCamera.start();

      if('speechSynthesis' in window) {
         window.speechSynthesis.cancel();
         window.speechSynthesis.speak(new SpeechSynthesisUtterance("Spatial computing interface active."));
      }
    };

    setupVision();

    return () => {
      window.visionActive = false;
      if (cvCamera) { cvCamera.stop(); }
      if (cvHands) { cvHands.close(); }
      const video = document.querySelector('#visionCamWrapper video');
      if(video && video.srcObject) { video.srcObject.getTracks().forEach(t => t.stop()); }
      document.getElementById('visionCamWrapper')?.remove();
      document.getElementById('visionCursor')?.remove();
      document.getElementById('visionIndicator')?.remove();
      if(animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isActive]);

  return { isActive };
};
