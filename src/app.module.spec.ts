import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { TemplateChecklistModule } from './template-checklist/template-checklist.module';
import { TaskModule } from './task/task.module';
import { TaskCheckItemModule } from './task-check-item/task-check-item.module';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TemplateChecklistModule,
        TaskModule,
        TaskCheckItemModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    const module = appModule.get<AppModule>(AppModule);
    expect(module).toBeDefined();
  });

  it('should have the AppController', () => {
    const appController = appModule.get<AppController>(AppController);
    expect(appController).toBeDefined();
  });

  it('should have the AppService', () => {
    const appService = appModule.get<AppService>(AppService);
    expect(appService).toBeDefined();
  });

  it('should have the PrismaService', () => {
    const prismaService = appModule.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });

  afterAll(async () => {
    await appModule.close();
  });
});
