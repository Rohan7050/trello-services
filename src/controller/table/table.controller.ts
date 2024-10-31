import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import Controller from '../../interfaces/controller.interface';
import sanitizeBody from '../../middlewares/sanitizeBody.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { BaseController } from '../BaseController';
import { loginModel } from '../../database/repository/user/login/login.model';
import { registerModel } from '../../database/repository/user/register/register.model';
import { ApiError, BadRequestError } from '../../core/ApiError';
import { UserEntity } from '../../entities/userEntity';
import { createjwt } from '../../utils/jwt/jwt';
import { RegisterDto } from '../../database/repository/user/register/register.dto';
import { LoginDto } from '../../database/repository/user/login/login.dto';
import { EncryptionAndDecryption } from '../../core/Encryption&Decryption';
import { UserDB } from '../../database/repository/user/user.sp';
import authMiddleware from '../../middlewares/auth.middleware';
import { TableCreateDto } from '../../database/repository/table/create/create.dto';
import { TableUpdateDto } from '../../database/repository/table/update/update.dto';
import { tableCreateModel } from '../../database/repository/table/create/create.modal';
import { tableUpdateModel } from '../../database/repository/table/update/update.model';
import { TableDB } from '../../database/repository/table/table.sp';
import writeAccessMiddleware from '../../middlewares/writeAccess.middleware';
import { ProjectDB } from '../../database/repository/project/project.sp';

export class TableController extends BaseController implements Controller {
  public path = '/table';
  public router = express.Router();
  private tabledb: TableDB = new TableDB();
  private projectdb: ProjectDB = new ProjectDB();

  constructor() {
    super();
    this._initialiseRoutes();
  }

  private _initialiseRoutes = () => {
    this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(TableCreateDto), writeAccessMiddleware,  this.createTable);
    this.router.post(`${this.path}/update`, authMiddleware, validationMiddleware(TableUpdateDto), writeAccessMiddleware, this.updateTable);
  };

  private createTable = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const {projectId, name} = sanitizeBody(tableCreateModel, req.body);
    const project = await this.projectdb.getProjectOnly(projectId);
    if(!project) {
      return ApiError.handle(new BadRequestError('project does not exist or is been deleted.'), res);
    }
    const newTable = await this.tabledb.createTable(project, projectId, name);
    new SuccessResponse('success', newTable).send(res);
  });

  private updateTable = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const {tableId, name} = sanitizeBody(tableUpdateModel, req.body);
    await this.tabledb.updateTable(tableId, name);
    new SuccessMsgResponse('success').send(res);
  });
}
