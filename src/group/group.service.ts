import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Group } from './models/group.models';
import { InjectModel } from '@nestjs/sequelize';
import { GroupDto } from './dto/group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
  ) { }

  async create(
    groupDto: GroupDto,
  ): Promise<object> {
    try {
      const { name } = groupDto;
      const exist = await this.groupRepository.findOne({
        where: { name },
      });
      if (exist) {
        throw new BadRequestException('Already created');
      }
      const group = await this.groupRepository.create(groupDto);
      return group;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      return this.groupRepository.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const groups = await this.groupRepository.findOne({
        where: { id },
      });
      if (!groups) {
        throw new NotFoundException('Group not found');
      }
      return groups;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number): Promise<object> {
    try {
      const offset = (page - 1) * 10;
      const limit = 10;
      const groups = await this.groupRepository.findAll({ offset, limit });
      const total_count = await this.groupRepository.count();
      const total_pages = Math.ceil(total_count / 10);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: groups,
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
    groupDto: GroupDto,
  ): Promise<object> {
    try {
      const group = await this.groupRepository.findByPk(id);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      const update = await this.groupRepository.update(
        groupDto,
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
      const group = await this.groupRepository.findByPk(id);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      group.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
