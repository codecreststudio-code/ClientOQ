import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

function parseCSV(text: string): string[][] {
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
  
  if (row.length > 0 || currentVal !== "") {
    row.push(currentVal);
    result.push(row);
  }
  
  return result;
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  try {
    const data = await req.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return err('No CSV file uploaded', 400);
    }

    // MIME type check
    const acceptedTypes = ['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'];
    if (!acceptedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      return err('Only CSV files are accepted for import.', 400);
    }

    // Max 5MB
    const MAX_CSV_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_CSV_SIZE) {
      return err('CSV file too large. Maximum 5MB allowed.', 400);
    }

    const csvText = await file.text();
    const parsedRows = parseCSV(csvText);
    if (parsedRows.length <= 1) {
      return ok({ count: 0, message: 'CSV has no data rows' });
    }

    const headers = parsedRows[0].map(h => h.trim().replace(/^["']|["']$/g, ''));
    let importedCount = 0;

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

      await prisma.lead.create({
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

    return ok({
      success: true,
      importedCount,
      message: `Successfully imported ${importedCount} leads.`
    });
  } catch (error: any) {
    return err(error.message || 'CSV import failed', 500);
  }
}
