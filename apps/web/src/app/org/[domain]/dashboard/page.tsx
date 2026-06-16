import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ClientDashboardClient from './ClientDashboardClient';

export default async function ClientPortalDashboard({
  params
}: {
  params: Promise<{ domain: string }>
}) {
  const { domain } = await params;

  const org = await prisma.organization.findUnique({
    where: { subdomain: domain }
  });

  if (!org) return notFound();

  // In a real application, you would also verify the user's session and ensure they have the 'Client' role
  // Since we don't have NextAuth/cookies configured easily for RSC right here, we will trust the client component to fetch its own protected data.

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans flex flex-col">
      <header className="bg-canvas-soft border-b border-hairline p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {org.logoUrl ? (
            <img src={org.logoUrl} alt={org.name} className="h-8 object-contain" />
          ) : (
            <div className={`w-8 h-8 rounded bg-${org.themeColor || 'indigo'}-500/10 text-${org.themeColor || 'indigo'}-500 font-bold flex items-center justify-center`}>
              {org.name?.substring(0, 2).toUpperCase() || 'CP'}
            </div>
          )}
          <h1 className="font-semibold">{org.name} Client Portal</h1>
        </div>
        <div className="text-sm font-mono text-mute">
          Logged in as Client
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <ClientDashboardClient org={org} />
      </main>
    </div>
  );
}
