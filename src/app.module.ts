import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { TemplateChecklistModule } from './template-checklist/template-checklist.module';
import { TaskModule } from './task/task.module';
import { TaskCheckItemModule } from './task-check-item/task-check-item.module';

@Module({
  imports: [TemplateChecklistModule, TaskModule, TaskCheckItemModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
