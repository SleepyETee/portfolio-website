import React from 'react';
import styled, { keyframes } from 'styled-components';
import VantaBirds from './effects/VantaBirds';

const moveBackground = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-1000px);
  }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  right: 0;
  z-index: -1;
  background: ${({ theme }) => 
    theme.mode === 'light' 
      ? 'linear-gradient(to bottom, #E6E6FA, #F0E6EF)' // Soft lavender to light pink
      : '#000000'
  };
`;

// Dark theme background elements only
const Stars = styled.div`
  display: ${({ theme }) => theme.mode === 'light' ? 'none' : 'block'};
  background: black url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png") repeat;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
`;

const Twinkling = styled.div`
  display: ${({ theme }) => theme.mode === 'light' ? 'none' : 'block'};
  width: 10000px;
  height: 100%;
  background: transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/twinkling.png") repeat;
  background-size: 1000px 1000px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  animation: ${moveBackground} 70s linear infinite;
`;

const ThemeBackground = () => {
  return (
    <BackgroundContainer>
      {/* Dark theme elements */}
      <Stars />
      <Twinkling />
      
      {/* Light theme bird animation only */}
      <VantaBirds />
    </BackgroundContainer>
  );
};

export default ThemeBackground;