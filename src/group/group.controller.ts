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
import { GroupService } from './group.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GroupDto } from './dto/group.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly jwtService: JwtService,
  ) { }

  @ApiOperation({ summary: 'Create a new group' })
  // @UseGuards(AuthGuard)
  @Post('/create')
  // @ApiBearerAuth('JWT-auth')
  async create(
    @Body() groupDto: GroupDto,
    @Headers() headers: Record<string, string>,
  ) {
    return this.groupService.create(groupDto);
  }

  @ApiOperation({ summary: 'Get group by ID' })
  @UseGuards(AuthGuard)
  @Get('/getById/:id')
  @ApiBearerAuth('JWT-auth')
  getById(@Param('id') id: number) {
    return this.groupService.getById(id);
  }

  @ApiOperation({ summary: 'Get group users by group ID' })
  @UseGuards(AuthGuard)
  @Get('/getGroupUsers/:id')
  @ApiBearerAuth('JWT-auth')
  getGroupUsers(@Param('id') id: number) {
    return this.groupService.getGroupUsers(id);
  }

  @ApiOperation({ summary: 'Get all groups' })
  @UseGuards(AuthGuard)
  @Get('/')
  @ApiBearerAuth('JWT-auth')
  getAll() {
    return this.groupService.getAll();
  }

  @ApiOperation({ summary: 'Get groups with pagination' })
  @UseGuards(AuthGuard)
  @Get('pagination/:page')
  @ApiBearerAuth('JWT-auth')
  pagination(@Param('page') page: number) {
    return this.groupService.pagination(page);
  }

  @ApiOperation({ summary: 'Update group by ID' })
  @UseGuards(AuthGuard)
  @Put('/:id')
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id') id: number,
    @Body() groupDto: GroupDto,
  ) {
    return this.groupService.update(id, groupDto);
  }

  @ApiOperation({ summary: 'Delete group' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  deleteGroup(@Param('id') id: number) {
    return this.groupService.delete(id);
  }
}
