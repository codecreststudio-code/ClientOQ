import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export default async function TenantPortal({
  params
}: {
  params: Promise<{ domain: string }>
}) {
  const { domain } = await params;

  // Look up the organization by its subdomain
  const org = await prisma.organization.findUnique({
    where: {
      subdomain: domain
    }
  });

  if (!org) {
    return notFound();
  }

  // Use the organization's custom brand settings or fallback to defaults
  const themeColor = org.themeColor || 'indigo';
  const orgName = org.name || 'Agency Portal';

  return (
    <div className={`min-h-screen bg-canvas text-ink font-sans flex flex-col items-center justify-center p-6`}>
      <div className="w-full max-w-md bg-canvas-soft border border-hairline rounded-lg shadow-sm p-8 text-center">
        
        {/* Brand Logo or Name */}
        <div className="mb-6 flex justify-center">
          {org.logoUrl ? (
            <img src={org.logoUrl} alt={`${orgName} Logo`} className="h-16 object-contain" />
          ) : (
            <div className={`w-16 h-16 bg-${themeColor}-500/10 text-${themeColor}-500 rounded-md flex items-center justify-center text-2xl font-bold font-mono tracking-tighter`}>
              {orgName.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">{orgName} Client Portal</h1>
        <p className="text-mute mb-8 text-sm">Sign in to access your projects, invoices, and files.</p>

        {/* Login Form Placeholder */}
        <form className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-mute mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="client@example.com" 
              className="w-full bg-canvas border border-hairline p-3 rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-mute mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-canvas border border-hairline p-3 rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button 
            type="button" 
            className={`w-full bg-${themeColor}-600 text-white font-semibold py-3 rounded-md hover:bg-${themeColor}-700 transition-colors`}
            style={{ backgroundColor: org.themeColor ? org.themeColor : undefined }}
          >
            Sign In to Portal
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-hairline text-xs text-mute font-mono">
          Powered by <span className="font-semibold text-ink">ClientOQ</span>
        </div>
      </div>
    </div>
  );
}
