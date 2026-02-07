import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/sequelize.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    PostsModule,
    AuthModule,
  ],
})
export class AppModule {}
