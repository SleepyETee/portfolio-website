import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NavigationContainer = styled.div`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  left: 20px;
  right: 20px;
  pointer-events: none;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    left: 10px;
    right: 10px;
  }
`;

const NavButton = styled(motion.button)<{ $disabled?: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => 
    theme.mode === 'light' 
      ? 'rgba(255, 255, 255, 0.9)' 
      : 'rgba(0, 0, 0, 0.7)'
  };
  backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 24px;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $disabled }) => $disabled ? 0.3 : 0.8};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    opacity: ${({ $disabled }) => $disabled ? 0.3 : 1};
    transform: scale(${({ $disabled }) => $disabled ? 1 : 1.1});
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.light};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
`;

const PageIndicator = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 100;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    bottom: 20px;
  }
`;

const Dot = styled(motion.div)<{ $active?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.text.secondary
  };
  opacity: ${({ $active }) => $active ? 1 : 0.5};
  transition: all ${({ theme }) => theme.transitions.default};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 10px;
    height: 10px;
  }
`;

const PageNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/projects', name: 'Projects' },
    { path: '/contact', name: 'Contact' }
  ];

  const currentIndex = pages.findIndex(page => page.path === location.pathname);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < pages.length - 1;

  const goToPreviousPage = () => {
    if (canGoLeft) {
      navigate(pages[currentIndex - 1].path);
    }
  };

  const goToNextPage = () => {
    if (canGoRight) {
      navigate(pages[currentIndex + 1].path);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === 'ArrowLeft' && canGoLeft) {
        goToPreviousPage();
      } else if (e.key === 'ArrowRight' && canGoRight) {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoLeft, canGoRight, currentIndex]);

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <>
      <NavigationContainer>
        <NavButton
          $disabled={!canGoLeft}
          onClick={goToPreviousPage}
          variants={buttonVariants}
          whileHover={canGoLeft ? "hover" : undefined}
          whileTap={canGoLeft ? "tap" : undefined}
          title={canGoLeft ? `Go to ${pages[currentIndex - 1]?.name}` : 'First page'}
        >
          ←
        </NavButton>

        <NavButton
          $disabled={!canGoRight}
          onClick={goToNextPage}
          variants={buttonVariants}
          whileHover={canGoRight ? "hover" : undefined}
          whileTap={canGoRight ? "tap" : undefined}
          title={canGoRight ? `Go to ${pages[currentIndex + 1]?.name}` : 'Last page'}
        >
          →
        </NavButton>
      </NavigationContainer>

      <PageIndicator>
        {pages.map((page, index) => (
          <Dot
            key={page.path}
            $active={index === currentIndex}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </PageIndicator>
    </>
  );
};

export default PageNavigation;