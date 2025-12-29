import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '../../styles/ThemeContext';
import { useGitHub } from '../../hooks/useGitHub';
import { useSEO } from '../../hooks/useSEO';
import Particles from '../effects/Particles';
import 'react-toastify/dist/ReactToastify.css';

const ContactContainer = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 120px 20px 40px;
  max-width: 800px;
  margin: 0 auto;
  z-index: 3;
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.background.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ContactContent = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ContactInfo = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.light};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  i {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Form = styled(motion.form)`
  background: ${({ theme }) => theme.colors.background.light};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 5px;
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.background.main};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 5px;
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.background.main};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 150px;
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled(motion.button)<{ $isLoading?: boolean }>`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.background.gradient};
  color: ${({ theme }) => theme.colors.text.light};
  font-size: 1.1rem;
  font-weight: 500;
  cursor: ${({ $isLoading }) => ($isLoading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isLoading }) => ($isLoading ? 0.7 : 1)};
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

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-left: 10px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
`;

const SocialLink = styled(motion.a)`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
  }
`;

const HoneypotField = styled.input`
  position: absolute;
  left: -9999px;
  opacity: 0;
  height: 0;
  width: 0;
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
`;

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact: React.FC = () => {
  useSEO({
    title: 'Contact',
    description: 'Get in touch with Long Nguyen. Send a message or connect via social media for web development inquiries and collaborations.'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const { theme } = useTheme();
  const { user, loading: githubLoading } = useGitHub();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const form = formRef.current;
    if (!form) return false;

    const name = (form.elements.namedItem('user_name') as HTMLInputElement)?.value.trim();
    const email = (form.elements.namedItem('user_email') as HTMLInputElement)?.value.trim();
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value.trim();

    if (!name || name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!message || message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Honeypot check - if filled, it's a bot
    if (honeypotRef.current?.value) {
      toast.success('Message sent successfully!');
      formRef.current.reset();
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_8bvujav', 
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_bywc8kp',
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YmXUJqXycYKPYUjP9'
      );
      toast.success('Message sent successfully!');
      formRef.current.reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending email:', error);
    }
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <Particles />
      <ContactContainer>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </Title>

        <ContactContent
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <ContactInfo variants={itemVariants}>
            <InfoTitle>Contact Information</InfoTitle>
            <InfoItem variants={itemVariants}>
              <i className="fas fa-map-marker-alt" />
              <span>{githubLoading ? 'Loading...' : user?.location || 'Remote'}</span>
            </InfoItem>
            <InfoItem variants={itemVariants}>
              <i className="fas fa-envelope" />
              <span>{githubLoading ? 'Loading...' : user?.email || 'Contact via GitHub'}</span>
            </InfoItem>
            {user?.blog && (
              <InfoItem variants={itemVariants}>
                <i className="fas fa-globe" />
                <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer">
                  {user.blog}
                </a>
              </InfoItem>
            )}
            <SocialLinks variants={itemVariants}>
              <SocialLink
                href={user?.html_url || 'https://github.com/sleepyetee'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Visit GitHub profile"
              >
                <i className="fab fa-github" aria-hidden="true" />
              </SocialLink>
              {user?.twitter_username && (
                <SocialLink
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Visit Twitter profile"
                >
                  <i className="fab fa-twitter" aria-hidden="true" />
                </SocialLink>
              )}
              <SocialLink
                href="https://www.linkedin.com/in/long-nguyen-386073264"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Visit LinkedIn profile"
              >
                <i className="fab fa-linkedin" aria-hidden="true" />
              </SocialLink>
            </SocialLinks>
          </ContactInfo>

          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            variants={itemVariants}
          >
            {/* Honeypot field - hidden from users, catches bots */}
            <HoneypotField
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="user_name"
                required
                disabled={isLoading}
                minLength={2}
                placeholder="Your name"
                onChange={() => setErrors(prev => ({ ...prev, name: undefined }))}
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="user_email"
                required
                disabled={isLoading}
                placeholder="your.email@example.com"
                onChange={() => setErrors(prev => ({ ...prev, email: undefined }))}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <TextArea
                id="message"
                name="message"
                required
                disabled={isLoading}
                minLength={10}
                placeholder="Your message here..."
                onChange={() => setErrors(prev => ({ ...prev, message: undefined }))}
              />
              {errors.message && <ErrorText>{errors.message}</ErrorText>}
            </FormGroup>
            <SubmitButton
              type="submit"
              disabled={isLoading}
              $isLoading={isLoading}
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  Sending<LoadingSpinner />
                </>
              ) : (
                'Send Message'
              )}
            </SubmitButton>
          </Form>
        </ContactContent>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme.mode}
        />
      </ContactContainer>
    </>
  );
};

export default Contact;