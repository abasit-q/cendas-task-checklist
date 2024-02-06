import { Module } from '@nestjs/common';
import { TaskCheckItemService } from './task-check-item.service';
import { TaskCheckItemController } from './task-check-item.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskService } from 'src/task/task.service';

@Module({
  controllers: [TaskCheckItemController],
  providers: [TaskCheckItemService, PrismaService, TaskService],
})
export class TaskCheckItemModule {}
