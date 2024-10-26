import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import {CommonEntity} from './commonEntity'

@Entity('users')
export class User extends CommonEntity {
  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  password: string;

  @Column({
    type: 'integer',
    default: 1,
  })
  status: number;
}
