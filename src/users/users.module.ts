import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), PostsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
