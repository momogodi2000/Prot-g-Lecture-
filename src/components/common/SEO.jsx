import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component - Manages meta tags, Open Graph, and structured data
 */
const SEO = ({
  title = 'Protégé Lecture+ | Centre de Lecture',
  description = 'Centre de Lecture et Bibliothèque Communautaire de Protégé QV ONG - La lecture, un pont vers la connaissance et la communauté',
  keywords = 'bibliothèque, lecture, livres, Yaoundé, Cameroun, éducation, culture, réservation, groupes lecture',
  image = '/og-image.jpg',
  type = 'website',
  author = 'Protégé QV ONG',
  canonicalUrl,
  structuredData,
  noIndex = false,
}) => {
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://protegelecture.org';
  const currentUrl = canonicalUrl || `${siteUrl}${location.pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  useEffect(() => {
    // Update page title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', author);
    updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph meta tags
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', imageUrl, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', 'Protégé Lecture+', 'property');
    updateMeta('og:locale', 'fr_FR', 'property');

    // Twitter Card meta tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);
    updateMeta('twitter:site', '@protegeqv');
    updateMeta('twitter:creator', '@protegeqv');

    // Additional SEO meta tags
    updateMeta('format-detection', 'telephone=no');
    updateMeta('theme-color', '#4CAF50');

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Add alternate language links
    let alternateFr = document.querySelector('link[rel="alternate"][hreflang="fr"]');
    if (!alternateFr) {
      alternateFr = document.createElement('link');
      alternateFr.setAttribute('rel', 'alternate');
      alternateFr.setAttribute('hreflang', 'fr');
      document.head.appendChild(alternateFr);
    }
    alternateFr.setAttribute('href', currentUrl);

    let alternateXDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (!alternateXDefault) {
      alternateXDefault = document.createElement('link');
      alternateXDefault.setAttribute('rel', 'alternate');
      alternateXDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(alternateXDefault);
    }
    alternateXDefault.setAttribute('href', currentUrl);

    // Add structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Add preconnect hints for performance
    const addPreconnect = (href) => {
      if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    };

    addPreconnect('https://fonts.googleapis.com');
    addPreconnect('https://fonts.gstatic.com');
    addPreconnect('https://www.googletagmanager.com');
    addPreconnect('https://www.google-analytics.com');

  }, [title, description, keywords, image, type, author, currentUrl, imageUrl, structuredData, noIndex]);

  return null;
};

export default SEO;
