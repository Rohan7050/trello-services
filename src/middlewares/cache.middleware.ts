import express from 'express';
// @ts-ignore
import redis from 'redis';
import { cachingAPIs, PATH, REDIS_KEY_EXPIRY_TIME } from '../config';

import { ApiError, BadRequestError } from '../core/ApiError';

export class CacheMiddleware {
  static client: any;

  createRedisServer = () => {
    CacheMiddleware.client = redis.createClient();
    CacheMiddleware.client.on('error', (err: any) => console.log('Redis Client Error', err));
  };

  static setCache = (key: string, value: any) => {
    if (Object.values(cachingAPIs).includes(key)) {
      CacheMiddleware.client.setex(key, REDIS_KEY_EXPIRY_TIME, JSON.stringify(value));
    }
  };

  getCache = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let key = req.url.replace(PATH, '');
    CacheMiddleware.client.get(key, (error: any, data: any) => {
      if (error) return ApiError.handle(new BadRequestError(error.message), res);
      if (data !== null) res.status(200).send(JSON.parse(data));
      else next();
    });
  };
}
