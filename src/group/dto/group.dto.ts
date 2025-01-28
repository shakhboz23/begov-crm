import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class GroupDto {
  @ApiProperty({
    example: 'English',
    description: 'Group name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'level 1',
    description: 'Group level',
  })
  @IsNotEmpty()
  @IsString()
  level: string;
}
