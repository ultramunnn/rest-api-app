import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './models/post.model';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
