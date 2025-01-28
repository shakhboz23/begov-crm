import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class LessonDto {
  @ApiProperty({
    example: 'English',
    description: 'Lesson name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://link.com',
    description: 'Lesson name',
  })
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @ApiProperty({
    example: 'level 1',
    description: 'Lesson level',
  })
  @IsNotEmpty()
  @IsString()
  type: string;
}