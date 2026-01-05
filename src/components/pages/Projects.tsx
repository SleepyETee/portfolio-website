import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useGitHub, clearGitHubCache } from '../../hooks/useGitHub';
import { useSEO } from '../../hooks/useSEO';
import { GitHubRepo } from '../../services/github';

// Pre-populated project descriptions for repos missing them on GitHub
const projectDescriptions: Record<string, { description: string; longDescription: string; tags: string[] }> = {
  'Calculators': {
    description: 'A collection of calculator implementations across multiple programming languages.',
    longDescription: 'A comprehensive collection of calculator projects demonstrating proficiency in different programming languages including C++, Python, and JavaScript. Each implementation showcases language-specific features and best practices.',
    tags: ['C++', 'Python', 'JavaScript', 'Algorithms']
  },
  'Item-Books': {
    description: 'A JavaScript-based book inventory management application.',
    longDescription: 'A full-featured book inventory management system built with JavaScript. Allows users to add, edit, delete, and search for books with an intuitive user interface.',
    tags: ['JavaScript', 'Web App', 'CRUD']
  },
  'Snap-Project-TV-Shows': {
    description: 'A TV show discovery and tracking application built with JavaScript.',
    longDescription: 'An interactive web application for discovering and tracking TV shows. Features include browsing popular shows, searching by title, and managing a personal watchlist.',
    tags: ['JavaScript', 'API Integration', 'Web App']
  },
  'Tech-Wizards': {
    description: 'A collaborative C++ project showcasing advanced programming concepts.',
    longDescription: 'A team project built with C++ demonstrating object-oriented programming principles, data structures, and algorithm implementation. Features clean code architecture and comprehensive documentation.',
    tags: ['C++', 'OOP', 'Data Structures']
  },
  'SpiderCalc': {
    description: 'A hackathon project created during HackCC 2025.',
    longDescription: 'An innovative calculator application developed during HackCC 2025. Built with TypeScript and React, featuring a unique spider-themed interface and advanced calculation capabilities.',
    tags: ['TypeScript', 'React', 'Hackathon']
  },
  'portfolio-website': {
    description: 'A modern, responsive portfolio website built with React and TypeScript.',
    longDescription: 'A personal portfolio website showcasing projects and skills. Built with React and TypeScript, featuring smooth Framer Motion animations, dark/light theme switching, GitHub API integration, and fully responsive design.',
    tags: ['React', 'TypeScript', 'Styled Components', 'Framer Motion']
  },
  'BrainXP': {
    description: 'An interactive learning and brain training application.',
    longDescription: 'A TypeScript-based application designed to enhance cognitive abilities through interactive exercises and challenges. Features progress tracking and personalized learning paths.',
    tags: ['TypeScript', 'Education', 'Interactive']
  }
};

interface Project {
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  demoLink: string;
  githubLink: string;
  longDescription: string;
  stars?: number;
  forks?: number;
  language?: string | null;
  updatedAt?: string;
}

const ProjectsContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  background: ${({ theme }) => theme.colors.background.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)<{ $isActive: boolean }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.background.gradient : theme.colors.background.light};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.text.light : theme.colors.text.primary};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const RefreshButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 25px;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.light};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  i {
    font-size: 0.85rem;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const ProjectCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.light};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  cursor: pointer;
  
  &:hover {
    img {
      transform: scale(1.1);
    }
  }
`;

const ProjectImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const ProjectDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.background.main};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.light};
  border-radius: 15px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalCloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1;
`;

const ModalImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const ModalDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const Projects: React.FC = () => {
  useSEO({
    title: 'Projects',
    description: 'View my portfolio of web development projects including React applications, TypeScript projects, and full-stack solutions.'
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { repos, loading, error } = useGitHub();

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    clearGitHubCache();
    setRefreshKey(prev => prev + 1);
    // Reload the page to fetch fresh data
    window.location.reload();
  }, []);

  const mapGitHubToProject = (repo: GitHubRepo): Project => {
    const prePopulated = projectDescriptions[repo.name];
    const description = repo.description || prePopulated?.description || 'A GitHub repository project';
    const longDescription = repo.description || prePopulated?.longDescription || `A project from GitHub repository ${repo.name}.`;
    const baseTags = [repo.language].filter((tag): tag is string => tag !== null);
    const tags = prePopulated?.tags || [...baseTags, 'GitHub'];

    return {
      title: repo.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description,
      image: `https://opengraph.githubassets.com/1/${repo.full_name}`,
      category: repo.language || 'Other',
      tags,
      demoLink: repo.homepage || repo.html_url,
      githubLink: repo.html_url,
      longDescription,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at
    };
  };

  const projects: Project[] = repos.map(mapGitHubToProject);
  
  const fallbackProjects: Project[] = [
    {
      title: "Portfolio Website",
      description: projectDescriptions['portfolio-website'].description,
      image: "https://opengraph.githubassets.com/1/sleepyetee/portfolio-website",
      category: "TypeScript",
      tags: projectDescriptions['portfolio-website'].tags,
      demoLink: "https://sleepyetee.github.io/portfolio-website",
      githubLink: "https://github.com/sleepyetee/portfolio-website",
      longDescription: projectDescriptions['portfolio-website'].longDescription
    },
    {
      title: "Calculators",
      description: projectDescriptions['Calculators'].description,
      image: "https://opengraph.githubassets.com/1/sleepyetee/Calculators",
      category: "C++",
      tags: projectDescriptions['Calculators'].tags,
      demoLink: "https://sleepyetee.github.io/Calculators",
      githubLink: "https://github.com/sleepyetee/Calculators",
      longDescription: projectDescriptions['Calculators'].longDescription
    },
    {
      title: "SpiderCalc",
      description: projectDescriptions['SpiderCalc'].description,
      image: "https://opengraph.githubassets.com/1/sleepyetee/SpiderCalc",
      category: "TypeScript",
      tags: projectDescriptions['SpiderCalc'].tags,
      demoLink: "https://sleepyetee.github.io/SpiderCalc",
      githubLink: "https://github.com/sleepyetee/SpiderCalc",
      longDescription: projectDescriptions['SpiderCalc'].longDescription
    },
    {
      title: "BrainXP",
      description: projectDescriptions['BrainXP'].description,
      image: "https://opengraph.githubassets.com/1/sleepyetee/BrainXP",
      category: "TypeScript",
      tags: projectDescriptions['BrainXP'].tags,
      demoLink: "https://github.com/sleepyetee/BrainXP",
      githubLink: "https://github.com/sleepyetee/BrainXP",
      longDescription: projectDescriptions['BrainXP'].longDescription
    },
    {
      title: "Item Books",
      description: projectDescriptions['Item-Books'].description,
      image: "https://opengraph.githubassets.com/1/sleepyetee/Item-Books",
      category: "JavaScript",
      tags: projectDescriptions['Item-Books'].tags,
      demoLink: "https://github.com/sleepyetee/Item-Books",
      githubLink: "https://github.com/sleepyetee/Item-Books",
      longDescription: projectDescriptions['Item-Books'].longDescription
    },
    {
      title: "Tech Wizards",
      description: projectDescriptions['Tech-Wizards'].description,
      image: "https://opengraph.githubassets.com/1/sleepyetee/Tech-Wizards",
      category: "C++",
      tags: projectDescriptions['Tech-Wizards'].tags,
      demoLink: "https://github.com/sleepyetee/Tech-Wizards",
      githubLink: "https://github.com/sleepyetee/Tech-Wizards",
      longDescription: projectDescriptions['Tech-Wizards'].longDescription
    },
    {
      title: "Snap Project TV Shows",
      description: projectDescriptions['Snap-Project-TV-Shows'].description,
      image: "https://opengraph.githubassets.com/1/sleepyetee/Snap-Project-TV-Shows",
      category: "JavaScript",
      tags: projectDescriptions['Snap-Project-TV-Shows'].tags,
      demoLink: "https://sleepyetee.github.io/Snap-Project-TV-Shows",
      githubLink: "https://github.com/sleepyetee/Snap-Project-TV-Shows",
      longDescription: projectDescriptions['Snap-Project-TV-Shows'].longDescription
    }
  ];

  const displayProjects: Project[] = projects.length > 0 ? projects : fallbackProjects;

  const categories: string[] = ['All', ...Array.from(new Set(displayProjects.map((project: Project) => project.category)))];
  const filteredProjects: Project[] = selectedCategory === 'All'
    ? displayProjects
    : displayProjects.filter((project: Project) => project.category === selectedCategory);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        type: "tween"
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.6
      }
    }
  };

  return (
    <ProjectsContainer>
      <HeaderRow>
        <SectionTitle
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 0 }}
        >
          {loading ? 'Loading Projects...' : error ? 'Unable to load projects' : 'My Projects'}
        </SectionTitle>
        {!loading && (
          <RefreshButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Refresh projects from GitHub"
          >
            <i className={`fas fa-sync-alt ${isRefreshing ? 'fa-spin' : ''}`} aria-hidden="true" />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </RefreshButton>
        )}
      </HeaderRow>

      {!loading && !error && displayProjects.length > 0 && (
        <FilterContainer
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <FilterButton
              key={category}
              $isActive={category === selectedCategory}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </FilterButton>
          ))}
        </FilterContainer>
      )}

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '2rem' }}
        >
          Loading projects from GitHub...
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '2rem' }}
        >
          Unable to load projects from GitHub. Showing fallback projects.
        </motion.div>
      ) : (
        <ProjectsGrid
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {filteredProjects.map((project: any) => (
            <ProjectCard
              key={project.title}
              variants={itemVariants}
              onClick={() => setSelectedProject(project)}
              whileHover={{ y: -10 }}
            >
              <ProjectImageContainer>
                <ProjectImage src={project.image} alt={project.title} />
              </ProjectImageContainer>
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <TagsContainer>
                  {project.tags.map((tag: string) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagsContainer>
                {project.stars !== undefined && (
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
                    ⭐ {project.stars} stars 🔀 {project.forks} forks
                  </div>
                )}
                <ProjectLinks>
                  <ProjectLink href={project.demoLink} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-external-link-alt" /> Live Demo
                  </ProjectLink>
                  <ProjectLink href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github" /> GitHub
                  </ProjectLink>
                </ProjectLinks>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalCloseButton
                onClick={() => setSelectedProject(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-times" />
              </ModalCloseButton>
              <ModalImage src={selectedProject.image} alt={selectedProject.title} />
              <ModalBody>
                <ModalTitle>{selectedProject.title}</ModalTitle>
                <TagsContainer>
                  {selectedProject.tags.map((tag: string) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagsContainer>
                <ModalDescription>{selectedProject.longDescription}</ModalDescription>
                <ProjectLinks>
                  <ProjectLink href={selectedProject.demoLink} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-external-link-alt" /> Live Demo
                  </ProjectLink>
                  <ProjectLink href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github" /> GitHub
                  </ProjectLink>
                </ProjectLinks>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </ProjectsContainer>
  );
};

export default Projects;