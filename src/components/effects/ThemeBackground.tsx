import React from 'react';
import styled from 'styled-components';
import VantaBirds from './VantaBirds';

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
      ? 'linear-gradient(to bottom, #E6E6FA, #F0E6EF)'
      : 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)'
  };
`;

const ThemeBackground = () => {
  return (
    <BackgroundContainer>
      <VantaBirds />
    </BackgroundContainer>
  );
};

export default ThemeBackground;