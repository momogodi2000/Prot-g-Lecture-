/**
 * Structured Data Generator
 * Creates JSON-LD structured data for various page types
 */

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://protegelecture.org';
const siteName = 'Protégé Lecture+';
const organizationName = 'Protégé QV ONG';

/**
 * Organization structured data
 */
export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: organizationName,
  alternateName: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: 'Organisation Non Gouvernementale dédiée à la promotion de la lecture et de l\'éducation au Cameroun',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Yaoundé',
    addressCountry: 'CM',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+237-XXX-XXX-XXX',
    contactType: 'customer service',
    availableLanguage: ['French', 'English'],
  },
  sameAs: [
    'https://facebook.com/protegeqv',
    'https://twitter.com/protegeqv',
    'https://instagram.com/protegeqv',
  ],
};

/**
 * Website structured data
 */
export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  description: 'Centre de Lecture et Bibliothèque Communautaire de Protégé QV ONG',
  publisher: organizationStructuredData,
  inLanguage: 'fr-FR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/books?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/**
 * Library structured data
 */
export const libraryStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Library',
  name: siteName,
  description: 'Centre de Lecture et Bibliothèque Communautaire',
  url: siteUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Yaoundé',
    addressCountry: 'CM',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '16:00',
    },
  ],
};

/**
 * Book structured data generator
 */
export const generateBookStructuredData = (book) => ({
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: book.titre,
  author: {
    '@type': 'Person',
    name: book.auteur_nom,
  },
  datePublished: book.annee_publication?.toString(),
  description: book.resume,
  inLanguage: book.langue,
  isbn: book.isbn,
  numberOfPages: book.nombre_pages,
  publisher: book.editeur ? {
    '@type': 'Organization',
    name: book.editeur,
  } : undefined,
  aggregateRating: book.note_moyenne ? {
    '@type': 'AggregateRating',
    ratingValue: book.note_moyenne,
    bestRating: '5',
    worstRating: '1',
  } : undefined,
  offers: {
    '@type': 'Offer',
    availability: book.statut_disponibilite === 'disponible' 
      ? 'https://schema.org/InStock' 
      : 'https://schema.org/OutOfStock',
    price: '0',
    priceCurrency: 'XAF',
  },
});

/**
 * Event structured data generator
 */
export const generateEventStructuredData = (event) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.titre,
  description: event.description,
  startDate: event.date_debut,
  endDate: event.date_fin,
  eventStatus: event.statut === 'publie' 
    ? 'https://schema.org/EventScheduled' 
    : 'https://schema.org/EventCancelled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: event.lieu || siteName,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yaoundé',
      addressCountry: 'CM',
    },
  },
  organizer: organizationStructuredData,
  offers: event.prix_inscription ? {
    '@type': 'Offer',
    price: event.prix_inscription,
    priceCurrency: 'XAF',
    availability: 'https://schema.org/InStock',
  } : undefined,
});

/**
 * Breadcrumb structured data generator
 */
export const generateBreadcrumbStructuredData = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.path}`,
  })),
});

/**
 * Article structured data generator (for news/blog)
 */
export const generateArticleStructuredData = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.titre,
  description: article.contenu?.substring(0, 200),
  image: article.image_url ? `${siteUrl}${article.image_url}` : undefined,
  datePublished: article.date_publication,
  dateModified: article.date_modification || article.date_publication,
  author: {
    '@type': 'Person',
    name: article.auteur_nom || organizationName,
  },
  publisher: organizationStructuredData,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${siteUrl}/news/${article.id}`,
  },
});

/**
 * FAQ structured data generator
 */
export const generateFAQStructuredData = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/**
 * Contact page structured data
 */
export const contactPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact',
  description: 'Contactez Protégé Lecture+ pour toute question ou demande',
  url: `${siteUrl}/contact`,
  mainEntity: organizationStructuredData,
};

export default {
  organizationStructuredData,
  websiteStructuredData,
  libraryStructuredData,
  generateBookStructuredData,
  generateEventStructuredData,
  generateBreadcrumbStructuredData,
  generateArticleStructuredData,
  generateFAQStructuredData,
  contactPageStructuredData,
};
