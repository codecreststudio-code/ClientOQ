import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://client-oq.vercel.app';
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/features`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/join-waitlist`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms-of-service`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/security`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];
}
