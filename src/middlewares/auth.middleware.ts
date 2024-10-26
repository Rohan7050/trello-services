import express from 'express';
import { ApiError, BadTokenError} from '../core/ApiError';
const jwt = require('jsonwebtoken');

const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // console.log('body', req.body)
  try {
    next();
  } catch (err) {
    // console.log(4, err);
    return ApiError.handle(new BadTokenError(), res);
  }
};

export default authMiddleware;
