import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/crm')
@UseGuards(AuthGuard)
export class CrmController {
  constructor(private prisma: PrismaService) {}

  @Get('leads')
  async getLeads(@Request() req: any): Promise<any> {
    const orgId = req.user.orgId;
    return this.prisma.lead.findMany({
      where: { organizationId: orgId },
      include: { owner: true, activities: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  @Post('leads')
  async createLead(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const { firstName, lastName, email, phone, companyName, source, estimatedValue, notes } = body;
    
    const lead = await this.prisma.lead.create({
      data: {
        organizationId: orgId,
        firstName,
        lastName,
        email,
        phone,
        companyName,
        source,
        estimatedValue: parseFloat(estimatedValue) || 0,
        notes,
        status: 'New'
      }
    });

    // Create automatic initial activity log
    await this.prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        activityType: 'Follow-Up',
        note: 'Lead created in pipeline.',
        createdBy: req.user.id
      }
    });

    return lead;
  }

  @Put('leads/:id')
  async updateLead(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const orgId = req.user.orgId;
    const { status, notes, ownerId, estimatedValue } = body;
    
    // Security check: lead belongs to org
    const leadCheck = await this.prisma.lead.findFirst({
      where: { id, organizationId: orgId }
    });
    if (!leadCheck) {
      throw new Error('Lead not found or unauthorized');
    }

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (ownerId !== undefined) data.ownerId = ownerId;
    if (estimatedValue !== undefined) data.estimatedValue = parseFloat(estimatedValue) || 0;

    const updated = await this.prisma.lead.update({
      where: { id },
      data
    });

    // Log the change as an activity
    if (status && status !== leadCheck.status) {
      await this.prisma.leadActivity.create({
        data: {
          leadId: id,
          activityType: 'Follow-Up',
          note: `Lead stage changed from ${leadCheck.status} to ${status}.`,
          createdBy: req.user.id
        }
      });
    }

    return updated;
  }

  @Post('leads/:id/activities')
  async addActivity(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const orgId = req.user.orgId;
    const { activityType, note } = body;

    const leadCheck = await this.prisma.lead.findFirst({
      where: { id, organizationId: orgId }
    });
    if (!leadCheck) {
      throw new Error('Lead not found or unauthorized');
    }

    return this.prisma.leadActivity.create({
      data: {
        leadId: id,
        activityType,
        note,
        createdBy: req.user.id
      }
    });
  }
}
