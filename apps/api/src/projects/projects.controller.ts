import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getProjects(@Request() req: any) {
    const orgId = req.user.orgId;
    return this.prisma.project.findMany({
      where: { organizationId: orgId },
      include: { client: true, tasks: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  @Post()
  async createProject(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const { clientId, name, description, priority, budget, startDate, endDate } = body;

    // Verify client belongs to org
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, organizationId: orgId }
    });
    if (!client) {
      throw new ForbiddenException('Invalid client ID');
    }

    return this.prisma.project.create({
      data: {
        organizationId: orgId,
        clientId,
        name,
        description,
        priority: priority || 'Medium',
        budget: parseFloat(budget) || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: 'Planning',
        progress: 0
      }
    });
  }

  @Get(':id')
  async getProjectDetail(@Request() req: any, @Param('id') id: string) {
    const orgId = req.user.orgId;
    const project = await this.prisma.project.findFirst({
      where: { id, organizationId: orgId },
      include: {
        client: true,
        milestones: true,
        tasks: {
          include: { assignee: true, comments: { include: { user: true } }, checklists: true }
        }
      }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  @Post(':id/milestones')
  async addMilestone(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const orgId = req.user.orgId;
    const { title, dueDate } = body;

    const project = await this.prisma.project.findFirst({
      where: { id, organizationId: orgId }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.milestone.create({
      data: {
        projectId: id,
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'Pending'
      }
    });
  }

  @Put('milestones/:milestoneId')
  async updateMilestone(@Request() req: any, @Param('milestoneId') milestoneId: string, @Body() body: any) {
    const orgId = req.user.orgId;
    const { status } = body;

    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true }
    });

    if (!milestone || milestone.project.organizationId !== orgId) {
      throw new ForbiddenException('Unauthorized or milestone not found');
    }

    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: { status }
    });
  }

  @Post(':id/tasks')
  async createTask(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const orgId = req.user.orgId;
    const { title, description, priority, assigneeId, dueDate, estimatedHours } = body;

    const project = await this.prisma.project.findFirst({
      where: { id, organizationId: orgId }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.task.create({
      data: {
        projectId: id,
        title,
        description,
        priority: priority || 'Medium',
        status: 'To Do',
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: parseInt(estimatedHours) || 0,
        actualHours: 0
      }
    });
  }

  @Put('tasks/:taskId')
  async updateTask(@Request() req: any, @Param('taskId') taskId: string, @Body() body: any) {
    const orgId = req.user.orgId;
    const { status, assigneeId, priority, estimatedHours, actualHours, description, title } = body;

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task || task.project.organizationId !== orgId) {
      throw new ForbiddenException('Unauthorized or task not found');
    }

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (assigneeId !== undefined) data.assigneeId = assigneeId || null;
    if (priority !== undefined) data.priority = priority;
    if (estimatedHours !== undefined) data.estimatedHours = parseInt(estimatedHours) || 0;
    if (actualHours !== undefined) data.actualHours = parseInt(actualHours) || 0;
    if (description !== undefined) data.description = description;
    if (title !== undefined) data.title = title;

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data
    });

    // Update project progress dynamically
    const allTasks = await this.prisma.task.findMany({
      where: { projectId: task.projectId }
    });
    const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
    const progress = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

    await this.prisma.project.update({
      where: { id: task.projectId },
      data: { progress }
    });

    return updatedTask;
  }

  @Post('tasks/:taskId/comments')
  async addComment(@Request() req: any, @Param('taskId') taskId: string, @Body() body: any) {
    const orgId = req.user.orgId;
    const { comment } = body;

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task || task.project.organizationId !== orgId) {
      throw new ForbiddenException('Unauthorized or task not found');
    }

    return this.prisma.taskComment.create({
      data: {
        taskId,
        userId: req.user.id,
        comment
      },
      include: { user: true }
    });
  }

  @Post('tasks/:taskId/checklists')
  async addChecklistItem(@Request() req: any, @Param('taskId') taskId: string, @Body() body: any) {
    const orgId = req.user.orgId;
    const { title } = body;

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task || task.project.organizationId !== orgId) {
      throw new ForbiddenException('Unauthorized or task not found');
    }

    return this.prisma.taskChecklist.create({
      data: {
        taskId,
        title,
        completed: false
      }
    });
  }

  @Put('tasks/checklists/:checklistId')
  async toggleChecklistItem(@Request() req: any, @Param('checklistId') checklistId: string, @Body() body: any) {
    const orgId = req.user.orgId;
    const { completed } = body;

    const checklist = await this.prisma.taskChecklist.findUnique({
      where: { id: checklistId },
      include: { task: { include: { project: true } } }
    });

    if (!checklist || checklist.task.project.organizationId !== orgId) {
      throw new ForbiddenException('Unauthorized or checklist item not found');
    }

    return this.prisma.taskChecklist.update({
      where: { id: checklistId },
      data: { completed }
    });
  }
}
