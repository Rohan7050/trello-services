import { AccessTypeEntity } from '../../../entities/accessTypeEntity';
import { ProjectEntity } from '../../../entities/projectEntity';
import { UserEntity } from '../../../entities/userEntity';
import { userProjectRelEntity } from '../../../entities/userProjectRelEntity';
import { pgConnection } from '../../data-source';
import { ProjectCreateType } from './create/create.model';
import { ProjectGetAllType } from './getProject/getProject.model';
import { ProjectUpdateType } from './update/update.model';

export class ProjectDB {
  private projectRepository = pgConnection.getRepository(ProjectEntity);
  private userProjectRelRepository = pgConnection.getRepository(userProjectRelEntity);
  private accessTypeRepository = pgConnection.getRepository(AccessTypeEntity);

  public async getProject(projectId: number, userId: number): Promise<userProjectRelEntity | null> {
    try {
      const project = await this.userProjectRelRepository.findOne({
        where: {
          projectid: projectId,
          userid: userId,
        },
        relations: ['project', 'user', 'accessType'],
      });
      return project;
    } catch (err) {
      throw err;
    }
  }

  public async getAllProject(userId: number, status: number): Promise<userProjectRelEntity[]> {
    try {
      const project = await this.userProjectRelRepository.find({
        where: {
          userid: userId,
          project: {
            status: status
          }
        },
        relations: ['project'],
      });
      return project;
    } catch (err) {
      throw err;
    }
  }

  public async createProject(projectInfo: ProjectCreateType, user: UserEntity): Promise<ProjectEntity | null> {
    try {
      const project = new ProjectEntity();
      project.project_name = projectInfo.project_name;
      project.desc = projectInfo.desc;
      await this.projectRepository.save(project);
      const access: AccessTypeEntity | null = await this.accessTypeRepository.findOneBy({ id: 1 });
      const userProjectRel = new userProjectRelEntity();
      userProjectRel.userid = projectInfo.userid;
      userProjectRel.projectid = projectInfo.projectid;
      userProjectRel.accesstype = 1;
      userProjectRel.user = user;
      userProjectRel.project = project;
      userProjectRel.accessType = access;
      await this.userProjectRelRepository.save(userProjectRel);
      return project;
    } catch (err) {
      throw err;
    }
  }

  public async updateProject(projectId: number, updateData: Partial<ProjectUpdateType>): Promise<void> {
    try {
      await this.projectRepository.update(projectId, updateData);
    } catch (error) {
      throw new Error('Could not update project');
    }
  }

  public async deleteProject(projectId: number): Promise<void> {
    try {
      await this.projectRepository.update(projectId, { status: 0 });
    } catch (err) {
      throw new Error('Could not delete project');
    }
  }
}
