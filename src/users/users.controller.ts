import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PostsService } from 'src/posts/posts.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashed,
    });
    return this.sanitize(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/posts')
  @UseGuards(JwtAuthGuard)
  async getPostsByUser(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findByUserId(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const data = { ...dto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await this.usersService.update(id, data);
    return user ? this.sanitize(user) : null;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }

  private sanitize(user: any) {
    const plain = user?.get ? user.get({ plain: true }) : user;
    if (!plain) return plain;
    delete plain.password;
    delete plain.refreshToken;
    return plain;
  }
}
