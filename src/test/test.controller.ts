import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TestsService } from './test.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestsDto } from './dto/test.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Tests')
@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
  ) { }

  @ApiOperation({ summary: 'Create a new tests' })
  @UseGuards(AuthGuard)
  @Post('/create')
  @ApiBearerAuth('JWT-auth')
  create(@Body() testsDto: TestsDto) {
    return this.testsService.create(testsDto);
  }

  @ApiOperation({ summary: 'Get all tests' })
  @UseGuards(AuthGuard)
  @Get('/')
  @ApiBearerAuth('JWT-auth')
  getAll() {
    return this.testsService.getAll();
  }

  @ApiOperation({ summary: 'Get test by ID' })
  @UseGuards(AuthGuard)
  @Get('/:id')
  @ApiBearerAuth('JWT-auth')
  getById(@Param('id') id: number) {
    return this.testsService.getById(id);
  }

  @ApiOperation({ summary: 'Get testss with pagination' })
  @UseGuards(AuthGuard)
  @Get('pagination/:page')
  @ApiBearerAuth('JWT-auth')
  pagination(@Param('page') page: number) {
    return this.testsService.pagination(page);
  }

  @ApiOperation({ summary: 'Update tests profile by ID' })
  @UseGuards(AuthGuard)
  @Put('/:id')
  @ApiBearerAuth('JWT-auth')
  update(@Param('id') id: number, @Body() testsDto: TestsDto) {
    return this.testsService.update(id, testsDto);
  }

  @ApiOperation({ summary: 'Delete tests' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  deleteTest(@Param('id') id: number) {
    return this.testsService.delete(id);
  }
}
