import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeContext';

const CursorContainer = styled.div`
  pointer-events: none;
  position: fixed;
  z-index: 9999;
`;

const CursorDot = styled.div`
  width: 24px;
  height: 24px;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  filter: drop-shadow(0 0 5px ${({ theme }) => theme.cursor.border});
  pointer-events: none;
  will-change: transform;
`;

const CursorCircle = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid ${({ theme }) => theme.cursor.border};
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  will-change: transform;
`;

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${clientX - 12}px, ${clientY - 12}px)`;
      }
      
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${clientX - 20}px, ${clientY - 20}px)`;
      }
    };

    const updateCursorScale = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer';
      const scale = isClickable ? 1.3 : 1;
      const { clientX, clientY } = e;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${clientX - 12}px, ${clientY - 12}px) scale(${scale})`;
      }
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${clientX - 20}px, ${clientY - 20}px) scale(${scale})`;
      }
    };

    if (!('ontouchstart' in window)) {
      document.addEventListener('mousemove', updateCursorPosition);
      document.addEventListener('mouseover', updateCursorScale);
    }

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseover', updateCursorScale);
    };
  }, []);

  if ('ontouchstart' in window) {
    return null;
  }

  return (
    <CursorContainer className="custom-cursor">
      <CursorDot ref={dotRef}>
        {theme.cursor.symbol}
      </CursorDot>
      <CursorCircle ref={circleRef} />
    </CursorContainer>
  );
};

export default CustomCursor;