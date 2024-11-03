import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import Controller from '../../interfaces/controller.interface';
import sanitizeBody from '../../middlewares/sanitizeBody.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { BaseController } from '../BaseController';
import { loginModel } from '../../database/repository/user/login/login.model';
import { registerModel } from '../../database/repository/user/register/register.model';
import { ApiError, BadRequestError } from '../../core/ApiError';
import { createjwt } from '../../utils/jwt/jwt';
import { RegisterDto } from '../../database/repository/user/register/register.dto';
import { LoginDto } from '../../database/repository/user/login/login.dto';
import { EncryptionAndDecryption } from '../../core/Encryption&Decryption';
import { UserDB } from '../../database/repository/user/user.sp';
import authMiddleware from '../../middlewares/auth.middleware';

export class UserController extends BaseController implements Controller {
  public path = '/user';
  public router = express.Router();
  private userdb: UserDB = new UserDB();

  constructor() {
    super();
    this._initialiseRoutes();
  }

  private _initialiseRoutes = () => {
    this.router.post(`${this.path}/register`, validationMiddleware(RegisterDto), this.registerUser);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.loginUser);
    this.router.get(`${this.path}/getUserInfo`, authMiddleware, this.getUserInfo);
  };

  private registerUser = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const body = sanitizeBody(registerModel, req.body);
    if (body.password !== body.confirmpassword) {
      return ApiError.handle(new BadRequestError('password and confrim password does not match'), res);
    }
    await this.userdb.registerUser(body);
    new SuccessMsgResponse('success').send(res);
  });

  private loginUser = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const { username, password } = sanitizeBody(loginModel, req.body);
    const user = await this.userdb.findUser({ username, password });
    if (!user) {
      return ApiError.handle(new BadRequestError('user does not exist'), res);
    }
    const isValidPassword = await EncryptionAndDecryption.saltCompare(password, user.password);
    if (!isValidPassword) {
      return ApiError.handle(new BadRequestError('incorrect password'), res);
    }
    const token = createjwt({ username: user.username, useremail: user.useremail, id: user.id });
    new SuccessResponse('success', { token: token }).send(res);
  });

  private getUserInfo = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    new SuccessResponse('success', { userInfo: 'info' }).send(res);
  });
}
