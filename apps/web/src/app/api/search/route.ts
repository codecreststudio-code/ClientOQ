import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) return ok({ results: [] });

  const [leads, clients, projects, invoices] = await Promise.all([
    prisma.lead.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { companyName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, firstName: true, lastName: true, companyName: true, status: true, estimatedValue: true },
      take: 5,
    }),
    prisma.client.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { companyName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, companyName: true, email: true, city: true },
      take: 5,
    }),
    prisma.project.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, status: true, progress: true },
      take: 5,
    }),
    prisma.invoice.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { invoiceNumber: { contains: q, mode: 'insensitive' } },
          { client: { companyName: { contains: q, mode: 'insensitive' } } },
        ],
      },
      select: { id: true, invoiceNumber: true, totalAmount: true, status: true, client: { select: { companyName: true } } },
      take: 5,
    }),
  ]);

  return ok({
    results: [
      ...leads.map(l => ({ type: 'lead', id: l.id, title: `${l.firstName} ${l.lastName}`, subtitle: l.companyName || '', meta: l.status, tab: 'crm' })),
      ...clients.map(c => ({ type: 'client', id: c.id, title: c.companyName, subtitle: c.email || c.city || '', tab: 'clients' })),
      ...projects.map(p => ({ type: 'project', id: p.id, title: p.name, subtitle: p.status, meta: `${p.progress}%`, tab: 'projects' })),
      ...invoices.map(i => ({ type: 'invoice', id: i.id, title: i.invoiceNumber, subtitle: i.client.companyName, meta: `₹${i.totalAmount.toLocaleString('en-IN')}`, tab: 'finance' })),
    ],
  });
}
