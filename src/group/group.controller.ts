import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GroupDto } from './dto/group.dto';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly jwtService: JwtService,
  ) { }

  @ApiOperation({ summary: 'Create a new group' })
  @Post('/create')
  async create(
    @Body() groupDto: GroupDto,
    @Headers() headers: Record<string, string>,
  ) {
    return this.groupService.create(groupDto);
  }

  @ApiOperation({ summary: 'Get group by ID' })
  // @UseGuards(AuthGuard)
  @Get('/getById/:id')
  getById(@Param('id') id: number) {
    return this.groupService.getById(id);
  }

  @ApiOperation({ summary: 'Get all groups' })
  // @UseGuards(AuthGuard)
  @Get('/')
  getAll() {
    return this.groupService.getAll();
  }

  @ApiOperation({ summary: 'Get groups with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page')
  pagination(@Param('page') page: number) {
    return this.groupService.pagination(page);
  }

  @ApiOperation({ summary: 'Update group by ID' })
  // @UseGuards(AuthGuard)
  @Put('/:id')
  update(
    @Param('id') id: number,
    @Body() groupDto: GroupDto,
  ) {
    return this.groupService.update(id, groupDto);
  }

  @ApiOperation({ summary: 'Delete group' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteGroup(@Param('id') id: number) {
    return this.groupService.delete(id);
  }
}
