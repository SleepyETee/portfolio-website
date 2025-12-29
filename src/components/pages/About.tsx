import React from 'react';
import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useGitHub } from '../../hooks/useGitHub';
import { useSEO } from '../../hooks/useSEO';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled(motion.section)`
  margin-bottom: 4rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.colors.background.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Bio = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 3rem;
  max-width: 800px;
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SkillCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.light};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: transform ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-5px);
  }
`;

const SkillTitle = styled.h3`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const SkillItem = styled.div``;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const SkillName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SkillLevel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProgressBar = styled(motion.div)`
  height: 6px;
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: 3px;
  overflow: hidden;
`;

const Progress = styled(motion.div)<{ $percentage: number }>`
  height: 100%;
  background: ${({ theme }) => theme.colors.background.gradient};
  width: ${({ $percentage }) => $percentage}%;
`;

const ExperienceSection = styled(Section)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ExperienceCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.light};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ExperienceTitle = styled.h3`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const CompanyName = styled.h4`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const DateRange = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const About: React.FC = () => {
  useSEO({
    title: 'About',
    description: 'Learn about Long Nguyen - Full Stack Developer with expertise in React, TypeScript, Node.js, and modern web technologies.'
  });

  const [bioRef, bioInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [skillsRef, skillsInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [expRef, expInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const { user, loading } = useGitHub();

  // Professional information - Update these with your LinkedIn details
  const profileInfo = {
    name: "Long Nguyen",
    headline: "Full Stack Developer | React & TypeScript Specialist",
    location: user?.location || "Vietnam",
    summary: `Passionate software developer with expertise in building modern web applications. 
    Focused on creating clean, efficient, and scalable solutions using cutting-edge technologies. 
    Strong problem-solving skills and a commitment to continuous learning.`
  };

  const skills = {
    "Programming Languages": [
      { name: "JavaScript/TypeScript", level: 90 },
      { name: "Python", level: 80 },
      { name: "HTML/CSS", level: 95 },
      { name: "SQL", level: 75 }
    ],
    "Frameworks & Libraries": [
      { name: "React.js", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "Express.js", level: 80 },
      { name: "Next.js", level: 75 }
    ],
    "Tools & Platforms": [
      { name: "Git/GitHub", level: 90 },
      { name: "VS Code", level: 95 },
      { name: "Docker", level: 70 },
      { name: "AWS/Cloud", level: 65 }
    ]
  };

  const experiences = [
    {
      title: "Software Developer",
      company: "Freelance / Personal Projects",
      date: "2023 - Present",
      description: "Building full-stack web applications using React, TypeScript, and Node.js. Developing responsive and accessible user interfaces with modern design principles."
    },
    {
      title: "Web Development Student",
      company: "Self-taught & Online Courses",
      date: "2022 - 2023",
      description: "Completed comprehensive web development curriculum including frontend technologies, backend development, databases, and deployment strategies."
    }
  ];

  const education = [
    {
      degree: "Computer Science / Software Engineering",
      institution: "University",
      date: "Expected Graduation",
      description: "Studying software development, algorithms, data structures, and computer systems."
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <AboutContainer>
      <Section
        ref={bioRef}
        initial="hidden"
        animate={bioInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <SectionTitle variants={itemVariants}>About Me</SectionTitle>
        <Bio variants={itemVariants}>
          {loading ? (
            'Loading profile information...'
          ) : (
            <>
              <strong style={{ fontSize: '1.4rem', display: 'block', marginBottom: '0.5rem' }}>
                {profileInfo.name}
              </strong>
              <span style={{ display: 'block', marginBottom: '1rem', opacity: 0.9 }}>
                {profileInfo.headline}
              </span>
              <span style={{ display: 'block', marginBottom: '1rem', fontSize: '0.95rem' }}>
                📍 {profileInfo.location}
                {user?.public_repos && ` • ${user.public_repos} repositories`}
                {user?.followers && ` • ${user.followers} followers`}
              </span>
              {profileInfo.summary}
            </>
          )}
        </Bio>
      </Section>

      <Section
        ref={skillsRef}
        initial="hidden"
        animate={skillsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <SectionTitle variants={itemVariants}>Skills & Expertise</SectionTitle>
        <SkillsGrid>
          {Object.entries(skills).map(([category, items], index) => (
            <SkillCard
              key={category}
              variants={itemVariants}
              custom={index}
            >
              <SkillTitle>{category}</SkillTitle>
              <SkillList>
                {items.map((skill) => (
                  <SkillItem key={skill.name}>
                    <SkillHeader>
                      <SkillName>{skill.name}</SkillName>
                      <SkillLevel>{skill.level}%</SkillLevel>
                    </SkillHeader>
                    <ProgressBar>
                      <Progress
                        $percentage={skill.level}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.3, type: "tween" }}
                      />
                    </ProgressBar>
                  </SkillItem>
                ))}
              </SkillList>
            </SkillCard>
          ))}
        </SkillsGrid>
      </Section>

      <Section
        ref={expRef}
        initial="hidden"
        animate={expInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <SectionTitle variants={itemVariants}>Experience</SectionTitle>
        <ExperienceSection>
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.title}
              variants={itemVariants}
              custom={index}
            >
              <ExperienceTitle>{exp.title}</ExperienceTitle>
              <CompanyName>{exp.company}</CompanyName>
              <DateRange>{exp.date}</DateRange>
              <Description>{exp.description}</Description>
            </ExperienceCard>
          ))}
        </ExperienceSection>
      </Section>

      <Section
        initial="hidden"
        animate={expInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <SectionTitle variants={itemVariants}>Education</SectionTitle>
        <ExperienceSection>
          {education.map((edu, index) => (
            <ExperienceCard
              key={edu.degree}
              variants={itemVariants}
              custom={index}
            >
              <ExperienceTitle>{edu.degree}</ExperienceTitle>
              <CompanyName>{edu.institution}</CompanyName>
              <DateRange>{edu.date}</DateRange>
              <Description>{edu.description}</Description>
            </ExperienceCard>
          ))}
        </ExperienceSection>
      </Section>
    </AboutContainer>
  );
};

export default About;