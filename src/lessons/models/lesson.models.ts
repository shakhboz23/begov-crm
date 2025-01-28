import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

interface LessonAttributes {
  name: string;
  link: string;
  type: string;
}

@Table({ tableName: 'lesson' })
export class Lesson extends Model<Lesson, LessonAttributes> {
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
  link: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;
}
