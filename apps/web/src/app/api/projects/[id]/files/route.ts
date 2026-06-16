import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';
import * as path from 'path';
import * as fs from 'fs';

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain', 'text/csv',
  'application/zip', 'application/x-zip-compressed',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Upload directory path
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const { id: projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId }
  });

  if (!project) {
    return err('Project not found', 404);
  }

  const relations = await prisma.projectFile.findMany({
    where: { projectId },
    include: { file: true }
  });

  return ok(relations.map(r => r.file));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId, sub: userId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const { id: projectId } = await params;

  try {
    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId: orgId }
    });

    if (!project) {
      return err('Project not found', 404);
    }

    const data = await req.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return err('No file uploaded', 400);
    }

    // Security check: mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return err(`File type "${file.type}" is not allowed.`, 400);
    }

    // Security check: file size
    if (file.size > MAX_FILE_SIZE) {
      return err(`File too large. Maximum allowed size is 10MB.`, 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    // Save binary on disk
    fs.writeFileSync(filePath, buffer);

    // Save database metadata
    const dbFile = await prisma.file.create({
      data: {
        organizationId: orgId,
        uploadedBy: userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storagePath: uniqueName
      }
    });

    // Create project file relation
    await prisma.projectFile.create({
      data: {
        projectId,
        fileId: dbFile.id
      }
    });

    return ok(dbFile, 201);
  } catch (error: any) {
    return err(error.message || 'File upload failed', 500);
  }
}
