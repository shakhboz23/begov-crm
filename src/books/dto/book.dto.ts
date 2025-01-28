import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class BookDto {
  @ApiProperty({
    example: 'English',
    description: 'Book name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}