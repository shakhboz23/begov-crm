import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';

interface TestAttributes {
  testName: string;
  questions: any[];
}

@Table({ tableName: 'test', timestamps: false })
export class Tests extends Model<Tests, TestAttributes> {
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
  testName: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  questions: any[];
}
