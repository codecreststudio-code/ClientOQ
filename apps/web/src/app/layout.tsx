import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clientoq - High-Performance Agency Workspace",
  description: "The ultimate command center for modern freelancers, developers, and creative studios in India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
