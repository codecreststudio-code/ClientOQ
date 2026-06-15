import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, UseGuards, Request, NotFoundException, Res, StreamableFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

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
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES || '10485760'); // 10MB

@Controller('api')
@UseGuards(AuthGuard)
export class FilesController {
  private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads');

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  @Post('projects/:projectId/files')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @UploadedFile() file: any
  ): Promise<any> {
    const orgId = req.user.orgId;
    const userId = req.user.id;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Security: type allowlist
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`File type "${file.mimetype}" is not allowed.`);
    }

    // Security: size limit
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(`File too large. Maximum allowed size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
    }

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId: orgId }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Save file locally
    const uniqueName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, uniqueName);
    fs.writeFileSync(filePath, file.buffer);

    // Save metadata
    const dbFile = await this.prisma.file.create({
      data: {
        organizationId: orgId,
        uploadedBy: userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        storagePath: uniqueName
      }
    });

    // Create relation
    await this.prisma.projectFile.create({
      data: {
        projectId,
        fileId: dbFile.id
      }
    });

    return dbFile;
  }

  @Get('projects/:projectId/files')
  async getProjectFiles(
    @Request() req: any,
    @Param('projectId') projectId: string
  ): Promise<any> {
    const orgId = req.user.orgId;

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId: orgId }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const relations = await this.prisma.projectFile.findMany({
      where: { projectId },
      include: { file: true }
    });

    return relations.map(r => r.file);
  }

  @Get('files/:id/download')
  async downloadFile(
    @Request() req: any,
    @Param('id') fileId: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    const orgId = req.user.orgId;

    const dbFile = await this.prisma.file.findFirst({
      where: { id: fileId, organizationId: orgId }
    });

    if (!dbFile) {
      throw new NotFoundException('File not found');
    }

    const filePath = path.join(this.uploadDir, dbFile.storagePath);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File binary not found on disk');
    }

    const fileStream = fs.createReadStream(filePath);
    res.set({
      'Content-Type': dbFile.fileType,
      'Content-Disposition': `attachment; filename="${dbFile.fileName}"`,
    });

    return new StreamableFile(fileStream);
  }
}
