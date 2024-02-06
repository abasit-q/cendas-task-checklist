import { Injectable } from '@nestjs/common';
import { UpdateTaskCheckItemDto } from './dto/update-task-check-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskCheckItem, TaskCheckItemState } from '@prisma/client';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class TaskCheckItemService {
  constructor(
    private prisma: PrismaService,
    private taskService: TaskService,
  ) {}

  async update(
    id: number,
    updateTaskCheckItemDto: UpdateTaskCheckItemDto,
  ): Promise<TaskCheckItem> {
    const taskCheckItem = await this.prisma.taskCheckItem.update({
      where: { id },
      data: {
        state: TaskCheckItemState[updateTaskCheckItemDto.state],
      },
    });
    const taskStatus = await this.taskService.determineTaskStatus(
      taskCheckItem.taskId,
    );
    await this.taskService.update(taskCheckItem.taskId, taskStatus);
    return taskCheckItem;
  }
}
