import { Controller, Get, Post, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/clients')
@UseGuards(AuthGuard)
export class ClientsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getClients(@Request() req: any) {
    const orgId = req.user.orgId;
    return this.prisma.client.findMany({
      where: { organizationId: orgId },
      include: { contacts: true },
      orderBy: { companyName: 'asc' }
    });
  }

  @Post()
  async createClient(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const { companyName, website, email, phone, address, city, state, country, gstNumber, notes, contacts } = body;

    const client = await this.prisma.client.create({
      data: {
        organizationId: orgId,
        companyName,
        website,
        email,
        phone,
        address,
        city,
        state,
        country,
        gstNumber,
        notes
      }
    });

    if (contacts && Array.isArray(contacts)) {
      for (const contact of contacts) {
        await this.prisma.clientContact.create({
          data: {
            clientId: client.id,
            name: contact.name,
            designation: contact.designation,
            email: contact.email,
            phone: contact.phone
          }
        });
      }
    }

    return this.prisma.client.findUnique({
      where: { id: client.id },
      include: { contacts: true }
    });
  }

  @Get(':id')
  async getClientDetail(@Request() req: any, @Param('id') id: string) {
    const orgId = req.user.orgId;
    const client = await this.prisma.client.findFirst({
      where: { id, organizationId: orgId },
      include: {
        contacts: true,
        projects: true,
        invoices: true,
        whatsappConversations: {
          include: { messages: { orderBy: { createdAt: 'asc' } } }
        }
      }
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }
}
