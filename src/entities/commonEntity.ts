import { PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  id: number;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    select: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    select: false,
  })
  updated_at: Date;
}
