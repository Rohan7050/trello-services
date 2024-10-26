export const DB_ENVIRONMENT: 'DEV' | 'UAT' | 'PROD' = 'UAT';
export const REDIS_HOST = '';
export const REDIS_PORT = '';
export const REDIS_PASSWORD = '';
export const DB_CONFIGS: any = {
  DEV: {
    POSTGRESS: {
      LOGS: {
        user: '',
        host: '',
        database: '',
        password: '',
        port: 5432,
      },
      DB: {
        user: '',
        host: '',
        database: '',
        password: '',
        port: 5432,
      },
    },
  },
  UAT: {
    POSTGRESS: {
      LOGS: {
        user: '',
        host: '',
        database: '',
        password: '',
        port: 5432,
      },
      DB: {
        user: '',
        host: '',
        database: '',
        password: '',
        port: 5432,
      },
    },
  },
  PROD: {
    POSTGRESS: {
      LOGS: {
        user: '',
        host: '',
        database: '',
        password: '',
        port: 5432,
      },
      DB: {
        user: '',
        host: '',
        database: '',
        password: '',
        port: 5432,
      },
    },
  },
};