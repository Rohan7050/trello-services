import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import Controller from '../../interfaces/controller.interface';
import sanitizeBody from '../../middlewares/sanitizeBody.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { BaseController } from '../BaseController';
import { ApiError, BadRequestError } from '../../core/ApiError';
import authMiddleware from '../../middlewares/auth.middleware';
import writeAccessMiddleware from '../../middlewares/writeAccess.middleware';
import { CardDB } from '../../database/repository/card/card.sp';
import { CardCreateDto } from '../../database/repository/card/create/create.dto';
import { CardUpdateDto } from '../../database/repository/card/update/update.dto';
import { TableDB } from '../../database/repository/table/table.sp';
import readAccessMiddleware from '../../middlewares/readAccess.middleware';
import { CardGetInfoDto } from '../../database/repository/card/getInfo/getInfo.dto';
import { cardGetInfoModel } from '../../database/repository/card/getInfo/getInfo.model';
import { cardCreateModel, CardCreateType } from '../../database/repository/card/create/create.model';
import { cardUpdateModel } from '../../database/repository/card/update/update.model';
import { CardUpdateOrderDto } from '../../database/repository/card/updateOrder/updateOrder.dto';
import { cardUpdateOrderModel } from '../../database/repository/card/updateOrder/updateOrder.model';

export class CardController extends BaseController implements Controller {
  public path = '/card';
  public router = express.Router();
  private cardDb: CardDB = new CardDB();
  private tableDb: TableDB = new TableDB();

  constructor() {
    super();
    this._initialiseRoutes();
  }

  private _initialiseRoutes = () => {
    this.router.post(`${this.path}/getInfo`, authMiddleware, validationMiddleware(CardGetInfoDto), readAccessMiddleware, this.getCardInfo);
    this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CardCreateDto), writeAccessMiddleware, this.createCard);
    this.router.put(`${this.path}/update`, authMiddleware, validationMiddleware(CardUpdateDto), writeAccessMiddleware, this.updateCard);
    this.router.put(`${this.path}/updateOrder`, authMiddleware, validationMiddleware(CardUpdateOrderDto), writeAccessMiddleware, this.changeOrder);
  };

  private getCardInfo = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const { cardId } = sanitizeBody(cardGetInfoModel, req.body);
    const card = await this.cardDb.getInfo(cardId);
    if (!card) {
      return ApiError.handle(new BadRequestError('incorrect card id.'), res);
    }
    new SuccessResponse('success', card).send(res);
  });

  private createCard = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const { projectId, tableId, title, order, desc, card_color, start_date, end_date } = sanitizeBody(cardCreateModel, req.body);
    const table = await this.tableDb.getTableInfoWithProject(tableId, projectId);
    if (!table) {
      return ApiError.handle(new BadRequestError('incorrect information.'), res);
    }
    const data: Partial<CardCreateType> = {
      table_id: tableId,
      title,
      order,
      desc,
      card_color,
    };
    if (start_date) {
      data.start_date = new Date(start_date);
    }
    if (end_date) {
      data.end_date = new Date(end_date);
    }
    const newCard = await this.cardDb.createCard(table, data);
    new SuccessResponse('success', newCard).send(res);
  });

  private updateCard = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const { projectId, tableId, cardId, title, order, desc, card_color, start_date, end_date } = sanitizeBody(cardUpdateModel, req.body);
    const table = await this.tableDb.getTableInfoWithProject(tableId, projectId);
    if (!table) {
      return ApiError.handle(new BadRequestError('incorrect information.'), res);
    }
    const data: Partial<CardCreateType> = {
      table_id: tableId,
      title,
      desc,
      card_color,
    };
    if (start_date) {
      data.start_date = new Date(start_date);
    }
    if (end_date) {
      data.end_date = new Date(end_date);
    }
    const newCard = await this.cardDb.updateCard(table, cardId, data);
    new SuccessResponse('success', newCard).send(res);
  });

  private changeOrder = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const { projectId, tableId, cardId, order } = sanitizeBody(cardUpdateOrderModel, req.body);
    const table = await this.tableDb.getTableInfoWithProject(tableId, projectId);
    if (!table) {
      return ApiError.handle(new BadRequestError('incorrect information.'), res);
    }
    const updateCard = await this.cardDb.updateCardOrder(table, tableId, cardId, order);
    new SuccessMsgResponse('success').send(res);
  });
}
