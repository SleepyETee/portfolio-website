import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

const BASE_TITLE = 'Long Nguyen | Full Stack Developer';

export const useSEO = ({ title, description }: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title ? `${title} | Long Nguyen` : BASE_TITLE;

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Cleanup - restore defaults on unmount
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title, description]);
};

export default useSEO;
