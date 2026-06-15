import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/crm')
@UseGuards(AuthGuard)
export class ProposalsController {
  constructor(private prisma: PrismaService) {}

  @Get('leads/:leadId/proposals')
  async getLeadProposals(
    @Request() req: any,
    @Param('leadId') leadId: string
  ): Promise<any> {
    const orgId = req.user.orgId;

    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, organizationId: orgId }
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.proposal.findMany({
      where: { leadId },
      include: { contract: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post('proposals')
  async createProposal(
    @Request() req: any,
    @Body() body: any
  ): Promise<any> {
    const orgId = req.user.orgId;
    const { leadId, title, content, amount } = body;

    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, organizationId: orgId }
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const proposal = await this.prisma.proposal.create({
      data: {
        leadId,
        title,
        content,
        amount: parseFloat(amount) || 0,
        status: 'Draft'
      }
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId,
        activityType: 'Proposal Sent',
        note: `Proposal "${title}" created (Amount: ₹${parseFloat(amount) || 0}).`,
        createdBy: req.user.id
      }
    });

    return proposal;
  }

  @Post('proposals/:id/contract')
  async createContract(
    @Request() req: any,
    @Param('id') proposalId: string,
    @Body() body: any
  ): Promise<any> {
    const orgId = req.user.orgId;
    const { clientId } = body;

    const proposal = await this.prisma.proposal.findFirst({
      where: {
        id: proposalId,
        lead: { organizationId: orgId }
      },
      include: { lead: true }
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    const client = await this.prisma.client.findFirst({
      where: { id: clientId, organizationId: orgId }
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'Accepted' }
    });

    const contract = await this.prisma.contract.create({
      data: {
        clientId,
        proposalId,
        title: `Contract for: ${proposal.title}`,
        signed: false
      }
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: req.user.id,
        action: 'CREATE_CONTRACT',
        entityType: 'Contract',
        entityId: contract.id,
        newValue: `Created contract for proposal ${proposal.title}`
      }
    });

    return contract;
  }

  @Get('clients/:clientId/contracts')
  async getClientContracts(
    @Request() req: any,
    @Param('clientId') clientId: string
  ): Promise<any> {
    const orgId = req.user.orgId;

    const client = await this.prisma.client.findFirst({
      where: { id: clientId, organizationId: orgId }
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return this.prisma.contract.findMany({
      where: { clientId },
      orderBy: { signed: 'asc' }
    });
  }

  @Put('contracts/:id/sign')
  async signContract(
    @Request() req: any,
    @Param('id') contractId: string,
    @Body() body: any
  ): Promise<any> {
    const orgId = req.user.orgId;
    const { signatureData } = body;

    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: { proposal: { include: { lead: true } } }
    });

    if (!contract || contract.proposal.lead.organizationId !== orgId) {
      throw new NotFoundException('Contract not found');
    }

    const updated = await this.prisma.contract.update({
      where: { id: contractId },
      data: {
        signed: true,
        signedAt: new Date(),
        fileUrl: signatureData || 'Signed via consent checkbox'
      }
    });

    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: req.user.id,
        action: 'SIGN_CONTRACT',
        entityType: 'Contract',
        entityId: contractId,
        newValue: `Signed contract. Signature confirmation: ${signatureData ? 'Drawn signature input' : 'Checkbox accept'}`
      }
    });

    await this.prisma.notification.create({
      data: {
        userId: req.user.id,
        title: 'Contract Signed',
        message: `Contract "${contract.title}" has been signed by the client.`,
        type: 'Project'
      }
    });

    return updated;
  }
}
