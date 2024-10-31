import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProjectEntity } from './projectEntity';
import { CommonEntity } from './commonEntity';
import { CardEntity } from './cardEntity';

@Entity('tables')
export class TableEntity extends CommonEntity {
  @Column({
    type: 'integer'
  })
  project_id: number;

  @Column({ 
    type: 'varchar', 
    length: 50 
  })
  name: string;

  @ManyToOne(() => ProjectEntity, (project) => project.id)
  project: ProjectEntity;

  @OneToMany(() => CardEntity, (card) => card.id)
  cards: CardEntity[];
}
