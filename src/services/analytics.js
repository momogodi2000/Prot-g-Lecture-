/**
 * Google Analytics Integration (GA4)
 * Provides tracking for pageviews, events, and user interactions
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GTM_ID = import.meta.env.VITE_GTM_ID;

/**
 * Initialize Google Analytics
 */
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not configured');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle this manually
    cookie_flags: 'SameSite=None;Secure',
  });
};

/**
 * Initialize Google Tag Manager
 */
export const initGTM = () => {
  if (!GTM_ID) {
    console.warn('Google Tag Manager ID not configured');
    return;
  }

  // GTM Script
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer', GTM_ID);
};

/**
 * Track page view
 */
export const trackPageView = (path, title) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
    });
  }
};

/**
 * Track custom event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Track book view
 */
export const trackBookView = (bookId, bookTitle) => {
  trackEvent('view_item', {
    item_id: bookId,
    item_name: bookTitle,
    item_category: 'book',
  });
};

/**
 * Track book reservation
 */
export const trackBookReservation = (bookId, bookTitle) => {
  trackEvent('book_reservation', {
    item_id: bookId,
    item_name: bookTitle,
    value: 1,
  });
};

/**
 * Track event registration
 */
export const trackEventRegistration = (eventId, eventTitle) => {
  trackEvent('event_registration', {
    event_id: eventId,
    event_name: eventTitle,
  });
};

/**
 * Track group join
 */
export const trackGroupJoin = (groupId, groupName) => {
  trackEvent('join_group', {
    group_id: groupId,
    group_name: groupName,
  });
};

/**
 * Track search
 */
export const trackSearch = (searchTerm, category = null) => {
  trackEvent('search', {
    search_term: searchTerm,
    search_category: category,
  });
};

/**
 * Track newsletter subscription
 */
export const trackNewsletterSubscription = (email) => {
  trackEvent('newsletter_signup', {
    method: 'email',
  });
};

/**
 * Track contact form submission
 */
export const trackContactFormSubmission = () => {
  trackEvent('contact_form_submit', {
    form_type: 'contact',
  });
};

/**
 * Track user login
 */
export const trackLogin = (method = 'email') => {
  trackEvent('login', {
    method: method,
  });
};

/**
 * Track user signup
 */
export const trackSignup = (method = 'email') => {
  trackEvent('sign_up', {
    method: method,
  });
};

/**
 * Track download
 */
export const trackDownload = (fileName, fileType) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
  });
};

/**
 * Track outbound link click
 */
export const trackOutboundLink = (url, linkText) => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: linkText,
    transport_type: 'beacon',
    link_url: url,
  });
};

/**
 * Track errors
 */
export const trackError = (errorMessage, errorLocation, isFatal = false) => {
  trackEvent('exception', {
    description: errorMessage,
    fatal: isFatal,
    error_location: errorLocation,
  });
};

/**
 * Track performance metrics
 */
export const trackPerformance = () => {
  if (!window.performance) return;

  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;

  trackEvent('performance_metrics', {
    page_load_time: pageLoadTime,
    connect_time: connectTime,
    render_time: renderTime,
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (userId, properties = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', {
      user_id: userId,
      ...properties,
    });
  }
};

/**
 * Track Core Web Vitals
 */
export const trackWebVitals = () => {
  if ('web-vital' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => trackEvent('web_vitals', { name: 'CLS', value: metric.value }));
      getFID((metric) => trackEvent('web_vitals', { name: 'FID', value: metric.value }));
      getFCP((metric) => trackEvent('web_vitals', { name: 'FCP', value: metric.value }));
      getLCP((metric) => trackEvent('web_vitals', { name: 'LCP', value: metric.value }));
      getTTFB((metric) => trackEvent('web_vitals', { name: 'TTFB', value: metric.value }));
    }).catch(() => {
      console.warn('Web Vitals library not available');
    });
  }
};

export default {
  initGA,
  initGTM,
  trackPageView,
  trackEvent,
  trackBookView,
  trackBookReservation,
  trackEventRegistration,
  trackGroupJoin,
  trackSearch,
  trackNewsletterSubscription,
  trackContactFormSubmission,
  trackLogin,
  trackSignup,
  trackDownload,
  trackOutboundLink,
  trackError,
  trackPerformance,
  setUserProperties,
  trackWebVitals,
};
