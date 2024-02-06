import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    // Mock TaskService
    const taskServiceMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      // Using mock instead of the actual TaskService
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        PrismaService,
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method with expected payload', async () => {
    const createTaskDto = { name: 'Test Task', checklistId: 1 };
    await controller.create(createTaskDto);
    expect(taskService.create).toHaveBeenCalledWith(createTaskDto);
  });

  it('should call findOne method with expected id', async () => {
    const taskId = '1';
    await controller.findOne(taskId);
    expect(taskService.findOne).toHaveBeenCalledWith(+taskId);
  });

  it('should call findAll method', async () => {
    await controller.findAll();
    expect(taskService.findAll).toHaveBeenCalled();
  });
});
