import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { v4 } from 'uuid';
import { resolve, join } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import cloudinary from '../../cloudinary.config';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class FilesService {
  constructor(private readonly cloudinaryService: CloudinaryService) { }
  async createFile(file: any, file_type: string): Promise<string> {
    try {
      const fileTypeIndex = file?.originalname.lastIndexOf('.');
      const fileType = file?.originalname.slice(fileTypeIndex);
      const file_name = v4() + fileType;
      const file_path = resolve(__dirname, '..', '..', 'static');
      if (!existsSync(file_path)) {
        mkdirSync(file_path, { recursive: true });
      }
      writeFileSync(join(file_path, file_name), file.buffer);
      const filePath: string = 'dist/static/' + file_name;
      let result: any;
      try {
        result = await cloudinary.uploader.upload(filePath, {
          resource_type: 'auto',
          // type: 'authenticated',
          // access_key: 'jkdjfkdfj',
          // access_control: [
          //   {
          //     access_type: 'token',
          //   },
          // ],
        });
        console.log(result);
      } catch (error) {
        console.log(error);
        return 'error';
      }

      return result;
    } catch (error) {
      throw new HttpException(
        'Error creating file: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(fileUrl: string) {
    const result = await this.cloudinaryService.deleteFileByUrl(fileUrl);
    // try {
    //   unlinkSync(resolve(__dirname, '..', '..', 'static', file_name));
    // } catch (error) {
    //   throw new HttpException(
    //     'Error deleting file: ' + error.message,
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }
}
