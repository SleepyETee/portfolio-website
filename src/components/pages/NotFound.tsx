import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const ErrorCode = styled(motion.h1)`
  font-size: clamp(6rem, 20vw, 12rem);
  font-weight: 700;
  background: ${({ theme }) => theme.colors.background.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  line-height: 1;
`;

const Title = styled(motion.h2)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 1rem 0;
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 500px;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 50px;
  background: ${({ theme }) => theme.colors.background.gradient};
  color: ${({ theme }) => theme.colors.text.light};
  cursor: pointer;
`;

const SecondaryButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50px;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.light};
  }
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <NotFoundContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ErrorCode variants={itemVariants}>404</ErrorCode>
        <Title variants={itemVariants}>Page Not Found</Title>
        <Description variants={itemVariants}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </Description>
        <ButtonGroup variants={itemVariants}>
          <PrimaryButton
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Home
          </PrimaryButton>
          <SecondaryButton
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </SecondaryButton>
        </ButtonGroup>
      </motion.div>
    </NotFoundContainer>
  );
};

export default NotFound;
