/**
 * SEO Utilities for structured data, sitemaps, and meta tag generation
 */

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://protegelecture.org';
const siteName = import.meta.env.VITE_SITE_NAME || 'Protégé Lecture+';

/**
 * Generate Organization structured data
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  legalName: 'Protégé QV ONG',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  foundingDate: '1995',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+237-699-936-028',
    contactType: 'Customer Service',
    email: import.meta.env.VITE_CONTACT_EMAIL || 'mail@protegeqv.org',
    areaServed: 'CM',
    availableLanguage: ['French', 'English']
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rond point Express, Biyem-Assi',
    addressLocality: 'Yaoundé',
    addressCountry: 'CM'
  },
  sameAs: [
    'https://facebook.com/protegeqv',
    'https://twitter.com/protegeqv',
    'https://instagram.com/protegeqv'
  ]
});

/**
 * Generate Library structured data
 */
export const getLibrarySchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Library',
  name: siteName,
  description: 'Centre de Lecture et Bibliothèque Communautaire',
  url: siteUrl,
  image: `${siteUrl}/library-image.jpg`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Yaoundé',
    addressCountry: 'CM'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '15:00'
    }
  ],
  hasMap: 'https://maps.google.com/?q=Yaoundé,Cameroon'
});

/**
 * Generate Book structured data
 */
export const getBookSchema = (book) => ({
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: book.titre,
  author: {
    '@type': 'Person',
    name: book.auteur_nom
  },
  isbn: book.isbn,
  bookFormat: 'https://schema.org/Paperback',
  inLanguage: book.langue,
  numberOfPages: book.nombre_pages,
  publisher: book.editeur,
  datePublished: book.annee_publication?.toString(),
  description: book.resume,
  image: book.image_url || `${siteUrl}/default-book.jpg`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'XAF',
    availability: book.disponible ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
  }
});

/**
 * Generate Event structured data
 */
export const getEventSchema = (event) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.titre,
  description: event.description,
  startDate: event.date_debut,
  endDate: event.date_fin || event.date_debut,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: event.type_evenement === 'en_ligne' 
    ? 'https://schema.org/OnlineEventAttendanceMode'
    : 'https://schema.org/OfflineEventAttendanceMode',
  location: event.type_evenement === 'en_ligne' 
    ? {
        '@type': 'VirtualLocation',
        url: event.lien_externe
      }
    : {
        '@type': 'Place',
        name: siteName,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Yaoundé',
          addressCountry: 'CM'
        }
      },
  image: event.image_url || `${siteUrl}/default-event.jpg`,
  organizer: {
    '@type': 'Organization',
    name: siteName,
    url: siteUrl
  }
});

/**
 * Generate BreadcrumbList structured data
 */
export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.path}`
  }))
});

/**
 * Generate WebSite structured data
 */
export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/books?search={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

/**
 * Generate sitemap data
 */
export const generateSitemap = (pages = [], books = [], events = []) => {
  const basePages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/books', priority: 0.9, changefreq: 'daily' },
    { url: '/groups', priority: 0.8, changefreq: 'weekly' },
    { url: '/events', priority: 0.8, changefreq: 'weekly' },
    { url: '/about', priority: 0.7, changefreq: 'monthly' },
    { url: '/contact', priority: 0.6, changefreq: 'monthly' },
  ];

  const allPages = [
    ...basePages,
    ...pages,
    ...books.map(book => ({
      url: `/books/${book.id}`,
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: book.date_modification || book.date_creation
    })),
    ...events.map(event => ({
      url: `/events/${event.id}`,
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: event.date_modification || event.date_creation
    }))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = () => {
  return `# robots.txt for ${siteName}

User-agent: *
Allow: /
Allow: /books
Allow: /groups
Allow: /events
Allow: /about
Allow: /contact

# Disallow admin pages
Disallow: /admin/
Disallow: /login

# Disallow search parameters
Disallow: /*?*search=

# Crawl delay
Crawl-delay: 1

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml`;
};

export default {
  getOrganizationSchema,
  getLibrarySchema,
  getBookSchema,
  getEventSchema,
  getBreadcrumbSchema,
  getWebsiteSchema,
  generateSitemap,
  generateRobotsTxt,
};
