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

  async determineTaskStatus(taskId: number): Promise<string> {
    const taskCheckItems = await this.prisma.taskCheckItem.findMany({
      where: { taskId },
      orderBy: { ordinalNumber: 'asc' },
    });

    // Directly return 'default' if there are no items, avoiding further checks
    if (taskCheckItems.length === 0) return 'default';

    const uncheckedItemIndex = taskCheckItems.findIndex(
      (item) => item.state === TaskCheckItemState.UNCHECKED,
    );

    return uncheckedItemIndex > 0
      ? taskCheckItems[uncheckedItemIndex - 1].taskStatus // Getting the preceeding checked item
      : uncheckedItemIndex === -1
        ? taskCheckItems[taskCheckItems.length - 1].taskStatus // All items are checked
        : 'default'; // First item is 'UNCHECKED' or no items
  }
}
