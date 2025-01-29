import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Headers,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import { extractUserIdFromToken } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  @ApiOperation({ summary: 'Registration a new user' })
  @Post('register')
  async register(
    @Body() userDto: UserDto,
  ) {
    const data = await this.userService.register(userDto);
    return data;
  }

  @ApiOperation({ summary: 'Login user with send OTP' })
  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    // @Req() req: Request,
  ) {
    return this.userService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(AuthGuard)
  @Get('/')
  @ApiBearerAuth('JWT-auth')
  getAll() {
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  getById(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @ApiOperation({ summary: 'Get users with pagination' })
  @UseGuards(AuthGuard)
  @Get('pagination/:page/:limit')
  @ApiBearerAuth('JWT-auth')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.userService.pagination(page, limit);
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @UseGuards(AuthGuard)
  @Put('/:id')
  @ApiBearerAuth('JWT-auth')
  update(@Param('id') id: number, @Body() updateDto: UpdateDto) {
    return this.userService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  // @UseGuards(AuthGuard)
  @Post('/auth/google')
  googleAuth(
    @Body() { credential }: { credential: string },
  ) {
    return this.userService.googleAuth(credential);
  }
}
