import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProjectEntity } from './projectEntity';
import { CommonEntity } from './commonEntity';
import { CardEntity } from './cardEntity';

@Entity('tables')
export class TableEntity extends CommonEntity {
  @Column({
    type: 'integer'
  })
  projectid: number;

  @Column({ 
    type: 'varchar', 
    length: 50 
  })
  name: string;

  @ManyToOne(() => ProjectEntity, (project) => project.tables)
  project: ProjectEntity;

  @OneToMany(() => CardEntity, (card) => card.table)
  cards?: CardEntity[];
}
