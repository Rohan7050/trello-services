import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './commonEntity';
import { TableEntity } from './tableEntity';

@Entity('projects')
export class ProjectEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    unique: true,
    length: 100,
  })
  project_name: string;

  @Column({
    type: 'text',
  })
  desc: string;

  @Column({
    type: 'integer',
    default: 1,
    enum: [1, 0]
  })
  status: number;

  @OneToMany(() => TableEntity, (table) => table.project)
  tables: TableEntity[];
}
