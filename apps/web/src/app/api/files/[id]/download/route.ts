import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, err } from '@/lib/api-middleware';
import * as path from 'path';
import * as fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const { id: fileId } = await params;

  try {
    const dbFile = await prisma.file.findFirst({
      where: { id: fileId, organizationId: orgId }
    });

    if (!dbFile) {
      return err('File not found', 404);
    }

    const filePath = path.join(uploadDir, dbFile.storagePath);
    if (!fs.existsSync(filePath)) {
      return err('File binary not found on disk', 404);
    }

    const buffer = fs.readFileSync(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': dbFile.fileType,
        'Content-Disposition': `attachment; filename="${dbFile.fileName}"`,
      }
    });
  } catch (error: any) {
    return err(error.message || 'Download failed', 500);
  }
}
