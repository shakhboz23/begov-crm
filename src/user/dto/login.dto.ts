import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'admin',
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
}
