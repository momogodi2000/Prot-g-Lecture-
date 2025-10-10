import { analytics } from '../services/firebase';
import { logEvent, setUserProperties, setUserId } from 'firebase/analytics';

/**
 * Analytics Utility Functions
 * Wrapper for Firebase Analytics with type safety and easy tracking
 */

const isAnalyticsEnabled = () => {
  return analytics && import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
};

/**
 * Track page view
 * @param {string} pagePath - Page path
 * @param {string} pageTitle - Page title
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (!isAnalyticsEnabled()) return;

  try {
    logEvent(analytics, 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href,
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

/**
 * Track custom event
 * @param {string} eventName - Event name
 * @param {object} eventParams - Event parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (!isAnalyticsEnabled()) return;

  try {
    logEvent(analytics, eventName, {
      timestamp: new Date().toISOString(),
      ...eventParams,
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

/**
 * Track user authentication
 * @param {string} method - Auth method (email, google, etc.)
 */
export const trackLogin = (method) => {
  trackEvent('login', { method });
};

/**
 * Track user signup
 * @param {string} method - Signup method
 */
export const trackSignup = (method) => {
  trackEvent('sign_up', { method });
};

/**
 * Track book search
 * @param {string} searchTerm - Search query
 * @param {number} resultsCount - Number of results
 */
export const trackSearch = (searchTerm, resultsCount = 0) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Track book view
 * @param {object} book - Book details
 */
export const trackBookView = (book) => {
  trackEvent('view_item', {
    item_id: book.id,
    item_name: book.titre,
    item_category: book.categorie_nom,
    item_author: book.auteur_nom,
  });
};

/**
 * Track reservation
 * @param {object} reservation - Reservation details
 */
export const trackReservation = (reservation) => {
  trackEvent('make_reservation', {
    reservation_id: reservation.id,
    date: reservation.date_souhaitee,
    slot: reservation.creneau,
  });
};

/**
 * Track event registration
 * @param {object} event - Event details
 */
export const trackEventRegistration = (event) => {
  trackEvent('event_registration', {
    event_id: event.id,
    event_name: event.titre,
    event_date: event.date_debut,
  });
};

/**
 * Track group join
 * @param {object} group - Group details
 */
export const trackGroupJoin = (group) => {
  trackEvent('join_group', {
    group_id: group.id,
    group_name: group.nom,
  });
};

/**
 * Track newsletter subscription
 * @param {string} email - User email
 */
export const trackNewsletterSubscription = (email) => {
  trackEvent('newsletter_signup', {
    email_hash: hashEmail(email), // Hash for privacy
  });
};

/**
 * Track contact form submission
 * @param {string} subject - Contact subject
 */
export const trackContactSubmission = (subject) => {
  trackEvent('contact_submit', {
    subject,
  });
};

/**
 * Track file download
 * @param {string} fileName - Downloaded file name
 * @param {string} fileType - File type
 */
export const trackDownload = (fileName, fileType) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
  });
};

/**
 * Track share action
 * @param {string} method - Share method (facebook, twitter, etc.)
 * @param {string} contentType - Type of content shared
 * @param {string} itemId - Item ID
 */
export const trackShare = (method, contentType, itemId) => {
  trackEvent('share', {
    method,
    content_type: contentType,
    item_id: itemId,
  });
};

/**
 * Track error
 * @param {string} description - Error description
 * @param {boolean} fatal - Whether error is fatal
 */
export const trackError = (description, fatal = false) => {
  trackEvent('exception', {
    description,
    fatal,
  });
};

/**
 * Track timing/performance
 * @param {string} name - Metric name
 * @param {number} value - Time in milliseconds
 * @param {string} category - Metric category
 */
export const trackTiming = (name, value, category = 'performance') => {
  trackEvent('timing_complete', {
    name,
    value,
    event_category: category,
  });
};

/**
 * Set user ID
 * @param {string} userId - User ID
 */
export const setAnalyticsUserId = (userId) => {
  if (!isAnalyticsEnabled()) return;

  try {
    setUserId(analytics, userId);
  } catch (error) {
    console.error('Analytics setUserId error:', error);
  }
};

/**
 * Set user properties
 * @param {object} properties - User properties
 */
export const setAnalyticsUserProperties = (properties) => {
  if (!isAnalyticsEnabled()) return;

  try {
    setUserProperties(analytics, properties);
  } catch (error) {
    console.error('Analytics setUserProperties error:', error);
  }
};

/**
 * Hash email for privacy (simple hash)
 * @param {string} email - Email to hash
 * @returns {string} - Hashed email
 */
const hashEmail = (email) => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

/**
 * Track user engagement time on page
 */
export const trackEngagement = () => {
  let startTime = Date.now();
  let isActive = true;
  let totalEngagementTime = 0;

  const updateEngagementTime = () => {
    if (isActive) {
      totalEngagementTime += Date.now() - startTime;
      startTime = Date.now();
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      updateEngagementTime();
      isActive = false;
    } else {
      startTime = Date.now();
      isActive = true;
    }
  };

  const handleBeforeUnload = () => {
    updateEngagementTime();
    if (totalEngagementTime > 1000) { // Only track if more than 1 second
      trackEvent('user_engagement', {
        engagement_time_msec: totalEngagementTime,
      });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

export default {
  trackPageView,
  trackEvent,
  trackLogin,
  trackSignup,
  trackSearch,
  trackBookView,
  trackReservation,
  trackEventRegistration,
  trackGroupJoin,
  trackNewsletterSubscription,
  trackContactSubmission,
  trackDownload,
  trackShare,
  trackError,
  trackTiming,
  setAnalyticsUserId,
  setAnalyticsUserProperties,
  trackEngagement,
};
