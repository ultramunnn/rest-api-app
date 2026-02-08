import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(data: { email: string; password: string }) {
    const existing = await this.userModel.findOne({
      where: { email: data.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    try {
      return await this.userModel.create({
        email: data.email,
        password: data.password,
      });
    } catch (err: any) {
      if (err?.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Email already registered');
      }
      throw err;
    }
  }

  async findAll() {
    return this.userModel.findAll({
      attributes: { exclude: ['password', 'refreshToken'] },
    });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.userModel.findOne({
      where: { id },
      attributes: { exclude: ['password', 'refreshToken'] },
    });
  }

  async findByIdWithRefreshToken(id: number) {
    return this.userModel.findOne({
      where: { id },
    });
  }

  async update(id: number, data: { email?: string; password?: string }) {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }

  async delete(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return { message: 'User deleted' };
  }
}
