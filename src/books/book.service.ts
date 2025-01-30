import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './models/book.models';
import { InjectModel } from '@nestjs/sequelize';
import { BookDto } from './dto/book.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book) private bookRepository: typeof Book,
    private readonly fileService: FilesService,
  ) { }

  async create(
    bookDto: BookDto,
    files: any,
  ): Promise<object> {
    try {
      let img: any, pdf: any;
      const { name } = bookDto;
      const exist = await this.bookRepository.findOne({
        where: { name },
      });
      if (exist) {
        throw new BadRequestException('Already created');
      }
      if (files.length == 2) {
        img = await this.fileService.createFile(
          files[0],
          'image',
        );
        pdf = await this.fileService.createFile(
          files[1],
          'raw',
        );
      }
      const book = await this.bookRepository.create({ ...bookDto, img: img?.url, pdf: pdf?.url });
      return book;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      return this.bookRepository.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const books = await this.bookRepository.findOne({
        where: { id },
      });
      if (!books) {
        throw new NotFoundException('Book not found');
      }
      return books;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const books = await this.bookRepository.findAll({ offset, limit });
      const total_count = await this.bookRepository.count();
      const total_pages = Math.ceil(total_count / 10);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: books,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: number,
    bookDto: BookDto,
  ): Promise<object> {
    try {
      const book = await this.bookRepository.findByPk(id);
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      const update = await this.bookRepository.update(
        bookDto,
        {
          where: { id },
          returning: true,
        },
      );
      return update[1][0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const book = await this.bookRepository.findByPk(id);
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      await this.fileService.deleteFile(book.img);
      await this.fileService.deleteFile(book.pdf);
      book.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
