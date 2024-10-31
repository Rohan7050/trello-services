import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ProjectEntity } from './projectEntity';
import { CommonEntity } from './commonEntity';

@Entity('tables')
export class TableEntity extends CommonEntity {
  @Column()
  project_id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToOne(() => ProjectEntity, (project) => project.id)
  project: ProjectEntity;
}
