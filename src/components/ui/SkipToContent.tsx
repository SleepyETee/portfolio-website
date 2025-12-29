import React from 'react';
import styled from 'styled-components';

const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.light};
  padding: 8px 16px;
  z-index: 10000;
  text-decoration: none;
  font-weight: 500;
  border-radius: 0 0 4px 0;
  transition: top 0.2s ease;

  &:focus {
    top: 0;
    outline: 2px solid ${({ theme }) => theme.colors.text.light};
    outline-offset: 2px;
  }
`;

const SkipToContent: React.FC = () => {
  return (
    <SkipLink href="#main-content">
      Skip to main content
    </SkipLink>
  );
};

export default SkipToContent;
