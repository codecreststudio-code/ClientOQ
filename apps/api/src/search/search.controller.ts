import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async globalSearch(@Request() req: any, @Query('q') query: string): Promise<any> {
    const orgId = req.user.orgId;
    if (!query || query.trim() === '') {
      return {
        leads: [],
        clients: [],
        projects: [],
        tasks: [],
        invoices: [],
        expenses: []
      };
    }

    const term = query.trim();

    const [leads, clients, projects, tasks, invoices, expenses] = await Promise.all([
      this.prisma.lead.findMany({
        where: {
          organizationId: orgId,
          OR: [
            { firstName: { contains: term, mode: 'insensitive' } },
            { lastName: { contains: term, mode: 'insensitive' } },
            { companyName: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } }
          ]
        },
        take: 10
      }),
      this.prisma.client.findMany({
        where: {
          organizationId: orgId,
          OR: [
            { companyName: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } }
          ]
        },
        take: 10
      }),
      this.prisma.project.findMany({
        where: {
          organizationId: orgId,
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } }
          ]
        },
        take: 10
      }),
      this.prisma.task.findMany({
        where: {
          project: { organizationId: orgId },
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } }
          ]
        },
        include: { project: true },
        take: 10
      }),
      this.prisma.invoice.findMany({
        where: {
          organizationId: orgId,
          invoiceNumber: { contains: term, mode: 'insensitive' }
        },
        include: { client: true },
        take: 10
      }),
      this.prisma.expense.findMany({
        where: {
          organizationId: orgId,
          OR: [
            { category: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } }
          ]
        },
        take: 10
      })
    ]);

    return {
      leads,
      clients,
      projects,
      tasks,
      invoices,
      expenses
    };
  }
}
