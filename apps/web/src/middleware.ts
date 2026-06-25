import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. demo.client-oq.vercel.app, demo.localhost:3000)
  let hostname = req.headers.get('host') || '';

  // Remove port if present for local development checking
  hostname = hostname.split(':')[0];

  // Define allowed core domains that should NOT be treated as subdomains
  const allowedDomains = ['localhost', 'clientoq.com', 'www.clientoq.com', 'client-oq.vercel.app', 'www.client-oq.vercel.app'];

  // Check if it's a subdomain
  if (!allowedDomains.includes(hostname)) {
    // Extract the subdomain (e.g. 'acme' from 'acme.clientoq.com')
    // We assume the subdomain is the first part before the core domain
    // Handling generic subdomains can be trickier, but for this setup we just take the full hostname
    // if it's a localhost testing like 'acme.localhost', the domain is 'acme'
    let currentHost = hostname;
    
    if (hostname.endsWith('.localhost')) {
      currentHost = hostname.replace('.localhost', '');
    } else if (hostname.endsWith('.clientoq.com')) {
      currentHost = hostname.replace('.clientoq.com', '');
    } else if (hostname.endsWith('.client-oq.vercel.app')) {
      currentHost = hostname.replace('.client-oq.vercel.app', '');
    }
    
    // Rewrite to our dynamic org route
    // e.g. acme.clientoq.com/dashboard -> client-oq.vercel.app/org/acme/dashboard
    return NextResponse.rewrite(new URL(`/org/${currentHost}${url.pathname}`, req.url));
  }

  return NextResponse.next();
}
