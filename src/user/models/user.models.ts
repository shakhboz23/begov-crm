import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/group/models/group.models';

interface UserAttributes {
  fullName: string;
  phone: string;
  login: string;
  hashed_password: string;
  group_id: number;
  paymentStatus: boolean;
  homework: number;
  vocabulary: number;
  results: any[];
  attendanceDay1: boolean;
  attendanceDay2: boolean;
  attendanceDay3: boolean;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  // @Column({
  //   type: DataType.STRING,
  // })
  // groupName: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  group_id: number;

  @BelongsTo(() => Group)
  group: Group[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  paymentStatus: boolean;

  @Column({
    type: DataType.INTEGER,
  })
  homework: number;

  @Column({
    type: DataType.INTEGER,
  })
  vocabulary: number;

  @Column({
    type: DataType.JSONB,
  })
  results: any[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  attendanceDay1: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  attendanceDay2: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  attendanceDay3: boolean;
}
