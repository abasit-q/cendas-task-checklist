import { Module } from '@nestjs/common';
import { TemplateChecklistService } from './template-checklist.service';
import { TemplateChecklistController } from './template-checklist.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TemplateChecklistController],
  providers: [TemplateChecklistService, PrismaService],
})
export class TemplateChecklistModule {}
