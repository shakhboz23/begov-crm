import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { User } from './models/user.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register.dto';
import { generateToken, writeToCookie } from '../utils/token';
import { LoginUserDto } from './dto/login.dto';
import { Op } from 'sequelize';
import { MailService } from '../mail/mail.service';
import { compareSync, hash } from 'bcryptjs';
import * as uuid from 'uuid';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { NewPasswordDto } from './dto/new-password.dto';
import { OAuth2Client } from 'google-auth-library';
import { UpdateDto } from './dto/update.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }
  async register(
    userDto: UserDto,
  ): Promise<object> {
    try {
      let { login, password } = userDto;
      const hashed_password: string = await hash(password, 7);
      let user = await this.userRepository.findOne({
        where: { login }
      });
      if (user) {
        throw new BadRequestException("This login already exists on system, please try another login");
      }
      user = await this.userRepository.create({
        ...userDto,
        hashed_password,
      });
      const { access_token, refresh_token } = await generateToken(
        { id: user.id },
        this.jwtService,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Registered successfully',
        data: user,
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private generateRandomPassword(): string {
    const chars = '0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  async login(
    loginUserDto: LoginUserDto,
    type?: string,
  ): Promise<object> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginUserDto.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (type != 'googleauth') {
        const isMatchPass = await bcrypt.compare(
          loginUserDto.password,
          user.hashed_password,
        );
        if (!isMatchPass) {
          throw new BadRequestException('Password did not match!');
        }
      }

      const { access_token, refresh_token } = await generateToken(
        { id: user.id },
        this.jwtService,
      );
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Logged in successfully',
        data: user,
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const users = await this.userRepository.findAll();
      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    console.log('getById', id);
    try {
      if (!id) {
        throw new NotFoundException('User not found!');
      }
      const userdata: any = await this.userRepository.findByPk(id);
      const current_role: string = userdata?.current_role || 'student';
      const user = await this.userRepository.findOne({
        where: { id },
        replacements: { id, current_role },
      });
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const users = await this.userRepository.findAll({ offset, limit });
      const total_count = await this.userRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: users,
          pagination: {
            currentPage: Number(page),
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

  async update(id: number, updateDto: UpdateDto): Promise<object> {
    try {
      const { login, password } = updateDto;
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      console.log(login)
      const isExistLogin = login ? await this.userRepository.findOne({
        where: { login }
      }) : null;
      if (isExistLogin && isExistLogin?.id != user.id) {
        throw new BadRequestException("This login already exists on system, please try another login");
      }
      for (let i in user) {
        if (i != 'homework' && i != 'vocabulary') {
          user[i] = updateDto[i] || user[i]
        }
      }
      updateDto.homework = (updateDto.homework || 0) + user.homework;
      updateDto.vocabulary = (updateDto.vocabulary || 0) + user.vocabulary;
      const hashed_password = password ? await hash(password, 7) : user.hashed_password;
      const update = await this.userRepository.update({ ...updateDto, hashed_password }, {
        where: { id },
        returning: true,
      });
      return update[1][0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(id: string): Promise<object> {
    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verify(token: string) {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return payload;
  }

  async googleAuth(credential: string) {
    console.log(credential, 'credential');
    try {
      const payload: any = await this.verify(credential);
      console.log(payload);
      const data: any = {
        name: payload.given_name,
        surname: payload.family_name,
        password: credential,
        email: payload.email,
        role: 'student',
      };
      const is_user = await this.userRepository.findOne({
        where: {
          email: payload.email,
        },
      });
      let user: any;
      console.log(is_user);
      if (is_user) {
        user = await this.login(data, 'googleauth');
      } else {
        user = await this.register(data);
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async createDefaultUser() {
    try {
      await this.register({
        fullName: process.env.INITIAL_NAME,
        password: process.env.INITIAL_EMAIL,
        // role: RoleName.super_admin,
        phone: "+998991422303",
        email: process.env.INITIAL_EMAIL,
        login: 'admin',
        group_id: 1,
        paymentStatus: false,
        homework: 0,
        vocabulary: 0,
        results: [],
        attendanceDay1: false,
        attendanceDay2: false,
        attendanceDay3: false
      });
    } catch { }
  }
}
