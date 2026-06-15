import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/crm')
@UseGuards(AuthGuard)
export class ImportController {
  constructor(private prisma: PrismaService) {}

  private parseCSV(text: string): string[][] {
    const result: string[][] = [];
    let row: string[] = [];
    let currentVal = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"';
          i++; // Skip the next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentVal);
        currentVal = "";
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip the \n
        }
        row.push(currentVal);
        result.push(row);
        row = [];
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    
    // Add any remaining data
    if (row.length > 0 || currentVal !== "") {
      row.push(currentVal);
      result.push(row);
    }
    
    return result;
  }

  @Post('leads/import-csv')
  @UseInterceptors(FileInterceptor('file'))
  async importLeadsCsv(
    @Request() req: any,
    @UploadedFile() file: any
  ): Promise<any> {
    const orgId = req.user.orgId;

    if (!file) {
      throw new BadRequestException('No CSV file uploaded');
    }

    // Security: must be a CSV/text file
    if (!['text/csv', 'text/plain', 'application/csv'].includes(file.mimetype)) {
      throw new BadRequestException('Only CSV files are accepted for import.');
    }

    // Security: max 5MB
    const MAX_CSV_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_CSV_SIZE) {
      throw new BadRequestException('CSV file too large. Maximum 5MB allowed.');
    }

    const csvText = file.buffer.toString('utf-8');
    const parsedRows = this.parseCSV(csvText);
    if (parsedRows.length <= 1) {
      return { count: 0, message: 'CSV has no data rows' };
    }

    const headers = parsedRows[0].map(h => h.trim().replace(/^["']|["']$/g, ''));
    let importedCount = 0;

    // Security: cap rows to prevent memory exhaustion
    const MAX_ROWS = 10000;
    for (let i = 1; i < Math.min(parsedRows.length, MAX_ROWS + 1); i++) {
      const values = parsedRows[i].map(v => v.trim().replace(/^["']|["']$/g, ''));
      if (values.length === 0 || values.every(v => v === '')) continue;

      const row: Record<string, string> = {};
      headers.forEach((h, index) => {
        row[h] = values[index] || '';
      });

      const firstName = row['firstName'] || row['first_name'] || 'Lead';
      const lastName = row['lastName'] || row['last_name'] || 'Record';
      const email = row['email'];
      const phone = row['phone'];
      const companyName = row['companyName'] || row['company_name'] || 'Unknown Co';
      const estimatedValue = parseFloat(row['estimatedValue'] || row['value'] || '0') || 0;
      const notes = row['notes'] || '';

      await this.prisma.lead.create({
        data: {
          organizationId: orgId,
          firstName,
          lastName,
          email,
          phone,
          companyName,
          estimatedValue,
          notes,
          source: 'CSV Import'
        }
      });
      importedCount++;
    }

    return {
      success: true,
      importedCount,
      message: `Successfully imported ${importedCount} leads.`
    };
  }
}
