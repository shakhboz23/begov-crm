import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.models';

interface GroupAttributes {
  name: string;
  level: string;
}

@Table({ tableName: 'group' })
export class Group extends Model<Group, GroupAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  level: string;

  @HasMany(() => User, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  users: User[];
}
