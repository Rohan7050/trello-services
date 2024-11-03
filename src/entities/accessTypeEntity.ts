import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CommonEntity } from './commonEntity';

@Entity('access_types')
export class AccessTypeEntity extends CommonEntity {

  @Column({
    type: 'enum',
    enum: ['owner', 'read', 'write'],
  })
  type: string;
}
