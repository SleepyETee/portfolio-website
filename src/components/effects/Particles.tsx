import { useTheme } from "../../styles/ThemeContext";
import DarkThemeParticles from "./DarkThemeParticles";
import styled from "styled-components";

const ParticlesWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;

  canvas {
    pointer-events: auto;
  }
`;

const Particles = () => {
  const { theme } = useTheme();

  // Only show particles for dark theme
  if (theme.mode !== 'dark') {
    return null;
  }

  return (
    <ParticlesWrapper>
      <DarkThemeParticles />
    </ParticlesWrapper>
  );
};

export default Particles;