import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useGitHub } from '../../hooks/useGitHub';
import { useSEO } from '../../hooks/useSEO';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 0 2rem;
  background: transparent;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled(motion.img)`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 4px solid ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.colors.background.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  line-height: 1.2;
`;

const Subtitle = styled(motion.h2)`
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  font-weight: 400;
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  border-radius: 50px;
  background: ${({ theme }) => theme.colors.background.gradient};
  color: ${({ theme }) => theme.colors.text.light};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${({ theme }) => theme.animations.shine} 3s infinite;
  }
`;

const SecondaryButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50px;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.light};
  }
`;

const Home: React.FC = () => {
  useSEO({
    title: 'Home',
    description: 'Long Nguyen - Full Stack Developer specializing in React, TypeScript, and Node.js. View my projects and get in touch.'
  });
  
  const controls = useAnimation();
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const { user, loading } = useGitHub();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleViewProjects = () => {
    navigate('/projects');
  };

  const handleContactMe = () => {
    navigate('/contact');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <HomeContainer>
      <ContentWrapper
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <ProfileImage
          src={`${process.env.PUBLIC_URL}/a-10.jpg`}
          alt="Long Nguyen"
          variants={containerVariants}
          whileHover={{ scale: 1.05 }}
        />
        <Title variants={containerVariants}>
          {loading ? 'Welcome' : `Hi, I'm ${user?.name || 'Long Nguyen'}`}
        </Title>
        <Subtitle variants={containerVariants}>
          Full Stack Developer | React & TypeScript Specialist
        </Subtitle>
        <CTAContainer variants={containerVariants}>
          <PrimaryButton
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewProjects}
          >
            View Projects
          </PrimaryButton>
          <SecondaryButton
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContactMe}
          >
            Contact Me
          </SecondaryButton>
        </CTAContainer>
      </ContentWrapper>
    </HomeContainer>
  );
};

export default Home;