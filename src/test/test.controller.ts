import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Headers,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TestsService } from './test.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestsDto } from './dto/test.dto';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Tests')
@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Create a new tests' })
  @Post('/create')
  create(@Body() testsDto: TestsDto) {
    return this.testsService.create(testsDto);
  }

  @ApiOperation({ summary: 'Get all tests' })
  // @UseGuards(AuthGuard)
  @Get('/')
  getAll() {
    return this.testsService.getAll();
  }

  @ApiOperation({ summary: 'Get test by ID' })
  // @UseGuards(AuthGuard)
  @Get('/:id')
  getById(@Param('id') id: number) {
    return this.testsService.getById(id);
  }

  @ApiOperation({ summary: 'Get testss with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.testsService.pagination(page);
  }
  
  @ApiOperation({ summary: 'Update tests profile by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(@Param('id') id: number, @Body() testsDto: TestsDto) {
    return this.testsService.update(id, testsDto);
  }

  @ApiOperation({ summary: 'Delete tests' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteTest(@Param('id') id: number) {
    return this.testsService.delete(id);
  }
}
