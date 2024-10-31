import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CommonEntity } from './commonEntity';

@Entity('projects')
export class ProjectEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 100,
  })
  project_name: string;

  @Column({
    type: 'text',
  }) // Assuming 'desc' can be a longer string.
  desc: string;

  @Column({
    type: 'integer',
    default: 1,
    enum: ['1', '0']
  })
  status: number;
}
