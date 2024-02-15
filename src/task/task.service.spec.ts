import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task, TaskCheckItemState } from '@prisma/client';

interface TaskWithTaskCheckItems extends Task {
  taskCheckItems: {
    name: string;
    taskStatus: string;
    ordinalNumber: number;
    state: TaskCheckItemState;
  }[];
}

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: any;

  beforeEach(async () => {
    const prismaServiceMock = {
      taskCheckItem: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      templateChecklist: {
        findUnique: jest.fn(),
      },
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a task with check items', async () => {
    const createTaskDto = { name: 'Test Task', checklistId: 1 };
    const templateCheckList = {
      id: 1,
      checklistItems: [
        { name: 'Item 1', taskStatus: 'red', ordinalNumber: 1 },
        { name: 'Item 2', taskStatus: 'green', ordinalNumber: 2 },
      ],
    };

    prismaService.templateChecklist.findUnique.mockResolvedValue(
      templateCheckList,
    );
    prismaService.task.create.mockImplementation((data) =>
      Promise.resolve({
        ...data,
        id: 1,
        taskCheckItems: templateCheckList.checklistItems.map((item) => ({
          ...item,
          id: Math.floor(Math.random() * 1000), // Simulated ID for the example
        })),
      }),
    );

    const result = (await service.create(
      createTaskDto,
    )) as TaskWithTaskCheckItems;
    expect(result).toBeDefined();
    expect(prismaService.task.create).toHaveBeenCalled();
    expect(result.taskCheckItems.length).toEqual(
      templateCheckList.checklistItems.length,
    );
  });

  it('finds all tasks', async () => {
    prismaService.task.findMany.mockResolvedValue([
      { id: 1, name: 'Task 1' },
      { id: 2, name: 'Task 2' },
    ]);

    const tasks = await service.findAll();
    expect(tasks.length).toBeGreaterThan(0);
    expect(prismaService.task.findMany).toHaveBeenCalled();
  });

  it('finds a task by id with check items', async () => {
    const taskId = 1;
    const taskData = {
      id: taskId,
      name: 'Test Task',
      taskCheckItems: [{ name: 'Item 1', state: TaskCheckItemState.CHECKED }],
    };

    prismaService.task.findUnique.mockResolvedValue(taskData);

    const task = await service.findOne(taskId);
    expect(task).toBeDefined();
    expect(task.id).toEqual(taskId);
    expect(prismaService.task.findUnique).toHaveBeenCalledWith({
      where: { id: taskId },
      include: {
        taskCheckItems: {
          orderBy: {
            ordinalNumber: 'asc',
          },
        },
      },
    });
  });

  it('updates task status', async () => {
    const taskId = 1;
    const taskStatus = 'green';
    const updatedTask = { id: taskId, name: 'Test Task', taskStatus };

    prismaService.task.update.mockResolvedValue(updatedTask);

    const result = await service.update(taskId, taskStatus);
    expect(result).toBeDefined();
    expect(result.taskStatus).toEqual(taskStatus);
    expect(prismaService.task.update).toHaveBeenCalledWith({
      where: { id: taskId },
      data: { taskStatus },
    });
  });

  it('determines task status as "default" when no unchecked items and no last item', async () => {
    prismaService.taskCheckItem.findMany.mockResolvedValueOnce([]);

    const status = await service.determineTaskStatus(1);
    expect(status).toEqual('default');
    expect(prismaService.taskCheckItem.findMany).toHaveBeenCalledTimes(1);
  });

  it('determines task status based on the last checked item before the first unchecked item', async () => {
    const mockTaskCheckItems = [
      {
        taskStatus: 'red',
        state: TaskCheckItemState.CHECKED,
        taskId: 1,
        ordinalNumber: 1,
      },
      {
        taskStatus: 'green',
        state: TaskCheckItemState.CHECKED,
        taskId: 1,
        ordinalNumber: 2,
      },
      {
        taskStatus: 'blue',
        state: TaskCheckItemState.UNCHECKED,
        taskId: 1,
        ordinalNumber: 3,
      },
    ];

    prismaService.taskCheckItem.findMany.mockResolvedValue(mockTaskCheckItems);

    const status = await service.determineTaskStatus(1);
    expect(status).toEqual('green');
    expect(prismaService.taskCheckItem.findMany).toHaveBeenCalledTimes(1);
  });

  it('determines task status based on the last item when all items are checked', async () => {
    const mockTaskCheckItems = [
      {
        taskStatus: 'red',
        state: TaskCheckItemState.CHECKED,
        taskId: 1,
        ordinalNumber: 1,
      },
      {
        taskStatus: 'green',
        state: TaskCheckItemState.CHECKED,
        taskId: 1,
        ordinalNumber: 2,
      },
    ];
    prismaService.taskCheckItem.findMany.mockResolvedValue(mockTaskCheckItems);

    const status = await service.determineTaskStatus(1);
    expect(status).toEqual('green');
    expect(prismaService.taskCheckItem.findMany).toHaveBeenCalledTimes(1);
  });

  it('determines task status as "default" when all items are unchecked', async () => {
    const mockTaskCheckItems = [
      {
        taskStatus: 'green',
        state: TaskCheckItemState.UNCHECKED,
        taskId: 1,
        ordinalNumber: 1,
      },
      {
        taskStatus: 'blue',
        state: TaskCheckItemState.UNCHECKED,
        taskId: 1,
        ordinalNumber: 2,
      },
    ];
    prismaService.taskCheckItem.findMany.mockResolvedValue(mockTaskCheckItems);

    const status = await service.determineTaskStatus(1);
    expect(status).toEqual('default');
    expect(prismaService.taskCheckItem.findMany).toHaveBeenCalledTimes(1);
  });
});
