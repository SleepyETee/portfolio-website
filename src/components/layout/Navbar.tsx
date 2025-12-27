import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../styles/ThemeContext';

const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px; /* Increased height to include hover area */
  z-index: 999;

  /* Only apply the hover behavior on larger screens */
  @media (min-width: 1024px) {
    &:hover nav {
      transform: translateY(0);
    }
  }
`;

const Nav = styled(motion.nav)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: transparent;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 0 2rem;
  display: flex;
  justify-content: flex-start; /* use a right actions group instead of space-between */
  gap: 1.5rem;
  align-items: center;
  backdrop-filter: blur(10px);
  transform: translateY(-80px);
  transition: transform 0.3s ease;
  /* background color will be controlled inline depending on width/scroll/open */
  z-index: 2000; /* sit above Backdrop so links are clickable */

  /* Don't hide navbar on mobile */
  @media (max-width: 1023px) {
    transform: translateY(0);
    padding: 0 1rem; /* tighter padding on mobile/tablet */
  }
  @media (max-width: 480px) {
    padding: 0 0.75rem; /* extra tight on very small phones */
  }
`;

const RightActions = styled.div`
  margin-left: auto; /* push to far right */
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 2001;

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 1.8rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.background.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
`;

const MenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
  z-index: 2001; /* Above dropdown */

  @media (max-width: 1023px) {
    display: block;
  }
  @media (max-width: 480px) {
    font-size: 1.25rem; /* slightly smaller icon on very small screens */
  }
`;

const NavLinks = styled(motion.div)<{ $isOpen: boolean }>`
  display: flex;
  gap: 2rem;
  align-items: center;
  z-index: 2000;

  /* Mobile & tablets (<1024): horizontal dropdown under the navbar */
  @media (max-width: 1023px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 80px; /* directly below navbar */
    left: 0;
    right: 0;
    background-color: transparent; /* see through to theme background */
    padding: 0.5rem 0.75rem;
    flex-direction: row;
    justify-content: center; /* center items */
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap; /* allow wrapping for narrow widths */
    box-shadow: none;

    a {
      flex: 0 0 auto;
      padding: 0.5rem 0.5rem;
      text-align: center;
    }
  }

  @media (min-width: 1024px) {
    display: flex !important;
    opacity: 1 !important;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) !important;
    height: auto;
    background: transparent;
    padding: 0;
    gap: 2rem;

    a {
      padding: 0;
      border: none;
    }
  }

  /* <=480px (e.g., 468): compact spacing and font size */
  @media (max-width: 480px) {
    gap: 0.5rem;
    a {
      font-size: 0.95rem;
      padding: 0.45rem 0.4rem;
    }
  }
  /* 481px–768px: moderate spacing */
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 0.75rem;
    a {
      font-size: 1rem;
      padding: 0.6rem 0.5rem;
    }
  }
  /* 769px–1023px: roomier spacing */
  @media (min-width: 769px) and (max-width: 1023px) {
    gap: 1.25rem;
    a {
      font-size: 1.05rem;
      padding: 0.7rem 0.6rem;
    }
  }
`;

const NavLink = styled(motion(Link))<{ $isActive?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.text.primary};
  position: relative;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);

  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${({ $isActive }) => ($isActive ? '100%' : '0')};
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width ${({ theme }) => theme.transitions.default};
  }

  &:hover:after {
    width: 100%;
  }
`;

const ThemeToggle = styled(motion.button)`
  background: ${({ theme }) => theme.colors.background.light};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
  margin-left: 2rem;
  transition: all 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin: 0;
  }
  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
    font-size: 18px;
    margin-left: 0.75rem; /* tighter spacing near burger */
  }
  @media (min-width: 481px) and (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
    margin-left: 1rem;
  }
`;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNarrow, setIsNarrow] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // body scroll lock only when wide screens (not needed for <1024)
  useEffect(() => {
    if (isOpen && !isNarrow) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen, isNarrow]);

  // Close the menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close the menu when resizing to desktop / hover-capable devices
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onResize = () => {
      setIsNarrow(window.innerWidth < 1024);
      if (window.innerWidth >= 1024 || mq.matches) setIsOpen(false);
    };
    window.addEventListener('resize', onResize);
    mq.addEventListener?.('change', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      mq.removeEventListener?.('change', onResize);
    };
  }, []);

  // Close with ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close the menu when clicking outside on narrow screens
  useEffect(() => {
    if (!(isOpen && isNarrow)) return;
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
    };
  }, [isOpen, isNarrow]);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <NavbarContainer>
      <Nav
        ref={navRef}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          backgroundColor: (isOpen || isNarrow)
            ? 'transparent'
            : scrolled
              ? (theme.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(26, 26, 26, 0.95)')
              : 'transparent',
          boxShadow: (isOpen || isNarrow) ? 'none' : (scrolled ? undefined : 'none'),
        }}
      >
        <Logo to="/">Long Nguyen</Logo>
        <NavLinks
          id="mobile-nav"
          $isOpen={isOpen}
          initial={false}
          animate={{ opacity: 1 }}
        >
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              $isActive={location.pathname === link.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>
        <RightActions>
          <MenuButton
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className={`fas fa-${isOpen ? 'times' : 'bars'}`} />
          </MenuButton>
          <ThemeToggle
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme.mode === 'light' ? '🌙' : '☀️'}
          </ThemeToggle>
        </RightActions>
      </Nav>
    </NavbarContainer>
  );
};

export default Navbar;