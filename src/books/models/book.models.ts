import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

interface BookAttributes {
  name: string;
  img: string;
  pdf: string;
}

@Table({ tableName: 'book' })
export class Book extends Model<Book, BookAttributes> {
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
  })
  img: string;

  @Column({
    type: DataType.STRING,
  })
  pdf: string;
}
