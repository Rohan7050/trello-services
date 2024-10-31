import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './userEntity';
import { ProjectEntity } from './projectEntity';
import { AccessTypeEntity } from './accessTypeEntity';

@Entity('user_project_rel')
export class UserProjectRel {
  @PrimaryColumn()
  userid: number;

  @PrimaryColumn()
  projectid: number;

  @Column()
  accesstype: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.id)
  project: ProjectEntity;

  @ManyToOne(() => AccessTypeEntity, (accessType) => accessType.id)
  accessType: AccessTypeEntity;
}
