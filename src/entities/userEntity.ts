import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { CommonEntity } from './commonEntity';
import { EncryptionAndDecryption } from '../core/Encryption&Decryption';

@Entity('users')
export class UserEntity extends CommonEntity {
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
  useremail: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  password: string;

  @Column({
    type: 'integer',
    default: 1,
    enum: ['1', '0']
  })
  status: number;

  @BeforeInsert()
  @BeforeUpdate()
  async encryptPassword() {
    this.password = await EncryptionAndDecryption.saltEncryption(this.password);
  }
}
