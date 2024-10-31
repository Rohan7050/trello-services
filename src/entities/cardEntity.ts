import { Entity, Column, ManyToOne } from 'typeorm';
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
    type: 'text',
  }) // Assuming 'desc' can be a longer string.
  desc: string;

  @Column({
    type: 'varchar',
    length: 10,
  })
  card_color: string;

  @Column({
    type: 'timestamp',
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
  })
  end_date: Date;

  @ManyToOne(() => TableEntity, (table) => table.id)
  table: TableEntity;
}
