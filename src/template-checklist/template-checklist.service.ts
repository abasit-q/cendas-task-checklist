import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TemplateChecklist } from '@prisma/client';

@Injectable()
export class TemplateChecklistService {
  constructor(private prisma: PrismaService) {}
  findAll(): Promise<TemplateChecklist[]> {
    return this.prisma.templateChecklist.findMany({
      include: {
        checklistItems: true,
      },
    });
  }
}
