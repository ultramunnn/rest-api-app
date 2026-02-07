import { Table, Column, Model, DataType, HasMany, AllowNull } from 'sequelize-typescript';
import { Post } from 'src/posts/models/post.model';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
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
  declare refreshToken?: string;

  @HasMany(() => Post)
  declare posts: Post[];
}
