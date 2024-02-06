import { Test, TestingModule } from '@nestjs/testing';
import { TaskCheckItemController } from './task-check-item.controller';
import { TaskCheckItemService } from './task-check-item.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from 'src/task/task.service';
import { TaskCheckItemState } from '@prisma/client';

describe('TaskCheckItemController', () => {
  let controller: TaskCheckItemController;
  let taskCheckItemService: TaskCheckItemService;

  beforeEach(async () => {
    // Mock TaskCheckItemService
    const taskCheckItemServiceMock = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskCheckItemController],
      // Using mock instead of the actual TaskCheckItemService
      providers: [
        { provide: TaskCheckItemService, useValue: taskCheckItemServiceMock },
        PrismaService,
        TaskService,
      ],
    }).compile();

    controller = module.get<TaskCheckItemController>(TaskCheckItemController);
    taskCheckItemService =
      module.get<TaskCheckItemService>(TaskCheckItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call update method with expected parameters', async () => {
    const id = '1';
    const updateTaskCheckItemDto = {
      name: 'Updated Name',
      state: TaskCheckItemState.CHECKED,
    };
    await controller.update(id, updateTaskCheckItemDto);
    expect(taskCheckItemService.update).toHaveBeenCalledWith(
      +id,
      updateTaskCheckItemDto,
    );
  });
});
