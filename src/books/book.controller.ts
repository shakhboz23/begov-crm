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
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BookDto } from './dto/book.dto';
import { JwtService } from '@nestjs/jwt';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly jwtService: JwtService,
  ) { }

  @ApiOperation({ summary: 'Create a new book' })
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('/create')
  @UseInterceptors(FilesInterceptor('files', 2))
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() bookDto: BookDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<object> {
    console.log("Hi")
    return this.bookService.create(bookDto, files);
  }

  @ApiOperation({ summary: 'Get book by ID' })
  @UseGuards(AuthGuard)
  @Get('/getById/:id')
  @ApiBearerAuth('JWT-auth')
  getById(@Param('id') id: number) {
    return this.bookService.getById(id);
  }

  @ApiOperation({ summary: 'Get all books' })
  @UseGuards(AuthGuard)
  @Get('/')
  @ApiBearerAuth('JWT-auth')
  getAll() {
    return this.bookService.getAll();
  }

  @ApiOperation({ summary: 'Get books with pagination' })
  @UseGuards(AuthGuard)
  @Get('pagination/:page')
  @ApiBearerAuth('JWT-auth')
  pagination(@Param('page') page: number) {
    return this.bookService.pagination(page);
  }

  // @ApiOperation({ summary: 'Update book by ID' })
  // @UseGuards(AuthGuard)
  // @Put('/:id')
  // update(
  //   @Param('id') id: number,
  //   @Body() bookDto: BookDto,
  // ) {
  //   return this.bookService.update(id, bookDto);
  // }

  @ApiOperation({ summary: 'Delete book' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  deleteBook(@Param('id') id: number) {
    return this.bookService.delete(id);
  }
}
