import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskCheckItemState } from '@prisma/client';

export class UpdateTaskCheckItemDto {
  @ApiProperty({
    enum: TaskCheckItemState,
    default: TaskCheckItemState.UNCHECKED,
    description: 'Possible values: CHECKED, UNCHECKED',
  })
  @IsNotEmpty()
  @IsEnum(TaskCheckItemState)
  state: TaskCheckItemState;
}
