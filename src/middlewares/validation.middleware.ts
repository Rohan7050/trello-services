import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { ApiError, BadRequestError } from '../core/ApiError';
import { BadRequestResponseWithDetailMsg } from '../core/ApiResponse';

function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        let feilds = ''
        const detailMsg = errors.map((error: ValidationError) => {
          feilds += error.property + ', '
          return {
            [error.property]: Object.values(error.constraints).join('. ')
          };
        });
        let message = `please fill ${feilds}fields properly`
        return new BadRequestResponseWithDetailMsg(message, detailMsg).send(res);
      } else {
        next();
      }
    });
  };
}

export default validationMiddleware;
