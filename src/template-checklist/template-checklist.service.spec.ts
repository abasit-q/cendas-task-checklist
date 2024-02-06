import { Test, TestingModule } from '@nestjs/testing';
import { TemplateChecklistService } from './template-checklist.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('TemplateChecklistService', () => {
  let service: TemplateChecklistService;
  let prismaService: any;

  beforeEach(async () => {
    const prismaServiceMock = {
      templateChecklist: {
        findMany: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateChecklistService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<TemplateChecklistService>(TemplateChecklistService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('finds all template checklists', async () => {
    prismaService.templateChecklist.findMany.mockResolvedValue([
      { id: 1, name: 'Template Checklist 1' },
      { id: 2, name: 'Template Checklist 2' },
    ]);

    const tasks = await service.findAll();
    expect(tasks.length).toBeGreaterThan(0);
    expect(prismaService.templateChecklist.findMany).toHaveBeenCalled();
  });
});
