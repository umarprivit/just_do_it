import { useEffect } from 'react';

/**
 * Custom hook to set the document title dynamically
 * @param {string} title - The title to set for the page
 * @param {string} [suffix] - Optional suffix to append (default: "DO IT!")
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.dynamic] - Whether the title should update dynamically
 */
export const usePageTitle = (title, suffix = "DO IT!", options = {}) => {
  const { dynamic = true } = options;
  
  useEffect(() => {
    const fullTitle = title ? `${title} - ${suffix}` : suffix;
    document.title = fullTitle;
    
    // Optional: Add to browser history for better navigation experience
    if (dynamic && window.history && window.history.replaceState) {
      window.history.replaceState(null, fullTitle, window.location.href);
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      if (!dynamic) {
        document.title = "DO IT! - Task Management Platform";
      }
    };
  }, [title, suffix, dynamic]);
};

/**
 * Custom hook to set favicon dynamically
 * @param {string} iconPath - Path to the icon file
 */
export const usePageIcon = (iconPath) => {
  useEffect(() => {
    if (!iconPath) return;
    
    // Remove existing favicon
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());
    
    // Add new favicon
    const link = document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = iconPath;
    document.head.appendChild(link);
    
    // Cleanup function
    return () => {
      const addedLink = document.querySelector(`link[rel='icon'][href='${iconPath}']`);
      if (addedLink) {
        addedLink.remove();
      }
    };
  }, [iconPath]);
};

/**
 * Custom hook to set page meta description
 * @param {string} description - The meta description for the page
 */
export const usePageDescription = (description) => {
  useEffect(() => {
    if (!description) return;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.content = description;
    
    // Also update Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.content = description;
    }
    
    // Also update Twitter description
    let twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.content = description;
    }
    
  }, [description]);
};
