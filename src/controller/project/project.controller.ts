import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import Controller from '../../interfaces/controller.interface';
import sanitizeBody from '../../middlewares/sanitizeBody.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { BaseController } from '../BaseController';
import { registerModel } from '../../database/repository/user/register/register.model';
import { ApiError, BadRequestError } from '../../core/ApiError';
import { RegisterDto } from '../../database/repository/user/register/register.dto';
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

export class UserController extends BaseController implements Controller {
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
    this.router.post(`${this.path}/`, authMiddleware);
    this.router.post(`${this.path}/create`, validationMiddleware(ProjectCreateDto), this.createProject);
    this.router.post(`${this.path}/getProject`, validationMiddleware(ProjectGetAllDto), this.getProjectInfo);
    this.router.post(`${this.path}/active/getAllProject`, validationMiddleware(ProjectGetAllDto), this.getAllActiveProject);
    this.router.post(`${this.path}/archive/getAllProject`, validationMiddleware(ProjectGetAllDto), this.getAllArchiveProject);
    this.router.post(`${this.path}/update`, validationMiddleware(ProjectUpdateDto), this.updateProject);
    this.router.post(`${this.path}/delete`, validationMiddleware(RegisterDto), this.deleteProject);
  };

  private createProject = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    const body = sanitizeBody(projectCreateModel, req.body);
    const user = await this.userdb.findUserById(userId);
    if (!user) {
      return ApiError.handle(new BadRequestError('unknown error, please login login again'), res);
    }
    const newProject = await this.projectdb.createProject(body, user);
    if (!newProject) {
      return ApiError.handle(new BadRequestError('unknown error, please login login again'), res);
    }
    const projectUserRel = await this.projectUserRelDb.createProjectUserRel(newProject, user, 1);
    new SuccessResponse('success', { data: projectUserRel }).send(res);
  });

  private getProjectInfo = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    const { projectid } = sanitizeBody(projectGetAllModel, req.body);
    const projectList = await this.projectdb.getProject(projectid, userId);
    if (!projectList) {
      return ApiError.handle(new BadRequestError('this project does not exists.'), res);
    }
    new SuccessResponse('success', { data: projectList }).send(res);
  });

  private getAllActiveProject = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    const projectList = await this.projectdb.getAllProject(userId, 1);
    if (!projectList || !projectList.length) {
      return ApiError.handle(new BadRequestError('projects not found.'), res);
    }
    new SuccessResponse('success', { data: projectList }).send(res);
  });

  private getAllArchiveProject = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const userId = Number(res.getHeader('user_id'));
    const project = await this.projectdb.getAllProject(userId, 0);
    if (!project || !project.length) {
      return ApiError.handle(new BadRequestError('projects not found.'), res);
    }
    new SuccessResponse('success', { data: project }).send(res);
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
    const {projectId} = sanitizeBody(registerModel, req.body);
    const getProject = this.projectUserRelDb.getProjectUser(userId, projectId, 1);
    if (!getProject) {
      return ApiError.handle(new BadRequestError("You don't have permission to delete this project"), res);
    }
    await this.projectdb.deleteProject(projectId);
    new SuccessMsgResponse('success').send(res);
  });
}
