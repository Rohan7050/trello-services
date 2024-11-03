import express from 'express';
import { ApiError, AuthFailureError, BadTokenError } from '../core/ApiError';
import { verifyjwt, decodeJwt } from '../utils/jwt/jwt';
import { pgConnection } from '../database/data-source';
import { UserProjectRelEntity } from '../entities/userProjectRelEntity';
const jwt = require('jsonwebtoken');

const writeAccessMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userProjectRelRepository = pgConnection.getRepository(UserProjectRelEntity);
  try {
    const userId = Number(res.getHeader('user_id'));
    const { projectId } = req.body;
    const data = await userProjectRelRepository.findOneBy({ userid: userId, projectid: projectId });
    if (!data) {
      return ApiError.handle(new AuthFailureError('Unauthorized'), res);
    }
    if (data.accesstype == 3) {
      return ApiError.handle(new AuthFailureError('Unauthorized'), res);
    }
    next();
  } catch (err) {
    return ApiError.handle(new BadTokenError(), res);
  }
};

export default writeAccessMiddleware;
