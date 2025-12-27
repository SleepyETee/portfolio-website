import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../styles/ThemeContext';

declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

const VantaBirds: React.FC = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const { theme } = useTheme();
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    if (theme.mode !== 'light') {
      setIsLoading(false);
      return;
    }

    if (!vantaRef.current) {
      setIsLoading(false);
      return;
    }

    const loadScriptsAndInit = async () => {
      try {
        // Load THREE.js first
        if (!window.THREE) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        }

        // Then load Vanta Birds
        if (!window.VANTA?.BIRDS) {
          await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js');
        }

        // Initialize the effect
        initVantaBirds();
      } catch (err) {
        // Silently fail - birds animation is optional enhancement
        setIsLoading(false);
      }
    };

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script is already loaded
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initVantaBirds = async () => {
      if (vantaRef.current && window.VANTA?.BIRDS && window.THREE) {
        try {
          // Small delay to ensure DOM is ready
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (!vantaRef.current) {
            setIsLoading(false);
            return;
          }

          vantaEffect.current = window.VANTA.BIRDS({
            el: vantaRef.current,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0xE6E6FA,
            backgroundAlpha: 0.0,
            color1: 0x9DB4C0,
            color2: 0xF6C3CB,
            colorMode: "lerp",
            birdSize: 1.2,
            wingSpan: 25,
            speedLimit: 3,
            separation: 30,
            alignment: 30,
            cohesion: 30,
            quantity: 3
          });
          setIsLoading(false);
        } catch (error) {
          // Silently fail - birds animation is optional
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadScriptsAndInit();

    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
        vantaEffect.current = null;
      }
      setIsLoading(false);
    };
  }, [theme.mode]);

  // Only render for light theme
  if (theme.mode !== 'light') {
    return null;
  }

  return (
    <>
      <div
        ref={vantaRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
          background: 'transparent'
        }}
      />
      
    </>
  );
};

export default VantaBirds;