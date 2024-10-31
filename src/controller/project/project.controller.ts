import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import Controller from '../../interfaces/controller.interface';
import sanitizeBody from '../../middlewares/sanitizeBody.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { BaseController } from '../BaseController';
import { ApiError, BadRequestError } from '../../core/ApiError';
import authMiddleware from '../../middlewares/auth.middleware';
import { ProjectCreateDto } from '../../database/repository/project/create/create.dto';
import { projectGetAllModel } from '../../database/repository/project/getProject/getProject.model';
import { ProjectDB } from '../../database/repository/project/project.sp';
import { ProjectGetAllDto } from '../../database/repository/project/getProject/getProject.dto';
import { projectCreateModel } from '../../database/repository/project/create/create.model';
import { UserDB } from '../../database/repository/user/user.sp';
import { ProjectUserRelDB } from '../../database/repository/userProjectRel/userProjectRel.sp';
import { ProjectUpdateDto } from '../../database/repository/project/update/update.dto';
import { projectUpdateModel } from '../../database/repository/project/update/update.model';
import { ProjectDeleteDto } from '../../database/repository/project/delete/delete.dto';
import { projectDeleteModel } from '../../database/repository/project/delete/delete.model';
import readAccessMiddleware from '../../middlewares/readAccess.middleware';
import ownerAccessMiddleware from '../../middlewares/ownerAccess.middleware';

export class ProjectController extends BaseController implements Controller {
  public path = '/project';
  public router = express.Router();
  private projectdb: ProjectDB = new ProjectDB();
  private userdb: UserDB = new UserDB();
  private projectUserRelDb: ProjectUserRelDB = new ProjectUserRelDB();
  constructor() {
    super();
    this._initialiseRoutes();
  }

  private _initialiseRoutes = () => {
    this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(ProjectCreateDto), this.createProject);
    this.router.post(`${this.path}/getProject`, authMiddleware, validationMiddleware(ProjectGetAllDto), readAccessMiddleware, this.getProjectInfo);
    this.router.get(`${this.path}/active/getAllProject`, authMiddleware, this.getAllActiveProject);
    this.router.get(`${this.path}/archive/getAllProject`, authMiddleware, this.getAllArchiveProject);
    this.router.put(`${this.path}/update`, authMiddleware, validationMiddleware(ProjectUpdateDto), ownerAccessMiddleware, this.updateProject);
    this.router.delete(`${this.path}/delete`, authMiddleware, validationMiddleware(ProjectDeleteDto), ownerAccessMiddleware, this.deleteProject);
  };

  private createProject = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    console.log(`Creating project`, userId);
    const body = sanitizeBody(projectCreateModel, req.body);

    const user = await this.userdb.findUserById(userId);
    if (!user) {
      return ApiError.handle(new BadRequestError('unknown error, please login again'), res);
    }
    const newProject = await this.projectdb.createProject(body);
    if (!newProject) {
      return ApiError.handle(new BadRequestError('unknown error, please login again'), res);
    }
    const projectUserRel = await this.projectUserRelDb.createProjectUserRel(newProject, user, 1);
    new SuccessResponse('success', projectUserRel).send(res);
  });

  private getProjectInfo = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    const { projectId } = sanitizeBody(projectGetAllModel, req.body);
    const projectList = await this.projectdb.getProject(projectId, userId);
    if (!projectList) {
      return ApiError.handle(new BadRequestError('this project does not exists.'), res);
    }
    new SuccessResponse('success', projectList).send(res);
  });

  private getAllActiveProject = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    const projectList = await this.projectdb.getAllProject(userId, 1);
    if (!projectList || !projectList.length) {
      return ApiError.handle(new BadRequestError('projects not found.'), res);
    }
    new SuccessResponse('success', projectList).send(res);
  });

  private getAllArchiveProject = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    const project = await this.projectdb.getAllProject(userId, 0);
    if (!project || !project.length) {
      return ApiError.handle(new BadRequestError('projects not found.'), res);
    }
    new SuccessResponse('success', project).send(res);
  });

  private updateProject = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    const { projectId, project_name, desc } = sanitizeBody(projectUpdateModel, req.body);
    const getProject = this.projectUserRelDb.getProjectUser(userId, projectId, 1);
    if (!getProject) {
      return ApiError.handle(new BadRequestError("You don't have access to edit this project"), res);
    }
    await this.projectdb.updateProject(projectId, { project_name, desc });
    new SuccessMsgResponse('success').send(res);
  });

  private deleteProject = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    const {projectId} = sanitizeBody(projectDeleteModel, req.body);
    console.log(projectId)
    const getProject = this.projectUserRelDb.getProjectUser(userId, projectId, 1);
    if (!getProject) {
      return ApiError.handle(new BadRequestError("You don't have permission to delete this project"), res);
    }
    await this.projectdb.deleteProject(projectId);
    new SuccessMsgResponse('success').send(res);
  });
}
