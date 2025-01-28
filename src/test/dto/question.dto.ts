import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class QuestionDto {
    @ApiProperty({
        example: 'Question?',
        description: 'The question text',
    })
    @IsNotEmpty()
    @IsString()
    questionText: string;

    @ApiProperty({
        example: ['option 1', 'option 2', 'option 3', 'option 4'],
        description: 'Answer options for the question',
    })
    @IsArray()
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    options: string[];

    @ApiProperty({
        example: 'option 1',
        description: 'The correct answer for the question',
    })
    @IsNotEmpty()
    @IsString()
    correctAnswer: string;
}