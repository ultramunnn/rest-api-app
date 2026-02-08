import type { Optional } from 'sequelize';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Post } from 'src/posts/models/post.model';

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  refreshToken?: string | null;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'refreshToken'
>;

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare refreshToken?: string | null;

  @HasMany(() => Post)
  declare posts: Post[];
}
