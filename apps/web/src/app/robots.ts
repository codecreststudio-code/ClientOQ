import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://client-oq.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
