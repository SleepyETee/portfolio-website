import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './styles/ThemeContext';
import CustomCursor from './components/ui/CustomCursor';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Projects from './components/pages/Projects';
import Contact from './components/pages/Contact';
import ThemeBackground from './components/effects/ThemeBackground';
import Particles from './components/effects/Particles';
import PageNavigation from './components/layout/PageNavigation';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    cursor: none !important;
  }

  a, button, [role="button"], input, select, textarea {
    cursor: none !important;
    &:focus {
      outline: none;
    }
  }

  body {
    font-family: ${({ theme }) => theme.fonts.secondary};
    background-color: ${({ theme }) => theme.colors.background.main};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.6;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.primary};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html, body {
      cursor: auto !important;
    }
    * {
      cursor: auto !important;
    }
    .custom-cursor {
      display: none !important;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
`;

// Component to handle animated routes
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      x: 60,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: -60,
    }
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.6
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <About />
            </PageWrapper>
          }
        />
        <Route
          path="/projects"
          element={
            <PageWrapper
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Projects />
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Contact />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <CustomCursor />
          <ThemeBackground />
          <Particles />
          <Navbar />
          <PageNavigation />
          <AnimatedRoutes />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;
