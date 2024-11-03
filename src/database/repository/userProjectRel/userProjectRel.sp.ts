import { AccessTypeEntity } from '../../../entities/accessTypeEntity';
import { ProjectEntity } from '../../../entities/projectEntity';
import { UserEntity } from '../../../entities/userEntity';
import { UserProjectRelEntity } from '../../../entities/userProjectRelEntity';
import { pgConnection } from '../../data-source';

export class ProjectUserRelDB {
  private userProjectRelRepository = pgConnection.getRepository(UserProjectRelEntity);
  private accessTypeRepository = pgConnection.getRepository(AccessTypeEntity);

  public async createProjectUserRel(project: ProjectEntity, user: UserEntity, accessType: number): Promise<UserProjectRelEntity | null> {
    try {
      const access: AccessTypeEntity | null = await this.accessTypeRepository.findOneBy({ id: accessType });
      const userProjectRel = new UserProjectRelEntity();
      userProjectRel.userid = user.id;
      userProjectRel.projectid = project.id;
      userProjectRel.accesstype = 1;
      userProjectRel.user = user;
      userProjectRel.project = project;
      userProjectRel.access = access;
      const data = await this.userProjectRelRepository.save(userProjectRel);
      return data;
    } catch (err) {
      throw err;
    }
  }

  public async getProjectUser(userId: number, projectId: number, accessType: number): Promise<UserProjectRelEntity | null> {
    try {
      const data = await this.userProjectRelRepository.findOneBy({ userid: userId, projectid: projectId, accesstype: accessType });
      return data;
    } catch (err) {
      throw err;
    }
  }
}