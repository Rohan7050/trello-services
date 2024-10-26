import { Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';

export class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  id: number;

  @CreateDateColumn({
    type: 'timestamp without time zone'
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone'
  })
  updated_at: Date;
}
