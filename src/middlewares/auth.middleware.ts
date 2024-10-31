import express from 'express';
import { ApiError, AuthFailureError, BadTokenError} from '../core/ApiError';
import { verifyjwt, decodeJwt } from '../utils/jwt/jwt';
const jwt = require('jsonwebtoken');

const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const bearerToken = req.headers['authorization'];
    if(!bearerToken) {
      return ApiError.handle(new AuthFailureError("Unauthorized"), res)
    }
    const token = bearerToken.split(' ')[1];
    if(!verifyjwt(token)) {
      return ApiError.handle(new AuthFailureError("Unauthorized"), res);
    }
    const decryptTocke = decodeJwt(token);
    res.setHeader('user_id', decryptTocke.id);
    next();
  } catch (err) {
    // console.log(4, err);
    return ApiError.handle(new BadTokenError(), res);
  }
};

export default authMiddleware;
