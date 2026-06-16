import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const expenses = await prisma.expense.findMany({
    where: { organizationId: orgId },
    orderBy: { expenseDate: 'desc' },
  });
  return ok(expenses);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const body = await req.json();
  const expense = await prisma.expense.create({
    data: {
      organizationId: orgId,
      category: body.category,
      description: body.description,
      amount: parseFloat(body.amount),
      receiptUrl: body.receiptUrl,
      expenseDate: new Date(body.expenseDate || Date.now()),
    },
  });
  return ok(expense, 201);
}
