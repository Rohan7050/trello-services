import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './userEntity';
import { ProjectEntity } from './projectEntity';
import { AccessTypeEntity } from './accessTypeEntity';

@Entity('user_project_rel')
export class UserProjectRelEntity {
  @PrimaryColumn({
    type: 'integer',
  })
  userid: number;

  @PrimaryColumn({
    type: 'integer',
  })
  projectid: number;

  @Column({
    type: 'integer'
  })
  accesstype: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.id)
  project: ProjectEntity;

  @ManyToOne(() => AccessTypeEntity, (accessType) => accessType.id)
  access: AccessTypeEntity | null;
}
