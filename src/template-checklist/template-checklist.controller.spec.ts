import { Test, TestingModule } from '@nestjs/testing';
import { TemplateChecklistController } from './template-checklist.controller';
import { TemplateChecklistService } from './template-checklist.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('TemplateChecklistController', () => {
  let controller: TemplateChecklistController;
  let templateChecklistService: TemplateChecklistService;

  beforeEach(async () => {
    const templateChecklistServiceMock = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateChecklistController],
      providers: [
        {
          provide: TemplateChecklistService,
          useValue: templateChecklistServiceMock,
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<TemplateChecklistController>(
      TemplateChecklistController,
    );
    templateChecklistService = module.get<TemplateChecklistService>(
      TemplateChecklistService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll method', async () => {
    await controller.findAll();
    expect(templateChecklistService.findAll).toHaveBeenCalled();
  });
});
