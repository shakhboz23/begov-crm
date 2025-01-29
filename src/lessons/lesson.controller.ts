import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LessonDto } from './dto/lesson.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Lesson')
@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly jwtService: JwtService,
  ) { }

  @ApiOperation({ summary: 'Create a new lesson' })
  @UseGuards(AuthGuard)
  @Post('/create')
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() lessonDto: LessonDto,
    @Headers() headers: Record<string, string>,
  ) {
    return this.lessonService.create(lessonDto);
  }

  @ApiOperation({ summary: 'Get lesson by ID' })
  @UseGuards(AuthGuard)
  @Get('/getById/:id')
  @ApiBearerAuth('JWT-auth')
  getById(@Param('id') id: number) {
    return this.lessonService.getById(id);
  }

  @ApiOperation({ summary: 'Get all lessons' })
  @UseGuards(AuthGuard)
  @Get('/')
  @ApiBearerAuth('JWT-auth')
  getAll() {
    return this.lessonService.getAll();
  }

  @ApiOperation({ summary: 'Get lessons with pagination' })
  @UseGuards(AuthGuard)
  @Get('pagination/:page')
  @ApiBearerAuth('JWT-auth')
  pagination(@Param('page') page: number) {
    return this.lessonService.pagination(page);
  }

  @ApiOperation({ summary: 'Update lesson by ID' })
  @UseGuards(AuthGuard)
  @Put('/:id')
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id') id: number,
    @Body() lessonDto: LessonDto,
  ) {
    return this.lessonService.update(id, lessonDto);
  }

  @ApiOperation({ summary: 'Delete lesson' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  deleteLesson(@Param('id') id: number) {
    return this.lessonService.delete(id);
  }
}
