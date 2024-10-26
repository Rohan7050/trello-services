import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import { PostCallDto } from '../../database/repository/dummy/postCall/postCall.dto';
import { postCallModel } from '../../database/repository/dummy/postCall/postCall.model';
import Controller from '../../interfaces/controller.interface';
import sanitizeBody from '../../middlewares/sanitizeBody.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { BaseController } from '../BaseController';

export class DummyController extends BaseController implements Controller {
  public path = '/dummy';
  public router = express.Router();

  constructor() {
    super();

    this._initialiseRoutes();
  }

  private _initialiseRoutes = () => {
    this.router.get(`${this.path}/getCall`, this._getCall);
    this.router.post(`${this.path}/postCall`, validationMiddleware(PostCallDto), this._postCall);
  };

  private _getCall = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    new SuccessMsgResponse('success').send(res);
  });

  private _postCall = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    req.body = sanitizeBody(postCallModel, req.body);

    new SuccessResponse('success', req.body).send(res);
  });
}
