import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleBackground = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    camera.position.z = 30;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Custom Shader Material for particles
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#ffffff') },
        u_audio: { value: 0.0 }
      },
      vertexShader: `
        uniform float time;
        uniform float u_audio;
        void main() {
          vec3 pos = position;
          
          // Audio reactive vertex displacement
          pos.y += sin(time * 0.5 + pos.x * 0.1) * (2.0 + u_audio * 20.0);
          pos.x += cos(time * 0.3 + pos.y * 0.1) * (2.0 + u_audio * 20.0);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          // Explode particles forward on bass drop
          gl_PointSize = (100.0 + (u_audio * 200.0)) / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float u_audio;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          if(distanceToCenter > 0.5) discard;
          
          float alpha = 1.0 - (distanceToCenter * 2.0);
          
          // Flash neon colors when audio spikes
          vec3 finalColor = color;
          if (u_audio > 0.4) {
             finalColor = mix(color, vec3(0.0, 1.0, 1.0), u_audio); // Cyan
          }
          if (u_audio > 0.7) {
             finalColor = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.0, 1.0), (u_audio - 0.7) * 3.3); // Magenta peak
          }
          
          gl_FragColor = vec4(finalColor, alpha * (0.3 + u_audio * 0.6));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.05;
      mouseY = (event.clientY - windowHalfY) * 0.05;
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Scroll interaction
    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll);

    // Audio Context Setup
    let audioCtx = null;
    let analyser = null;
    let dataArray = null;

    const initPartyMode = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        if('speechSynthesis' in window) {
           window.speechSynthesis.cancel();
           window.speechSynthesis.speak(new SpeechSynthesisUtterance("Party Mode Activated. Visualizing room audio frequencies."));
        }
      } catch (err) {
        console.error("Microphone access denied for Party Mode", err);
      }
    };

    window.addEventListener('cmd-party', initPartyMode);

    // Animation Loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;
      
      particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
      
      // Rotate based on scroll
      particlesMesh.position.y = -scrollY * 0.01;
      particlesMesh.rotation.z = scrollY * 0.0005;
      
      // Update Audio Reactivity
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const bass = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;
        const normalizedBass = bass / 255.0;
        particlesMaterial.uniforms.u_audio.value = normalizedBass;
        
        // Bonus: Make the whole scene pulse slightly on huge bass drops
        if (normalizedBass > 0.8) {
           scene.scale.set(1 + (normalizedBass * 0.1), 1 + (normalizedBass * 0.1), 1 + (normalizedBass * 0.1));
        } else {
           scene.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
      }
      
      particlesMaterial.uniforms.time.value = elapsedTime;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('cmd-party', initPartyMode);
      if (audioCtx) audioCtx.close();
      container.removeChild(renderer.domElement);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ParticleBackground;
