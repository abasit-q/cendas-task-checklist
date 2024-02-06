import { Controller, Body, Patch, Param } from '@nestjs/common';
import { TaskCheckItemService } from './task-check-item.service';
import { UpdateTaskCheckItemDto } from './dto/update-task-check-item.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task Check Item')
@Controller('task-check-item')
export class TaskCheckItemController {
  constructor(private readonly taskCheckItemService: TaskCheckItemService) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskCheckItemDto: UpdateTaskCheckItemDto,
  ) {
    return this.taskCheckItemService.update(+id, updateTaskCheckItemDto);
  }
}
