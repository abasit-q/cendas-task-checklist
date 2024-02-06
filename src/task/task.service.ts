import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task, TaskCheckItemState } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const templateCheckList = await this.prisma.templateChecklist.findUnique({
      where: { id: createTaskDto.checklistId },
      include: {
        checklistItems: true,
      },
    });
    return this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        checklistId: templateCheckList.id,
        taskCheckItems: {
          create: templateCheckList.checklistItems.map((checklistItem) => ({
            name: checklistItem.name,
            taskStatus: checklistItem.taskStatus,
            ordinalNumber: checklistItem.ordinalNumber,
          })),
        },
      },
      include: {
        taskCheckItems: true,
      },
    });
  }

  findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  findOne(id: number): Promise<Task> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        taskCheckItems: {
          orderBy: {
            ordinalNumber: 'asc',
          },
        },
      },
    });
  }

  update(id: number, taskStatus: string): Promise<Task> {
    return this.prisma.task.update({ where: { id }, data: { taskStatus } });
  }

  // Determine the task status based on the checked/unchecked taskCheckItem
  async determineTaskStatus(taskId: number): Promise<string> {
    // Fetch the first unchecked item
    const firstUncheckedItem = await this.prisma.taskCheckItem.findFirst({
      where: { state: TaskCheckItemState.UNCHECKED, taskId },
      orderBy: { ordinalNumber: 'asc' },
    });

    // If no unchecked item exists, either all items are checked or there are no items in the task
    if (!firstUncheckedItem) {
      const lastItem = await this.prisma.taskCheckItem.findFirst({
        where: { taskId, state: TaskCheckItemState.CHECKED },
        orderBy: { ordinalNumber: 'desc' },
      });
      return lastItem?.taskStatus || 'default';
    } else {
      // If there is an unchecked item, fetch a preceeding checked item to get its status
      const lastCheckedItemBeforeUnchecked =
        await this.prisma.taskCheckItem.findFirst({
          where: {
            taskId,
            ordinalNumber: { lt: firstUncheckedItem.ordinalNumber },
            state: TaskCheckItemState.CHECKED,
          },
          orderBy: { ordinalNumber: 'desc' },
        });

      // If the unchecked item was the first on the list, set status to default
      return lastCheckedItemBeforeUnchecked?.taskStatus || 'default';
    }
  }
}
