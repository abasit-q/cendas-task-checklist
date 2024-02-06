import { Test, TestingModule } from '@nestjs/testing';
import { TaskCheckItemService } from './task-check-item.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskService } from 'src/task/task.service';
import { TaskCheckItemState } from '@prisma/client';

describe('TaskCheckItemService', () => {
  let service: TaskCheckItemService;
  let prismaService: PrismaService;
  let taskService: TaskService;

  beforeEach(async () => {
    // Mock PrismaService and TaskService
    const prismaServiceMock = {
      taskCheckItem: {
        update: jest.fn().mockImplementation(({ where, data }) => ({
          id: where.id,
          ...data,
          taskId: 1, // Assume a taskId for the sake of the example
        })),
      },
    };

    const taskServiceMock = {
      determineTaskStatus: jest.fn().mockResolvedValue('red'),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskCheckItemService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compile();

    service = module.get<TaskCheckItemService>(TaskCheckItemService);
    prismaService = module.get<PrismaService>(PrismaService);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('updates a task check item and its task status', async () => {
    const id = 1;
    const updateTaskCheckItemDto = { state: TaskCheckItemState.CHECKED };

    const updatedTaskCheckItem = await service.update(
      id,
      updateTaskCheckItemDto,
    );

    expect(updatedTaskCheckItem).toBeDefined();
    expect(prismaService.taskCheckItem.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        state: TaskCheckItemState[updateTaskCheckItemDto.state],
      },
    });
    expect(taskService.determineTaskStatus).toHaveBeenCalledWith(
      updatedTaskCheckItem.taskId,
    );
    expect(taskService.update).toHaveBeenCalledWith(
      updatedTaskCheckItem.taskId,
      expect.any(String),
    );
  });
});
