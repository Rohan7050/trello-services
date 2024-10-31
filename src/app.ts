import cors from 'cors';
import cron from 'node-cron';
import express, { NextFunction, Request, Response } from 'express';
import useragent from 'express-useragent';
import helmet from 'helmet';
import moment from 'moment';
import { ENABLE_ENCRYPTION, NON_ENCRYPTION_ENDPOINTS, PATH, projectURL, SERVER_IPS, StatusCode } from './config';
import { ApiError, BadRequestError, CorsError, InternalError, MethodNotFoundError, NotFoundError } from './core/ApiError';
import { EncryptionAndDecryption } from './core/Encryption&Decryption';
import Database from './database/database';
import Controller from './interfaces/controller.interface';
import { CacheMiddleware } from './middlewares/cache.middleware';
// import { EmailService } from './utils/email/email.util';
import { errorTemplate } from './utils/email/templates/error.template'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig';

class App {
  public app: express.Application;
  public port: any;
  private pathList: any[] = [];
  private cacheMiddleware = new CacheMiddleware();
  private database = new Database();
  private CORS_ALLOWED_ENDPOINTS: string[] = [...SERVER_IPS.LOCAL, ...SERVER_IPS.DEV, ...SERVER_IPS.UAT, ...SERVER_IPS.PROD];

  constructor(controllers: Controller[], port: any) {
    this.app = express();
    this.port = port;
    this.CORS_ALLOWED_ENDPOINTS.push(`http://localhost:${this.port}`);
    this.CORS_ALLOWED_ENDPOINTS.push(`localhost:${this.port}`)
    // this.initializeRedis();
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    // this.initializeScheulders();
    this.initializeErrorHandling();
  }

  private initializeRedis() {
    this.cacheMiddleware.createRedisServer();
  }

  private initializeDatabase() {
    this.database.connectToPG();
  }

  private initializeMiddlewares() {
    this.app.use((req, res, next) => {
      res.setHeader('start', Date.now());
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
    });

    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

    this.app.use((req: Request, _: Response, next: NextFunction) => {
      req.headers.origin = req.headers.origin || req.headers.host;
      next();
    });

    const corsOptions: any = {
      origin: (origin: any, callback: Function) => {
        !origin || this.CORS_ALLOWED_ENDPOINTS.indexOf(origin) !== -1 ? callback(null, true) : callback(new CorsError());
      },
    };

    this.app.use(cors());

    this.app.use(helmet());
    this.app.use(useragent.express());


    this.app.use((req, res, next) => {
      console.log(req.params);
      if (ENABLE_ENCRYPTION === true && !NON_ENCRYPTION_ENDPOINTS.includes(req.url) && !req.headers['content-type']?.includes('multipart/form-data')) {
        if (req.method === 'POST') {
          const result = EncryptionAndDecryption.decryption(req.body.data);
          if (result === StatusCode.INVALID_ENCRYPTED_INPUT) {
            return ApiError.handle(new BadRequestError('Invalid Encrpted String'), res);
          } else {
            req.body = result;
          }
        }
      }
      next();
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      controller.router.stack.forEach((stack: any) => {
        const path: string = PATH + stack.route.path;
        this.pathList.push({ path: PATH + stack.route.path, method: `${stack.route.stack[0].method}`.toLocaleUpperCase() });
      });
      this.app.use(PATH, controller.router);
    });
  }

  private initializeScheulders() {
    // For Sending Bill on 1st of every month
    cron.schedule('* * */13 * * *', async function () {
      console.log('Function Called');
    });
  }

  private initializeErrorHandling() {
    // catch 404 and forward to error handler
    this.app.use((_req, res, _next) => {
      // catch 405 and forward to error handler
      for (let val of this.pathList) {
        if (_req.path === val.path && _req.method !== val.method) {
          return ApiError.handle(new MethodNotFoundError(), res);
        }
      }
      return ApiError.handle(new NotFoundError(), res);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof ApiError) {
        return ApiError.handle(err, res);
      } else {
        if (process.env.NODE_ENV !== 'production') {
          return res.status(500).send(err.message);
        }
        return ApiError.handle(new InternalError(), res);
      }
    });

    process.on('unhandledRejection', (error: any) => {
      if (error.code !== 'ERR_HTTP_HEADERS_SENT') {
        console.log('unhandledRejection', error.message);
        console.log('unhandledRejection', error.stack);
        const emailDetails = {
          projectName: 'NodeJS Base Template',
          projectURL,
          errorCode: error.code,
          errorTime: moment(new Date()).format('DD MMMM, YYYY hh:mm:ss A'),
          errorSummary: error.message,
          errorDetails: error.stack,
        };

        const emailObj = {
          email: 'rohanpagare7599@gmail.com',
          subject: 'Error in Code',
          html: errorTemplate(emailDetails),
        };

        // EmailService.sendEmail(emailObj);
      }
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
      console.log(`Swagger docs available at http://localhost:${this.port}/api-docs`);
    });
  }
}

export default App;
