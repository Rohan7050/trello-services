import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import Controller from '../../interfaces/controller.interface';
import sanitizeBody from '../../middlewares/sanitizeBody.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { BaseController } from '../BaseController';
import { ApiError, BadRequestError } from '../../core/ApiError';
import { UserDB } from '../../database/repository/user/user.sp';
import authMiddleware from '../../middlewares/auth.middleware';
import { ListUsersDto } from '../../database/repository/access/listUsers/listUsers.dto';
import { listUsersModel } from '../../database/repository/access/listUsers/listUsers.model';
import { FindUsersDto } from '../../database/repository/access/findUsers/findUsers.dto';
import { AddUsersDto } from '../../database/repository/access/addUsers/addUsers.dto';
import ownerAccessMiddleware from '../../middlewares/ownerAccess.middleware';
import { RemoveUsersDto } from '../../database/repository/access/removeUsers/removeUsers.dto';
import { AccessDB } from '../../database/repository/access/access.sp';
import { ProjectUserRelDB } from '../../database/repository/userProjectRel/userProjectRel.sp';
import { findUsersModel } from '../../database/repository/access/findUsers/findUsers.model';
import { addUsersModel } from '../../database/repository/access/addUsers/addUsers.model';
import { ProjectDB } from '../../database/repository/project/project.sp';
import { UpdateAcessDto } from '../../database/repository/access/update/update.dto';
import { removeUsersModel } from '../../database/repository/access/removeUsers/removeUsers.model';
import { updateAccessModel } from '../../database/repository/access/update/update.model';

export class AccessController extends BaseController implements Controller {
  public path = '/access';
  public router = express.Router();
  private accessDb: AccessDB = new AccessDB();
  private userDb: UserDB = new UserDB();
  private projectUserRelDb: ProjectUserRelDB = new ProjectUserRelDB();
  private projectDb: ProjectDB = new ProjectDB();

  constructor() {
    super();
    this._initialiseRoutes();
  }

  private _initialiseRoutes = () => {
    this.router.post(`${this.path}/listUsers`, authMiddleware, validationMiddleware(ListUsersDto), this.listAllProjectUsers);
    this.router.get(`${this.path}/findUser`, authMiddleware, validationMiddleware(FindUsersDto), this.findUser);
    this.router.post(`${this.path}/addUser`, authMiddleware, validationMiddleware(AddUsersDto), ownerAccessMiddleware, this.addUser);
    this.router.get(`${this.path}/removeUser`, authMiddleware, validationMiddleware(RemoveUsersDto), ownerAccessMiddleware, this.removeUser);
    this.router.get(`${this.path}/update`, authMiddleware, validationMiddleware(UpdateAcessDto), ownerAccessMiddleware, this.updateAccess);
  };

  private listAllProjectUsers = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const body = sanitizeBody(listUsersModel, req.body);
    const userList = await this.projectUserRelDb.getAllProjectContributors(body.projectId);
    new SuccessResponse('success', userList).send(res);
  });

  private findUser = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const body = sanitizeBody(findUsersModel, req.body);
    const users = await this.accessDb.findUsers(body.text);
    new SuccessResponse('success', users).send(res);
  });

  private addUser = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const ownerId = Number(res.getHeader('user_id'));
    const body = sanitizeBody(addUsersModel, req.body);
    if (ownerId === body.userId) {
      return ApiError.handle(new BadRequestError('can not add your self to contributors.'), res);
    }
    // check if users already exist
    const user = await this.userDb.findUserById(body.userId);
    if (!user) {
      return ApiError.handle(new BadRequestError('incorrect user id.'), res);
    }
    // check if project exists
    const project = await this.projectDb.getProject(body.projectId, body.userId);
    if (!project) {
      return ApiError.handle(new BadRequestError('you can not add contributors to this project'), res);
    }
    // check id user don't have access to this project
    const userHaveAccess = await this.projectUserRelDb.userHaveAccess(body.userId, body.projectId);
    if (userHaveAccess) {
      return ApiError.handle(new BadRequestError('user already in contributors.'), res);
    }
    if (body.accessType == 1) {
      return ApiError.handle(new BadRequestError('can not give owner access to contributors.'), res);
    }
    const access = await this.accessDb.getAccessType(body.accessType);
    // give access to project
    await this.accessDb.addUser(body.userId, user, body.projectId, project.project, body.accessType, access!);
    new SuccessMsgResponse('success').send(res);
  });

  private removeUser = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const ownerId = Number(res.getHeader('user_id'));
    const body = sanitizeBody(removeUsersModel, req.body);
    if (ownerId === body.userId) {
      return ApiError.handle(new BadRequestError('can not remove your self.'), res);
    }
    // check if users already exist
    const user = await this.userDb.findUserById(body.userId);
    if (!user) {
      return ApiError.handle(new BadRequestError('incorrect user id.'), res);
    }
    // check if project exists
    const project = await this.projectDb.getProject(body.projectId, body.userId);
    if (!project) {
      return ApiError.handle(new BadRequestError('you can not add contributors to this project'), res);
    }
    // check id user don't have access to this project
    const userHaveAccess = await this.projectUserRelDb.userHaveAccess(body.userId, body.projectId);
    if (!userHaveAccess) {
      return ApiError.handle(new BadRequestError('user already not a contributor.'), res);
    }
    const removeUsers = await this.accessDb.removeUser(body.userId, body.projectId)
    new SuccessResponse('success', { userRemove: removeUsers }).send(res);
  });

  private updateAccess = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const ownerId = Number(res.getHeader('user_id'));
    const body = sanitizeBody(updateAccessModel, req.body);
    if (ownerId === body.userId) {
      return ApiError.handle(new BadRequestError('can not update your self access.'), res);
    }
    // check if users already exist
    const user = await this.userDb.findUserById(body.userId);
    if (!user) {
      return ApiError.handle(new BadRequestError('incorrect user id.'), res);
    }
    // check if project exists
    const project = await this.projectDb.getProject(body.projectId, body.userId);
    if (!project) {
      return ApiError.handle(new BadRequestError('you can not add contributors to this project'), res);
    }
    // check id user don't have access to this project
    const userHaveAccess = await this.projectUserRelDb.userHaveAccess(body.userId, body.projectId);
    if (!userHaveAccess) {
      return ApiError.handle(new BadRequestError('user not a contributor.'), res);
    }
    if (body.accessType == 1) {
      return ApiError.handle(new BadRequestError('can not give owner access to contributors.'), res);
    }
    const access = await this.accessDb.getAccessType(body.accessType);
    const updated = await this.accessDb.updateAccess(body.userId, body.projectId, body.accessType, access!)
    new SuccessResponse('success', {updated: updated}).send(res);
  });
}
