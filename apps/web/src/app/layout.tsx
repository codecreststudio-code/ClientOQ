import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeSentryErrorHandling, setSentryTags } from "@/lib/sentry";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "AgencyOS — The Complete Agency Management Platform",
    template: "%s | AgencyOS",
  },
  description: "The ultimate command center for modern agencies, freelancers, and creative studios. Manage CRM, projects, invoices, contracts, and team — all in one place.",
  keywords: ["agency management", "CRM", "project management", "invoice software", "freelancer tools", "contract management"],
  authors: [{ name: "AgencyOS" }],
  creator: "AgencyOS",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AgencyOS",
    title: "AgencyOS — The Complete Agency Management Platform",
    description: "Manage your CRM, projects, invoices, contracts, and team — all in one place.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgencyOS — The Complete Agency Management Platform",
    description: "Manage your CRM, projects, invoices, contracts, and team — all in one place.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Initialize Sentry enhancements on client-side only
if (typeof window !== 'undefined') {
  initializeSentryErrorHandling();
  setSentryTags();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0f0f23" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
