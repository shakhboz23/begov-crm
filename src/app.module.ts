import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { FilesModule } from './files/files.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { TestsModule } from './test/test.module';
import { MailModule } from './mail/mail.module';
import { UserService } from './user/user.service';
import { LessonModule } from './lessons/lesson.module';
import { BookModule } from './books/book.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: String(process.env.PG_PASS),
      database: process.env.PG_DB,
      autoLoadModels: true,
      logging: true,
      dialectOptions:
        process.env.NODE_ENV === 'production'
          ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
          : {},
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', 'static'),
    }),
    JwtModule.register({ global: true }),
    MailModule,
    FilesModule,
    UserModule,
    GroupModule,
    LessonModule,
    TestsModule,
    BookModule,
  ],
  controllers: [],
  providers: [],
  exports: []
})

export class AppModule implements OnApplicationBootstrap {

  constructor(
    private readonly userService: UserService,
  ) { }

  async onApplicationBootstrap() {
    await this.userService.createDefaultUser();
  }

}

