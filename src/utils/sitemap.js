/**
 * Sitemap Generator
 * Generates XML sitemap for search engines
 */

export const generateSitemap = (books = [], events = [], groups = []) => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://protegelecture.org';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0', lastmod: currentDate },
    { url: '/books', changefreq: 'daily', priority: '0.9', lastmod: currentDate },
    { url: '/groups', changefreq: 'weekly', priority: '0.8', lastmod: currentDate },
    { url: '/events', changefreq: 'weekly', priority: '0.8', lastmod: currentDate },
    { url: '/about', changefreq: 'monthly', priority: '0.7', lastmod: currentDate },
    { url: '/contact', changefreq: 'monthly', priority: '0.6', lastmod: currentDate },
  ];

  const bookPages = books.map(book => ({
    url: `/books/${book.id}`,
    changefreq: 'weekly',
    priority: '0.7',
    lastmod: book.date_modification || currentDate,
  }));

  const eventPages = events.map(event => ({
    url: `/events/${event.id}`,
    changefreq: 'weekly',
    priority: '0.7',
    lastmod: event.date_modification || currentDate,
  }));

  const groupPages = groups.map(group => ({
    url: `/groups/${group.id}`,
    changefreq: 'weekly',
    priority: '0.6',
    lastmod: group.date_modification || currentDate,
  }));

  const allPages = [...staticPages, ...bookPages, ...eventPages, ...groupPages];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
};

/**
 * Download sitemap as XML file
 */
export const downloadSitemap = (books, events, groups) => {
  const xmlContent = generateSitemap(books, events, groups);
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default { generateSitemap, downloadSitemap };
