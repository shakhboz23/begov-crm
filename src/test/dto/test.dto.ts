import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionDto } from './question.dto';

export class TestsDto {
  @ApiProperty({
    example: 'Test Name',
    description: 'Name of the test',
  })
  @IsNotEmpty()
  @IsString()
  testName: string;

  @ApiProperty({
    type: [QuestionDto],
    description: 'Array of test questions',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
