import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { TableEntity } from './tableEntity';
import { CommonEntity } from './commonEntity';

@Entity('cards')
export class CardEntity extends CommonEntity {
  @Column({
    type: 'integer',
  })
  table_id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  title: string;

  @Column({
    type: 'integer',
    nullable: false,
    default: 1,
  })
  order: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  desc: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  card_color: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  end_date: Date;

  @ManyToOne(() => TableEntity, (table) => table.cards)
  table: TableEntity;
}
