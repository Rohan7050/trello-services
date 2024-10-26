import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { ApiError, BadRequestError } from '../core/ApiError';
import { BadRequestResponseWithDetailMsg } from '../core/ApiResponse';
import { EncryptionAndDecryption } from '../core/Encryption&Decryption';

function validationFDMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
  return (req, res, next) => {
    console.log('req.body from validator', req.body.data);
    const data = EncryptionAndDecryption.decryption(req.body.data);
    req.body.data = data;
    validate(plainToClass(type, data), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        let feilds = ''
        const detailMsg = errors.map((error: ValidationError) => {
          feilds += error.property + ', '
          return {
            [error.property]: Object.values(error.constraints).join('. ')
          };
        });
        let message = `please fill ${feilds}fields properly`
        console.log(feilds)
        return new BadRequestResponseWithDetailMsg(message, detailMsg).send(res);
      } else {
        next();
      }
    });
  };
}

export default validationFDMiddleware;
