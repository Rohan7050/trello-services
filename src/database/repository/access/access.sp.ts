import { ILike } from 'typeorm';
import { pgConnection } from '../../data-source';
import { UserProjectRelEntity } from '../../../entities/userProjectRelEntity';
import { ProjectEntity } from '../../../entities/projectEntity';
import { AccessTypeEntity } from '../../../entities/accessTypeEntity';
import { UserEntity } from '../../../entities/userEntity';

export class AccessDB {
  private userProjectRelRepository = pgConnection.getRepository(UserProjectRelEntity);
  private usersRepository = pgConnection.getRepository(UserEntity);
  private accessTypeRepository = pgConnection.getRepository(AccessTypeEntity);

  public async getAccessType(accessType: number): Promise<AccessTypeEntity | null> {
    try {
      const access = await this.accessTypeRepository.findOneBy({ id: accessType });
      return access;
    } catch (err) {
      throw err;
    }
  }

  public async findUsers(text: string): Promise<UserEntity[]> {
    try {
      const users = await this.usersRepository.find({
        where: [{ username: ILike('%${text}%') }, { useremail: ILike('%${text}%') }],
        select: {
          id: true,
          useremail: true,
          username: true,
        },
      });
      return users;
    } catch (err) {
      throw err;
    }
  }

  public async addUser(userId: number, user: UserEntity, projectId: number, project: ProjectEntity, accessType: number, access: AccessTypeEntity): Promise<UserProjectRelEntity> {
    try {
      const newRel = new UserProjectRelEntity();
      newRel.userid = userId;
      newRel.user = user;
      newRel.project = project;
      newRel.projectid = projectId;
      newRel.accesstype = accessType;
      newRel.access = access;
      const saveNewRel = await this.userProjectRelRepository.save(newRel);
      return saveNewRel;
    } catch (err) {
      throw err;
    }
  }

  public async removeUser(userId: number, projectId: number): Promise<boolean> {
    try {
      const deleteEntry = await this.userProjectRelRepository.delete({
        userid: userId,
        projectid: projectId,
      });
      return !!deleteEntry.affected;
    } catch (err) {
      throw err;
    }
  }

  public async updateAccess(userId: number, projectId: number, accessType: number, access: AccessTypeEntity): Promise<boolean> {
    try {
      const updateEntry = await this.userProjectRelRepository.update({
          userid: userId,
          projectid: projectId
      }, {
        access: access,
        accesstype: accessType
      });
      return !!updateEntry.affected;
    } catch (err) {
      throw err;
    }
  }
}
