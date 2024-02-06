import { Controller, Get } from '@nestjs/common';
import { TemplateChecklistService } from './template-checklist.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Template Checklist')
@Controller('template-checklist')
export class TemplateChecklistController {
  constructor(
    private readonly templateChecklistService: TemplateChecklistService,
  ) {}

  @Get()
  findAll() {
    return this.templateChecklistService.findAll();
  }
}
