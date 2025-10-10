import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, initGTM, trackPageView, trackWebVitals, trackPerformance } from '../services/analytics';

/**
 * Analytics Hook
 * Initializes analytics and tracks page views
 */
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize analytics on mount
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      initGA();
      initGTM();
      
      // Track web vitals after initialization
      setTimeout(() => {
        trackWebVitals();
        trackPerformance();
      }, 2000);
    }
  }, []);

  useEffect(() => {
    // Track page view on route change
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      const path = location.pathname + location.search;
      const title = document.title;
      trackPageView(path, title);
    }
  }, [location]);
};

export default useAnalytics;
