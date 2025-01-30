import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

export class TeacherDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of user',
    })
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiProperty({
        example: '+998991422303',
        description: 'Phone number of user',
    })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;
    
    @ApiProperty({
        example: 'Login',
        description: 'Login of user',
    })
    @IsNotEmpty()
    @IsString()
    login: string;

    @ApiProperty({
        example: 'password2303',
        description: 'Password of user',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        example: false,
        description: 'Payment status of user',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    paymentStatus?: boolean;

    @ApiProperty({
        example: 0,
        description: 'Homework of user',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    homework?: number;

    @ApiProperty({
        example: 0,
        description: 'Vocabulary of user',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    vocabulary?: number;

    @ApiProperty({
        example: [
            1, 2, 3
        ],
        description: 'Results of user',
        required: false,
    })
    @IsOptional()
    results?: any[];

    @ApiProperty({
        example: false,
        description: 'AttendanceDay1 of user',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    attendanceDay1?: boolean;

    @ApiProperty({
        example: false,
        description: 'AttendanceDay2 of user',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    attendanceDay2?: boolean;

    @ApiProperty({
        example: false,
        description: 'AttendanceDay3 of user',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    attendanceDay3?: boolean;
}
