import { useEffect } from 'react';

/**
 * Custom hook to trigger scroll-reveal animations on elements with class '.reveal-on-scroll'
 * Uses the native IntersectionObserver API for high performance.
 */
export const useScrollReveal = (selector = '.reveal-on-scroll', options = {}) => {
  useEffect(() => {
    const defaultOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12,
      ...options
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (!options.repeat) {
            obs.unobserve(entry.target);
          }
        } else if (options.repeat) {
          entry.target.classList.remove('is-visible');
        }
      });
    }, defaultOptions);

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [selector, options]);
};
