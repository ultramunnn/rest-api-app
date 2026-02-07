import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
  ) {}

  async create(userId: number, data: any) {
    return this.postModel.create({
      ...data,
      userId,
    });
  }
  async findAll() {
    return this.postModel.findAll({
      include: ['user'],
    });
  }

  async findById(id: number) {
    return this.postModel.findByPk(id, {
      include: ['user']
    });
  }

  async findByUserId(userId: number) {
    return this.postModel.findAll({
      where: { userId },
      include: ['user'],
    });
  }

  async update(id: number, userId: number, data: any) {
    const post = await this.findById(id);

    if (!post) return null;

    if (post.userId !== userId) {
      throw new ForbiddenException('Not your post');
    }

    return post.update(data);
  }

  async delete(id:number, userId: number){
    const post = await this.findById(id);

    if(!post) return null;

    if(post.userId !== userId){
      throw new ForbiddenException('Not your post')
    }

    await post.destroy();
    return { message: 'Post deleted'}
  }
}
