import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const SkeletonBase = styled.div`
  background: ${({ theme }) => theme.colors.background.light};
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.background.light} 0%,
    ${({ theme }) => theme.colors.background.main} 50%,
    ${({ theme }) => theme.colors.background.light} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

export const SkeletonText = styled(SkeletonBase)<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '1rem'};
  margin-bottom: 0.5rem;
`;

export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: 300px;
  border-radius: 15px;
`;

export const SkeletonCircle = styled(SkeletonBase)<{ $size?: string }>`
  width: ${({ $size }) => $size || '50px'};
  height: ${({ $size }) => $size || '50px'};
  border-radius: 50%;
`;

export const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  height: 200px;
  border-radius: 15px 15px 0 0;
`;

export const ProjectCardSkeleton = styled.div`
  background: ${({ theme }) => theme.colors.background.light};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

export const ProjectCardSkeletonContent = styled.div`
  padding: 1.5rem;
`;

export const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const LoadingSkeleton = {
  Text: SkeletonText,
  Card: SkeletonCard,
  Circle: SkeletonCircle,
  Image: SkeletonImage,
  Container: SkeletonContainer,
  ProjectCard: ProjectCardSkeleton,
  ProjectCardContent: ProjectCardSkeletonContent
};

export default LoadingSkeleton;
